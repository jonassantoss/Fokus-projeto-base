const form = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const taskList = document.querySelector(".app__section-task-list");
const btnAddTask = document.querySelector(".app__button--add-task");
const btnSave = document.querySelector(".app__form-footer__button--save");
const btnCancel = document.querySelector(".app__form-footer__button--cancel");

btnAddTask.addEventListener("click", (e) => {
  e.preventDefault();
  form.classList.toggle("hidden");
});

btnSave.addEventListener("click", (e) => {
  e.preventDefault();
  createTask(textarea.value);
  form.classList.toggle("hidden");
});

btnCancel.addEventListener("click", (e) => {
  e.preventDefault();
  form.classList.add("hidden");
});

function clearInput() {
  textarea.value = "";
}

function createTask(text) {
  let task = document.createElement("div");
  let template = createTaskTemplate(text);
  let splitterButtons = createTaskButtons();

  task.classList.add("app__section-task-list-item");
  task.appendChild(template);
  task.appendChild(splitterButtons);
  taskList.appendChild(task);
  saveTask();
  clearInput();
};

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
  button.appendChild(editIcon);

  return button;
}

function createDeleteButton() {
  let button = document.createElement("button");
  let deleteIcon = document.createElement("img");

  deleteIcon.setAttribute("src", "imagens/delete.png");
  deleteIcon.setAttribute("width", "32");
  deleteIcon.setAttribute("height", "32");
  button.classList.add("app__button-delete");
  button.appendChild(deleteIcon);

  return button
}

function saveTask() {
  const tasksArray = [];
  const tasks = taskList.querySelectorAll("div.app__section-task-list-item-description");
  
  tasks.forEach((task) => {
    let text = task.innerText;
    tasksArray.push(text);
  });

  let tasksArrayJSON = JSON.stringify(tasksArray);
  localStorage.setItem("Tarefas", tasksArrayJSON);
}

function getTasks() {
  let tasksArrayJSON = localStorage.getItem("Tarefas");
  let tasksArray = JSON.parse(tasksArrayJSON);
  
  try {
    tasksArray.forEach(task => createTask(task));
  } catch (error) {
    console.log("Não há tarefas salvas.")
  }
}

getTasks();