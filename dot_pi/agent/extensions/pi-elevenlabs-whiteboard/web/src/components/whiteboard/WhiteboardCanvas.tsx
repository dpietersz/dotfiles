import { useCallback, useEffect, useRef } from "react";
import { Excalidraw, exportToBlob, restore } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { HubApi, SceneEvent, ExportRequestEvent } from "@/hooks/useHub";

type ExportScope = "selected" | "viewport" | "all";

interface Props {
  hub: HubApi;
  sessionId: string | null;
  theme: "dark" | "light";
  /** Headless render mode for Playwright snapshots (?render=<session>). */
  renderMode?: boolean;
  renderScope?: ExportScope;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error ?? new Error("read failed"));
    fr.readAsDataURL(blob);
  });
}

function isElementInViewport(element: unknown, appState: Record<string, unknown>): boolean {
  const el = element as { x?: number; y?: number; width?: number; height?: number; points?: [number, number][] };
  const zoomRaw = appState.zoom as { value?: number } | number | undefined;
  const zoom = typeof zoomRaw === "number" ? zoomRaw : (zoomRaw?.value ?? 1);
  const scrollX = (appState.scrollX as number) ?? 0;
  const scrollY = (appState.scrollY as number) ?? 0;
  const viewW = window.innerWidth / zoom;
  const viewH = window.innerHeight / zoom;
  const vx1 = -scrollX;
  const vy1 = -scrollY;
  const vx2 = vx1 + viewW;
  const vy2 = vy1 + viewH;
  let minX = el.x ?? 0;
  let minY = el.y ?? 0;
  let maxX = minX + (el.width ?? 0);
  let maxY = minY + (el.height ?? 0);
  if (el.points?.length) {
    const xs = el.points.map((p) => (el.x ?? 0) + p[0]);
    const ys = el.points.map((p) => (el.y ?? 0) + p[1]);
    minX = Math.min(minX, ...xs);
    maxX = Math.max(maxX, ...xs);
    minY = Math.min(minY, ...ys);
    maxY = Math.max(maxY, ...ys);
  }
  return maxX >= vx1 && minX <= vx2 && maxY >= vy1 && minY <= vy2;
}

export function WhiteboardCanvas({ hub, sessionId, theme, renderMode, renderScope = "all" }: Props) {
  // Stable callbacks (useHub returns a new wrapper object each render).
  const { send, setHandlers, connected } = hub;

  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const pendingSceneRef = useRef<{ sessionId: string | null; scene: unknown } | null>(null);
  const applyingRef = useRef(false);
  const lastSentVersionRef = useRef<number>(-1);
  const lastAppliedRevisionRef = useRef<string | null>(null);
  // Only push local edits after the server's baseline scene has been applied,
  // so the initial empty canvas can never clobber existing server state.
  const readyToSendRef = useRef(false);
  const sendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionRef = useRef<string | null>(sessionId);
  sessionRef.current = sessionId;

  const applyScene = useCallback((scene: unknown, sceneSessionId: string | null = sessionRef.current): boolean => {
    const exApi = apiRef.current;
    if (!exApi) {
      // API not mounted yet — buffer and apply once it is ready.
      pendingSceneRef.current = { sessionId: sceneSessionId, scene };
      return false;
    }
    if (sceneSessionId !== sessionRef.current) return false;
    const restored = restore(scene as Parameters<typeof restore>[0], null, null);
    applyingRef.current = true;
    exApi.updateScene({ elements: restored.elements });
    if (restored.files && Object.keys(restored.files).length) {
      exApi.addFiles(Object.values(restored.files));
    }
    // Clear the guard after Excalidraw flushes its onChange for this update.
    setTimeout(() => {
      applyingRef.current = false;
    }, 200);
    return true;
  }, []);

  // Export the current canvas to a PNG data URL.
  const exportPng = useCallback(
    async (scope: ExportScope): Promise<string> => {
      const exApi = apiRef.current;
      if (!exApi) throw new Error("canvas not ready");
      const appState = exApi.getAppState();
      let elements = exApi.getSceneElements();
      if (scope === "selected") {
        const selected = appState.selectedElementIds;
        const sel = elements.filter((e) => selected[e.id]);
        if (sel.length) elements = sel;
      } else if (scope === "viewport") {
        const visible = elements.filter((e) => isElementInViewport(e, appState));
        if (visible.length) elements = visible;
      }
      const blob = await exportToBlob({
        elements,
        appState: { ...appState, exportBackground: true, viewBackgroundColor: theme === "dark" ? "#282828" : "#fbf1c7" },
        files: exApi.getFiles(),
        mimeType: "image/png",
        maxWidthOrHeight: 2000,
        exportPadding: 24,
      });
      return blobToDataUrl(blob);
    },
    [theme],
  );

  // Register hub handlers for agent scene updates + snapshot export requests.
  // Render mode reuses the same WS scene-application path (proven reliable).
  useEffect(() => {
    setHandlers({
      onScene: (e: SceneEvent) => {
        if (sessionRef.current && e.sessionId !== sessionRef.current) return;
        // Apply all new revisions (agent edits and remote dashboard user edits).
        if (e.revisionId === lastAppliedRevisionRef.current) return;
        lastAppliedRevisionRef.current = e.revisionId;
        if (applyScene(e.scene, e.sessionId)) {
          // Baseline established — local edits may now be pushed.
          readyToSendRef.current = true;
        }
      },
      onExportRequest: async (e: ExportRequestEvent) => {
        if (e.sessionId !== sessionRef.current) return;
        try {
          const dataUrl = await exportPng(e.scope);
          send({ type: "whiteboard.exportResult", requestId: e.requestId, ok: true, dataUrl });
        } catch (err) {
          send({
            type: "whiteboard.exportResult",
            requestId: e.requestId,
            ok: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      },
    });
  }, [setHandlers, send, applyScene, exportPng]);

  // Subscribe to the active session's scene on change / (re)connect.
  useEffect(() => {
    pendingSceneRef.current = null;
    if (!sessionId || !connected) return;
    lastAppliedRevisionRef.current = null;
    readyToSendRef.current = false;
    send({ type: "subscribe", sessionId });
  }, [send, sessionId, connected]);

  // Headless render mode: expose the exporter for Playwright and frame content.
  useEffect(() => {
    if (!renderMode) return;
    (window as unknown as { __piwbExportPNG?: () => Promise<string> }).__piwbExportPNG = () =>
      exportPng(renderScope);
    const t = setInterval(() => {
      const exApi = apiRef.current;
      if (exApi && exApi.getSceneElements().length > 0) {
        exApi.scrollToContent(undefined, { fitToContent: true });
        clearInterval(t);
      }
    }, 200);
    const stop = setTimeout(() => clearInterval(t), 6000);
    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  }, [renderMode, renderScope, exportPng]);

  const onChange = useCallback(
    (elements: readonly unknown[], appState: Record<string, unknown>, files: unknown) => {
      if (renderMode || applyingRef.current || !readyToSendRef.current) return;
      const exApi = apiRef.current;
      if (!exApi || !sessionRef.current) return;
      // getSceneVersion is cheap; only send when the content actually changed.
      const version = (elements as { version?: number }[]).reduce(
        (acc, el) => acc + (el.version ?? 0),
        elements.length,
      );
      if (version === lastSentVersionRef.current) return;
      lastSentVersionRef.current = version;
      if (sendTimer.current) clearTimeout(sendTimer.current);
      sendTimer.current = setTimeout(() => {
        const sel = (appState.selectedElementIds as Record<string, boolean>) ?? {};
        const zoomRaw = appState.zoom as { value?: number } | number | undefined;
        const zoom = typeof zoomRaw === "number" ? zoomRaw : (zoomRaw?.value ?? 1);
        send({
          type: "whiteboard.changed",
          sessionId: sessionRef.current!,
          scene: { type: "excalidraw", version: 2, source: "dashboard", elements, appState, files },
          selected: Object.keys(sel).filter((k) => sel[k]),
          viewport: {
            x: (appState.scrollX as number) ?? 0,
            y: (appState.scrollY as number) ?? 0,
            zoom,
          },
        });
      }, 350);
    },
    [send, renderMode],
  );

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(exApi) => {
          apiRef.current = exApi;
          if (pendingSceneRef.current != null && pendingSceneRef.current.sessionId === sessionRef.current) {
            const pending = pendingSceneRef.current;
            pendingSceneRef.current = null;
            if (applyScene(pending.scene, pending.sessionId)) {
              readyToSendRef.current = true;
              if (renderMode) {
                setTimeout(() => exApi.scrollToContent(undefined, { fitToContent: true }), 50);
              }
            }
          }
        }}
        theme={theme}
        onChange={onChange as never}
        initialData={{ appState: { viewBackgroundColor: theme === "dark" ? "#282828" : "#fbf1c7" } }}
      />
    </div>
  );
}
