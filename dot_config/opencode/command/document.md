---
description: Generate comprehensive documentation using the document-writer sub-agent.
---

Use the @document-writer sub-agent to create clear, comprehensive documentation for:

$ARGUMENTS

The document-writer will:
1. Study the existing code patterns, API signatures, and architecture before writing
2. Match the existing documentation style and conventions
3. Verify all code examples actually work
4. Create documentation that developers actually want to read

Specify the documentation type if relevant:
- README: Installation, usage, API reference, contributing guide
- API docs: Endpoints, parameters, request/response examples, error codes
- Architecture docs: Overview, components, data flow, design decisions
- User guide: Prerequisites, step-by-step tutorials, troubleshooting
