---
name: clarify-constitution
description: Interviews the user to establish the project constitution — language, stack, and architecture standards that stay fixed across all tasks — then writes CONSTITUTION.md (with approval).
disable-model-invocation: true
---

# Clarify Constitution

This skill captures the small set of project-wide decisions that never change mid-project: the programming language, any fixed runtime or framework constraints, and the architecture/coding standards to follow. It interviews the user to lock these in, then writes `CONSTITUTION.md`. Everything else (databases, queues, external services) should stay as in-memory fakes behind clean interfaces until forced otherwise — so don't ask about it here.

## Initial Prompt

When the skill is invoked, read `PRD.md` if it exists, then prompt the user with:

"What programming language should this project be built in? Any other hard constraints on the stack or architecture I should lock in now (framework, runtime, coding style)?"

## Workflow

1. Ask the initial prompt.
2. Ask one or two follow-up questions only if the answer is ambiguous or if a hard architectural constraint was mentioned that needs clarification (e.g. "you said FastAPI — should the API layer be REST or does that not matter yet?").
3. When you have a clear picture — or when the user tells you to write it — **summarize the constitution you intend to write and ask the user to approve it before you create the file.** Do not write `CONSTITUTION.md` until the user approves. If they push back, refine and ask again.
4. On approval, write `CONSTITUTION.md` to the project root using the template below.

<constitution-template>

## Language & Runtime

The chosen language and version/runtime if specified.

## Architecture Principles

Durable principles that apply across all iterations — e.g. "keep infrastructure in-memory and behind interfaces until forced otherwise", "prefer flat structure over layered", any coding style rules.

## Fixed Dependencies

Only frameworks and libraries that were explicitly decided. Omit anything not yet chosen.

</constitution-template>

## Guidelines

- Always ask for approval before writing `CONSTITUTION.md`. The user owns this document.
- Keep `CONSTITUTION.md` short — scannable in 10 seconds.
- Only write what the user confirmed — do not invent or pad. If a decision wasn't made yet, omit that section rather than guessing.
- Do not ask about or include databases, queues, auth, or deployment unless the user explicitly confirmed them; those stay deferred.
