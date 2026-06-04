export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
};

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

function createTodoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
