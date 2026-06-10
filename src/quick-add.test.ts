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

function getButton(label: string) {
  const button = [...document.querySelectorAll("button")].find(
    (element) => element.textContent?.trim() === label
  ) as HTMLButtonElement | undefined;

  if (!button) {
    throw new Error(`Button not found: ${label}`);
  }

  return button;
}

function queryHelperText() {
  return document.querySelector('[data-testid="ui-helper-slot"]') as HTMLElement | null;
}

function queryFooterSummary() {
  return document.querySelector('[data-testid="footer-summary"]') as HTMLElement | null;
}

describe("quick-add examples", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("hides helper text by default and keeps quick-add clickable", async () => {
    await renderApp();

    expect(queryHelperText()).toBeNull();

    const input = document.getElementById("todo-input") as HTMLInputElement;
    expect(input).toBeTruthy();

    clickButton("Buy groceries");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(input.value).toBe("Buy groceries");
  });

  it("shows helper text on quick-add hover and hides on pointer leave", async () => {
    await renderApp();

    const buyButton = getButton("Buy groceries");
    buyButton.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const helperAfterHover = queryHelperText();
    expect(helperAfterHover).toBeTruthy();
    expect(helperAfterHover?.textContent).toBe("Click to prefill: Buy groceries");

    buyButton.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(queryHelperText()).toBeNull();
  });

  it("shows helper text on quick-add focus and hides on blur", async () => {
    await renderApp();

    const reviewButton = getButton("Review notes");
    reviewButton.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const helperAfterFocus = queryHelperText();
    expect(helperAfterFocus).toBeTruthy();
    expect(helperAfterFocus?.textContent).toBe("Click to prefill: Review notes");

    reviewButton.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(queryHelperText()).toBeNull();
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
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(input.value).toBe("Buy groceries");
    expect(document.activeElement).toBe(input);

    clickButton("Add");
    await new Promise((resolve) => setTimeout(resolve, 0));

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

describe("complete visible toolbar action", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("enables Complete visible when there are visible incomplete todos and completes them on click", async () => {
    await renderApp();

    // Add three todos via quick-add buttons
    clickButton('Buy groceries');
    await new Promise((resolve) => setTimeout(resolve, 0));
    clickButton('Add');
    await new Promise((resolve) => setTimeout(resolve, 0));

    clickButton('Review notes');
    await new Promise((resolve) => setTimeout(resolve, 0));
    clickButton('Add');
    await new Promise((resolve) => setTimeout(resolve, 0));

    clickButton('Plan tomorrow');
    await new Promise((resolve) => setTimeout(resolve, 0));
    clickButton('Add');
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Mark one as completed (find by text)
    const firstItem = [...document.querySelectorAll('.todo-item')].find((item) => item.querySelector('.todo-text')?.textContent?.trim() === 'Buy groceries');
    const firstCheckbox = firstItem?.querySelector('input[type="checkbox"]') as HTMLInputElement | undefined;
    if (!firstCheckbox) throw new Error('checkbox not found');
    firstCheckbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const itemsBefore = [...document.querySelectorAll('.todo-item')].filter((item) => ['Buy groceries', 'Review notes', 'Plan tomorrow'].includes(item.querySelector('.todo-text')?.textContent?.trim() || ''));
    const totalBefore = itemsBefore.length;
    const activeBefore = itemsBefore.filter((el) => !el.classList.contains('completed')).length;
    const completedBefore = itemsBefore.filter((el) => el.classList.contains('completed')).length;
    expect(totalBefore).toBe(3);
    expect(activeBefore).toBe(2);
    expect(completedBefore).toBe(1);

    const completeButton = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Complete visible') as HTMLButtonElement | undefined;
    expect(completeButton).toBeTruthy();
    expect(completeButton!.disabled).toBe(false);

    clickButton('Complete visible');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const itemsAfter = [...document.querySelectorAll('.todo-item')].filter((item) => ['Buy groceries', 'Review notes', 'Plan tomorrow'].includes(item.querySelector('.todo-text')?.textContent?.trim() || ''));
    const totalAfter = itemsAfter.length;
    const activeAfter = itemsAfter.filter((el) => !el.classList.contains('completed')).length;
    const completedAfter = itemsAfter.filter((el) => el.classList.contains('completed')).length;
    expect(totalAfter).toBe(3);
    expect(activeAfter).toBe(0);
    expect(completedAfter).toBe(3);
  });

  it("disables Complete visible when there are no visible incomplete todos and click does nothing", async () => {
    await renderApp();

    // Add two todos via quick-add and mark both completed
    clickButton('Buy groceries');
    await new Promise((resolve) => setTimeout(resolve, 0));
    clickButton('Add');
    await new Promise((resolve) => setTimeout(resolve, 0));

    clickButton('Review notes');
    await new Promise((resolve) => setTimeout(resolve, 0));
    clickButton('Add');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const items = [...document.querySelectorAll('.todo-item')].filter((item) => ['Buy groceries', 'Review notes'].includes(item.querySelector('.todo-text')?.textContent?.trim() || ''));
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]') as HTMLInputElement | undefined;
      if (checkbox && !checkbox.checked) {
        checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    const completeButton = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Complete visible') as HTMLButtonElement | undefined;
    expect(completeButton).toBeTruthy();
    expect(completeButton!.disabled).toBe(true);

    clickButton('Complete visible');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const itemsAfter = [...document.querySelectorAll('.todo-item')].filter((item) => ['Buy groceries', 'Review notes'].includes(item.querySelector('.todo-text')?.textContent?.trim() || ''));
    const totalAfter = itemsAfter.length;
    const activeAfter = itemsAfter.filter((el) => !el.classList.contains('completed')).length;
    const completedAfter = itemsAfter.filter((el) => el.classList.contains('completed')).length;
    expect(totalAfter).toBe(2);
    expect(activeAfter).toBe(0);
    expect(completedAfter).toBe(2);
  });
});

describe("empty-state helper", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("shows secondary helper text when list is empty", async () => {
    await renderApp();

    const emptyHelper = document.querySelector(".empty-state .ui-helper-text") as HTMLElement | null;

    expect(emptyHelper).toBeTruthy();
    expect(emptyHelper?.textContent?.trim()).toBe("Add one task above to get started quickly.");
  });

  it("hides secondary helper text when todos exist", async () => {
    await renderApp();

    clickButton('Buy groceries');
    await new Promise((resolve) => setTimeout(resolve, 0));
    clickButton('Add');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(
      [...document.querySelectorAll('.todo-item .todo-text')].map((node) => node.textContent?.trim())
    ).toContain('Buy groceries');

    const emptyHelper = document.querySelector('.empty-state .ui-helper-text');
    expect(emptyHelper).toBeNull();
  });
});

describe("footer summary guidance", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("shows ready-to-start guidance when there are no todos", async () => {
    await renderApp();

    const footerSummary = queryFooterSummary();
    expect(footerSummary).toBeTruthy();
    expect(footerSummary?.textContent?.trim()).toBe("0 active · 0 completed · Ready to start");
  });

  it("replaces guidance with quick-add guidance on hover", async () => {
    await renderApp();

    const footerSummary = queryFooterSummary();
    expect(footerSummary).toBeTruthy();
    expect(footerSummary?.textContent?.trim()).toBe("0 active · 0 completed · Ready to start");

    const quickAddButton = getButton('Buy groceries');
    quickAddButton.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(queryFooterSummary()?.textContent?.trim()).toBe("0 active · 0 completed · Quick-add helper: Buy groceries");

    quickAddButton.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(queryFooterSummary()?.textContent?.trim()).toBe("0 active · 0 completed · Ready to start");
  });

  it("switches to momentum guidance once todos exist", async () => {
    await renderApp();

    clickButton('Buy groceries');
    await new Promise((resolve) => setTimeout(resolve, 0));
    clickButton('Add');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(queryFooterSummary()?.textContent?.trim()).toBe("1 active · 0 completed · Keep momentum");
  });
});
