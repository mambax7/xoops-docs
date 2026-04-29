---
title: "XOOPS 2.7.0 Compatibiliteitsoverzicht voor deze handleiding"
---
Dit document vermeldt de wijzigingen die nodig zijn in deze repository, zodat de installatiehandleiding overeenkomt met XOOPS 2.7.0.

Beoordelingsbasis:

- Huidige gidsrepository: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- XOOPS 2.7.0 kern beoordeeld op: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Primaire 2.7.0-bronnen gecontroleerd:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  -`htdocs/install/class/pathcontroller.php`
  -`htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Reikwijdte

Deze repository bevat momenteel:

- Engelse Markdown-bestanden op rootniveau die als hoofdgids worden gebruikt.
- Een gedeeltelijke `en/`-kopie.
- Volledige `de/` en `fr/` boekbomen met hun eigen activa.

De bestanden op rootniveau hebben de eerste doorgang nodig. Daarna moeten gelijkwaardige wijzigingen worden gespiegeld in `de/book/` en `fr/book/`. De `en/`-structuur moet ook worden opgeschoond, omdat deze slechts gedeeltelijk onderhouden lijkt te zijn.

## 1. Algemene wijzigingen in de opslagplaats

### 1.1 Versiebeheer en metadata

Update alle referenties op gidsniveau van XOOPS 2.5.x naar XOOPS 2.7.0.

Betrokken bestanden:

- `README.md`
- `SUMMARY.md` — primaire live TOC voor de rootgids; navigatielabels en sectiekoppen moeten overeenkomen met de nieuwe hoofdstuktitels en de hernoemde sectie Historische upgrade-opmerkingen
-`en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
-`fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- gelokaliseerde `de/book/*.md` en `fr/book/*.md`

Vereiste wijzigingen:

- Wijzig `for XOOPS 2.5.7.x` in `for XOOPS 2.7.0`.
- Update het copyrightjaar van `2018` naar `2026`.
- Vervang oude XOOPS 2.5.x- en 2.6.0-referenties waar ze de huidige release beschrijven.
- Vervang de downloadrichtlijnen uit het SourceForge-tijdperk door GitHub-releases:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Link vernieuwen

`about-xoops-cms.md` en gelokaliseerde `10aboutxoops.md`-bestanden verwijzen nog steeds naar oude 2.5.x- en 2.6.0 GitHub-locaties. Deze links moeten worden bijgewerkt naar de huidige 2.7.x-projectlocaties.

### 1.3 Schermafbeelding vernieuwen

Alle schermafbeeldingen die het installatieprogramma, de upgrade-UI, het beheerdersdashboard, de themakiezer, de modulekiezer en de post-installatieschermen tonen, zijn verouderd.

Betrokken activabomen:

- `.gitbook/assets/`
-`en/assets/`
- `de/assets/`
- `fr/assets/`

Dit is een volledige vernieuwing, geen gedeeltelijke vernieuwing. Het 2.7.0-installatieprogramma gebruikt een andere op Bootstrap gebaseerde lay-out en een andere visuele structuur.

## 2. Hoofdstuk 2: Inleiding

Bestand:

- `chapter-2-introduction.md`

### 2.1 Systeemvereisten moeten herschreven worden

In het huidige hoofdstuk staan alleen Apache, MySQL en PHP. XOOPS 2.7.0 heeft expliciete minima:

| Onderdeel | Minimaal 2.7.0 | 2.7.0 aanbeveling |
| --- | --- | --- |
| PHP | 8.2.0 | 8,4+ |
| MySQL | 5.7.8 | 8,4+ |
| Webserver | Elke server die de vereiste PHP | ondersteunt Apache of Nginx aanbevolen |

Opmerkingen om toe te voegen:

- IIS wordt nog steeds als mogelijk vermeld in het installatieprogramma, maar Apache en Nginx zijn de aanbevolen voorbeelden.
- In de releaseopmerkingen wordt ook melding gemaakt van de compatibiliteit met MySQL 9.0.

### 2.2 Voeg de vereiste en aanbevolen PHP-extensiechecklist toe

Het installatieprogramma van 2.7.0 scheidt nu harde vereisten van aanbevolen extensies.

Vereiste controles getoond door de installateur:

- MySQLi
- Sessie
- PCRE
- filteren
-`file_uploads`
- bestandsinfo

Aanbevolen extensies:

- mbstring
- intl
- iconv
-xml
- zlib
- gd
- exif
- krullen

### 2.3 Controlesominstructies verwijderen

In huidige stap 5 worden `checksum.php` en `checksum.mdi` beschreven. Deze bestanden maken geen deel uit van XOOPS 2.7.0.

Actie:

- Verwijder het controlesomverificatiegedeelte volledig.

### 2.4 Update pakket en uploadinstructies

Behoud de beschrijving van de pakketindeling `docs/`, `extras/`, `htdocs/`, `upgrade/`, maar werk de upload- en voorbereidingstekst bij om de huidige verwachtingen van het schrijfbare pad weer te geven:- `mainfile.php`
-`uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
-`xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

De gids onderschat dit momenteel.

### 2.5 Vervang de SourceForge-vertaal-/downloadtaal

De huidige tekst zegt nog steeds dat je XOOPS op SourceForge moet bezoeken voor andere taalpakketten. Dat moet worden vervangen door de huidige downloadrichtlijnen voor projecten/gemeenschappen.

## 3. Hoofdstuk 3: Controle van de serverconfiguratie

Bestand:

-`chapter-3-server-configuration-check.md`

Vereiste wijzigingen:

- Herschrijf de paginabeschrijving rond de huidige lay-out met twee blokken:
  - Vereisten
  - Aanbevolen extensies
- Vervang de oude schermafbeelding.
- Documenteer de hierboven genoemde vereistecontroles expliciet.

## 4. Hoofdstuk 4: Neem het juiste pad

Bestand:

- `chapter-4-take-the-right-path.md`

Vereiste wijzigingen:

- Voeg het nieuwe veld `Cookie Domain` toe.
- Update de namen en beschrijvingen van de padvelden zodat deze overeenkomen met 2.7.0:
  - XOOPS Hoofdpad
  - XOOPS Gegevenspad
  - XOOPS Bibliotheekpad
  - XOOPS URL
  - Cookie-domein
- Voeg een opmerking toe dat het wijzigen van het bibliotheekpad nu een geldige Composer-autoloader op `vendor/autoload.php` vereist.

Dit is een echte compatibiliteitscontrole in 2.7.0 en zou duidelijk gedocumenteerd moeten worden. De huidige gids vermeldt Composer helemaal niet.

## 5. Hoofdstuk 5: Databaseverbindingen

Bestand:

- `chapter-5-database-connections.md`

Vereiste wijzigingen:

- Houd de verklaring aan dat alleen MySQL wordt ondersteund.
- Werk de databaseconfiguratiesectie bij om het volgende weer te geven:
  - standaard tekenset is nu `utf8mb4`
  - Sorteringselectie wordt dynamisch bijgewerkt wanneer de tekenset verandert
- Vervang schermafbeeldingen voor zowel databaseverbinding als configuratiepagina's.

De huidige tekst die zegt dat tekenset en sortering geen aandacht behoeven, is te zwak voor 2.7.0. Het zou op zijn minst de nieuwe `utf8mb4`-standaard en de dynamische sorteerkiezer moeten vermelden.

## 6. Hoofdstuk 6: Laatste systeemconfiguratie

Bestand:

- `chapter-6-final-system-configuration.md`

### 6.1 Gegenereerde configuratiebestanden gewijzigd

De handleiding zegt momenteel dat het installatieprogramma `mainfile.php` en `secure.php` schrijft.

In 2.7.0 worden ook configuratiebestanden geïnstalleerd in `xoops_data/configs/`, waaronder:

-`xoopsconfig.php`
- captcha-configuratiebestanden
- textsanitizer-configuratiebestanden

### 6.2 Bestaande configuratiebestanden in `xoops_data/configs/` worden niet overschreven

Het niet-overschrijfgedrag is **scoped**, niet globaal. Twee verschillende codepaden in `page_configsave.php` schrijven configuratiebestanden:

- `writeConfigurationFile()` (aangeroepen op regels 59 en 66) **altijd** genereert `xoops_data/data/secure.php` en `mainfile.php` vanuit de wizardinvoer. Er is geen bestaanscontrole; een bestaand exemplaar wordt vervangen.
- `copyConfigDistFiles()` (aangeroepen op regel 62, gedefinieerd op regel 317) kopieert alleen de `xoops_data/configs/`-bestanden (`xoopsconfig.php`, de captcha-configuraties, de textsanitizer-configuraties) **als de bestemming nog niet bestaat**.

De herschrijving van het hoofdstuk moet beide gedragingen duidelijk weerspiegelen:

- Voor `mainfile.php` en `secure.php`: waarschuwing dat eventuele handmatige bewerkingen aan deze bestanden worden overschreven wanneer het installatieprogramma opnieuw wordt uitgevoerd.
- Voor de `xoops_data/configs/`-bestanden: leg uit dat lokale aanpassingen behouden blijven bij herhalingen en upgrades, en dat het herstellen van de fabrieksinstellingen vereist dat het bestand wordt verwijderd en opnieuw wordt uitgevoerd (of dat de bijbehorende `.dist.php` met de hand wordt gekopieerd).

Generaliseer niet dat "bestaande bestanden behouden blijven" over alle door het installatieprogramma geschreven configuratiebestanden. Dat is onjuist en zou beheerders die `mainfile.php` of `secure.php` bewerken, misleiden.

### 6.3 HTTPS en reverse proxy-afhandeling gewijzigd

De gegenereerde `mainfile.php` ondersteunt nu bredere protocoldetectie, inclusief reverse-proxy-headers. De gids zou dit moeten vermelden in plaats van alleen directe `http`- of `https`-detectie te impliceren.

### 6.4 Tabeltelling is verkeerd

In het huidige hoofdstuk staat dat een nieuwe site `32`-tabellen maakt.

XOOPS 2.7.0 maakt `33`-tabellen. De ontbrekende tabel is:

- `tokens`

Actie:

- Werk de telling bij van 32 naar 33.
- Voeg `tokens` toe aan de tabellijst.## 7. Hoofdstuk 7: Beheerinstellingen

Bestand:

- `chapter-7-administration-settings.md`

### 7.1 Wachtwoord-UI-beschrijving is verouderd

Het installatieprogramma omvat nog steeds het genereren van wachtwoorden, maar bevat nu ook:

- Op zxcvbn gebaseerde wachtwoordsterktemeter
- visuele sterktelabels
- Generator en kopieerstroom van 16 tekens

Werk de tekst en schermafbeeldingen bij om het huidige wachtwoordpaneel te beschrijven.

### 7.2 E-mailvalidatie is nu afgedwongen

Het beheerdersmailadres is gevalideerd met `FILTER_VALIDATE_EMAIL`. Het hoofdstuk zou moeten vermelden dat ongeldige e-mailwaarden worden afgewezen.

### 7.3 Licentiesleutelgedeelte is verkeerd

Dit is een van de belangrijkste feitelijke oplossingen.

De huidige gids zegt:

- er is een `License System Key`
- het wordt opgeslagen in `/include/license.php`
- `/include/license.php` moet tijdens de installatie beschrijfbaar zijn

Dat is niet langer accuraat.

Wat 2.7.0 eigenlijk doet:

- installatie schrijft de licentiegegevens naar `xoops_data/data/license.php`
- `htdocs/include/license.php` is nu slechts een verouderde wrapper die het bestand uit `XOOPS_VAR_PATH` laadt
- de oude formulering over het beschrijfbaar maken van `/include/license.php` moet worden verwijderd

Actie:

- Herschrijf deze sectie in plaats van deze te verwijderen.
- Werk het pad bij van `/include/license.php` naar `xoops_data/data/license.php`.

### 7.4 Themalijst is verouderd

De huidige gids verwijst nog steeds naar Zetagenese en de oudere themaset uit het 2,5-tijdperk.

Thema's aanwezig in XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Let ook op:

- `xswatch4` is het huidige standaardthema dat is ingevoegd door installatiegegevens.
- Zetagenese maakt niet langer deel uit van de pakketthemalijst.

### 7.5 Modulelijst is verouderd

Modules aanwezig in het 2.7.0-pakket:

- `system` — automatisch geïnstalleerd tijdens de stappen voor het invullen van tabellen/gegevens invoegen. Altijd aanwezig, nooit zichtbaar in de picker.
- `debugbar` — selecteerbaar in de installatiestap.
- `pm` — selecteerbaar in de installatiestap.
- `profile` — selecteerbaar in de installatiestap.
- `protector` — selecteerbaar in de installatiestap.

Belangrijk: de module-installatiepagina (`htdocs/install/page_moduleinstaller.php`) bouwt zijn kandidatenlijst op door `XoopsLists::getModulesList()` te herhalen en **alles uit de modulestabel te filteren** (regels 95-102 verzamelen `$listed_mods`; regel 116 slaat elke directory in die lijst over). Omdat `system` wordt geïnstalleerd voordat deze stap wordt uitgevoerd, wordt dit nooit als een selectievakje weergegeven.

Gidswijzigingen nodig:

- Stop met te zeggen dat er slechts drie gebundelde modules zijn.
- Beschrijf de installatiestap als volgt: **vier selecteerbare modules** (`debugbar`, `pm`, `profile`, `protector`), niet vijf.
- Documenteer `system` afzonderlijk als de altijd geïnstalleerde kernmodule die niet in de kiezer verschijnt.
- Voeg `debugbar` toe aan de beschrijving van de gebundelde module als nieuw in 2.7.0.
- Merk op dat de standaardmodulevoorselectie van de installateur nu leeg is; Er zijn modules beschikbaar waaruit u kunt kiezen, maar deze worden niet vooraf gecontroleerd door de installatieconfiguratie.

## 8. Hoofdstuk 8: Klaar voor gebruik

Bestand:

- `chapter-8-ready-to-go.md`

### 8.1 Het opschoonproces van de installatie moet opnieuw worden geschreven

De huidige handleiding zegt dat het installatieprogramma de installatiemap hernoemt naar een unieke naam.

Dat is in feite nog steeds waar, maar het mechanisme veranderde:

- er wordt een extern opschoonscript gemaakt in de webroot
- de laatste pagina activeert het opruimen via AJAX
- de installatiemap is hernoemd naar `install_remove_<unique suffix>`
- terugval naar `cleanup.php` bestaat nog steeds

Actie:

- Update de uitleg.
- Houd de gebruikersgerichte instructie eenvoudig: verwijder de hernoemde installatiemap na de installatie.

### 8.2 Bijlageverwijzingen naar het beheerdersdashboard zijn verouderd

Hoofdstuk 8 verwijst lezers nog steeds naar de oude admin-ervaring uit het Oxygen-tijdperk. Dat moet aansluiten bij de huidige beheerdersthema’s:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 Begeleiding voor het bewerken van paden na de installatie behoeft correctie

De huidige tekst vertelt lezers dat ze `secure.php` moeten bijwerken met paddefinities. In 2.7.0 zijn deze padconstanten gedefinieerd in `mainfile.php`, terwijl `secure.php` beveiligde gegevens bewaart. Het voorbeeldblok in dit hoofdstuk moet dienovereenkomstig worden gecorrigeerd.

### 8.4 Productie-instellingen moeten worden toegevoegdDe gids moet expliciet de productiestandaarden vermelden die nu aanwezig zijn in `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` moet `false` blijven
- `XOOPS_DEBUG` moet `false` blijven

## 9. Hoofdstuk 9: Bestaande XOOPS-installatie upgraden

Bestand:

- `chapter-9-upgrade-existing-xoops-installation.md`

Dit hoofdstuk vereist de grootste herschrijving.

### 9.1 Verplichte Smarty 4 preflight-stap toevoegen

XOOPS 2.7.0-upgradestroom forceert nu het preflight-proces voordat de upgrade is voltooid.

Nieuwe vereiste stroom:

1. Kopieer de map `upgrade/` naar de hoofdmap van de site.
2. Voer `/upgrade/preflight.php` uit.
3. Scan `/themes/` en `/modules/` op oude Smarty-syntaxis.
4. Gebruik waar nodig de optionele reparatiemodus.
5. Laat het apparaat opnieuw draaien totdat het schoon is.
6. Ga verder naar `/upgrade/`.

Het huidige hoofdstuk vermeldt dit helemaal niet, waardoor het incompatibel is met de richtlijnen van 2.7.0.

### 9.2 Vervang het handmatige samenvoegverhaal uit het 2.5.2-tijdperk

Het huidige hoofdstuk beschrijft nog steeds een handmatige upgrade in 2.5.2-stijl met samenvoegingen van het framework, AltSys-notities en handmatig beheerde bestandsherstructurering. Dat moet worden vervangen door de daadwerkelijke 2.7.x-upgradereeks van `release_notes.txt` en `upgrade/README.md`.

Aanbevolen hoofdstukoverzicht:

1. Maak een back-up van bestanden en database.
2. Schakel de site uit.
3. Kopieer `htdocs/` over de live root.
4. Kopieer `htdocs/xoops_lib` naar het actieve bibliotheekpad.
5. Kopieer `htdocs/xoops_data` naar het actieve gegevenspad.
6. Kopieer `upgrade/` naar de webroot.
7. Voer `preflight.php` uit.
8. Voer `/upgrade/` uit.
9. Voltooi de updateprompts.
10. Update de `system`-module.
11. Update `pm`, `profile` en `protector`, indien geïnstalleerd.
12. `upgrade/` verwijderen.
13. Schakel de site weer in.

### 9.3 Documenteer echte 2.7.0-upgradewijzigingen

De updater voor 2.7.0 bevat in ieder geval deze concrete wijzigingen:

- maak een `tokens`-tabel
- verbreed `bannerclient.passwd` voor moderne wachtwoord-hashes
- voeg voorkeursinstellingen voor sessiecookies toe
- verwijder verouderde gebundelde mappen

De handleiding hoeft niet elk implementatiedetail bloot te leggen, maar mag niet langer impliceren dat de upgrade slechts een bestandskopie plus module-update is.

## 10. Historische upgradepagina's

Bestanden:

-`upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
-`upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Status:** de structurele beslissing is al opgelost — de root `SUMMARY.md` verplaatst deze naar een speciale **Historische Upgrade-opmerkingen**-sectie, en elk bestand draagt een "Historische referentie"-aanroep die lezers verwijst naar Hoofdstuk 9 voor 2.7.0-upgrades. Het zijn niet langer eersteklas upgradebegeleidingen.

**Resterende werk (alleen consistentie):**

- Zorg ervoor dat `README.md` (root) deze vermeldt onder dezelfde kop 'Historische upgrade-opmerkingen', en niet onder de algemene kop 'Upgrades'.
- Spiegel dezelfde scheiding in `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` en `en/SUMMARY.md`.
- Zorg ervoor dat elke historische upgradepagina (root en de gelokaliseerde `de/book/upg*.md` / `fr/book/upg*.md`-kopieën) een callout met verouderde inhoud bevat die teruglinkt naar Hoofdstuk 9.

## 11. Bijlage 1: Beheerder GUI

Bestand:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Deze bijlage is gekoppeld aan de Oxygen-beheerder GUI en moet opnieuw worden geschreven.

Vereiste wijzigingen:

- vervang alle zuurstofreferenties
- vervang oude pictogram-/menuschermafbeeldingen
- documenteer de huidige admin-thema's:
  - standaard
  - donker
  - modern
  - overgang
- vermeld de huidige beheerdersmogelijkheden van 2.7.0 die worden genoemd in de release-opmerkingen:
  - Mogelijkheid tot overbelasting van sjablonen in systeembeheerthema's
  - bijgewerkte admin-themaset

## 12. Bijlage 2: XOOPS uploaden via FTP

Bestand:

- `appendix-2-uploading-xoops-via-ftp.md`

Vereiste wijzigingen:

- Verwijder HostGator-specifieke en cPanel-specifieke aannames
- moderniseer de formulering voor het uploaden van bestanden
- houd er rekening mee dat `xoops_lib` nu Composer-afhankelijkheden bevat, dus uploads zijn groter en mogen niet selectief worden bijgesneden

## 13. Bijlage 5: Beveiliging

Bestand:

-`appendix-5-increase-security-of-your-xoops-installation.md`

Vereiste wijzigingen:- verwijder de `register_globals`-discussie volledig
- verwijder verouderde host-tickettaal
- correcte machtigingstekst van `404` naar `0444` waar alleen-lezen is bedoeld
- update de discussie `mainfile.php` en `secure.php` zodat deze overeenkomt met de lay-out 2.7.0
- voeg de nieuwe cookie-domein beveiligingsgerelateerde constante context toe:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  -`XOOPS_COOKIE_DOMAIN`
- productiebegeleiding toevoegen voor:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Impact op onderhoud in meerdere talen

Nadat Engelse bestanden op rootniveau zijn gerepareerd, zijn gelijkwaardige updates nodig in:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

De `en/`-structuur moet ook worden beoordeeld omdat deze een afzonderlijke README- en activaset bevat, maar slechts een gedeeltelijke `book/`-structuur lijkt te hebben.

## 15. Prioriteitsvolgorde

### Kritiek vóór release

1. Update repository-/versiereferenties naar 2.7.0.
2. Herschrijf hoofdstuk 9 rond de echte 2.7.0-upgradestroom en Smarty 4-preflight.
3. Update de systeemvereisten naar PHP 8.2+ en MySQL 5.7.8+.
4. Corrigeer het bestandspad van de Hoofdstuk 7-licentiesleutel.
5. Correcte thema- en module-inventarisaties.
6. Correcte hoofdstuk 6-tabeltelling van 32 naar 33.

### Belangrijk voor nauwkeurigheid

7. Herschrijf de schrijfpadbegeleiding.
8. Voeg de autoloadervereiste voor Composer toe aan de padinstellingen.
9. Update de richtlijnen voor databasetekensets naar `utf8mb4`.
10. Verbeter de richtlijnen voor het bewerken van paden in Hoofdstuk 8, zodat constanten in het juiste bestand worden gedocumenteerd.
11. Verwijder de controlesominstructies.
12. Verwijder `register_globals` en andere dode PHP-richtlijnen.

### Opschoning van releasekwaliteit

13. Vervang alle screenshots van het installatieprogramma en de beheerder.
14. Verplaats historische upgradepagina's uit de hoofdstroom.
15. Synchroniseer Duitse en Franse kopieën nadat het Engels is gecorrigeerd.
16. Ruim verouderde links en dubbele README-regels op.