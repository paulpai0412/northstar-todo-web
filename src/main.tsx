import { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  addTodo,
  clearCompletedTodos,
  countActiveTodos,
  countTotalTodos,
  filterTodos,
  getEmptyStateMessage,
  isTodoOverdue,
  normalizeTodos,
  toggleTodo,
  type Todo,
  type TodoFilter,
  type TodoPriority
} from "./todos";
import "./styles.css";

const STORAGE_KEY = "northstar-todo-web.todos";
const FILTER_OPTIONS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" }
];
const PRIORITY_OPTIONS: { value: TodoPriority; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "low", label: "Low" }
];
const PRIORITY_LABELS: Record<TodoPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High"
};

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [todoText, setTodoText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("normal");
  const [filter, setFilter] = useState<TodoFilter>("all");

  const activeCount = countActiveTodos(todos);
  const totalCount = countTotalTodos(todos);
  const visibleTodos = filterTodos(todos, filter);
  const completedCount = todos.length - activeCount;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTodos((currentTodos) => addTodo(currentTodos, todoText, dueDate, priority));
    if (todoText.trim()) {
      setTodoText("");
      setDueDate("");
      setPriority("normal");
    }
  }

  return (
    <main className="app-shell">
      <section className="todo-panel" aria-labelledby="page-title">
        <div className="intro">
          <p className="section-label">Northstar tracer slice</p>
          <h1 id="page-title">Todo Web</h1>
          <p className="intro-copy">
            Capture a short list, mark work complete, and keep it after refresh.
          </p>
        </div>

        <form className="todo-form" onSubmit={handleSubmit}>
          <label htmlFor="todo-input">New todo</label>
          <div className="todo-entry">
            <input
              id="todo-input"
              type="text"
              value={todoText}
              onChange={(event) => setTodoText(event.target.value)}
              placeholder="Add a task"
              autoComplete="off"
            />
            <input
              id="todo-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              aria-label="Due date"
            />
            <select
              id="todo-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as TodoPriority)}
              aria-label="Priority"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="submit">Add</button>
          </div>
        </form>

        <div className="todo-toolbar" aria-label="Todo controls">
          <div className="todo-counts" aria-live="polite">
            <p className="total-count">
              {totalCount} total {totalCount === 1 ? "todo" : "todos"}
            </p>
            <p className="active-count">
              {activeCount} {activeCount === 1 ? "item" : "items"} left
            </p>
          </div>

          <div className="filter-group" aria-label="Filter todos">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={filter === option.value ? "active" : undefined}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="clear-completed"
            disabled={completedCount === 0}
            onClick={() => setTodos((currentTodos) => clearCompletedTodos(currentTodos))}
          >
            Clear completed
          </button>
        </div>

        <ul className="todo-list" aria-label="Todo list">
          {visibleTodos.length === 0 ? (
            <li className="empty-state">{getEmptyStateMessage(filter)}</li>
          ) : (
            visibleTodos.map((todo) => {
              const overdue = isTodoOverdue(todo);
              const itemClassName = [
                "todo-item",
                todo.completed ? "completed" : "",
                overdue ? "overdue" : "",
                `priority-${todo.priority}`
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <li className={itemClassName} key={todo.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() =>
                        setTodos((currentTodos) => toggleTodo(currentTodos, todo.id))
                      }
                    />
                    <span className="todo-content">
                      <span className="todo-text">{todo.text}</span>
                      <span className="todo-meta">
                        <span className="priority-label">
                          {PRIORITY_LABELS[todo.priority]} priority
                        </span>
                        {todo.createdAt ? (
                          <span className="created-at">
                            Added {formatCreatedAt(todo.createdAt)}
                          </span>
                        ) : null}
                        {todo.dueDate ? (
                          <span className="due-date">
                            Due {formatDueDate(todo.dueDate)}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </main>
  );
}

function loadTodos(): Todo[] {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (!savedTodos) {
      return [];
    }

    return normalizeTodos(JSON.parse(savedTodos));
  } catch {
    return [];
  }
}

function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

createRoot(document.getElementById("root")!).render(<App />);
