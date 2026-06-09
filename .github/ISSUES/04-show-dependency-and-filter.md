# 在列表顯示依賴關係並提供快速導引 + '有依賴' 篩選

Summary

在 todo 列表中顯示每個 todo 的依賴（若有），提供點擊後跳轉到被依賴 todo 的快速導引（scroll/highlight），並新增一個用來快速過濾出「有依賴」項目的按鈕或切換。

Why

可視化依賴狀態有助於使用者理解為何某些項目被阻擋，並快速定位前置項目以採取行動。

Technical notes / Implementation hints

- 主要檔案：src/main.tsx
- 顯示：在每個 todo 的 meta 區（現有 .todo-meta）加入一段短 label："Depends on: <text>"。若找不到被依賴 todo，顯示 "Depends on: Unknown"。
- 導引：
  - 為每個 <li> 加上 id（例如 id={`todo-${todo.id}`），以便使用 document.getElementById(targetId)?.scrollIntoView()。
  - 點擊 label 時執行 scrollIntoView 並給 target 加上臨時 highlight class（例如 .dependency-highlight），可用 setTimeout 自動移除（或用 CSS animation）。
- 篩選：
  - 不必改動現有 filter enum（可在 toolbar 加一個獨立切換按鈕）例如 "Show only with dependencies"（toggle），或新增一個 filter option "Has dependency"。
  - 當切換開啟時，visibleTodos 需只包含 todos.filter(t => !!t.dependsOn)
- Accessibility：label 需包含明確文字並可被鍵盤操作（使用 <button> 或 <a role="button">），highlight 發生時 aria-live 可告知使用者已導向。

Acceptance criteria

- 每個有 dependsOn 的 todo 在清單上顯示 "Depends on: <text>"，若被依賴 todo 找不到則顯示 "Unknown"。
- 點擊該 label 將畫面捲動至被依賴的 todo 並短暫高亮（可識別的樣式）。
- 工具列上有一個可切換的按鈕以只顯示有依賴的 todos；切換會即時過濾清單。
- 新增 DOM 測試（可與 Issue 2/3 的測試共用）驗證 label 呈現、點擊導引與篩選行為。

Suggested labels: feature, ui, accessibility, tests

Dependencies: Issue 2（需要先能在資料中設置 dependsOn；與 Issue 3 並行）

Notes

- 實作上較簡單且 UX 收益高：把導引與篩選做對使用者非常友好，利於後續 debug 與測試依賴性行為。