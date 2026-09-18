---
name: "canvas-canvas"
description: "Author Nimbalyst Project Canvas boards (.canvas files) — an infinite canvas whose cards are live editors for real workspace files and shared documents, arranged spatially and wired with edges. Use when the user asks for a canvas, a board, a spatial layout of documents or mockups, a flow of screens, or a workspace overview."
user-invocable: true
---

# canvas

Generated from legacy-claude-plugin.

Use this when the user explicitly invokes `/canvas-canvas` or when the workflow fits implicitly.

# Project Canvas

A `.canvas` file is a board: an infinite canvas whose cards can be sticky notes, text, images, frames, or **live editors mounted on real workspace files and shared documents**. A mockup card renders the mockup. A spreadsheet card renders the grid. A mindmap card renders the mindmap.

The editor is built into Nimbalyst, so any workspace can open a `.canvas` file you write. Write the JSON directly with the Write tool; there is no MCP tool for boards.

## When to use a canvas

- Laying out several existing files spatially — screens of a flow, docs in a workstream, a review board
- A workspace or project overview that mixes documents, mockups, data, and notes
- Anything where the point is the *arrangement* of real artifacts, not a drawing

Use Excalidraw for freeform drawings and architecture sketches. Use MockupLM for a single UI screen. A canvas is the thing that holds several of those at once.

## File format

JSON Canvas 1.0 superset. Every spec field keeps its spec meaning, Nimbalyst data lives under `x-nimbalyst`, and unknown keys at any level are preserved verbatim so a board written by another tool survives a round-trip.

```json
{
  "nodes": [],
  "edges": [],
  "x-nimbalyst": {
    "version": 1,
    "meta": {
      "name": "Onboarding flow",
      "description": "Sign-up through first document",
      "viewport": { "x": 0, "y": 0, "zoom": 1 }
    }
  }
}
```

`meta.viewport` is the board's deliberate **home view** — where a reader lands on open. Each user's own scroll position is stored separately, so setting this is a choice about the board, not about you. Omit it and the board opens fit-to-content.

### Nodes

Every node needs `id` (unique, non-empty), `type`, and `x` / `y` / `width` / `height`. Geometry is written as integers; the editor rounds on save either way.

| `type` | Required payload | Notes |
| --- | --- | --- |
| `text` | `text` | Plain text, **not** markdown |
| `file` | `file` | Workspace-relative path |
| `link` | `url` | Also carries shared-document URIs |
| `group` | — | Optional `label`, `background`, `backgroundStyle` |

`color` is optional on nodes and edges: the presets `"1"` red, `"2"` orange, `"3"` yellow, `"4"` green, `"5"` cyan, `"6"` purple, or any `#rrggbb`. Anything else is ignored.

**Array order is z-order.** The last node in `nodes` paints on top — put a frame *before* the cards that sit inside it. Do not invent a z-index or rank field; the editor derives ordering from array position and never writes one to the file.

### Serialization is canonical, not preserved

On save the editor rewrites keys into a fixed order, sorts `edges` by `id`, and rounds geometry. Your key ordering and edge ordering will change the first time someone opens the board. That is expected — write it readably and let the editor normalize.

## Cards

What a card *draws as* is decided by `x-nimbalyst.reference`, not by the spec `type`. The spec `type` is chosen so a plain JSON Canvas reader still shows something true. Always write both.

`x-nimbalyst.label` sets the card's label.

### File card — mounts the real editor

```json
{
  "id": "login",
  "type": "file",
  "x": 0,
  "y": 0,
  "width": 640,
  "height": 440,
  "file": "design/mockups/login.mockup.html",
  "x-nimbalyst": {
    "reference": { "kind": "file", "path": "design/mockups/login.mockup.html" },
    "label": "Login"
  }
}
```

The path is workspace-relative and must appear in **both** `file` and `reference.path`. Any file type with a registered editor works — `.mockup.html`, `.mindmap`, `.excalidraw`, `.csv`, `.md`, and so on. The card mounts that editor live; it is not a screenshot.

Point a file card at a file that exists. A card for a missing path renders as an unresolved placeholder.

### Doc card — a shared document

```json
{
  "id": "prd",
  "type": "link",
  "x": 700,
  "y": 0,
  "width": 640,
  "height": 440,
  "url": "nimbalyst://doc/{orgId}/{documentId}",
  "x-nimbalyst": {
    "reference": { "kind": "doc", "uri": "nimbalyst://doc/{orgId}/{documentId}" },
    "label": "Product brief"
  }
}
```

Only write a doc card when you have a real org and document id. Do not guess them — prefer a `file` card.

### Native cards

`reference.kind: "native"` with a `nativeKind`, paired with the spec type below:

| `nativeKind` | Spec `type` | Payload | Default size |
| --- | --- | --- | --- |
| `sticky` | `text` | `text`, conventionally `"color": "5"` | 240 × 180 |
| `text` | `text` | `text` | 320 × 200 |
| `image` | `link` | `url` | 360 × 260 |
| `group` | `group` | `label` | 640 × 440 |

```json
{
  "id": "note-open-question",
  "type": "text",
  "x": -260,
  "y": 0,
  "width": 240,
  "height": 180,
  "color": "5",
  "text": "Do we verify email before or after the first document?",
  "x-nimbalyst": { "reference": { "kind": "native", "nativeKind": "sticky" } }
}
```

A node with no `x-nimbalyst.reference` still renders — it falls back to its spec `type`, which is what makes a board from another tool useful rather than a wall of placeholders. Writing the reference is what gets you a sticky note instead of a plain text card.

A node whose `type` is outside the spec renders as an "unsupported card" placeholder and is written back untouched. Never use that as a way to smuggle in data.

## Layout

- **Snap to the 20px grid.** Every `x`, `y`, `width`, `height` should be a multiple of 20. The editor snaps on drag, so an off-grid board shifts the first time someone touches it.
- **Use the default sizes above** unless you have a reason. Reference cards default to 640 × 440 — big enough that the editor inside is legible without a resize.
- **Leave 60–100px of gutter** between cards. Cards have toolbars above, comment badges to the right, and presence chips below; touching cards make all three collide.
- **Lay flows left-to-right, branches top-to-bottom.** Read order is the layout's job.
- **Frames are plain rectangles.** There is no `parentId` and children keep absolute coordinates. A frame does capture the nodes geometrically inside it when dragged, so size it to genuinely contain them, and put it earlier in `nodes` so it paints behind.
- **Give the board a `meta.name`.** It is what the board is called in listings.

## Edges

```json
{
  "id": "login-to-dashboard",
  "fromNode": "login",
  "fromSide": "right",
  "toNode": "dashboard",
  "toSide": "left",
  "label": "Sign in",
  "color": "4"
}
```

`id`, `fromNode`, and `toNode` are required and the node ids must exist. `fromSide` / `toSide` are `top` | `right` | `bottom` | `left`. `fromEnd` / `toEnd` are `none` | `arrow`; omitted, you get the spec default of plain at the source and an arrow at the target, which is almost always what you want.

Edges render as smooth-step arrows with an optional centered `label`. Set `fromSide` / `toSide` deliberately — an edge left to route itself between two cards on the same row will loop around them.

`x-nimbalyst.flow` (`kind: "flow"`, with `fromElementSelector` and `trigger`) is defined on the edge and preserved through save, but the editor does not yet act on it. Do not describe a board as a click-through prototype on the strength of it.

## Worked example

An onboarding flow: three mockup screens wired left to right, a frame around them, and a sticky note holding an open question.

```json
{
  "nodes": [
    {
      "id": "frame-flow",
      "type": "group",
      "x": -60,
      "y": -100,
      "width": 2180,
      "height": 640,
      "label": "Onboarding",
      "x-nimbalyst": { "reference": { "kind": "native", "nativeKind": "group" } }
    },
    {
      "id": "signup",
      "type": "file",
      "x": 0,
      "y": 0,
      "width": 640,
      "height": 440,
      "file": "design/mockups/signup.mockup.html",
      "x-nimbalyst": {
        "reference": { "kind": "file", "path": "design/mockups/signup.mockup.html" },
        "label": "Sign up"
      }
    },
    {
      "id": "verify",
      "type": "file",
      "x": 740,
      "y": 0,
      "width": 640,
      "height": 440,
      "file": "design/mockups/verify.mockup.html",
      "x-nimbalyst": {
        "reference": { "kind": "file", "path": "design/mockups/verify.mockup.html" },
        "label": "Verify email"
      }
    },
    {
      "id": "first-doc",
      "type": "file",
      "x": 1480,
      "y": 0,
      "width": 640,
      "height": 440,
      "file": "design/mockups/first-document.mockup.html",
      "x-nimbalyst": {
        "reference": { "kind": "file", "path": "design/mockups/first-document.mockup.html" },
        "label": "First document"
      }
    },
    {
      "id": "note-question",
      "type": "text",
      "x": 740,
      "y": 600,
      "width": 240,
      "height": 180,
      "color": "5",
      "text": "Can verification be deferred until the first share?",
      "x-nimbalyst": { "reference": { "kind": "native", "nativeKind": "sticky" } }
    }
  ],
  "edges": [
    {
      "id": "signup-verify",
      "fromNode": "signup",
      "fromSide": "right",
      "toNode": "verify",
      "toSide": "left",
      "label": "Submit"
    },
    {
      "id": "verify-first-doc",
      "fromNode": "verify",
      "fromSide": "right",
      "toNode": "first-doc",
      "toSide": "left",
      "label": "Confirmed"
    },
    {
      "id": "verify-question",
      "fromNode": "note-question",
      "fromSide": "top",
      "toNode": "verify",
      "toSide": "bottom",
      "toEnd": "none",
      "color": "5"
    }
  ],
  "x-nimbalyst": {
    "version": 1,
    "meta": {
      "name": "Onboarding flow",
      "description": "Sign-up through the user's first document"
    }
  }
}
```

## Checklist before you write the file

- Every `id` unique, every `fromNode` / `toNode` resolving to a real node
- Every file card's path exists in the workspace, and matches in both `file` and `reference.path`
- Geometry on the 20px grid, no overlapping cards, gutters left for toolbars
- Frames earlier in `nodes` than the cards they contain
- `x-nimbalyst.meta.name` set
