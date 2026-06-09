# Todo Web Toolbar Bulk Complete Visible

## Objective
為 Todo Web 新增「Bulk Complete」功能，讓使用者可以一鍵將目前可見清單中的未完成待辦標記為 completed。

## Scope
- 在工具列新增 `Complete visible` 按鈕。
- 只作用於「目前可見清單」中的未完成項目（先套用 filter/hide-completed，再執行）。
- 執行後保留目前 filter 狀態，不改變排序或其他設定。
- 若目前可見清單沒有可完成項目，按鈕 disabled。

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
