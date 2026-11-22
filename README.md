# Tač – igra kartama za dva igrača

Mobilna igra kartama za dva igrača na jednom telefonu. Telefon se stavi na sto između igrača, a svaki igrač ima svoje gomile na svom kraju ekrana.

Pravila su sa [igresakartama.com/tac](https://igresakartama.com/tac/), prilagođena za 2 igrača:
- Na **sredinu** se ređa rastuće: A, 2 … K, pa ponovo A. Znak nije bitan.
- Na **protivnikovu otvorenu** gomilu stavlja se karta za jedan veća ili manja (na 6 ide 5 ili 7, na A ide K ili 2). Samo je sredina rastući niz. To je dozvoljeno i dok je sredina još prazna.
- **Sredina ima prednost**: karta koja može i na sredinu i na protivnikovu gomilu mora na sredinu. Ako ode na protivnika, to je TAČ. Isto važi i za keca dok je sredina prazna.
- Prvo se igra sa otvorene gomile, a tek onda se okreće zatvorena.
- Zatvorena gomila se **pritisne i drži**: karta se okreće pod prstom i mora da se prevuče na sredinu ili na protivnikovu gomilu. Ako se pusti bilo gde drugde, ide na igračevu otvorenu gomilu i red prelazi na protivnika.
- Karta sa otvorene gomile se prevlači na sredinu ili na protivnikovu gomilu.
- Kad se zatvorena gomila potroši, a karta sa vrha otvorene nema gde, igrač prevlači celu otvorenu gomilu na mesto zatvorene. Gomila se okreće licem nadole (bez mešanja), pa karta koja je bila na dnu otvorene postaje prva sledeća. Umesto prevlačenja može da se pritisne dugme **Okreni gomilu**, koje se pojavi tek kad je okretanje moguće. Ako je na otvorenoj ostala samo jedna karta, ona se ne okreće: igrač je samo dodirne (ili pritisne **Dalje**) i red prelazi na protivnika.
- **TAČ**: ko propusti potez ili spusti kartu tamo gde ne ide dobija kartu sa dna protivnikove zatvorene gomile. Igra namerno ne pokazuje koja karta je sledeća ni gde karta može da ide.

## Podešavanja
- **Zvuk**: uključen/isključen. Zvuci karata (podizanje, spuštanje, okretanje, okretanje cele gomile, mešanje na početku), udarac dlanom za TAČ, zvonce kad istekne vreme, kucanje sata u poslednje 3 sekunde i fanfara za pobedu. Svi zvuci se sintetizuju u kodu (Web Audio), bez audio fajlova.
- **Vremensko ograničenje**: uključeno/isključeno, a vreme za potez je 3, 5, 8 ili 10 s. Gradijent kreće od ivice ekrana igrača na potezu ka protivniku i povlači se kako vreme ističe, menjajući boju od zelene preko žute do crvene. Svako mora da igra: kad vreme istekne, igrač dobija kaznenu kartu, sledeća karta iz zatvorene gomile ide na njegovu otvorenu (aplikacija je nikad ne igra u njegovu korist) i red prelazi na protivnika.
- **Automatski TAČ**: kad je isključen, aplikacija ne prijavljuje prekršaj sama. Svaki igrač ima dugme **TAČ!** na svom kraju ekrana, uvek aktivno. Pritisak kažnjava samo protivnika, i to samo ako je napravio prekršaj koji još nije prijavljen: tokom njegovog poteza ili dok ti ne odigraš svoj prvi potez posle njega. Isti prekršaj se prijavljuje samo jednom, a pritisak bez prekršaja ne radi ništa.

## Jezici
Igra je na srpskom (latinica i ćirilica), engleskom, nemačkom, francuskom, španskom, italijanskom, poljskom i norveškom. Jezik se bira u meniju, a prvi put se uzima jezik telefona. Prevodi su u `js/i18n.js`: novi jezik se dodaje kao još jedan objekat sa istim ključevima kao `sr`. Ćirilica se pravi automatski iz latinice.

## Pokretanje lokalno
```bash
python3 -m http.server 8765
```
Zatim otvori http://localhost:8765. Testovi logike su na http://localhost:8765/tests/.

## Objavljivanje na GitHub Pages
1. Napravi repozitorijum na GitHub-u i pošalji ove fajlove na `main` granu.
2. Na GitHub-u otvori **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`.
3. Posle minut-dva igra je na `https://<korisnik>.github.io/<repo>/`. Otvori link na telefonu i izaberi **Dodaj na početni ekran** da se igra pokreće preko celog ekrana.

## Struktura
- `js/engine.js`: pravila igre, bez DOM-a (spremno za online verziju)
- `js/ui.js`: prikaz stola, dodir i prevlačenje karata
- `js/timer.js`: tajmer poteza
- `js/audio.js`: zvučni efekti
- `js/main.js`: povezuje delove, meni i podešavanja
- `js/i18n.js`: prevodi
- `tests/`: testovi pravila (u pregledaču ili sa `node tests/engine.test.js`)
