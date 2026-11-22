// Testovi logike. Pokretanje: otvori tests/index.html u pregledaču
// ili `node tests/engine.test.js` ako je Node instaliran.
import { createGame, apply, legalMoves, cardCount } from '../js/engine.js';
import { demoGame, DEMO_STEPS, stepActions } from '../js/demo.js';

const results = [];
function test(name, fn) {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
  }
}
function eq(a, b, msg = '') {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error(`${msg} očekivano ${B}, dobijeno ${A}`);
}

let nextId = 1000;
const c = (r, s = 0) => ({ id: nextId++, r, s });
const ranks = (pile) => pile.map((x) => x.r);

function make({ center = [], p0 = {}, p1 = {}, current = 0, flipped = null, autoTouch = true } = {}) {
  const s = createGame({ seed: 1, autoTouch, firstPlayer: current });
  s.center = center.map((r) => c(r));
  s.players[0] = { closed: (p0.closed ?? [9, 9]).map((r) => c(r)), open: (p0.open ?? []).map((r) => c(r)) };
  s.players[1] = { closed: (p1.closed ?? [9, 9]).map((r) => c(r)), open: (p1.open ?? []).map((r) => c(r)) };
  s.flipped = flipped ? c(flipped) : null;
  return s;
}
const types = (events) => events.map((e) => e.type);

test('deljenje: 26 + 26, bez duplikata', () => {
  const s = createGame({ seed: 42 });
  eq(s.players[0].closed.length, 26);
  eq(s.players[1].closed.length, 26);
  const ids = new Set([...s.players[0].closed, ...s.players[1].closed].map((x) => x.id));
  eq(ids.size, 52);
});

test('isti seed daje isto deljenje', () => {
  eq(createGame({ seed: 7 }).players, createGame({ seed: 7 }).players);
});

test('prazna sredina prima samo keca', () => {
  let s = make({ flipped: 2 });
  eq(legalMoves(s), []);
  s = make({ flipped: 1 });
  eq(legalMoves(s), [{ from: 'flipped', to: 'center' }]);
});

test('sredina raste, posle K ide A', () => {
  let s = make({ center: [12], flipped: 13 });
  s = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'center' }).state;
  eq(ranks(s.center), [12, 13]);
  s.flipped = c(1);
  s = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'center' }).state;
  eq(ranks(s.center), [12, 13, 1]);
});

test('na protivnika za jedan manja ili veća (5 ili 7 na 6), K/2 na A, A na K', () => {
  let s = make({ center: [3], p1: { open: [6] }, flipped: 5 });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' });
  eq(ranks(r.state.players[1].open), [6, 5]);
  s = make({ center: [3], p1: { open: [1] }, flipped: 13 });
  eq(legalMoves(s), [{ from: 'flipped', to: 'opp' }]);
  s = make({ center: [3], p1: { open: [6] }, flipped: 7 });
  eq(ranks(apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' }).state.players[1].open), [6, 7]);
  s = make({ center: [3], p1: { open: [1] }, flipped: 2 });
  eq(legalMoves(s), [{ from: 'flipped', to: 'opp' }]);
  s = make({ center: [3], p1: { open: [13] }, flipped: 1 });
  eq(legalMoves(s), [{ from: 'flipped', to: 'opp' }]);
  // 8 na 6 ne ide → nema TAČ-a, karta pada na svoju otvorenu i red prelazi
  s = make({ center: [3], p1: { open: [6] }, flipped: 8 });
  const r2 = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' });
  eq(types(r2.events), ['turn']);
  eq(ranks(r2.state.players[0].open), [8]);
});

test('AUTO TAČ: propuštena 7 na protivnikovu 6', () => {
  const s = make({ center: [3], p0: { open: [7], closed: [9] }, p1: { open: [6], closed: [2, 3] } });
  const r = apply(s, { type: 'FLIP', player: 0 });
  eq(types(r.events), ['touch', 'turn']);
});

test('na protivnika se igra i dok je sredina prazna (karta sa zatvorene i sa otvorene)', () => {
  let s = make({ center: [], p0: { open: [4] }, p1: { open: [3] }, flipped: 2 });
  eq(legalMoves(s), [{ from: 'open', to: 'opp' }, { from: 'flipped', to: 'opp' }]);
  let r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' });
  eq(types(r.events), ['move']);
  eq(ranks(r.state.players[1].open), [3, 2]);
  // a zatim i sa otvorene: 4 ne ide na 2, ali 3 bi išla – ovde proveravamo 4 na 3 pre poteza
  r = apply(s, { type: 'PLAY', player: 0, from: 'open', to: 'opp' });
  eq(types(r.events), ['move']);
  eq(ranks(r.state.players[1].open), [3, 4]);
  // propušten potez na protivnika dok je sredina prazna je TAČ
  s = make({ center: [], p0: { open: [4], closed: [9] }, p1: { open: [3], closed: [2, 3] } });
  eq(types(apply(s, { type: 'FLIP', player: 0 }).events), ['touch', 'turn']);
});

test('AUTO TAČ: kec dok je sredina prazna mora na sredinu', () => {
  const s = make({ center: [], p1: { open: [2], closed: [5, 6] }, flipped: 1 });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' });
  eq(r.events[0].reason, 'center');
});

test('AUTO TAČ: karta koja može na sredinu stavljena na protivnika', () => {
  // 5 ide i na sredinu (4) i na protivnikovu 6 – sredina ima prednost
  let s = make({ center: [4], p0: { open: [5] }, p1: { open: [6], closed: [2, 3] } });
  let r = apply(s, { type: 'PLAY', player: 0, from: 'open', to: 'opp' });
  eq(types(r.events), ['touch', 'turn']);
  eq(r.events[0].reason, 'center');
  eq(ranks(r.state.players[1].open), [6]); // karta nije stavljena na protivnika
  eq(ranks(r.state.players[0].open), [5]);
  s = make({ center: [4], p1: { open: [6], closed: [2, 3] }, flipped: 5 });
  r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' });
  eq(r.events[0].reason, 'center');
  eq(ranks(r.state.players[0].open), [5]); // okrenuta karta ide na svoju otvorenu
  // ista karta na sredinu je u redu
  eq(types(apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'center' }).events), ['move']);
});

test('RUČNI TAČ: karta stavljena na protivnika umesto na sredinu se pamti', () => {
  const s = make({ center: [4], p1: { open: [6] }, flipped: 5, autoTouch: false });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' });
  eq(r.state.lastViolation.reason, 'center');
  eq(r.state.current, 1);
  eq(apply(r.state, { type: 'CALL_TOUCH', player: 1 }).events[0].violation, 'center');
});

test('nemoguć potez sa otvorene se ne kažnjava: karta se vraća', () => {
  const s = make({ center: [4], p0: { open: [9] }, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'open', to: 'center' });
  eq(r.events, [{ type: 'invalid', reason: 'illegal' }]);
  eq(ranks(r.state.players[0].open), [9]);
  eq(r.state.current, 0);
});

test('nemoguć potez okrenutom kartom: pada na svoju otvorenu, bez TAČ-a', () => {
  const s = make({ center: [4], flipped: 9, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'center' });
  eq(types(r.events), ['turn']);
  eq(ranks(r.state.players[0].open), [9]);
  eq(r.state.flipped, null);
  eq(r.state.players[0].closed.length, 2); // bez kaznene karte
});

test('AUTO TAČ: okrenuta karta spuštena na pogrešno mesto, a imala je gde', () => {
  // 9 ne ide na sredinu (4), ali ide na protivnikovu 8
  const s = make({ center: [4], flipped: 9, p1: { open: [8], closed: [2, 3] } });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'center' });
  eq(types(r.events), ['touch', 'turn']);
  eq(r.events[0].reason, 'own');
  eq(ranks(r.state.players[0].open), [9]);
});

test('RUČNI TAČ: propušten potez se pamti kao prekršaj', () => {
  // 5 sa otvorene ide na sredinu, a igrač okreće zatvorenu
  let s = make({ autoTouch: false, center: [4], p0: { open: [5] }, p1: { closed: [2, 3] } });
  s = apply(s, { type: 'FLIP', player: 0, now: 1000 }).state;
  eq(s.current, 0);
  eq(s.lastViolation.player, 0);
  const r = apply(s, { type: 'CALL_TOUCH', player: 1, now: 1500 });
  eq(r.events[0].offender, 0);
});

test('ne može na praznu protivnikovu gomilu', () => {
  const s = make({ center: [3], p1: { open: [] }, flipped: 5 });
  eq(legalMoves(s), []);
});

test('okretanje karte kad nema poteza', () => {
  const s = make({ p0: { closed: [4, 8] } });
  const r = apply(s, { type: 'FLIP', player: 0 });
  eq(r.state.flipped.r, 8);
  eq(types(r.events), ['flip']);
});

test('nevalidna karta na svoju otvorenu = kraj poteza', () => {
  const s = make({ center: [2], flipped: 9 });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'own' });
  eq(r.state.current, 1);
  eq(ranks(r.state.players[0].open), [9]);
  eq(r.state.flipped, null);
});

test('AUTO TAČ: klik na zatvorenu dok otvorena ima potez', () => {
  const s = make({ center: [4], p0: { open: [5], closed: [9] }, p1: { closed: [2, 3, 7] } });
  const r = apply(s, { type: 'FLIP', player: 0 });
  eq(types(r.events), ['touch', 'turn']);
  eq(r.state.current, 1);
  // kazna: karta sa dna protivnikove zatvorene na dno moje
  eq(ranks(r.state.players[0].closed), [2, 9]);
  eq(ranks(r.state.players[1].closed), [3, 7]);
  eq(r.state.flipped, null);
});

test('AUTO TAČ: okrenuta karta na svoju a mogla je na sredinu', () => {
  const s = make({ center: [4], flipped: 5, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'own' });
  eq(types(r.events), ['touch', 'turn']);
  eq(ranks(r.state.players[0].open), [5]);
  eq(r.state.players[0].closed[0].r, 2);
});

test('kazna iz otvorene kad je protivnikova zatvorena prazna', () => {
  const s = make({ center: [4], p0: { open: [5] }, p1: { closed: [], open: [11, 12] } });
  const r = apply(s, { type: 'FLIP', player: 0 });
  eq(ranks(r.state.players[1].open), [12]);
  eq(r.state.players[0].closed[0].r, 11);
});

test('TIMEOUT bez poteza: nema kazne, okreće se karta na svoju otvorenu, red prelazi', () => {
  const s = make({ center: [4], p0: { closed: [8, 5] }, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(types(r.events), ['flip', 'turn']);
  // 5 je mogla na sredinu, ali igrač je nije video – aplikacija ne igra u njegovu korist
  eq(ranks(r.state.players[0].open), [5]);
  eq(ranks(r.state.players[0].closed), [8]);
  eq(ranks(r.state.center), [4]);
  eq(r.state.current, 1);
});

test('TIMEOUT a otvorena karta je imala potez: TAČ', () => {
  const s = make({ center: [4], p0: { open: [5], closed: [8, 9] }, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(types(r.events), ['touch', 'flip', 'turn']);
  eq(r.events[0].reason, 'timeout');
  eq(ranks(r.state.players[0].open), [5, 9]);
  eq(ranks(r.state.players[0].closed), [2, 8]); // kaznena karta na dnu
});

test('TIMEOUT dok drži okrenutu kartu koja je imala gde: TAČ, karta na svoju otvorenu', () => {
  const s = make({ center: [4], flipped: 5, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(types(r.events), ['touch', 'turn']);
  eq(ranks(r.state.players[0].open), [5]);
  eq(r.state.current, 1);
});

test('TIMEOUT dok drži okrenutu kartu koja nema gde: bez kazne', () => {
  const s = make({ center: [4], flipped: 9, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(types(r.events), ['turn']);
  eq(ranks(r.state.players[0].open), [9]);
});

test('TIMEOUT kažnjava i u ručnom TAČ modu (kad je bilo poteza)', () => {
  const s = make({ autoTouch: false, center: [4], p0: { open: [5], closed: [8] }, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(r.events[0].type, 'touch');
  eq(r.state.current, 1);
});

test('TIMEOUT sa praznom zatvorenom i bez poteza: gomila se okreće, karta na otvorenu', () => {
  const s = make({ center: [], p0: { closed: [], open: [7, 8] }, p1: { closed: [], open: [3, 4] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(types(r.events), ['recycle', 'flip', 'turn']);
  eq(ranks(r.state.players[0].open), [7]);
  eq(ranks(r.state.players[0].closed), [8]);
});

test('prazna zatvorena: okretanje karte nije moguće dok se gomila ne prevuče', () => {
  const s = make({ center: [1], p0: { closed: [], open: [7, 8, 9] } });
  eq(apply(s, { type: 'FLIP', player: 0 }).events[0].reason, 'closed-empty');
});

test('RECYCLE: otvorena gomila se okreće, dno postaje vrh, potez se nastavlja', () => {
  let s = make({ center: [1], p0: { closed: [], open: [7, 8, 9] } });
  let r = apply(s, { type: 'RECYCLE', player: 0 });
  eq(types(r.events), ['recycle']);
  eq(r.state.current, 0);
  eq(ranks(r.state.players[0].closed), [9, 8, 7]);
  eq(r.state.players[0].open.length, 0);
  r = apply(r.state, { type: 'FLIP', player: 0 });
  eq(r.state.flipped.r, 7); // prva bačena karta je sada na vrhu
});

test('RECYCLE sa jednom kartom: karta se ne okreće, potez se završava', () => {
  const s = make({ center: [1], p0: { closed: [], open: [9] } });
  const r = apply(s, { type: 'RECYCLE', player: 0 });
  eq(types(r.events), ['pass', 'turn']);
  eq(ranks(r.state.players[0].open), [9]);
  eq(r.state.players[0].closed.length, 0);
  eq(r.state.current, 1);
});

test('AUTO TAČ: RECYCLE sa jednom kartom koja je imala potez', () => {
  const s = make({ center: [8], p0: { closed: [], open: [9] }, p1: { closed: [2, 3] } });
  eq(types(apply(s, { type: 'RECYCLE', player: 0 }).events), ['touch', 'turn']);
});

test('RECYCLE nije dozvoljen dok zatvorena ima karata', () => {
  const s = make({ p0: { closed: [5], open: [7] } });
  eq(apply(s, { type: 'RECYCLE', player: 0 }).events[0].reason, 'closed-not-empty');
});

test('AUTO TAČ: RECYCLE dok vrh otvorene može na sredinu', () => {
  const s = make({ center: [6], p0: { closed: [], open: [9, 7] }, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'RECYCLE', player: 0 });
  eq(types(r.events), ['touch', 'turn']);
  eq(ranks(r.state.players[0].open), [9, 7]); // gomila se ne okreće
  eq(ranks(r.state.players[0].closed), [2]); // kaznena karta
});

test('pobeda kad igrač ostane bez karata', () => {
  const s = make({ center: [4], p0: { closed: [], open: [] }, flipped: 5 });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'center' });
  eq(r.state.winner, 0);
  eq(cardCount(r.state, 0), 0);
});

test('nije tvoj red', () => {
  const s = make({ current: 0 });
  eq(apply(s, { type: 'FLIP', player: 1 }).events[0].reason, 'not-your-turn');
});

test('RUČNI TAČ: prekršaj se ne kažnjava sam', () => {
  const s = make({ autoTouch: false, center: [4], p0: { open: [5], closed: [9] } });
  const r = apply(s, { type: 'FLIP', player: 0, now: 1000 });
  eq(types(r.events), ['violation', 'flip']);
  eq(r.state.current, 0);
  eq(r.state.flipped.r, 9);
});

test('RUČNI TAČ: ispravan poziv kažnjava prekršioca i prekida potez', () => {
  let s = make({ autoTouch: false, center: [4], p0: { open: [5], closed: [9] }, p1: { closed: [2, 3] } });
  s = apply(s, { type: 'FLIP', player: 0, now: 1000 }).state;
  const r = apply(s, { type: 'CALL_TOUCH', player: 1, now: 1500 });
  eq(types(r.events), ['touch', 'turn']);
  eq(r.events[0].offender, 0);
  eq(r.state.current, 1);
  eq(ranks(r.state.players[0].open), [5, 9]);
  eq(r.state.players[0].closed[0].r, 2);
});

test('RUČNI TAČ: prekršaj koji završi potez može da se prijavi dok protivnik ne odigra', () => {
  let s = make({ autoTouch: false, center: [4], flipped: 5, p1: { closed: [2, 3, 7] } });
  s = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'own', now: 1000 }).state;
  eq(s.current, 1);
  const ok = apply(s, { type: 'CALL_TOUCH', player: 1, now: 60000 });
  eq(ok.events[0].offender, 0);
  // posle prvog poteza igrača 1 je kasno
  const after = apply(s, { type: 'FLIP', player: 1, now: 2000 }).state;
  const late = apply(after, { type: 'CALL_TOUCH', player: 1, now: 2500 });
  eq(late.events[0].reason, 'no-violation');
  eq(late.state, after);
});

test('RUČNI TAČ: isti prekršaj se prijavljuje samo jednom', () => {
  let s = make({ autoTouch: false, center: [4], flipped: 5, p1: { closed: [2, 3] } });
  s = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'own', now: 1000 }).state;
  s = apply(s, { type: 'CALL_TOUCH', player: 1, now: 1200 }).state;
  const again = apply(s, { type: 'CALL_TOUCH', player: 1, now: 1300 });
  eq(again.events[0].reason, 'no-violation');
  eq(again.state, s);
});

test('RUČNI TAČ: prekršilac ne može da pozove TAČ na sebe', () => {
  let s = make({ autoTouch: false, center: [4], flipped: 5, p1: { closed: [2, 3] } });
  s = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'own', now: 1000 }).state;
  const r = apply(s, { type: 'CALL_TOUCH', player: 0, now: 1100 });
  eq(r.events[0].reason, 'no-violation');
  eq(r.state, s);
});

test('RUČNI TAČ: igrač na potezu bez prekršaja protivnika ne dobija ništa', () => {
  const s = make({ autoTouch: false, current: 0, p0: { closed: [4, 5] }, p1: { closed: [6] } });
  const r = apply(s, { type: 'CALL_TOUCH', player: 0, now: 1000 });
  eq(r.events[0].reason, 'no-violation');
  eq(r.state, s);
});

test('RUČNI TAČ: primer – 4 na otvorenoj, 3 u sredini, igrač dira zatvorenu', () => {
  let s = make({ autoTouch: false, center: [3], p0: { open: [4], closed: [8] }, p1: { open: [10], closed: [2, 3] } });
  s = apply(s, { type: 'FLIP', player: 0, now: 1000 }).state;
  const r = apply(s, { type: 'CALL_TOUCH', player: 1, now: 1400 });
  eq(r.events[0].offender, 0);
  eq(r.events[0].reason, 'called');
  eq(r.state.current, 1);
});

test('RUČNI TAČ: poziv nosi razlog prvobitnog prekršaja', () => {
  let s = make({ autoTouch: false, center: [4], p0: { open: [5] }, p1: { closed: [2, 3] } });
  s = apply(s, { type: 'FLIP', player: 0, now: 1000 }).state;
  const r = apply(s, { type: 'CALL_TOUCH', player: 1, now: 1200 });
  eq(r.events[0].reason, 'called');
  eq(r.events[0].violation, 'flip');
});

test('RUČNI TAČ: poziv bez prekršaja nema kazne', () => {
  const s = make({ autoTouch: false, p0: { closed: [4, 5] }, p1: { closed: [6] } });
  const r = apply(s, { type: 'CALL_TOUCH', player: 1, now: 1000 });
  eq(r.events[0].reason, 'no-violation');
  eq(r.state, s);
});

test('simulacija: nasumične partije se završavaju bez grešaka', () => {
  for (let seed = 1; seed <= 30; seed++) {
    let s = createGame({ seed });
    for (let i = 0; i < 20000 && s.winner === null; i++) {
      const moves = legalMoves(s);
      let action;
      if (moves.length) action = { type: 'PLAY', player: s.current, ...moves[0] };
      else if (s.flipped) action = { type: 'PLAY', player: s.current, from: 'flipped', to: 'own' };
      else if (!s.players[s.current].closed.length) action = { type: 'RECYCLE', player: s.current };
      else action = { type: 'FLIP', player: s.current };
      const r = apply(s, action);
      if (r.events[0]?.type === 'invalid') throw new Error(`seed ${seed}: ${r.events[0].reason}`);
      s = r.state;
      const total = s.center.length + s.players.reduce((n, p) => n + p.closed.length + p.open.length, 0) + (s.flipped ? 1 : 0);
      if (total !== 52) throw new Error(`seed ${seed}: ${total} karata`);
    }
  }
});

test('demo za početnike: svi potezi su validni, TAČ je samo tamo gde je predviđen', () => {
  let s = demoGame();
  eq([s.players[0].closed.length, s.players[1].closed.length, s.current], [26, 26, 0], 'početak:');
  eq(new Set([...s.players[0].closed, ...s.players[1].closed].map((x) => x.id)).size, 52, 'različite karte:');
  let touches = 0;
  for (const step of DEMO_STEPS) {
    for (const action of stepActions(step)) {
      const r = apply(s, action);
      if (r.events[0]?.type === 'invalid') throw new Error(`${JSON.stringify(action)}: ${r.events[0].reason}`);
      const touch = r.events.some((e) => e.type === 'touch');
      if (touch !== (step.touch !== undefined)) throw new Error(`neočekivan TAČ: ${JSON.stringify(step)}`);
      if (step.hot !== undefined && action.type === 'FLIP' && !r.state.flipped) throw new Error('karta se nije okrenula');
      touches += touch;
      s = r.state;
    }
  }
  eq(touches, 1, 'broj TAČ-eva:');
  eq(s.current, 1, 'posle TAČ-a igra protivnik:');
  eq(ranks(s.center), [1, 2, 3, 4, 5], 'sredina:');
});

export { results };

if (typeof process !== 'undefined' && process.versions?.node) {
  const failed = results.filter((r) => !r.ok);
  for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : ' — ' + r.error}`);
  console.log(`\n${results.length - failed.length}/${results.length} prošlo`);
  process.exitCode = failed.length ? 1 : 0;
}
