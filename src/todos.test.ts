import { describe, expect, it } from "vitest";
import {
  addTodo,
  clearCompletedTodos,
  countActiveTodos,
  countCompletedTodos,
  countTotalTodos,
  editTodoText,
  filterTodos,
  getEmptyStateMessage,
  getVisibleTodos,
  getTodoProgress,
  getTodoCompletionRatio,
  getTodoPriorityCounts,
  isTodoOverdue,
  hasOverdueTodos,
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

  it("edits todo text and preserves completion, due-date, and metadata", () => {
    const todos: Todo[] = [
      {
        id: "first",
        text: "First",
        completed: true,
        dueDate: "2026-06-12",
        priority: "high",
        createdAt: "2026-06-04T10:30:00.000Z"
      },
      { id: "second", text: "Second", completed: false, priority: "normal" }
    ];

    expect(editTodoText(todos, "first", "  Updated first  ")).toEqual([
      {
        id: "first",
        text: "Updated first",
        completed: true,
        dueDate: "2026-06-12",
        priority: "high",
        createdAt: "2026-06-04T10:30:00.000Z"
      },
      { id: "second", text: "Second", completed: false, priority: "normal" }
    ]);
  });

  it("rejects empty edited todo text without deleting or changing the todo", () => {
    const todos: Todo[] = [
      {
        id: "first",
        text: "First",
        completed: false,
        dueDate: "2026-06-12",
        priority: "normal"
      }
    ];

    expect(editTodoText(todos, "first", "   ")).toEqual(todos);
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

  it("reports false for empty todo list", () => {
    expect(hasOverdueTodos([])).toBe(false);
  });

  it("reports true when at least one active todo is overdue", () => {
    const today = new Date("2026-06-04T12:00:00");
    const todos: Todo[] = [
      { id: "a", text: "A", completed: false, priority: "normal", dueDate: "2026-06-03" },
      { id: "b", text: "B", completed: false, priority: "normal", dueDate: "2026-06-05" }
    ];

    expect(hasOverdueTodos(todos, today)).toBe(true);
  });

  it("ignores completed overdue todos", () => {
    const today = new Date("2026-06-04T12:00:00");
    const todos: Todo[] = [
      { id: "done", text: "Done", completed: true, priority: "normal", dueDate: "2026-06-03" }
    ];

    expect(hasOverdueTodos(todos, today)).toBe(false);
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

  it("hides completed todos while preserving active todos when requested", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "second", text: "Second", completed: true, priority: "normal" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ];

    expect(getVisibleTodos(todos, "all", false)).toEqual(todos);
    expect(getVisibleTodos(todos, "all", true)).toEqual([
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ]);
    expect(getVisibleTodos(todos, "active", true)).toEqual([
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ]);
    expect(getVisibleTodos(todos, "completed", true)).toEqual([]);
  });

  it("shows only todos due today when due-today filter is active", () => {
    const today = new Date("2026-06-04T12:00:00");

    const todos: Todo[] = [
      { id: "a", text: "A", completed: false, priority: "normal", dueDate: "2026-06-04" },
      { id: "b", text: "B", completed: false, priority: "normal", dueDate: "2026-06-05" },
      { id: "c", text: "C", completed: true, priority: "normal", dueDate: "2026-06-04" },
      { id: "d", text: "D", completed: false, priority: "normal" }
    ];

    expect(getVisibleTodos(todos, "due-today", false, today)).toEqual([
      { id: "a", text: "A", completed: false, priority: "normal", dueDate: "2026-06-04" },
      { id: "c", text: "C", completed: true, priority: "normal", dueDate: "2026-06-04" }
    ]);
  });

  it("respects hideCompleted when due-today filter is active", () => {
    const today = new Date("2026-06-04T12:00:00");

    const todos: Todo[] = [
      { id: "a", text: "A", completed: false, priority: "normal", dueDate: "2026-06-04" },
      { id: "b", text: "B", completed: false, priority: "normal", dueDate: "2026-06-05" },
      { id: "c", text: "C", completed: true, priority: "normal", dueDate: "2026-06-04" },
      { id: "d", text: "D", completed: false, priority: "normal" }
    ];

    expect(getVisibleTodos(todos, "due-today", true, today)).toEqual([
      { id: "a", text: "A", completed: false, priority: "normal", dueDate: "2026-06-04" }
    ]);
  });

  it("returns an empty-state message for each filter", () => {
    expect(getEmptyStateMessage("all")).toBe("No todos yet. Add one above.");
    expect(getEmptyStateMessage("active")).toBe("No active todos.");
    expect(getEmptyStateMessage("completed")).toBe("No completed todos yet.");
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

  it("counts completed todos", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "second", text: "Second", completed: true, priority: "normal" },
      { id: "third", text: "Third", completed: true, priority: "low" }
    ];

    expect(countCompletedTodos(todos)).toBe(2);
  });

  it("returns zero priority counts when there are no todos", () => {
    expect(getTodoPriorityCounts([])).toEqual({ low: 0, normal: 0, high: 0 });
  });

  it("counts todos by priority regardless of completion state", () => {
    const todos: Todo[] = [
      { id: "a", text: "A", completed: false, priority: "high" },
      { id: "b", text: "B", completed: true, priority: "normal" },
      { id: "c", text: "C", completed: false, priority: "low" },
      { id: "d", text: "D", completed: true, priority: "high" }
    ];

    expect(getTodoPriorityCounts(todos)).toEqual({ low: 1, normal: 1, high: 2 });
  });

  it("includes completed todos in priority counts", () => {
    const todos: Todo[] = [
      { id: "x", text: "X", completed: true, priority: "low" },
      { id: "y", text: "Y", completed: true, priority: "low" },
      { id: "z", text: "Z", completed: false, priority: "normal" }
    ];

    expect(getTodoPriorityCounts(todos)).toEqual({ low: 2, normal: 1, high: 0 });
  });

  it("returns zero progress counts when there are no todos", () => {
    expect(getTodoProgress([])).toEqual({
      total: 0,
      active: 0,
      completed: 0
    });
  });

  it("returns total, active, and completed progress counts", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: false, priority: "high" },
      { id: "second", text: "Second", completed: true, priority: "normal" },
      { id: "third", text: "Third", completed: false, priority: "low" }
    ];

    expect(getTodoProgress(todos)).toEqual({
      total: 3,
      active: 2,
      completed: 1
    });
  });

  it("returns zero completion ratio data for an empty todo list", () => {
    expect(getTodoCompletionRatio([])).toEqual({
      total: 0,
      completed: 0,
      active: 0,
      completionPercentage: 0
    });
  });

  it("returns completion ratio data for mixed active and completed todos", () => {
    const todos: Todo[] = [
      {
        id: "first",
        text: "First",
        completed: false,
        priority: "high",
        dueDate: "2026-06-12",
        createdAt: "2026-06-01T08:00:00.000Z"
      },
      {
        id: "second",
        text: "Second",
        completed: true,
        priority: "normal",
        dueDate: "2026-06-05",
        createdAt: "2026-06-01T09:00:00.000Z"
      },
      {
        id: "third",
        text: "Third",
        completed: false,
        priority: "low",
        createdAt: "2026-06-01T10:00:00.000Z"
      },
      {
        id: "fourth",
        text: "Fourth",
        completed: true,
        priority: "normal"
      },
      {
        id: "fifth",
        text: "Fifth",
        completed: false,
        priority: "high"
      }
    ];

    expect(getTodoCompletionRatio(todos)).toEqual({
      total: 5,
      completed: 2,
      active: 3,
      completionPercentage: 40
    });
  });

  it("returns 100 percent completion ratio when all todos are completed", () => {
    const todos: Todo[] = [
      { id: "first", text: "First", completed: true, priority: "high" },
      { id: "second", text: "Second", completed: true, priority: "normal" },
      { id: "third", text: "Third", completed: true, priority: "low" }
    ];

    expect(getTodoCompletionRatio(todos)).toEqual({
      total: 3,
      completed: 3,
      active: 0,
      completionPercentage: 100
    });
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
