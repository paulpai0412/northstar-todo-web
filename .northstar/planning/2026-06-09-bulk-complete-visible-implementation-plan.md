# Todo Web Toolbar Bulk Complete Visible Implementation Plan

> **Northstar planning contract:** This plan is a runtime-ready execution contract for Northstar operators and workers. It turns an approved spec into issue-sized implementation tasks, verification evidence, Project projection expectations, and release gates.

**Goal:** Deliver `Complete visible` bulk action so users can complete only visible unfinished todos from the toolbar.

**Architecture:** Keep one vertical slice: domain selection/update logic → toolbar button integration → regression verification and evidence.

**Tech Stack:** React + TypeScript todo app, Vitest test suite (`npm test`), Northstar issue_to_pr_release workflow.

---

Source Spec: /home/timmypai/apps/northstar-todo-web/.northstar/planning/2026-06-09-bulk-complete-visible-requirement.md
Consumer Repo Root: /home/timmypai/apps/northstar-todo-web

## Northstar Planning Contract
- Source contract: northstar:implementation-planning.
- Each task is issue-sized and independently verifiable.
- Keep TDD (RED → GREEN → VERIFY) and explicit commit boundaries.
- Preserve task headings and Depends-On markers for downstream `plan-issues`.

## Runtime Workflow Map
- Domain: software_development.
- Stage flow: intake -> implementation -> verification -> release -> completed.
- Completion evidence: passing tests, PR URL, merge SHA, and GitHub Project field projection.

## Issue Generation Guidance
- Keep vertical slices, avoid horizontal-only refactors.
- Mark all tasks AFK-capable (no user manual input required).
- Include dependency order to prevent parallel conflicts.

### Task 1: Build visible-scope bulk-complete domain behavior

Objective:
- Implement pure domain logic that marks only currently visible unfinished todos as completed.

Scope:
- Add helper(s) in `src/todos.ts` to compute affected ids and apply immutable updates.
- Add focused unit tests in `src/todos.test.ts` for visible-only updates and non-visible protection.

Files:
- Modify: `src/todos.ts`
- Modify/Test: `src/todos.test.ts`

Acceptance Criteria:
- 點擊後，僅目前可見清單中的未完成項目被標記為 completed。
- 不在可見清單中的項目不得被修改。

Quantitative Metrics:
- 覆蓋 visible-only update 與 non-visible unchanged 兩個核心測試。

Required Tests:
- npm test

TDD Steps:
- [ ] **Step 1 (RED):** 新增 domain failing tests（visible incomplete only / non-visible untouched）。
- [ ] **Step 2 (RED):** 執行 `npm test`，預期新增測試失敗。
- [ ] **Step 3 (GREEN):** 在 `src/todos.ts` 實作最小可行 bulk-complete visible domain 邏輯。
- [ ] **Step 4 (GREEN):** 再跑 `npm test`，預期新增 domain 測試通過。
- [ ] **Step 5 (COMMIT):** `git add src/todos.ts src/todos.test.ts && git commit -m "feat: add bulk complete visible domain logic"`.

Code Snippets:
```ts
// src/todos.ts
export function completeVisibleTodos(todos, visibleIds) {
  const visibleSet = new Set(visibleIds);
  return todos.map((todo) => (
    visibleSet.has(todo.id) && !todo.completed
      ? { ...todo, completed: true }
      : todo
  ));
}
```

### Task 2: Integrate toolbar `Complete visible` action and disabled state

Depends-On: Task 1

Objective:
- Add toolbar button, disabled rules, and click handler wired to visible-scope domain behavior.

Scope:
- Update `src/main.tsx` toolbar actions.
- Add/adjust UI tests in `src/quick-add.test.ts` for enabled/disabled behavior and post-click counter updates.

Files:
- Modify: `src/main.tsx`
- Modify/Test: `src/quick-add.test.ts`

Acceptance Criteria:
- 當目前可見清單有未完成項目時，`Complete visible` 可點擊。
- 若可見清單無可完成項目，按鈕呈 disabled，點擊不產生狀態變更。
- 執行後畫面與計數（total/active/completed）立即更新。

Quantitative Metrics:
- 覆蓋 button enable/disable + counter refresh 兩組 UI 測試。

Required Tests:
- npm test

TDD Steps:
- [ ] **Step 1 (RED):** 新增 UI failing tests（button disabled 規則、click 行為、count 更新）。
- [ ] **Step 2 (RED):** 執行 `npm test`，預期 UI 測試失敗。
- [ ] **Step 3 (GREEN):** 在 `src/main.tsx` 實作 `Complete visible` 按鈕與事件。
- [ ] **Step 4 (GREEN):** 再跑 `npm test`，預期 UI 測試通過。
- [ ] **Step 5 (COMMIT):** `git add src/main.tsx src/quick-add.test.ts && git commit -m "feat: add complete visible toolbar action"`.

Code Snippets:
```tsx
// src/main.tsx
const visibleIncompleteIds = visibleTodos.filter((todo) => !todo.completed).map((todo) => todo.id);
const canCompleteVisible = visibleIncompleteIds.length > 0;

<button type="button" disabled={!canCompleteVisible} onClick={() => setTodos((current) => completeVisibleTodos(current, visibleIncompleteIds))}>
  Complete visible
</button>
```

### Task 3: Final regression verification and release evidence

Depends-On: Task 2

Objective:
- Ensure the full acceptance set is protected and evidence is ready for release automation.

Scope:
- Add any missing regression assertions for filter/hide-completed interaction.
- Run complete test suite and record evidence artifacts for Northstar release stage.

Files:
- Modify/Test: `src/quick-add.test.ts`
- Modify/Test: `src/todos.test.ts`

Acceptance Criteria:
- 所有 acceptance criteria 可由測試驗證且 `npm test` 全綠。

Quantitative Metrics:
- verification_evidence_recorded = 1

Required Tests:
- npm test

TDD Steps:
- [ ] **Step 1 (RED):** 補齊回歸測試（filter/hide-completed 下的 visible-scope 正確性）。
- [ ] **Step 2 (RED):** 執行 `npm test`，預期新增回歸測試先失敗。
- [ ] **Step 3 (GREEN):** 修正實作或測試夾具讓行為符合規格。
- [ ] **Step 4 (VERIFY):** 執行 `npm test`，預期全數通過。
- [ ] **Step 5 (COMMIT):** `git add src/quick-add.test.ts src/todos.test.ts && git commit -m "test: add bulk complete visible regression coverage"`.

Code Snippets:
```ts
// src/quick-add.test.ts
it("keeps non-visible todos unchanged after Complete visible", () => {
  // Arrange: active filter shows subset
  // Act: click Complete visible
  // Assert: hidden todo remains unchanged
});
```
