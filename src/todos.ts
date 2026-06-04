export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export function addTodo(todos: Todo[], text: string): Todo[] {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return todos;
  }

  return [
    {
      id: createTodoId(),
      text: trimmedText,
      completed: false
    },
    ...todos
  ];
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

function createTodoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
