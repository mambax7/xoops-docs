---
title: "Opombe za razvijalce"
---
Čeprav je dejanska namestitev XOOPS za razvojno uporabo podobna že opisani običajni namestitvi, obstajajo ključne razlike pri gradnji sistema, pripravljenega za razvijalce.

Ena velika razlika pri namestitvi za razvijalce je, da namesto da bi se osredotočil le na vsebino imenika _htdocs_, namestitev za razvijalce obdrži vse datoteke in jih hrani pod nadzorom izvorne kode z uporabo gita.

Druga razlika je, da lahko imenika _xoops_data_ in _xoops_lib_ običajno ostaneta na mestu brez preimenovanja, dokler vaš razvojni sistem ni neposredno dostopen v odprtem internetu (tj. v zasebnem omrežju, na primer za usmerjevalnikom.)

Večina razvijalcev dela na sistemu _localhost_, ki ima izvorno kodo, sklad spletnega strežnika in vsa orodja, potrebna za delo s kodo in bazo podatkov.

Več informacij najdete v poglavju [Tools of the Trade](../tools/tools.md).

## Git in virtualni gostitelji

Večina razvijalcev želi biti na tekočem s trenutnimi viri in prispevati spremembe nazaj v zgornji [XOOPS/XoopsCore27 repozitorij na GitHubu](https://github.com/XOOPS/XoopsCore27). To pomeni, da boste namesto prenosa arhiva izdaje želeli [razcepiti](https://help.github.com/articles/fork-a-repo/) kopijo XOOPS in uporabiti **git** za [kloniranje](https://help.github.com/categories/bootcamp/) tega repozitorija v vaš razvojni program.Ker ima repozitorij specifično strukturo, je namesto _kopiranja_ datotek iz imenika _htdocs_ v vaš spletni strežnik bolje, da vaš spletni strežnik usmerite v mapo htdocs znotraj vašega lokalno kloniranega repozitorija. Da bi to dosegli, običajno ustvarimo novega _navideznega gostitelja_ ali _vhost_, ki kaže na naš git controlled source code.

V okolju [WAMP](http://www.wampserver.com/) ima privzeta stran [localhost](http://localhost/) v razdelku _Orodja_ povezavo do _Dodaj navideznega gostitelja_, ki vodi sem:

![WAMP Dodaj virtualnega gostitelja](/XOOPS-docs/2.7/img/installation/wamp-vhost-03.png)

S tem lahko nastavite vnos VirtualHost, ki bo spuščen naravnost v vaš (še vedno) git controlled repository.

Tukaj je primer vnosa v `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`
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
Morda boste morali dodati tudi vnos v `Windows/System32/drivers/etc/hosts`:
```text
127.0.0.1    xoops.localhost
```
Zdaj lahko namestite na `http://XOOPS.localhost/` za testiranje, medtem ko ohranite svoje skladišče nedotaknjeno in ohranite spletni strežnik v imeniku htdocs s preprostim URL. Poleg tega lahko svojo lokalno kopijo XOOPS kadar koli posodobite na najnovejšo glavno različico, ne da bi vam bilo treba znova namestiti ali kopirati datoteke. Poleg tega lahko izboljšate in popravite kodo, da prispevate nazaj k XOOPS prek GitHuba.

## Odvisnosti skladatelja

XOOPS 2.7.0 uporablja [Composer](https://getcomposer.org/) za upravljanje svojih odvisnosti PHP. Drevo odvisnosti živi v `htdocs/xoops_lib/` znotraj izvornega repozitorija:

* `composer.dist.json` je glavni seznam odvisnosti, dobavljen z izdajo.
* `composer.json` je lokalna kopija, ki jo lahko po potrebi prilagodite svojemu razvojnemu okolju.
* `composer.lock` pripne natančne različice, tako da so namestitve ponovljive.
* `vendor/` vsebuje nameščene knjižnice (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, XOOPS/XMF, XOOPS/regdom in druge).

Za sveže git clone of XOOPS 2.7.0, starting from the repo root, run:
```text
cd htdocs/xoops_lib
composer install
```
Upoštevajte, da v korenu repoja ni `composer.json` — projekt živi pod `htdocs/xoops_lib/`, zato morate `cd` v ta imenik, preden zaženete Composer.

Arhivi za izdajo so poslani s predizpolnjenim `vendor/`, vendar git clones may not. Keep `vendor/` intact on development installs — XOOPS will load its dependencies from there at runtime.

Knjižnica [XMF (XOOPS Module Framework)](https://github.com/XOOPS/XMF) knjižnica je dobavljena kot odvisnost Composerja v različici 2.7.0, tako da lahko uporabite `XMF\Request`, `XMF\Database\TableLoad` in sorodne razrede v vaši kodi modula brez dodatne namestitve.

## Modul DebugBar

XOOPS 2.7.0 vsebuje modul **DebugBar**, ki temelji na Symfony VarDumper. Upodobljenim stranem doda orodno vrstico za odpravljanje napak, ki razkrije informacije o zahtevah, bazi podatkov in predlogah. Namestite ga iz skrbniškega območja Modules na spletnih mestih za razvoj in pripravo. Ne puščajte ga nameščenega na javnem proizvodnem mestu, razen če veste, da to želite.