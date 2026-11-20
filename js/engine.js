// Tač (Touch) – čista logika igre, bez DOM-a.
// Isti API će kasnije koristiti i online igra.
//
// Karta: { id, r: 1..13 (A..K), s: 0..3 }
// Gomile su nizovi: indeks 0 = dno, poslednji element = vrh.

export const RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS = ['♠', '♥', '♦', '♣'];
export const isRed = (card) => card.s === 1 || card.s === 2;

export const nextRank = (r) => (r === 13 ? 1 : r + 1);
export const prevRank = (r) => (r === 1 ? 13 : r - 1);
const top = (a) => a[a.length - 1];

// Deterministički generator (mulberry32) da bi partija mogla da se ponovi iz seed-a.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDeck() {
  const deck = [];
  for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) deck.push({ id: s * 13 + r, r, s });
  return deck;
}

export function createGame({
  seed = Date.now(),
  autoTouch = true,
  touchWindowMs = 3000,
  firstPlayer,
  deck,
} = {}) {
  const rand = rng(seed);
  const cards = deck ? deck.map((c) => ({ ...c })) : createDeck();
  if (!deck) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
  const players = [
    { closed: [], open: [] },
    { closed: [], open: [] },
  ];
  cards.forEach((c, i) => players[i % 2].closed.push(c));
  return {
    players,
    center: [],
    current: firstPlayer ?? (rand() < 0.5 ? 0 : 1),
    flipped: null, // karta okrenuta sa zatvorene gomile, čeka da se odigra
    autoTouch,
    touchWindowMs,
    lastViolation: null, // { player, at, turn } – za ručni TAČ
    winner: null,
    turn: 0,
    seq: 0,
  };
}

export function canPlayCenter(state, card) {
  const t = top(state.center);
  return t ? card.r === nextRank(t.r) : card.r === 1;
}

export function canPlayOnOpponent(state, player, card) {
  if (!state.center.length) return false; // tek kad je prva karta na sredini
  const o = top(state.players[1 - player].open);
  // samo sredina je rastući niz; na protivnika ide karta za jedan veća ILI manja (K i A su susedi)
  return !!o && (card.r === prevRank(o.r) || card.r === nextRank(o.r));
}

export function sourceCard(state, player, from) {
  if (from === 'flipped') return player === state.current ? state.flipped : null;
  if (from === 'open') return top(state.players[player].open) ?? null;
  return null;
}

/** Svi validni potezi (osim „stavi na svoju otvorenu“, koji nije pravi potez). */
export function legalMoves(state, player = state.current) {
  if (state.winner !== null || player !== state.current) return [];
  const moves = [];
  for (const from of ['open', 'flipped']) {
    const card = sourceCard(state, player, from);
    if (!card) continue;
    if (canPlayCenter(state, card)) moves.push({ from, to: 'center' });
    if (canPlayOnOpponent(state, player, card)) moves.push({ from, to: 'opp' });
  }
  return moves;
}

export function cardCount(state, player) {
  const p = state.players[player];
  return p.closed.length + p.open.length + (state.current === player && state.flipped ? 1 : 0);
}

// ---------- interni pomoćnici (rade nad kopijom stanja) ----------

function penalize(s, offender, events, reason, caller = null) {
  const opp = s.players[1 - offender];
  const src = opp.closed.length ? opp.closed : opp.open;
  const card = src.length ? src.shift() : null; // sa dna protivnikove gomile
  if (card) s.players[offender].closed.unshift(card); // na dno svoje zatvorene
  events.push({ type: 'touch', offender, caller, reason, card });
}

function endTurn(s, events) {
  if (s.flipped) {
    s.players[s.current].open.push(s.flipped);
    s.flipped = null;
  }
  s.current = 1 - s.current;
  s.turn++;
  events.push({ type: 'turn', player: s.current });
}

function recordViolation(s, player, now, events, reason) {
  s.lastViolation = { player, at: now, turn: s.turn };
  events.push({ type: 'violation', player, reason }); // UI ovo ne prikazuje u ručnom modu
}

/** Prekršaj: u auto modu odmah TAČ + kraj poteza, u ručnom se samo pamti. Vraća true ako je potez prekinut. */
function violation(s, player, now, events, reason) {
  if (s.autoTouch) {
    if (s.flipped && s.current === player) {
      s.players[player].open.push(s.flipped);
      s.flipped = null;
    }
    penalize(s, player, events, reason);
    s.lastViolation = null;
    if (s.current === player) endTurn(s, events);
    return true;
  }
  recordViolation(s, player, now, events, reason);
  return false;
}

function checkWin(s, events, actor) {
  const order = actor === undefined ? [0, 1] : [actor, 1 - actor];
  for (const p of order) {
    if (cardCount(s, p) === 0) {
      s.winner = p;
      events.push({ type: 'win', player: p });
      return;
    }
  }
}

function removeFromSource(s, player, from) {
  if (from === 'flipped') {
    const c = s.flipped;
    s.flipped = null;
    return c;
  }
  return s.players[player].open.pop();
}

const invalid = (state, reason) => ({ state, events: [{ type: 'invalid', reason }] });

/**
 * Akcije:
 *  { type: 'FLIP', player }                     – dodir na svoju zatvorenu gomilu
 *  { type: 'RECYCLE', player }                  – prazna zatvorena: otvorena gomila se prevlači do igrača i okreće
 *  { type: 'PLAY', player, from, to }           – from: 'open'|'flipped', to: 'center'|'opp'|'own'
 *                                                 (karta na mesto gde ne ide = TAČ)
 *  { type: 'TIMEOUT', player }                  – isteklo vreme: kazna + okrenuta karta na svoju otvorenu, kraj poteza
 *  { type: 'CALL_TOUCH', player }               – ručni TAČ (player = onaj ko poziva)
 * Svaka akcija može imati `now` (ms) – podrazumevano Date.now().
 */
export function apply(prev, action) {
  if (prev.winner !== null) return invalid(prev, 'game-over');
  const now = action.now ?? Date.now();
  const s = structuredClone(prev);
  const events = [];
  const p = action.player;

  if (action.type === 'CALL_TOUCH') {
    const v = s.lastViolation;
    const fresh = v && v.player !== p && (now - v.at <= s.touchWindowMs || v.turn === s.turn);
    if (fresh) {
      s.lastViolation = null;
      if (s.current === v.player) {
        if (s.flipped) {
          s.players[v.player].open.push(s.flipped);
          s.flipped = null;
        }
        penalize(s, v.player, events, 'called', p);
        endTurn(s, events);
      } else {
        penalize(s, v.player, events, 'called', p);
      }
    } else {
      penalize(s, p, events, 'false-call', p);
    }
    checkWin(s, events);
    s.seq++;
    return { state: s, events };
  }

  if (p !== s.current) return invalid(prev, 'not-your-turn');

  switch (action.type) {
    case 'FLIP': {
      if (s.flipped) return invalid(prev, 'already-flipped');
      const pl = s.players[p];
      // prazna zatvorena: igrač prvo mora sam da prevuče otvorenu gomilu do sebe (RECYCLE)
      if (!pl.closed.length) return invalid(prev, 'closed-empty');
      if (legalMoves(s, p).length && violation(s, p, now, events, 'flip')) break;
      s.flipped = pl.closed.pop();
      events.push({ type: 'flip', player: p, card: s.flipped });
      break;
    }

    case 'RECYCLE': {
      // Otvorena gomila se prevlači do igrača i okreće licem nadole (bez mešanja):
      // njena donja karta postaje vrh nove zatvorene gomile. Potez se nastavlja.
      if (s.flipped) return invalid(prev, 'already-flipped');
      const pl = s.players[p];
      if (pl.closed.length) return invalid(prev, 'closed-not-empty');
      if (!pl.open.length) return invalid(prev, 'no-cards');
      // karta sa vrha otvorene je mogla da se odigra → TAČ
      if (legalMoves(s, p).length && violation(s, p, now, events, 'recycle')) break;
      pl.closed = pl.open.reverse();
      pl.open = [];
      events.push({ type: 'recycle', player: p });
      break;
    }

    case 'PLAY': {
      const { from, to } = action;
      const card = sourceCard(s, p, from);
      if (!card) return invalid(prev, 'no-card');
      if ((to === 'center' && !canPlayCenter(s, card)) || (to === 'opp' && !canPlayOnOpponent(s, p, card))) {
        // Karta spuštena tamo gde ne ide – i to je TAČ (igrač mora sam da zna šta ide gde)
        if (violation(s, p, now, events, 'illegal')) break;
        if (from === 'flipped') endTurn(s, events); // ručni mod: okrenuta karta ide na svoju otvorenu
        break;
      }
      if (to === 'center') {
        removeFromSource(s, p, from);
        s.center.push(card);
      } else if (to === 'opp') {
        removeFromSource(s, p, from);
        s.players[1 - p].open.push(card);
      } else if (to === 'own') {
        if (from !== 'flipped') return invalid(prev, 'illegal');
        if (legalMoves(s, p).length && violation(s, p, now, events, 'own')) break;
        endTurn(s, events); // endTurn stavlja okrenutu kartu na svoju otvorenu
        break;
      } else {
        return invalid(prev, 'bad-target');
      }
      events.push({ type: 'move', player: p, from, to, card });
      break;
    }

    case 'TIMEOUT': {
      // Svako MORA da igra: kazna + aplikacija okreće sledeću kartu i stavlja je
      // na igračevu otvorenu gomilu (nikad ne igra u njegovu korist). Red prelazi na protivnika.
      penalize(s, p, events, 'timeout');
      const pl = s.players[p];
      if (!s.flipped) {
        if (!pl.closed.length && pl.open.length) {
          pl.closed = pl.open.reverse();
          pl.open = [];
          events.push({ type: 'recycle', player: p });
        }
        if (pl.closed.length) {
          s.flipped = pl.closed.pop();
          events.push({ type: 'flip', player: p, card: s.flipped });
        }
      }
      endTurn(s, events);
      break;
    }

    default:
      return invalid(prev, 'unknown-action');
  }

  checkWin(s, events, p);
  s.seq++;
  return { state: s, events };
}
