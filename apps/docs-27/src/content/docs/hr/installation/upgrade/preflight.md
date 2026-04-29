---
title: "Provjera prije leta"
---
XOOPS 2.7.0 je nadogradio svoj mehanizam za izradu predložaka sa Smarty 3 na Smarty 4. Smarty 4 je stroži u pogledu sintakse predloška od Smarty 3 i neki prilagođeni themes i modul templates možda će trebati prilagoditi prije nego što počnu ispravno raditi na XOOPS 2.7.0.

Kako bi se lakše identificirali i popravili ovi problemi _prije_ pokretanja glavne nadogradnje, XOOPS 2.7.0 isporučuje se sa **preflight skenerom** u direktoriju `upgrade/`. Morate pokrenuti skener prije provjere barem jednom prije nego što vam glavni radni tijek nadogradnje omogući nastavak.

## Što skener radi

Skener prije leta prolazi kroz vaš postojeći themes i modul templates tražeći poznate nekompatibilnosti Smarty 4. Može:

* **Skenirajte** svoje `themes/` i `modules/` direktorije za datoteke predložaka `.tpl` i `.html` koje bi možda trebale promijeniti
* **Prijavi** probleme grupirane po datoteci i vrsti problema
* **Automatski popravi** mnoge uobičajene probleme kada to zatražite

Ne može se svaki problem popraviti automatski. Nekim templates trebat će ručno uređivanje, posebno ako koriste starije Smarty 3 idiome koji nemaju izravni ekvivalent u Smarty 4.

## Pokretanje skenera

1. Kopirajte distribucijski direktorij `upgrade/` u korijen web-mjesta (ako to već niste učinili kao dio koraka [Pripreme za nadogradnju](ustep-01.md)).
2. Usmjerite svoj preglednik na pretflight URL:

   
   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Prijavite se sa administrator računom kada se to od vas zatraži.
4. Skener predstavlja obrazac s tri kontrole:
   * **Imenik predložaka** — ostavite prazno za skeniranje `themes/` i `modules/`. Unesite put poput `/themes/mytheme/` da suzite skeniranje na jedan direktorij.
   * **Proširenje predloška** — ostavite prazno za skeniranje datoteka `.tpl` i `.html`. Unesite jednu ekstenziju da suzite skeniranje.
   * **Pokušaj automatskog popravka** — označite ovaj okvir ako želite da skener popravi probleme koje zna kako popraviti. Ostavite ga neoznačenim za skeniranje samo za čitanje.
5. Pritisnite tipku **Run**. Skener obilazi odabrane direktorije i izvješćuje o svakom problemu koji pronađe.

## Tumačenje rezultata

Izvješće o skeniranju navodi svaku datoteku koju je pregledao i svaki problem koji je pronašao. Svaki unos problema govori vam:

* Koja datoteka sadrži problem
* Koje pravilo Smarty 4 krši
* Može li ga skener automatski popraviti

Ako ste pokrenuli skeniranje s omogućenim _Pokušaj automatskog popravka_, izvješće će također potvrditi koje su datoteke ponovno napisane.

## Ručno rješavanje problema

Za probleme koje skener ne može popraviti automatski, otvorite označenu datoteku predloška u uređivaču i napravite potrebne promjene. Uobičajene Smarty 4 nekompatibilnosti include:

* `{php} ... {/php}` blokovi (više nisu podržani u Smarty 4)
* Zastarjeli modifikatori i pozivi funkcija
* Upotreba razdjelnika osjetljivog na razmak
* Pretpostavke dodatka za vrijeme registracije koje su se promijenile u Smarty 4Ako vam nije ugodno uređivati ​​templates, najsigurniji je pristup prebaciti se na isporučenu temu (`xbootstrap5`, `default`, `xswatch5`, itd.) i zasebno se baviti prilagođenom temom nakon završetka nadogradnje.

## Ponovno pokretanje do čišćenja

Nakon što izvršite popravke — automatski ili ručno — ponovno pokrenite skener prije leta. Ponavljajte dok skeniranje ne javi da nema preostalih problema.

Nakon što je skeniranje čisto, možete prekinuti sesiju pregleda pritiskom na gumb **Izlaz iz skenera** u korisničkom sučelju skenera. Ovo označava provjeru dovršenog i omogućuje glavnom nadogradnji na `/upgrade/` da nastavi.

## Nastavak nadogradnje

Kada je provjera završena, možete pokrenuti glavnu nadogradnju na:

```text
http://example.com/upgrade/
```

Pogledajte [Nadogradnja u tijeku](ustep-02.md) za sljedeće korake.

## Ako preskočite pregled prije leta

Izričito se ne preporučuje preskakanje pregleda prije provjere, ali ako ste izvršili nadogradnju bez pokretanja i sada vidite pogreške predloška, pogledajte odjeljak Smarty 4 pogreške predloška u [Rješavanje problema](ustep-03.md). Možete pokrenuti probni pregled naknadno i izbrisati `xoops_data/caches/smarty_compile/` za oporavak.
