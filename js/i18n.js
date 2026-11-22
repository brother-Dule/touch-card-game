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
  optSoundHint: "Telefon ne sme da bude na tihom režimu",
  optAutoHint: 'Isključeno: protivnik sam pritiska dugme TAČ! pre svog prvog poteza',
  resume: 'Nastavi',
  idlePaused: "Igra je pauzirana: vreme je isteklo tri puta zaredom.",
  start: 'Počni igru',
  newGame: 'Nova igra',
  rulesTitle: 'Pravila',
  menu: 'Meni',
  touch: 'TAČ!',
  yourTurn: 'Tvoj potez',
  wait: 'Čekaj',
  recycleBtn: "Okreni gomilu",
  passBtn: "Dalje",
  centerMine: "Karta je morala na sredinu! +1 karta",
  centerOpp: "Protivnik je morao da stavi kartu na sredinu.",
  timeoutMine: 'Isteklo ti je vreme! +1 karta',
  timeoutOpp: 'Protivniku je isteklo vreme.',
  missedMine: 'Imao si potez! +1 karta',
  missedOpp: 'Protivnik dobija kaznenu kartu.',
  win: 'Pobeda! 🎉',
  lose: 'Poraz',
  rules: `
    <li><b>Cilj:</b> pobeđuje igrač koji se prvi reši svih svojih karata.</li>
    <li><b>Početak:</b> svaki igrač dobija 26 karata u <b>zatvorenoj</b> gomili, licem nadole. Karte koje ne može da odigra slaže na svoju <b>otvorenu</b> gomilu, između zatvorene gomile i sredine stola. Partiju počinje nasumično izabran igrač.</li>
    <li><b>Sredina:</b> karte se ređaju rastuće: A, 2, 3 … K, pa ponovo A. Znak nije bitan. Prva karta na sredini mora biti kec.</li>
    <li><b>Protivnikova gomila:</b> na protivnikovu otvorenu gomilu stavlja se karta za jedan veća ili manja od karte na vrhu (na 6 ide 5 ili 7, na A ide K ili 2). Na praznu protivnikovu gomilu ne može ništa da se stavi. Ovo je dozvoljeno od prvog poteza, i dok na sredini još nema nijedne karte.</li>
    <li><b>Sredina ima prednost:</b> karta koja može da ide i na sredinu i na protivnikovu gomilu mora da ide na sredinu. Ako je igrač stavi na protivnikovu gomilu, to je TAČ. Isto važi za keca dok je sredina prazna.</li>
    <li><b>Tok poteza:</b> igrač prvo igra kartu sa vrha svoje otvorene gomile, ako je to moguće. Ako nije, pritisne i drži svoju zatvorenu gomilu: karta se okreće pod prstom i igrač je prevlači na sredinu ili na protivnikovu gomilu. Posle svake odigrane karte igrač nastavlja, sve dok ima poteza.</li>
    <li><b>Kraj poteza:</b> kad okrenuta karta nema gde da ide, igrač je pusti bilo gde i ona pada na njegovu otvorenu gomilu. Tada je red na protivniku.</li>
    <li><b>TAČ!</b> Igrač koji propusti potez dobija kaznenu kartu sa dna protivnikove zatvorene gomile i stavlja je na dno svoje. Potez je propušten kada je karta sa vrha otvorene gomile, ili karta koju igrač drži, mogla da ide na sredinu ili na protivnikovu gomilu, a igrač je umesto toga okrenuo novu kartu, spustio okrenutu kartu na svoju gomilu, okrenuo celu gomilu ili je pustio da mu istekne vreme. Igra ne pokazuje gde karta može da ide: igrač to mora sam da primeti.</li>
    <li><b>Nemoguć potez nije TAČ:</b> karta spuštena tamo gde ne ide se ne kažnjava. Karta sa otvorene gomile se vraća na svoje mesto. Okrenuta karta pada na igračevu otvorenu gomilu i red prelazi na protivnika. Izuzetak: ako je okrenuta karta mogla da ide na neko drugo mesto, to je propušten potez i TAČ.</li>
    <li><b>Okretanje gomile:</b> kad se zatvorena gomila potroši, a karta sa vrha otvorene nema gde da ide, igrač prevlači celu otvorenu gomilu na mesto zatvorene ili pritisne dugme <b>Okreni gomilu</b>. Gomila se okreće licem nadole, bez mešanja, i igrač nastavlja potez. Ako je na otvorenoj gomili ostala samo jedna karta, ona se ne okreće: igrač je samo dodirne ili pritisne <b>Dalje</b>, i red prelazi na protivnika.</li>
    <li><b>Vremensko ograničenje</b> <i>(samo kad je uključeno)</i>: igrač ima 3, 5, 8 ili 10 sekundi, a svetlost sa njegove ivice ekrana se povlači kako vreme ističe. Vreme počinje da teče tek posle prvog poteza u partiji. Vraća se na početak samo kad igrač stavi kartu na sredinu ili na protivnikovu gomilu, i kad red pređe na protivnika. Kad vreme istekne, sledeća karta iz zatvorene gomile ide na igračevu otvorenu gomilu i red prelazi na protivnika. Ako je igrač imao potez, dobija i TAČ. Posle tri isteka vremena zaredom igra se pauzira.</li>
    <li><b>Automatski TAČ</b> <i>(kad je uključen)</i>: igra sama primećuje propušten potez i odmah daje kaznenu kartu. Red tada prelazi na protivnika.</li>
    <li><b>Ručni TAČ</b> <i>(kad je automatski TAČ isključen)</i>: igra ne kažnjava sama. Svaki igrač ima dugme <b>TAČ!</b> na svom kraju ekrana. Kad protivnik propusti potez, igrač pritiska TAČ!, i to dok protivnik još igra ili pre nego što sam odigra svoj prvi potez posle njega. Prekršilac tada dobija kaznenu kartu, a ako je bio na potezu, red prelazi na drugog igrača. Isti prekršaj se prijavljuje samo jednom, a pritisak kada prekršaja nema ne radi ništa. Istek vremena se i u ovom modu kažnjava automatski.</li>`,
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
  optSoundHint: "Your phone must not be on silent",
  optAutoHint: 'Off: the opponent presses TOUCH! before their first move',
  resume: 'Resume',
  idlePaused: "Game paused: time ran out three times in a row.",
  start: 'Start game',
  newGame: 'New game',
  rulesTitle: 'Rules',
  menu: 'Menu',
  touch: 'TOUCH!',
  yourTurn: 'Your turn',
  wait: 'Wait',
  recycleBtn: "Flip pile",
  passBtn: "Pass",
  centerMine: "That card had to go to the center! +1 card",
  centerOpp: "Your opponent had to play to the center.",
  timeoutMine: 'Your time is up! +1 card',
  timeoutOpp: "Your opponent's time is up.",
  missedMine: 'You had a move! +1 card',
  missedOpp: 'Your opponent gets a penalty card.',
  win: 'You win! 🎉',
  lose: 'You lose',
  rules: "<li><b>Goal:</b> the first player to get rid of all their cards wins.</li><li><b>Setup:</b> each player gets 26 cards in a face-down <b>closed</b> pile. Cards they can't play go on their <b>open</b> pile, between the closed pile and the center of the table. A randomly chosen player starts.</li><li><b>Center:</b> cards go up: A, 2, 3 … K, then A again. Suits don't matter. The first card in the center must be an ace.</li><li><b>Opponent's pile:</b> a card one higher or one lower than the top card can go on the opponent's open pile (5 or 7 on a 6; K or 2 on an A). Nothing can go on an empty opponent's pile. This is allowed from the first move, even while the center is still empty.</li><li><b>The center comes first:</b> a card that can go both to the center and onto the opponent's pile must go to the center. Putting it on the opponent's pile is a TOUCH. The same goes for an ace while the center is empty.</li><li><b>A turn:</b> the player first plays the top card of their open pile, if possible. If not, they press and hold their closed pile: the card flips under their finger and they drag it to the center or onto the opponent's pile. After each card played, the player keeps going as long as they have a move.</li><li><b>End of turn:</b> when the flipped card has nowhere to go, the player lets go of it anywhere and it lands on their open pile. Then it's the opponent's turn.</li><li><b>TOUCH!</b> A player who misses a move gets a penalty card from the bottom of the opponent's closed pile and puts it at the bottom of their own. A move is missed when the top card of the open pile, or the card the player is holding, could go to the center or onto the opponent's pile, but the player instead flipped a new card, dropped the flipped card on their own pile, flipped the whole pile, or let their time run out. The game never shows where a card fits: the player has to spot it.</li><li><b>An impossible move is not a TOUCH:</b> dropping a card where it doesn't go is not penalized. A card from the open pile goes back to its place. A flipped card lands on the player's open pile and it's the opponent's turn. Exception: if the flipped card could have gone somewhere else, it's a missed move and a TOUCH.</li><li><b>Flipping the pile:</b> when the closed pile runs out and the top card of the open pile has nowhere to go, the player drags the whole open pile to the closed pile's place or presses <b>Flip pile</b>. The pile turns face down, without shuffling, and the player continues the turn. If only one card is left on the open pile, it isn't flipped: the player just taps it or presses <b>Pass</b>, and it's the opponent's turn.</li><li><b>Time limit</b> <i>(only when on)</i>: the player has 3, 5, 8 or 10 seconds, and the light from their edge of the screen recedes as time runs out. The clock starts only after the first move of the game. It resets only when the player puts a card in the center or on the opponent's pile, and when the turn passes to the opponent. When time runs out, the next card from the closed pile goes onto the player's open pile and it's the opponent's turn. If the player had a move, they also get a TOUCH. After three timeouts in a row, the game pauses.</li><li><b>Automatic TOUCH</b> <i>(when on)</i>: the game spots a missed move by itself and gives the penalty card right away. The turn then passes to the opponent.</li><li><b>Manual TOUCH</b> <i>(when Automatic TOUCH is off)</i>: the game doesn't penalize by itself. Each player has a <b>TOUCH!</b> button at their end of the screen. When the opponent misses a move, the player presses TOUCH!, either while the opponent is still playing or before making their own first move after that. The offender then gets a penalty card, and if it was their turn, the turn passes to the other player. Each mistake can be called only once, and pressing the button when there is no mistake does nothing. Timeouts are penalized automatically in this mode too.</li>",
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
  optSoundHint: "Telefonen kan ikke stå på lydløs",
  optAutoHint: "Av: motspilleren trykker selv på TOUCH! før sitt første trekk",
  resume: "Fortsett",
  idlePaused: "Spillet er satt på pause: tiden gikk ut tre ganger på rad.",
  start: "Start spillet",
  newGame: "Nytt spill",
  rulesTitle: "Regler",
  menu: "Meny",
  touch: "TOUCH!",
  yourTurn: "Din tur",
  wait: "Vent",
  recycleBtn: "Snu bunken",
  passBtn: "Videre",
  centerMine: "Kortet måtte på midten! +1 kort",
  centerOpp: "Motspilleren måtte legge kortet på midten.",
  timeoutMine: "Tiden din er ute! +1 kort",
  timeoutOpp: "Motspillerens tid er ute.",
  missedMine: "Du hadde et trekk! +1 kort",
  missedOpp: "Motspilleren får et straffekort.",
  win: "Du vant! 🎉",
  lose: "Du tapte",
  rules: "<li><b>Mål:</b> den som først blir kvitt alle kortene sine, vinner.</li><li><b>Start:</b> hver spiller får 26 kort i en <b>lukket</b> bunke med baksiden opp. Kort spilleren ikke kan spille, legges på den <b>åpne</b> bunken, mellom den lukkede bunken og midten av bordet. En tilfeldig valgt spiller begynner.</li><li><b>Midten:</b> kortene legges oppover: A, 2, 3 … K, og så A igjen. Fargen spiller ingen rolle. Det første kortet på midten må være et ess.</li><li><b>Motspillerens bunke:</b> på motspillerens åpne bunke kan man legge et kort som er én høyere eller én lavere enn det øverste kortet (5 eller 7 på en 6; K eller 2 på et A). På en tom bunke hos motspilleren kan ingenting legges. Dette er lov fra første trekk, også mens midten fortsatt er tom.</li><li><b>Midten går først:</b> et kort som kan legges både på midten og på motspillerens bunke, må legges på midten. Legger spilleren det på motspillerens bunke, er det TOUCH. Det samme gjelder et ess mens midten er tom.</li><li><b>Et trekk:</b> spilleren spiller først det øverste kortet i sin åpne bunke, hvis det er mulig. Hvis ikke, trykker og holder spilleren på sin lukkede bunke: kortet snus under fingeren, og spilleren drar det til midten eller til motspillerens bunke. Etter hvert kort som spilles, fortsetter spilleren så lenge det finnes trekk.</li><li><b>Slutt på trekket:</b> når det snudde kortet ikke kan legges noe sted, slipper spilleren det hvor som helst, og det havner på spillerens åpne bunke. Da er det motspillerens tur.</li><li><b>TOUCH!</b> En spiller som går glipp av et trekk, får et straffekort fra bunnen av motspillerens lukkede bunke og legger det nederst i sin egen. Et trekk er gått tapt når det øverste kortet i den åpne bunken, eller kortet spilleren holder, kunne vært lagt på midten eller på motspillerens bunke, men spilleren i stedet snudde et nytt kort, la det snudde kortet på sin egen bunke, snudde hele bunken eller lot tiden gå ut. Spillet viser aldri hvor et kort passer: spilleren må se det selv.</li><li><b>Et umulig trekk er ikke TOUCH:</b> et kort som legges der det ikke passer, gir ingen straff. Et kort fra den åpne bunken går tilbake på plass. Et snudd kort havner på spillerens åpne bunke, og det er motspillerens tur. Unntak: hvis det snudde kortet kunne vært lagt et annet sted, er det et tapt trekk og TOUCH.</li><li><b>Snu bunken:</b> når den lukkede bunken er brukt opp og det øverste kortet i den åpne bunken ikke kan legges noe sted, drar spilleren hele den åpne bunken til plassen for den lukkede eller trykker på <b>Snu bunken</b>. Bunken snus med baksiden opp, uten stokking, og spilleren fortsetter trekket. Hvis bare ett kort er igjen i den åpne bunken, snus det ikke: spilleren trykker bare på det eller på <b>Videre</b>, og det er motspillerens tur.</li><li><b>Tidsbegrensning</b> <i>(bare når den er slått på)</i>: spilleren har 3, 5, 8 eller 10 sekunder, og lyset fra spillerens kant av skjermen trekker seg tilbake etter hvert som tiden går. Klokken starter først etter det første trekket i spillet. Den starter på nytt bare når spilleren legger et kort på midten eller på motspillerens bunke, og når turen går over til motspilleren. Når tiden går ut, legges neste kort fra den lukkede bunken på spillerens åpne bunke, og det er motspillerens tur. Hadde spilleren et trekk, blir det også TOUCH. Etter tre tidsavbrudd på rad settes spillet på pause.</li><li><b>Automatisk TOUCH</b> <i>(når det er slått på)</i>: spillet oppdager selv et tapt trekk og gir straffekortet med en gang. Turen går da over til motspilleren.</li><li><b>Manuell TOUCH</b> <i>(når Automatisk TOUCH er slått av)</i>: spillet straffer ikke av seg selv. Hver spiller har en <b>TOUCH!</b>-knapp på sin ende av skjermen. Når motspilleren går glipp av et trekk, trykker spilleren på TOUCH!, enten mens motspilleren fortsatt spiller eller før spillerens eget første trekk etterpå. Den som gjorde feilen, får da et straffekort, og var det den spillerens tur, går turen over til den andre. Hver feil kan meldes bare én gang, og et trykk når det ikke er noen feil, gjør ingenting. Tidsavbrudd straffes automatisk også i denne modusen.</li>",
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
  optSoundHint: "Le téléphone ne doit pas être en mode silencieux",
  optAutoHint: "Désactivé : l'adversaire appuie lui-même sur TOUCH ! avant son premier coup",
  resume: "Reprendre",
  idlePaused: "Partie en pause : le temps est écoulé trois fois de suite.",
  start: "Commencer",
  newGame: "Nouvelle partie",
  rulesTitle: "Règles",
  menu: "Menu",
  touch: "TOUCH !",
  yourTurn: "À toi de jouer",
  wait: "Attends",
  recycleBtn: "Retourner",
  passBtn: "Passer",
  centerMine: "Cette carte devait aller au centre ! +1 carte",
  centerOpp: "L'adversaire devait jouer au centre.",
  timeoutMine: "Ton temps est écoulé ! +1 carte",
  timeoutOpp: "Le temps de l'adversaire est écoulé.",
  missedMine: "Tu avais un coup à jouer ! +1 carte",
  missedOpp: "L'adversaire reçoit une carte de pénalité.",
  win: "Victoire ! 🎉",
  lose: "Défaite",
  rules: "<li><b>But :</b> le premier joueur qui se débarrasse de toutes ses cartes gagne.</li><li><b>Début :</b> chaque joueur reçoit 26 cartes dans une pile <b>fermée</b>, face cachée. Les cartes qu'il ne peut pas jouer vont sur sa pile <b>ouverte</b>, entre la pile fermée et le centre de la table. Un joueur tiré au sort commence.</li><li><b>Centre :</b> les cartes montent : A, 2, 3 … K, puis de nouveau A. La couleur ne compte pas. La première carte au centre doit être un as.</li><li><b>Pile de l'adversaire :</b> on pose sur la pile ouverte de l'adversaire une carte d'un rang au-dessus ou en dessous de celle du dessus (5 ou 7 sur un 6 ; K ou 2 sur un A). Rien ne peut aller sur une pile vide de l'adversaire. C'est permis dès le premier coup, même quand le centre est encore vide.</li><li><b>Le centre a la priorité :</b> une carte qui peut aller à la fois au centre et sur la pile de l'adversaire doit aller au centre. La poser sur la pile de l'adversaire est un TOUCH. Il en va de même pour un as tant que le centre est vide.</li><li><b>Déroulement :</b> le joueur joue d'abord la carte du dessus de sa pile ouverte, si c'est possible. Sinon, il appuie longuement sur sa pile fermée : la carte se retourne sous son doigt et il la fait glisser au centre ou sur la pile de l'adversaire. Après chaque carte jouée, le joueur continue tant qu'il a un coup.</li><li><b>Fin du tour :</b> quand la carte retournée ne peut aller nulle part, le joueur la lâche n'importe où et elle tombe sur sa pile ouverte. C'est alors au tour de l'adversaire.</li><li><b>TOUCH !</b> Le joueur qui rate un coup reçoit une carte de pénalité prise sous la pile fermée de l'adversaire et la met sous la sienne. Un coup est raté quand la carte du dessus de la pile ouverte, ou la carte que le joueur tient, pouvait aller au centre ou sur la pile de l'adversaire, mais que le joueur a retourné une nouvelle carte, posé la carte retournée sur sa propre pile, retourné toute la pile ou laissé son temps s'écouler. Le jeu ne montre jamais où une carte peut aller : le joueur doit le voir lui-même.</li><li><b>Un coup impossible n'est pas un TOUCH :</b> poser une carte au mauvais endroit n'est pas pénalisé. Une carte de la pile ouverte revient à sa place. Une carte retournée tombe sur la pile ouverte du joueur et c'est au tour de l'adversaire. Exception : si la carte retournée pouvait aller ailleurs, c'est un coup raté et un TOUCH.</li><li><b>Retourner la pile :</b> quand la pile fermée est épuisée et que la carte du dessus de la pile ouverte ne peut aller nulle part, le joueur fait glisser toute la pile ouverte à la place de la pile fermée ou appuie sur <b>Retourner</b>. La pile est retournée face cachée, sans mélanger, et le joueur continue son tour. S'il ne reste qu'une carte sur la pile ouverte, elle n'est pas retournée : le joueur la touche simplement ou appuie sur <b>Passer</b>, et c'est au tour de l'adversaire.</li><li><b>Limite de temps</b> <i>(seulement si elle est activée)</i> : le joueur a 3, 5, 8 ou 10 secondes, et la lumière venant de son bord de l'écran recule à mesure que le temps passe. Le chrono ne démarre qu'après le premier coup de la partie. Il ne repart à zéro que lorsque le joueur pose une carte au centre ou sur la pile de l'adversaire, et quand le tour passe à l'adversaire. Quand le temps est écoulé, la carte suivante de la pile fermée va sur la pile ouverte du joueur et c'est au tour de l'adversaire. Si le joueur avait un coup, il reçoit aussi un TOUCH. Après trois dépassements de temps d'affilée, la partie se met en pause.</li><li><b>TOUCH automatique</b> <i>(s'il est activé)</i> : le jeu repère lui-même un coup raté et donne aussitôt la carte de pénalité. Le tour passe alors à l'adversaire.</li><li><b>TOUCH manuel</b> <i>(quand le TOUCH automatique est désactivé)</i> : le jeu ne pénalise pas de lui-même. Chaque joueur a un bouton <b>TOUCH !</b> de son côté de l'écran. Quand l'adversaire rate un coup, le joueur appuie sur TOUCH !, pendant que l'adversaire joue encore ou avant de jouer lui-même son premier coup ensuite. Le fautif reçoit alors une carte de pénalité et, si c'était son tour, le tour passe à l'autre joueur. Chaque faute ne peut être signalée qu'une fois, et appuyer quand il n'y a pas de faute ne fait rien. Les dépassements de temps sont pénalisés automatiquement dans ce mode aussi.</li>",
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
  optSoundHint: "El teléfono no debe estar en modo silencio",
  optAutoHint: "Desactivado: el rival pulsa ¡TOUCH! antes de su primera jugada",
  resume: "Continuar",
  idlePaused: "Partida en pausa: se acabó el tiempo tres veces seguidas.",
  start: "Empezar",
  newGame: "Nueva partida",
  rulesTitle: "Reglas",
  menu: "Menú",
  touch: "¡TOUCH!",
  yourTurn: "Tu turno",
  wait: "Espera",
  recycleBtn: "Dar la vuelta",
  passBtn: "Pasar",
  centerMine: "¡Esa carta tenía que ir al centro! +1 carta",
  centerOpp: "Tu rival tenía que jugar al centro.",
  timeoutMine: "¡Se acabó tu tiempo! +1 carta",
  timeoutOpp: "Se acabó el tiempo de tu rival.",
  missedMine: "¡Tenías una jugada! +1 carta",
  missedOpp: "Tu rival recibe una carta de castigo.",
  win: "¡Victoria! 🎉",
  lose: "Derrota",
  rules: "<li><b>Objetivo:</b> gana el primer jugador que se queda sin cartas.</li><li><b>Inicio:</b> cada jugador recibe 26 cartas en una pila <b>cerrada</b>, boca abajo. Las cartas que no puede jugar van a su pila <b>abierta</b>, entre la pila cerrada y el centro de la mesa. Empieza un jugador elegido al azar.</li><li><b>Centro:</b> las cartas suben: A, 2, 3 … K y otra vez A. El palo no importa. La primera carta del centro tiene que ser un as.</li><li><b>Pila del rival:</b> en la pila abierta del rival se pone una carta uno más alta o uno más baja que la de arriba (5 o 7 sobre un 6; K o 2 sobre un A). En una pila vacía del rival no se puede poner nada. Esto se permite desde la primera jugada, incluso con el centro todavía vacío.</li><li><b>El centro tiene prioridad:</b> una carta que puede ir tanto al centro como a la pila del rival tiene que ir al centro. Ponerla en la pila del rival es TOUCH. Lo mismo vale para un as mientras el centro está vacío.</li><li><b>El turno:</b> el jugador juega primero la carta de arriba de su pila abierta, si puede. Si no, mantiene pulsada su pila cerrada: la carta se da la vuelta bajo su dedo y la arrastra al centro o a la pila del rival. Después de cada carta jugada, el jugador sigue mientras tenga jugada.</li><li><b>Fin del turno:</b> cuando la carta girada no tiene dónde ir, el jugador la suelta en cualquier sitio y cae en su pila abierta. Entonces le toca al rival.</li><li><b>¡TOUCH!</b> El jugador que se salta una jugada recibe una carta de castigo del fondo de la pila cerrada del rival y la pone en el fondo de la suya. Una jugada se ha saltado cuando la carta de arriba de la pila abierta, o la carta que el jugador tiene en la mano, podía ir al centro o a la pila del rival, pero el jugador en su lugar giró otra carta, dejó la carta girada en su propia pila, dio la vuelta a toda la pila o dejó que se le acabara el tiempo. El juego nunca muestra dónde encaja una carta: el jugador tiene que verlo.</li><li><b>Una jugada imposible no es TOUCH:</b> dejar una carta donde no va no se castiga. Una carta de la pila abierta vuelve a su sitio. Una carta girada cae en la pila abierta del jugador y le toca al rival. Excepción: si la carta girada podía ir a otro sitio, es una jugada saltada y TOUCH.</li><li><b>Dar la vuelta a la pila:</b> cuando se acaba la pila cerrada y la carta de arriba de la pila abierta no tiene dónde ir, el jugador arrastra toda la pila abierta al lugar de la cerrada o pulsa <b>Dar la vuelta</b>. La pila queda boca abajo, sin barajar, y el jugador sigue su turno. Si en la pila abierta queda una sola carta, no se da la vuelta: el jugador solo la toca o pulsa <b>Pasar</b>, y le toca al rival.</li><li><b>Límite de tiempo</b> <i>(solo si está activado)</i>: el jugador tiene 3, 5, 8 o 10 segundos, y la luz de su borde de la pantalla se retira a medida que pasa el tiempo. El reloj empieza solo después de la primera jugada de la partida. Vuelve a empezar solo cuando el jugador pone una carta en el centro o en la pila del rival, y cuando el turno pasa al rival. Cuando se acaba el tiempo, la siguiente carta de la pila cerrada va a la pila abierta del jugador y le toca al rival. Si el jugador tenía jugada, además recibe TOUCH. Tras tres veces seguidas sin tiempo, la partida se pausa.</li><li><b>TOUCH automático</b> <i>(si está activado)</i>: el juego detecta solo una jugada saltada y da enseguida la carta de castigo. El turno pasa entonces al rival.</li><li><b>TOUCH manual</b> <i>(si el TOUCH automático está desactivado)</i>: el juego no castiga solo. Cada jugador tiene un botón <b>¡TOUCH!</b> en su lado de la pantalla. Cuando el rival se salta una jugada, el jugador pulsa ¡TOUCH!, mientras el rival sigue jugando o antes de hacer su propia primera jugada después. El infractor recibe entonces una carta de castigo y, si era su turno, el turno pasa al otro jugador. Cada falta se puede cantar una sola vez, y pulsar cuando no hay falta no hace nada. Quedarse sin tiempo se castiga automáticamente también en este modo.</li>",
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
  optSoundHint: "Das Handy darf nicht lautlos sein",
  optAutoHint: "Aus: Der Gegner drückt TOUCH! selbst, vor seinem ersten Zug",
  resume: "Weiter",
  idlePaused: "Spiel pausiert: Die Zeit ist dreimal hintereinander abgelaufen.",
  start: "Spiel starten",
  newGame: "Neues Spiel",
  rulesTitle: "Regeln",
  menu: "Menü",
  touch: "TOUCH!",
  yourTurn: "Du bist dran",
  wait: "Warte",
  recycleBtn: "Stapel umdrehen",
  passBtn: "Weiter",
  centerMine: "Die Karte musste auf die Mitte! +1 Karte",
  centerOpp: "Dein Gegner musste auf die Mitte legen.",
  timeoutMine: "Deine Zeit ist um! +1 Karte",
  timeoutOpp: "Die Zeit deines Gegners ist um.",
  missedMine: "Du hattest einen Zug! +1 Karte",
  missedOpp: "Dein Gegner bekommt eine Strafkarte.",
  win: "Gewonnen! 🎉",
  lose: "Verloren",
  rules: "<li><b>Ziel:</b> Wer zuerst alle seine Karten los ist, gewinnt.</li><li><b>Beginn:</b> Jeder Spieler bekommt 26 Karten in einem <b>verdeckten</b> Stapel. Karten, die er nicht spielen kann, kommen auf seinen <b>offenen</b> Stapel, zwischen dem verdeckten Stapel und der Tischmitte. Ein zufällig gewählter Spieler beginnt.</li><li><b>Mitte:</b> Die Karten werden aufsteigend gelegt: A, 2, 3 … K, dann wieder A. Die Farbe spielt keine Rolle. Die erste Karte in der Mitte muss ein Ass sein.</li><li><b>Stapel des Gegners:</b> Auf den offenen Stapel des Gegners kommt eine Karte, die um eins höher oder niedriger ist als die oberste (5 oder 7 auf eine 6; K oder 2 auf ein A). Auf einen leeren Stapel des Gegners kann nichts gelegt werden. Das ist ab dem ersten Zug erlaubt, auch solange die Mitte noch leer ist.</li><li><b>Die Mitte hat Vorrang:</b> Eine Karte, die sowohl auf die Mitte als auch auf den Stapel des Gegners passt, muss auf die Mitte. Legt der Spieler sie auf den Stapel des Gegners, ist das ein TOUCH. Das gilt auch für ein Ass, solange die Mitte leer ist.</li><li><b>Ein Zug:</b> Der Spieler spielt zuerst die oberste Karte seines offenen Stapels, wenn das möglich ist. Wenn nicht, hält er seinen verdeckten Stapel gedrückt: Die Karte dreht sich unter seinem Finger um, und er zieht sie auf die Mitte oder auf den Stapel des Gegners. Nach jeder gespielten Karte macht der Spieler weiter, solange er einen Zug hat.</li><li><b>Ende des Zuges:</b> Passt die umgedrehte Karte nirgends hin, lässt der Spieler sie irgendwo los, und sie landet auf seinem offenen Stapel. Dann ist der Gegner dran.</li><li><b>TOUCH!</b> Wer einen Zug verpasst, bekommt eine Strafkarte von unten aus dem verdeckten Stapel des Gegners und legt sie unter seinen eigenen. Ein Zug ist verpasst, wenn die oberste Karte des offenen Stapels oder die Karte, die der Spieler hält, auf die Mitte oder den Stapel des Gegners gepasst hätte, der Spieler aber stattdessen eine neue Karte umgedreht, die umgedrehte Karte auf seinen eigenen Stapel gelegt, den ganzen Stapel umgedreht oder die Zeit hat ablaufen lassen. Das Spiel zeigt nie, wo eine Karte passt: Der Spieler muss es selbst sehen.</li><li><b>Ein unmöglicher Zug ist kein TOUCH:</b> Eine falsch abgelegte Karte wird nicht bestraft. Eine Karte vom offenen Stapel geht an ihren Platz zurück. Eine umgedrehte Karte landet auf dem offenen Stapel des Spielers, und der Gegner ist dran. Ausnahme: Hätte die umgedrehte Karte woanders hingepasst, ist das ein verpasster Zug und ein TOUCH.</li><li><b>Stapel umdrehen:</b> Ist der verdeckte Stapel aufgebraucht und passt die oberste Karte des offenen Stapels nirgends hin, zieht der Spieler den ganzen offenen Stapel an den Platz des verdeckten oder drückt <b>Stapel umdrehen</b>. Der Stapel wird ohne Mischen umgedreht, und der Spieler setzt seinen Zug fort. Liegt nur noch eine Karte auf dem offenen Stapel, wird sie nicht umgedreht: Der Spieler tippt sie nur an oder drückt <b>Weiter</b>, und der Gegner ist dran.</li><li><b>Zeitlimit</b> <i>(nur wenn eingeschaltet)</i>: Der Spieler hat 3, 5, 8 oder 10 Sekunden, und das Licht von seinem Bildschirmrand zieht sich zurück, während die Zeit abläuft. Die Uhr startet erst nach dem ersten Zug der Partie. Sie startet nur neu, wenn der Spieler eine Karte auf die Mitte oder auf den Stapel des Gegners legt, und wenn der Gegner an die Reihe kommt. Ist die Zeit um, kommt die nächste Karte vom verdeckten Stapel auf den offenen Stapel des Spielers, und der Gegner ist dran. Hatte der Spieler einen Zug, bekommt er außerdem ein TOUCH. Nach drei Zeitüberschreitungen hintereinander wird das Spiel pausiert.</li><li><b>Automatisches TOUCH</b> <i>(wenn eingeschaltet)</i>: Das Spiel erkennt einen verpassten Zug selbst und gibt sofort die Strafkarte. Dann ist der Gegner dran.</li><li><b>Manuelles TOUCH</b> <i>(wenn Automatisches TOUCH ausgeschaltet ist)</i>: Das Spiel bestraft nicht von selbst. Jeder Spieler hat an seinem Ende des Bildschirms eine <b>TOUCH!</b>-Taste. Verpasst der Gegner einen Zug, drückt der Spieler TOUCH!, solange der Gegner noch spielt oder bevor er selbst danach seinen ersten Zug macht. Wer den Fehler gemacht hat, bekommt dann eine Strafkarte, und war er am Zug, ist der andere Spieler dran. Jeder Fehler kann nur einmal gemeldet werden, und ein Druck ohne Fehler bewirkt nichts. Zeitüberschreitungen werden auch in diesem Modus automatisch bestraft.</li>",
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
  optSoundHint: "Telefon nie może być w trybie cichym",
  optAutoHint: "Wyłączony: przeciwnik sam naciska TOUCH! przed swoim pierwszym ruchem",
  resume: "Wznów",
  idlePaused: "Gra wstrzymana: czas minął trzy razy z rzędu.",
  start: "Zacznij grę",
  newGame: "Nowa gra",
  rulesTitle: "Zasady",
  menu: "Menu",
  touch: "TOUCH!",
  yourTurn: "Twój ruch",
  wait: "Czekaj",
  recycleBtn: "Odwróć stos",
  passBtn: "Dalej",
  centerMine: "Ta karta musiała iść na środek! +1 karta",
  centerOpp: "Przeciwnik musiał położyć kartę na środek.",
  timeoutMine: "Skończył ci się czas! +1 karta",
  timeoutOpp: "Przeciwnikowi skończył się czas.",
  missedMine: "Był możliwy ruch! +1 karta",
  missedOpp: "Przeciwnik dostaje kartę karną.",
  win: "Wygrana! 🎉",
  lose: "Przegrana",
  rules: "<li><b>Cel:</b> wygrywa gracz, który pierwszy pozbędzie się wszystkich swoich kart.</li><li><b>Początek:</b> każdy gracz dostaje 26 kart w <b>zakrytym</b> stosie. Karty, których nie może zagrać, kładzie na swój <b>odkryty</b> stos, między stosem zakrytym a środkiem stołu. Zaczyna losowo wybrany gracz.</li><li><b>Środek:</b> karty układa się rosnąco: A, 2, 3 … K, potem znowu A. Kolor nie ma znaczenia. Pierwszą kartą na środku musi być as.</li><li><b>Stos przeciwnika:</b> na odkryty stos przeciwnika kładzie się kartę o jeden wyższą lub niższą od karty na wierzchu (5 lub 7 na 6; K lub 2 na A). Na pusty stos przeciwnika nie można niczego położyć. Wolno to robić od pierwszego ruchu, także wtedy, gdy środek jest jeszcze pusty.</li><li><b>Środek ma pierwszeństwo:</b> karta, która pasuje i na środek, i na stos przeciwnika, musi iść na środek. Położenie jej na stos przeciwnika to TOUCH. To samo dotyczy asa, dopóki środek jest pusty.</li><li><b>Ruch:</b> gracz najpierw zagrywa kartę z wierzchu swojego odkrytego stosu, jeśli to możliwe. Jeśli nie, naciska i przytrzymuje swój zakryty stos: karta odwraca się pod palcem, a gracz przeciąga ją na środek albo na stos przeciwnika. Po każdej zagranej karcie gracz gra dalej, dopóki ma ruch.</li><li><b>Koniec ruchu:</b> gdy odwrócona karta nigdzie nie pasuje, gracz puszcza ją w dowolnym miejscu i trafia ona na jego odkryty stos. Wtedy ruch ma przeciwnik.</li><li><b>TOUCH!</b> Gracz, który przegapi ruch, dostaje kartę karną spod zakrytego stosu przeciwnika i wkłada ją pod swój. Ruch jest przegapiony, gdy karta z wierzchu odkrytego stosu albo karta, którą gracz trzyma, pasowała na środek lub na stos przeciwnika, a gracz zamiast tego odwrócił nową kartę, położył odwróconą kartę na swój stos, odwrócił cały stos albo pozwolił, by skończył mu się czas. Gra nigdy nie pokazuje, gdzie karta pasuje: gracz musi to zauważyć sam.</li><li><b>Niemożliwy ruch to nie TOUCH:</b> położenie karty tam, gdzie nie pasuje, nie jest karane. Karta z odkrytego stosu wraca na swoje miejsce. Odwrócona karta trafia na odkryty stos gracza i ruch ma przeciwnik. Wyjątek: jeśli odwrócona karta pasowała gdzie indziej, to przegapiony ruch i TOUCH.</li><li><b>Odwracanie stosu:</b> gdy zakryty stos się skończy, a karta z wierzchu odkrytego stosu nigdzie nie pasuje, gracz przeciąga cały odkryty stos na miejsce zakrytego albo naciska <b>Odwróć stos</b>. Stos zostaje odwrócony, bez tasowania, a gracz kontynuuje ruch. Jeśli na odkrytym stosie została tylko jedna karta, nie odwraca się jej: gracz tylko jej dotyka albo naciska <b>Dalej</b>, i ruch ma przeciwnik.</li><li><b>Limit czasu</b> <i>(tylko gdy jest włączony)</i>: gracz ma 3, 5, 8 albo 10 sekund, a światło z jego krawędzi ekranu cofa się w miarę upływu czasu. Zegar rusza dopiero po pierwszym ruchu w partii. Liczy od nowa tylko wtedy, gdy gracz położy kartę na środek albo na stos przeciwnika, oraz gdy ruch przechodzi na przeciwnika. Gdy czas się skończy, następna karta z zakrytego stosu trafia na odkryty stos gracza i ruch ma przeciwnik. Jeśli gracz miał ruch, dostaje też TOUCH. Po trzech przekroczeniach czasu z rzędu gra się zatrzymuje.</li><li><b>Automatyczny TOUCH</b> <i>(gdy jest włączony)</i>: gra sama zauważa przegapiony ruch i od razu daje kartę karną. Ruch przechodzi wtedy na przeciwnika.</li><li><b>Ręczny TOUCH</b> <i>(gdy automatyczny TOUCH jest wyłączony)</i>: gra nie karze sama. Każdy gracz ma przycisk <b>TOUCH!</b> na swoim końcu ekranu. Gdy przeciwnik przegapi ruch, gracz naciska TOUCH!, gdy przeciwnik jeszcze gra albo zanim sam wykona swój pierwszy ruch po nim. Winny dostaje wtedy kartę karną, a jeśli to był jego ruch, ruch przechodzi na drugiego gracza. Każdy błąd można zgłosić tylko raz, a naciśnięcie bez błędu nic nie robi. Przekroczenie czasu także w tym trybie jest karane automatycznie.</li>",
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
  optSoundHint: "Il telefono non deve essere in modalità silenziosa",
  optAutoHint: "Disattivato: l'avversario preme TOUCH! prima della sua prima mossa",
  resume: "Riprendi",
  idlePaused: "Partita in pausa: il tempo è scaduto tre volte di fila.",
  start: "Inizia",
  newGame: "Nuova partita",
  rulesTitle: "Regole",
  menu: "Menu",
  touch: "TOUCH!",
  yourTurn: "Tocca a te",
  wait: "Aspetta",
  recycleBtn: "Gira il mazzo",
  passBtn: "Passa",
  centerMine: "Quella carta doveva andare al centro! +1 carta",
  centerOpp: "L'avversario doveva giocare al centro.",
  timeoutMine: "Tempo scaduto! +1 carta",
  timeoutOpp: "Il tempo dell'avversario è scaduto.",
  missedMine: "Avevi una mossa! +1 carta",
  missedOpp: "L'avversario riceve una carta di penalità.",
  win: "Vittoria! 🎉",
  lose: "Sconfitta",
  rules: "<li><b>Obiettivo:</b> vince il primo giocatore che si libera di tutte le sue carte.</li><li><b>Inizio:</b> ogni giocatore riceve 26 carte in un mazzo <b>coperto</b>, a faccia in giù. Le carte che non può giocare vanno sul suo mazzo <b>scoperto</b>, tra il mazzo coperto e il centro del tavolo. Inizia un giocatore scelto a caso.</li><li><b>Centro:</b> le carte salgono: A, 2, 3 … K, poi di nuovo A. Il seme non conta. La prima carta al centro deve essere un asso.</li><li><b>Mazzo dell'avversario:</b> sul mazzo scoperto dell'avversario si mette una carta di uno più alta o più bassa di quella in cima (5 o 7 su un 6; K o 2 su un A). Su un mazzo vuoto dell'avversario non si può mettere niente. È permesso dalla prima mossa, anche quando il centro è ancora vuoto.</li><li><b>Il centro ha la precedenza:</b> una carta che può andare sia al centro sia sul mazzo dell'avversario deve andare al centro. Metterla sul mazzo dell'avversario è TOUCH. Lo stesso vale per un asso finché il centro è vuoto.</li><li><b>Il turno:</b> il giocatore gioca prima la carta in cima al suo mazzo scoperto, se possibile. Se no, tiene premuto il suo mazzo coperto: la carta si gira sotto il dito e il giocatore la trascina al centro o sul mazzo dell'avversario. Dopo ogni carta giocata, il giocatore continua finché ha una mossa.</li><li><b>Fine del turno:</b> quando la carta girata non ha dove andare, il giocatore la lascia in un punto qualsiasi e lei finisce sul suo mazzo scoperto. Allora tocca all'avversario.</li><li><b>TOUCH!</b> Il giocatore che salta una mossa riceve una carta di penalità dal fondo del mazzo coperto dell'avversario e la mette in fondo al proprio. Una mossa è saltata quando la carta in cima al mazzo scoperto, o la carta che il giocatore tiene, poteva andare al centro o sul mazzo dell'avversario, ma il giocatore invece ha girato una nuova carta, ha messo la carta girata sul proprio mazzo, ha girato tutto il mazzo o ha lasciato scadere il tempo. Il gioco non mostra mai dove va una carta: il giocatore deve accorgersene da solo.</li><li><b>Una mossa impossibile non è TOUCH:</b> mettere una carta dove non va non è punito. Una carta del mazzo scoperto torna al suo posto. Una carta girata finisce sul mazzo scoperto del giocatore e tocca all'avversario. Eccezione: se la carta girata poteva andare altrove, è una mossa saltata e TOUCH.</li><li><b>Girare il mazzo:</b> quando il mazzo coperto è finito e la carta in cima al mazzo scoperto non ha dove andare, il giocatore trascina tutto il mazzo scoperto al posto di quello coperto o preme <b>Gira il mazzo</b>. Il mazzo viene girato a faccia in giù, senza mescolare, e il giocatore continua il turno. Se sul mazzo scoperto è rimasta una sola carta, non si gira: il giocatore la tocca soltanto o preme <b>Passa</b>, e tocca all'avversario.</li><li><b>Limite di tempo</b> <i>(solo se attivo)</i>: il giocatore ha 3, 5, 8 o 10 secondi, e la luce dal suo bordo dello schermo si ritira man mano che il tempo passa. Il tempo parte solo dopo la prima mossa della partita. Riparte da capo solo quando il giocatore mette una carta al centro o sul mazzo dell'avversario, e quando il turno passa all'avversario. Quando il tempo scade, la carta successiva del mazzo coperto va sul mazzo scoperto del giocatore e tocca all'avversario. Se il giocatore aveva una mossa, riceve anche TOUCH. Dopo tre tempi scaduti di fila, la partita va in pausa.</li><li><b>TOUCH automatico</b> <i>(se attivo)</i>: il gioco si accorge da solo di una mossa saltata e dà subito la carta di penalità. Il turno passa allora all'avversario.</li><li><b>TOUCH manuale</b> <i>(quando il TOUCH automatico è disattivato)</i>: il gioco non punisce da solo. Ogni giocatore ha un pulsante <b>TOUCH!</b> dalla sua parte dello schermo. Quando l'avversario salta una mossa, il giocatore preme TOUCH!, mentre l'avversario sta ancora giocando o prima di fare la propria prima mossa dopo di lui. Chi ha sbagliato riceve allora una carta di penalità e, se era il suo turno, il turno passa all'altro giocatore. Ogni errore si può segnalare una sola volta, e premere quando non c'è errore non fa nulla. Il tempo scaduto viene punito automaticamente anche in questa modalità.</li>",
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
