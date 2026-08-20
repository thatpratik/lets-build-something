# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This repository has no application code yet — it's a fresh greenfield starting point. The only content is a `greenfield/` directory holding reference material (`idea-to-prototype/instructions.pdf`, `prep.pdf`) and a set of custom skills that define the intended workflow for taking an idea to a working prototype.

There are no build, lint, or test commands because no project has been scaffolded yet.

## Greenfield workflow

The skills under `greenfield/idea-to-prototype/skills/` define a sequence for bootstrapping a new project from an idea:

1. **`clarify-prd`** (`disable-model-invocation: true` — explicit `/clarify-prd` only) — interviews the user from raw vision to a concrete why/what, then writes `PRD.md` (problem statement, solution, user stories, implementation decisions, out of scope). Asks for approval before writing.
2. **`clarify-constitution`** (`disable-model-invocation: true` — explicit `/clarify-constitution` only) — reads `PRD.md` if present, then locks in language/runtime/architecture standards that stay fixed for the project, writing `CONSTITUTION.md`. Keeps infrastructure (databases, queues, auth) as in-memory fakes behind clean interfaces until forced otherwise. Asks for approval before writing.
3. **`suggest-next-iteration`** (`disable-model-invocation: true` — explicit `/suggest-next-iteration` only) — reads `PRD.md` and `CONSTITUTION.md`, scans what's already built, and proposes 2-3 concrete next iterations. Prefers getting something visually or functionally runnable first, faking real infrastructure until it can't be avoided. After an iteration ships, the next step is `/diary` followed by a fresh session running `/suggest-next-iteration` again — not another iteration suggestion in the same session.
4. **`diary`** (no `disable-model-invocation` flag — activates proactively during non-trivial implementation work, not just on explicit request) — maintains an implementation diary at `docs/diary/YYYY-MM-DD-<slug>.md` per task, capturing what changed, why, what worked/failed (with verbatim errors and commands), and what a reviewer should check. One file per task; steps accumulate across a session but old entries are never edited in later sessions. Diary files are committed alongside the code they document, only when the user asks for a commit.

When a project is scaffolded here, `PRD.md` and `CONSTITUTION.md` will land in the project root and should be treated as the source of truth for scope and architectural constraints, respectively.
