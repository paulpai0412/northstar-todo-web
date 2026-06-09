# Feature brief: Sort visible todos Spec

## Northstar Spec Contract
- Source contract: northstar:planning-spec.
- Synthesize known conversation, brief, and codebase context into a PRD/spec.
- Do not interview the user again during this stage; unresolved questions stay in Open Questions.
- Include major modules and deep-module opportunities so implementation can target stable interfaces.
- This document is the approved source for `plan-implementation` and `plan-issues`.

## Objective
## Context
Current todo app supports add/edit/toggle/filter/hide-completed, due date, and priority.

## Source Brief
/home/timmypai/apps/northstar-todo-web/.northstar/planning/2026-06-08-sort-feature-brief.md

## Constraints
# Planning answers: 2026-06-08 sort feature

1. Feature choice: 排序功能
2. Sort dimensions: 到期日 + 優先級
3. Scope: 只對目前可見清單排序（先 filter/hide-completed，再排序）
4. Trigger/UI: 工具列 Sort 開關（可開/關）
5. No due date placement: 放最後
6. Completed placement: 已完成永遠放最後
7. Persist sort state: 要記住到 localStorage
8. Tie-breaker: 建立時間新到舊
9. First-load default: 關閉

## Product Requirements
- Acceptance criteria must be confirmed before implementation.

## User Stories
1. As a Northstar operator, I want Acceptance criteria must be confirmed before implementation, so that Feature brief: Sort visible todos can be verified from user-visible behavior.

## Implementation Decisions
- Preserve existing Northstar architecture boundaries and prefer existing seams.
- Avoid specific file paths in the PRD unless a prototype snippet encodes a durable decision.
- Major modules to build or modify: planning pipeline, CLI command surface, operator command mapping, generated issue intake.
- Deep module opportunity: keep planning contract generation behind a small deterministic helper API.

## Testing Decisions
- npm test

## Non-Goals
None.

## Acceptance Criteria
- Acceptance criteria must be confirmed before implementation.

## Quantitative Metrics
- planning_acceptance_defined = 1

## Required Tests
- npm test

## Out of Scope
None.

## Open Questions
None.