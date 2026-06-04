import { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  addTodo,
  clearCompletedTodos,
  countActiveTodos,
  editTodoText,
  filterTodos,
  isTodoOverdue,
  toggleTodo,
  type Todo,
  type TodoFilter
} from "./todos";
import "./styles.css";

const STORAGE_KEY = "northstar-todo-web.todos";
const FILTER_OPTIONS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" }
];

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [todoText, setTodoText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodoText, setEditingTodoText] = useState("");

  const activeCount = countActiveTodos(todos);
  const visibleTodos = filterTodos(todos, filter);
  const completedCount = todos.length - activeCount;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTodos((currentTodos) => addTodo(currentTodos, todoText, dueDate));
    if (todoText.trim()) {
      setTodoText("");
      setDueDate("");
    }
  }

  function startEditingTodo(todo: Todo) {
    setEditingTodoId(todo.id);
    setEditingTodoText(todo.text);
  }

  function saveEditedTodo(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();

    if (!editingTodoText.trim()) {
      return;
    }

    setTodos((currentTodos) => editTodoText(currentTodos, id, editingTodoText));
    setEditingTodoId(null);
    setEditingTodoText("");
  }

  function cancelEditingTodo() {
    setEditingTodoId(null);
    setEditingTodoText("");
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
            <button type="submit">Add</button>
          </div>
        </form>

        <div className="todo-toolbar" aria-label="Todo controls">
          <p className="active-count" aria-live="polite">
            {activeCount} {activeCount === 1 ? "item" : "items"} left
          </p>

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
            <li className="empty-state">No todos yet.</li>
          ) : (
            visibleTodos.map((todo) => {
              const overdue = isTodoOverdue(todo);
              const itemClassName = [
                "todo-item",
                todo.completed ? "completed" : "",
                overdue ? "overdue" : ""
              ]
                .filter(Boolean)
                .join(" ");

              const isEditing = editingTodoId === todo.id;

              return (
                <li className={itemClassName} key={todo.id}>
                  <div className="todo-row">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      aria-label={`Mark ${todo.text} ${todo.completed ? "active" : "complete"}`}
                      onChange={() =>
                        setTodos((currentTodos) => toggleTodo(currentTodos, todo.id))
                      }
                    />
                    {isEditing ? (
                      <form
                        className="edit-form"
                        onSubmit={(event) => saveEditedTodo(event, todo.id)}
                      >
                        <input
                          type="text"
                          value={editingTodoText}
                          onChange={(event) => setEditingTodoText(event.target.value)}
                          aria-label={`Edit ${todo.text}`}
                          autoFocus
                        />
                        <button type="submit" disabled={!editingTodoText.trim()}>
                          Save
                        </button>
                        <button type="button" onClick={cancelEditingTodo}>
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <span className="todo-content">
                          <span className="todo-text">{todo.text}</span>
                          {todo.dueDate ? (
                            <span className="due-date">
                              Due {formatDueDate(todo.dueDate)}
                            </span>
                          ) : null}
                        </span>
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => startEditingTodo(todo)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
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

    const parsedTodos = JSON.parse(savedTodos);
    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos.filter(isTodo);
  } catch {
    return [];
  }
}

function isTodo(value: unknown): value is Todo {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "text" in value &&
    "completed" in value &&
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.completed === "boolean" &&
    (!("dueDate" in value) || typeof value.dueDate === "string")
  );
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

createRoot(document.getElementById("root")!).render(<App />);
