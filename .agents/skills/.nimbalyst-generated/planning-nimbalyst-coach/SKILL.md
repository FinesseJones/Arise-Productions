---
name: "planning-nimbalyst-coach"
description: "Audit this project and your recent sessions, then recommend extensions, features, and agent-instruction changes that would make Nimbalyst work better for you"
user-invocable: true
---

# nimbalyst-coach

Generated from legacy-claude-plugin.

Use this when the user explicitly invokes `/planning-nimbalyst-coach` or requests the "nimbalyst-coach" workflow.

Important: treat the text after `/planning-nimbalyst-coach` as the command arguments. Use those arguments anywhere the original Claude command expects its argument placeholder.

Follow this workflow:

# /planning:nimbalyst-coach Command

Read this project and the user's recent AI sessions, compare both against the catalog below, and report where they are working *around* Nimbalyst instead of *with* it. **Read-only until the report is finished**, then offer the instruction edits for approval.

Argument: `[current | workstream | <count> | <time-window> | all]`

- none -> project scan + the 15 most recent non-archived sessions
- `current` -> project scan + this session only; label every finding as a one-session observation
- `workstream` -> the current workstream's sessions, or this session if it has no workstream
- `20` / `3d` / `1w` -> that many sessions or that window, capped at 30
- `all` -> workspace-wide, still capped at 30

Always exclude this coaching session from the evidence.

## The rule that matters most

**Every finding in the evidence tier cites something real** -- a session title, a user quote, a file that exists, a count from a scan. If you cannot cite it, it belongs in the "may not be using" tail, clearly marked as *unused, no evidence*, or nowhere at all. Padding the evidence tier with plausible-sounding best practice is how this command loses the user's trust on its first run, and they only run it once.

Second rule: **never propose something the user already wrote.** Step 1 exists entirely to prevent that.

## Step 1 -- read what already exists

Before forming any finding, read the harness that is already here:

- `CLAUDE.md`, `AGENTS.md` at the workspace root, and any `@`-imported files they reference
- `.claude/rules/*.md`, `.claude/commands/*.md`, `.claude/settings.json` (hooks, `permissions.allow`)
- `.mcp.json`, `.nimbalyst/trackers/*.yaml`, `.gitignore`
- the user-level config root -- `CLAUDE_CONFIG_DIR` if set, else `~/.claude` -- for a global `CLAUDE.md`

Treat generated exports under `.agents/skills/.nimbalyst-generated/` as read-only output, never a target.

For each catalog row you later match, decide which is true:
- **not covered** -> a real finding, propose the text
- **covered and followed** -> at most a line in "Already working"
- **covered but ignored in N sessions** -> report *that*, and suggest moving it earlier or making it more specific. Do not propose adding it again.

## Step 2 -- census the project

Bounded counts only. Do not read source files.

- File-type counts (e.g. via `git ls-files` then group by extension), top-level layout, package manifests
- Project shape: iOS/Xcode, Electron, Cloudflare Worker, Python/data, monorepo, docs-only
- `TODO`/`FIXME` counts if you need the tech-debt row

## Step 3 -- read the install and the settings

- `extensions_list` -> installed extensions with `enabled`, plus registry extensions not installed, plus `registryAvailable`
- `settings_get_overview` -> sync enablement for this project, `issueKeyPrefix`, `agentPermissionMode`, auth state, feature flags

If `registryAvailable` is false, say so in one line and skip the install recommendations. Do not guess at extension names from memory.

## Step 4 -- gather session evidence

`list_recent_sessions` (`includeArchived: false`) for the inventory: phase, tags, status, provider, workstream. **The phase and tag distribution is a finding on its own** -- if 20 of 25 sessions have no phase, that is the kanban going unused, and it needs no transcript reading at all.

Then `get_session_coaching_signals` per session, in parallel. It returns JSON: `turnCount`, `userPrompts` (the user's own words, machine-authored prompts already filtered out), `toolUsage` (normalized names with counts), `filesEdited` (deduped), `linkedTrackerItemIds`, `phase`, `tags`, `workstreamId`, `truncated`.

`userPrompts` is the richest signal here. The assistant side of the transcript is **not** available -- never write a finding that quotes what the agent said.

## Step 5 -- detect the tier

Check whether you have a SELECT-capable database tool (`database_query`, or the sqlite-browser extension's query tool).

- **Core tier (always)** -- everything above. Covers extensions, harness structure, phase/tag/workstream, user-frustration, tracker links, and tool usage across the reviewed sessions.
- **Enhanced tier (only with SQL)** -- two extra rows: `session_commits` for commit attribution, and `tool_usage_counters` for *project-lifetime* "never once invoked" (the signals tool only sees the reviewed window).

No SQL tool means one honest line in the header and those two rows omitted. Never guess to fill the gap.

## Step 6 -- match against the catalog

Filter by what is installed, what the project actually is, and what Step 1 already covers. A row only fires when its signal is genuinely present.

### Working habits (from session evidence)

| Practice | Signal | Observable via |
| --- | --- | --- |
| Keep session phase current | Sessions with no phase; `planning` sessions that edited files | Core -- inventory |
| Tag sessions `committed` / `uncommitted` | No commit-state tags anywhere | Core -- inventory |
| Use workstreams / sibling sessions | Long sessions spanning unrelated areas; no `workstreamId` anywhere | Core -- inventory + filesEdited |
| Read logs directly instead of asking the user | User prompts like "check the logs yourself"; pasted log blobs | Core -- userPrompts |
| Query the database instead of asking | User prompts pasting query results | Core -- userPrompts |
| Use interactive prompts for questions | User prompts that are terse answers ("option 2", "the first one") | Core -- userPrompts |
| Use the commit proposal widget | "propose a commit" with no commit-proposal tool in `toolUsage` | Core -- userPrompts + toolUsage |
| Record decisions as `decision` items | Sessions that edited files with no `linkedTrackerItemIds` | Core -- signals |
| File tech debt instead of TODO comments | `TODO`/`FIXME` in edited files, no matching tracker item | Core -- signals + census |
| Link the session to its tracker item | Tracker items exist, few sessions link any | Core -- signals |
| Reference the issue key in commits | Commits attributed to sessions with no linked item | Enhanced -- `session_commits` |
| Tools never once invoked in this project | Zero rows for a tool the project would benefit from | Enhanced -- `tool_usage_counters` |

### Harness structure (from the project scan)

| Practice | Signal | Observable via |
| --- | --- | --- |
| Split a monolithic instruction file | `CLAUDE.md` over ~400 lines, no `.claude/rules/` | Filesystem |
| Put load-bearing constraints first | Hard constraints only in the back half of the file | Filesystem |
| Write project slash commands for repeated work | Similar multi-step requests across sessions, no `.claude/commands/` | Core + filesystem |
| Cut permission prompts with an allowlist | No `permissions.allow` in `.claude/settings.json`, same commands run constantly | Filesystem + toolUsage |
| Turn a repeated manual step into a hook | Recurring prompt asking for the same post-edit action | Core + filesystem |
| Turn a recurring check into an automation | Repeated "check whether X yet" prompts | Core -- userPrompts |
| Use worktrees for parallel work | Concurrent sessions editing the same paths, no worktree | Core -- inventory |
| Enable session or doc sync for this project | Sync off for a project worked in daily | `settings_get_overview` |
| Set an issue key prefix | Trackers in use, prefix still the default | `settings_get_overview` + filesystem |
| Write the instruction file at all | No `CLAUDE.md` and no `AGENTS.md` anywhere | Filesystem |

### Extensions (from the census + registry)

Match in this order, and stop at the first that applies:

1. **File-type match** -- the census shows a file type an uninstalled extension handles. High confidence; this is the **only** extension finding allowed in the evidence tier. Cite the count and the extension.
2. **Project-shape match** -- iOS project, Electron app, Worker, notebook/data project. Report as a suggestion, not evidence.
3. **Installed but disabled** -- the fix is to enable it, never to install it. Say so explicitly.

Never dump the catalog. If nothing matches, the extensions section is omitted entirely.

Render each as a `nimbalyst://install/<extensionId>` link -- clicking it opens Settings > Marketplace at that extension. **Never install anything yourself** -- the user decides.

### Features they may not be using

Anything with genuinely zero usage across the reviewed sessions (or zero `tool_usage_counters` rows) goes in a short tail, explicitly labeled as unused-without-evidence. Keep it to a handful of the most relevant; this is a footnote, not a product tour.

## Step 7 -- report

```
## Nimbalyst coach -- {scope}

Project: {N} files, {top types}. Instruction files: {list, or "none"}.
Evidence: {N} sessions{, + SQL tier | " (core tier only -- no database tool available)"}

### Backed by your history -- {N}
- **{finding}** -- {n}/{total} sessions ({titles}).
    Evidence: {the observation, or a short user quote}
    Already covered by: {file}:{section}, or "nothing"
    Proposed: {the instruction text, verbatim}

### Extensions that match this project -- {N}
- **{name}** -- {n} {ext} files, not installed. {one line on what it gives you}. nimbalyst://install/{id}

### Harness improvements -- {N}
- **{finding}** -- {what the scan saw} -> {the change}

### Features you may not be using -- {N}
- **{feature}** -- no usage across {total} sessions. {one line}. [no evidence, just unused]

### Already working -- up to 3
- **{practice}** -- {file}:{section}. {"followed" | "ignored in n sessions"}
```

Never blend the tiers. Omit any section with nothing in it. If there are no findings at all, say so in a line or two and **stop** -- no approval prompt.

## Step 8 -- offer the edits

Only instruction and harness **file edits** are applied. Extensions stay as links. Never commit.

```
PromptForUserInput({
  title: "Apply coaching suggestions",
  intro: "Uncheck anything you don't want. Edit the wording before submitting.",
  submitLabel: "Apply",
  cancelLabel: "Skip",
  fields: [
    {
      type: "multiSelect",
      id: "instructionEdits",
      label: "Instruction additions",
      items: [ /* { id, title: "{practice}", subtitle: "{target file} | {why}", defaultChecked: true } */ ]
    },
    {
      type: "editText",
      id: "instructionText",
      label: "Final wording",
      initialText: "{the assembled additions, one sentence per line}"
    }
  ]
})
```

If the user cancels, print "No changes applied." and stop.

## Step 9 -- place the approved text

**Do not hardcode a target file.** Decide, then ask:

- **Match the file to the agent that will read it** -- `AGENTS.md` for a GPT/Codex-family session, `CLAUDE.md` for a Claude-family one. If both exist, follow whichever the project already maintains, and check whether one delegates to the other before writing to both.
- **Ask where it belongs.** These suggestions are Nimbalyst-specific and the file may be shared with teammates who use something else:
  - the committed project file -- right when the whole team uses Nimbalyst
  - a `.claude/rules/` file -- committed but isolated, easy to scope or delete
  - a local gitignored file, or the user-level `CLAUDE.md` -- right when they are the only Nimbalyst user on the team
- Append into the most relevant existing section. Never restructure, never rewrite the user's prose.
- One confirmation line per edit.

## Constraints

- Read-only until the user approves.
- Never install, enable, or uninstall an extension. Never create or mutate tracker items, session links, phases, or board state -- where those would help, recommend the *standing instruction* that makes future agents do it.
- Never commit.
- Never quote the assistant side of a transcript; it is not available to you.
- Cap the review at 30 sessions.
- If `truncated` is set on a session's signals, say the session was sampled rather than implying you read all of it.
