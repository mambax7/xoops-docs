---
title: "Forberedelser til opgradering"
---

## Sluk websted

Før du starter XOOPS-opgraderingsprocessen, skal du indstille "Slå dit websted fra?" element til _Ja_ i Indstillinger -&gt; Systemindstillinger -&gt; Siden Generelle indstillinger i administrationsmenuen.

Dette forhindrer brugere i at støde på et ødelagt websted under opgraderingen. Det holder også striden om ressourcer på et minimum for at sikre en jævnere opgradering.

I stedet for fejl og et ødelagt websted, vil dine besøgende se noget som dette:

![Site lukket på mobil](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Sikkerhedskopiering

Det er en god idé at bruge sektionen XOOPS administration _Vedligeholdelse_ til at _Rengøre cache-mappen_ for alle caches, før du laver en fuld sikkerhedskopi af dine webstedsfiler. Når webstedet er slået fra, anbefales det også at bruge _Tøm sessionstabellen_, så hvis en gendannelse er nødvendig, vil de forældede sessioner ikke være en del af den.

### Filer

Filsikkerhedskopieringen kan laves med FTP, idet alle filer kopieres til din lokale maskine. Hvis du har direkte shell-adgang til serveren, kan det være _meget_ hurtigere at lave en kopi (eller en arkivkopi) der.

### Database

For at lave en database backup kan du bruge de indbyggede funktioner i XOOPS administration _Vedligeholdelse_ sektionen. Du kan også bruge funktionerne _Eksporter_ i _phpMyAdmin_, hvis de er tilgængelige. Hvis du har shell-adgang, kan du bruge kommandoen _mysql_ til at dumpe din database.

At være flydende i at sikkerhedskopiere og _gendanne_ din database er en vigtig webmasterfærdighed. Der er mange onlineressourcer, som du kan bruge til at lære mere om disse handlinger, som passer til din installation, såsom [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin Export](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Kopier nye filer til webstedet

Kopiering af de nye filer til dit websted er stort set identisk med trinnet [Forberedelser](../../installation/preparations/) under installationen. Du bør kopiere mapperne _xoops_data_ og _xoops_lib_ til de steder, hvor disse blev flyttet under installationen. Kopier derefter resten af ​​indholdet af distributionens _htdocs_-mappe (med nogle få undtagelser dækket i næste afsnit) over de eksisterende filer og mapper i din webrod.

I XOOPS 2.7.0 vil kopiering af en ny distribution oven på et eksisterende websted **ikke overskrive eksisterende konfigurationsfiler** såsom `mainfile.php` eller `xoops_data/data/secure.php`. Dette er en velkommen ændring fra tidligere versioner, men du bør stadig lave en fuld sikkerhedskopi, før du starter.

Kopier hele _upgrade_-mappen fra distributionen til din webrod, og opret en _upgrade_-mappe der.

## Kør Smarty 4 Preflight Check

Før du starter den primære `/upgrade/`-arbejdsgang, skal du køre preflight-scanneren, der blev leveret i `upgrade/`-biblioteket. Den undersøger dine eksisterende temaer og modulskabeloner for Smarty 4-kompatibilitetsproblemer og kan automatisk reparere mange af dem.

1. Peg din browser på _your-site-url_/upgrade/preflight.php
2. Log på med en administratorkonto
3. Kør scanningen og gennemse rapporten
4. Anvend alle tilbudte automatiske reparationer, eller ret markerede skabeloner manuelt
5. Kør scanningen igen, indtil den er ren
6. Fortsæt først derefter til hovedopgraderingen

Se siden [Preflight Check](preflight.md) for en komplet gennemgang.

### Ting, du måske ikke vil kopiere over

Du bør ikke kopiere mappen _install_ til et fungerende XOOPS-system. Hvis du forlader installationsmappen i din XOOPS-installation, udsættes dit system for potentielle sikkerhedsproblemer. Installationsprogrammet omdøber det tilfældigt, men du bør slette det og sørge for, at du ikke kopierer det ind i et andet.

Der er nogle filer, du måske har redigeret for at tilpasse dit websted, og du vil gerne bevare dem. Her er en liste over almindelige tilpasninger.

* _xoops_data/configs/xoopsconfig.php_ hvis det er blevet ændret siden siden blev installeret
* alle mapper i _temaer_, hvis de er tilpasset til dit websted. I dette tilfælde vil du måske sammenligne filer for at identificere nyttige opdateringer.
* enhver fil i _class/captcha/_ der starter med "config", hvis den er blevet ændret siden siden blev installeret
* eventuelle tilpasninger i _class/textsanitizer_
* eventuelle tilpasninger i _class/xoopseditor_Hvis du efter opgraderingen indser, at noget ved et uheld er blevet overskrevet, skal du ikke gå i panik - det er derfor, du startede med en fuld backup. _(Du lavede en sikkerhedskopi, ikke?)_

## Tjek mainfile.php (Opgradering fra Pre-2.5 XOOPS)

Dette trin gælder kun, hvis du opgraderer fra en gammel XOOPS-version (2.3 eller tidligere). Hvis du opgraderer fra XOOPS 2.5.x, kan du springe dette afsnit over.

Gamle versioner af XOOPS krævede nogle manuelle ændringer i `mainfile.php` for at aktivere Protector-modulet. I din webrod skal du have en fil med navnet `mainfile.php`. Åbn den fil i din editor og se efter disse linjer:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

og

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Fjern disse linjer, hvis du finder dem, og gem filen, før du fortsætter.
