// Utilities
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Local Storage Management
const DB_NAME = "todo_db";

function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem(DB_NAME)) || [];
}

function saveTodosToLocalStorage(todos) {
  localStorage.setItem(DB_NAME, JSON.stringify(todos));
}

// Create Todo
function createTodo() {
  const todoInput = document.querySelector("#todo-input");

  if (todoInput.value.trim() === "") {
    showWarning("Please enter a valid todo!");
    return;
  }

  const newTodo = {
    id: generateUUID(),
    title: todoInput.value,
    created_at: new Date().getTime(),
  };

  const todos = getTodosFromLocalStorage();
  todos.push(newTodo);
  saveTodosToLocalStorage(todos);

  todoInput.value = "";
  displayTodos();
}

// Update Todo
function editTodo(todoId) {
  const todoToEdit = getTodosFromLocalStorage().find(
    (todo) => todo.id === todoId
  );

  if (todoToEdit) {
    const todoInput = document.querySelector("#todo-input");
    todoInput.value = todoToEdit.title;

    editMode = true;
    currentEditId = todoId;

    const addButton = document.getElementById("add-button");
    const updateButton = document.getElementById("update-button");

    addButton.classList.add("hidden");
    updateButton.classList.remove("hidden");
  }
}

// Reset Edit Mode
function updateTodo() {
  const todoInput = document.querySelector("#todo-input").value;

  if (editMode) {
    if (todoInput.trim() === "") {
      showWarning("Please enter a valid todo!");
      return;
    }

    const todos = getTodosFromLocalStorage();
    const updatedIndex = todos.findIndex((todo) => todo.id === currentEditId);

    if (updatedIndex !== -1) {
      todos[updatedIndex].title = todoInput;
      saveTodosToLocalStorage(todos);
      displayTodos();
    }

    resetEditMode();
  }
}

// Delete Todo
function deleteTodoAndDisplayConfirmation(todoId) {
  showDeleteConfirmation(() => {
    deleteTodo(todoId);
  });
}

function deleteTodo(todoId) {
  const todos = getTodosFromLocalStorage();
  const updatedTodos = todos.filter((todo) => todo.id !== todoId);
  saveTodosToLocalStorage(updatedTodos);
  displayTodos(); // Refresh the displayed todos after deletion
}

// Function to display todos
function displayTodos() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = ""; // Clear the list first

  const todos = getTodosFromLocalStorage();

  if (todos.length === 0) {
    const defaultText = document.createElement("li");
    defaultText.textContent = "Your todo will go here";
    defaultText.style.color = "grey";
    todoList.appendChild(defaultText);
  } else {
    todos.forEach((todo) => {
      const li = document.createElement("li");

      const textContainer = document.createElement("div");
      textContainer.style.margin = "10px 20px";
      textContainer.style.display = "flex";
      textContainer.style.justifyContent = "space-between";

      const todoLink = document.createElement("a");
      todoLink.textContent = todo.title;
      todoLink.href = `preview.html?todoId=${todo.id}`;
      todoLink.target = "_blank"; // Opens the link in a new tab

      todoLink.onclick = function (event) {
        event.preventDefault();
        openTodoPreview(todo.id);
      };

      const createdDay = document.createElement("span");
      createdDay.textContent = new Date(todo.created_at).toDateString();
      createdDay.style.color = "gray";

      const iconsContainer = document.createElement("div");

      const editButton = createButton("✏️", "text-blue-500", () =>
        editTodo(todo.id)
      );
      const deleteButton = createButton("❌", "text-red-500", () =>
        deleteTodoAndDisplayConfirmation(todo.id)
      );

      iconsContainer.appendChild(editButton);
      iconsContainer.appendChild(deleteButton);

      textContainer.appendChild(todoLink);
      textContainer.appendChild(createdDay);
      textContainer.appendChild(iconsContainer);

      li.appendChild(textContainer);
      todoList.appendChild(li);
    });
  }
}

function resetEditMode() {
  editMode = false;
  currentEditId = null;

  const addButton = document.getElementById("add-button");
  const updateButton = document.getElementById("update-button");

  updateButton.classList.add("hidden");
  addButton.classList.remove("hidden");
  addButton.classList.remove("bg-yellow-500", "hover:bg-yellow-700");
  addButton.textContent = "Add Todo";

  document.getElementById("todo-input").value = "";
}

function showWarning(text) {
  Swal.fire({
    title: "Oops...",
    text: text,
    icon: "warning",
  });
}

function showDeleteConfirmation(callback) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this todo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
}

function createButton(text, className, onClickFunction) {
  const button = document.createElement("button");
  button.textContent = text;

  // Split className into multiple classes and add them separately
  const classes = className.split(" ");
  classes.forEach((cls) => button.classList.add(cls));

  button.addEventListener("click", onClickFunction);
  return button;
}

function openTodoPreview(todoId) {
  const selectedTodo = getTodosFromLocalStorage().find(
    (todo) => todo.id === todoId
  );
  const previewURL = `preview.html?todoId=${todoId}`;
  window.open(previewURL, "_blank");
}

displayTodos(); // Initial Display of Todos
