---
name: clarify-prd
description: Interviews the user from raw vision down to a concrete why and what, then writes PRD.md (with approval). The starting point for a greenfield project.
disable-model-invocation: true
---

# Clarify PRD

This skill takes a greenfield idea from raw vision to a concrete PRD. It opens by learning the **vision**, then gets *specific* — clarifying the why (the problem) and the what (the solution and scope) — and then writes `PRD.md`. It always asks for approval before writing the file.

## Workflow

1. **Open on the vision.** If the conversation doesn't already make the vision clear, prompt: "Tell me about what you want to build — the problem behind it, who it's for, and what success looks like. Don't worry about structure or detail yet." Let the user share freely; ask follow-ups until you genuinely understand the idea. Don't ask about tech stack, language, or frameworks — that belongs in the constitution, later.

2. Interview the user to get specific on the **why** and the **what**:
   - **Why** — sharpen the problem statement: who has it, when, and what it costs them today.
   - **What** — sharpen the solution and its scope: the core user stories, the must-haves for a first useful version, and what is explicitly out of scope.

   Ask one focused question at a time. Keep going until the problem and the solution are concrete enough to write down without guessing.

3. When you have enough to write a specific PRD — or when the user tells you to write it — **summarize the PRD you intend to write and ask the user to approve it before you create the file.** Do not write `PRD.md` until the user approves. If they push back, refine and ask again.

4. On approval, write `PRD.md` to the project root using the template below.

<prd-template>

## Problem Statement

The problem the user is facing, from the user's perspective. Be specific about who has it and why it matters.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A numbered list of user stories, each in the format:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a habit tracker user, I want to see my current streak for each habit, so that I stay motivated to keep it going.
</user-story-example>

Cover the core of the product. Be extensive enough to capture the real scope, but don't pad with features the user didn't ask for.

## Implementation Decisions

Decisions the user confirmed during the conversation — behaviours, flows, interactions, and any concrete choices about what the product does. Do NOT include file paths, code snippets, or tech-stack choices (those live in the CONSTITUTION).

## Out of Scope

What is explicitly not part of this PRD.

## Further Notes

Any further notes about the product.

</prd-template>

## Guidelines

- Always ask for approval before writing `PRD.md`. The user owns this document.
- Only write what was confirmed in the conversation — do not invent or pad.
- Do not decide the tech stack here; that belongs in the constitution.
- Keep the PRD about the why and the what, not the how.
