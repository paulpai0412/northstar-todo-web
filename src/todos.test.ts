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
  getTodoDueDateSummary,
  getTodoProgress,
  isTodoOverdue,
  normalizeTodos,
  todoMatchesTextQuery,
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

  it("matches all todos when query is empty or whitespace only", () => {
    const todo: Todo = {
      id: "todo",
      text: "Review release notes",
      completed: true,
      createdAt: "2026-06-04T10:30:00.000Z",
      dueDate: "2026-06-12",
      priority: "high"
    };

    expect(todoMatchesTextQuery(todo, "")).toBe(true);
    expect(todoMatchesTextQuery(todo, "   ")).toBe(true);
  });

  it("matches todo text case-insensitively and trims query", () => {
    const todo: Todo = {
      id: "todo",
      text: "Review release notes",
      completed: false,
      priority: "normal"
    };

    expect(todoMatchesTextQuery(todo, "REVIEW")).toBe(true);
    expect(todoMatchesTextQuery(todo, "  notes  ")).toBe(true);
  });

  it("returns false when todo text does not include the query", () => {
    const todo: Todo = {
      id: "todo",
      text: "Review release notes",
      completed: false,
      priority: "normal"
    };

    expect(todoMatchesTextQuery(todo, "meeting")).toBe(false);
  });

  it("does not mutate the todo while matching text queries", () => {
    const todo: Todo = {
      id: "todo",
      text: "Review release notes",
      completed: true,
      createdAt: "2026-06-04T10:30:00.000Z",
      dueDate: "2026-06-12",
      priority: "high"
    };
    const originalTodo = { ...todo };

    todoMatchesTextQuery(todo, "review");

    expect(todo).toEqual(originalTodo);
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

  it("returns an empty-state message for each filter", () => {
    expect(getEmptyStateMessage("all")).toBe("No todos yet. Add one above.");
    expect(getEmptyStateMessage("active")).toBe("No active todos.");
    expect(getEmptyStateMessage("completed")).toBe("No completed todos yet.");
  });

  it("returns zero due-date summary counts for empty todo input", () => {
    expect(getTodoDueDateSummary([])).toEqual({
      withDueDate: 0,
      withoutDueDate: 0
    });
  });

  it("summarizes due-date coverage for mixed due and no-due todos", () => {
    const todos: Todo[] = [
      {
        id: "first",
        text: "First",
        completed: false,
        dueDate: "2026-06-12",
        priority: "high",
        createdAt: "2026-06-01T10:00:00.000Z"
      },
      {
        id: "second",
        text: "Second",
        completed: true,
        priority: "normal",
        createdAt: "2026-06-02T10:00:00.000Z"
      },
      {
        id: "third",
        text: "Third",
        completed: true,
        dueDate: "2026-06-20",
        priority: "low"
      },
      {
        id: "fourth",
        text: "Fourth",
        completed: false,
        priority: "high"
      }
    ];

    expect(getTodoDueDateSummary(todos)).toEqual({
      withDueDate: 2,
      withoutDueDate: 2
    });
  });

  it("summarizes all todos as due when each todo has a due date", () => {
    const todos: Todo[] = [
      {
        id: "first",
        text: "First",
        completed: false,
        dueDate: "2026-06-12",
        priority: "high"
      },
      {
        id: "second",
        text: "Second",
        completed: true,
        dueDate: "2026-06-15",
        priority: "normal"
      }
    ];

    expect(getTodoDueDateSummary(todos)).toEqual({
      withDueDate: 2,
      withoutDueDate: 0
    });
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
