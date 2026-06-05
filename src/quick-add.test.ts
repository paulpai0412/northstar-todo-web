// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

async function renderApp({ clearStorage = true }: { clearStorage?: boolean } = {}) {
  vi.resetModules();
  if (clearStorage) {
    localStorage.clear();
  }
  document.body.innerHTML = '<div id="root"></div>';

  await import("./main");
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function clickButton(label: string) {
  const button = [...document.querySelectorAll("button")].find(
    (element) => element.textContent?.trim() === label
  ) as HTMLButtonElement | undefined;

  if (!button) {
    throw new Error(`Button not found: ${label}`);
  }

  button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

function getVisibleTodoTexts(): string[] {
  return [...document.querySelectorAll(".todo-text")].map(
    (node) => node.textContent?.trim() ?? ""
  );
}

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

describe("quick-add examples", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("fills the input from a quick-add example, keeps input focus, and adds normally", async () => {
    await renderApp();

    const input = document.getElementById("todo-input") as HTMLInputElement;
    expect(input).toBeTruthy();

    const quickAddLabels = ["Buy groceries", "Review notes", "Plan tomorrow"];
    for (const label of quickAddLabels) {
      expect(
        [...document.querySelectorAll("button")].some(
          (button) => button.textContent?.trim() === label
        )
      ).toBe(true);
    }

    clickButton("Buy groceries");
    await Promise.resolve();

    expect(input.value).toBe("Buy groceries");
    expect(document.activeElement).toBe(input);

    clickButton("Add");
    await Promise.resolve();

    expect(
      [...document.querySelectorAll(".todo-text")].map((node) => node.textContent?.trim())
    ).toContain("Buy groceries");
  });
});

describe("due-today quick filter", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("shows only todos due today and restores expected list when switching away", async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    localStorage.setItem(
      "northstar-todo-web.todos",
      JSON.stringify([
        {
          id: "today-active",
          text: "Due today active",
          completed: false,
          priority: "normal",
          dueDate: formatDateInputValue(today)
        },
        {
          id: "tomorrow-active",
          text: "Due tomorrow",
          completed: false,
          priority: "high",
          dueDate: formatDateInputValue(tomorrow)
        },
        {
          id: "no-date",
          text: "No due date",
          completed: false,
          priority: "low"
        },
        {
          id: "today-completed",
          text: "Due today completed",
          completed: true,
          priority: "normal",
          dueDate: formatDateInputValue(today)
        }
      ])
    );

    await renderApp({ clearStorage: false });

    expect(getVisibleTodoTexts()).toEqual([
      "Due today active",
      "Due tomorrow",
      "No due date",
      "Due today completed"
    ]);

    clickButton("Due today");
    await Promise.resolve();

    expect(getVisibleTodoTexts()).toEqual(["Due today active", "Due today completed"]);

    clickButton("Hide completed");
    await Promise.resolve();

    expect(getVisibleTodoTexts()).toEqual(["Due today active"]);

    clickButton("All");
    await Promise.resolve();

    expect(getVisibleTodoTexts()).toEqual([
      "Due today active",
      "Due tomorrow",
      "No due date"
    ]);
  });
});
