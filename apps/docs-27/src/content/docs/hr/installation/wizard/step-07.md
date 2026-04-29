---
title: "Spremi konfiguraciju"
---
Ova stranica prikazuje rezultate spremanja konfiguracijskih informacija koje ste unijeli do ove točke.

Nakon pregleda i ispravljanja problema odaberite gumb "Nastavi" za nastavak.

## O uspjehu

Odjeljak _Spremanje konfiguracije vašeg sustava_ prikazuje informacije koje su spremljene. Postavke se spremaju u jednu od dvije datoteke. Jedna datoteka je _mainfile.php_ u web korijenu. Drugi je _data/secure.php_ u direktoriju _xoops_data_.

![XOOPS Instalater Spremi konfiguraciju](/xoops-docs/2.7/img/installation/installer-07.png)

Obje su datoteke generirane iz datoteka predložaka isporučenih s XOOPS 2.7.0:

* `mainfile.php` generira se iz `mainfile.dist.php` u web korijenu.
* `xoops_data/data/secure.php` generiran je iz `xoops_data/data/secure.dist.php`.

Uz staze i URL koje ste unijeli, `mainfile.php` sada includes nekoliko konstanti koje su nove u XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — čuva se kao pseudonim `XOOPS_PATH` kompatibilan sa prethodnim verzijama; ne morate ga posebno konfigurirati.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — zadana vrijednost `true`; koristi javni popis sufiksa za izvođenje točne domene kolačića.
* `XOOPS_DB_LEGACY_LOG` — zadana vrijednost `false`; postavljen na `true` u razvoju za evidentiranje upotrebe naslijeđenih API-ja baze podataka.
* `XOOPS_DEBUG` — zadano `false`; postavljen na `true` u razvoju kako bi se omogućilo dodatno izvješćivanje o pogreškama.

Ne morate ih ručno uređivati ​​tijekom instalacije — zadane su prikladne za mjesto proizvodnje. Spomenuti su ovdje kako biste znali što tražiti ako kasnije otvorite `mainfile.php`.

## Pogreške

Ako XOOPS otkrije pogreške u pisanju konfiguracijskih datoteka, prikazat će poruke s detaljima o tome što nije u redu.

![XOOPS Greške spremanja konfiguracije instalatera](/xoops-docs/2.7/img/installation/installer-07-errors.png)

U mnogim slučajevima, zadana instalacija sustava izvedenog iz Debiana koristeći mod_php u Apacheu izvor je pogrešaka. Većina pružatelja usluga hostinga ima konfiguracije koje nemaju te probleme.

### Problemi s grupnim dopuštenjima

Proces PHP izvodi se pomoću dopuštenja nekog korisnika. Datoteke su također u vlasništvu nekog korisnika. Ako ova dva nisu isti korisnici, grupna dopuštenja se mogu koristiti kako bi se procesu PHP omogućilo dijeljenje datoteka s vašim korisničkim računom. To obično znači da trebate promijeniti grupu datoteka i direktorija u koje XOOPS treba pisati.

Za gore spomenutu zadanu konfiguraciju to znači da grupa _www-data_ mora biti specificirana kao grupa za datoteke i direktorije, a te datoteke i direktorije moraju biti upisivi po grupama.

Trebali biste pažljivo pregledati svoju konfiguraciju i pažljivo odabrati kako riješiti te probleme za okvir dostupan na otvorenom internetu.

Primjeri naredbi mogu biti:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Nije moguće kreirati mainfile.php

U sustavima sličnim Unixu, dopuštenje za stvaranje nove datoteke ovisi o dopuštenjima dodijeljenim nadređenoj mapi. U nekim slučajevima to dopuštenje nije dostupno, a njegovo dodjeljivanje može biti sigurnosni problem.

Ako imate problema s konfiguracijom, možete pronaći lažnu _mainfile.php_ u direktoriju _extras_ u distribuciji XOOPS. Kopirajte tu datoteku u web korijen i postavite dopuštenja za datoteku:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### SELinux okruženjaSELinux sigurnosni konteksti mogu biti izvor problema. Ako se ovo odnosi, pogledajte [Posebne teme](../specialtopics.md) za više informacija.
