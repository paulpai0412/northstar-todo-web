# 阻止完成一個 todo，若其 dependsOn 的 todo 尚未完成

Summary

新增完成（toggle）邏輯中的檢查：如果 todo.dependsOn 指向的 todo 尚未完成，則阻止被依賴的 todo 被標為完成，並向使用者顯示可存取的提示訊息。

Why

要確保在有依賴關係的情況下，使用者不能跳過前置工作把後續項目標為完成，這是測試 dependency workflow 的核心行為。

Technical notes / Implementation hints

- 相關檔案：src/todos.ts（toggleTodo 目前只做翻轉）、src/main.tsx（checkbox onChange 呼叫點）
- 建議實作方案：
  - 新增一個 pure helper：tryToggleTodo(todos: Todo[], id: string) => { todos: Todo[]; blockedBy?: string | null }
    - 若目標 todo 有 dependsOn，且被依賴的 todo 存在且未完成，則回傳原 todos（不變）並帶回 blockedBy = blockedTodo.id（或 blockedTodo.text）
    - 其餘情況則回傳更新後的 todos（與原 toggleTodo 等價）且 blockedBy 為 undefined
  - 在 UI（src/main.tsx）的 checkbox onChange handler 中呼叫該 helper：
    - 若回傳含 blockedBy，則不要更新清單，並將一個短暫的使用者提示（例如 setDependencyMessage）顯示在畫面（aria-live="polite"）
    - 若允許完成則 setTodos(newTodos)（如現行行為）
- 邊界處理：若 dependsOn 指向的 id 在資料中找不到，視為無依賴（允許完成）。

Acceptance criteria

- 嘗試把一個有 dependsOn（且其目標 todo 未完成）的 todo 標為完成時，不會改變其 completed 狀態。
- UI 顯示一段可存取的提示（例如："Cannot complete — depends on 'Buy groceries'"），該提示可由 screen reader 讀出（aria-live）。
- 當被依賴的 todo 完成後，原本被阻擋的 todo 可以正常被完成。
- 如果 dependsOn 指向一個不存在的 id，則允許完成（並在測試中驗證）。
- 新增單元測試（建議檔名：src/dependency-block.test.ts）覆蓋阻斷/允許情境與提示顯示。

Suggested labels: feature, behavior, tests

Dependencies: Issue 2（在 UI 能設定 dependsOn 後進行驗證；與 Issue 4 並行可進行）

Notes

- 設計上避免把邏輯散落在 UI：helper 函式應保持 pure，UI 層負責顯示訊息。
- 如果希望訊息更持久或有操作選項（例如 "Force complete"），視為 enhancement，不在本次 scope。