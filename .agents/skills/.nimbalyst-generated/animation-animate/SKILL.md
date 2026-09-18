---
name: "animation-animate"
description: "Create an animated explainer diagram (.anim.json) for a system, protocol, or process"
user-invocable: true
---

# animate

Generated from legacy-claude-plugin.

Use this when the user explicitly invokes `/animation-animate` or requests the "animate" workflow.

Important: treat the text after `/animation-animate` as the command arguments. Use those arguments anywhere the original Claude command expects its argument placeholder.

Follow this workflow:

Create an animated explainer diagram for: the user's command arguments

Follow the `animation` skill for the full `.anim.json` format reference, geometry rules, and canonical key order. This command is the workflow on top of it.

## 1. Decide whether it should move

An animation earns its place only if something **changes over time**. If the first frame and the last frame say the same thing, stop and tell the user a static diagram (Excalidraw, or a Mermaid block in Markdown) is the better tool, and offer to build that instead.

Good subjects: a request crossing a network, a cache filling, a consensus round, a queue draining, a build pipeline, a retry after a failure.

## 2. Understand the subject before drawing it

If the subject is **in this codebase**, read it first. Spawn an `Explore` agent for the relevant files rather than pulling twenty of them into context. You need: the real component names, the real order of operations, and where it can fail.

If the subject is general knowledge, say what you are about to depict in one paragraph and let the user correct it before you spend effort on coordinates.

## 3. Write the captions first

Before placing a single coordinate, draft 8-12 one-sentence captions in order. Read them end to end -- they should form a coherent paragraph. This is the animation. If the captions do not tell the story, no amount of layout will save it.

Include the interesting beat. The retry, the cache miss, the rejected review. An explainer that only shows the happy path explains nothing.

## 4. Lay out the scene

- Default stage `1200 x 640`, `fps` 25, no `background` override (so it follows the user's theme).
- Place nodes on a grid: aligned tops and bottoms, equal gutters, flow left-to-right or top-to-bottom.
- Size each node to its rows: `h = 32 × rows + 80` with a subtitle, `+ 64` without. A row that overflows is silently dropped.
- Add a header (title label + caps subtitle) and a bottom rail of caps labels that light in sequence.
- Edges last, and **only between adjacent boxes** -- a diagonal across a grid runs straight through whatever is in between. Leave ~40px of gap for a bare edge, ~70px if it carries `text`.

## 5. Write the steps as deltas

States are cumulative: assert only what changes, and explicitly set things back to `idle` when they are done. Keep tone meanings fixed for the whole run. 600-1200ms per step.

## 6. Write the file in canonical order

Parts sorted alphabetically by id, keys in the fixed order the skill lists, two-space indent, trailing newline. Otherwise the first save in the editor reformats everything and buries the real diff.

Name it in kebab-case with the `.anim.json` extension: `cache-read-through.anim.json`, `consensus-round.anim.json`. Put it next to related docs, or in `nimbalyst-local/` if it is a scratch explainer.

## 7. Look at it -- do not skip this

Open the file in Nimbalyst and capture the stage with `mcp__nimbalyst__capture_editor_screenshot`. Scrub to at least three different steps (early, the failure beat, the last) and capture each.

Coordinate arithmetic is exactly the kind of thing that is right in your head and wrong on screen. Check for:

- dead space under a node's last row (`h` too large) or a missing row (`h` too small)
- an edge label plate punching through a card
- an edge crossing a card it should route around
- too much lit at once, especially in the final frame
- a step you cannot read in the time it holds

Fix and re-capture until it looks right. Then tell the user what it shows and what you could not express -- text never changes across steps, parts never move, and there are no font sizes, so say so plainly if the subject wanted one of those.

## 8. Offer the export

If they want it outside Nimbalyst, ask where it is going and pick accordingly:

- **A web page, docs, anywhere that renders HTML** -> `animation.export_html`. Instant, sharp, a few tens of kilobytes.
- **A GitHub issue, README, chat message, slide** -> `animation.export_gif`. Recording plays the animation in real time, so it takes as long as the animation runs, and the file is much larger. Keep `fps` around 8-12 and `maxWidth` at 720 unless they ask otherwise.

Default to HTML when either would work. There is no video export -- say so plainly rather than implying the GIF is a substitute.

## Error handling

- **No subject given**: ask what they want animated, and what the interesting failure or turning point is.
- **Subject does not change over time**: say so and offer a static diagram instead.
- **Subject needs changing numbers**: text is static in this format. Offer to show the quantity with a grid of shapes that empties instead, and confirm before building it.
- **More than ~12 steps of material**: offer to split it into two animations rather than one that nobody can follow.
