// Demonstracija za početnike: kratka partija na pravom stolu koju vodi skripta.
// Svi potezi idu kroz pravi engine (apply), pa demo uvek prati prava pravila.
// Igrač 0 (dole) je „ti“, igrač 1 (gore) je protivnik.
import { createGame, apply } from './engine.js';

const card = (r, s) => ({ id: s * 13 + r, r, s });
// Vrhovi zatvorenih gomila, odozdo nagore (poslednja karta se prva okreće).
const P0_TOP = [card(6, 0), card(8, 2), card(4, 3), card(2, 1), card(1, 0)];
const P1_TOP = [card(13, 0), card(5, 3), card(9, 1), card(3, 2)];

/** Početno stanje demo partije: po 26 karata, ti igraš prvi. */
export function demoGame() {
  const used = new Set([...P0_TOP, ...P1_TOP].map((c) => c.id));
  const rest = [];
  for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) if (!used.has(s * 13 + r)) rest.push(card(r, s));
  const fill0 = 26 - P0_TOP.length;
  const p0 = [...rest.slice(0, fill0), ...P0_TOP];
  const p1 = [...rest.slice(fill0), ...P1_TOP];
  const deck = [];
  for (let i = 0; i < 26; i++) deck.push(p0[i], p1[i]); // createGame deli naizmenično
  return createGame({ deck, firstPlayer: 0, autoTouch: true, seed: 1 });
}

/**
 * Scenarij. Koraci:
 *  { say }            – natpis (ostaje dok ne dođe sledeći)
 *  { spot }           – istakne gomilu: ['closed'|'open', igrač] ili ['center']
 *  { hot, to, say? }  – igrač pritisne i drži zatvorenu, okrene kartu i prevuče je (to: center|opp|own);
 *                       natpis `say` se pojavi dok je karta u ruci (da ne otkrije kartu unapred)
 *  { open, to }       – igrač prevuče kartu sa svoje otvorene gomile
 *  { touch, say }     – igrač okrene zatvorenu iako je imao potez → TAČ, posle poruke natpis `say`
 */
export const DEMO_STEPS = [
  { say: 'demoClosed', spot: ['closed', 0] },
  { say: 'demoOpen', spot: ['open', 0] },
  { say: 'demoCenter', spot: ['center'] },
  { say: 'demoFlip' },
  { hot: 0, to: 'center' },
  { say: 'demoUp' },
  { hot: 0, to: 'center' },
  { hot: 0, to: 'own', say: 'demoNowhere' },
  { hot: 1, to: 'center', say: 'demoOpp' },
  { hot: 1, to: 'own' },
  { say: 'demoOpenFirst' },
  { open: 0, to: 'center' },
  { hot: 0, to: 'opp', say: 'demoPlusMinus' },
  { hot: 0, to: 'own', say: 'demoOwnAgain' },
  { hot: 1, to: 'center', say: 'demoOppAgain' },
  { hot: 1, to: 'own' },
  { say: 'demoMistake' },
  { touch: 0, say: 'demoTouch' },
  { say: 'demoEnd' },
];

/** Akcije engine-a za jedan korak (koristi i test). */
export function stepActions(step) {
  if (step.hot !== undefined) {
    return [
      { type: 'FLIP', player: step.hot },
      { type: 'PLAY', player: step.hot, from: 'flipped', to: step.to },
    ];
  }
  if (step.open !== undefined) return [{ type: 'PLAY', player: step.open, from: 'open', to: step.to }];
  if (step.touch !== undefined) return [{ type: 'FLIP', player: step.touch }];
  return [];
}

class Aborted extends Error {}

/**
 * Pokreće demo na stolu. Vraća { done, abort }: `done` se razrešava kad se demo završi ili prekine.
 * ui – objekat iz createUI; sfx – audio.js; t – prevod; caption – element za natpis.
 */
export function runDemo({ ui, sfx, t, caption }) {
  let state = demoGame();
  let aborted = false;
  const timeouts = new Set();
  let raf = 0;
  const temp = new Set(); // privremeni elementi (prst, karte u letu)
  let spotted = null;
  let finish;
  const done = new Promise((res) => (finish = res));

  const check = () => {
    if (aborted) throw new Aborted();
  };
  const wait = (ms) =>
    new Promise((res) => {
      const id = setTimeout(() => {
        timeouts.delete(id);
        res();
      }, ms);
      timeouts.add(id);
    }).then(check);
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
  const tween = (ms, fn) =>
    new Promise((res) => {
      const t0 = performance.now();
      const frame = (now) => {
        if (aborted) return;
        const k = Math.min(1, (now - t0) / ms);
        fn(ease(k));
        if (k < 1) raf = requestAnimationFrame(frame);
        else res();
      };
      raf = requestAnimationFrame(frame);
    }).then(check);

  const add = (el) => {
    document.body.append(el);
    temp.add(el);
    return el;
  };
  const drop = (el) => {
    el.remove();
    temp.delete(el);
  };
  const centerOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  const slotOf = (kind, p) => ui.slot(kind, p);

  /** Natpis stoji preko zatvorene gomile igrača koji nije na potezu – ta gomila tada nije bitna. */
  function placeCaption() {
    const c = centerOf(slotOf('closed', 1 - state.current));
    caption.style.top = `${c.y - caption.offsetHeight / 2}px`;
  }

  function say(key) {
    caption.textContent = t(key);
    caption.hidden = false;
    placeCaption();
    caption.classList.remove('show');
    void caption.offsetWidth; // ponovo pokreni animaciju pojavljivanja
    caption.classList.add('show');
    return wait(Math.max(2200, t(key).length * 55));
  }

  // ---------- prst ----------
  const finger = add(document.createElement('div'));
  finger.className = 'demo-finger';
  let fx = 0, fy = 0;
  const putFinger = (x, y) => {
    fx = x;
    fy = y;
    finger.style.left = `${x}px`;
    finger.style.top = `${y}px`;
  };
  /** Prst dolazi sa ivice igrača do tačke. */
  async function fingerTo(pt, p) {
    const edge = p === 0 ? innerHeight + 40 : -40;
    if (!finger.classList.contains('on')) putFinger(pt.x + 30, (pt.y + edge) / 2);
    finger.classList.add('on');
    const sx = fx, sy = fy;
    await tween(450, (k) => putFinger(sx + (pt.x - sx) * k, sy + (pt.y - sy) * k));
  }
  async function press(on) {
    finger.classList.toggle('down', on);
    await wait(150);
  }
  function hideFinger() {
    finger.classList.remove('on', 'down');
  }

  // ---------- karta u ruci ----------
  /** Karta je malo „ispred“ prsta, gledano od igrača (kao u pravoj igri). */
  const lift = (g, p) => g.offsetWidth * 0.5 * (p === 1 ? -1 : 1);
  function holdCard(c, p) {
    const g = add(ui.cardEl(c, false));
    g.classList.add('ghost');
    if (p === 1) g.classList.add('flip180');
    const place = () => {
      g.style.left = `${fx - g.offsetWidth / 2}px`;
      g.style.top = `${fy - g.offsetHeight / 2 - lift(g, p)}px`;
    };
    place();
    return { g, place };
  }
  /** Prevuci kartu tako da njena sredina stigne na cilj. */
  async function carry(held, p, target, ms = 700) {
    const sx = fx, sy = fy;
    const ex = target.x, ey = target.y + lift(held.g, p);
    await tween(ms, (k) => {
      putFinger(sx + (ex - sx) * k, sy + (ey - sy) * k);
      held.place();
    });
  }

  function act(action) {
    const { state: next, events } = apply(state, action);
    if (events[0]?.type === 'invalid') throw new Error(`demo: nevalidan potez ${JSON.stringify(action)}`);
    state = next;
    return events;
  }
  const render = () => ui.render(state);

  function targetPoint(p, to) {
    if (to === 'center') return centerOf(slotOf('center'));
    if (to === 'opp') return centerOf(slotOf('open', 1 - p));
    // „pusti bilo gde“: malo u stranu od zatvorene gomile
    const c = centerOf(slotOf('closed', p));
    return { x: c.x + innerWidth * 0.22, y: c.y + (p === 0 ? -1 : 1) * innerHeight * 0.08 };
  }

  async function land(p, to, from) {
    const events = act({ type: 'PLAY', player: p, from, to });
    ui.setHold(null);
    render();
    const move = events.find((e) => e.type === 'move');
    const pile = move ? (to === 'center' ? state.center : state.players[1 - p].open) : state.players[p].open;
    sfx.place(0, { pile: pile.length, speed: 0.6 });
  }

  async function hotStep(p, to, key) {
    await fingerTo(centerOf(slotOf('closed', p)), p);
    await press(true);
    act({ type: 'FLIP', player: p });
    ui.setHold({ player: p, hot: true });
    render();
    sfx.flip();
    const held = holdCard(state.flipped, p);
    if (key) await say(key);
    else await wait(700); // igrač pogleda kartu
    const target = targetPoint(p, to);
    const spot = to === 'own' ? null : slotOf(to === 'center' ? 'center' : 'open', to === 'center' ? 0 : 1 - p);
    await carry(held, p, target, to === 'own' ? 450 : 700);
    spot?.classList.add('hover');
    await wait(to === 'own' ? 350 : 200);
    spot?.classList.remove('hover');
    drop(held.g);
    await press(false);
    await land(p, to, 'flipped');
    hideFinger();
    await wait(800);
  }

  async function openStep(p, to) {
    await fingerTo(centerOf(slotOf('open', p)), p);
    await press(true);
    ui.setHold({ player: p, hot: false });
    const top = state.players[p].open[state.players[p].open.length - 1];
    const held = holdCard(top, p);
    render();
    sfx.pickup();
    await wait(400);
    const spot = slotOf(to === 'center' ? 'center' : 'open', to === 'center' ? 0 : 1 - p);
    await carry(held, p, targetPoint(p, to));
    spot.classList.add('hover');
    await wait(200);
    spot.classList.remove('hover');
    drop(held.g);
    await press(false);
    await land(p, to, 'open');
    hideFinger();
    await wait(800);
  }

  async function touchStep(p, afterKey) {
    await fingerTo(centerOf(slotOf('closed', p)), p);
    await press(true);
    const prev = state;
    const events = act({ type: 'FLIP', player: p });
    const touch = events.find((e) => e.type === 'touch');
    sfx.slap();
    caption.hidden = true; // TAČ poruka ima svoje tekstove za oba igrača
    const shown = ui.showTouch(touch);
    await press(false);
    hideFinger();
    await shown;
    check();
    // kaznena karta putuje sa dna protivnikove zatvorene na dno tvoje
    const from = centerOf(slotOf('closed', 1 - p));
    const to = centerOf(slotOf('closed', p));
    const fly = add(ui.cardEl(null, true));
    fly.classList.add('demo-fly');
    const at = (k) => {
      fly.style.left = `${from.x + (to.x - from.x) * k - fly.offsetWidth / 2}px`;
      fly.style.top = `${from.y + (to.y - from.y) * k - fly.offsetHeight / 2}px`;
    };
    at(0);
    await wait(300);
    sfx.pickup();
    await tween(900, at);
    drop(fly);
    sfx.place(0, { pile: prev.players[p].closed.length + 1, speed: 0.4 });
    render(); // red prelazi na protivnika
    await say(afterKey);
    await wait(800);
  }

  async function play() {
    ui.setHold(null);
    render();
    sfx.shuffle();
    await wait(900);
    for (const step of DEMO_STEPS) {
      if (step.hot !== undefined) await hotStep(step.hot, step.to, step.say);
      else if (step.open !== undefined) await openStep(step.open, step.to);
      else if (step.touch !== undefined) await touchStep(step.touch, step.say);
      else {
        spotted?.classList.remove('demo-spot');
        spotted = step.spot ? slotOf(step.spot[0], step.spot[1]) : null;
        spotted?.classList.add('demo-spot');
        await say(step.say);
      }
    }
    spotted?.classList.remove('demo-spot');
    await wait(600);
  }

  function cleanup() {
    for (const id of timeouts) clearTimeout(id);
    timeouts.clear();
    cancelAnimationFrame(raf);
    for (const el of temp) el.remove();
    temp.clear();
    spotted?.classList.remove('demo-spot');
    document.querySelectorAll('.slot.hover').forEach((el) => el.classList.remove('hover'));
    caption.hidden = true;
    ui.setHold(null);
    ui.hideTouch();
  }

  function end() {
    if (aborted) return;
    aborted = true;
    cleanup();
    finish();
  }

  play().then(end, (e) => {
    if (!(e instanceof Aborted)) console.error(e);
    end();
  });

  return { done, abort: end };
}
