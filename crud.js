const form = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const taskList = document.querySelector(".app__section-task-list");
const btnAddTask = document.querySelector(".app__button--add-task");
const btnSave = document.querySelector(".app__form-footer__button--save");
const btnSaveEdit = document.querySelector(".btn-save-edit-task");
const editInput = document.querySelector(".input-edit-task")
const btnCancel = document.querySelector(".app__form-footer__button--cancel");
const overlayEditTask = document.querySelector(".overlayEditTask");
const editPage = document.querySelector(".task-edit-page");
const closeEditPage = document.querySelector(".close-editTask-button");
const currentTaskSection = document.querySelector(".app__section-active-task-description");
const btnDeleteDone = document.querySelector("#btn-remove-done");
const btnDeleteAll = document.querySelector("#btn-remove-all");

let taskToEdit;
let currentTask;

btnAddTask.addEventListener("click", (e) => {
  e.preventDefault();
  form.classList.toggle("hidden");
  textarea.focus();
});

btnSave.addEventListener("click", (e) => {
  e.preventDefault();
  if (!textarea.value) {
    errorMessage(1);
    return
  }
  createTask(textarea.value);
  form.classList.toggle("hidden");
});

textarea.addEventListener("keydown", (key) => {
  if (key.keyCode === 13) {
    key.preventDefault();
    if (!textarea.value) {
      errorMessage(1);
      return
    }
    createTask(textarea.value);
    form.classList.toggle("hidden");
  } else if (key.keyCode === 27) {
    form.classList.toggle("hidden");
    btnAddTask.focus();
  }
});

btnCancel.addEventListener("click", (e) => {
  e.preventDefault();
  form.classList.add("hidden");
  btnAddTask.focus();
});

btnSaveEdit.addEventListener("click", () => {
  if (!editInput.value) {
    errorMessage(0);
    return
  }
  editTask();
  handlePageClose(false);
});

editInput.addEventListener("keydown", (key) => {
  if (key.keyCode == 13) {
    key.preventDefault();
    if (!editInput.value || !taskToEdit) {
      errorMessage(0);
      return
    }
    editTask();
    handlePageClose(false);
  }
})

closeEditPage.addEventListener("click", () => {
  handlePageClose(false);
});

btnDeleteDone.addEventListener("click", () => {
  deleteDoneTasks();
  saveTask();
  getCurrentTask();
});

btnDeleteAll.addEventListener("click", () => {
  deleteAllTasks();
  saveTask();
  getCurrentTask();
})

function clearInput() {
  textarea.value = "";
}

function createTask(text, key) {
  let task = document.createElement("li");
  let template = createTaskTemplate(text);
  let splitterButtons = createTaskButtons();

  if (key) {
    task.classList.add("app__section-task-list-item-complete");
  }

  task.classList.add("app__section-task-list-item");
  task.appendChild(template);
  task.appendChild(splitterButtons);
  selectTask(task, text);
  taskList.appendChild(task);
  saveTask();
  getCurrentTask();
  clearInput();
  btnAddTask.focus();
}

function createTaskTemplate(text) {
  let splitter = document.createElement("div");
  let iconStatus = createIconStatus();
  let description = createTaskDescription(text);

  splitter.classList.add("splitter");
  splitter.appendChild(iconStatus);
  splitter.appendChild(description);

  return splitter;
}

function createIconStatus() {
  // Creating SVG element
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.classList.add("app__section-task-icon-status");
  svg.setAttribute("aria-label", "Botão concluir tarefa");

  // Adding circle
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "12");
  circle.setAttribute("fill", "#fff");
  svg.appendChild(circle);

  // Adding image
  let img = document.createElementNS("http://www.w3.org/2000/svg", "image");
  img.setAttribute("href", "imagens/check.png");
  img.setAttribute("x", "6");
  img.setAttribute("y", "6");
  img.setAttribute("width", "12");
  img.setAttribute("height", "12");
  svg.appendChild(img);

  addCompleteTask(svg);

  return svg;
}

function createTaskDescription(text) {
  let description = document.createElement("div");
  description.classList.add("app__section-task-list-item-description");
  description.textContent = text;

  return description;
}

function createTaskButtons() {
  let splitter = document.createElement("div");
  let btnEdit = createEditButton();
  let btnDelete = createDeleteButton();

  splitter.classList.add("splitter");
  splitter.appendChild(btnEdit);
  splitter.appendChild(btnDelete);

  return splitter;
}

function createEditButton() {
  let button = document.createElement("button");
  let editIcon = document.createElement("img");

  editIcon.setAttribute("src", "imagens/edit.png");
  button.classList.add("app__button-edit");
  button.setAttribute("aria-label", "Botão editar tarefa");
  button.appendChild(editIcon);
  addEditTask(button);

  return button;
}

function createDeleteButton() {
  let button = document.createElement("button");
  let deleteIcon = document.createElement("img");

  deleteIcon.setAttribute("src", "imagens/delete.png");
  button.classList.add("app__button-delete");
  button.setAttribute("aria-label", "Botão excluir tarefa");
  button.appendChild(deleteIcon);
  deleteTask(button);

  return button;
}

function editTask() {
  taskToEdit.textContent = editInput.value;
  saveTask();
  getCurrentTask();
  clearInput();
}

function selectTask(task, text) {
  task.addEventListener("click", () => {
    removeSelections();
    currentTaskSection.textContent = text;
    task.classList.add("app__section-task-list-item-active");
  })
}

function removeSelections() {
  const tasks = taskList.querySelectorAll("li");
  tasks.forEach(item => {
    item.classList.remove("app__section-task-list-item-active");
  })
}

function completeTask(icon) {
  let task = icon.parentElement.parentElement;
  task.classList.toggle("app__section-task-list-item-complete");
}

function addEditTask(editButton) {
  editButton.addEventListener("click", function () {
    handlePageClose(true);
    editInput.focus();
    let task = this.parentElement.previousElementSibling.children[1];
    taskToEdit = task;
  });
}

function addCompleteTask(iconStatus) {
  iconStatus.addEventListener("click", () => {
    completeTask(iconStatus);
    saveTask();
    getCurrentTask();
  })
}

function deleteTask(deleteButton) {
  deleteButton.addEventListener("click", function() {
    let task = this.parentElement.parentElement;
    task.remove();
    saveTask();
    getCurrentTask();
  })
}

function deleteDoneTasks() {
  let tasks = taskList.querySelectorAll("li");
  tasks.forEach(task => {
    if (task.classList.contains("app__section-task-list-item-complete")) {
      task.remove();
    }
  })
}

function deleteAllTasks() {
  let tasks = taskList.querySelectorAll("li");
  tasks.forEach(task => {
    task.remove();
  });
}

function saveTask() {
  const activeTasksArray = [];
  const completeTasksArray = [];
  const tasks = taskList.querySelectorAll("li");

  tasks.forEach((task) => {
    if (task.classList.contains("app__section-task-list-item-complete")) {
      let text = task.children[0].children[1].textContent;
      completeTasksArray.push(text)
    } else {
      let text = task.children[0].children[1].textContent;
      activeTasksArray.push(text);
    }
  });

  let activeTasksArrayJSON = JSON.stringify(activeTasksArray);
  let completeTasksArrayJSON = JSON.stringify(completeTasksArray);
  localStorage.setItem("Ativas", activeTasksArrayJSON);
  localStorage.setItem("Concluidas", completeTasksArrayJSON);
}

function getTasks() {
  let activeTasksArrayJSON = localStorage.getItem("Ativas");
  let completeTasksArrayJSON = localStorage.getItem("Concluidas");
  let activeTasksArray = JSON.parse(activeTasksArrayJSON);
  let completeTasksArray = JSON.parse(completeTasksArrayJSON);

  try {
    activeTasksArray.forEach(task => createTask(task, 0));
    completeTasksArray.forEach(task => createTask(task, 1));
  } catch (error) {
    console.log("Não há tarefas salvas.");
  }
}

function handlePageClose(animationState) {
  if (animationState) {
    overlayEditTask.style.display = "block";
    editPage.style.transform = "scale(1)";
    setTimeout(() => (overlayEditTask.style.opacity = 1), 100);
  } else {
    overlayEditTask.style.opacity = 0;
    editPage.style.transform = "scale(0.8)";
    setTimeout(() => (overlayEditTask.style.display = "none"), 500);
  }
}

function getCurrentTask() {
  let tasksArray = taskList.querySelectorAll("li");
  currentTask = "";
  
  for (task of tasksArray) {
    if (!task.classList.contains("app__section-task-list-item-complete")) {
      currentTask = task.textContent;
      break;
    }
  }

  currentTaskSection.textContent = currentTask;
}

function errorMessage(i) {
  let errorMessage;

  if (i === 0) {
    errorMessage = editInput.parentElement.nextElementSibling;
  } else {
    errorMessage = textarea.previousElementSibling;
  }

  errorMessage.style.display = 'block'
  setTimeout(() => errorMessage.style.opacity = 1, 100)
  setTimeout(() => {
    errorMessage.style.opacity = 0
    errorMessage.style.display = 'none'
  }, 5000)
}

getTasks();
getCurrentTask();