# Todo Web Toolbar Bulk Complete Visible Design

## Goal
為 Todo Web 新增「Bulk Complete」功能，讓使用者可以一鍵將目前可見清單中的未完成待辦標記為 completed。

## Decision
Use 以 toolbar 的 `Complete visible` 單一按鈕執行可見未完成項目的一次性批次完成 as the primary implementation direction.

## Non-Goals
None.

## Architecture
- Build around: 為 Todo Web 新增「Bulk Complete」功能，讓使用者可以一鍵將目前可見清單中的未完成待辦標記為 completed。
- UI layer with state-driven rendering
- Task-oriented implementation plan mapped to issue slices
- Verification-first workflow with required tests before release

## Components
- Screen shell and navigation
- Primary content region
- State-specific views (loading/empty/error/success)
- Interaction controls and feedback

## Data Flow
- Trigger user intent for: 為 Todo Web 新增「Bulk Complete」功能，讓使用者可以一鍵將目前可見清單中的未完成待辦標記為 completed。
- Transform intent into validated state transitions
- Render or emit outputs
- Persist and verify through required tests/evidence

## Error Handling
- Validate inputs before state mutation
- Provide deterministic fallback behavior for invalid/empty states
- Keep failures observable and testable

## Testing Strategy
- npm test

## UI Design
### Screen Inventory
- screen: Todo 主頁（single page）
- screen: Toolbar 操作列（filters + actions）

### Style System
- style: 按鈕沿用現有 toolbar 按鈕尺寸與字級
- style: disabled 狀態使用現有 muted 色票
- style: spacing 與現有 action 群組一致

### Interaction States
- success: 點擊後列表與計數立即更新
- keyboard: button 可被 Tab focus，Enter/Space 觸發
- empty: 無可見未完成項目時按鈕 disabled

### ASCII Wireframes
```text
+----------------------------------------------------------------+
| summary: 10 total, 6 active, 4 completed                       |
| [All] [Active] [Completed] [Due today] [Complete visible]      |
+----------------------------------------------------------------+
| - [ ] Task A                                                    |
| - [ ] Task B                                                    |
| - [x] Task C                                                    |
+----------------------------------------------------------------+
```

## Acceptance Criteria
- 當目前可見清單有未完成項目時，`Complete visible` 可點擊。
- 點擊後，僅目前可見清單中的未完成項目被標記為 completed。
- 不在可見清單中的項目不得被修改。
- 執行後畫面與計數（total/active/completed）立即更新。
- 若可見清單無可完成項目，按鈕呈 disabled，點擊不產生狀態變更。

## Quantitative Metrics
- 新增至少 4 個測試覆蓋：
  - 僅更新可見未完成項目
  - 不影響不可見項目
  - disabled 狀態行為
  - 執行後計數更新

## Required Tests
- npm test

## Open Questions
- None.

## Source Inputs
- Brief: /home/timmypai/apps/northstar-todo-web/.northstar/planning/2026-06-09-bulk-complete-visible-brief.md
- Answers: /home/timmypai/apps/northstar-todo-web/.northstar/planning/2026-06-09-bulk-complete-visible-answers.md