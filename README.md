# northstar-todo-web

Minimal Todo Web tracer slice for Northstar.

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
2. Add a todo with non-empty text and confirm it appears immediately.
3. Try submitting an empty or whitespace-only todo and confirm no item is added.
4. Toggle a todo complete and confirm the item shows a completed style.
5. Refresh the page and confirm the todo list persists.
