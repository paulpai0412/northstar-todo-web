import { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { addTodo, toggleTodo, type Todo } from "./todos";
import "./styles.css";

const STORAGE_KEY = "northstar-todo-web.todos";

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [todoText, setTodoText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTodos((currentTodos) => addTodo(currentTodos, todoText));
    if (todoText.trim()) {
      setTodoText("");
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
            <button type="submit">Add</button>
          </div>
        </form>

        <ul className="todo-list" aria-label="Todo list">
          {todos.length === 0 ? (
            <li className="empty-state">No todos yet.</li>
          ) : (
            todos.map((todo) => (
              <li
                className={todo.completed ? "todo-item completed" : "todo-item"}
                key={todo.id}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      setTodos((currentTodos) => toggleTodo(currentTodos, todo.id))
                    }
                  />
                  <span>{todo.text}</span>
                </label>
              </li>
            ))
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
    typeof value.completed === "boolean"
  );
}

createRoot(document.getElementById("root")!).render(<App />);
