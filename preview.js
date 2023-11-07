const DB_NAME = "todo_db";

function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem(DB_NAME)) || [];
}

function saveTodosToLocalStorage(todos) {
  localStorage.setItem(DB_NAME, JSON.stringify(todos));
}

const renderCurrentPreviewTodo = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const todoId = urlParams.get("todoId");

  const todos = getTodosFromLocalStorage();
  const currentTodo = todos.find((todo) => todo.id === todoId);

  if (currentTodo) {
    const todoTitle = document.getElementById("todoTitle");
    const todoDescription = document.getElementById("todoDescription");
    const editButton = document.getElementById("editButton");

    todoTitle.innerText = currentTodo.title;
    todoDescription.innerText =
      currentTodo.description || "No description available";

    editButton.addEventListener("click", function () {
      openEditModal(currentTodo);
    });
  }
};

function openEditModal(currentTodo) {
  const editModal = document.getElementById("editModal");
  editModal.style.display = "block";

  const editedTitle = document.getElementById("editedTitle");
  const editedDescription = document.getElementById("editedDescription");

  editedTitle.value = currentTodo.title;
  editedDescription.value = currentTodo.description || "";
}

function closeModal() {
  const editModal = document.getElementById("editModal");
  editModal.style.display = "none";
}

function saveChanges() {
  const editedTitle = document.getElementById("editedTitle").value;
  const editedDescription = document.getElementById("editedDescription").value;

  const urlParams = new URLSearchParams(window.location.search);
  const todoId = urlParams.get("todoId");

  const todos = getTodosFromLocalStorage();
  const updatedTodos = todos.map((todo) => {
    if (todo.id === todoId) {
      return { ...todo, title: editedTitle, description: editedDescription };
    }
    return todo;
  });

  saveTodosToLocalStorage(updatedTodos);
  renderCurrentPreviewTodo();

  // Close the modal after saving changes
  closeModal();
}

function confirmDelete() {
  const urlParams = new URLSearchParams(window.location.search);
  const todoId = urlParams.get("todoId");

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
      const todos = getTodosFromLocalStorage();
      const updatedTodos = todos.filter((todo) => todo.id !== todoId);

      saveTodosToLocalStorage(updatedTodos);
      window.opener.location.reload(); // Reload the main page after deletion
      window.close(); // Close the preview page after deletion
    }
  });
}

renderCurrentPreviewTodo();
