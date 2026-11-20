// Testovi logike. Pokretanje: otvori tests/index.html u pregledaču
// ili `node tests/engine.test.js` ako je Node instaliran.
import { createGame, apply, legalMoves, cardCount } from '../js/engine.js';

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
  // 8 na 6 ne ide → TAČ
  s = make({ center: [3], p1: { open: [6] }, flipped: 8 });
  eq(apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' }).events[0].reason, 'illegal');
});

test('AUTO TAČ: propuštena 7 na protivnikovu 6', () => {
  const s = make({ center: [3], p0: { open: [7], closed: [9] }, p1: { open: [6], closed: [2, 3] } });
  const r = apply(s, { type: 'FLIP', player: 0 });
  eq(types(r.events), ['touch', 'turn']);
});

test('pre prve karte na sredini nema igranja na protivnika', () => {
  const s = make({ center: [], p1: { open: [6] }, p0: { open: [5] }, flipped: 5 });
  eq(legalMoves(s), []);
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'opp' });
  eq(r.events[0].reason, 'illegal');
  eq(ranks(r.state.players[1].open), [6]); // karta NIJE stavljena na protivnika
  eq(apply(s, { type: 'PLAY', player: 0, from: 'open', to: 'opp' }).events[0].reason, 'illegal');
  // a pošto potez nije postojao, stavljanje na svoju gomilu nije TAČ
  eq(types(apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'own' }).events), ['turn']);
});

test('AUTO TAČ: karta sa otvorene spuštena gde ne ide', () => {
  const s = make({ center: [4], p0: { open: [9] }, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'open', to: 'center' });
  eq(types(r.events), ['touch', 'turn']);
  eq(r.events[0].reason, 'illegal');
  eq(ranks(r.state.center), [4]);
  eq(ranks(r.state.players[0].open), [9]); // karta ostaje gde je bila
  eq(r.state.players[0].closed[0].r, 2); // kaznena karta
  eq(r.state.current, 1);
});

test('AUTO TAČ: okrenuta karta spuštena gde ne ide ide na svoju otvorenu', () => {
  const s = make({ center: [4], flipped: 9, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'PLAY', player: 0, from: 'flipped', to: 'center' });
  eq(types(r.events), ['touch', 'turn']);
  eq(ranks(r.state.players[0].open), [9]);
  eq(r.state.flipped, null);
});

test('RUČNI TAČ: pogrešno spuštena karta se pamti kao prekršaj', () => {
  let s = make({ autoTouch: false, center: [4], p0: { open: [9] }, p1: { closed: [2, 3] } });
  s = apply(s, { type: 'PLAY', player: 0, from: 'open', to: 'center', now: 1000 }).state;
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

test('TIMEOUT bez okrenute karte: kazna, okreće se karta na svoju otvorenu, red prelazi', () => {
  const s = make({ center: [4], p0: { closed: [8, 5] }, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(types(r.events), ['touch', 'flip', 'turn']);
  eq(r.events[0].reason, 'timeout');
  // 5 je mogla na sredinu, ali aplikacija ne igra u korist igrača
  eq(ranks(r.state.players[0].open), [5]);
  eq(ranks(r.state.players[0].closed), [2, 8]);
  eq(ranks(r.state.center), [4]);
  eq(r.state.current, 1);
});

test('TIMEOUT dok drži okrenutu kartu: kazna, karta na svoju otvorenu', () => {
  const s = make({ center: [4], flipped: 9, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(types(r.events), ['touch', 'turn']);
  eq(ranks(r.state.players[0].open), [9]);
  eq(r.state.current, 1);
});

test('TIMEOUT kažnjava i u ručnom TAČ modu', () => {
  const s = make({ autoTouch: false, p0: { closed: [8] }, p1: { closed: [2, 3] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  eq(r.events[0].type, 'touch');
  eq(r.state.current, 1);
});

test('TIMEOUT sa praznom zatvorenom: vuče se kaznena karta', () => {
  const s = make({ p0: { closed: [], open: [7, 8] }, p1: { closed: [], open: [3, 4] } });
  const r = apply(s, { type: 'TIMEOUT', player: 0 });
  // kazna (3) ide na dno prazne zatvorene, pa se vuče ta karta – otvorena se ne dira
  eq(types(r.events), ['touch', 'flip', 'turn']);
  eq(ranks(r.state.players[0].open), [7, 8, 3]);
  eq(r.state.players[0].closed.length, 0);
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
  let s = make({ autoTouch: false, center: [4], p0: { open: [9] }, p1: { closed: [2, 3] } });
  s = apply(s, { type: 'PLAY', player: 0, from: 'open', to: 'center', now: 1000 }).state;
  const r = apply(s, { type: 'CALL_TOUCH', player: 1, now: 1200 });
  eq(r.events[0].reason, 'called');
  eq(r.events[0].violation, 'illegal');
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

export { results };

if (typeof process !== 'undefined' && process.versions?.node) {
  const failed = results.filter((r) => !r.ok);
  for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : ' — ' + r.error}`);
  console.log(`\n${results.length - failed.length}/${results.length} prošlo`);
  process.exitCode = failed.length ? 1 : 0;
}
