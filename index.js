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

function createTodo() {
  const todoInput = document.querySelector("#todo-input");

  if (todoInput.value.trim() === "") {
    Swal.fire({
      title: "Oops...",
      text: "Please enter a valid todo!",
      icon: "warning",
    });
    return;
  }

  const newTodo = {
    id: generateUUID(),
    title: todoInput.value,
    created_at: new Date().getTime(),
  };

  let todos = getTodosFromLocalStorage();
  todos.push(newTodo);
  saveTodosToLocalStorage(todos);

  todoInput.value = "";
  displayTodos();
}

function editTodo(todoId) {
  const todos = getTodosFromLocalStorage();
  const todoToEdit = todos.find((todo) => todo.id === todoId);

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

function updateTodo() {
  const todoInput = document.querySelector("#todo-input").value;

  if (editMode) {
    if (todoInput.trim() === "") {
      Swal.fire({
        title: "Oops...",
        text: "Please enter a valid todo!",
        icon: "warning",
      });
      return;
    }

    const todos = getTodosFromLocalStorage();
    const updatedIndex = todos.findIndex((todo) => todo.id === currentEditId);

    if (updatedIndex !== -1) {
      todos[updatedIndex].title = todoInput;
      saveTodosToLocalStorage(todos);
      displayTodos();
    }

    editMode = false;
    const addButton = document.getElementById("add-button");
    const updateButton = document.getElementById("update-button");

    updateButton.classList.add("hidden");
    addButton.classList.remove("hidden");
    addButton.classList.remove("bg-yellow-500", "hover:bg-yellow-700");
    addButton.textContent = "Add Todo";

    document.getElementById("todo-input").value = "";
  }
}

function deleteTodo(todoId) {
  let todos = getTodosFromLocalStorage();
  todos = todos.filter((todo) => todo.id !== todoId);
  saveTodosToLocalStorage(todos);
  displayTodos();
}

function createOrUpdateTodo() {
  const todoInput = document.querySelector("#todo-input");

  if (editMode) {
    updateTodo(currentEditId, todoInput.value);
    editMode = false;
    currentEditId = null;
    const addButton = document.getElementById("add-button");
    addButton.textContent = "Add Todo";
    addButton.classList.remove("bg-yellow-500", "hover:bg-yellow-700");
  } else {
    createTodo();
  }
  todoInput.value = "";
}

function deleteConfirmation(todoId) {
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
      deleteTodo(todoId);
    }
  });
}

function displayTodos() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  const todos = getTodosFromLocalStorage();

  todos.forEach((todo) => {
    const li = document.createElement("li");

      const textContainer = document.createElement("div");
    textContainer.style.margin = "10px 20px "
    textContainer.style.display = "flex";
    textContainer.style.justifyContent = "space-between";

    const todoText = document.createElement("span");
    todoText.textContent = todo.title;
    todoText.style.flex = "1"; // Make the text take up the available space on the right

    const iconsContainer = document.createElement("div");

    const editButton = document.createElement("button");
    editButton.textContent = "✏️";
    editButton.classList.add("text-blue-500");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.classList.add("ml-2", "text-red-500");

    editButton.addEventListener("click", () => {
      editTodo(todo.id);
    });

    deleteButton.addEventListener("click", () => {
      deleteConfirmation(todo.id);
    });

    iconsContainer.appendChild(editButton);
    iconsContainer.appendChild(deleteButton);

    textContainer.appendChild(todoText);
    textContainer.appendChild(iconsContainer);

    li.appendChild(textContainer);
    todoList.appendChild(li);
  });
}





displayTodos(); // Initial Display of Todos
