---
title: "Shrani konfiguracijo"
---
Na tej strani so prikazani rezultati shranjevanja konfiguracijskih informacij, ki ste jih vnesli do te točke.

Ko pregledate in odpravite morebitne težave, za nadaljevanje izberite gumb »Nadaljuj«.

## Na uspeh

Razdelek _Shranjevanje konfiguracije sistema_ prikazuje informacije, ki so bile shranjene. Nastavitve se shranijo v eno od dveh datotek. Ena datoteka je _mainfile.php_ v spletnem korenu. Drugi je _data/secure.php_ v imeniku _xoops_data_.

![XOOPS Namestitveni program Shrani konfiguracijo](/XOOPS-docs/2.7/img/installation/installer-07.png)

Obe datoteki sta ustvarjeni iz datotek predlog, dobavljenih z XOOPS 2.7.0:

* `mainfile.php` se ustvari iz `mainfile.dist.php` v spletnem korenu.
* `xoops_data/data/secure.php` je ustvarjen iz `xoops_data/data/secure.dist.php`.

Poleg poti in URL, ki ste jih vnesli, `mainfile.php` zdaj vključuje več konstant, ki so nove v XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — ohranjen kot nazaj združljiv vzdevek `XOOPS_PATH`; vam ga ni treba posebej konfigurirati.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — privzeto `true`; uporablja javni seznam končnic za pridobitev pravilne domene piškotka.
* `XOOPS_DB_LEGACY_LOG` — privzeto `false`; nastavljen na `true` v razvoju za beleženje uporabe podedovanih API-jev baze podatkov.
* `XOOPS_DEBUG` — privzeto `false`; nastavljen na `true` v razvoju, da omogočite dodatno poročanje o napakah.Med namestitvijo vam jih ni treba urejati ročno — privzete vrednosti so primerne za produkcijsko mesto. Tukaj so omenjeni, da boste vedeli, kaj morate iskati, če pozneje odprete `mainfile.php`.

## Napake

Če XOOPS zazna napake pri pisanju konfiguracijskih datotek, bo prikazal sporočila, ki podrobno opisujejo, kaj je narobe.

![XOOPS Napake pri shranjevanju namestitvenega programa](/XOOPS-docs/2.7/img/installation/installer-07-errors.png)

V mnogih primerih je privzeta namestitev sistema, izpeljanega iz Debiana, z uporabo mod_php v Apache vir napak. Večina ponudnikov gostovanja ima konfiguracije, ki nimajo teh težav.

### Težave z dovoljenji skupine

Proces PHP se izvaja z dovoljenji nekega uporabnika. Datoteke so tudi v lasti nekaterih uporabnikov. Če ta dva nista isti uporabnik, lahko uporabite skupinska dovoljenja, da omogočite procesu PHP skupno rabo datotek z vašim uporabniškim računom. To običajno pomeni, da morate spremeniti skupino datotek in imenikov, v katere mora XOOPS pisati.

Za zgoraj omenjeno privzeto konfiguracijo to pomeni, da je treba skupino _www-data_ določiti kot skupino za datoteke in imenike, v te datoteke in imenike pa mora biti omogočeno pisanje po skupinah.

Natančno preglejte svojo konfiguracijo in skrbno izberite, kako rešiti te težave za polje, ki je na voljo v odprtem internetu.Primeri ukazov so lahko:
```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```
### Ni mogoče ustvariti glavne datoteke.php

In Unix-like systems, the permission to create a new file depends on permissions granted on the parent folder. In some cases that permission is not available, and granting it may be a security concern.

Če imate težave s konfiguracijo, lahko najdete lažno _mainfile.php_ v imeniku _extras_ v distribuciji XOOPS. Kopirajte to datoteko v spletni koren in nastavite dovoljenja za datoteko:
```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```
### Okolja SELinux

Varnostni konteksti SELinux so lahko vir težav. Če to morda velja, si oglejte [Posebne teme](../specialtopics.md) za več informacij.