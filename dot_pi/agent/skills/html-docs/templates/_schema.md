# `.doc.html` Template Schema

Templates are HTML-native blueprints with YAML frontmatter and an HTML body. The frontmatter is used for lazy routing. The body is loaded only after selection.

## Required Frontmatter

```yaml
---
id: unique-kebab-id
name: Human Name
description: One sentence artifact purpose.
diataxis: [tutorial|how-to|reference|explanation]
use_when:
  - Trigger phrase or scenario
avoid_when:
  - Scenario where another template is better
required_inputs:
  - Input required for useful output
recommended_inputs:
  - Input that improves quality
clarifying_questions:
  - High-leverage question
output_path_pattern: docs/{slug}.html
visual_policy: none|optional|strategic|required
image_slots:
  - id: hero
    required: false|true|when_condition
    purpose: Why this image exists
    suggested_prompt_focus: What to depict
    max_text_labels: 8
status: active
---
```

## Body Rules

- Body is HTML fragment, not full document shell unless needed.
- Use Tailwind component classes from `html-authoring.md`: `doc-hero`, `doc-section`, `doc-section-title`, `doc-card`, `doc-grid`, `doc-figure`, `doc-figcaption`, `doc-table`, `doc-prose`, `doc-callout`.
- Use placeholders like `{{title}}`, `{{summary}}`, `{{asset_path}}`.
- Include `data-doc-template` and `data-doc-part` attributes.
- Include image slots with `data-image-slot` where useful.
- Include template-specific quality checks near bottom in comments or visible checklist.

## Generated Document Rule

Final generated docs must be valid HTML and must not include YAML frontmatter. Move metadata into `<meta>` tags and the JSON block.
