import { createGame, apply } from './engine.js';
import { createUI } from './ui.js';
import { TurnTimer } from './timer.js';
import { LANGS, detectLang, setLang, t } from './i18n.js';
import * as sfx from './audio.js';

const DEFAULTS = { timer: true, seconds: 5, autoTouch: true, sound: true, lang: detectLang() };
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
let lastSec = 0; // poslednja sekunda za koju je kucnuo sat

// telefoni puštaju zvuk tek posle dodira – zvuk se „otključava“ na svaki dodir (capture: pre svih drugih)
window.addEventListener('pointerdown', () => sfx.unlock(), { capture: true });

const ui = createUI({ onAction: act });
const timer = new TurnTimer({
  onTick: (fraction, ms) => {
    if (!state) return;
    ui.setTimer(state.current, fraction, ms);
    // sat kucka u poslednje 3 sekunde
    const sec = Math.ceil(ms / 1000);
    if (sec !== lastSec && sec <= 3 && sec > 0 && ms > 0) sfx.tick(sec === 1);
    lastSec = sec;
  },
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
  lastSec = 0;
  if (settings.timer && state && state.winner === null && menu.hidden) timer.start(settings.seconds * 1000);
  else stopTimer();
}

/** Jedina tačka kroz koju prolaze sve akcije. Vraća false za nevalidan potez. */
function act(action) {
  if (!state) return false;
  if (busy) {
    vibrate(30); // dok traje poruka TAČ, ništa se ne igra
    sfx.invalid();
    return false;
  }
  const { state: next, events } = apply(state, { ...action, now: Date.now() });
  if (events[0]?.type === 'invalid') {
    vibrate(30);
    // pritisak na TAČ bez prekršaja i dodir tuđe gomile ostaju tihi – zvuk bi odao da prekršaja nema
    if (action.type !== 'CALL_TOUCH') sfx.invalid();
    return false;
  }
  state = next;
  ui.render(state);

  const touch = events.find((e) => e.type === 'touch');
  const win = events.find((e) => e.type === 'win');
  playSound(events, touch);

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
  setTimeout(() => {
    sfx.fanfare();
    ui.showWin(winner);
  }, 400);
}

/** Jedan zvuk po akciji – onaj koji najbolje opisuje šta se desilo na stolu. */
function playSound(events, touch) {
  const has = (type) => events.some((e) => e.type === type);
  if (touch) touch.reason === 'timeout' ? sfx.bell() : sfx.slap();
  else if (has('move')) sfx.place();
  else if (has('recycle')) sfx.recycle();
  else if (has('flip')) sfx.flip();
  else if (has('turn')) sfx.place(); // okrenuta karta pada na svoju otvorenu gomilu
}

// ---------- meni ----------
const menu = document.getElementById('menu');
const optTimer = document.getElementById('opt-timer');
const optSeconds = document.getElementById('opt-seconds');
const optAuto = document.getElementById('opt-auto');
const optLang = document.getElementById('opt-lang');
const optSound = document.getElementById('opt-sound');
optLang.append(...Object.entries(LANGS).map(([code, name]) => new Option(name, code)));
const rowSeconds = document.getElementById('row-seconds');
const resumeBtn = document.getElementById('resume-btn');
const startBtn = document.getElementById('start-btn');

function applySettingsToPage() {
  optTimer.checked = settings.timer;
  optSeconds.value = String(settings.seconds);
  optAuto.checked = settings.autoTouch;
  optSound.checked = settings.sound;
  sfx.setEnabled(settings.sound);
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
  settings = {
    timer: optTimer.checked,
    seconds: +optSeconds.value,
    autoTouch: optAuto.checked,
    sound: optSound.checked,
    lang: optLang.value,
  };
  saveSettings();
  applySettingsToPage();
}
[optTimer, optSeconds, optAuto, optSound, optLang].forEach((el) => el.addEventListener('change', readSettings));

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
  sfx.shuffle();
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
