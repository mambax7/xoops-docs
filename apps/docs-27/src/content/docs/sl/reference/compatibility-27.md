---
title: "XOOPS 2.7.0 Pregled združljivosti za ta vodnik"
---
Ta dokument navaja spremembe, ki so potrebne v tem repozitoriju, tako da se Navodila za namestitev ujemajo z XOOPS 2.7.0.

Osnova pregleda:

- Trenutno skladišče vodnikov: `L:\GitHub\XoopsDocs\XOOPS-installation-guide`
- XOOPS 2.7.0 jedro pregledano na: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Preverjeni primarni viri 2.7.0:
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

## Obseg

Ta repo trenutno vsebuje:

- Korenske angleške datoteke Markdown, ki se uporabljajo kot glavni vodnik.
- Delna kopija `en/`.
- Polna drevesa `de/` in `fr/` z lastnimi sredstvi.

Datoteke na korenski ravni potrebujejo prvi prehod. Nato je treba enakovredne spremembe zrcaliti v `de/book/` in `fr/book/`. Tudi drevo `en/` je treba očistiti, ker je videti le delno vzdrževano.

## 1. Spremembe globalnega skladišča### 1.1 Različice in metapodatki

Posodobite vse reference ravni vodnika iz XOOPS 2.5.x na XOOPS 2.7.0.

Zadevne datoteke:

- `README.md`
- `SUMMARY.md` — primarno živo TOC za korenski vodnik; navigacijske oznake in naslovi razdelkov se morajo ujemati z novimi naslovi poglavij in preimenovanim razdelkom Historical Upgrade Notes
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-XOOPS-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-XOOPS-installation.md`
- lokalizirano `de/book/*.md` in `fr/book/*.md`

Zahtevane spremembe:

- Spremenite `for XOOPS 2.5.7.x` v `for XOOPS 2.7.0`.
- Posodobite leto avtorskih pravic iz `2018` na `2026`.
- Zamenjajte stare reference XOOPS 2.5.x in 2.6.0, kjer opisujejo trenutno izdajo.
- Zamenjajte navodila za prenos iz obdobja SourceForge z izdajami GitHub:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Osvežitev povezave

`about-XOOPS-cms.md` in lokalizirane datoteke `10aboutxoops.md` še vedno kažejo na stari lokaciji GitHub 2.5.x in 2.6.0. Te povezave je treba posodobiti na trenutne lokacije projekta 2.7.x.

### 1.3 Osvežitev posnetka zaslona

Vsi posnetki zaslona, ki prikazujejo namestitveni program, uporabniški vmesnik za nadgradnjo, skrbniško nadzorno ploščo, izbirnik tem, izbirnik modulov in zaslone po namestitvi, so zastareli.Prizadeta drevesa sredstev:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

To je popolna osvežitev, ne delna. Namestitveni program 2.7.0 uporablja drugačno postavitev, ki temelji na Bootstrapu, in drugačno vizualno strukturo.

## 2. Poglavje 2: Uvod

Datoteka:

- `chapter-2-introduction.md`

### 2.1 Sistemske zahteve je treba prepisati

Trenutno poglavje pravi samo Apache, MySQL in PHP. XOOPS 2.7.0 ima eksplicitne minimume:

| Komponenta | 2.7.0 najmanj | 2.7.0 priporočilo |
| --- | --- | --- |
| PHP | 8.2.0 | 8,4+ |
| MySQL | 5.7.8 | 8,4+ |
| Spletni strežnik | Vsak strežnik, ki podpira zahtevano PHP | Priporočen Apache ali Nginx |

Opombe za dodajanje:

- IIS je še vedno naveden v namestitvenem programu, kot je mogoče, vendar sta priporočena primera Apache in Nginx.
- Opombe ob izdaji navajajo tudi združljivost z MySQL 9.0.

### 2.2 Dodajte obvezni in priporočeni kontrolni seznam razširitev PHP

Namestitveni program 2.7.0 zdaj loči stroge zahteve od priporočenih razširitev.

Zahtevana preverjanja, ki jih prikaže namestitveni program:

- MySQLi
- Seja
- PCRE
- filter
- `file_uploads`
- informacije o datoteki

Priporočene razširitve:

- mbstring
- medn
- ikonv
- xml
- zlib
- gd
- exif
- kodri

### 2.3 Odstranite navodila za kontrolno vsoto

Trenutni korak 5 opisuje `checksum.php` in `checksum.mdi`. Te datoteke niso del XOOPS 2.7.0.Akcija:

- Popolnoma odstranite razdelek za preverjanje kontrolne vsote.

### 2.4 Posodobite paket in navodila za nalaganje

Ohranite opis postavitve paketa `docs/`, `extras/`, `htdocs/`, `upgrade/`, vendar posodobite besedilo za nalaganje in pripravo, da bo odražalo trenutna pričakovanja o zapisljivi poti:

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

Vodnik trenutno to podcenjuje.

### 2.5 Zamenjaj jezik SourceForge translation/download

Trenutno besedilo še vedno pravi, da obiščete XOOPS na SourceForge za druge jezikovne pakete. To je treba nadomestiti s trenutnimi navodili za prenos project/community.

## 3. Poglavje 3: Preverjanje konfiguracije strežnika

Datoteka:

- `chapter-3-server-configuration-check.md`

Zahtevane spremembe:

- Prepišite opis strani okoli trenutne postavitve dveh blokov:
  - Zahteve
  - Priporočene razširitve
- Zamenjajte stari posnetek zaslona.
- Izrecno dokumentirajte zgoraj navedena preverjanja zahtev.## 4. Poglavje 4: Uberite pravo pot

Datoteka:

- `chapter-4-take-the-right-path.md`

Zahtevane spremembe:

- Dodajte novo polje `Cookie Domain`.
- Posodobite imena in opise polj poti, da se ujemajo z 2.7.0:
  - XOOPS Korenska pot
  - XOOPS Podatkovna pot
  - XOOPS Knjižnična pot
  - XOOPS URL
  - Domena piškotkov
- Dodajte opombo, da spreminjanje poti knjižnice zdaj zahteva veljaven samodejni nalagalnik Composer na `vendor/autoload.php`.

To je resnično preverjanje združljivosti v 2.7.0 in mora biti jasno dokumentirano. Trenutni vodnik sploh ne omenja skladatelja.

## 5. Poglavje 5: Povezave z bazo podatkov

Datoteka:

- `chapter-5-database-connections.md`

Zahtevane spremembe:

- Ohranite izjavo, da je podprt samo MySQL.
- Posodobite razdelek konfiguracije baze podatkov, da odraža:
  - privzeti nabor znakov je zdaj `utf8mb4`
  - izbira primerjanja se dinamično posodablja, ko se spremeni nabor znakov
- Zamenjajte posnetke zaslona za povezavo z bazo podatkov in konfiguracijske strani.

Trenutno besedilo, ki pravi, da nabor znakov in primerjanje ne potrebujeta pozornosti, je prešibko za 2.7.0. Omeniti je treba vsaj novo privzeto `utf8mb4` in dinamični izbirnik primerjanja.

## 6. Poglavje 6: Končna konfiguracija sistema

Datoteka:

- `chapter-6-final-system-configuration.md`### 6.1 Spremenjene ustvarjene konfiguracijske datoteke

Vodič trenutno pravi, da namestitveni program piše `mainfile.php` in `secure.php`.

V 2.7.0 namesti tudi konfiguracijske datoteke v `xoops_data/configs/`, vključno z:

- `xoopsconfig.php`
- konfiguracijske datoteke captcha
- konfiguracijske datoteke textsanitizerja

### 6.2 Obstoječe konfiguracijske datoteke v `xoops_data/configs/` niso prepisane

Obnašanje brez prepisovanja je **obseg**, ne globalno. Dve različni poti kode v `page_configsave.php` za pisanje konfiguracijskih datotek:

- `writeConfigurationFile()` (priklican v vrstici 59 in 66) **vedno** regenerira `xoops_data/data/secure.php` in `mainfile.php` iz vnosa čarovnika. Ni preverjanja obstoja; obstoječa kopija je zamenjana.
- `copyConfigDistFiles()` (priklican v vrstici 62, definiran v vrstici 317) samo kopira datoteke `xoops_data/configs/` (`xoopsconfig.php`, konfiguracije captcha, konfiguracije razčiščevalnika besedil) **če cilj še ne obstaja**.

Ponovno pisanje poglavja mora jasno odražati obe vedenji:

- Za `mainfile.php` in `secure.php`: opozorilo, da bodo vsa ročna urejanja teh datotek ob ponovnem zagonu namestitvenega programa prepisana.
- Za datoteke `xoops_data/configs/`: pojasnite, da se lokalne prilagoditve ohranijo med ponovnimi zagoni in nadgradnjami ter da obnovitev poslanih privzetih vrednosti zahteva brisanje datoteke in ponovni zagon (ali ročno kopiranje ustrezne `.dist.php`).Ne posplošujte "obstoječe datoteke so ohranjene" v vseh konfiguracijskih datotekah, ki jih je napisal namestitveni program - to je napačno in bi skrbnike zavedlo pri urejanju `mainfile.php` ali `secure.php`.

### 6.3 HTTPS in obratno obravnavanje proxy spremenjeno

Ustvarjeni `mainfile.php` zdaj podpira širše zaznavanje protokola, vključno z glavami povratnega posrednika. Vodnik bi moral to omeniti namesto samo neposrednega odkrivanja `http` ali `https`.

### 6.4 Štetje mize je napačno

Trenutno poglavje pravi, da novo mesto ustvari tabele `32`.

XOOPS 2.7.0 ustvari tabele `33`. Manjkajoča tabela je:

- `tokens`

Akcija:

- Posodobite število iz 32 na 33.
- Dodajte `tokens` na seznam tabel.

## 7. Poglavje 7: Skrbniške nastavitve

Datoteka:

- `chapter-7-administration-settings.md`

### 7.1 Opis uporabniškega vmesnika za geslo je zastarel

Namestitveni program še vedno vključuje ustvarjanje gesel, vendar zdaj vključuje tudi:

- merilnik moči gesla na osnovi zxcvbn
- oznake za vizualno moč
- 16-mestni generator in potek kopiranja

Posodobite besedilo in posnetke zaslona za opis trenutne plošče z gesli.

### 7.2 Preverjanje e-pošte je zdaj uveljavljeno

Skrbniški e-poštni naslov je potrjen z `FILTER_VALIDATE_EMAIL`. Poglavje mora omeniti, da so neveljavne e-poštne vrednosti zavrnjene.### 7.3 Razdelek licenčnega ključa je napačen

To je eden najpomembnejših popravkov dejstev.

Trenutni vodnik pravi:

- obstaja `License System Key`
- shranjena je v `/include/license.php`
- `/include/license.php` med namestitvijo mora biti zapisljiv

To ni več točno.

Kaj 2.7.0 dejansko naredi:

- namestitev zapiše licenčne podatke na `xoops_data/data/license.php`
- `htdocs/include/license.php` je zdaj le opuščen ovoj, ki naloži datoteko iz `XOOPS_VAR_PATH`
- staro besedilo o tem, da je `/include/license.php` zapisljivo, je treba odstraniti

Akcija:

- Prepišite ta razdelek, namesto da ga izbrišete.
- Posodobite pot od `/include/license.php` do `xoops_data/data/license.php`.

### 7.4 Seznam tem je zastarel

Trenutni vodnik se še vedno nanaša na Zetagenezo in starejši sklop tem iz obdobja 2,5.

Teme, ki so prisotne v XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Upoštevajte tudi:

- `xswatch4` je trenutna privzeta tema, ki so jo vstavili podatki namestitvenega programa.
- Zetageneza ni več del seznama pakiranih tem.

### 7.5 Seznam modulov je zastarel

Moduli v paketu 2.7.0:

- `system` — samodejno nameščen med koraki izpolnjevanja tabele/vstavljanja podatkov. Vedno prisoten, nikoli viden v izbirniku.
- `debugbar` — možnost izbire v koraku namestitve.
- `pm` — možnost izbire v koraku namestitve.
- `profile` — možnost izbire v koraku namestitve.
- `protector` — možnost izbire v koraku namestitve.Pomembno: stran z namestitvenim programom modulov (`htdocs/install/page_moduleinstaller.php`) sestavi svoj seznam kandidatov s ponavljanjem `XoopsLists::getModulesList()` in **filtriranjem vsega, kar je že v tabeli modulov** (vrstice 95-102 zbirajo `$listed_mods`; vrstica 116 preskoči kateri koli imenik na tem seznamu). Ker je `system` nameščen pred izvajanjem tega koraka, se nikoli ne prikaže kot potrditveno polje.

Potrebne spremembe vodnika:

- Nehajte govoriti, da obstajajo samo trije povezani moduli.
- Opišite korak namestitvenega programa tako, da prikazuje **štiri izbirne module** (`debugbar`, `pm`, `profile`, `protector`), ne pet.
- Dokumentirajte `system` ločeno kot vedno nameščen osnovni modul, ki se ne prikaže v izbirniku.
- Dodajte `debugbar` opisu paketnega modula kot novega v 2.7.0.
- Upoštevajte, da je privzeta predizbira modula namestitvenega programa zdaj prazna; moduli so na voljo za izbiro, vendar niso vnaprej preverjeni s konfiguracijo namestitvenega programa.

## 8. Poglavje 8: Pripravljeno na odhod

Datoteka:

- `chapter-8-ready-to-go.md`

### 8.1 Postopek čiščenja namestitve je treba prepisati

Trenutni vodnik pravi, da namestitveni program preimenuje namestitveno mapo v edinstveno ime.

To še vedno velja, vendar se je mehanizem spremenil:

- zunanji čistilni skript se ustvari v spletnem korenu
- zadnja stran sproži čiščenje prek AJAX
- namestitvena mapa se preimenuje v `install_remove_<unique suffix>`
- nadomestna možnost na `cleanup.php` še vedno obstajaAkcija:

- Posodobite razlago.
- Naj bodo navodila za uporabnika preprosta: po namestitvi izbrišite preimenovani namestitveni imenik.

### 8.2 Sklici na dodatke skrbniške nadzorne plošče so zastareli

Osmo poglavje bralce še vedno usmerja k stari skrbniški izkušnji iz obdobja Oxygen. To mora biti usklajeno s trenutnimi skrbniškimi temami:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 Navodila za urejanje poti po namestitvi je treba popraviti

Trenutno besedilo bralcem sporoča, naj posodobijo `secure.php` z definicijami poti. V 2.7.0 so te konstante poti definirane v `mainfile.php`, medtem ko `secure.php` hrani varne podatke. Primer bloka v tem poglavju je treba ustrezno popraviti.

### 8.4 Treba je dodati produkcijske nastavitve

Priročnik mora izrecno omeniti privzete proizvodne nastavitve, ki so zdaj prisotne v `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` naj ostane `false`
- `XOOPS_DEBUG` naj ostane `false`

## 9. Poglavje 9: Nadgradnja obstoječe namestitve XOOPS

Datoteka:

- `chapter-9-upgrade-existing-XOOPS-installation.md`

To poglavje zahteva največji prepis.

### 9.1 Dodajte obvezni korak pred tiskom Smarty 4

XOOPS Potek nadgradnje 2.7.0 zdaj vsili postopek preverjanja pred tiskom pred zaključkom nadgradnje.

Nov zahtevan tok:1. Kopirajte imenik `upgrade/` v koren mesta.
2. Zaženite `/upgrade/preflight.php`.
3. Preglejte `/themes/` in `/modules/` za staro sintakso Smarty.
4. Po potrebi uporabite izbirni način popravila.
5. Ponovno zaženite, dokler ni čisto.
6. Nadaljujte v `/upgrade/`.

Trenutno poglavje tega sploh ne omenja, zaradi česar ni združljivo z navodili 2.7.0.

### 9.2 Zamenjajte pripoved o združevanju ročne različice 2.5.2

Trenutno poglavje še vedno opisuje ročno nadgradnjo v slogu 2.5.2 z združitvami ogrodja, opombami AltSys in ročno upravljanim prestrukturiranjem datotek. To je treba nadomestiti z dejanskim zaporedjem nadgradenj 2.7.x iz `release_notes.txt` in `upgrade/README.md`.

Priporočen oris poglavja:

1. Varnostno kopirajte datoteke in bazo podatkov.
2. Izklopite spletno mesto.
3. Kopirajte `htdocs/` čez živi koren.
4. Kopirajte `htdocs/xoops_lib` v pot aktivne knjižnice.
5. Kopirajte `htdocs/xoops_data` v aktivno podatkovno pot.
6. Kopirajte `upgrade/` v spletni koren.
7. Zaženite `preflight.php`.
8. Zaženite `/upgrade/`.
9. Izpolnite pozive posodobitve.
10. Posodobite modul `system`.
11. Posodobite `pm`, `profile` in `protector`, če so nameščeni.
12. Izbriši `upgrade/`.
13. Ponovno vklopite spletno mesto.

### 9.3 Dokumentirajte prave spremembe nadgradnje 2.7.0

Posodobitelj za 2.7.0 vključuje vsaj te konkretne spremembe:- ustvari tabelo `tokens`
- razširite `bannerclient.passwd` za sodobne zgoščene vrednosti gesel
- dodajte prednostne nastavitve sejnih piškotkov
- odstranite zastarele imenike v paketu

Priročniku ni treba izpostaviti vseh podrobnosti izvedbe, vendar ne bi smel namigovati, da je nadgradnja le kopija datoteke in posodobitev modula.

## 10. Zgodovinske strani za nadgradnjo

Datoteke:

- `upgrading-from-XOOPS-2.4.5-easy-way.md`
- `upgrading-from-XOOPS-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-XOOPS-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Stanje:** strukturna odločitev je že razrešena — koren `SUMMARY.md` jih premakne v namenski razdelek **Zgodovinske opombe o nadgradnji** in vsaka datoteka vsebuje oblaček »Zgodovinska referenca«, ki bralce usmerja na 9. poglavje za nadgradnje 2.7.0. Niso več vodilo za prvorazredno nadgradnjo.

**Preostalo delo (samo doslednost):**

- Prepričajte se, da jih `README.md` (root) navaja pod istim naslovom »Zgodovinske opombe o nadgradnjah«, ne pod splošnim naslovom »Nadgradnje«.
- Zrcaljenje enake ločitve v `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` in `en/SUMMARY.md`.
- Zagotovite, da ima vsaka zgodovinska stran nadgradnje (koren in lokalizirane kopije `de/book/upg*.md` / `fr/book/upg*.md`) oblaček zastarele vsebine, ki se povezuje nazaj na 9. poglavje.## 11. Dodatek 1: Admin GUI

Datoteka:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Ta dodatek je vezan na skrbnika Oxygen GUI in ga je treba prepisati.

Zahtevane spremembe:

- zamenjajte vse reference kisika
- zamenjajte stare posnetke zaslona icon/menu
- dokumentirajte trenutne skrbniške teme:
  - privzeto
  - temno
  - moderno
  - prehod
- omenite trenutne skrbniške zmožnosti 2.7.0, prikazane v opombah ob izdaji:
  - zmožnost preobremenitve predloge v temah sistemskega skrbnika
  - posodobljen nabor skrbniških tem

## 12. Dodatek 2: Nalaganje XOOPS prek FTP

Datoteka:

- `appendix-2-uploading-XOOPS-via-ftp.md`

Zahtevane spremembe:

- odstranite predpostavke, specifične za HostGator in cPanel
- posodobiti besedilo za nalaganje datotek
- upoštevajte, da `xoops_lib` zdaj vključuje odvisnosti skladatelja, zato so naloženi podatki večji in jih ne bi smeli selektivno obrezovati

## 13. Dodatek 5: Varnost

Datoteka:

- `appendix-5-increase-security-of-your-XOOPS-installation.md`

Zahtevane spremembe:

- popolnoma odstranite razpravo `register_globals`
- odstranite zastareli jezik vstopnice gostitelja
- pravilno besedilo dovoljenj od `404` do `0444`, kjer je predvideno samo za branje
- posodobite razpravo `mainfile.php` in `secure.php`, da ustrezata postavitvi 2.7.0
- dodajte nov stalni kontekst, povezan z varnostjo domene piškotkov:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- dodajte proizvodne smernice za:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`## 14. Vpliv medjezikovnega vzdrževanja

Ko so angleške datoteke na korenski ravni popravljene, so potrebne enakovredne posodobitve v:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

Tudi drevo `en/` je treba pregledati, ker vsebuje ločen nabor README in sredstev, vendar se zdi, da ima samo delno drevo `book/`.

## 15. Prednostni vrstni red

### Kritično pred izdajo

1. Posodobite reference repo/version na 2.7.0.
2. Ponovno napišite 9. poglavje glede na dejanski potek nadgradnje 2.7.0 in Smarty 4 pred tiskom.
3. Posodobite sistemske zahteve na PHP 8.2+ in MySQL 5.7.8+.
4. Popravite pot do datoteke licenčnega ključa v poglavju 7.
5. Popravite popise tem in modulov.
6. Popravite število tabele v 6. poglavju z 32 na 33.

### Pomembno za natančnost

7. Ponovno napišite navodila za zapisljivo pot.
8. V nastavitev poti dodajte zahtevo za samodejni nalagalnik Composer.
9. Posodobite navodila za nabor znakov baze podatkov na `utf8mb4`.
10. Popravite navodila za urejanje poti v poglavju 8, tako da so konstante dokumentirane v pravi datoteki.
11. Odstranite navodila za kontrolno vsoto.
12. Odstranite `register_globals` in druga mrtva navodila PHP.

### Čiščenje kakovosti izdaje

13. Zamenjajte vse posnetke zaslona namestitvenega programa in skrbnika.
14. Premaknite zgodovinske strani nadgradnje iz glavnega toka.
15. Sinhronizirajte nemško in francosko kopijo po popravku angleščine.
16. Očistite zastarele povezave in podvojene vrstice README.