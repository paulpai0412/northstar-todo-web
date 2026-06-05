export type TodoPriority = "low" | "normal" | "high";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: string;
  dueDate?: string;
  priority: TodoPriority;
};

export type TodoFilter = "all" | "active" | "completed";

export function addTodo(
  todos: Todo[],
  text: string,
  dueDate = "",
  priority: TodoPriority = "normal",
  createdAt = new Date()
): Todo[] {
  const trimmedText = text.trim();
  const trimmedDueDate = dueDate.trim();

  if (!trimmedText) {
    return todos;
  }

  return [
    {
      id: createTodoId(),
      text: trimmedText,
      completed: false,
      createdAt: createdAt.toISOString(),
      priority,
      ...(trimmedDueDate ? { dueDate: trimmedDueDate } : {})
    },
    ...todos
  ];
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

export function editTodoText(todos: Todo[], id: string, text: string): Todo[] {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return todos;
  }

  return todos.map((todo) =>
    todo.id === id ? { ...todo, text: trimmedText } : todo
  );
}

export function isTodoOverdue(todo: Todo, today = new Date()): boolean {
  if (todo.completed || !todo.dueDate) {
    return false;
  }

  return todo.dueDate < formatDateInputValue(today);
}

export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  if (filter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (filter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

export function getVisibleTodos(
  todos: Todo[],
  filter: TodoFilter,
  hideCompleted: boolean
): Todo[] {
  const filteredTodos = filterTodos(todos, filter);

  if (!hideCompleted) {
    return filteredTodos;
  }

  return filteredTodos.filter((todo) => !todo.completed);
}

export function getEmptyStateMessage(filter: TodoFilter): string {
  if (filter === "active") {
    return "No active todos.";
  }

  if (filter === "completed") {
    return "No completed todos yet.";
  }

  return "No todos yet. Add one above.";
}

export function countActiveTodos(todos: Todo[]): number {
  return todos.filter((todo) => !todo.completed).length;
}

export function countTotalTodos(todos: Todo[]): number {
  return todos.length;
}

export function countCompletedTodos(todos: Todo[]): number {
  return todos.filter((todo) => todo.completed).length;
}

export type TodoProgress = {
  total: number;
  active: number;
  completed: number;
};

export type TodoCompletionRatio = TodoProgress & {
  completionPercentage: number;
};

export function getTodoProgress(todos: Todo[]): TodoProgress {
  const total = countTotalTodos(todos);
  const completed = countCompletedTodos(todos);

  return {
    total,
    completed,
    active: total - completed
  };
}

export function getTodoCompletionRatio(todos: Todo[]): TodoCompletionRatio {
  const progress = getTodoProgress(todos);

  return {
    ...progress,
    completionPercentage:
      progress.total === 0 ? 0 : (progress.completed / progress.total) * 100
  };
}

export function clearCompletedTodos(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}

export function normalizeTodos(value: unknown): Todo[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isStoredTodo(item)) {
      return [];
    }

    const priority = "priority" in item ? item.priority : "normal";
    if (!isTodoPriority(priority)) {
      return [];
    }

    return [
      {
        id: item.id,
        text: item.text,
        completed: item.completed,
        priority,
        ...("createdAt" in item && item.createdAt
          ? { createdAt: item.createdAt }
          : {}),
        ...("dueDate" in item && item.dueDate ? { dueDate: item.dueDate } : {})
      }
    ];
  });
}

function isStoredTodo(value: unknown): value is {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: string;
  dueDate?: string;
  priority?: unknown;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "text" in value &&
    "completed" in value &&
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.completed === "boolean" &&
    (!("createdAt" in value) || typeof value.createdAt === "string") &&
    (!("dueDate" in value) || typeof value.dueDate === "string")
  );
}

function isTodoPriority(value: unknown): value is TodoPriority {
  return value === "low" || value === "normal" || value === "high";
}

function createTodoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
