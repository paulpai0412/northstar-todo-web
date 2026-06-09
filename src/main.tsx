import { FormEvent, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  addTodo,
  clearCompletedTodos,
  completeVisibleTodos,
  countTodayDueTodos,
  editTodoText,
  getEmptyStateMessage,
  getTodoProgress,
  getVisibleTodos,
  hasOverdueTodos,
  getOverdueTodoCount,
  isTodoOverdue,
  normalizeTodos,
  toggleTodo,
  sortVisibleTodos,
  type Todo,
  type TodoFilter,
  type TodoPriority
} from "./todos";
import "./styles.css";

const STORAGE_KEY = "northstar-todo-web.todos";
const SORT_STORAGE_KEY = "northstar-todo-web.sort";
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
const QUICK_ADD_EXAMPLES = ["Buy groceries", "Review notes", "Plan tomorrow"];

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [todoText, setTodoText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("normal");
  const [dependsOn, setDependsOn] = useState("");
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [sortOn, setSortOn] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(SORT_STORAGE_KEY);
      return raw ? JSON.parse(raw) as boolean : false;
    } catch {
      return false;
    }
  });
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodoText, setEditingTodoText] = useState("");
  const todoInputRef = useRef<HTMLInputElement>(null);

  const { total: totalCount, active: activeCount, completed: completedCount } =
    getTodoProgress(todos);
  const visibleTodos = getVisibleTodos(todos, filter, hideCompleted);
  const renderedTodos = sortOn ? sortVisibleTodos(visibleTodos) : visibleTodos;
  const visibleIncompleteIds = visibleTodos.filter((todo) => !todo.completed).map((todo) => todo.id);
  const canCompleteVisible = visibleIncompleteIds.length > 0;
  const emptyStateMessage =
    hideCompleted && completedCount > 0 && filter !== "active"
      ? "Completed todos are hidden."
      : getEmptyStateMessage(filter);

  const overdueCount = getOverdueTodoCount(todos);
  const hasOverdue = overdueCount > 0;
  const todayDueCount = countTodayDueTodos(todos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sortOn));
  }, [sortOn]);

  useEffect(() => {
    document.title = activeCount === 0 ? "Todo Web" : `Todo Web (${activeCount} active)`;
  }, [activeCount]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTodos((currentTodos) =>
      addTodo(currentTodos, todoText, dueDate, priority, new Date(), dependsOn || null)
    );
    if (todoText.trim()) {
      setTodoText("");
      setDueDate("");
      setPriority("normal");
      setDependsOn("");
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
              ref={todoInputRef}
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
            <select
              id="todo-depends-on"
              value={dependsOn}
              onChange={(event) => setDependsOn(event.target.value)}
              aria-label="Depends on"
            >
              <option value="">None</option>
              {todos.map((todo) => (
                <option key={todo.id} value={todo.id}>
                  {todo.text}
                </option>
              ))}
            </select>
            <button type="submit">Add</button>
          </div>
          <div className="quick-add-row" aria-label="Quick add examples">
            <span className="quick-add-label">Try:</span>
            {QUICK_ADD_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                className="quick-add-button"
                onClick={() => {
                  setTodoText(example);
                  todoInputRef.current?.focus();
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </form>

        <div className="todo-toolbar" aria-label="Todo controls">
          <div className="todo-counts" aria-live="polite">
            <p className="progress-summary">
              {totalCount} total, {activeCount} active, {completedCount} completed
            </p>
            {overdueCount > 0 ? (
              <p className="overdue-summary">{overdueCount} {overdueCount === 1 ? "todo is overdue" : "todos are overdue"}</p>
            ) : null}
            {todayDueCount > 0 ? <p className="today-due-summary">Today due: {todayDueCount}</p> : null}
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

          <div className="sort-group" aria-label="Sort">
            <button
              type="button"
              className="sort-toggle"
              aria-pressed={sortOn}
              onClick={() => setSortOn((s) => !s)}
            >
              {sortOn ? "Sort: On" : "Sort: Off"}
            </button>
          </div>

          {completedCount > 0 ? (
            <button
              type="button"
              className="completed-visibility-toggle"
              aria-pressed={hideCompleted}
              onClick={() => setHideCompleted((currentValue) => !currentValue)}
            >
              {hideCompleted ? "Show completed" : "Hide completed"}
            </button>
          ) : null}

          <button
            type="button"
            className="clear-completed"
            disabled={completedCount === 0}
            onClick={() => setTodos((currentTodos) => clearCompletedTodos(currentTodos))}
          >
            Clear completed
          </button>

          <button
            type="button"
            className="complete-visible"
            disabled={!canCompleteVisible}
            onClick={() =>
              setTodos((currentTodos) => {
                const visible = getVisibleTodos(currentTodos, filter, hideCompleted);
                const ids = visible.filter((t) => !t.completed).map((t) => t.id);
                return completeVisibleTodos(currentTodos, ids);
              })
            }
          >
            Complete visible
          </button>
        </div>

        <ul className="todo-list" aria-label="Todo list">
          {renderedTodos.length === 0 ? (
            <li className="empty-state">{emptyStateMessage}</li>
          ) : (
            renderedTodos.map((todo) => {
              const overdue = isTodoOverdue(todo);
              const itemClassName = [
                "todo-item",
                todo.completed ? "completed" : "",
                overdue ? "overdue" : "",
                `priority-${todo.priority}`
              ]
                .filter(Boolean)
                .join(" ");

              const isEditing = editingTodoId === todo.id;

              return (
                <li className={itemClassName} key={todo.id}>
                  <div className="todo-row">
                    <input
                      id={`todo-toggle-${todo.id}`}
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
                        <label
                          className="todo-content todo-content-label"
                          htmlFor={`todo-toggle-${todo.id}`}
                        >
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
                              <span className="due-date">Due {formatDueDate(todo.dueDate)}</span>
                            ) : null}
                          </span>
                        </label>
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

        <footer className="todo-footer" aria-live="polite">
          <p className="footer-summary">
            {activeCount} active, {completedCount} completed
          </p>
          <button
            type="button"
            className="clear-completed-footer"
            disabled={completedCount === 0}
            onClick={() => setTodos((currentTodos) => clearCompletedTodos(currentTodos))}
          >
            Clear completed
          </button>
        </footer>
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
