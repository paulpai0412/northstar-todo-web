# Todo Web 可見清單排序功能規格

## Objective
為 Todo Web 新增一個可切換的排序功能，讓使用者在目前可見清單中快速看到最急迫與最重要的項目。

## Product Requirements
- 在工具列提供 `Sort` 開關（on/off）。
- 排序只作用於「目前可見清單」（先套用 filter 與 hide-completed，再排序）。
- 排序規則：
  1. 未完成在前，已完成永遠在後。
  2. 有 due date 在前、無 due date 在後。
  3. due date 由近到遠（越早到期越前）。
  4. priority 由高到低（high > normal > low）。
  5. 同分時以 createdAt 新到舊。
- `Sort` 狀態需寫入 localStorage，重整後維持。
- 首次進入預設為 Sort 關閉。

## Acceptance Criteria
- 使用者可透過工具列 Sort 開關啟用/關閉排序。
- 啟用排序後，清單順序符合上述規則。
- 切換 filter（All/Active/Completed/Due today）時，排序只影響當下可見項目。
- 在 hide completed 關閉且 completed 可見時，completed 項目固定在清單後段。
- Sort 狀態刷新頁面後可維持；首次載入預設為關閉。
- 既有功能（新增、編輯、勾選、清除完成、計數）行為不回歸。

## Quantitative Metrics
- 新增至少 4 個測試案例覆蓋：排序規則、completed 後置、可見範圍排序、sort 狀態持久化。
- `npm test` 全數通過。

## Required Tests
- `npm test`
