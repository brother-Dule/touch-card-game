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
  optSound: 'Zvuk',
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
  recycleBtn: "Okreni gomilu",
  passBtn: "Dalje",
  illegalMine: 'Ta karta ne ide tamo! +1 karta',
  illegalOpp: 'Protivnik je spustio kartu gde ne ide.',
  centerMine: "Karta je morala na sredinu! +1 karta",
  centerOpp: "Protivnik je morao da stavi kartu na sredinu.",
  timeoutMine: 'Isteklo ti je vreme! +1 karta',
  timeoutOpp: 'Protivniku je isteklo vreme.',
  missedMine: 'Imao si potez! +1 karta',
  missedOpp: 'Protivnik dobija kaznenu kartu.',
  win: 'Pobeda! 🎉',
  lose: 'Poraz',
  rules: `
    <li>Svako ima 26 karata u <b>zatvorenoj</b> gomili. Iznad nje pravi svoju <b>otvorenu</b> gomilu.</li>
    <li>Na <b>sredinu</b> se ređa rastuće: A, 2, 3 … K, pa opet A. Znak nije bitan.</li>
    <li>Na <b>protivnikovu otvorenu</b> gomilu stavlja se karta za jedan veća ili manja (na 6 ide 5 ili 7, na A ide K ili 2). Samo je sredina rastući niz. Tek kad je prvi kec na sredini. Ako karta može i na sredinu, mora na sredinu.</li>
    <li>Prvo igraš kartu sa svoje otvorene gomile: prevuci je na sredinu ili na protivnikovu gomilu.</li>
    <li>Kad otvorena nema gde: <b>pritisni i drži</b> zatvorenu gomilu. Karta se okreće pod prstom i moraš da je prevučeš na sredinu ili na protivnikovu gomilu.</li>
    <li>Ako karta nema gde, pusti je bilo gde i ona ide na tvoju otvorenu gomilu. Tada je red na protivniku.</li>
    <li><b>TAČ!</b> Ko propusti potez ili spusti kartu tamo gde ne ide dobija kaznenu kartu sa dna protivnikove gomile. Igra ne pokazuje koja karta je sledeća ni gde karta može. To moraš sam da znaš.</li>
    <li><b>Svako mora da igra.</b> Kad istekne vreme, dobijaš kaznenu kartu, sledeća karta se okreće na tvoju otvorenu gomilu i red prelazi na protivnika.</li>
    <li>Kad se zatvorena potroši, a karta sa vrha otvorene nema gde, <b>prevuci celu otvorenu gomilu</b> na mesto zatvorene. Gomila se okreće licem nadole i igraš dalje. Ako je karta sa vrha imala gde, to je TAČ. Možeš i da pritisneš dugme <b>Okreni gomilu</b>. Ako je na otvorenoj ostala samo jedna karta, ona se ne okreće: samo je dodirni (ili pritisni <b>Dalje</b>) i red prelazi na protivnika.</li>
    <li>Pobeđuje ko se prvi reši svih karata.</li>`,
};

const en = {
  docTitle: 'Touch',
  title: 'Touch',
  sub: 'A card game for two players. Put the phone on the table between you.',
  optLang: 'Language',
  optTimer: 'Time limit',
  optTimerHint: 'Turn it off for kids and beginners',
  optSeconds: 'Time per turn',
  optAuto: 'Automatic TOUCH',
  optSound: 'Sound',
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
  recycleBtn: "Flip pile",
  passBtn: "Pass",
  illegalMine: "That card doesn't go there! +1 card",
  illegalOpp: "Your opponent put a card where it doesn't go.",
  centerMine: "That card had to go to the center! +1 card",
  centerOpp: "Your opponent had to play to the center.",
  timeoutMine: 'Your time is up! +1 card',
  timeoutOpp: "Your opponent's time is up.",
  missedMine: 'You had a move! +1 card',
  missedOpp: 'Your opponent gets a penalty card.',
  win: 'You win! 🎉',
  lose: 'You lose',
  rules: `
    <li>Each player has 26 cards in a <b>closed</b> pile. Above it, they build their <b>open</b> pile.</li>
    <li>The <b>center</b> pile goes up: A, 2, 3 … K, then A again. Suits don't matter.</li>
    <li>On your <b>opponent's open</b> pile you can put a card one higher or one lower (5 or 7 on a 6; K or 2 on an A). Only the center has to go up. Allowed only once the first ace is in the center. If a card can go to the center, it must go to the center.</li>
    <li>First play the card from your open pile: drag it to the center or onto your opponent's pile.</li>
    <li>If your open card has nowhere to go, <b>press and hold</b> your closed pile. The card flips under your finger and you must drag it to the center or onto your opponent's pile.</li>
    <li>If that card has nowhere to go, let go of it anywhere and it lands on your open pile. Then it's your opponent's turn.</li>
    <li><b>TOUCH!</b> If you miss a move or drop a card where it doesn't go, you get a penalty card from the bottom of your opponent's pile. The game never shows which card is next or where a card fits. You have to know it yourself.</li>
    <li><b>Everyone must play.</b> When your time runs out, you get a penalty card, your next card is flipped onto your open pile, and it's your opponent's turn.</li>
    <li>When your closed pile is empty and the top open card has nowhere to go, <b>drag the whole open pile</b> onto the closed spot. It turns face down and you keep playing. If the top card could have been played, that's a TOUCH. You can also press <b>Flip pile</b>. If only one card is left on your open pile, it isn't flipped: just tap it (or press <b>Pass</b>) and it's your opponent's turn.</li>
    <li>The first player to get rid of all their cards wins.</li>`,
};

const nb = {
  docTitle: 'Touch',
  title: 'Touch',
  sub: "Et kortspill for to spillere. Legg telefonen på bordet mellom dere.",
  optLang: "Språk",
  optTimer: "Tidsbegrensning",
  optTimerHint: "Slå av for barn og nybegynnere",
  optSeconds: "Tid per trekk",
  optAuto: "Automatisk TOUCH",
  optSound: 'Lyd',
  optAutoHint: "Av: motspilleren trykker selv på TOUCH! før sitt første trekk",
  resume: "Fortsett",
  start: "Start spillet",
  newGame: "Nytt spill",
  rulesTitle: "Regler",
  menu: "Meny",
  touch: "TOUCH!",
  time: "TID!",
  yourTurn: "Din tur",
  wait: "Vent",
  recycleBtn: "Snu bunken",
  passBtn: "Videre",
  illegalMine: "Det kortet passer ikke der! +1 kort",
  illegalOpp: "Motspilleren la et kort der det ikke passer.",
  centerMine: "Kortet måtte på midten! +1 kort",
  centerOpp: "Motspilleren måtte legge kortet på midten.",
  timeoutMine: "Tiden din er ute! +1 kort",
  timeoutOpp: "Motspillerens tid er ute.",
  missedMine: "Du hadde et trekk! +1 kort",
  missedOpp: "Motspilleren får et straffekort.",
  win: "Du vant! 🎉",
  lose: "Du tapte",
  rules: "<li>Hver spiller har 26 kort i en <b>lukket</b> bunke. Over den bygger hver sin <b>åpne</b> bunke.</li><li><b>Midtbunken</b> går oppover: A, 2, 3 … K, og så A igjen. Fargen spiller ingen rolle.</li><li>På <b>motspillerens åpne</b> bunke kan du legge et kort som er én høyere eller én lavere (5 eller 7 på en 6; K eller 2 på et A). Bare midten må gå oppover. Først når det første esset ligger i midten. Hvis et kort kan legges på midten, må det legges på midten.</li><li>Spill først kortet fra den åpne bunken din: dra det til midten eller over på motspillerens bunke.</li><li>Hvis det åpne kortet ikke kan legges noe sted, <b>trykk og hold</b> på den lukkede bunken. Kortet snus under fingeren, og du må dra det til midten eller over på motspillerens bunke.</li><li>Hvis kortet ikke kan legges noe sted, slipp det hvor som helst, så havner det på den åpne bunken din. Da er det motspillerens tur.</li><li><b>TOUCH!</b> Den som går glipp av et trekk eller legger et kort der det ikke passer, får et straffekort fra bunnen av motspillerens bunke. Spillet viser aldri hvilket kort som er neste, eller hvor et kort passer. Det må du vite selv.</li><li><b>Alle må spille.</b> Når tiden er ute, får du et straffekort, neste kort snus over på den åpne bunken din, og det blir motspillerens tur.</li><li>Når den lukkede bunken er tom og det øverste åpne kortet ikke kan legges noe sted, <b>dra hele den åpne bunken</b> til plassen for den lukkede. Den snus med bildesiden ned, og du spiller videre. Hvis det øverste kortet kunne vært spilt, er det TOUCH. Du kan også trykke på <b>Snu bunken</b>. Hvis bare ett kort er igjen i den åpne bunken, snus det ikke: bare trykk på det (eller på <b>Videre</b>), så er det motspillerens tur.</li><li>Den som først blir kvitt alle kortene sine, vinner.</li>",
};

const fr = {
  docTitle: 'Touch',
  title: 'Touch',
  sub: "Un jeu de cartes pour deux joueurs. Posez le téléphone sur la table entre vous.",
  optLang: "Langue",
  optTimer: "Limite de temps",
  optTimerHint: "À désactiver pour les enfants et les débutants",
  optSeconds: "Temps par tour",
  optAuto: "TOUCH automatique",
  optSound: 'Son',
  optAutoHint: "Désactivé : l'adversaire appuie lui-même sur TOUCH ! avant son premier coup",
  resume: "Reprendre",
  start: "Commencer",
  newGame: "Nouvelle partie",
  rulesTitle: "Règles",
  menu: "Menu",
  touch: "TOUCH !",
  time: "TEMPS !",
  yourTurn: "À toi de jouer",
  wait: "Attends",
  recycleBtn: "Retourner",
  passBtn: "Passer",
  illegalMine: "Cette carte ne va pas là ! +1 carte",
  illegalOpp: "L'adversaire a posé une carte au mauvais endroit.",
  centerMine: "Cette carte devait aller au centre ! +1 carte",
  centerOpp: "L'adversaire devait jouer au centre.",
  timeoutMine: "Ton temps est écoulé ! +1 carte",
  timeoutOpp: "Le temps de l'adversaire est écoulé.",
  missedMine: "Tu avais un coup à jouer ! +1 carte",
  missedOpp: "L'adversaire reçoit une carte de pénalité.",
  win: "Victoire ! 🎉",
  lose: "Défaite",
  rules: "<li>Chaque joueur a 26 cartes dans une pile <b>fermée</b>. Au-dessus, il construit sa pile <b>ouverte</b>.</li><li>La pile du <b>centre</b> monte : A, 2, 3 … K, puis de nouveau A. La couleur ne compte pas.</li><li>Sur la <b>pile ouverte de l'adversaire</b>, on pose une carte d'un rang au-dessus ou en dessous (5 ou 7 sur un 6 ; K ou 2 sur un A). Seul le centre doit monter. Seulement une fois le premier as posé au centre. Si une carte peut aller au centre, elle doit aller au centre.</li><li>Joue d'abord la carte de ta pile ouverte : fais-la glisser au centre ou sur la pile de l'adversaire.</li><li>Si ta carte ouverte ne peut aller nulle part, <b>appuie longuement</b> sur ta pile fermée. La carte se retourne sous ton doigt et tu dois la faire glisser au centre ou sur la pile de l'adversaire.</li><li>Si cette carte ne peut aller nulle part, lâche-la n'importe où : elle va sur ta pile ouverte. C'est alors au tour de l'adversaire.</li><li><b>TOUCH !</b> Celui qui rate un coup ou pose une carte au mauvais endroit reçoit une carte de pénalité prise sous la pile de l'adversaire. Le jeu ne montre jamais quelle carte vient ensuite ni où une carte peut aller. À toi de le savoir.</li><li><b>Tout le monde doit jouer.</b> Quand ton temps est écoulé, tu reçois une carte de pénalité, ta carte suivante est retournée sur ta pile ouverte et c'est au tour de l'adversaire.</li><li>Quand ta pile fermée est vide et que la carte du dessus de ta pile ouverte ne peut aller nulle part, <b>fais glisser toute la pile ouverte</b> à la place de la pile fermée. Elle se retourne face cachée et tu continues. Si la carte du dessus pouvait être jouée, c'est un TOUCH. Tu peux aussi appuyer sur <b>Retourner</b>. S'il ne reste qu'une carte sur ta pile ouverte, elle n'est pas retournée : touche-la simplement (ou appuie sur <b>Passer</b>) et c'est au tour de l'adversaire.</li><li>Le premier qui se débarrasse de toutes ses cartes gagne.</li>",
};

const es = {
  docTitle: 'Touch',
  title: 'Touch',
  sub: "Un juego de cartas para dos jugadores. Coloquen el teléfono sobre la mesa, entre los dos.",
  optLang: "Idioma",
  optTimer: "Límite de tiempo",
  optTimerHint: "Desactívalo para niños y principiantes",
  optSeconds: "Tiempo por turno",
  optAuto: "TOUCH automático",
  optSound: 'Sonido',
  optAutoHint: "Desactivado: el rival pulsa ¡TOUCH! antes de su primera jugada",
  resume: "Continuar",
  start: "Empezar",
  newGame: "Nueva partida",
  rulesTitle: "Reglas",
  menu: "Menú",
  touch: "¡TOUCH!",
  time: "¡TIEMPO!",
  yourTurn: "Tu turno",
  wait: "Espera",
  recycleBtn: "Dar la vuelta",
  passBtn: "Pasar",
  illegalMine: "¡Esa carta no va ahí! +1 carta",
  illegalOpp: "Tu rival puso una carta donde no va.",
  centerMine: "¡Esa carta tenía que ir al centro! +1 carta",
  centerOpp: "Tu rival tenía que jugar al centro.",
  timeoutMine: "¡Se acabó tu tiempo! +1 carta",
  timeoutOpp: "Se acabó el tiempo de tu rival.",
  missedMine: "¡Tenías una jugada! +1 carta",
  missedOpp: "Tu rival recibe una carta de castigo.",
  win: "¡Victoria! 🎉",
  lose: "Derrota",
  rules: "<li>Cada jugador tiene 26 cartas en una pila <b>cerrada</b>. Encima construye su pila <b>abierta</b>.</li><li>La pila del <b>centro</b> sube: A, 2, 3 … K y otra vez A. El palo no importa.</li><li>En la <b>pila abierta del rival</b> se pone una carta uno más alta o uno más baja (5 o 7 sobre un 6; K o 2 sobre un A). Solo el centro tiene que subir. Solo cuando el primer as ya está en el centro. Si una carta puede ir al centro, tiene que ir al centro.</li><li>Primero juega la carta de tu pila abierta: arrástrala al centro o a la pila del rival.</li><li>Si tu carta abierta no tiene dónde ir, <b>mantén pulsada</b> tu pila cerrada. La carta se da la vuelta bajo tu dedo y debes arrastrarla al centro o a la pila del rival.</li><li>Si esa carta no tiene dónde ir, suéltala en cualquier sitio e irá a tu pila abierta. Entonces es el turno del rival.</li><li><b>¡TOUCH!</b> Quien se salta una jugada o pone una carta donde no va recibe una carta de castigo de debajo de la pila del rival. El juego nunca muestra qué carta va después ni dónde cabe una carta. Tienes que saberlo tú.</li><li><b>Todos tienen que jugar.</b> Cuando se acaba tu tiempo, recibes una carta de castigo, tu siguiente carta se da la vuelta sobre tu pila abierta y el turno pasa al rival.</li><li>Cuando tu pila cerrada se acaba y la carta de arriba de la abierta no tiene dónde ir, <b>arrastra toda la pila abierta</b> al lugar de la cerrada. Se da la vuelta boca abajo y sigues jugando. Si la carta de arriba se podía jugar, es TOUCH. También puedes pulsar <b>Dar la vuelta</b>. Si solo queda una carta en tu pila abierta, no se da la vuelta: solo tócala (o pulsa <b>Pasar</b>) y le toca a tu rival.</li><li>Gana quien primero se queda sin cartas.</li>",
};

const de = {
  docTitle: 'Touch',
  title: 'Touch',
  sub: "Ein Kartenspiel für zwei Spieler. Legt das Handy zwischen euch auf den Tisch.",
  optLang: "Sprache",
  optTimer: "Zeitlimit",
  optTimerHint: "Für Kinder und Anfänger ausschalten",
  optSeconds: "Zeit pro Zug",
  optAuto: "Automatisches TOUCH",
  optSound: 'Ton',
  optAutoHint: "Aus: Der Gegner drückt TOUCH! selbst, vor seinem ersten Zug",
  resume: "Weiter",
  start: "Spiel starten",
  newGame: "Neues Spiel",
  rulesTitle: "Regeln",
  menu: "Menü",
  touch: "TOUCH!",
  time: "ZEIT!",
  yourTurn: "Du bist dran",
  wait: "Warte",
  recycleBtn: "Stapel umdrehen",
  passBtn: "Weiter",
  illegalMine: "Diese Karte passt da nicht! +1 Karte",
  illegalOpp: "Dein Gegner hat eine Karte falsch abgelegt.",
  centerMine: "Die Karte musste auf die Mitte! +1 Karte",
  centerOpp: "Dein Gegner musste auf die Mitte legen.",
  timeoutMine: "Deine Zeit ist um! +1 Karte",
  timeoutOpp: "Die Zeit deines Gegners ist um.",
  missedMine: "Du hattest einen Zug! +1 Karte",
  missedOpp: "Dein Gegner bekommt eine Strafkarte.",
  win: "Gewonnen! 🎉",
  lose: "Verloren",
  rules: "<li>Jeder Spieler hat 26 Karten in einem <b>verdeckten</b> Stapel. Darüber baut er seinen <b>offenen</b> Stapel.</li><li>Auf die <b>Mitte</b> wird aufsteigend gelegt: A, 2, 3 … K, dann wieder A. Die Farbe spielt keine Rolle.</li><li>Auf den <b>offenen Stapel des Gegners</b> legst du eine Karte, die um eins höher oder niedriger ist (5 oder 7 auf eine 6; K oder 2 auf ein A). Nur die Mitte muss aufsteigen. Erst wenn das erste Ass in der Mitte liegt. Wenn eine Karte auf die Mitte passt, muss sie auf die Mitte.</li><li>Spiele zuerst die Karte von deinem offenen Stapel: Zieh sie in die Mitte oder auf den Stapel des Gegners.</li><li>Wenn deine offene Karte nirgends passt, <b>halte</b> deinen verdeckten Stapel <b>gedrückt</b>. Die Karte dreht sich unter deinem Finger um, und du musst sie in die Mitte oder auf den Stapel des Gegners ziehen.</li><li>Wenn diese Karte nirgends passt, lass sie irgendwo los, dann landet sie auf deinem offenen Stapel. Danach ist der Gegner dran.</li><li><b>TOUCH!</b> Wer einen Zug verpasst oder eine Karte falsch ablegt, bekommt eine Strafkarte von unten aus dem Stapel des Gegners. Das Spiel zeigt nie, welche Karte als Nächstes kommt oder wo eine Karte passt. Das musst du selbst wissen.</li><li><b>Jeder muss spielen.</b> Wenn deine Zeit um ist, bekommst du eine Strafkarte, deine nächste Karte wird auf deinen offenen Stapel aufgedeckt, und der Gegner ist dran.</li><li>Wenn dein verdeckter Stapel leer ist und die oberste offene Karte nirgends passt, <b>zieh den ganzen offenen Stapel</b> auf den Platz des verdeckten. Er wird umgedreht, und du spielst weiter. Hätte die oberste Karte gespielt werden können, ist das ein TOUCH. Du kannst auch <b>Stapel umdrehen</b> drücken. Liegt nur noch eine Karte auf deinem offenen Stapel, wird sie nicht umgedreht: tippe sie einfach an (oder drücke <b>Weiter</b>), dann ist dein Gegner dran.</li><li>Wer zuerst alle Karten los ist, gewinnt.</li>",
};

const pl = {
  docTitle: 'Touch',
  title: 'Touch',
  sub: "Gra karciana dla dwóch graczy. Połóżcie telefon na stole między sobą.",
  optLang: "Język",
  optTimer: "Limit czasu",
  optTimerHint: "Wyłącz dla dzieci i początkujących",
  optSeconds: "Czas na ruch",
  optAuto: "Automatyczny TOUCH",
  optSound: 'Dźwięk',
  optAutoHint: "Wyłączony: przeciwnik sam naciska TOUCH! przed swoim pierwszym ruchem",
  resume: "Wznów",
  start: "Zacznij grę",
  newGame: "Nowa gra",
  rulesTitle: "Zasady",
  menu: "Menu",
  touch: "TOUCH!",
  time: "CZAS!",
  yourTurn: "Twój ruch",
  wait: "Czekaj",
  recycleBtn: "Odwróć stos",
  passBtn: "Dalej",
  illegalMine: "Ta karta tu nie pasuje! +1 karta",
  illegalOpp: "Przeciwnik położył kartę tam, gdzie nie pasuje.",
  centerMine: "Ta karta musiała iść na środek! +1 karta",
  centerOpp: "Przeciwnik musiał położyć kartę na środek.",
  timeoutMine: "Skończył ci się czas! +1 karta",
  timeoutOpp: "Przeciwnikowi skończył się czas.",
  missedMine: "Był możliwy ruch! +1 karta",
  missedOpp: "Przeciwnik dostaje kartę karną.",
  win: "Wygrana! 🎉",
  lose: "Przegrana",
  rules: "<li>Każdy gracz ma 26 kart w <b>zakrytym</b> stosie. Nad nim układa swój <b>odkryty</b> stos.</li><li>Na <b>środku</b> karty idą rosnąco: A, 2, 3 … K, potem znowu A. Kolor nie ma znaczenia.</li><li>Na <b>odkryty stos przeciwnika</b> kładzie się kartę o jeden wyższą lub niższą (5 lub 7 na 6; K lub 2 na A). Tylko środek musi rosnąć. Dopiero gdy pierwszy as leży na środku. Jeśli karta pasuje na środek, musi iść na środek.</li><li>Najpierw zagraj kartę ze swojego odkrytego stosu: przeciągnij ją na środek albo na stos przeciwnika.</li><li>Gdy odkryta karta nie ma gdzie pójść, <b>naciśnij i przytrzymaj</b> zakryty stos. Karta odwraca się pod palcem i musisz przeciągnąć ją na środek albo na stos przeciwnika.</li><li>Jeśli ta karta nie ma gdzie pójść, puść ją gdziekolwiek, a trafi na twój odkryty stos. Wtedy ruch ma przeciwnik.</li><li><b>TOUCH!</b> Kto przegapi ruch albo położy kartę tam, gdzie nie pasuje, dostaje kartę karną spod stosu przeciwnika. Gra nigdy nie pokazuje, która karta jest następna ani gdzie karta pasuje. Trzeba to wiedzieć samemu.</li><li><b>Każdy musi zagrać.</b> Gdy skończy się czas, dostajesz kartę karną, następna karta odwraca się na twój odkryty stos, a ruch przechodzi na przeciwnika.</li><li>Gdy zakryty stos się skończy, a górna karta odkrytego nie ma gdzie pójść, <b>przeciągnij cały odkryty stos</b> na miejsce zakrytego. Odwraca się rewersem do góry i grasz dalej. Jeśli górną kartę dało się zagrać, to jest TOUCH. Możesz też nacisnąć <b>Odwróć stos</b>. Jeśli na odkrytym stosie została tylko jedna karta, nie odwraca się jej: wystarczy jej dotknąć (albo nacisnąć <b>Dalej</b>) i ruch ma przeciwnik.</li><li>Wygrywa ten, kto pierwszy pozbędzie się wszystkich kart.</li>",
};

const it = {
  docTitle: 'Touch',
  title: 'Touch',
  sub: "Un gioco di carte per due giocatori. Mettete il telefono sul tavolo tra di voi.",
  optLang: "Lingua",
  optTimer: "Limite di tempo",
  optTimerHint: "Disattivalo per bambini e principianti",
  optSeconds: "Tempo per mossa",
  optAuto: "TOUCH automatico",
  optSound: 'Audio',
  optAutoHint: "Disattivato: l'avversario preme TOUCH! prima della sua prima mossa",
  resume: "Riprendi",
  start: "Inizia",
  newGame: "Nuova partita",
  rulesTitle: "Regole",
  menu: "Menu",
  touch: "TOUCH!",
  time: "TEMPO!",
  yourTurn: "Tocca a te",
  wait: "Aspetta",
  recycleBtn: "Gira il mazzo",
  passBtn: "Passa",
  illegalMine: "Quella carta non va lì! +1 carta",
  illegalOpp: "L'avversario ha messo una carta dove non va.",
  centerMine: "Quella carta doveva andare al centro! +1 carta",
  centerOpp: "L'avversario doveva giocare al centro.",
  timeoutMine: "Tempo scaduto! +1 carta",
  timeoutOpp: "Il tempo dell'avversario è scaduto.",
  missedMine: "Avevi una mossa! +1 carta",
  missedOpp: "L'avversario riceve una carta di penalità.",
  win: "Vittoria! 🎉",
  lose: "Sconfitta",
  rules: "<li>Ogni giocatore ha 26 carte in un mazzo <b>coperto</b>. Sopra costruisce il suo mazzo <b>scoperto</b>.</li><li>Al <b>centro</b> si sale: A, 2, 3 … K, poi di nuovo A. Il seme non conta.</li><li>Sul <b>mazzo scoperto dell'avversario</b> si mette una carta più alta o più bassa di uno (5 o 7 su un 6; K o 2 su un A). Solo il centro deve salire. Solo dopo che il primo asso è al centro. Se una carta può andare al centro, deve andare al centro.</li><li>Prima gioca la carta del tuo mazzo scoperto: trascinala al centro o sul mazzo dell'avversario.</li><li>Se la tua carta scoperta non può andare da nessuna parte, <b>tieni premuto</b> il tuo mazzo coperto. La carta si gira sotto il dito e devi trascinarla al centro o sul mazzo dell'avversario.</li><li>Se quella carta non può andare da nessuna parte, lasciala dove vuoi e finisce sul tuo mazzo scoperto. Poi tocca all'avversario.</li><li><b>TOUCH!</b> Chi salta una mossa o mette una carta dove non va riceve una carta di penalità dal fondo del mazzo dell'avversario. Il gioco non mostra mai quale carta viene dopo né dove può andare una carta. Devi saperlo tu.</li><li><b>Tutti devono giocare.</b> Quando il tempo scade, ricevi una carta di penalità, la tua carta successiva viene girata sul tuo mazzo scoperto e tocca all'avversario.</li><li>Quando il mazzo coperto è finito e la carta in cima a quello scoperto non può andare da nessuna parte, <b>trascina tutto il mazzo scoperto</b> al posto di quello coperto. Si gira a faccia in giù e continui a giocare. Se la carta in cima si poteva giocare, è TOUCH. Puoi anche premere <b>Gira il mazzo</b>. Se sul mazzo scoperto è rimasta una sola carta, non si gira: basta toccarla (o premere <b>Passa</b>) e tocca all'avversario.</li><li>Vince chi per primo si libera di tutte le carte.</li>",
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
  de,
  fr,
  es,
  it,
  pl,
  nb,
};

export const LANGS = {
  sr: 'Srpski',
  'sr-Cyrl': 'Српски',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pl: 'Polski',
  nb: 'Norsk',
};

/** Jezik telefona: srpski i susedni jezici → srpski (latinica), podržani jezici → taj jezik, ostalo → engleski. */
export function detectLang() {
  for (const raw of navigator.languages?.length ? navigator.languages : [navigator.language || '']) {
    const l = raw.toLowerCase();
    if (l.startsWith('sr-cyrl')) return 'sr-Cyrl';
    const base = l.split('-')[0];
    if (['sr', 'hr', 'bs', 'sh', 'cnr', 'me'].includes(base)) return 'sr';
    if (['no', 'nb', 'nn'].includes(base)) return 'nb';
    if (STRINGS[base]) return base;
  }
  return 'en';
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
