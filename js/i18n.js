// Prevodi. Novi jezik: dodaj objekat u STRINGS i naziv u LANGS (ključevi kao kod `sr`).
// Ćirilica se ne prevodi ručno – pravi se automatski iz latinice (transliteracija).

const sr = {
  docTitle: 'Tač',
  title: 'Tač',
  sub: 'Igra kartama za dva igrača. Telefon stavite na sto između sebe.',
  optLang: 'Jezik',
  optTimer: 'Vremensko ograničenje',
  optTimerHint: 'Isključi za decu i početnike',
  optSeconds: 'Vreme za potez',
  optAuto: 'Automatski TAČ',
  optAutoHint: 'Isključeno: protivnik sam pritiska dugme TAČ! pre svog prvog poteza',
  resume: 'Nastavi',
  start: 'Počni igru',
  newGame: 'Nova igra',
  rulesTitle: 'Pravila',
  menu: 'Meni',
  touch: 'TAČ!',
  time: 'VREME!',
  yourTurn: 'Tvoj potez',
  wait: 'Čekaj',
  refillHint: 'Prevuci otvorenu gomilu ovde',
  illegalMine: 'Ta karta ne ide tamo! +1 karta',
  illegalOpp: 'Protivnik je spustio kartu gde ne ide.',
  timeoutMine: 'Isteklo ti je vreme! +1 karta',
  timeoutOpp: 'Protivniku je isteklo vreme.',
  missedMine: 'Imao si potez! +1 karta',
  missedOpp: 'Protivnik dobija kaznenu kartu.',
  win: 'Pobeda! 🎉',
  lose: 'Poraz',
  rules: `
    <li>Svako ima 26 karata u <b>zatvorenoj</b> gomili. Iznad nje pravi svoju <b>otvorenu</b> gomilu.</li>
    <li>Na <b>sredinu</b> se ređa rastuće: A, 2, 3 … K, pa opet A. Znak nije bitan.</li>
    <li>Na <b>protivnikovu otvorenu</b> gomilu stavlja se karta za jedan veća ili manja (na 6 ide 5 ili 7, na A ide K ili 2). Samo je sredina rastući niz. Tek kad je prvi kec na sredini.</li>
    <li>Prvo igraš kartu sa svoje otvorene gomile: prevuci je na sredinu ili na protivnikovu gomilu.</li>
    <li>Kad otvorena nema gde: <b>pritisni i drži</b> zatvorenu gomilu. Karta se okreće pod prstom i moraš da je prevučeš na sredinu ili na protivnikovu gomilu.</li>
    <li>Ako karta nema gde, pusti je bilo gde i ona ide na tvoju otvorenu gomilu. Tada je red na protivniku.</li>
    <li><b>TAČ!</b> Ko propusti potez ili spusti kartu tamo gde ne ide dobija kaznenu kartu sa dna protivnikove gomile. Igra ne pokazuje koja karta je sledeća ni gde karta može. To moraš sam da znaš.</li>
    <li><b>Svako mora da igra.</b> Kad istekne vreme, dobijaš kaznenu kartu, sledeća karta se okreće na tvoju otvorenu gomilu i red prelazi na protivnika.</li>
    <li>Kad se zatvorena potroši, a karta sa vrha otvorene nema gde, <b>prevuci celu otvorenu gomilu</b> na mesto zatvorene. Gomila se okreće licem nadole i igraš dalje. Ako je karta sa vrha imala gde, to je TAČ.</li>
    <li>Pobeđuje ko se prvi reši svih karata.</li>`,
};

const en = {
  docTitle: 'Tač – Touch',
  title: 'Tač',
  sub: 'A card game for two players. Put the phone on the table between you.',
  optLang: 'Language',
  optTimer: 'Time limit',
  optTimerHint: 'Turn it off for kids and beginners',
  optSeconds: 'Time per turn',
  optAuto: 'Automatic TOUCH',
  optAutoHint: 'Off: the opponent presses TOUCH! before their first move',
  resume: 'Resume',
  start: 'Start game',
  newGame: 'New game',
  rulesTitle: 'Rules',
  menu: 'Menu',
  touch: 'TOUCH!',
  time: 'TIME!',
  yourTurn: 'Your turn',
  wait: 'Wait',
  refillHint: 'Drag your open pile here',
  illegalMine: "That card doesn't go there! +1 card",
  illegalOpp: "Your opponent put a card where it doesn't go.",
  timeoutMine: 'Your time is up! +1 card',
  timeoutOpp: "Your opponent's time is up.",
  missedMine: 'You had a move! +1 card',
  missedOpp: 'Your opponent gets a penalty card.',
  win: 'You win! 🎉',
  lose: 'You lose',
  rules: `
    <li>Each player has 26 cards in a <b>closed</b> pile. Above it, they build their <b>open</b> pile.</li>
    <li>The <b>center</b> pile goes up: A, 2, 3 … K, then A again. Suits don't matter.</li>
    <li>On your <b>opponent's open</b> pile you can put a card one higher or one lower (5 or 7 on a 6; K or 2 on an A). Only the center has to go up. Allowed only once the first ace is in the center.</li>
    <li>First play the card from your open pile: drag it to the center or onto your opponent's pile.</li>
    <li>If your open card has nowhere to go, <b>press and hold</b> your closed pile. The card flips under your finger and you must drag it to the center or onto your opponent's pile.</li>
    <li>If that card has nowhere to go, let go of it anywhere and it lands on your open pile. Then it's your opponent's turn.</li>
    <li><b>TOUCH!</b> If you miss a move or drop a card where it doesn't go, you get a penalty card from the bottom of your opponent's pile. The game never shows which card is next or where a card fits. You have to know it yourself.</li>
    <li><b>Everyone must play.</b> When your time runs out, you get a penalty card, your next card is flipped onto your open pile, and it's your opponent's turn.</li>
    <li>When your closed pile is empty and the top open card has nowhere to go, <b>drag the whole open pile</b> onto the closed spot. It turns face down and you keep playing. If the top card could have been played, that's a TOUCH.</li>
    <li>The first player to get rid of all their cards wins.</li>`,
};

// ---------- latinica → ćirilica ----------
const DIGRAPHS = { Lj: 'Љ', LJ: 'Љ', lj: 'љ', Nj: 'Њ', NJ: 'Њ', nj: 'њ', Dž: 'Џ', DŽ: 'Џ', dž: 'џ' };
const LETTERS = {
  A: 'А', B: 'Б', V: 'В', G: 'Г', D: 'Д', Đ: 'Ђ', E: 'Е', Ž: 'Ж', Z: 'З', I: 'И', J: 'Ј', K: 'К', L: 'Л', M: 'М',
  N: 'Н', O: 'О', P: 'П', R: 'Р', S: 'С', T: 'Т', Ć: 'Ћ', U: 'У', F: 'Ф', H: 'Х', C: 'Ц', Č: 'Ч', Š: 'Ш',
};
for (const [l, c] of Object.entries(LETTERS)) LETTERS[l.toLowerCase()] = c.toLowerCase();

function toCyrillic(text) {
  // HTML oznake (<b>, <li>) ostaju netaknute
  return text.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith('<')) return part;
    let out = '';
    for (let i = 0; i < part.length; i++) {
      const two = part.slice(i, i + 2);
      if (DIGRAPHS[two]) { out += DIGRAPHS[two]; i++; }
      else out += LETTERS[part[i]] ?? part[i];
    }
    return out;
  }).join('');
}

const STRINGS = {
  sr,
  'sr-Cyrl': Object.fromEntries(Object.entries(sr).map(([k, v]) => [k, toCyrillic(v)])),
  en,
};

export const LANGS = { sr: 'Srpski', 'sr-Cyrl': 'Српски', en: 'English' };

/** Jezik telefona: srpski i susedni jezici → srpski (latinica), sve ostalo → engleski. */
export function detectLang() {
  const l = (navigator.language || '').toLowerCase();
  if (l.startsWith('sr-cyrl')) return 'sr-Cyrl';
  return /^(sr|hr|bs|sh|cnr|me)\b/.test(l) ? 'sr' : 'en';
}

let lang = 'sr';

export function setLang(l) {
  lang = STRINGS[l] ? l : 'sr';
  document.documentElement.lang = lang;
  document.title = t('docTitle');
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-i18n-html]')) el.innerHTML = t(el.dataset.i18nHtml);
  for (const el of document.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
}

export const t = (key) => STRINGS[lang][key] ?? sr[key] ?? key;
