# Todo Web Toolbar Today-Due Reminder Design

## Goal
為 Todo Web 新增「今天到期提醒」功能，讓使用者在工具列即時知道今天有幾筆未完成待辦到期。

## Decision
採用工具列 summary 第二行顯示提醒（ASCII 方案 1），文案為 `Today due: N`，輕提醒色顯示，純資訊不可點擊。

## Non-Goals
- 不做瀏覽器 Notification API。
- 不做提醒點擊跳轉或 tooltip。

## Architecture
- Domain 層新增 today-due 計數函式，基於「全域未完成 todos + 本機時區今天日期」。
- UI 層在 toolbar summary 區塊渲染提醒列。
- 樣式層新增 `today-due-summary` 輕提醒色樣式。

## Components
- `src/todos.ts`：today-due 計數邏輯。
- `src/main.tsx`：toolbar 提醒列渲染。
- `src/styles.css`：提醒文案樣式。
- 測試：`src/todos.test.ts`（domain）、`src/quick-add.test.ts`（UI presence/absence）。

## Data Flow
1. 以 `formatDateInputValue(new Date())` 取得本機今天值。
2. 從 `todos` 中過濾 `!completed && dueDate === todayValue` 計算 `N`。
3. `N > 0` 顯示 `Today due: N`；`N = 0` 不渲染提醒列。
4. 計數不依賴目前 filter（All/Active/Completed/Due today）。

## Error Handling
- 無 dueDate 的待辦不計入。
- completed 待辦不計入。
- 日期格式不匹配時自然不計入，避免 throw。

## Testing Strategy
- 單元測試驗證 today-due 計數規則。
- UI 測試驗證 N>0 顯示、N=0 隱藏、文案不可點擊按鈕行為。

## UI Design
### Screen Inventory
- Todo 單頁主畫面（toolbar + list）。

### Style System
- 提醒文案使用輕提醒色（amber 類），字級與 summary 同級。
- 不使用 badge 實心底。

### Interaction States
- `N > 0`：顯示提醒。
- `N = 0`：隱藏提醒。
- 提醒列為純文字資訊，無 click handler。

### ASCII Wireframes
```text
+------------------------------------------------------+
| summary: 8 total, 5 active, 3 completed              |
| Today due: 2                                         |
| [All] [Active] [Completed] [Due today] [Clear done]  |
+------------------------------------------------------+
```

## Acceptance Criteria
- 工具列在有到期日為今天的未完成待辦時，顯示 `Today due: N`。
- `N` 僅包含未完成且 dueDate 為今天的待辦。
- 切換 All/Active/Completed/Due today filter 時，`N` 不變。
- 當 `N = 0` 時，不顯示提醒區塊。
- 提醒列為純資訊，不可點擊。

## Quantitative Metrics
- 新增至少 3 個測試覆蓋：
  - today-due 計數正確
  - completed 不計入
  - N=0 隱藏提醒

## Required Tests
- npm test

## Open Questions
- None.

## Source Inputs
- Brief: /home/timmypai/apps/northstar-todo-web/.northstar/planning/2026-06-08-today-due-reminder-brief.md
- Answers: /home/timmypai/apps/northstar-todo-web/.northstar/planning/2026-06-08-today-due-reminder-answers.md
