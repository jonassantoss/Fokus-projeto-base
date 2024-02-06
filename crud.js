// Seleção de elementos HTML
const form = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const taskList = document.querySelector(".app__section-task-list");
const btnAddTask = document.querySelector(".app__button--add-task");
const btnSave = document.querySelector(".app__form-footer__button--save");
const btnSaveEdit = document.querySelector(".btn-save-edit-task");
const editInput = document.querySelector(".input-edit-task");
const btnCancel = document.querySelector(".app__form-footer__button--cancel");
const overlayEditTask = document.querySelector(".overlayEditTask");
const editPage = document.querySelector(".task-edit-page");
const closeEditPage = document.querySelector(".close-editTask-button");
const currentTaskSection = document.querySelector(
  ".app__section-active-task-description"
);
const btnDeleteDone = document.querySelector("#btn-remove-done");
const btnDeleteAll = document.querySelector("#btn-remove-all");

// Variáveis para armazenar tarefas em edição e a tarefa atual
let taskToEdit;
let currentTask;

// Adiciona ouvintes de eventos aos botões e elementos
btnAddTask.addEventListener("click", toggleFormVisibility);
btnSave.addEventListener("click", createNewTask);
textarea.addEventListener("keydown", createNewTaskOnEnter);
btnCancel.addEventListener("click", cancelNewTask);
btnSaveEdit.addEventListener("click", saveEditedTask);
editInput.addEventListener("keydown", saveEditedTaskOnEnter);
closeEditPage.addEventListener("click", closeEditTaskPage);
btnDeleteDone.addEventListener("click", deleteDoneTasks);
btnDeleteAll.addEventListener("click", deleteAllTasks);

/**
 * Alterna a visibilidade do formulário de adição de tarefas
 * @param {Event} e - Evento de clique no botão de adição de tarefa
 */
function toggleFormVisibility(e) {
  e.preventDefault();
  form.classList.toggle("hidden");
  textarea.focus();
}

/**
 * Cria uma nova tarefa na lista de tarefas
 * @param {Event} e - Evento de clique no botão de adição de tarefa
 */
function createNewTask(e) {
  e.preventDefault();
  if (!textarea.value) {
    displayErrorMessage(1);
    return;
  }
  createTask(textarea.value, false);
  form.classList.toggle("hidden");
}

/**
 * Cria uma nova taarefa ao pressionar a tecla "Enter" ou cancela a operação ao pressionar "Esc"
 * @param {KeyboardEvent} key - Evento de tecla pressionada
 */
function createNewTaskOnEnter(key) {
  if (key.key === "Enter") {
    key.preventDefault();
    if (!textarea.value) {
      errorMessage(1);
      return;
    }
    createTask(textarea.value, false);
    form.classList.toggle("hidden");
  } else if (key.key === "Escape") {
    form.classList.toggle("hidden");
    btnAddTask.focus();
  }
}

/**
 * Cancela a criação de uma nova tarefa e oculta o formulário
 * @param {Event} e - Evento de clique no botão de cancelamento
 */
function cancelNewTask(e) {
  e.preventDefault();
  form.classList.add("hidden");
  btnAddTask.focus();
}

/**
 * Salva a tarefa editada e atualiza a lista de tarefas
 */
function saveEditedTask() {
  if (!editInput.value) {
    errorMessage(0);
    return;
  }
  editTask();
  handlePageClose(false);
}

/**
 * Salva a tarefa editada ao pressionar a tecla "Enter" ou cancela a operação ao pressionar "Esc"
 * @param {KeyboardEvent} key - Evento de tecla pressionada
 */
function saveEditedTaskOnEnter(key) {
  if (key.key === "Enter") {
    key.preventDefault();
    if (!editInput.value || !taskToEdit) {
      errorMessage(0);
      return;
    }
    editTask();
    handlePageClose(false);
  } else if (key.key === "Escape") {
    handlePageClose(false);
  }
}

function closeEditTaskPage() {
  handlePageClose(false);
}

/**
 * Limpa os campos de entrada do formulário
 */
function clearInput() {
  textarea.value = "";
  editInput.value = "";
}

/**
 * Cria uma nova tarefa na lista de tarefas
 * @param {string} text - Conteúdo da nova tarefa
 * @param {boolean} key - Indicador se a tarefa criada será completa (true) ou incompleta (false)
 */
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
  taskList.appendChild(task);
  saveTask();
  clearInput();
  btnAddTask.focus();
}

/**
 * Cria o template de uma tarefa na lista
 * @param {string} text - Conteúdo da nova tarefa
 * @returns {HTMLDivElement} - Div contendo o ícone de status e nome da tarefa
 */
function createTaskTemplate(text) {
  let splitter = document.createElement("div");
  let iconStatus = createIconStatus();
  let description = createTaskDescription(text);

  splitter.classList.add("splitter");
  splitter.appendChild(iconStatus);
  splitter.appendChild(description);

  return splitter;
}

/**
 * Cria o ícone de status da tarefa
 * @returns {HTMLOrSVGElement} Ícone de status da tarefa
 */
function createIconStatus() {
  // Criando o elemento SVG
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.classList.add("app__section-task-icon-status");
  svg.setAttribute("aria-label", "Botão concluir tarefa");

  // Adicionando o círculo
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "12");
  circle.setAttribute("fill", "#fff");
  svg.appendChild(circle);

  // Adicionando a imagem
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

/**
 * Cria a descrição da tarefa
 * @param {string} text - Conteúdo da descrição da tarefa 
 * @returns {HTMLDivElement} Descrição da tarefa
 */
function createTaskDescription(text) {
  let description = document.createElement("div");
  description.classList.add("app__section-task-list-item-description");
  description.textContent = text;
  selectTask(description);

  return description;
}

/**
 * Cria os botões de edição e exclusão da tarefa
 * @returns {HTMLDivElement} Div contendo os botões de edição e exclusão da tarefa
 */
function createTaskButtons() {
  let splitter = document.createElement("div");
  let btnEdit = createEditButton();
  let btnDelete = createDeleteButton();

  splitter.classList.add("splitter");
  splitter.appendChild(btnEdit);
  splitter.appendChild(btnDelete);

  return splitter;
}

/**
 * Cria e retorna o botão de edição de uma tarefa
 * @returns {HTMLButtonElement} Botão de edição da tarefa
 */
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

/**
 * Cria e retorna o botão de exclusão de uma tarefa
 * @returns {HTMLButtonElement} Botão de exclusão da tarefa
 */
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

/**
 * Edita uma tarefa existente na lista
 */
function editTask() {
  taskToEdit.textContent = editInput.value;
  let task = taskToEdit.parentElement.parentElement;
  if (task.classList.contains("app__section-task-list-item-active")) {
    currentTaskSection.textContent = taskToEdit.textContent;
    currentTask = taskToEdit.textContent;
  }
  saveCurrentTask();
  saveTask();
  clearInput();
}

/**
 * Seleciona uma tarefa da lista
 * @param {HTMLDivElement} description - Descrição da tarefa selecionada
 */
function selectTask(description) {
  description.addEventListener("click", () => {
    let task = description.parentElement.parentElement;
    if (!task.classList.contains("app__section-task-list-item-complete")) {
      removeSelection();
      currentTaskSection.textContent = description.textContent;
      task.classList.toggle("app__section-task-list-item-active");
      currentTask = description.textContent;
      saveCurrentTask();
    saveTask();
    }
  });
}

/**
 * Marca uma tarefa como concluída
 * @param {HTMLOrSVGElement} icon - Ícone de status da tarefa completa
 */
function completeTask(icon) {
  let task = icon.parentElement.parentElement;
  let editButton = task.children[1].children[0];
  task.classList.toggle("app__section-task-list-item-complete");
  task.classList.remove("app__section-task-list-item-active");

  if (editButton.hasAttribute("disabled")) {
    editButton.removeAttribute("disabled");
  } else {
    editButton.setAttribute("disabled", "true");
  }
}

// Funções para adicionar comportamentos aos botões

/**
 * Adiciona o comportamento de edição à tarefa
 * @param {HTMLButtonElement} editButton - Botão de edição da tarefa
 */
function addEditTask(editButton) {
  editButton.addEventListener("click", function () {
    handlePageClose(true);
    editInput.focus();
    let task = this.parentElement.previousElementSibling.children[1];
    taskToEdit = task;
  });
}

/**
 * Adiciona o comportamento de conclusão à tarefa
 * @param {HTMLOrSVGElement} iconStatus - Ícone de status da tarefa
 */
function addCompleteTask(iconStatus) {
  iconStatus.addEventListener("click", () => {
    let text = iconStatus.nextElementSibling.textContent;
    completeTask(iconStatus);
    if (currentTaskSection.textContent === text) {
      currentTaskSection.textContent = "";
      currentTask = "";
    }
    saveCurrentTask();
    saveTask();
  });
}

/**
 * Adiciona o comportamento de exclusão à tarefa
 * @param {HTMLButtonElement} deleteButton - Botão de deletar a tarefa
 */
function deleteTask(deleteButton) {
  deleteButton.addEventListener("click", function () {
    let task = this.parentElement.parentElement;
    let text = task.textContent;
    if (currentTaskSection.textContent === text) {
      currentTaskSection.textContent = "";
      currentTask = "";
    }
    task.remove();
    saveCurrentTask();
    saveTask();
  });
}

// Funções para manipular a lista de tarefas

/**
 * Deleta as tarefas concluídas
 */
function deleteDoneTasks() {
  let tasks = taskList.querySelectorAll("li");
  tasks.forEach((task) => {
    if (task.classList.contains("app__section-task-list-item-complete")) {
      if (task.textContent === currentTaskSection.textContent) {
        currentTaskSection.textContent = "";
        currentTask = "";
      }
      task.remove();
    }
  });
  saveCurrentTask();
  saveTask();
}

/**
 * Deleta todas as tarefas
 */
function deleteAllTasks() {
  let tasks = taskList.querySelectorAll("li");
  tasks.forEach((task) => {
    task.remove();
  });
  currentTask = "";
  removeSelection();
  saveCurrentTask();
  saveTask();
}

/**
 * Salva as tarefas no armazenamento local do navegador
 */
function saveTask() {
  const activeTasksArray = [];
  const completeTasksArray = [];
  const tasks = taskList.querySelectorAll("li");

  tasks.forEach((task) => {
    if (task.classList.contains("app__section-task-list-item-complete")) {
      let text = task.textContent;
      completeTasksArray.push(text);
    } else {
      let text = task.textContent;
      activeTasksArray.push(text);
    }
  });

  let activeTasksArrayJSON = JSON.stringify(activeTasksArray);
  let completeTasksArrayJSON = JSON.stringify(completeTasksArray);
  localStorage.setItem("Ativas", activeTasksArrayJSON);
  localStorage.setItem("Concluidas", completeTasksArrayJSON);
}

/**
 * Obtém as tarefas do armazenamento local e carrega na página
 */
function getTasks() {
  let activeTasksArrayJSON = localStorage.getItem("Ativas");
  let completeTasksArrayJSON = localStorage.getItem("Concluidas");
  let activeTasksArray = JSON.parse(activeTasksArrayJSON);
  let completeTasksArray = JSON.parse(completeTasksArrayJSON);

  try {
    activeTasksArray.forEach((task) => createTask(task, 0));
    completeTasksArray.forEach((task) => createTask(task, 1));
  } catch (error) {
    console.log("Não há tarefas salvas.");
  }
}

/**
 * Salva a tarefa ativa no armazenamento local
 */
function saveCurrentTask() {
  localStorage.setItem("Atual", currentTask);
}

/**
 * Obtém a tarefa ativa do armazenamento local e a destaca na lista de tarefas
 */
function getCurrentTask() {
  const tasks = taskList.querySelectorAll("li");
  currentTask = localStorage.getItem("Atual");
  tasks.forEach((task) => {
    if (task.textContent === currentTask) {
      task.classList.add("app__section-task-list-item-active");
    }
  });
  currentTaskSection.textContent = currentTask;
}

/**
 * Manipula a abertura e o fechamento da página de edição de tarefas
 * @param {boolean} animationState - Indica se a animação de abertura/fechamento da página de edição será ativada/desativada
 */
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

/**
 * Remove a seleção das tarefas ativas
 */
function removeSelection() {
  let tasksArray = taskList.querySelectorAll("li");

  tasksArray.forEach((item) => {
    item.classList.remove("app__section-task-list-item-active");
  });

  currentTaskSection.textContent = "";
}

/**
 * Exibe mensagens de erro
 * @param {boolean} i - Índice da mensagem de erro a ser exibida
 */
function displayErrorMessage(i) {
  let errorMessage;

  if (i === 0) {
    errorMessage = editInput.parentElement.nextElementSibling;
  } else {
    errorMessage = textarea.previousElementSibling;
  }

  errorMessage.style.display = "block";
  setTimeout(() => (errorMessage.style.opacity = 1), 100);
  setTimeout(() => {
    errorMessage.style.opacity = 0;
    errorMessage.style.display = "none";
  }, 5000);
}

// Carrega as tarefas ao carregar a página
getTasks();
getCurrentTask();