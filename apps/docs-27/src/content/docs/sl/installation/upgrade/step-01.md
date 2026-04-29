---
title: "Priprave na nadgradnjo"
---
## Izklopi spletno mesto

Preden začnete s postopkom nadgradnje XOOPS, morate nastaviti možnost "Želite izklopiti spletno mesto?" element na _Da_ v nastavitvah -&gt; Sistemske možnosti -&gt; Stran s splošnimi nastavitvami v meniju za upravljanje.

To uporabnikom prepreči, da bi med nadgradnjo naleteli na pokvarjeno spletno mesto. Prav tako zmanjšuje borbo za vire na minimum, da zagotovi bolj gladko nadgradnjo.

Namesto napak in pokvarjenega mesta bodo vaši obiskovalci videli nekaj takega:

![Stran zaprta na mobilni napravi](/XOOPS-docs/2.7/img/installation/mobile-site-closed.png)

## Varnostna kopija

Dobro je, da uporabite XOOPS skrbniški razdelek _Vzdrževanje_ za _Očistite mapo predpomnilnika_ za vse predpomnilnike, preden naredite popolno varnostno kopijo datotek vašega spletnega mesta. Ko je spletno mesto izklopljeno, je priporočljiva tudi uporaba _Izprazni tabelo sej_, tako da zastarele seje ne bodo del nje, če bo potrebna obnovitev.

### Datoteke

Varnostno kopijo datotek lahko naredite z FTP, tako da kopirate vse datoteke na vaš lokalni računalnik. Če imate neposreden lupinski dostop do strežnika, je lahko _veliko_ hitreje, če tam naredite kopijo (ali arhivsko kopijo).

### Baza podatkov

Za izdelavo varnostne kopije podatkovne baze lahko uporabite vgrajene funkcije v razdelku XOOPS administracije _Vzdrževanje_. Uporabite lahko tudi funkcije _Export_ v _phpMyAdmin_, če so na voljo. Če imate dostop do ukazne lupine, lahko uporabite ukaz _mysql_ za izpis baze podatkov.Tekoče znanje varnostnega kopiranja in _obnavljanja_ baze podatkov je pomembna veščina spletnega skrbnika. Obstaja veliko spletnih virov, ki jih lahko uporabite, če želite izvedeti več o teh postopkih glede na vašo namestitev, na primer [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin izvoz](/XOOPS-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Kopiraj nove datoteke na spletno mesto

Kopiranje novih datotek na vaše spletno mesto je praktično enako koraku [Priprave](../../installation/preparations/) med namestitvijo. Imenika _xoops_data_ in _xoops_lib_ kopirajte tja, kamor sta bila prestavljena med namestitvijo. Nato prekopirajte preostalo vsebino distribucijskega imenika _htdocs_ (z nekaj izjemami, obravnavanimi v naslednjem razdelku) čez obstoječe datoteke in imenike v vašem spletnem korenu.

V XOOPS 2.7.0 kopiranje nove distribucije na vrh obstoječega mesta **ne bo prepisalo obstoječih konfiguracijskih datotek**, kot sta `mainfile.php` ali `xoops_data/data/secure.php`. To je dobrodošla sprememba glede na prejšnje različice, vendar morate pred začetkom vseeno narediti popolno varnostno kopijo.

Kopirajte celoten imenik _upgrade_ iz distribucije v svoj spletni koren in tam ustvarite imenik _upgrade_.## Zaženite Smarty 4 Preverjanje pred tiskom

Preden zaženete glavni potek dela `/upgrade/`, morate zagnati optični bralnik pred tiskom, ki je dobavljen v imeniku `upgrade/`. Pregleduje vaše obstoječe teme in predloge modulov glede težav z združljivostjo Smarty 4 in jih lahko samodejno popravi.

1. V brskalniku poiščite _your-site-url_/upgrade/preflight.php
2. Prijavite se s skrbniškim računom
3. Zaženite skeniranje in preglejte poročilo
4. Uporabite ponujena samodejna popravila ali ročno popravite označene predloge
5. Ponovno zaženite skeniranje, dokler ni čisto
6. Šele nato nadaljujte z glavno nadgradnjo

Oglejte si stran [Preverjanje pred tiskom](preflight.md) za celoten potek.

### Stvari, ki jih morda ne želite kopirati

Imenika _install_ ne smete ponovno kopirati v delujoč sistem XOOPS. Če pustite namestitveno mapo v namestitvi XOOPS, sistem izpostavite morebitnim varnostnim težavam. Namestitveni program ga naključno preimenuje, vendar ga morate izbrisati in se prepričati, da ga ne kopirate v drugega.

Obstaja nekaj datotek, ki ste jih morda uredili, da prilagodite svoje spletno mesto, in jih boste želeli ohraniti. Tukaj je seznam običajnih prilagoditev.

* _xoops_data/configs/xoopsconfig.php_ če je bilo spremenjeno od namestitve strani
* vsi imeniki v _themes_, če so prilagojeni za vaše spletno mesto. V tem primeru boste morda želeli primerjati datoteke, da prepoznate uporabne posodobitve.
* katera koli datoteka v _class/captcha/_, ki se začne z "config", če je bila spremenjena od namestitve spletnega mesta
* morebitne prilagoditve v _class/textsanitizer_
* morebitne prilagoditve v _class/xoopseditor_Če po nadgradnji ugotovite, da je bilo nekaj pomotoma prepisano, brez panike – zato ste začeli s popolno varnostno kopijo. _(Naredili ste varnostno kopijo, kajne?)_

## Preverite glavno datoteko.php (Upgrading from Pre-2.5 XOOPS)

Ta korak velja le, če nadgrajujete s stare različice XOOPS (2.3 ali starejše). Če nadgrajujete z XOOPS 2.5.x, lahko ta razdelek preskočite.

Stare različice XOOPS so zahtevale nekaj ročnih sprememb v `mainfile.php`, da bi omogočili modul Protector. V spletnem korenu bi morali imeti datoteko z imenom `mainfile.php`. Odprite to datoteko v urejevalniku in poiščite te vrstice:
```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```
in
```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```
Odstranite te vrstice, če jih najdete, in shranite datoteko, preden nadaljujete.