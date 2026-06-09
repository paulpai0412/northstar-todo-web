# Feature brief: Sort visible todos

## Context
Current todo app supports add/edit/toggle/filter/hide-completed, due date, and priority.

## Goal
Add a user-controllable sort feature for the visible list.

## Requested behavior
- Add a toolbar Sort toggle (on/off).
- Sort applies to currently visible todos only (after filter/hide-completed).
- When sort is on, use order rules:
  1) Due date ascending (earliest first)
  2) Priority descending (high > normal > low)
  3) Created time descending (newest first) as tie-breaker
- Todos without due date appear last.
- Completed todos (if visible) always appear after non-completed todos.
- Persist Sort toggle state in localStorage.
- Default for first-time visitors: sort off.

## Constraints
- Keep scope as one tracer-bullet vertical slice.
- Keep existing behaviors intact.
- Include tests.
