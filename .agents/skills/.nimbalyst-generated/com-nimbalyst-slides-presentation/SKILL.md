---
name: "com-nimbalyst-slides-presentation"
description: "Create or edit a presentation deck"
user-invocable: true
---

# presentation

Generated from legacy-claude-plugin.

Use this when the user explicitly invokes `/com-nimbalyst-slides-presentation` or requests the "presentation" workflow.

Important: treat the text after `/com-nimbalyst-slides-presentation` as the command arguments. Use those arguments anywhere the original Claude command expects its argument placeholder.

Follow this workflow:

# /presentation

Create or edit a `.slides.md` presentation file using the Nimbalyst Slides extension.

The user said: the user's command arguments

## Instructions

1. Create or edit a `.slides.md` file directly:
   - YAML frontmatter (`theme`, `transition`)
   - Slides separated by `---` on its own line
   - Use markdown for content (headings, bullets, images, code blocks)

2. Format:
   ```
   ---
   theme: moon
   transition: slide
   ---

   # Title Slide

   ---

   ## Topic

   - Bullets here
   ```

3. Available themes: black, white, league, beige, night, moon, serif, simple, sky, solarized, blood, dracula

4. Reveal.js features:
   - Fragments: `<!-- .element: class="fragment" -->` after an element
   - Slide backgrounds: `<!-- .slide: data-background="#hex" -->` at slide start
   - Background images: `<!-- .slide: data-background-image="./path.png" -->`
   - Speaker notes: `Note:` followed by text at the end of a slide
   - Code blocks with syntax highlighting: standard markdown fenced code blocks

5. After creating/editing, use `capture_editor_screenshot` to preview the result.
