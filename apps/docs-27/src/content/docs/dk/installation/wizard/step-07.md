---
title: "Gem konfiguration"
---

Denne side viser resultaterne af at gemme de konfigurationsoplysninger, du har indtastet indtil dette tidspunkt.

Når du har gennemgået og rettet eventuelle problemer, skal du vælge knappen "Fortsæt" for at fortsætte.

## Om succes

Afsnittet _Gemmer din systemkonfiguration_ viser de oplysninger, der blev gemt. Indstillingerne gemmes i en af ​​to filer. En fil er _mainfile.php_ i webroden. Den anden er _data/secure.php_ i mappen _xoops_data_.

![XOOPS Installer Gem konfiguration](/xoops-docs/2.7/img/installation/installer-07.png)

Begge filer er genereret fra skabelonfiler, der er leveret med XOOPS 2.7.0:

* `mainfile.php` er genereret fra `mainfile.dist.php` i webroden.
* `xoops_data/data/secure.php` er genereret fra `xoops_data/data/secure.dist.php`.

Ud over de stier og URL, du har indtastet, inkluderer `mainfile.php` nu flere konstanter, der er nye i XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — opbevaret som et bagudkompatibelt alias for `XOOPS_PATH`; du behøver ikke at konfigurere den separat.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — standard til `true`; bruger den offentlige suffiksliste til at udlede det korrekte cookie-domæne.
* `XOOPS_DB_LEGACY_LOG` — standard til `false`; indstillet til `true` under udvikling for at logge brug af ældre database API'er.
* `XOOPS_DEBUG` — standard til `false`; indstillet til `true` under udvikling for at muliggøre yderligere fejlrapportering.

Du behøver ikke at redigere disse manuelt under installationen - standardindstillingerne er passende for et produktionssted. De er nævnt her, så du ved, hvad du skal kigge efter, hvis du åbner `mainfile.php` senere.

## Fejl

Hvis XOOPS opdager fejl i skrivning af konfigurationsfilerne, vil den vise meddelelser, der beskriver, hvad der er galt.

![XOOPS Installer Gem konfigurationsfejl](/xoops-docs/2.7/img/installation/installer-07-errors.png)

I mange tilfælde er en standardinstallation af et Debian-afledt system, der bruger mod_php i Apache, kilden til fejl. De fleste hostingudbydere har konfigurationer, der ikke har disse problemer.

### Problemer med gruppetilladelse

PHP-processen køres ved hjælp af tilladelser fra nogle brugere. Filer ejes også af nogle brugere. Hvis disse to ikke er den samme bruger, kan gruppetilladelser bruges til at tillade PHP-processen at dele filer med din brugerkonto. Dette betyder normalt, at du skal ændre gruppen af ​​filer og mapper XOOPS skal skrive til.

For standardkonfigurationen nævnt ovenfor betyder dette, at gruppen _www-data_ skal angives som gruppen for filerne og mapperne, og disse filer og mapper skal kunne skrives efter gruppe.

Du bør gennemgå din konfiguration omhyggeligt og omhyggeligt vælge, hvordan du løser disse problemer for en boks, der er tilgængelig på det åbne internet.

Eksempler på kommandoer kunne være:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Kan ikke oprette mainfile.php

I Unix-lignende systemer afhænger tilladelsen til at oprette en ny fil af tilladelser givet på den overordnede mappe. I nogle tilfælde er denne tilladelse ikke tilgængelig, og at give den kan være et sikkerhedsproblem.

Hvis du har et problem med konfigurationen, kan du finde en dummy _mainfile.php_ i mappen _extras_ i distributionen XOOPS. Kopier filen til webroden og indstil tilladelserne til filen:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### SELinux-miljøer

SELinux sikkerhedskontekster kan være en kilde til problemer. Hvis dette kan være relevant, skal du se [Special Topics](../specialtopics.md) for at få flere oplysninger.
