---
title: "Napomene za programere"
---
Iako je stvarna instalacija XOOPS za razvojnu upotrebu slična uobičajenoj instalaciji koja je već opisana, postoje ključne razlike kada se gradi sustav spreman za razvojne programere.

Jedna velika razlika u instalaciji razvojnog programera je da umjesto da se fokusira samo na sadržaj direktorija _htdocs_, instalacija razvojnog programera čuva sve datoteke i drži ih pod kontrolom izvornog koda pomoću gita.

Druga je razlika u tome što direktoriji _xoops_data_ i _xoops_lib_ obično mogu ostati na mjestu bez preimenovanja, sve dok vaš razvojni sustav nije izravno dostupan na otvorenom internetu (tj. na privatnoj mreži, kao što je iza usmjerivača.)

Većina programera radi na _localhost_ sustavu, koji ima izvorni kod, hrpu web poslužitelja i sve alate potrebne za rad s kodom i bazom podataka.

Više informacija možete pronaći u poglavlju [Alati zanata](../tools/tools.md).

## Git i virtualni hostovi

Većina razvojnih programera želi biti u tijeku s trenutnim izvorima i doprinijeti promjenama u uzvodno [XOOPS/XoopsCore27 repozitorij na GitHubu](https://github.com/XOOPS/XoopsCore27). To znači da ćete umjesto preuzimanja arhive izdanja htjeti [forkirati](https://help.github.com/articles/fork-a-repo/) kopiju XOOPS i upotrijebiti **git** za [kloniranje](https://help.github.com/categories/bootcamp/) tog repozitorija u vaš razvojni okvir.

Budući da repozitorij ima specifičnu strukturu, umjesto _kopiranja_ datoteka iz direktorija _htdocs_ na vaš web poslužitelj, bolje je usmjeriti vaš web poslužitelj na mapu htdocs unutar vašeg lokalno kloniranog repozitorija. Da bismo to postigli, obično stvaramo novi _Virtualni host_ ili _vhost_ koji upućuje na naš git controlled source code.

U [WAMP](http://www.wampserver.com/) okruženju, zadana stranica [localhost](http://localhost/) ima u odjeljku _Alati_ vezu za _Dodavanje virtualnog hosta_ koja vodi ovdje:

![WAMP Dodaj virtualni host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Pomoću ovoga možete postaviti VirtualHost unos koji će pasti ravno u vaš (još uvijek) git controlled repository.

Ovdje je primjer unosa u `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Možda ćete također morati dodati unos u `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Sada možete instalirati na `http://xoops.localhost/` za testiranje, a da pritom sačuvate svoje spremište netaknutim, a web poslužitelj unutar htdocs direktorija s jednostavnim URL. Osim toga, svoju lokalnu kopiju XOOPS možete ažurirati na najnoviju glavnu verziju u bilo kojem trenutku bez potrebe za ponovnim instaliranjem ili kopiranjem datoteka. Također možete napraviti poboljšanja i popravke koda kako biste doprinijeli XOOPS putem GitHuba.

## Ovisnosti skladatelja

XOOPS 2.7.0 koristi [Composer](https://getcomposer.org/) za upravljanje svojim ovisnostima PHP. Stablo ovisnosti živi u `htdocs/xoops_lib/` unutar izvornog repozitorija:

* `composer.dist.json` je glavni popis ovisnosti isporučenih s izdanjem.
* `composer.json` je lokalna kopija, koju možete prilagoditi za svoje razvojno okruženje ako je potrebno.
* `composer.lock` postavlja točne verzije tako da su instalacije ponovljive.
* `vendor/` sadrži instalirane biblioteke (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom i druge).

Za novi git clone of XOOPS 2.7.0, starting from the repo root, run:

```text
cd htdocs/xoops_lib
composer install
```
Imajte na umu da ne postoji `composer.json` u korijenu repoa — projekt živi pod `htdocs/xoops_lib/`, tako da morate `cd` u taj direktorij prije pokretanja Composer.

Izdanje tarballova isporučuje se s unaprijed popunjenim `vendor/`, ali git clones may not. Keep `vendor/` intact on development installs — XOOPS will load its dependencies from there at runtime.

Biblioteka [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) biblioteka isporučuje se kao ovisnost o Composeru u verziji 2.7.0, tako da možete koristiti `Xmf\Request`, `Xmf\Database\TableLoad` i povezani classes u vašem kodu modula bez ikakve dodatne instalacije.

## modul DebugBar

XOOPS 2.7.0 isporučuje modul **DebugBar** temeljen na Symfony VarDumper. Dodaje alatnu traku za otklanjanje pogrešaka prikazanim stranicama koja izlaže podatke o zahtjevu, bazi podataka i predlošku. Instalirajte ga iz modula admin područja na razvojnim i pripremnim mjestima. Ne ostavljajte ga instaliranog na javnoj proizvodnoj lokaciji osim ako znate da to želite.
