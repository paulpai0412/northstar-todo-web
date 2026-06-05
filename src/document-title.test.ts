// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

async function renderApp() {
  vi.resetModules();
  localStorage.clear();
  document.head.innerHTML = "";
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

function clickTodoToggle(text: string) {
  const todoItem = [...document.querySelectorAll(".todo-item")].find((element) =>
    element.textContent?.includes(text)
  ) as HTMLElement | undefined;

  if (!todoItem) {
    throw new Error(`Todo not found: ${text}`);
  }

  const toggle = todoItem.querySelector('input[type="checkbox"]') as
    | HTMLInputElement
    | null;

  if (!toggle) {
    throw new Error(`Toggle not found for todo: ${text}`);
  }

  toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

async function flushUi() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("document title active-count sync", () => {
  beforeEach(() => {
    localStorage.clear();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  it("updates the title for zero, one, and many active todos as todos change", async () => {
    await renderApp();
    await flushUi();

    expect(document.title).toBe("Todo Web");

    clickButton("Buy groceries");
    await flushUi();
    clickButton("Add");
    await flushUi();
    expect(document.title).toBe("Todo Web (1 active)");

    clickButton("Review notes");
    await flushUi();
    clickButton("Add");
    await flushUi();
    expect(document.title).toBe("Todo Web (2 active)");

    clickTodoToggle("Buy groceries");
    await flushUi();
    expect(document.title).toBe("Todo Web (1 active)");

    clickTodoToggle("Review notes");
    await flushUi();
    expect(document.title).toBe("Todo Web");

    clickTodoToggle("Review notes");
    await flushUi();
    expect(document.title).toBe("Todo Web (1 active)");

    clickButton("Clear completed");
    await flushUi();
    expect(document.title).toBe("Todo Web (1 active)");

    clickTodoToggle("Review notes");
    await flushUi();
    expect(document.title).toBe("Todo Web");

    clickButton("Clear completed");
    await flushUi();
    expect(document.title).toBe("Todo Web");
  });
});
