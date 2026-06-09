# Todo Web Toolbar Today-Due Reminder Implementation Plan

### Task 1: Toolbar Today-Due Summary Reminder

Objective:
- 在工具列 summary 第二行顯示 `Today due: N`，僅統計未完成且到期日為今天（本機時區）的待辦。

Scope:
- 新增 domain 計數函式（today-due count）。
- 在 toolbar `todo-counts` 區塊渲染提醒文案。
- `N=0` 時不渲染提醒。
- 提醒列純資訊不可點擊。
- 新增輕提醒色樣式（amber 類）。

Files:
- Modify: `src/todos.ts`
- Modify: `src/main.tsx`
- Modify: `src/styles.css`
- Modify/Test: `src/todos.test.ts`
- Modify/Test: `src/quick-add.test.ts`

TDD Steps:
- [ ] Step 1 (RED): 在 `src/todos.test.ts` 新增 `countTodayDueTodos` 測試：今天到期計入、completed 不計入、無 dueDate 不計入。
- [ ] Step 2 (RED): 在 `src/quick-add.test.ts` 新增 UI 測試：有 today-due 顯示 `Today due: N`、無 today-due 不顯示。
- [ ] Step 3 (RED): 執行 `npm test`，確認新測試失敗。
- [ ] Step 4 (GREEN): 在 `src/todos.ts` 實作 `countTodayDueTodos(todos, today = new Date())`。
- [ ] Step 5 (GREEN): 在 `src/main.tsx` 計算 `todayDueCount`，於 summary 第二行渲染 `<p className="today-due-summary">Today due: {todayDueCount}</p>`，且僅 `todayDueCount > 0` 時顯示。
- [ ] Step 6 (GREEN): 在 `src/styles.css` 增加 `.today-due-summary` 輕提醒色樣式（與 summary 同字級）。
- [ ] Step 7 (GREEN): 執行 `npm test`，確認全部通過。
- [ ] Step 8 (COMMIT): `git add src/todos.ts src/main.tsx src/styles.css src/todos.test.ts src/quick-add.test.ts && git commit -m "feat: add today-due toolbar reminder"`。

Code Snippets:
```ts
// src/todos.ts
export function countTodayDueTodos(todos: Todo[], today: Date = new Date()): number {
  const todayValue = formatDateInputValue(today);
  return todos.filter((todo) => !todo.completed && todo.dueDate === todayValue).length;
}
```

```tsx
// src/main.tsx
const todayDueCount = countTodayDueTodos(todos);

<div className="todo-counts" aria-live="polite">
  <p className="progress-summary">
    {totalCount} total, {activeCount} active, {completedCount} completed
  </p>
  {todayDueCount > 0 ? <p className="today-due-summary">Today due: {todayDueCount}</p> : null}
</div>
```

```css
/* src/styles.css */
.today-due-summary {
  margin: 0.2rem 0 0;
  color: #b45309; /* amber-like */
  font-size: 0.95rem;
  font-weight: 500;
}
```

Acceptance Criteria:
- 工具列在有到期日為今天的未完成待辦時，顯示 `Today due: N`。
- `N` 僅包含未完成且 dueDate 為今天的待辦。
- 切換 All/Active/Completed/Due today filter 時，`N` 不變。
- 當 `N = 0` 時，不顯示提醒區塊。
- 提醒列為純資訊，不可點擊。
- `npm test` 全數通過。

Quantitative Metrics:
- 新增至少 3 個測試覆蓋 today-due 計數與顯示規則。

Required Tests:
- npm test
