---
title: "XOOPS 2.7.0 Pregled kompatibilnosti za ovaj vodič"
---
Ovaj dokument navodi promjene potrebne u ovom repozitoriju tako da Vodič za instalaciju odgovara XOOPS 2.7.0.

Osnova pregleda:

- Trenutno spremište vodiča: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- XOOPS 2.7.0 jezgra pregledana na: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Provjereni primarni izvori 2.7.0:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Opseg

Ovaj repo trenutno sadrži:

- Datoteke za označavanje engleskog jezika na korijenskoj razini korištene su kao glavni vodič.
- Djelomična kopija `en/`.
- Puna stabla knjiga `de/` i `fr/` s vlastitim assets.

Datoteke na korijenskoj razini trebaju prvi prolaz. Nakon toga, ekvivalentne promjene moraju se zrcaliti u `de/book/` i `fr/book/`. Stablo `en/` također treba očistiti jer se čini da je samo djelomično održavano.

## 1. Globalne promjene repozitorija

### 1.1 Određivanje verzija i metapodaci

Ažurirajte sve reference razine vodiča sa XOOPS 2.5.x na XOOPS 2.7.0.

Zahvaćene datoteke:

- `README.md`
- `SUMMARY.md` — primarni živi TOC za korijenski vodič; navigacijske oznake i naslovi odjeljaka moraju odgovarati novim naslovima poglavlja i preimenovanom odjeljku Historical Upgrade Notes
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- lokalizirani `de/book/*.md` i `fr/book/*.md`

Potrebne promjene:

- Promjena `for XOOPS 2.5.7.x` u `for XOOPS 2.7.0`.
- Ažurirajte godinu autorskih prava sa `2018` na `2026`.
- Zamijenite stare reference XOOPS 2.5.x i 2.6.0 gdje opisuju trenutno izdanje.
- Zamijenite smjernice za preuzimanje iz doba SourceForgea s GitHub izdanjima:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Osvježavanje veze

`about-xoops-cms.md` i lokalizirane `10aboutxoops.md` datoteke i dalje upućuju na stare 2.5.x i 2.6.0 GitHub lokacije. Te poveznice je potrebno ažurirati na trenutne lokacije projekta 2.7.x.

### 1.3 Osvježavanje snimke zaslona

Sve snimke zaslona koje prikazuju program za instalaciju, korisničko sučelje za nadogradnju, nadzornu ploču admin, birač tema, birač modula i zaslone nakon instalacije su zastarjele.

Zahvaćena stabla imovine:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Ovo je potpuno osvježenje, a ne djelomično. Instalacijski program 2.7.0 koristi drugačiji izgled temeljen na Bootstrapu i drugačiju vizualnu strukturu.

## 2. Poglavlje 2: Uvod

datoteka:

- `chapter-2-introduction.md`

### 2.1 Zahtjevi sustava moraju se ponovno napisati

U trenutnom poglavlju piše samo Apache, MySQL i PHP. XOOPS 2.7.0 ima eksplicitne minimume:

| Komponenta | 2.7.0 minimum | 2.7.0 preporuka |
| --- | --- | --- |
| PHP | 8.2.0 | 8,4+ |
| MySQL | 5.7.8 | 8,4+ |
| Web poslužitelj | Svaki poslužitelj koji podržava potreban PHP | Preporučuje se Apache ili Nginx |

Napomene za dodavanje:- IIS je još uvijek naveden u instalacijskom programu kao mogući, ali Apache i Nginx su preporučeni primjeri.
- Bilješke o izdanju također pozivaju na kompatibilnost MySQL 9.0.

### 2.2 Dodajte obavezni i preporučeni kontrolni popis proširenja PHP

Instalacijski program 2.7.0 sada odvaja teške zahtjeve od preporučenih proširenja.

Obavezne provjere koje prikazuje instalater:

- MySQLi
- Sjednica
- PCRE
- filter
- `file_uploads`
- informacije o datoteci

Preporučena proširenja:

- mbstring
- intl
- ikonv
- xml
- zlib
- gd
- exif
- kovrčati

### 2.3 Uklonite upute za kontrolni zbroj

Trenutačni korak 5 opisuje `checksum.php` i `checksum.mdi`. Te datoteke nisu dio XOOPS 2.7.0.

Radnja:

- Potpuno uklonite odjeljak za provjeru kontrolnog zbroja.

### 2.4 Ažurirajte paket i upute za učitavanje

Zadržite opis izgleda paketa `docs/`, `extras/`, `htdocs/`, `upgrade/`, ali ažurirajte tekst za prijenos i pripremu kako bi odražavao trenutna očekivanja staze za pisanje:

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

Vodič to trenutno podcjenjuje.

### 2.5 Zamijenite SourceForge prijevod/preuzimanje language

Trenutačni tekst i dalje kaže da posjetite XOOPS na SourceForgeu za ostale language pakete. To treba zamijeniti trenutnim smjernicama za preuzimanje projekta/zajednice.

## 3. Poglavlje 3: Provjera konfiguracije poslužitelja

datoteka:

- `chapter-3-server-configuration-check.md`

Potrebne promjene:

- Prepišite opis stranice oko trenutnog izgleda od dva bloka:
  - Zahtjevi
  - Preporučena proširenja
- Zamijenite stari snimak zaslona.
- Izričito dokumentirajte gore navedene provjere zahtjeva.

## 4. Poglavlje 4: Idite pravim putem

datoteka:

- `chapter-4-take-the-right-path.md`

Potrebne promjene:

- Dodajte novo polje `Cookie Domain`.
- Ažurirajte nazive i opise polja staze da odgovaraju 2.7.0:
  - XOOPS korijenski put
  - XOOPS Put podataka
  - Put knjižnice XOOPS
  - XOOPS URL
  - Domena kolačića
- Dodajte napomenu da promjena staze knjižnice sada zahtijeva važeći Autoloader Composer na `vendor/autoload.php`.

Ovo je stvarna provjera kompatibilnosti u verziji 2.7.0 i treba je jasno dokumentirati. Trenutačni vodič uopće ne spominje Composer.

## 5. Poglavlje 5: Veze s bazom podataka

datoteka:

- `chapter-5-database-connections.md`

Potrebne promjene:

- Zadržite izjavu da je podržan samo MySQL.
- Ažurirajte odjeljak konfiguracije baze podataka kako bi odražavao:
  - zadani skup znakova sada je `utf8mb4`
  - Odabir razvrstavanja ažurira se dinamički kada se promijeni skup znakova
- Zamijenite snimke zaslona za vezu s bazom podataka i konfiguracijske stranice.

Trenutačni tekst koji kaže da skup znakova i poredavanje ne zahtijevaju pozornost preslab je za 2.7.0. Trebalo bi barem spomenuti novu `utf8mb4` zadanu postavku i dinamički selektor uspoređivanja.

## 6. Poglavlje 6: Konačna konfiguracija sustava

datoteka:

- `chapter-6-final-system-configuration.md`

### 6.1 Promijenjene generirane konfiguracijske datoteke

Vodič trenutno kaže da instalacijski program piše `mainfile.php` i `secure.php`.U 2.7.0 također instalira konfiguracijske datoteke u `xoops_data/configs/`, uključujući:

- `xoopsconfig.php`
- captcha konfiguracijske datoteke
- konfiguracijske datoteke textsanitizera

### 6.2 Postojeće konfiguracijske datoteke u `xoops_data/configs/` nisu prebrisane

Ponašanje bez prepisivanja je **opseg**, a ne globalno. Dvije različite staze koda u `page_configsave.php` pišu konfiguracijske datoteke:

- `writeConfigurationFile()` (poziva se u redovima 59 i 66) **uvijek** regenerira `xoops_data/data/secure.php` i `mainfile.php` iz unosa čarobnjaka. Nema provjere postojanja; postojeća kopija je zamijenjena.
- `copyConfigDistFiles()` (pozvan u retku 62, definiran u retku 317) samo kopira datoteke `xoops_data/configs/` (`xoopsconfig.php`, konfiguracije captcha, konfiguracije textsanitizera) **ako odredište već ne postoji**.

Ponovno pisanje poglavlja mora jasno odražavati oba ponašanja:

- Za `mainfile.php` i `secure.php`: upozorenje da će svako ručno uređivanje ovih datoteka biti prebrisano kada se instalacijski program ponovno pokrene.
- Za datoteke `xoops_data/configs/`: objasnite da se lokalne prilagodbe čuvaju tijekom ponovnih pokretanja i nadogradnji te da vraćanje isporučenih zadanih postavki zahtijeva brisanje datoteke i ponovno pokretanje (ili ručno kopiranje odgovarajućeg `.dist.php`).

Nemojte generalizirati "postojeće datoteke su sačuvane" u svim konfiguracijskim datotekama koje je napisao instalater — to je netočno i dovelo bi u zabludu administrators uređivanje `mainfile.php` ili `secure.php`.

### 6.3 Promijenjeno rukovanje HTTPS-om i obrnutim proxyjem

Generirani `mainfile.php` sada podržava šire otkrivanje protokola, uključujući obrnuto proxy zaglavlja. Vodič bi to trebao spomenuti umjesto da podrazumijeva samo izravno otkrivanje `http` ili `https`.

### 6.4 Broj tablica je pogrešan

Trenutačno poglavlje kaže da nova stranica stvara `32` tablice.

XOOPS 2.7.0 stvara `33` tablice. Tablica koja nedostaje je:

- `tokens`

Radnja:

- Ažurirajte broj s 32 na 33.
- Dodajte `tokens` na popis tablica.

## 7. Poglavlje 7: Postavke administracije

datoteka:

- `chapter-7-administration-settings.md`

### 7.1 Opis korisničkog sučelja lozinke je zastario

Instalater i dalje includes generira lozinku, ali sada također includes:

- mjerač snage lozinke temeljen na zxcvbn
- vizualne oznake čvrstoće
- Generator 16 znakova i tijek kopiranja

Ažurirajte tekst i snimke zaslona kako biste opisali trenutnu ploču s lozinkama.

### 7.2 Sada je na snazi provjera valjanosti e-pošte

E-pošta administratora potvrđena je sa `FILTER_VALIDATE_EMAIL`. U poglavlju bi trebalo spomenuti da se nevažeće vrijednosti e-pošte odbijaju.

### 7.3 Odjeljak licencnog ključa je pogrešan

Ovo je jedan od najvažnijih popravaka činjenica.

Trenutni vodič kaže:

- postoji `License System Key`
- pohranjeno je u `/include/license.php`
- `/include/license.php` mora biti moguće pisati tijekom instalacije

To više nije točno.

Što 2.7.0 zapravo radi:

- instalacija zapisuje podatke o licenci u `xoops_data/data/license.php`
- `htdocs/include/license.php` sada je samo zastarjeli omotač koji učitava datoteku iz `XOOPS_VAR_PATH`
- staru formulaciju o omogućavanju pisanja `/include/license.php` treba ukloniti

Radnja:

- Prepišite ovaj odjeljak umjesto da ga izbrišete.
- Ažurirajte put od `/include/license.php` do `xoops_data/data/license.php`.

### 7.4 Popis tema je zastario

Trenutačni vodič još uvijek se odnosi na Zetagenezu i stariji skup tema iz ere 2,5.

teme prisutne u XOOPS 2.7.0:- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Također imajte na umu:

- `xswatch4` je trenutna zadana tema koju su umetnuli podaci programa za instalaciju.
- Zetageneza više nije dio popisa zapakiranih tema.

### 7.5 Popis modula je zastario

moduli prisutni u paketu 2.7.0:

- `system` — automatski se instalira tijekom koraka popunjavanja tablice/umetanja podataka. Uvijek prisutan, nikada vidljiv u alatu za odabir.
- `debugbar` — moguće odabrati u koraku instalatera.
- `pm` — moguće odabrati u koraku instalatera.
- `profile` — moguće odabrati u koraku instalatera.
- `protector` — moguće odabrati u koraku instalatera.

Važno: stranica za instalaciju modula (`htdocs/install/page_moduleinstaller.php`) gradi svoj popis kandidata iteracijom preko `XoopsLists::getModulesList()` i **filtriranjem svega što je već u tablici modules** (redovi 95-102 prikupljaju `$listed_mods`; redak 116 preskače bilo koji direktorij prisutan na tom popisu). Budući da je `system` instaliran prije pokretanja ovog koraka, nikada se ne pojavljuje kao potvrdni okvir.

Potrebne promjene vodiča:

- Prestanite govoriti da postoje samo tri modules u paketu.
- Opišite korak instalacije tako da prikazuje **četiri modules** (`debugbar`, `pm`, `profile`, `protector`), a ne pet.
- `system` zasebno dokumentirajte kao uvijek instalirani osnovni modul koji se ne pojavljuje u biraču.
- Add `debugbar` to the bundled-module description as new in 2.7.0.
- Imajte na umu da je zadani predodabir modula instalatera sada prazan; modules dostupni su za odabir, ali nisu unaprijed provjereni konfiguracijom instalatera.

## 8. Poglavlje 8: Spremni za polazak

datoteka:

- `chapter-8-ready-to-go.md`

### 8.1 Potrebno je ponovno napisati postupak čišćenja instalacije

Trenutačni vodič kaže da instalacijski program preimenuje instalacijsku mapu u jedinstveni naziv.

To je još uvijek istina, ali mehanizam se promijenio:

- vanjska skripta za čišćenje kreirana je u web korijenu
- posljednja stranica pokreće čišćenje kroz AJAX
- instalacijska mapa preimenovana je u `install_remove_<unique suffix>`
- zamjena za `cleanup.php` još uvijek postoji

Radnja:

- Ažurirajte objašnjenje.
- Upute upućene korisniku neka budu jednostavne: izbrišite preimenovani instalacijski direktorij nakon instalacije.

### 8.2 Reference dodatka nadzorne ploče administratora su zastarjele

Poglavlje 8 i dalje upućuje čitatelje na staro iskustvo admin iz doba kisika. To treba uskladiti s trenutnim admin themes:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 Smjernice za uređivanje staze nakon instalacije trebaju ispravke

Current text tells readers to update `secure.php` with path definitions. U 2.7.0, te konstante puta definirane su u `mainfile.php`, dok `secure.php` čuva sigurne podatke. Primjer bloka u ovom poglavlju trebalo bi u skladu s tim ispraviti.

### 8.4 Treba dodati proizvodne postavke

Vodič bi trebao izričito spomenuti proizvodne zadane koje su sada prisutne u `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` treba ostati `false`
- `XOOPS_DEBUG` treba ostati `false`

## 9. Poglavlje 9: Nadogradnja postojeće instalacije XOOPS

datoteka:

- `chapter-9-upgrade-existing-xoops-installation.md`

Ovo poglavlje zahtijeva najveće prepisivanje.### 9.1 Dodajte obavezni Smarty 4 korak prije leta

Tijek nadogradnje XOOPS 2.7.0 sada forsira postupak prije provjere prije završetka nadogradnje.

Novi potrebni protok:

1. Kopirajte direktorij `upgrade/` u korijen stranice.
2. Pokrenite `/upgrade/preflight.php`.
3. Skenirajte `/themes/` i `/modules/` za staru sintaksu Smarty.
4. Koristite izborni način popravka gdje je to prikladno.
5. Ponovo pokrenite dok ne bude čist.
6. Nastavite u `/upgrade/`.

Trenutačno poglavlje to uopće ne spominje, što ga čini nekompatibilnim s 2.7.0 smjernicama.

### 9.2 Zamijenite pripovijest o spajanju iz ere 2.5.2

Trenutno poglavlje još uvijek opisuje ručnu nadogradnju u stilu 2.5.2 sa spajanjem okvira, AltSys bilješkama i ručno upravljanim restrukturiranjem datoteka. To bi trebalo zamijeniti stvarnim slijedom nadogradnje 2.7.x iz `release_notes.txt` i `upgrade/README.md`.

Preporučeni pregled poglavlja:

1. Sigurnosno kopirajte datoteke i bazu podataka.
2. Isključite stranicu.
3. Kopirajte `htdocs/` preko živog korijena.
4. Kopirajte `htdocs/xoops_lib` u stazu aktivne knjižnice.
5. Kopirajte `htdocs/xoops_data` u stazu aktivnih podataka.
6. Kopirajte `upgrade/` u web korijen.
7. Pokrenite `preflight.php`.
8. Pokrenite `/upgrade/`.
9. Ispunite upite programa za ažuriranje.
10. Ažurirajte modul `system`.
11. Ažurirajte `pm`, `profile` i `protector` ako su instalirani.
12. Izbrišite `upgrade/`.
13. Ponovno uključite stranicu.

### 9.3 Dokumentirajte stvarne promjene nadogradnje 2.7.0

Ažuriranje za 2.7.0 includes barem ove konkretne promjene:

- kreirajte tablicu `tokens`
- proširiti `bannerclient.passwd` za moderne hashove zaporki
- dodati postavke kolačića sesije
- uklonite zastarjele imenike u paketu

Vodič ne treba izlagati svaki detalj implementacije, ali bi trebao prestati implicirati da je nadogradnja samo kopija datoteke plus ažuriranje modula.

## 10. Povijesne stranice za nadogradnju

datoteke:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Status:** strukturna odluka je već riješena — root `SUMMARY.md` premješta ih u namjenski odjeljak **Povijesne bilješke o nadogradnji**, a svaka datoteka nosi oblačić "Povijesna referenca" koji čitatelje upućuje na Poglavlje 9 za nadogradnje 2.7.0. Oni više nisu prve class smjernice za nadogradnju.

**Preostali posao (samo dosljednost):**

- Provjerite navodi li ih `README.md` (root) pod istim naslovom "Povijesne bilješke o nadogradnji", a ne pod generičkim zaglavljem "Nadogradnje".
- Zrcaljenje istog odvajanja u `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` i `en/SUMMARY.md`.
- Pobrinite se da svaka stranica za povijesnu nadogradnju (root i lokalizirane kopije `de/book/upg*.md` / `fr/book/upg*.md`) sadrži oblačić zastarjelog sadržaja koji povezuje natrag na Poglavlje 9.

## 11. Dodatak 1: Admin GUI

datoteka:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Ovaj dodatak vezan je za Oxygen admin GUI i potrebno ga je preraditi.

Potrebne promjene:

- zamijenite sve reference kisika
- zamijenite stare snimke zaslona ikona/izbornika
- dokumentirajte trenutni admin themes:
  - zadano
  - tamno
  - moderno
  - prijelaz
- spomenite trenutne mogućnosti 2.7.0 admin navedene u bilješkama o izdanju:
  - mogućnost preopterećenja predloška u sustavu admin themes
  - ažurirani skup tema admin## 12. Dodatak 2: Prijenos XOOPS putem FTP-a

datoteka:

- `appendix-2-uploading-xoops-via-ftp.md`

Potrebne promjene:

- uklonite pretpostavke specifične za HostGator i cPanel
- modernizirati tekst za učitavanje datoteke
- imajte na umu da je `xoops_lib` sada includes ovisnosti skladatelja, tako da su uploads veći i ne bi se trebali selektivno skraćivati

## 13. Dodatak 5: Sigurnost

datoteka:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Potrebne promjene:

- potpuno uklonite raspravu `register_globals`
- uklonite zastarjelu ulaznicu za host language
- ispravite tekst dopuštenja od `404` do `0444` gdje je predviđeno samo za čitanje
- ažurirajte raspravu `mainfile.php` i `secure.php` kako bi odgovarala izgledu 2.7.0
- dodajte novi stalni kontekst povezan sa sigurnošću domene kolačića:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- dodajte upute za proizvodnju za:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Utjecaj na održavanje više jezika

Nakon što se poprave engleske datoteke na korijenskoj razini, potrebna su ekvivalentna ažuriranja u:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

`en/` stablo također treba pregledati jer sadrži zaseban README i skup sredstava, ali čini se da ima samo djelomično `book/` stablo.

## 15. Redoslijed prioriteta

### Kritično prije izdavanja

1. Ažurirajte reference repo/verzije na 2.7.0.
2. Prepravite Poglavlje 9 oko stvarnog tijeka nadogradnje 2.7.0 i Smarty 4 prije provjere.
3. Ažurirajte sistemske zahtjeve na PHP 8.2+ i MySQL 5.7.8+.
4. Ispravite putanju datoteke licencnog ključa u poglavlju 7.
5. Ispravite inventare tema i modula.
6. Ispravite broj tablice u 6. poglavlju s 32 na 33.

### Važno za točnost

7. Ponovno napišite upute za stazu za pisanje.
8. Dodajte zahtjev za automatsko učitavanje skladatelja postavci staze.
9. Ažurirajte upute za skup znakova baze podataka na `utf8mb4`.
10. Popravite smjernice za uređivanje putanje iz poglavlja 8 tako da su konstante dokumentirane u pravoj datoteci.
11. Uklonite upute za kontrolni zbroj.
12. Uklonite `register_globals` i druge mrtve PHP smjernice.

### Čišćenje kvalitete izdanja

13. Zamijenite sve snimke zaslona programa za instalaciju i admin.
14. Premjestite povijesne stranice nadogradnje izvan glavnog tijeka.
15. Sinkronizirajte njemačke i francuske kopije nakon što se engleski ispravi.
16. Očistite stare poveznice i duplicirane README retke.
