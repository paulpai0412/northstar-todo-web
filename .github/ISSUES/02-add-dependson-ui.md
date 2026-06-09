# 在 Edit 與 New Todo 表單加入 “Depends on” 選擇器（兩階段）

概述

將依賴設定加入 UI：分成兩個序列子任務（先完成編輯端，再完成新增端），確保使用者可以為現有 todo 指定其依賴的另一個 todo。

Subtasks

- [ ] 2.1 — 在 **編輯 Todo**（edit）表單加入 "Depends on" 選擇器，允許選取其他 todo 作為被依賴者（不能選自己）。
- [ ] 2.2 — 在 **新增 Todo**（new）表單加入相同的 "Depends on" 選擇器，預設為 None（無依賴）。

Technical notes / Implementation hints

- 相關檔案：src/main.tsx（UI）、src/todos.ts（若需要，擴充 add/edit helper）
- 編輯表單位於 main.tsx 的 todo 列渲染分支（isEditing 分支）。在該表單中加入一個 <select>（或等價 UI），內容為當前 todos 列表（排除正在編輯的自身 id）。
- 新增表單在頁首的 todo input row（handleSubmit）加入相同的 <select>，預設無依賴。
- 儲存行為：目前有 editTodoText 與 addTodo helper。為了同時更新 text 與 dependsOn 建議：新增或擴充一個通用的 editTodo(todos, id, updates) 函式來更新多個欄位（或改寫 editTodoText 以接受 dependsOn）。
- 驗證：
  - 禁止 self-dependency（在選單中移除自己，或在儲存時檢查並顯示錯誤）。
  - 最低限度：只阻止 self-dependency；更複雜的環路檢測（多層 cycle）可作為 future enhancement。
- Accessibility：標籤與 select 的 aria-label/aria-describedby 準備就緒，錯誤訊息使用 inline text 並可被 screen reader 探測。

Acceptance criteria

- 2.1（編輯）：編輯表單顯示 "Depends on" 選擇器，列出所有其他 todos（不含自己）；選擇後按 Save，依賴 id 寫回 todo 並持久化到 localStorage。
- 2.1：嘗試選自己時會被禁止並顯示友善錯誤（或直接不可選）。
- 2.2（新增）：新增表單也顯示 "Depends on"，可選 None；新增成功的新 todo 包含 dependsOn（若選擇）。
- 2.2：新增表單的互動流程（focus、清空欄位等）與現有行為一致。
- 為 2.1 與 2.2 各新增至少一個 DOM 測試（建議檔名：src/dependency-ui.test.ts）驗證欄位可見、選項正確、儲存後 localStorage 含 dependson 值。

Suggested labels: feature, ui, dependencies, tests

Dependencies: Issue 1（必須先完成資料欄位）

Notes

- 建議把 2.1 與 2.2 寫成同一個 issue 內的 checklist（如上），開發時可先 PR 2.1、再 PR 2.2；兩者程式上共享 model 支援（Issue 1）。
- 若不想改 edit helper 的 shape，也可以在 UI 層直接操作 todos 陣列，再呼叫 setTodos(newTodos)（保持修改集中）。