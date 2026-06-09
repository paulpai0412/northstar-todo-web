# Todo Web 可見清單排序功能規格 Implementation Plan

> **Northstar planning contract:** This plan is a runtime-ready execution contract for Northstar operators and workers. It turns an approved spec into issue-sized implementation tasks, verification evidence, Project projection expectations, and release gates without requiring an external planning skill.

**Goal:** Deliver Todo Web 可見清單排序功能規格 from the approved PRD/spec as independently verifiable Northstar work.

**Architecture:** Keep planning as a deterministic contract pipeline. Preserve Northstar runtime boundaries by generating issue-ready vertical slices without embedding agent-specific skill execution into the runtime.

**Tech Stack:** Northstar CLI, GitHub issues, Markdown PRD/spec documents, implementation plans, and runtime/browser verification evidence.

---

Source Spec: /home/timmypai/apps/northstar-todo-web/.northstar/planning/2026-06-08-visible-sort-spec.md

## Northstar Planning Contract
- Source contract: northstar:implementation-planning.
- Each task must be small enough to become one GitHub issue or a clearly ordered issue dependency.
- Each task must include exact commands, expected outcomes, verification evidence, and a commit boundary.
- Each task must state the runtime or Project evidence affected when the work changes orchestration, release, recovery, or browser verification.
- Downstream `plan-issues` converts these tasks into Northstar issue-slicing vertical slices.

## Runtime Workflow Map
- Default domain: software_development.
- Default workflow: issue_to_pr_release unless the consumer config specifies another workflow.
- Expected stage flow: intake -> implementation -> verification -> release -> completed.
- Evidence required at completion: test output, browser/runtime evidence when required by the spec, PR URL, head commit, merge SHA, and final Project projection.

## Issue Generation Guidance
- Preserve task headings and Depends-On markers; they are consumed by issue generation.
- Prefer vertical slices that produce inspectable behavior over horizontal module-only tickets.
- Mark tasks needing user input as HITL; otherwise keep tasks AFK-capable with explicit verification commands.

### Task 1: Define Todo Web 可見清單排序功能規格 Contracts

Objective: Establish the data, UI, and runtime contract needed by the feature.

Scope:
- Define inputs, outputs, state transitions, and acceptance evidence.

Acceptance Criteria:
- 使用者可透過工具列 Sort 開關啟用/關閉排序。

Quantitative Metrics:
- 新增至少 4 個測試案例覆蓋：排序規則、completed 後置、可見範圍排序、sort 狀態持久化。

Required Tests:
- `npm test`

- [ ] **Step 1: Write the failing contract test**

Run: `node --disable-warning=ExperimentalWarning tests/skills/northstar-spec-plan-intake.test.ts`
Expected: FAIL until the contract behavior exists.

- [ ] **Step 2: Implement the minimal contract behavior**

Use existing Northstar helpers and keep secrets out of generated artifacts.

- [ ] **Step 3: Run targeted verification**

Run: `node --disable-warning=ExperimentalWarning tests/skills/northstar-spec-plan-intake.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

Commit the contract change with its focused tests.

### Task 2: Implement Todo Web 可見清單排序功能規格 Workflow

Depends-On: Task 1

Objective: Implement the behavior described by the spec and contracts.

Scope:
- Add the production behavior behind the existing Northstar architecture boundaries.

Acceptance Criteria:
- 使用者可透過工具列 Sort 開關啟用/關閉排序。

Quantitative Metrics:
- 新增至少 4 個測試案例覆蓋：排序規則、completed 後置、可見範圍排序、sort 狀態持久化。

Required Tests:
- `npm test`

- [ ] **Step 1: Write the failing workflow test**

Run: `npm test`
Expected: FAIL until the workflow behavior exists.

- [ ] **Step 2: Implement the workflow behavior**

Keep the implementation behind existing Northstar driver and CLI boundaries.

- [ ] **Step 3: Run full verification**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

Commit the workflow behavior with its focused tests.

### Task 3: Verify Todo Web 可見清單排序功能規格 Evidence

Depends-On: Task 2

Objective: Prove completion with the required automated and browser evidence.

Scope:
- Run required tests and record evidence expected by the workflow.

Acceptance Criteria:
- Required tests pass.
- Browser or runtime evidence is captured when required.

Quantitative Metrics:
- verification_evidence_recorded = 1

Required Tests:
- `npm test`

- [ ] **Step 1: Run all required tests**

Run the commands listed under Required Tests.

- [ ] **Step 2: Capture browser or runtime evidence**

Record evidence required by the approved PRD/spec and Northstar workflow.

- [ ] **Step 3: Commit evidence wiring**

Commit only durable evidence wiring or documentation needed by the release path.