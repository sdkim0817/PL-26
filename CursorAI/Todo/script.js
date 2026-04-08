const STORAGE_KEY = "todo-items-v1";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const dueDateInput = document.getElementById("todo-due-date");
const pendingList = document.getElementById("todo-pending-list");
const completedList = document.getElementById("todo-completed-list");

let todos = loadTodos();
let editingTodoId = null;
renderTodos();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now().toString(),
    text,
    dueDate: dueDateInput.value || "",
    completed: false,
  });

  saveTodos();
  renderTodos();
  form.reset();
  input.focus();
});

function renderTodos() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  renderTodoSection(pendingTodos, pendingList, "예정된 할 일이 없습니다.");
  renderTodoSection(completedTodos, completedList, "완료된 할 일이 없습니다.");
}

function renderTodoSection(sectionTodos, targetList, emptyMessage) {
  if (sectionTodos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-item";

    const emptyText = document.createElement("p");
    emptyText.className = "todo-empty";
    emptyText.textContent = emptyMessage;

    empty.appendChild(emptyText);
    targetList.appendChild(empty);
    return;
  }

  for (const todo of sectionTodos) {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;
    item.dataset.todoId = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "완료 체크");
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const content = createTodoContent(todo);
    const actions = createTodoActions(todo);

    item.append(checkbox, content, actions);
    targetList.appendChild(item);
  }
}

function createTodoContent(todo) {
  const content = document.createElement("div");
  content.className = "todo-content";

  if (editingTodoId === todo.id) {
    const editText = document.createElement("input");
    editText.type = "text";
    editText.value = todo.text;
    editText.className = "todo-edit-text";

    const editDate = document.createElement("input");
    editDate.type = "date";
    editDate.value = todo.dueDate || "";
    editDate.className = "todo-edit-date";

    content.append(editText, editDate);
    return content;
  }

  const text = document.createElement("p");
  text.className = "todo-text";
  text.textContent = todo.text;
  content.appendChild(text);

  if (todo.dueDate) {
    const dueDate = document.createElement("p");
    dueDate.className = "todo-due-date";
    dueDate.textContent = `마감: ${formatDueDate(todo.dueDate)}`;
    content.appendChild(dueDate);
  }

  return content;
}

function createTodoActions(todo) {
  const actions = document.createElement("div");
  actions.className = "todo-actions";

  if (editingTodoId === todo.id) {
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "save-btn";
    saveBtn.textContent = "저장";
    saveBtn.addEventListener("click", () => saveEdit(todo.id));

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "cancel-btn";
    cancelBtn.textContent = "취소";
    cancelBtn.addEventListener("click", cancelEdit);

    actions.append(saveBtn, cancelBtn);
    return actions;
  }

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "edit-btn";
  editBtn.textContent = "수정";
  editBtn.addEventListener("click", () => startEdit(todo.id));

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete-btn";
  delBtn.textContent = "삭제";
  delBtn.addEventListener("click", () => deleteTodo(todo.id));

  actions.append(editBtn, delBtn);
  return actions;
}

function startEdit(id) {
  editingTodoId = id;
  renderTodos();
}

function cancelEdit() {
  editingTodoId = null;
  renderTodos();
}

function saveEdit(id) {
  const item = document.querySelector(`.todo-item[data-todo-id="${id}"]`);
  if (!item) return;

  const textInput = item.querySelector(".todo-edit-text");
  const dateInput = item.querySelector(".todo-edit-date");
  if (!textInput || !dateInput) return;

  const nextText = textInput.value.trim();
  if (!nextText) {
    textInput.focus();
    return;
  }

  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, text: nextText, dueDate: dateInput.value || "" } : todo
  );

  editingTodoId = null;
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  if (editingTodoId === id) {
    editingTodoId = null;
  }
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  if (editingTodoId === id) {
    editingTodoId = null;
  }
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((todo) => ({
      id: String(todo.id ?? Date.now().toString()),
      text: String(todo.text ?? ""),
      dueDate: typeof todo.dueDate === "string" ? todo.dueDate : "",
      completed: Boolean(todo.completed),
    }));
  } catch (error) {
    console.error("Failed to load todos:", error);
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function formatDueDate(dateText) {
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateText;
  return date.toLocaleDateString("ko-KR");
}
