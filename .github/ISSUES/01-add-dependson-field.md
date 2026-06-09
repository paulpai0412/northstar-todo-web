# 新增 Todo model 的 optional `dependsOn` 欄位並持久化

Summary

在資料模型與序列化層加入一個可選的 dependsOn 欄位（儲存被依賴的 todo id），並確保 normalize / 儲存 / 載入流程向後相容。

Why

要在 UI 與行為層實作 todo 之間的相依（dependency）機制，必須先在 model 層可靠地儲存和還原依賴資訊。

Technical notes

- 主要修改檔案：src/todos.ts（Todo 型別、normalizeTodos、addTodo 等）
- 檢查並維持 localStorage 的向後相容（現有資料不含 dependsOn 應仍能載入）
- 建議新增或修改項目：
  - Todo type 新增 optional 欄位 dependsOn?: string | null
  - normalizeTodos 在驗證 stored item 時允許並保留 dependsOn（若為 string）
  - addTodo 可接受一個可選 dependsOn 參數（用於未來的 UI 實作）
  - load/save（src/main.tsx 的 useEffect）不需改動（JSON.stringify/parse 已涵蓋），但 normalize 必須保留字段

Acceptance criteria

- Todo 型別包含可選的 dependsOn 欄位（例如 dependsOn?: string | null）。
- normalizeTodos 在從 localStorage 解析後會保留並回傳 dependsOn（若原始資料提供且為 string）。
- 新增 todo（未指定 dependsOn）與舊資料仍能正常載入（向後相容）。
- localStorage 可儲存包含 dependsOn 的 todo，刷新頁面後能還原該欄位。
- 新增至少一個單元測試（建議檔名：src/dependency-model.test.ts）驗證：
  - normalize 保留合法 dependsOn
  - 非陣列 / 欄位型別錯誤時返回 []

Suggested labels: feature, dependencies, tests

Dependencies: None (可獨立執行)

Notes

- 這是一個低風險的資料層修改，目的是為後續 UI 與行為（阻斷完成、顯示依賴等）提供穩定的基礎。