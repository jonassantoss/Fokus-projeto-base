// Seleção de elementos HTML
const html = document.querySelector("html");
const appTitle = document.querySelector(".app__title");
const appTitle_strong = document.querySelector(".app__title-strong");
const appFigure = document.querySelector(".app__image");
const btFocus = document.querySelector(".app__card-button--foco");
const btShort = document.querySelector(".app__card-button--curto");
const btLong = document.querySelector(".app__card-button--longo");
const start = document.querySelector(".app__card-primary-button");
const reset = document.querySelector(".app__card-secondary-button");
const musicButton = document.querySelector(".toggle-checkbox");
const buttonImg = document.querySelector(".app__card-primary-button-icon");
const timer = document.querySelector(".app__card-timer");

// Definição dos tempos iniciais para foco, curto e longo
const times = [
  {min: 25, sec: 0,}, // Tempo inicial para foco
  {min: 5, sec: 0,},  // Tempo inicial para pausa curta
  {min: 15, sec: 0,}  // Tempo inicial para pausa longa
];

// Inicialização de variáveis e objetos
let interval; // Intervalo para atualização do timer
let audio = new Audio(); // Objeto de áudio para efeitos sonoros
let backgroundMusic = new Audio("sons/luna-rise-part-one.mp3"); // Música de fundo
backgroundMusic.volume = 0.25;
backgroundMusic.loop = true;

// Exibição inicial do tempo no timer
timer.innerHTML = `${zero(times[0].min)}:${zero(times[0].sec)}`;

// Adiciona ouvintes de eventos aos botões e elementos
btFocus.addEventListener("click", function() {
  let context = "foco"
  html.setAttribute("data-contexto", context);
  changeTimer(context);
  changeContextPage(context, this);
});
btShort.addEventListener("click", function() {
  let context = "short"
  html.setAttribute("data-contexto", context);
  changeTimer(context);
  changeContextPage(context, this);
});
btLong.addEventListener("click", function() {
  let context = "long"
  html.setAttribute("data-contexto", context);
  changeTimer(context);
  changeContextPage(context, this);
});
start.addEventListener("click", toggleTimer);
reset.addEventListener("click", resetTimer);
musicButton.addEventListener("change", toggleBackgroundMusic);

/**
 * Altera o contexto da página com base no botão de contexto selecionado
 * @param {string} context - Contexto selecionado (foco, curto, longo)
 * @param {HTMLElement} button - Botão de contexto do timer selecionado
 */
function changeContext(context, button) {
  
}

/**
 * Altera a aparência do botão inicio/pausa do timer
 * @param {boolean} key - Indica se o botão está ativo (true) ou inativo (false)
 */
function changeButton(key) {
  start.innerHTML = "";

  if (!key) {
    if (start.classList.contains("actived")) {
      // Altera o botão para o estado de pausa
      start.classList.remove("actived");
      buttonImg.src = "imagens/play_arrow.png";
      start.appendChild(buttonImg);
      start.innerHTML += "<span>Começar</span>";
    } else {
      // Altera o botão para o estado de início
      start.classList.add("actived");
      buttonImg.src = "imagens/pause.png";
      start.appendChild(buttonImg);
      start.innerHTML += "<span>Pausar</span>";
    }
  } else {
    // Reinicia o botão para o estado de início
    start.classList.remove("actived");
    buttonImg.src = "imagens/play_arrow.png";
    start.appendChild(buttonImg);
    start.innerHTML += "<span>Começar</span>";
  }
}

/**
 * Altera o contexto da página com base no botão de contexto selecionado
 * @param {string} context - Contexto selecionado (foco, curto, longo)
 * @param {HTMLButtonElement} button - Botão de contexto do timer selecionado
 */
function changeContextPage(context, button) {
  let text = changeBannerText(context);
  let i = context === "foco" ? 0 : context === "short" ? 1 : 2;
  appTitle.innerHTML = text;
  appTitle.appendChild(appTitle_strong);
  appFigure.src = `imagens/${context}.webp`;
  timer.innerHTML = `${zero(times[i].min)}:${zero(times[i].sec)}`;

  btFocus.classList.remove("active");
  btLong.classList.remove("active");
  btShort.classList.remove("active");
  button.classList.add("active");
}

/**
 * Gera o texto do banner com base no contexto selecionado
 * @param {string} context - Contexto selecionado (foco, curto, longo)
 * @returns {string} Texto gerado para o banner da página
 */
function changeBannerText(context) {
  let text;

  if (context === "foco") {
    text = "Otimize sua produtividade,<br>";
    appTitle_strong.innerText = "mergulhe no que importa";
  } else if (context === "short") {
    text = "Que tal dar<br>uma respirada?<br>";
    appTitle_strong.innerText = "Faça uma pausa curta.";
  } else {
    text = "Hora de voltar<br>à superficie.<br>";
    appTitle_strong.innerText = "Faça uma pausa longa.";
  }

  return text;
}

/**
 * Altera a aparência do botão início/pausa do timer
 */
function toggleTimer() {
  let context = html.getAttribute("data-contexto");
  changeButton(0);

  if (!start.classList.contains("actived")) {
    audio.src = "sons/pause.mp3";
    audio.play();
    clearInterval(interval);
  } else {
    audio.src = "sons/play.wav";
    audio.play();
    interval = setInterval(() => {
      let response = counter(context);
      timer.innerHTML = response;
    }, 1000);
  }
}

/**
 * Reinicia o timer
 */
function resetTimer() {
  let context = html.getAttribute("data-contexto");
  let i = context == "foco" ? 0 : context == "short" ? 1 : 2;
  times[i].min = i === 0 ? 25 : i === 1 ? 5 : 15;
  times[i].sec = 0;
  changeButton(1);
  audio.src = "sons/pause.mp3";
  audio.play();
  clearInterval(interval);
  timer.innerHTML = `${zero(times[i].min)}:${zero(times[i].sec)}`;
}

/**
 * Altera o tempo exibido no timer com base no contexto
 * @param {string} context - Contexto selecionado (foco, curto, longo)
 */
function changeTimer(context) {
  if (context === "foco") {
    timer.innerHTML = `${times[0].min}:${times[0].sec}`;
  } else if (context === "short") {
    timer.innerHTML = `${times[1].min}:${times[1].sec}`;
  } else {
    timer.innerHTML = `${times[2].min}:${times[2].sec}`;
  }
}

/**
 * Manipula o contador do timer e retorna o tempo formatado
 * @param {string} context - Contexto do timer (foco, curto, longo)
 * @returns {string} Tempo formatado (MM:SS)
 */
function counter(context) {
  let i = context == "foco" ? 0 : context == "short" ? 1 : 2;

  if (times[i].min === 0 && times[i].sec === 0) {
    return `00:00`;
  } else {
    if (times[i].min !== 0 && times[i].sec === 0) {
      times[i].min -= 1;
      times[i].sec = 59;
    } else {
      times[i].sec -= 1;
    }
  }

  if (times[i].min === 0 && times[i].sec === 0) {
    finishTimer();
  }

  return `${zero(times[i].min)}:${zero(times[i].sec)}`;
}

/**
 * Aciona o som de alerta ao finalizar o tempo do timer
 */
function finishTimer() {
  audio.src = "sons/beep.mp3";
  audio.play();
}

/**
 * Formata um número para ter dois dígitos, adicionando um zero à esquerda se necessário
 * @param {number} num - Número a ser formatado
 * @returns {number} Número formatado com dois dígitos
 */
function zero(num) {
  return num >= 10 ? num : `0${num}`;
}

/**
 * Altera o estado da música de fundo (ligada/desligada)
 */
function toggleBackgroundMusic() {
  if (!backgroundMusic.paused) {
    backgroundMusic.pause();
  } else {
    if (musicButton.checked) {
      backgroundMusic.play();
    }
  }
}