import { describe, expect, it } from "vitest";
import { addTodo, isTodoOverdue, toggleTodo, type Todo } from "./todos";

describe("todo core logic", () => {
  it("rejects empty or whitespace-only todo text", () => {
    const existing: Todo[] = [];

    expect(addTodo(existing, "")).toEqual(existing);
    expect(addTodo(existing, "   ")).toEqual(existing);
  });

  it("adds trimmed todo text as an incomplete item", () => {
    const [todo] = addTodo([], "  Write tests  ");

    expect(todo.text).toBe("Write tests");
    expect(todo.completed).toBe(false);
    expect(todo.dueDate).toBeUndefined();
    expect(todo.id).toEqual(expect.any(String));
  });

  it("adds a due date when provided", () => {
    const [todo] = addTodo([], "Pay invoice", "2026-06-12");

    expect(todo.text).toBe("Pay invoice");
    expect(todo.dueDate).toBe("2026-06-12");
  });

  it("toggles the matching todo completion state", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false, dueDate: "2026-06-12" },
      { id: "second", text: "Second", completed: true }
    ];

    expect(toggleTodo(todos, "first")).toEqual([
      { id: "first", text: "First", completed: true, dueDate: "2026-06-12" },
      { id: "second", text: "Second", completed: true }
    ]);
  });

  it("marks only active todos with past due dates as overdue", () => {
    const today = new Date("2026-06-04T12:00:00");

    expect(
      isTodoOverdue(
        { id: "past", text: "Past", completed: false, dueDate: "2026-06-03" },
        today
      )
    ).toBe(true);
    expect(
      isTodoOverdue(
        { id: "done", text: "Done", completed: true, dueDate: "2026-06-03" },
        today
      )
    ).toBe(false);
    expect(
      isTodoOverdue(
        { id: "today", text: "Today", completed: false, dueDate: "2026-06-04" },
        today
      )
    ).toBe(false);
    expect(
      isTodoOverdue({ id: "none", text: "None", completed: false }, today)
    ).toBe(false);
  });
});
