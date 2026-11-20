import { createGame, apply } from './engine.js';
import { createUI } from './ui.js';
import { TurnTimer } from './timer.js';
import { LANGS, detectLang, setLang, t } from './i18n.js';

const DEFAULTS = { timer: true, seconds: 5, autoTouch: true, lang: detectLang() };
const KEY = 'tac-settings';

function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}
function saveSettings() {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* privatni režim – podešavanja važe samo do zatvaranja */
  }
}

const vibrate = (pattern) => {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* nije podržano */
  }
};

let settings = loadSettings();
let state = null;
let busy = false;

const ui = createUI({ onAction: act });
const timer = new TurnTimer({
  onTick: (fraction, ms) => state && ui.setTimer(state.current, fraction, ms),
  onTimeout: () => {
    vibrate(200);
    act({ type: 'TIMEOUT', player: state.current });
  },
});

function stopTimer() {
  timer.stop();
  ui.clearTimer();
}

function restartTimer() {
  if (settings.timer && state && state.winner === null && menu.hidden) timer.start(settings.seconds * 1000);
  else stopTimer();
}

/** Jedina tačka kroz koju prolaze sve akcije. Vraća false za nevalidan potez. */
function act(action) {
  if (!state) return false;
  if (busy) {
    vibrate(30); // dok traje poruka TAČ, ništa se ne igra
    return false;
  }
  const { state: next, events } = apply(state, { ...action, now: Date.now() });
  if (events[0]?.type === 'invalid') {
    vibrate(30);
    return false;
  }
  state = next;
  ui.render(state);

  const touch = events.find((e) => e.type === 'touch');
  const win = events.find((e) => e.type === 'win');

  if (touch) {
    vibrate([90, 60, 90]);
    busy = true;
    stopTimer();
    ui.setLocked(true);
    ui.showTouch(touch).then(() => {
      busy = false;
      ui.setLocked(false);
      if (win) finish(win.player);
      else restartTimer();
    });
    return true;
  }
  if (win) {
    finish(win.player);
    return true;
  }
  if (events.some((e) => e.type === 'turn')) vibrate(15);
  restartTimer();
  return true;
}

function finish(winner) {
  stopTimer();
  vibrate([60, 40, 60, 40, 200]);
  setTimeout(() => ui.showWin(winner), 400);
}

// ---------- meni ----------
const menu = document.getElementById('menu');
const optTimer = document.getElementById('opt-timer');
const optSeconds = document.getElementById('opt-seconds');
const optAuto = document.getElementById('opt-auto');
const optLang = document.getElementById('opt-lang');
optLang.append(...Object.entries(LANGS).map(([code, name]) => new Option(name, code)));
const rowSeconds = document.getElementById('row-seconds');
const resumeBtn = document.getElementById('resume-btn');
const startBtn = document.getElementById('start-btn');

function applySettingsToPage() {
  optTimer.checked = settings.timer;
  optSeconds.value = String(settings.seconds);
  optAuto.checked = settings.autoTouch;
  optLang.value = settings.lang;
  setLang(settings.lang);
  updateStartLabel();
  if (state) ui.render(state);
  rowSeconds.classList.toggle('disabled', !settings.timer);
  optSeconds.disabled = !settings.timer;
  document.body.classList.toggle('no-timer', !settings.timer);
  document.body.classList.toggle('manual-touch', !settings.autoTouch);
}

function readSettings() {
  settings = { timer: optTimer.checked, seconds: +optSeconds.value, autoTouch: optAuto.checked, lang: optLang.value };
  saveSettings();
  applySettingsToPage();
}
[optTimer, optSeconds, optAuto, optLang].forEach((el) => el.addEventListener('change', readSettings));

function openMenu() {
  timer.pause();
  resumeBtn.hidden = !(state && state.winner === null);
  updateStartLabel();
  menu.hidden = false;
}

function updateStartLabel() {
  startBtn.textContent = state && state.winner === null ? t('newGame') : t('start');
}

function closeMenu() {
  menu.hidden = true;
  requestWakeLock();
}

document.getElementById('menu-btn').addEventListener('click', openMenu);

resumeBtn.addEventListener('click', () => {
  closeMenu();
  state.autoTouch = settings.autoTouch; // promena moda važi i u toku partije
  // nastavlja se preostalo vreme – meni ne sme da daje novo vreme za potez
  if (settings.timer && timer.paused && !busy) timer.resume();
  else restartTimer();
});

function startGame() {
  ui.hideWin();
  closeMenu();
  busy = false;
  ui.setLocked(false);
  state = createGame({ autoTouch: settings.autoTouch });
  ui.render(state);
  restartTimer();
}
startBtn.addEventListener('click', startGame);
document.getElementById('again-btn').addEventListener('click', startGame);

// ---------- ekran ne sme da se ugasi tokom igre ----------
let wakeLock = null;
async function requestWakeLock() {
  try {
    if (!wakeLock || wakeLock.released) wakeLock = await navigator.wakeLock?.request('screen');
  } catch {
    /* nije podržano ili odbijeno */
  }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && state && state.winner === null && menu.hidden) openMenu();
});

applySettingsToPage();

// Pomoć za testiranje: index.html?debug
if (new URLSearchParams(location.search).has('debug')) {
  window.__tac = {
    get state() { return state; },
    set state(s) { state = s; ui.render(s); },
    act,
  };
}

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
