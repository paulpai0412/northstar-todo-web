// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

async function renderApp() {
  vi.resetModules();
  localStorage.clear();
  document.title = "Todo Web";
  document.body.innerHTML = '<div id="root"></div>';

  await import("./main");
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function flushReact() {
  await Promise.resolve();
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

async function addTodoFromQuickAdd(label: string) {
  clickButton(label);
  await flushReact();
  clickButton("Add");
}

function toggleTodo(label: string) {
  const todoItem = [...document.querySelectorAll(".todo-item")].find((item) => {
    const todoText = item.querySelector(".todo-text")?.textContent?.trim();
    return todoText === label;
  });

  if (!todoItem) {
    throw new Error(`Todo item not found: ${label}`);
  }

  const checkbox = todoItem.querySelector('input[type="checkbox"]') as
    | HTMLInputElement
    | undefined;
  if (!checkbox) {
    throw new Error(`Todo checkbox not found: ${label}`);
  }

  checkbox.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

describe("document title active-count sync", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    document.title = "Todo Web";
  });

  it("updates title with active count after add/toggle/clear actions", async () => {
    await renderApp();

    expect(document.title).toBe("Todo Web");

    await addTodoFromQuickAdd("Buy groceries");
    await flushReact();
    expect(document.title).toBe("Todo Web (1 active)");

    await addTodoFromQuickAdd("Review notes");
    await flushReact();
    expect(document.title).toBe("Todo Web (2 active)");

    toggleTodo("Buy groceries");
    await flushReact();
    expect(document.title).toBe("Todo Web (1 active)");

    toggleTodo("Buy groceries");
    await flushReact();
    expect(document.title).toBe("Todo Web (2 active)");

    toggleTodo("Buy groceries");
    toggleTodo("Review notes");
    await flushReact();
    expect(document.title).toBe("Todo Web");

    clickButton("Clear completed");
    await flushReact();
    expect(document.title).toBe("Todo Web");
  });
});
