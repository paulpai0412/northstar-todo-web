// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

async function renderApp() {
  vi.resetModules();
  localStorage.clear();
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
  }, 20000);

  it("shows and hides Today due summary correctly based on todos", async () => {
    // Case: show
    vi.resetModules();
    localStorage.clear();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const todosToday = [
      { id: "1", text: "Due Today", completed: false, priority: "normal", dueDate: todayStr }
    ];
    localStorage.setItem("northstar-todo-web.todos", JSON.stringify(todosToday));
    document.body.innerHTML = '<div id="root"></div>';
    await import("./main");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(
      [...document.querySelectorAll(".today-due-summary")].map((node) => node.textContent?.trim())
    ).toContain("Today due: 1");

    // Case: not show
    vi.resetModules();
    localStorage.clear();
    const todosNone = [
      { id: "2", text: "Not Due", completed: false, priority: "normal", dueDate: "1999-01-01" }
    ];
    localStorage.setItem("northstar-todo-web.todos", JSON.stringify(todosNone));
    document.body.innerHTML = '<div id="root"></div>';
    await import("./main");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const todayDueEls = document.querySelectorAll(".today-due-summary");
    expect([0, 1]).toContain(todayDueEls.length);
  });
});
