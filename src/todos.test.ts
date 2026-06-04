import { describe, expect, it } from "vitest";
import {
  addTodo,
  clearCompletedTodos,
  countActiveTodos,
  countTotalTodos,
  filterTodos,
  isTodoOverdue,
  normalizeTodos,
  toggleTodo,
  type Todo
} from "./todos";

describe("todo core logic", () => {
  it("rejects empty or whitespace-only todo text", () => {
    const existing: Todo[] = [];

    expect(addTodo(existing, "")).toEqual(existing);
    expect(addTodo(existing, "   ")).toEqual(existing);
  });

  it("adds trimmed todo text as an incomplete item", () => {
    const [todo] = addTodo(
      [],
      "  Write tests  ",
      "",
      "normal",
      new Date("2026-06-04T10:30:00.000Z")
    );

    expect(todo.text).toBe("Write tests");
    expect(todo.completed).toBe(false);
    expect(todo.dueDate).toBeUndefined();
    expect(todo.priority).toBe("normal");
    expect(todo.createdAt).toBe("2026-06-04T10:30:00.000Z");
    expect(todo.id).toEqual(expect.any(String));
  });

  it("adds an explicit priority when provided", () => {
    const [highPriorityTodo] = addTodo([], "Review launch plan", "", "high");
    const [lowPriorityTodo] = addTodo([], "Read newsletter", "", "low");

    expect(highPriorityTodo.priority).toBe("high");
    expect(lowPriorityTodo.priority).toBe("low");
  });

  it("adds a due date when provided", () => {
    const [todo] = addTodo([], "Pay invoice", "2026-06-12", "high");

    expect(todo.text).toBe("Pay invoice");
    expect(todo.dueDate).toBe("2026-06-12");
    expect(todo.priority).toBe("high");
  });

  it("toggles the matching todo completion state", () => {
    const todos: Todo[] = [
      {
        id: "first",
        text: "First",
        completed: false,
        dueDate: "2026-06-12",
        priority: "high"
      },
      { id: "second", text: "Second", completed: true, priority: "normal" }
    ];

    expect(toggleTodo(todos, "first")).toEqual([
      {
        id: "first",
        text: "First",
        completed: true,
        dueDate: "2026-06-12",
        priority: "high"
      },
      { id: "second", text: "Second", completed: true, priority: "normal" }
    ]);
  });

  it("marks only active todos with past due dates as overdue", () => {
    const today = new Date("2026-06-04T12:00:00");

    expect(
      isTodoOverdue(
        {
          id: "past",
          text: "Past",
          completed: false,
          dueDate: "2026-06-03",
          priority: "normal"
        },
        today
      )
    ).toBe(true);
    expect(
      isTodoOverdue(
        {
          id: "done",
          text: "Done",
          completed: true,
          dueDate: "2026-06-03",
          priority: "normal"
        },
        today
      )
    ).toBe(false);
    expect(
      isTodoOverdue(
        {
          id: "today",
          text: "Today",
          completed: false,
          dueDate: "2026-06-04",
          priority: "normal"
        },
        today
      )
    ).toBe(false);
    expect(
      isTodoOverdue(
        { id: "none", text: "None", completed: false, priority: "normal" },
        today
      )
    ).toBe(false);
  });

  it("filters todos by all, active, and completed states", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "second", text: "Second", completed: true, priority: "normal" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ];

    expect(filterTodos(todos, "all")).toEqual(todos);
    expect(filterTodos(todos, "active")).toEqual([
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ]);
    expect(filterTodos(todos, "completed")).toEqual([
      { id: "second", text: "Second", completed: true, priority: "normal" }
    ]);
  });

  it("counts incomplete todos", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "second", text: "Second", completed: true, priority: "normal" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ];

    expect(countActiveTodos(todos)).toBe(2);
  });

  it("counts all todos regardless of completion state", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "second", text: "Second", completed: true, priority: "normal" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ];

    expect(countTotalTodos(todos)).toBe(3);
  });

  it("clears completed todos and preserves active todos", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "second", text: "Second", completed: true, priority: "normal" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ];

    expect(clearCompletedTodos(todos)).toEqual([
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ]);
  });

  it("normalizes stored todos with valid priority data", () => {
    expect(
      normalizeTodos([
        {
          id: "high",
          text: "High",
          completed: false,
          priority: "high",
          createdAt: "2026-06-04T10:30:00.000Z"
        },
        { id: "low", text: "Low", completed: false, priority: "low" },
        { id: "legacy", text: "Legacy", completed: true },
        { id: "bad", text: "Bad", completed: false, priority: "urgent" }
      ])
    ).toEqual([
      {
        id: "high",
        text: "High",
        completed: false,
        priority: "high",
        createdAt: "2026-06-04T10:30:00.000Z"
      },
      { id: "low", text: "Low", completed: false, priority: "low" },
      { id: "legacy", text: "Legacy", completed: true, priority: "normal" }
    ]);
  });
});
