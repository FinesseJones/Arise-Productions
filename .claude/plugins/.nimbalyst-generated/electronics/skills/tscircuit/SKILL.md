---
name: tscircuit
description: Author and revise tscircuit React/TypeScript circuit designs using canonical syntax, built-in elements, layout, wiring, workflow, checklists, and templates. Use when an agent works on .circuit.tsx files in Electronics Studio and needs upstream tscircuit authoring guidance.
---

# tscircuit authoring guidance

Use the pinned upstream references in this directory for tscircuit syntax, elements, layout, wiring, workflow, and templates. Start with [UPSTREAM_SKILL.md](UPSTREAM_SKILL.md), then open only the references relevant to the circuit being authored.

This skill guides tscircuit syntax, elements, and authoring workflow only. Electronics Studio's registered editor tools are the sole authority for live mutation, preview and approval, simulation, and export. Guidance text does not grant tool or file access.

The upstream skill also describes the standalone `tsci` CLI. Electronics Studio deliberately does not embed that CLI, so CLI-specific commands, linked `CLI.md`, and linked helper scripts are not applicable here; use the registered Electronics Studio editor tools instead.

- Read [SYNTAX.md](SYNTAX.md) for JSX and connectivity patterns.
- Read [WORKFLOW.md](WORKFLOW.md) for upstream design workflow guidance, applying the authority boundary above.
- Read [CHECKLIST.md](CHECKLIST.md) as authoring guidance; perform live checks, simulation, and export through Electronics Studio tools.
- Read `elements/` for element-specific guidance and use `templates/` as authoring examples.
- Read [UPSTREAM.md](UPSTREAM.md) for the exact upstream pin, license, and vendored-file inventory.
