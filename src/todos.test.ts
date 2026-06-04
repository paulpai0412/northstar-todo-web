import { describe, expect, it } from "vitest";
import { addTodo, toggleTodo, type Todo } from "./todos";

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
    expect(todo.id).toEqual(expect.any(String));
  });

  it("toggles the matching todo completion state", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false },
      { id: "second", text: "Second", completed: true }
    ];

    expect(toggleTodo(todos, "first")).toEqual([
      { id: "first", text: "First", completed: true },
      { id: "second", text: "Second", completed: true }
    ]);
  });
});
