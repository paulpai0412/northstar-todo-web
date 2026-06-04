# northstar-todo-web

Minimal Todo Web tracer slice for Northstar.

The todo form accepts required todo text and an optional due date. Todos with
due dates show a readable due-date label in the list. Active todos whose due
date is before today are visually marked as overdue; completing the todo removes
the overdue styling. Todo text, completion state, and due dates are persisted in
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
2. Add a todo with non-empty text and no due date, then confirm it appears immediately.
3. Add a todo with a future due date and confirm the readable due-date label appears.
4. Add an active todo with a past due date and confirm it is visually marked overdue.
5. Toggle the overdue todo complete and confirm the overdue styling is removed.
6. Try submitting an empty or whitespace-only todo and confirm no item is added.
7. Refresh the page and confirm todo text, completion state, and due dates persist.
