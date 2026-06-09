# northstar-todo-web

Minimal Todo Web tracer slice for Northstar.

The todo form accepts required todo text and an optional due date. Todos with
due dates show a readable due-date label in the list. Active todos whose due
date is before today are visually marked as overdue; completing the todo removes
the overdue styling. The list can be filtered by All, Active, and Completed,
shows the total todo count and active todo count, can clear completed todos, and
persists todo text, completion state, due dates, and the derived total count in
localStorage after refresh.

## Local Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

## Verification

Run the unit tests:

```bash
npm test
```

Build the app:

```bash
npm run build
```

Manual browser checks:

1. Load `/` and confirm the `Todo Web` title is visible.
2. Add at least two todos with non-empty text and confirm they appear immediately.
3. Confirm the total todo count increases after each todo is added.
4. Add a todo with a future due date and confirm the readable due-date label appears.
5. Add an active todo with a past due date and confirm it is visually marked overdue.
6. Complete one todo and confirm the active count decreases and overdue styling is removed.
7. Switch between All, Active, and Completed filters and confirm each list matches
   the selected state.
8. Clear completed todos and confirm active todos remain and the total count decreases.
9. Refresh the page and confirm the persisted todos, due dates, completion state,
   and total count remain correct.
10. Try submitting an empty or whitespace-only todo and confirm no item is added.

Note: Issue #88 implemented — the list area shows a small helper text when there are no todos, guiding how to add the first task.
