---
title: "Krav"
---

## Softwaremiljø (stakken)

De fleste XOOPS produktionssteder kører på en _LAMP_-stack (et **L**inux-system, der kører **A**pache, **M**ySQL og **P**HP), men der er mange forskellige mulige stakke.

Det er ofte nemmest at prototype et nyt websted på en lokal maskine. I dette tilfælde vælger mange XOOPS-brugere en _WAMP_-stak (ved hjælp af **W**indows som OS), mens andre kører _LAMP_ eller _MAMP_ (**M**AC) stakke.

### PHP

Enhver PHP version &gt;= 8.2.0 (PHP 8.4 eller nyere anbefales kraftigt)

> **Vigtigt:** XOOPS 2.7.0 kræver **PHP 8.2 eller nyere**. PHP 7.x og tidligere understøttes ikke længere. Hvis du opgraderer et ældre websted, skal du bekræfte, at din vært tilbyder PHP 8.2+, før du starter.

### MySQL

MySQL server 5.7 eller højere (MySQL Server 8.4 eller højere anbefales kraftigt). MySQL 9.0 understøttes også. MariaDB er en bagudkompatibel, binær drop-in-erstatning af MySQL og fungerer også fint med XOOPS.

### Webserver

En webserver, der understøtter at køre PHP-scripts, såsom Apache, NGINX, LiteSpeed osv.

### Nødvendige PHP-udvidelser

XOOPS-installationsprogrammet bekræfter, at følgende udvidelser er indlæst, før installationen kan fortsætte:

* `mysqli` — MySQL databasedriver
* `session` — sessionshåndtering
* `pcre` — Perl-kompatible regulære udtryk
* `filter` — inputfiltrering og validering
* `fileinfo` — MIME-type detektering til uploads

### Nødvendige PHP-indstillinger

Ud over udvidelserne ovenfor verificerer installationsprogrammet følgende `php.ini`-indstilling:

* `file_uploads` skal være **Til** — uden det kan XOOPS ikke acceptere uploadede filer

### Anbefalede PHP-udvidelser

Installationsprogrammet tjekker også for disse udvidelser. De er ikke strengt påkrævet, men XOOPS og de fleste moduler er afhængige af dem for fuld funktionalitet. Aktiver så mange, som din vært tillader:

* `mbstring` — multi-byte strenghåndtering
* `intl` — internationalisering
* `iconv` — tegnsætkonvertering
* `xml` — XML parsing
* `zlib` — komprimering
* `gd` — billedbehandling
* `exif` — billedmetadata
* `curl` — HTTP-klient til feeds og API-kald

## Tjenester

### Filsystemadgang (for webmasteradgang)

Du skal bruge en eller anden metode (FTP, SFTP osv.) til at overføre XOOPS distributionsfilerne til webserveren.

### Filsystemadgang (til webserverproces)

For at køre XOOPS kræves evnen til at oprette, læse og slette filer og mapper. Følgende stier skal kunne skrives af webserverprocessen for en normal installation og for normal daglig drift:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (skrivbar under installation og opgradering)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Database

XOOPS skal oprette, ændre og forespørge tabeller i MySQL. Til dette skal du bruge:

* en MySQL brugerkonto og adgangskode
* en MySQL-database, som brugeren har alle privilegier på (eller alternativt kan brugeren have privilegium til at oprette en sådan database)

### E-mail

For et live-websted skal du bruge en fungerende e-mailadresse, som XOOPS kan bruge til brugerkommunikation, såsom kontoaktiveringer og nulstilling af adgangskode. Selvom det ikke er strengt nødvendigt, anbefales det, hvis det er muligt, at bruge en e-mailadresse, der matcher det domæne, som din XOOPS kører på. Det hjælper med at undgå, at din kommunikation ender med at blive afvist eller markeret som spam.

## Værktøjer

Du har muligvis brug for nogle ekstra værktøjer til at opsætte og tilpasse din XOOPS installation. Disse kan omfatte:

* FTP klientsoftware
* Teksteditor
* Arkivsoftware til at arbejde med XOOPS-udgivelsesfiler (_.zip_ eller _.tar.gz_).Se afsnittet [Tools of the Trade](../tools/tools.md) for nogle forslag til passende værktøjer og webserverstakke, hvis det er nødvendigt.

## Særlige emner

Nogle specifikke systemsoftwarekombinationer kan kræve nogle yderligere konfigurationer for at fungere med XOOPS. Hvis du bruger et SELinux-miljø eller opgraderer et ældre websted med brugerdefinerede temaer, se venligst [Special Topics](specialtopics.md) for mere information.
