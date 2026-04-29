---
title: "Pripreme za nadogradnju"
---
## Isključi stranicu

Prije pokretanja procesa nadogradnje XOOPS, trebali biste postaviti "Isključiti svoju stranicu?" stavku na _Da_ u postavkama -&gt; Mogućnosti sustava -&gt; Stranica Opće postavke u izborniku Administracija.

Ovo sprječava korisnike da naiđu na pokvareno mjesto tijekom nadogradnje. Također svodi sukobe za resurse na minimum kako bi se osigurala lakša nadogradnja.

Umjesto grešaka i pokvarene stranice, vaši će posjetitelji vidjeti nešto poput ovoga:

![Site zatvoreno na mobitelu](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Sigurnosna kopija

Dobra je ideja upotrijebiti XOOPS administration odjeljak _Održavanje_ za _Očistiti mapu cache_ za sve caches prije izrade potpune sigurnosne kopije datoteka vaše stranice. Kada je stranica isključena, također se preporučuje korištenje _Isprazni tablicu sesija_ tako da, ako je potrebno vraćanje, zastarjele sesije neće biti dio toga.

### Datoteke

Sigurnosna kopija datoteke može se napraviti pomoću FTP-a, kopiranjem svih datoteka na vaš lokalni stroj. Ako imate izravan pristup ljuske poslužitelju, može biti _puno_ brže napraviti kopiju (ili arhivsku kopiju) tamo.

### baza podataka

Za izradu sigurnosne kopije baze podataka možete koristiti ugrađene funkcije u XOOPS administration odjeljku _Održavanje_. Također možete koristiti funkcije _Export_ u _phpMyAdmin_, ako su dostupne. Ako imate pristup ljusci, možete upotrijebiti naredbu _mysql_ za ispis baze podataka.

Biti tečan u sigurnosnom kopiranju i _vraćanju_ svoje baze podataka važna je vještina webmastera. Postoje mnogi mrežni resursi koje možete koristiti da biste saznali više o ovim operacijama koje odgovaraju vašoj instalaciji, kao što je [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin izvoz](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Kopiraj nove datoteke na stranicu

Kopiranje novih datoteka na vaše web mjesto gotovo je identično koraku [Pripreme](../../installation/preparations/) tijekom instalacije. Trebali biste kopirati direktorije _xoops_data_ i _xoops_lib_ gdje god su bili premješteni tijekom instalacije. Zatim kopirajte ostatak sadržaja distribucijskog direktorija _htdocs_ (uz nekoliko iznimaka opisanih u sljedećem odjeljku) preko postojećih datoteka i direktorija u vašem web korijenu.

U XOOPS 2.7.0, kopiranje nove distribucije povrh postojeće stranice **neće prebrisati postojeće konfiguracijske datoteke** kao što su `mainfile.php` ili `xoops_data/data/secure.php`. Ovo je dobrodošla promjena u odnosu na ranije verzije, ali ipak biste trebali napraviti punu sigurnosnu kopiju prije početka.

Kopirajte cijeli direktorij _upgrade_ iz distribucije u svoj korijen weba, stvarajući tamo direktorij _upgrade_.

## Pokrenite Smarty 4 provjeru prije leta

Prije pokretanja glavnog tijeka rada `/upgrade/`, morate pokrenuti skener prije leta koji se isporučuje u direktoriju `upgrade/`. Ispituje vaše postojeće probleme kompatibilnosti themes i modula templates za Smarty 4 i može automatski popraviti mnoge od njih.

1. Usmjerite svoj preglednik na _your-site-url_/upgrade/preflight.php
2. Log in with an administrator account
3. Pokrenite skeniranje i pregledajte izvješće
4. Primijenite sve ponuđene automatske popravke ili ručno popravite označeni templates
5. Ponovo pokrenite skeniranje dok ne bude čisto
6. Tek tada nastavite na glavnu nadogradnju

Pogledajte stranicu [Provjera prije leta](preflight.md) za potpuni vodič.

### Stvari koje možda ne želite kopiratiNe biste trebali ponovno kopirati _install_ direktorij u radni XOOPS sustav. Ostavljanje instalacijske mape u vašoj instalaciji XOOPS izlaže vaš sustav potencijalnim sigurnosnim problemima. Instalater ga nasumično preimenuje, ali trebali biste ga izbrisati i pobrinite se da ga ne kopirate u neki drugi.

Postoje neke datoteke koje ste možda uredili kako biste prilagodili svoje web mjesto, a trebali biste ih sačuvati. Ovdje je popis uobičajenih prilagodbi.

* _xoops_data/configs/xoopsconfig.php_ ako je promijenjen od instaliranja stranice
* bilo koji direktoriji u _temama_ ako su prilagođeni vašoj web stranici. U ovom slučaju možda ćete htjeti usporediti datoteke kako biste identificirali korisna ažuriranja.
* bilo koja datoteka u _class/captcha/_ koja počinje s "config" ako je promijenjena od instaliranja stranice
* sve prilagodbe u _class/textsanitizer_
* sve prilagodbe u _class/xoopseditor_

Ako nakon nadogradnje shvatite da je nešto slučajno prepisano, nemojte paničariti - to je razlog zašto ste započeli s potpunom sigurnosnom kopijom. _(Napravili ste sigurnosnu kopiju, zar ne?)_

## Provjerite mainfile.php (nadogradnja sa XOOPS prije 2.5)

Ovaj korak se primjenjuje samo ako nadograđujete sa stare verzije XOOPS (2.3 ili starije). Ako nadograđujete sa XOOPS 2.5.x, možete preskočiti ovaj odjeljak.

Stare verzije XOOPS zahtijevale su neke ručne promjene u `mainfile.php` kako bi se omogućio modul Protector. U vašem web korijenu trebali biste imati datoteku pod nazivom `mainfile.php`. Otvorite tu datoteku u uređivaču i potražite ove retke:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

i

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Uklonite ove retke ako ih pronađete i spremite datoteku prije nastavka.
