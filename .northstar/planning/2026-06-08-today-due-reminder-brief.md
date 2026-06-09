# Todo Web Toolbar Today-Due Reminder

## Objective
為 Todo Web 新增「今天到期提醒」功能，讓使用者在工具列即時知道今天有幾筆未完成待辦到期。

## Scope
- 只做 UI 內提醒（不做 Notification API）。
- 工具列顯示彙總文案。
- 只計算「全部未完成」待辦，不受目前 filter 影響。
- 以使用者本機時區判斷今天日期。

## Acceptance Criteria
- 工具列在有到期日為今天的未完成待辦時，顯示 `Today due: N`。
- `N` 僅包含未完成且 dueDate 為今天的待辦。
- 切換 All/Active/Completed/Due today filter 時，`N` 不變（因為計算全域未完成集合）。
- 當 `N = 0` 時，不顯示提醒區塊。
- `npm test` 全數通過。

## Quantitative Metrics
- 新增至少 3 個測試覆蓋：
  - 正確計數今天到期未完成數量
  - 完成待辦不計入
  - `N=0` 時隱藏提醒

## Required Tests
- npm test
