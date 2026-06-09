# 端到端整合測試：依賴流程（建立 → 被阻擋 → 完成依賴 → 再完成）

Summary

新增一組整合/高階 DOM 測試，驗證完整的 dependency workflow：建立 A 與 B，將 B.dependsOn = A，嘗試完成 B（應被阻擋），完成 A，然後完成 B，並驗證這些狀態會被 persisted 並在刷新後保留。

Why

此測試保證 model/UI/行為三層整合正確，並可以在 CI 中捕捉 regression。

Implementation hints (Vitest + jsdom)

- 建議檔案：src/dependency-integration.test.ts
- 測試流程（步驟）：
  1. vi.resetModules(); localStorage.clear(); document.body.innerHTML = '<div id="root"></div>'
  2. import ./main 並等待 React render（如現有測試模式）
  3. 新增 Todo A（可使用 quick-add button 或填 input 再按 Add）
  4. 新增 Todo B
  5. 編輯 B，設定 dependsOn = A（若 Issue 2 尚未實作，可直接透過 localStorage 操作模擬依賴，或用 helper 在測試中直接呼叫 addTodo/normalize）
  6. 驗證 B 在清單上顯示 "Depends on: A"（Issue 4）
  7. 嘗試勾選 B 的 checkbox → 驗證 B 未被標為 completed，且顯示阻擋訊息（Issue 3）
  8. 勾選 A 的 checkbox → 驗證 A 被標為 completed
  9. 再次勾選 B → 驗證 B 現在可以被標為 completed
  10. 模擬刷新（vi.resetModules(); document.body.innerHTML = '<div id="root"></div>'; import ./main; 等待）並驗證 persisted 的狀態（A、B 的 completed 與 dependsOn）仍如預期

Acceptance criteria

- 測試腳本覆蓋建立、設定依賴、被阻擋、解除阻擋與刷新後 persistence 的完整流程。
- 測試可以在 CI（npm test）中執行並通過（若其它相關 issue 的實作尚未完成，測試應使用可行的替代策略來模擬狀態，例如直接寫入 localStorage）。
- 建議新增測試檔案路徑：src/dependency-integration.test.ts

Suggested labels: tests, integration, dependencies

Dependencies: Issue 3 & Issue 4（需要阻擋機制與 UI 顯示/導引完成後再完整驗證）

Notes

- 若在短期內無法實作全部 UI，測試可先以 model-level 的方式驗證主要行為（直接操作 todos 陣列 / localStorage），再在 UI 實作完成後把測試調整為 DOM-level。