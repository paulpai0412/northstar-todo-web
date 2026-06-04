export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
};

export type TodoFilter = "all" | "active" | "completed";

export function addTodo(todos: Todo[], text: string, dueDate = ""): Todo[] {
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

export function countActiveTodos(todos: Todo[]): number {
  return todos.filter((todo) => !todo.completed).length;
}

export function clearCompletedTodos(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}

function createTodoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
