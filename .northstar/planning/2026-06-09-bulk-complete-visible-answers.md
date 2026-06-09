# Planning answers: 2026-06-09 bulk complete visible

Primary decision: 以 toolbar 的 `Complete visible` 單一按鈕執行可見未完成項目的一次性批次完成。

1. Execution evidence: 測試報告需包含 `npm test` 全綠，且 UI 測試可驗證按鈕 enable/disable 與批次完成結果。
2. Dependency order: 先完成 domain 層可見集合篩選與批次更新，再接 UI 事件綁定與按鈕狀態，最後補整合測試。
3. Parallelism: 測試案例可在功能骨架確立後與 UI 樣式微調並行。

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

### ASCII Wireframe
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
