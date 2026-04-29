---
title: "Flytning af et websted"
---

Det kan være en meget nyttig teknik at prototype et nyt XOOPS site på et lokalt system eller en udviklingsserver. Det kan også være meget klogt at teste en XOOPS-opgradering på en kopi af dit produktionssted først, bare hvis noget går galt. For at opnå disse, skal du være i stand til at flytte dit XOOPS-websted fra et websted til et andet. Her er hvad du behøver at vide for at kunne flytte dit XOOPS-websted.

Det første skridt er at etablere dit nye webstedsmiljø. De samme punkter, som er dækket i afsnittet [Avancerede forberedelser](../installation/preparations/), gælder også her.

I gennemgangen er disse trin:

* få hosting, inklusive eventuelle krav til domænenavn eller e-mail
* få en MySQL brugerkonto og adgangskode
* få en MySQL database, som ovenstående bruger har alle privilegier på

Resten af processen ligner en normal installation, men:

* i stedet for at kopiere filerne fra XOOPS-distributionen, vil du kopiere dem fra det eksisterende websted
* i stedet for at køre installationsprogrammet, vil du importere en database, der allerede er udfyldt
* i stedet for at indtaste svar i installationsprogrammet, vil du ændre de tidligere svar i filerne og databasen

## Kopier de eksisterende webstedsfiler

Lav en fuld kopi af filerne på dit eksisterende websted til din lokale maskine, hvor du kan redigere dem. Hvis du arbejder med en fjernvært, kan du bruge FTP til at kopiere filerne. Du skal bruge en kopi til at arbejde med, selvom webstedet kører på din lokale maskine, skal du bare lave en anden kopi af webstedets mapper i så fald.

Det er vigtigt at huske at inkludere mapperne _xoops_data_ og _xoops_lib_, selvom de blev omdøbt og/eller flyttet.

For at gøre tingene mere jævne, bør du fjerne cache- og Smarty-kompilerede skabelonfiler fra din kopi. Disse filer vil blive genskabt i dit nye miljø og kan forårsage problemer med, at gamle forkerte oplysninger bevares, hvis de ikke ryddes. For at gøre dette skal du slette alle filer, undtagen _index.html_, i alle tre af disse mapper:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Bemærk:** Rydning af `smarty_compile` er især vigtig, når du flytter et websted til eller fra XOOPS 2.7.0. XOOPS 2.7.0 bruger Smarty 4, og Smarty 4 kompilerede skabeloner kan ikke udskiftes med Smarty 3 kompilerede skabeloner. Hvis uaktuelle kompilerede filer efterlades på plads, vil det forårsage skabelonfejl ved første sideindlæsning på det nye websted.

### `xoops_lib` og komponistafhængigheder

XOOPS 2.7.0 administrerer sine PHP-afhængigheder gennem Composer, inde i `xoops_lib/`. `xoops_lib/vendor/`-biblioteket indeholder de tredjepartsbiblioteker, som XOOPS har brug for under kørsel (Smarty 4, PHPMailer, HTMLPurifier osv.). Når du flytter et websted, skal du kopiere hele `xoops_lib/`-træet – inklusive `vendor/` – til den nye vært. Forsøg ikke at regenerere `vendor/` på målværten, medmindre du er en udvikler, der har tilpasset `composer.json` og har Composer tilgængelig på målet.

## Opsæt det nye miljø

De samme punkter, som er dækket i afsnittet [Avancerede forberedelser](../installation/preparations/), gælder også her. Vi vil her antage, at du har den hosting, du har brug for til det websted, du flytter.

### Nøgleoplysninger (mainfile.php og secure.php)

Succesfuld flytning af et websted involverer ændring af eventuelle referencer til absolutte fil- og stinavne, URL'er, databaseparametre og adgangsoplysninger.

To filer, `mainfile.php` i dit websteds web-rod og `data/secure.php` i dit websteds (omdøbt og/eller flyttede) _xoops_data_-mappe definerer dit websteds grundlæggende parametre, såsom dets URL, hvor det forbinder filsystemet til databasen, og i.

Du skal både vide, hvad værdierne er i det gamle system, og hvad de vil være i det nye system.

#### hovedfil.php

| Navn | Gammel værdi i mainfile.php | Ny værdi i mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |Åbn _mainfile.php_ i din editor. Skift værdierne for definitionerne vist i diagrammet ovenfor fra de gamle værdier til de relevante værdier for det nye websted.

Noter de gamle og nye værdier, da vi bliver nødt til at foretage lignende ændringer andre steder i nogle senere trin.

For eksempel, hvis du flytter et websted fra din lokale pc til en kommerciel hostingtjeneste, kan dine værdier se sådan ud:

| Navn | Gammel værdi i mainfile.php | Ny værdi i mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | lokalvært | eksempel.com |

Når du har ændret _mainfile.php_, skal du gemme den.

Det er muligt, at nogle andre filer kan indeholde hårdkodede referencer til din URL eller endda stier. Dette er mere sandsynligt i tilpassede temaer og menuer, men med din editor kan du søge på tværs af alle filer, bare for at være sikker.

I din editor skal du foretage en søgning på tværs af filerne i din kopi, søge efter den gamle XOOPS_URL værdi, og erstatte den med den nye værdi.

Gør det samme for den gamle XOOPS_ROOT_PATH-værdi, og erstat alle forekomster med den nye værdi.

Gem dine noter, for vi bliver nødt til at bruge dem igen senere, når vi flytter databasen.

#### data/secure.php

| Navn | Gammel værdi i data/secure.php | Ny værdi i data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Åbn _data/secure.php_ i det omdøbte og/eller flyttede _xoops_data_-bibliotek i din editor. Skift værdierne for definitionerne vist i diagrammet ovenfor fra de gamle værdier til de relevante værdier for det nye websted.

#### Andre filer

Der kan være andre filer, der kan have brug for opmærksomhed, når dit websted flytter. Nogle almindelige eksempler er API nøgler til forskellige tjenester, der kan være knyttet til domænet, såsom:

* Google Maps
* Genoptagelse 2
* Like-knapper
* Linkdeling og/eller annoncering såsom Shareaholic eller AddThis

Ændring af disse foreningstyper kan ikke uden videre automatiseres, da forbindelserne til det gamle domæne typisk er en del af registreringen på servicesiden. I nogle tilfælde kan dette blot tilføje eller ændre det domæne, der er knyttet til tjenesten.

### Kopier filerne til det nye websted

Kopier dine nu ændrede filer til dit nye websted. Teknikkerne er de samme, som blev brugt under [Installation](../installation/installation/), dvs. ved at bruge FTP.

## Kopier den eksisterende webstedsdatabase

### Sikkerhedskopier databasen fra den gamle server

Til dette trin anbefales det stærkt at bruge _phpMyAdmin_. Log ind på _phpMyAdmin_ for dit eksisterende websted, vælg din database, og vælg _Eksporter_.

Standardindstillingen er normalt fin, så vælg bare "Eksportmetode" for _Quick_ og "Format" af _SQL_.

Brug knappen _Go_ for at downloade databasesikkerhedskopien.

![Eksport af en database med phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Hvis du har tabeller i din database, som ikke er fra XOOPS eller dets moduler, og det er meningen, at NOT skal flyttes, skal du vælge "Eksportmetoden" for _Custom_ og vælge kun de XOOPS-relaterede tabeller i din database. (Disse starter med det "præfiks", som du angav under installationen. Du kan slå dit databasepræfiks op i filen `xoops_data/data/secure.php`.)

### Gendan databasen til den nye server

På din nye vært, ved hjælp af din nye database, gendan databasen ved hjælp af [værktøjer](../tools/tools.md), såsom fanen _Import_ i _phpMyAdmin_ (eller _bigdump_ hvis det er nødvendigt).

### Opdater URL'er og stier i databasen

Opdater eventuelle http-links til ressourcer på dit websted i din database. Dette kan være en kæmpe indsats, og der er et [værktøj](../tools/tools.md) til at gøre dette lettere.

Interconnect/it har et produkt kaldet Search-Replace-DB som kan hjælpe med dette. Det kommer med bevidsthed om Wordpress- og Drupal-miljøer indbygget. Som det er, kan dette værktøj være meget nyttigt, men det er endnu bedre, når det er opmærksom på din XOOPS. Du kan finde en XOOPS aware version på [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)Følg instruktionerne i filen README.md for at downloade og midlertidigt installere dette værktøj på dit websted. Tidligere ændrede vi XOOPS_URL-definitionen. Når du kører dette værktøj, vil du erstatte den originale XOOPS_URL definition med den nye definition, dvs. erstatte [http://localhost/xoops](http://localhost/xoops) med [https://example.com](https://example.com)

![Brug af Søg og Erstat DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Indtast dine gamle og nye URL'er, og vælg tørløbsmuligheden. Gennemgå ændringerne, og hvis alt ser godt ud, skal du gå efter muligheden for at køre live. Dette trin fanger konfigurationselementer og links inde i dit indhold, der henviser til dit websted URL.

![Gennemgang af ændringer i SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Gentag processen med dine gamle og nye værdier for XOOPS_ROOT_PATH.

#### Alternativ tilgang uden SRDB

En anden måde at udføre dette trin på uden srdb-værktøjet ville være at dumpe din database, redigere dumpet i en teksteditor ved at ændre URL'erne og stierne og derefter genindlæse databasen fra dit redigerede dump. Ja, den proces er involveret nok og indebærer nok risiko til, at folk var motiverede til at skabe specialiserede værktøjer såsom Search-Replace-DB.

## Prøv dit flyttede websted

På dette tidspunkt skulle dit websted være klar til at køre i dets nye miljø!

Der kan selvfølgelig altid være problemer. Vær ikke bange for at stille spørgsmål på [xoops.org-fora](https://xoops.org/modules/newbb/index.php).
