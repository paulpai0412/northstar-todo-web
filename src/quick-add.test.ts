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
});
