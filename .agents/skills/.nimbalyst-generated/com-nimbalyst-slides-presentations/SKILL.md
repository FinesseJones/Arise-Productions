---
name: "com-nimbalyst-slides-presentations"
description: "Help users create and edit .slides.md presentations using the Nimbalyst Slides extension. Activate when the user wants to create a slideshow, presentation, pitch deck, or slide deck."
user-invocable: true
---

# presentations

Generated from legacy-claude-plugin.

Use this when the user explicitly invokes `/com-nimbalyst-slides-presentations` or when the workflow fits implicitly.

# Nimbalyst Slides Skill

## File Format

Presentations use `.slides.md` files -- markdown with YAML frontmatter and `---` slide separators. Edit them directly with standard file tools (Read, Write, Edit).

```markdown
---
theme: black
transition: slide
---

# Title Slide

Subtitle text

---

## Second Slide

- Bullet points
- More content
```

## Themes

Set in the YAML frontmatter. Available: `black`, `white`, `league`, `beige`, `night`, `moon`, `serif`, `simple`, `sky`, `solarized`, `blood`, `dracula`

## Reveal.js Features

- **Fragments**: `<!-- .element: class="fragment" -->` for progressive reveal
- **Backgrounds**: `<!-- .slide: data-background="#1a1a2e" -->` for custom slide backgrounds
- **Background images**: `<!-- .slide: data-background-image="./image.png" -->`
- **Speaker notes**: Add `Note:` on its own line, followed by notes text
- **Code blocks**: Standard markdown fenced code blocks with syntax highlighting
- **Vertical slides**: Use `--` separator instead of `---`

## Workflow

1. Create or edit a `.slides.md` file directly using Write/Edit tools
2. Use `capture_editor_screenshot` to preview the rendered result
3. Iterate based on feedback
