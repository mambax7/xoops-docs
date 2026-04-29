---
title: "XOOPS 2.7.0 kompatibilitetsgennemgang til denne vejledning"
---

Dette dokument viser de nødvendige ændringer i dette lager, så installationsvejledningen matcher XOOPS 2.7.0.

Gennemgangsgrundlag:

- Nuværende guidelager: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- XOOPS 2.7.0 kerne gennemgået på: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Primære 2.7.0 kilder kontrolleret:
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

## Omfang

Denne repo indeholder i øjeblikket:

- Engelske Markdown-filer på rodniveau, der bruges som hovedguide.
- En delvis `en/` kopi.
- Fuld `de/` og `fr/` bogtræer med deres egne aktiver.

Filerne på rodniveau skal have det første gennemløb. Derefter skal tilsvarende ændringer spejles i `de/book/` og `fr/book/`. `en/` træet skal også renses, fordi det kun ser ud til at være delvist vedligeholdt.

## 1. Globale lagerændringer

### 1.1 Versionering og metadata

Opdater alle referencer på guideniveau fra XOOPS 2.5.x til XOOPS 2.7.0.

Berørte filer:

- `README.md`
- `SUMMARY.md` — primær live TOC for rodguiden; navigationsetiketter og sektionsoverskrifter skal matche de nye kapiteltitler og den omdøbte sektion med historiske opgraderingsnoter
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
- lokaliseret `de/book/*.md` og `fr/book/*.md`

Påkrævede ændringer:

- Skift `for XOOPS 2.5.7.x` til `for XOOPS 2.7.0`.
- Opdater copyright-året fra `2018` til `2026`.
- Erstat gamle XOOPS 2.5.x og 2.6.0 referencer, hvor de beskriver den aktuelle udgivelse.
- Erstat downloadvejledning fra SourceForge-æraen med GitHub-udgivelser:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Link opdatering

`about-xoops-cms.md` og lokaliserede `10aboutxoops.md` filer peger stadig på gamle 2.5.x og 2.6.0 GitHub placeringer. Disse links skal opdateres til de nuværende 2.7.x-projektplaceringer.

### 1.3 Opdatering af skærmbillede

Alle skærmbilleder, der viser installationsprogrammet, opgraderingsbrugergrænsefladen, admin-dashboardet, temavælgeren, modulvælgeren og efterinstallationsskærmene er forældede.

Aktivtræer påvirket:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Dette er en fuld opdatering, ikke en delvis. 2.7.0-installationsprogrammet bruger et andet Bootstrap-baseret layout og en anden visuel struktur.

## 2. Kapitel 2: Introduktion

Fil:

- `chapter-2-introduction.md`

### 2.1 Systemkrav skal omskrives

Det nuværende kapitel siger kun Apache, MySQL og PHP. XOOPS 2.7.0 har eksplicitte minimumskrav:

| Komponent | 2.7.0 minimum | 2.7.0 anbefaling |
| --- | --- | --- |
| PHP | 8.2.0 | 8,4+ |
| MySQL | 5.7.8 | 8,4+ |
| Webserver | Enhver server, der understøtter påkrævet PHP | Apache eller Nginx anbefales |

Bemærkninger at tilføje:

- IIS er stadig angivet i installationsprogrammet som muligt, men Apache og Nginx er de anbefalede eksempler.
- Udgivelsesbemærkninger kalder også MySQL 9.0-kompatibilitet.

### 2.2 Tilføj påkrævet og anbefalet tjekliste for PHP-udvidelser

Installationsprogrammet 2.7.0 adskiller nu hårde krav fra anbefalede udvidelser.

Nødvendige kontroller vist af installatøren:

- MySQLi
- Session
- PCRE
- filter
- `file_uploads`
- filoplysninger

Anbefalede udvidelser:

- mbstring
- intl
- ikonv
- xml
- zlib
- gd
- exif
- krølle

### 2.3 Fjern kontrolsum instruktioner

Aktuelt trin 5 beskriver `checksum.php` og `checksum.mdi`. Disse filer er ikke en del af XOOPS 2.7.0.

Handling:

- Fjern kontrolsumsbekræftelsessektionen helt.

### 2.4 Opdater pakke og upload instruktioner

Behold `docs/`, `extras/`, `htdocs/`, `upgrade/` pakkelayoutbeskrivelsen, men opdater upload- og forberedelsesteksten, så den afspejler de nuværende forventninger til skrivbar sti:- `mainfile.php`
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

Vejledningen underdriver i øjeblikket dette.

### 2.5 Erstat SourceForge oversættelses-/downloadsprog

Den aktuelle tekst siger stadig, at du skal besøge XOOPS på SourceForge for andre sprogpakker. Det skal erstattes med den nuværende vejledning til download af projekt/samfund.

## 3. Kapitel 3: Tjek serverkonfiguration

Fil:

- `chapter-3-server-configuration-check.md`

Påkrævede ændringer:

- Omskriv sidebeskrivelsen omkring det nuværende to-blok layout:
  - Krav
  - Anbefalede udvidelser
- Erstat det gamle skærmbillede.
- Dokumenter eksplicit kravkontrollen ovenfor.

## 4. Kapitel 4: Tag den rigtige vej

Fil:

- `chapter-4-take-the-right-path.md`

Påkrævede ændringer:

- Tilføj det nye `Cookie Domain` felt.
- Opdater navnene og beskrivelserne af stifelterne til at matche 2.7.0:
  - XOOPS rodsti
  - XOOPS Datasti
  - XOOPS bibliotekssti
  - XOOPS URL
  - Cookie-domæne
- Tilføj en bemærkning om, at ændring af biblioteksstien nu kræver en gyldig Composer autoloader på `vendor/autoload.php`.

Dette er et ægte kompatibilitetstjek i 2.7.0 og bør dokumenteres klart. Den nuværende guide nævner slet ikke Composer.

## 5. Kapitel 5: Databaseforbindelser

Fil:

- `chapter-5-database-connections.md`

Påkrævede ændringer:

- Behold erklæringen om, at kun MySQL understøttes.
- Opdater databasekonfigurationsafsnittet for at afspejle:
  - standardtegnsæt er nu `utf8mb4`
  - Sorteringsvalg opdateres dynamisk, når tegnsæt ændres
- Erstat skærmbilleder for både databaseforbindelse og konfigurationssider.

Den aktuelle tekst, der siger tegnsæt og sortering behøver ikke opmærksomhed, er for svag til 2.7.0. Det bør i det mindste nævne den nye `utf8mb4` standard og den dynamiske sorteringsvælger.

## 6. Kapitel 6: Endelig systemkonfiguration

Fil:

- `chapter-6-final-system-configuration.md`

### 6.1 Genererede konfigurationsfiler ændret

Vejledningen siger i øjeblikket, at installationsprogrammet skriver `mainfile.php` og `secure.php`.

I 2.7.0 installerer den også konfigurationsfiler i `xoops_data/configs/`, herunder:

- `xoopsconfig.php`
- captcha-konfigurationsfiler
- Textsanitizer-konfigurationsfiler

### 6.2 Eksisterende konfigurationsfiler i `xoops_data/configs/` er ikke overskrevet

Den ikke-overskrivende adfærd er **omfang**, ikke global. To forskellige kodestier i `page_configsave.php` skrivekonfigurationsfiler:

- `writeConfigurationFile()` (kaldet på linje 59 og 66) **altid** regenererer `xoops_data/data/secure.php` og `mainfile.php` fra guidens input. Der er ingen eksistenskontrol; en eksisterende kopi udskiftes.
- `copyConfigDistFiles()` (kaldet på linje 62, defineret på linje 317) kopierer kun `xoops_data/configs/`-filerne (`xoopsconfig.php`, captcha-konfigurationerne, textsanitizer-konfigurationerne) **hvis destinationen ikke allerede eksisterer**.

Kapitelomskrivningen skal afspejle begge adfærd klart:

- For `mainfile.php` og `secure.php`: advarer om, at enhver håndredigering af disse filer vil blive overskrevet, når installationsprogrammet køres igen.
- For `xoops_data/configs/`-filerne: forklar, at lokale tilpasninger bevares på tværs af genkørsler og opgraderinger, og at gendannelse af afsendte standardindstillinger kræver sletning af filen og genkøring (eller kopiering af den tilsvarende `.dist.php` manuelt).

Undlad at generalisere "eksisterende filer er bevaret" på tværs af alle installatør-skrevne konfigurationsfiler - det er forkert og vil vildlede administratorer, der redigerer `mainfile.php` eller `secure.php`.

### 6.3 HTTPS og omvendt proxy-håndtering ændret

Den genererede `mainfile.php` understøtter nu bredere protokoldetektion, herunder omvendt proxy-headere. Vejledningen bør nævne dette i stedet for kun at antyde direkte `http` eller `https` detektion.

### 6.4 Tabeltælling er forkert

Det nuværende kapitel siger, at et nyt websted opretter `32`-tabeller.

XOOPS 2.7.0 opretter `33`-tabeller. Den manglende tabel er:

- `tokens`

Handling:

- Opdater antallet fra 32 til 33.
- Tilføj `tokens` til tabellisten.

## 7. Kapitel 7: Administrationsindstillinger

Fil:

- `chapter-7-administration-settings.md`

### 7.1 Beskrivelse af adgangskodebrugergrænsefladen er forældetInstallationsprogrammet inkluderer stadig adgangskodegenerering, men det inkluderer nu også:

- zxcvbn-baseret adgangskodestyrkemåler
- visuel styrkemærker
- 16-tegns generator og kopiflow

Opdater teksten og skærmbillederne for at beskrive det aktuelle adgangskodepanel.

### 7.2 E-mail-validering er nu håndhævet

Admin e-mail er valideret med `FILTER_VALIDATE_EMAIL`. Kapitlet bør nævne, at ugyldige e-mail-værdier afvises.

### 7.3 Licensnøgleafsnittet er forkert

Dette er en af de vigtigste faktuelle rettelser.

Den nuværende guide siger:

- der er en `License System Key`
- den er gemt i `/include/license.php`
- `/include/license.php` skal kunne skrives under installationen

Det er ikke længere korrekt.

Hvad 2.7.0 rent faktisk gør:

- installationen skriver licensdataene til `xoops_data/data/license.php`
- `htdocs/include/license.php` er nu kun en forældet indpakning, der indlæser filen fra `XOOPS_VAR_PATH`
- den gamle formulering om at gøre `/include/license.php` skrivbar bør fjernes

Handling:

- Omskriv dette afsnit i stedet for at slette det.
- Opdater stien fra `/include/license.php` til `xoops_data/data/license.php`.

### 7.4 Temalisten er forældet

Den nuværende guide henviser stadig til Zetagenese og det ældre 2,5-æra temasæt.

Temaer til stede i XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Bemærk også:

- `xswatch4` er det aktuelle standardtema, der er indsat af installationsdata.
- Zetagenese er ikke længere en del af den pakkede temaliste.

### 7.5 Modullisten er forældet

Moduler til stede i 2.7.0-pakken:

- `system` — installeres automatisk under trinene til tabeludfyldning/dataindsættelse. Altid til stede, aldrig synlig i plukkeren.
- `debugbar` — kan vælges i installationstrinnet.
- `pm` — kan vælges i installationstrinnet.
- `profile` — kan vælges i installationstrinnet.
- `protector` — kan vælges i installationstrinnet.

Vigtigt: modulinstallationssiden (`htdocs/install/page_moduleinstaller.php`) bygger sin kandidatliste ved at iterere over `XoopsLists::getModulesList()` og **filtrere alt fra, der allerede er i modultabellen** (linje 95-102 samler `$listed_mods`; linje 116, der findes i den liste, springer den liste over). Fordi `system` er installeret før dette trin kører, vises det aldrig som et afkrydsningsfelt.

Nødvendige guideændringer:

- Lad være med at sige, at der kun er tre bundtede moduler.
- Beskriv installationstrinnet som viser **fire valgbare moduler** (`debugbar`, `pm`, `profile`, `protector`), ikke fem.
- Dokumenter `system` separat som det altid installerede kernemodul, der ikke vises i vælgeren.
- Tilføj `debugbar` til beskrivelsen af ​​bundtet modul som ny i 2.7.0.
- Bemærk, at installatørens standardmodulforvalg nu er tomt; moduler er tilgængelige at vælge, men ikke forhåndskontrolleret af installationsprogrammets konfiguration.

## 8. Kapitel 8: Klar til at gå

Fil:

- `chapter-8-ready-to-go.md`

### 8.1 Installationsoprydningsprocessen skal omskrives

Den aktuelle vejledning siger, at installationsprogrammet omdøber installationsmappen til et unikt navn.

Det er stadig rigtigt, men mekanismen ændrede sig:

- et eksternt oprydningsscript oprettes i webroden
- den sidste side udløser oprydning gennem AJAX
- installationsmappen omdøbes til `install_remove_<unique suffix>`
- fallback til `cleanup.php` eksisterer stadig

Handling:

- Opdater forklaringen.
- Hold den brugervendte instruktion enkel: slet den omdøbte installationsmappe efter installationen.

### 8.2 Bilagsreferencer til admin dashboard er forældede

Kapitel 8 peger stadig læsere mod den gamle ilt-æra admin-oplevelse. Det skal stemme overens med aktuelle administratortemaer:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 Vejledning til redigering af stier efter installation skal rettes

Aktuel tekst fortæller læserne at opdatere `secure.php` med stidefinitioner. I 2.7.0 er disse stikonstanter defineret i `mainfile.php`, mens `secure.php` indeholder sikre data. Eksempelblokken i dette kapitel bør rettes i overensstemmelse hermed.

### 8.4 Produktionsindstillinger skal tilføjes

Vejledningen skal eksplicit nævne de produktionsstandarder, der nu er til stede i `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` skal forblive `false`
- `XOOPS_DEBUG` skal forblive `false`

## 9. Kapitel 9: Opgrader eksisterende XOOPS installationFil:

- `chapter-9-upgrade-existing-xoops-installation.md`

Dette kapitel kræver den største omskrivning.

### 9.1 Tilføj obligatorisk Smarty 4 preflight-trin

XOOPS 2.7.0 opgraderingsflow tvinger nu preflight-processen, før opgraderingen er fuldført.

Nyt påkrævet flow:

1. Kopier mappen `upgrade/` til webstedets rod.
2. Kør `/upgrade/preflight.php`.
3. Scan `/themes/` og `/modules/` for gammel Smarty-syntaks.
4. Brug den valgfri reparationstilstand, hvor det er relevant.
5. Kør igen, indtil den er ren.
6. Fortsæt ind i `/upgrade/`.

Det nuværende kapitel nævner ikke dette overhovedet, hvilket gør det uforeneligt med 2.7.0-vejledning.

### 9.2 Erstat den manuelle 2.5.2-æra flettefortælling

Det nuværende kapitel beskriver stadig en manuel opgradering i 2.5.2-stil med rammesammenlægninger, AltSys-noter og håndstyret filomstrukturering. Det bør erstattes med den faktiske 2.7.x-opgraderingssekvens fra `release_notes.txt` og `upgrade/README.md`.

Anbefalet kapiteloversigt:

1. Sikkerhedskopier filer og database.
2. Sluk for webstedet.
3. Kopier `htdocs/` over den levende rod.
4. Kopier `htdocs/xoops_lib` til den aktive bibliotekssti.
5. Kopier `htdocs/xoops_data` til den aktive datasti.
6. Kopier `upgrade/` til webroden.
7. Kør `preflight.php`.
8. Kør `/upgrade/`.
9. Fuldfør opdateringsmeddelelser.
10. Opdater `system`-modulet.
11. Opdater `pm`, `profile` og `protector`, hvis de er installeret.
12. Slet `upgrade/`.
13. Slå siden til igen.

### 9.3 Dokumenter ægte 2.7.0 opgraderingsændringer

Opdateringsprogrammet til 2.7.0 indeholder i det mindste disse konkrete ændringer:

- opret `tokens` tabel
- Udvid `bannerclient.passwd` for moderne adgangskode-hash
- tilføj præferenceindstillinger for sessionscookie
- Fjern forældede medfølgende mapper

Guiden behøver ikke at afsløre alle implementeringsdetaljer, men den burde stoppe med at antyde, at opgraderingen kun er en filkopi plus modulopdatering.

## 10. Historiske opgraderingssider

Filer:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Status:** den strukturelle beslutning er allerede løst - roden `SUMMARY.md` flytter disse til en dedikeret **Historiske opgraderingsnoter** sektion, og hver fil har en "Historisk reference"-forklaring, der peger læsere til kapitel 9 for 2.7.0-opgraderinger. De er ikke længere førsteklasses opgraderingsvejledning.

**Resterende arbejde (kun konsistens):**

- Sørg for, at `README.md` (root) angiver disse under den samme "Historiske opgraderingsnoter"-overskrift, ikke under en generisk "Opgraderinger"-overskrift.
- Spejl den samme adskillelse i `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` og `en/SUMMARY.md`.
- Sørg for, at hver historisk opgraderingsside (rod og de lokaliserede `de/book/upg*.md` / `fr/book/upg*.md`-kopier) indeholder en forældet indholdsforklaring, der linker tilbage til kapitel 9.

## 11. Bilag 1: Admin GUI

Fil:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Dette appendiks er knyttet til Oxygen-administratoren GUI og skal omskrives.

Påkrævede ændringer:

- udskift alle Oxygen referencer
- Erstat gamle ikon-/menuskærmbilleder
- dokumentere de aktuelle administratortemaer:
  - standard
  - mørkt
  - moderne
  - overgang
- nævn aktuelle 2.7.0-administrationsfunktioner, der er angivet i udgivelsesbemærkninger:
  - skabelonoverbelastningsevne i systemadministratortemaer
  - Opdateret admin tema sæt

## 12. Bilag 2: Upload af XOOPS Via FTP

Fil:

- `appendix-2-uploading-xoops-via-ftp.md`

Påkrævede ændringer:

- fjern HostGator-specifikke og cPanel-specifikke antagelser
- modernisere ordlyden af filupload
- Bemærk, at `xoops_lib` nu inkluderer Composer-afhængigheder, så uploads er større og bør ikke trimmes selektivt

## 13. Bilag 5: Sikkerhed

Fil:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Påkrævede ændringer:

- Fjern `register_globals` diskussion helt
- Fjern forældet værtsbilletsprog
- korrekt tilladelsestekst fra `404` til `0444`, hvor skrivebeskyttet er beregnet
- Opdater `mainfile.php` og `secure.php` diskussionen til at matche 2.7.0 layout
- tilføje den nye cookie-domæne sikkerhedsrelaterede konstant kontekst:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- tilføje produktionsvejledning til:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Påvirkning af vedligeholdelse på tværs af sprog

Efter at engelske filer på rodniveau er rettet, er tilsvarende opdateringer nødvendige i:- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

`en/`-træet skal også gennemgås, fordi det indeholder et separat README- og aktivsæt, men kun ser ud til at have et delvist `book/`-træ.

## 15. Prioritetsrækkefølge

### Kritisk før udgivelse

1. Opdater repo-/versionsreferencer til 2.7.0.
2. Omskriv kapitel 9 omkring det rigtige 2.7.0-opgraderingsflow og Smarty 4 preflight.
3. Opdater systemkravene til PHP 8.2+ og MySQL 5.7.8+.
4. Ret kapitel 7-licensnøglefilstien.
5. Ret tema- og modulopgørelser.
6. Ret kapitel 6-tabellen fra 32 til 33.

### Vigtigt for nøjagtigheden

7. Omskriv skrivbar vejvejledning.
8. Tilføj Composer autoloader-krav til stiopsætning.
9. Opdater vejledning i databasetegnsæt til `utf8mb4`.
10. Ret vejledning til kapitel 8-stiredigering, så konstanter er dokumenteret i den rigtige fil.
11. Fjern kontrolsum instruktioner.
12. Fjern `register_globals` og andre døde PHP-vejledninger.

### Oprydning i udgivelseskvalitet

13. Erstat alle installations- og administratorskærmbilleder.
14. Flyt historiske opgraderingssider ud af hovedflowet.
15. Synkroniser tyske og franske kopier efter engelsk er rettet.
16. Ryd op i uaktuelle links og duplikerede README-linjer.
