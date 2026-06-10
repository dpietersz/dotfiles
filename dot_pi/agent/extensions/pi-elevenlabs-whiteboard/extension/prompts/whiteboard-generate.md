Generate a clear architecture diagram on the whiteboard for the user's request.

Process:
1. Identify the distinct components (services, APIs, databases, queues, external
   systems). Keep it to the smallest set that tells the story.
2. Create each component with whiteboard_add_shape, choosing a `kind` that fits
   (service, api, database, queue, external, component, decision, note) and a
   short, specific `title`. Add a one-line `summary` describing its role.
3. Connect components with whiteboard_add_arrow using the returned semantic ids.
   Label each arrow with the protocol or relationship (for example
   "HTTPS SSE", "reads", "publishes").
4. Keep the layout readable: left-to-right or top-to-bottom flow.

Finish with one spoken sentence summarizing the diagram.
