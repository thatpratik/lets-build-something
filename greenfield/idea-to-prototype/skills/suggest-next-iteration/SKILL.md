---
name: suggest-next-iteration
description: Suggests the next iteration to build, based on PRD.md and CONSTITUTION.md. Use after a PRD exists and the user wants to know what to build next.
disable-model-invocation: true
---

Check for `PRD.md` and `CONSTITUTION.md` in the project root:

- If neither exists: tell the user and suggest running `/clarify-prd` (to produce a PRD) and `/clarify-constitution` (to produce a constitution) before proceeding.
- If only `PRD.md` is missing: tell the user and suggest running `/clarify-prd` to create one.
- If only `CONSTITUTION.md` is missing: proceed using the PRD alone, but note that a constitution (run `/clarify-constitution`) would sharpen the guidance.
- If both exist: read both files. Let the PRD drive *what* to build next; let the constitution enforce *how* — respecting its constraints on architecture, tech choices, and principles when framing the options.

Scan the codebase to understand what's already built. Propose two or three logical next iterations and let the user pick one.

For projects with a UI or user-facing surface: strongly prefer getting something visual running first. Fake everything — in-memory state, hardcoded data, stub functions — until the shape and flow feel right. Only reach for real infrastructure (database, auth, queues) when a fake genuinely can't cut it anymore.

For non-visual projects (CLIs, background workers, data pipelines): apply the same principle but in terms of runnability — get something that executes end-to-end with mocked internals before wiring up the real pieces.

## After an iteration ships

The next step is **not** another iteration — don't suggest one. After the chosen iteration is built, the user runs `/diary`, then clears the context and starts a new session to run `/suggest-next-iteration` again. These are the user's actions, not yours; just don't mislead them by proposing a different next step.
