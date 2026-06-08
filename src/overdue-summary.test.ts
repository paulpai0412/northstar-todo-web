// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

async function renderApp() {
  document.body.innerHTML = '<div id="root"></div>';

  await import("./main");
  await new Promise((resolve) => setTimeout(resolve, 20));
}

function setStoredTodos(todos: Array<Record<string, unknown>>) {
  localStorage.setItem("northstar-todo-web.todos", JSON.stringify(todos));
}

function overdueSummaryText(): string | null {
  return document.querySelector<HTMLParagraphElement>(".overdue-summary")?.textContent?.trim() ?? null;
}

describe("overdue summary", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("shows overdue count when active todos are past due", async () => {
    setStoredTodos([
      {
        id: "past",
        text: "Past work",
        completed: false,
        priority: "normal",
        dueDate: "2000-01-01"
      },
      {
        id: "future",
        text: "Future work",
        completed: false,
        priority: "normal",
        dueDate: "2999-01-01"
      }
    ]);

    await renderApp();

    expect(document.querySelector(".todo-panel")).toBeTruthy();
    expect([...document.querySelectorAll(".todo-item")]).toHaveLength(2);
    expect([...document.querySelectorAll(".todo-item.overdue")]).toHaveLength(1);
    expect(overdueSummaryText()).toBe("1 todo is overdue");
  });

  it("hides overdue summary when no todos are overdue", async () => {
    setStoredTodos([
      {
        id: "future",
        text: "Future task",
        completed: false,
        priority: "normal",
        dueDate: "2999-01-01"
      }
    ]);

    await renderApp();

    expect(overdueSummaryText()).toBeNull();
  });
});
