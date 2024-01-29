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
const times = [
  (timeFocus = {
    min: 25,
    sec: 0,
  }),
  (timeShort = {
    min: 5,
    sec: 0,
  }),
  (timeLong = {
    min: 15,
    sec: 0,
  }),
];
let interval;
let audio = new Audio();
let backgroundMusic = new Audio("sons/luna-rise-part-one.mp3");
backgroundMusic.volume = 0.25;
backgroundMusic.loop = true;

timer.innerHTML = `${zero(times[0].min)}:${zero(times[0].sec)}`;

btFocus.addEventListener("click", function () {
  let context = this.getAttribute("data-contexto");
  html.setAttribute("data-contexto", "foco");
  changeTimer(context);
  changeContextPage(context, this);
});

btShort.addEventListener("click", function () {
  let context = this.getAttribute("data-contexto");
  html.setAttribute("data-contexto", "short");
  changeTimer(context);
  changeContextPage(context, this);
});

btLong.addEventListener("click", function () {
  let context = this.getAttribute("data-contexto");
  html.setAttribute("data-contexto", "long");
  changeTimer(context);
  changeContextPage(context, this);
});

start.addEventListener("click", function () {
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
});

reset.addEventListener("click", () => {
  let context = html.getAttribute("data-contexto");
  let i = context == "foco" ? 0 : context == "short" ? 1 : 2;
  times[i].min = i === 0 ? 25 : i === 1 ? 5 : 15;
  times[i].sec = 0;
  changeButton(1);
  audio.src = "sons/pause.mp3";
  audio.play();
  clearInterval(interval);
  timer.innerHTML = `${zero(times[i].min)}:${zero(times[i].sec)}`;
});

musicButton.addEventListener("change", () => {
  if (!backgroundMusic.paused) {
    backgroundMusic.pause();
  } else {
    if (musicButton.checked) {
      backgroundMusic.play();
    }
  }
});

function changeButton(key) {
  start.innerHTML = "";

  if (!key) {
    if (start.classList.contains("actived")) {
      start.classList.remove("actived");
      buttonImg.src = "imagens/play_arrow.png";
      start.appendChild(buttonImg);
      start.innerHTML += "<span>Começar</span>";
    } else {
      start.classList.add("actived");
      buttonImg.src = "imagens/pause.png";
      start.appendChild(buttonImg);
      start.innerHTML += "<span>Pausar</span>";
    }
  } else {
    start.classList.remove("actived");
    buttonImg.src = "imagens/play_arrow.png";
    start.appendChild(buttonImg);
    start.innerHTML += "<span>Começar</span>";
  }
}

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

function changeTimer(context) {
  if (context === "foco") {
    timer.innerHTML = `${times[0].min}:${times[0].sec}`;
  } else if (context === "short") {
    timer.innerHTML = `${times[1].min}:${times[1].sec}`;
  } else {
    timer.innerHTML = `${times[2].min}:${times[2].sec}`;
  }
}

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

  return `${zero(times[i].min)}:${zero(times[i].sec)}`;
}

function zero(num) {
  return num >= 10 ? num : `0${num}`;
}
