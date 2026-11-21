// Zvučni efekti, sintetizovani Web Audio API-jem: nema audio fajlova, sve radi i bez interneta.
// Zvuk karte = kratak šum kroz filter (šuškanje papira) + tup udarac (karta pada na sto).
// Telefoni puštaju zvuk tek posle prvog dodira, zato main.js zove unlock() na svaki dodir.

let ctx = null;
let out = null;
let noiseBuf = null;
let enabled = true;

const rnd = (a, b) => a + Math.random() * (b - a);

export function setEnabled(v) {
  enabled = v;
  if (!v && ctx?.state === 'running') ctx.suspend().catch(() => {});
  if (v && ctx) unlock(); // uključeno prekidačem u meniju – to je dodir, pa zvuk sme odmah da krene
}

export function unlock() {
  if (!enabled) return;
  try {
    if (ctx?.state === 'closed') ctx = null; // sistem je zatvorio zvuk – pravi se nov
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      // kompresor drži glasne zvukove (TAČ, fanfara) pod kontrolom i izjednačava jačinu
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      out = ctx.createGain();
      out.gain.value = 0.9;
      out.connect(comp).connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    // iPhone: zvuk se pali tek kad se u dodiru stvarno pusti nešto, pa se pušta tišina od jednog uzorka.
    // Stanje može biti i „interrupted“ (poziv, budilnik, igra u pozadini) – i tada se nastavlja ovde.
    if (ctx.state !== 'running') {
      ctx.resume().catch(() => {});
      const src = ctx.createBufferSource();
      src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      src.connect(ctx.destination);
      src.start(0);
    }
  } catch {
    ctx = null; // pregledač ne podržava Web Audio – igra radi bez zvuka
  }
}

/** Vreme za zakazivanje zvuka, ili null ako zvuk ne može da se pusti. */
function now(delay = 0) {
  if (!enabled || !ctx || ctx.state !== 'running') return null;
  return ctx.currentTime + delay;
}

function envelope(t0, peak, attack, dur) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  return g;
}

/** Šum kroz filter: šuškanje, pucketanje, udarac dlana. */
function noise(t0, { dur, type = 'bandpass', freq, freqEnd, q = 1, gain, attack = 0.002 }) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(freq, t0);
  if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
  src.connect(f).connect(envelope(t0, gain, attack, dur)).connect(out);
  src.start(t0, rnd(0, 0.8), dur + 0.05);
}

/** Ton: tup udarac (sinus koji pada), zvonce, fanfara. */
function tone(t0, { freq, freqEnd, dur, gain, type = 'sine', attack = 0.004, filter }) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
  let node = o;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filter;
    node = o.connect(f);
  }
  node.connect(envelope(t0, gain, attack, dur)).connect(out);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

/**
 * Nasumična vrednost za jedan zvuk, ali nikad preblizu prethodnoj – dva uzastopna zvuka
 * iste vrste se uvek čuju malo drugačije, pa uho ne uhvati mehaničko ponavljanje.
 */
const lastVaried = {};
function varied(name, lo, hi) {
  let x = rnd(lo, hi);
  for (let i = 0; i < 5 && lastVaried[name] !== undefined && Math.abs(x - lastVaried[name]) < (hi - lo) * 0.25; i++) {
    x = rnd(lo, hi);
  }
  lastVaried[name] = x;
  return x;
}

// ---------- zvuci ----------
// Zvuci karata se svaki put malo razlikuju. Signali (sat, zvonce, fanfara, nedozvoljen dodir)
// su uvek isti, jer ih igrač prepoznaje bez gledanja u ekran.

/** Karta se podiže sa gomile: tiho klizanje. */
export function pickup() {
  const t = now();
  if (t === null) return;
  const v = varied('pickup', 0.85, 1.15);
  noise(t, {
    dur: rnd(0.075, 0.11),
    freq: 1500 * v,
    freqEnd: 3800 * rnd(0.85, 1.15),
    q: rnd(0.55, 0.9),
    gain: 0.18 * rnd(0.8, 1.1),
    attack: rnd(0.02, 0.04),
  });
}

/**
 * Karta pada na gomilu: kratko klizanje, pucketanje papira i tup udarac o sto.
 * pile  – koliko karata je na gomili posle spuštanja: debela gomila zvuči tuplje i dublje.
 * speed – brzina prsta pri puštanju (px/ms): bačena karta zvuči oštrije od polako spuštene.
 */
export function place(delay = 0, { pile = 1, speed = 0.6 } = {}) {
  const t = now(delay);
  if (t === null) return;
  const v = varied('place', 0.88, 1.12);
  const vol = rnd(0.85, 1.1);
  const depth = Math.min(1, pile / 30);
  const sharp = Math.min(1, speed / 2);
  const slide = rnd(0.04, 0.065) * (1.2 - 0.5 * sharp);
  noise(t, { dur: slide, freq: 2500 * v, freqEnd: 1200 * rnd(0.85, 1.15), q: rnd(0.6, 1), gain: 0.15 * vol, attack: 0.015 });
  const hit = t + slide * rnd(0.7, 0.9);
  noise(hit, {
    dur: rnd(0.028, 0.042),
    type: 'highpass',
    freq: 2200 * v * (1 - 0.25 * depth) * (0.85 + 0.3 * sharp),
    gain: (0.4 + 0.25 * sharp) * vol,
  });
  tone(hit, {
    freq: 150 * v * (1 - 0.35 * depth),
    freqEnd: 60 * (1 - 0.2 * depth),
    dur: 0.07 + 0.04 * depth,
    gain: (0.3 + 0.15 * depth) * vol * (0.8 + 0.3 * sharp),
  });
}

/** Karta se okreće sa zatvorene gomile: oštro „flip“. */
export function flip(delay = 0) {
  const t = now(delay);
  if (t === null) return;
  const v = varied('flip', 0.88, 1.12);
  const swish = rnd(0.05, 0.07);
  noise(t, { dur: swish, freq: 900 * v, freqEnd: 4200 * rnd(0.85, 1.1), q: rnd(1, 1.4), gain: 0.22 * rnd(0.85, 1.1), attack: 0.02 });
  noise(t + swish * rnd(0.85, 0.95), { dur: rnd(0.02, 0.03), freq: 3200 * v, q: rnd(0.7, 1.1), gain: 0.5 * rnd(0.85, 1.1) });
}

/** Cela gomila se okreće i poravnava: niz brzih pucketanja pa udarac (deblja gomila = duži niz, tuplji udarac). */
export function recycle(delay = 0, { pile = 10 } = {}) {
  const t = now(delay);
  if (t === null) return;
  const depth = Math.min(1, pile / 30);
  const n = Math.round(7 + 6 * depth + rnd(-1, 1));
  const gap = rnd(0.018, 0.026);
  for (let i = 0; i < n; i++) {
    noise(t + i * gap + rnd(0, 0.008), { dur: 0.018, freq: rnd(2500, 4500), q: 1.5, gain: rnd(0.15, 0.3) });
  }
  const end = t + n * gap + 0.03;
  noise(end, { dur: 0.06, type: 'lowpass', freq: 1400 * (1 - 0.3 * depth), gain: 0.45 * rnd(0.85, 1.1) });
  tone(end, { freq: 120 * rnd(0.9, 1.1) * (1 - 0.25 * depth), freqEnd: 55, dur: 0.09, gain: 0.4 });
}

/** Mešanje i deljenje na početku partije. */
export function shuffle() {
  const t = now();
  if (t === null) return;
  const n = Math.round(rnd(23, 30));
  const len = rnd(0.5, 0.7);
  for (let i = 0; i < n; i++) {
    const x = i / n;
    noise(t + x * len + rnd(0, 0.01), { dur: 0.02, freq: rnd(2000, 5000), q: 1.4, gain: 0.12 + 0.18 * Math.sin(x * Math.PI) });
  }
  const end = t + len + 0.06;
  noise(end, { dur: 0.07, type: 'lowpass', freq: 1200 * rnd(0.85, 1.15), gain: 0.5 });
  tone(end, { freq: 110 * rnd(0.9, 1.1), freqEnd: 50, dur: 0.1, gain: 0.45 });
}

/** Nevalidan dodir (npr. dok traje poruka TAČ): tihi tupi kucaj. */
export function invalid() {
  const t = now();
  if (t === null) return;
  noise(t, { dur: 0.05, type: 'lowpass', freq: 700, gain: 0.3 });
  tone(t, { freq: 180, freqEnd: 120, dur: 0.06, gain: 0.15 });
}

/** TAČ! – dlan udara o sto, pa kaznena karta klizne do prekršioca. Varijacija je mala: zvuk mora uvek da se prepozna. */
export function slap() {
  const t = now();
  if (t === null) return;
  const v = varied('slap', 0.96, 1.04);
  const vol = rnd(0.93, 1.03);
  tone(t, { freq: 130 * v, freqEnd: 42, dur: 0.22, gain: 0.95 * vol });
  noise(t, { dur: rnd(0.13, 0.15), type: 'lowpass', freq: 1800 * v, freqEnd: 400, gain: 0.9 * vol });
  noise(t, { dur: 0.03, type: 'highpass', freq: 2000 * v, gain: 0.6 * vol });
  place(0.55);
}

/** VREME! – zvonce na stolu, pa kaznena karta. */
export function bell() {
  const t = now();
  if (t === null) return;
  const f = 1320;
  tone(t, { freq: f, dur: 1.3, gain: 0.35, attack: 0.002 });
  tone(t, { freq: f * 2.76, dur: 0.5, gain: 0.12, attack: 0.002 });
  tone(t, { freq: f * 5.4, dur: 0.2, gain: 0.05, attack: 0.002 });
  noise(t, { dur: 0.015, type: 'highpass', freq: 5000, gain: 0.3 });
  place(0.55);
}

/** Kucanje sata u poslednjim sekundama; poslednja sekunda je viša. */
export function tick(last = false) {
  const t = now();
  if (t === null) return;
  const f = last ? 1600 : 1150;
  tone(t, { freq: f, freqEnd: f * 0.8, dur: 0.045, gain: 0.25, attack: 0.001 });
  noise(t, { dur: 0.02, freq: f * 2, q: 3, gain: 0.2, attack: 0.001 });
}

/** Pobeda: kratka fanfara (limeni duvači). */
export function fanfare() {
  const t = now();
  if (t === null) return;
  const notes = [
    [523.25, 0, 0.14],
    [659.25, 0.13, 0.14],
    [783.99, 0.26, 0.14],
    [1046.5, 0.39, 0.9],
  ];
  for (const [freq, at, dur] of notes) {
    for (const det of [0.997, 1.003]) {
      tone(t + at, { freq: freq * det, dur, gain: 0.13, type: 'sawtooth', attack: 0.02, filter: freq * 4 });
    }
    tone(t + at, { freq: freq / 2, dur, gain: 0.08, type: 'triangle', attack: 0.02 });
  }
}
