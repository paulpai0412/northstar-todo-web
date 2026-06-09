# Todo Web 可見清單排序功能 Implementation Plan

### Task 1: Sort Toggle for Visible Todo List

## Objective
實作一個可切換的 Sort 開關，對目前可見清單套用「已完成後置 + 無到期日後置 + 到期日升冪 + 優先級降冪 + 建立時間新到舊」排序，並持久化開關狀態。

## Acceptance Criteria
- 工具列顯示 Sort 開關，且可切換 on/off。
- sort on 時，僅對 `getVisibleTodos(...)` 結果排序，不改變原始儲存順序。
- completed 永遠在後，no due date 永遠在後，剩餘項目依 due date/priority/createdAt 排序。
- localStorage 記住 Sort 開關；首次載入預設關閉。
- 相關測試新增並通過。

## Quantitative Metrics
- 新增或更新測試至少 4 筆。
- `npm test` 維持綠燈。

## Required Tests
- `npm test`
