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
// Uzastopni isteci vremena bez ijednog poteza: igrači su verovatno napustili partiju,
// pa se igra pauzira umesto da kažnjava i zvoni u krug.
const IDLE_LIMIT = 3;
let idleTimeouts = 0;

// telefoni puštaju zvuk tek posle dodira – zvuk se „otključava“ na svaki dodir (capture: pre svih drugih)
// iPhone ne prihvata svaki dodir kao dozvolu za zvuk (pointerdown često nije dovoljan), pa se pokušava na više događaja
for (const type of ['pointerdown', 'touchend', 'click', 'keydown']) {
  window.addEventListener(type, () => sfx.unlock(), { capture: true });
}

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
  // vreme počinje da teče tek posle prvog poteza u partiji – igrači prvo vide ko igra prvi
  const started = state && state.seq > 0;
  if (settings.timer && started && state.winner === null && menu.hidden) timer.start(settings.seconds * 1000);
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
    // nemoguć potez sa otvorene gomile se ne kažnjava: karta samo padne nazad na gomilu
    if (events[0].reason === 'illegal') {
      sfx.place(0, { pile: state.players[action.player].open.length, speed: action.speed });
      return false;
    }
    vibrate(30);
    // pritisak na TAČ bez prekršaja i dodir tuđe gomile ostaju tihi – zvuk bi odao da prekršaja nema
    if (action.type !== 'CALL_TOUCH') sfx.invalid();
    return false;
  }
  state = next;
  ui.render(state);
  idleTimeouts = action.type === 'TIMEOUT' ? idleTimeouts + 1 : 0;

  const touch = events.find((e) => e.type === 'touch');
  const win = events.find((e) => e.type === 'win');
  playSound(events, touch, action);

  const turned = events.some((e) => e.type === 'turn');
  // Vreme se vraća na početak samo kad je karta stavljena na sredinu ili protivnika, ili kad red pređe.
  // Okretanje karte, okretanje gomile i sl. ne daju novo vreme – inače tajmer gubi smisao.
  const freshTime = turned || events.some((e) => e.type === 'move');
  const continueTimer = () => {
    if (idleTimeouts >= IDLE_LIMIT) return pauseIdle();
    if (!menu.hidden) return; // „Nastavi“ u meniju nastavlja preostalo vreme
    if (freshTime || !(timer.running || timer.paused)) restartTimer();
    else if (timer.paused) timer.resume();
  };

  if (touch) {
    vibrate([90, 60, 90]);
    busy = true;
    // tokom poruke TAČ vreme stoji; ako red ostaje istom igraču, nastavlja se preostalo vreme
    if (turned) stopTimer();
    else {
      timer.pause();
      ui.clearTimer();
    }
    ui.setLocked(true);
    ui.showTouch(touch).then(() => {
      busy = false;
      ui.setLocked(false);
      if (win) finish(win.player);
      else continueTimer();
    });
    return true;
  }
  if (win) {
    finish(win.player);
    return true;
  }
  if (turned) vibrate(15);
  continueTimer();
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
function playSound(events, touch, action) {
  const has = (type) => events.some((e) => e.type === type);
  const move = events.find((e) => e.type === 'move');
  const speed = action.speed; // brzina prsta pri puštanju karte (šalje je ui.js)
  if (touch) touch.reason === 'timeout' ? sfx.bell() : sfx.slap();
  else if (move) {
    const pile = move.to === 'center' ? state.center : state.players[1 - move.player].open;
    sfx.place(0, { pile: pile.length, speed });
  } else if (has('recycle')) sfx.recycle(0, { pile: state.players[action.player].closed.length });
  else if (has('flip')) sfx.flip();
  // okrenuta karta pada na svoju otvorenu gomilu
  else if (has('turn')) sfx.place(0, { pile: state.players[action.player].open.length, speed });
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
const idleNote = document.getElementById('idle-note');

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

/** Niko ne igra: igra se pauzira i otvara se meni sa objašnjenjem. */
function pauseIdle() {
  stopTimer();
  idleNote.hidden = false;
  openMenu();
}

function closeMenu() {
  menu.hidden = true;
  idleNote.hidden = true;
  idleTimeouts = 0;
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

// ---------- bez zumiranja ----------
// iPhone ne poštuje user-scalable=no: dupli dodir i dva prsta zumiraju stranu, a u igri dva igrača
// često dodiruju ekran istovremeno. Zato se zum blokira, a već zumirana strana vraća na normalu.
let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  (e) => {
    // drugi dodir u kratkom roku = dupli dodir; padajući meni mora i dalje da radi
    if (e.timeStamp - lastTouchEnd < 350 && !e.target.closest('select')) e.preventDefault();
    lastTouchEnd = e.timeStamp;
  },
  { passive: false },
);
document.addEventListener('dblclick', (e) => e.preventDefault());
document.addEventListener('gesturestart', (e) => e.preventDefault()); // iPhone: zum sa dva prsta

/** Strana ostala zumirana (Safari pamti zum i posle osvežavanja) – ponovno postavljanje viewport-a je vraća. */
const viewportMeta = document.querySelector('meta[name="viewport"]');
const VIEWPORT = viewportMeta.content;
function resetZoom() {
  if (!window.visualViewport || window.visualViewport.scale <= 1.01) return;
  viewportMeta.content = VIEWPORT.replace('initial-scale=1', 'initial-scale=1.0001');
  requestAnimationFrame(() => (viewportMeta.content = VIEWPORT));
}
window.visualViewport?.addEventListener('resize', resetZoom);
resetZoom();

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
