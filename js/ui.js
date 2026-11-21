// Prikaz stola i rukovanje dodirima. Ne zna pravila – pita engine šta je validno.
//
// Zatvorena gomila: pritisni i DRŽI – karta se okreće pod prstom („vruća“ karta)
// i mora se prevući na gomilu. Pušten prst bilo gde drugde = karta ide na tvoju otvorenu.
// Otvorena gomila: kartu prevuci na sredinu ili na protivnika. Kad je zatvorena prazna,
// otvorena gomila se prevlači na mesto zatvorene i okreće se licem nadole.
// Karta spuštena tamo gde ne ide = TAČ.
import { RANKS, SUITS, isRed, sourceCard } from './engine.js';
import { t } from './i18n.js';
import * as sfx from './audio.js';

const TIME_COLORS = [
  [0.5, [76, 175, 80]],
  [0.25, [255, 179, 0]],
  [0, [229, 57, 53]],
];

export function createUI({ onAction }) {
  const app = document.getElementById('app');
  const zones = [0, 1].map((p) => buildZone(document.getElementById(`zone-${p}`), p));
  const centerEl = document.getElementById('center');
  const glow = document.getElementById('glow');
  const touchOverlay = document.getElementById('touch-overlay');
  const winOverlay = document.getElementById('win-overlay');

  let state = null;
  let drag = null;
  let locked = false;

  // ---------- građenje zone ----------
  function buildZone(el, p) {
    el.innerHTML = `
      <div class="pile-col">
        <div class="pile-wrap">
          <div class="slot open" data-slot="open" data-player="${p}"></div>
          <span class="badge n-open"></span>
        </div>
        <div class="pile-wrap">
          <div class="slot closed" data-slot="closed" data-player="${p}"></div>
          <span class="badge n-closed"></span>
          <button class="recycle-btn" type="button" hidden></button>
        </div>
      </div>
      <div class="side">
        <span class="status"></span>
      </div>
      <div class="aside">
        <span class="secs"></span>
        <button class="touch-btn" type="button" data-i18n="touch">TAČ!</button>
      </div>`;
    const q = (s) => el.querySelector(s);
    // okretanje otvorene gomile dugmetom (isto kao prevlačenje gomile na mesto zatvorene)
    q('.recycle-btn').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!locked && !drag && state && state.winner === null && state.current === p) onAction({ type: 'RECYCLE', player: p });
    });
    // pointerdown umesto click: na telefonu click često ne stigne dok drugi prst drži kartu,
    // a TAČ mora da se uhvati baš dok protivnik drži kartu sa zatvorene gomile
    q('.touch-btn').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // dok traje poruka TAČ, main.js odbija pritisak i javlja vibracijom
      if (state && state.winner === null) onAction({ type: 'CALL_TOUCH', player: p });
    });
    return {
      el,
      closed: q('.closed'),
      open: q('.open'),
      nClosed: q('.n-closed'),
      nOpen: q('.n-open'),
      status: q('.status'),
      secs: q('.secs'),
      recycle: q('.recycle-btn'),
    };
  }

  // ---------- karte ----------
  function cardEl(card, faceDown) {
    const d = document.createElement('div');
    if (faceDown) {
      d.className = 'card back';
      return d;
    }
    const r = RANKS[card.r], s = SUITS[card.s];
    d.className = `card ${isRed(card) ? 'red' : 'black'}`;
    d.innerHTML = `<span class="corner tl">${r}<small>${s}</small></span><span class="mid">${s}</span><span class="corner br">${r}<small>${s}</small></span>`;
    return d;
  }

  function stackShadow(count) {
    const layers = Math.min(5, Math.ceil(count / 6));
    const out = [];
    for (let i = 1; i < layers; i++) out.push(`0 ${i * 2}px 0 ${i % 2 ? '#cfc8b8' : '#f2eee4'}`);
    return out.join(', ') || '0 0 0 transparent';
  }

  /** Mali „nered“ za svaku kartu: isti za istu kartu, da se gomila ne trese pri svakom crtanju. */
  function tilt(id) {
    const r = (k) => {
      const x = Math.sin(id * k) * 43758.5453;
      return x - Math.floor(x) - 0.5; // -0.5 … 0.5
    };
    return { rot: r(12.9898) * 10, dx: r(78.233) * 7, dy: r(39.425) * 7 };
  }

  /**
   * Otvorena gomila: vidi se nekoliko gornjih karata, blago nakrivljenih kao kad se karte bacaju rukom.
   * Dok je gornja karta u ruci, vidi se karta ispod nje.
   */
  function renderOpen(slot, pile, liftTop) {
    const cards = liftTop ? pile.slice(0, -1) : pile;
    const shown = cards.slice(-3);
    const topCard = shown[shown.length - 1];
    const key = `o:${shown.map((c) => c.id).join(',')}:${cards.length}`;
    if (slot.dataset.key === key) return;
    const prevId = slot.dataset.cardId;
    const lifted = slot.dataset.lifted === '1';
    slot.dataset.key = key;
    slot.dataset.cardId = topCard ? topCard.id : '';
    slot.dataset.lifted = liftTop ? '1' : '';
    slot.replaceChildren();
    slot.classList.toggle('has-card', !!topCard);
    shown.forEach((card, i) => {
      const el = cardEl(card, false);
      const t = tilt(card.id);
      el.style.setProperty('--tilt', `${t.rot.toFixed(1)}deg`);
      el.style.setProperty('--dx', `${t.dx.toFixed(1)}px`);
      el.style.setProperty('--dy', `${t.dy.toFixed(1)}px`);
      if (i === 0) el.style.setProperty('--stack', stackShadow(cards.length - shown.length + 1));
      // nova karta „padne“ na gomilu; karta vraćena iz ruke ili otkrivena ispod ne skače
      if (card === topCard && String(card.id) !== prevId && !liftTop && !lifted) el.classList.add('pop');
      slot.append(el);
    });
  }

  function renderSlot(slot, card, { faceDown = false, count = 1 } = {}) {
    const key = card ? `${faceDown ? 'b' : card.id}:${count}` : '';
    if (slot.dataset.key === key) return;
    const prevId = slot.dataset.cardId;
    slot.dataset.key = key;
    slot.dataset.cardId = card && !faceDown ? card.id : '';
    slot.replaceChildren();
    slot.classList.toggle('has-card', !!card);
    if (!card) return;
    const el = cardEl(card, faceDown);
    el.style.setProperty('--stack', stackShadow(count));
    if (!faceDown && String(card.id) !== prevId) el.classList.add('pop');
    slot.append(el);
  }

  // ---------- render ----------
  function render(s) {
    state = s;
    // red je prešao na protivnika ili je vruća karta nestala (istek vremena, TAČ…) – pusti kartu iz ruke
    if (drag && (drag.player !== s.current || s.winner !== null || (drag.hot && !s.flipped))) cancelDrag();

    for (const p of [0, 1]) {
      const z = zones[p];
      const pl = s.players[p];
      const active = s.current === p && s.winner === null;
      z.el.classList.toggle('active', active);
      // okrenuta karta koju niko ne drži (ne bi trebalo da se desi) prikazuje se na zatvorenoj
      const loose = active && s.flipped && !drag?.hot;
      if (loose) renderSlot(z.closed, s.flipped);
      else renderSlot(z.closed, pl.closed.length ? {} : null, { faceDown: true, count: pl.closed.length });
      const lifting = drag && !drag.hot && drag.player === p; // gornja karta otvorene je u ruci
      renderOpen(z.open, pl.open, lifting);
      z.closed.classList.toggle('can-flip', active && !s.flipped);
      // prazna zatvorena: dugme za okretanje otvorene gomile (jedna karta se ne okreće – samo „Dalje“)
      const canRecycle = active && !s.flipped && !pl.closed.length && pl.open.length > 0;
      z.closed.classList.toggle('refill', canRecycle);
      z.recycle.hidden = !canRecycle;
      z.recycle.textContent = pl.open.length === 1 ? t('passBtn') : `↻ ${t('recycleBtn')}`;
      z.nClosed.textContent = pl.closed.length + (active && s.flipped ? 1 : 0);
      z.nOpen.textContent = pl.open.length - (lifting ? 1 : 0);
      z.status.textContent = active ? t('yourTurn') : t('wait');
    }
    const top = s.center[s.center.length - 1] ?? null;
    renderSlot(centerEl, top, { count: s.center.length });
  }

  /** Gradijent od ivice igrača na potezu ka ivici protivnika; povlači se kako vreme ističe. */
  function setTimer(player, fraction, msLeft) {
    const rgb = TIME_COLORS.find(([min]) => fraction > min)?.[1] ?? TIME_COLORS[2][1];
    const c = (a) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
    const reach = Math.max(0, fraction) * 100;
    const dir = player === 0 ? 'to top' : 'to bottom';
    glow.style.background = `linear-gradient(${dir}, ${c(0.7)} 0%, ${c(0.32)} ${reach * 0.55}%, ${c(0)} ${reach}%)`;
    glow.hidden = false;
    zones[player].secs.textContent = Math.ceil(msLeft / 1000);
    zones[player].el.style.setProperty('--time', c(1));
  }

  function clearTimer() {
    glow.hidden = true;
  }

  // ---------- potezi ----------
  // Nema pomoći: ne osvetljavaju se dozvoljena mesta i nema „dodirni da odigra“.
  // Igrač sam prevlači kartu; karta spuštena tamo gde ne ide je TAČ (engine to odlučuje).

  /** Gde se spušta karta: 'center' | 'opp' | 'own' | null (nigde). */
  function targetOf(slot) {
    if (!slot) return null;
    if (slot.dataset.slot === 'center') return 'center';
    if (slot.dataset.slot === 'open') return +slot.dataset.player === state.current ? 'own' : 'opp';
    if (slot.dataset.slot === 'closed' && +slot.dataset.player === state.current) return 'closed';
    return null;
  }

  /** Vruća karta MORA negde da padne: prazan sto ili svoja gomila = tvoja otvorena gomila. */
  function dropHot(to) {
    const p = state.current;
    // dok je sredina prazna, protivnikova gomila nije mesto za kartu – kao da je puštena bilo gde
    if (to === 'opp' && !state.center.length) to = null;
    if (to === 'center' || to === 'opp') onAction({ type: 'PLAY', player: p, from: 'flipped', to });
    else onAction({ type: 'PLAY', player: p, from: 'flipped', to: 'own' });
  }

  // ---------- prevlačenje ----------
  function makeGhost(card) {
    const g = cardEl(card, false);
    g.classList.add('ghost');
    if (state.current === 1) g.classList.add('flip180');
    document.body.append(g);
    return g;
  }

  function moveGhost(x, y) {
    const g = drag.ghost;
    // karta je malo „ispred“ prsta (gledano od igrača) da se vidi šta je
    const lift = g.offsetWidth * 0.5 * (state.current === 1 ? -1 : 1); // karta je položena: visina na ekranu = širina karte
    g.style.left = `${x - g.offsetWidth / 2}px`;
    g.style.top = `${y - g.offsetHeight / 2 - lift}px`;
    const over = dropSlot();
    if (over !== drag.over) {
      drag.over?.classList.remove('hover');
      over?.classList.add('hover');
      drag.over = over;
    }
  }

  /**
   * Gde bi karta pala: gleda se SREDINA karte u ruci (ne prst – karta je iznad prsta),
   * a zone su velikodušne: sredina je ceo srednji pojas ekrana, gomile su proširene.
   * Ako se zone preklapaju, bira se najbliža.
   */
  function dropSlot() {
    const g = drag?.ghost?.getBoundingClientRect();
    if (!g) return null;
    const x = g.left + g.width / 2, y = g.top + g.height / 2;
    const cur = state.current;
    const pad = centerEl.offsetHeight * 0.35;
    const mid = document.getElementById('middle').getBoundingClientRect();
    const zonesToTry = [
      [centerEl, { left: mid.left, right: mid.right, top: mid.top - pad, bottom: mid.bottom + pad }],
      ...[zones[1 - cur].open, zones[cur].open, zones[cur].closed].map((el) => {
        const r = el.getBoundingClientRect();
        return [el, { left: r.left - pad, right: r.right + pad, top: r.top - pad, bottom: r.bottom + pad }];
      }),
    ];
    let best = null, bestDist = Infinity;
    for (const [el, r] of zonesToTry) {
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      const er = el.getBoundingClientRect();
      const d = Math.hypot(x - (er.left + er.width / 2), y - (er.top + er.height / 2));
      if (d < bestDist) [best, bestDist] = [el, d];
    }
    return best;
  }

  function cancelDrag() {
    if (!drag) return;
    drag.ghost?.remove();
    drag.over?.classList.remove('hover');
    drag = null;
  }

  app.addEventListener('pointerdown', (e) => {
    if (locked || !state || state.winner !== null || drag) return;
    const slot = e.target.closest('[data-slot]');
    if (!slot) return;
    const kind = slot.dataset.slot;
    const p = slot.dataset.player === undefined ? null : +slot.dataset.player;
    if (p !== state.current) return;

    if (kind === 'closed') {
      if (!state.flipped) {
        if (!onAction({ type: 'FLIP', player: p })) return;
        if (!state.flipped) return; // TAČ – karta se nije ni okrenula
      }
      // karta je sada „vruća“ i prati prst dok se ne spusti
      drag = { id: e.pointerId, player: p, hot: true, moved: true, over: null };
      drag.ghost = makeGhost(state.flipped);
      render(state);
      moveGhost(e.clientX, e.clientY);
      return;
    }

    if (kind === 'open' && sourceCard(state, p, 'open')) {
      // karta se „podiže“ odmah na dodir (uvećana i nagnuta), a na gomili se vidi karta ispod
      drag = { id: e.pointerId, player: p, hot: false, moved: true, over: null, x0: e.clientX, y0: e.clientY };
      drag.ghost = makeGhost(sourceCard(state, p, 'open'));
      sfx.pickup();
      render(state);
      moveGhost(e.clientX, e.clientY);
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    moveGhost(e.clientX, e.clientY);
  });

  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    if (!cancelled && d.ghost) moveGhost(e.clientX, e.clientY); // poslednji položaj karte
    const to = cancelled || !d.ghost ? null : targetOf(dropSlot());
    cancelDrag();
    if (d.player !== state.current) return render(state); // red se promenio dok je karta bila u ruci
    const pl = state.players[d.player];
    const tap = !cancelled && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 12;
    if (d.hot) dropHot(to);
    // karta sa otvorene: spuštena na sredinu/protivnika = potez; bilo gde drugde se vraća.
    // Dok je sredina prazna, protivnikova gomila nije potez – karta se samo vrati.
    else if (to === 'center' || (to === 'opp' && state.center.length)) {
      onAction({ type: 'PLAY', player: d.player, from: 'open', to });
    }
    // cela otvorena gomila prevučena na praznu zatvorenu = okreće se licem nadole;
    // poslednja karta se ne okreće – dovoljno je da se dodirne i potez je završen
    else if (!pl.closed.length && (to === 'closed' || (tap && pl.open.length === 1))) {
      onAction({ type: 'RECYCLE', player: d.player });
    }
    render(state); // karta vraćena na gomilu
  }
  window.addEventListener('pointerup', (e) => endDrag(e, false));
  window.addEventListener('pointercancel', (e) => endDrag(e, true));

  // ---------- poruke ----------
  function showTouch(evt) {
    const top = touchOverlay.querySelector('.msg.top');
    const bottom = touchOverlay.querySelector('.msg.bottom');
    const why = evt.violation ?? evt.reason; // ručni TAČ nosi razlog prvobitnog prekršaja
    const text = (p) => {
      const mine = p === evt.offender;
      const kind = ['illegal', 'timeout', 'center'].includes(why) ? why : 'missed';
      return t(kind + (mine ? 'Mine' : 'Opp'));
    };
    touchOverlay.querySelector('.big').textContent = evt.reason === 'timeout' ? t('time') : t('touch');
    top.textContent = text(1);
    bottom.textContent = text(0);
    touchOverlay.hidden = false;
    return new Promise((res) =>
      setTimeout(() => {
        touchOverlay.hidden = true;
        res();
      }, 1500),
    );
  }

  function showWin(winner) {
    winOverlay.querySelector('.win-side.top').textContent = winner === 1 ? t('win') : t('lose');
    winOverlay.querySelector('.win-side.bottom').textContent = winner === 0 ? t('win') : t('lose');
    winOverlay.hidden = false;
  }

  return {
    render,
    setTimer,
    clearTimer,
    showTouch,
    showWin,
    hideWin: () => (winOverlay.hidden = true),
    setLocked: (v) => {
      locked = v;
    },
  };
}
