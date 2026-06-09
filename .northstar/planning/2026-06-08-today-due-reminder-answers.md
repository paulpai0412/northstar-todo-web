# Planning answers: 2026-06-08 today-due reminder

1. Feature: 提醒機制
2. First version: 只做 UI 內提醒
3. Trigger rule: 到期日當天提醒
4. Display position: 工具列彙總提醒
5. Counting scope: 全部未完成 todos（不受 filter 影響）
6. Timezone basis: 使用者本機時區
7. Copy: `Today due: N`
8. When N=0: 不顯示提醒區塊

## UI Design
### Screen Inventory
- Todo 主畫面（單頁）
- 工具列區塊（counts + filters + actions）

### Layout Decision
- 採用方案 1：提醒放在 summary 區塊第二行。

### Style System
- 輕提醒色（amber 類）顯示 `Today due: N`。
- 與 summary 同字級，不使用 badge 實心底。

### Interaction States
- 有今天到期（N>0）：顯示提醒
- 無今天到期（N=0）：隱藏提醒
- 提醒為純資訊，不可點擊

### ASCII Wireframe
```text
+------------------------------------------------------+
| summary: 8 total, 5 active, 3 completed              |
| Today due: 2                                         |
| [All] [Active] [Completed] [Due today] [Clear done]  |
+------------------------------------------------------+
```
