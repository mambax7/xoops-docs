---
title: "Premještanje stranice"
---
Može biti vrlo korisna tehnika napraviti prototip nove XOOPS stranice na lokalnom sustavu ili razvojnom poslužitelju. Također može biti vrlo mudro prvo testirati XOOPS nadogradnju na kopiji vaše proizvodne stranice, samo u slučaju da nešto pođe po zlu. Da biste to postigli, morate biti u mogućnosti premjestiti svoje XOOPS mjesto s jednog mjesta na drugo. Evo što trebate znati kako biste uspješno premjestili svoju XOOPS stranicu.

Prvi korak je uspostavljanje vašeg novog okruženja stranice. Iste stavke koje su pokrivene u odjeljku [Napredne pripreme](../installation/preparations/) vrijede i ovdje.

U pregledu, ti su koraci sljedeći:

* nabavite hosting, uključujući zahtjeve za naziv domene ili e-poštu
* dobiti MySQL korisnički račun i lozinku
* dobiti MySQL bazu podataka na kojoj gornji korisnik ima sve privilegije

Ostatak procesa prilično je sličan normalnoj instalaciji, ali:

* umjesto kopiranja datoteka iz distribucije XOOPS, kopirat ćete ih s postojećeg mjesta
* umjesto pokretanja instalacijskog programa, uvest ćete već popunjenu bazu podataka
* umjesto unosa odgovora u instalacijski program, promijenit ćete prethodne odgovore u datotekama i bazi podataka

## Kopirajte postojeće datoteke stranice

Napravite punu kopiju datoteka vaše postojeće stranice na vašem lokalnom računalu gdje ih možete uređivati. Ako radite s udaljenim hostom, možete koristiti FTP za kopiranje datoteka. Potrebna vam je kopija za rad čak i ako je stranica pokrenuta na vašem lokalnom računalu, samo napravite još jednu kopiju direktorija stranice u tom slučaju.

Važno je zapamtiti include direktorije _xoops_data_ i _xoops_lib_ čak i ako su preimenovani i/ili premješteni.

Kako bi stvari bile glatke, trebali biste eliminirati cache i Smarty kompilirane templates datoteke iz vaše kopije. Ove će se datoteke ponovno izraditi u vašem novom okruženju i mogle bi uzrokovati probleme sa zadržavanjem starih netočnih informacija ako se ne izbrišu. Da biste to učinili, izbrišite sve datoteke, osim _index.html_, u sva tri ova direktorija:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Napomena:** Brisanje `smarty_compile` je posebno važno kada premještate stranicu na ili sa XOOPS 2.7.0. XOOPS 2.7.0 koristi Smarty 4, i Smarty 4 kompilirano templates nisu zamjenjivi sa Smarty 3 kompilirano templates. Ostavljanje ustajalih kompiliranih datoteka na mjestu uzrokovat će pogreške predloška pri učitavanju prve stranice na novoj stranici.

### `xoops_lib` i ovisnosti o kompozitoru

XOOPS 2.7.0 upravlja svojim ovisnostima PHP putem Composer-a, unutar `xoops_lib/`. Direktorij `xoops_lib/vendor/` sadrži biblioteke trećih strana koje su XOOPS potrebne za vrijeme izvođenja (Smarty 4, PHPMailer, HTMLPurifier itd.). Kada premještate web mjesto, morate kopirati cijelo stablo `xoops_lib/` — uključujući `vendor/` — na novi host. Ne pokušavajte ponovno generirati `vendor/` na ciljnom hostu osim ako niste programer koji je prilagodio `composer.json` i ima Composer dostupan na ciljnom računalu.

## Postavite novo okruženjeIste stavke koje su pokrivene u odjeljku [Napredne pripreme](../installation/preparations/) vrijede i ovdje. Ovdje ćemo pretpostaviti da imate bilo kakav hosting koji vam je potreban za web mjesto koje premještate.

### Ključne informacije (mainfile.php i secure.php)

Uspješno premještanje stranice uključuje promjenu svih referenci na apsolutne nazive datoteka i staza, URL-ove, parametre baze podataka i pristupne vjerodajnice.

Dvije datoteke, `mainfile.php` u web-korijenu vaše web-lokacije i `data/secure.php` u (preimenovanom i/ili premještenom) _xoops_data_ direktoriju vaše web-lokacije definiraju osnovne parametre vaše web-lokacije, kao što je URL, gdje se nalazi u glavnoj datoteci sustav i kako se povezuje s bazom podataka.

Morat ćete znati koje su vrijednosti u starom sustavu i koje će biti u novom sustavu.

#### mainfile.php

| Ime | Stara vrijednost u mainfile.php | Nova vrijednost u mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_STAZA |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Otvorite _mainfile.php_ u uređivaču. Promijenite vrijednosti za definicije prikazane u gornjoj tablici sa starih vrijednosti na odgovarajuće vrijednosti za novu stranicu.

Vodite bilješke o starim i novim vrijednostima jer ćemo trebati izvršiti slične promjene na drugim mjestima u nekim kasnijim koracima.

Na primjer, ako premještate web mjesto s lokalnog računala na komercijalnu uslugu hostinga, vaše bi vrijednosti mogle izgledati ovako:

| Ime | Stara vrijednost u mainfile.php | Nova vrijednost u mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_STAZA | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | lokalni domaćin | primjer.com |

Nakon što promijenite _mainfile.php_, spremite ga.

Moguće je da neke druge datoteke mogu sadržavati tvrdo kodirane reference na vaš URL ili čak staze. Ovo je vjerojatnije u prilagođenom themes i izbornicima, ali sa svojim uređivačem možete pretraživati ​​sve datoteke, čisto da budete sigurni.

U uređivaču pretražite datoteke u svojoj kopiji, tražeći staru vrijednost XOOPS_URL i zamijenite je novom vrijednošću.

Učinite isto za staru vrijednost XOOPS_ROOT_PATH, zamjenjujući sva pojavljivanja novom vrijednošću.

Čuvajte svoje bilješke, jer ćemo ih morati ponovno koristiti kasnije dok premještamo bazu podataka.

#### podaci/sigurno.php

| Name | Old Value in data/secure.php | New Value in data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Otvorite _data/secure.php_ u preimenovanom i/ili premještenom _xoops_data_ direktoriju u svom uređivaču. Promijenite vrijednosti za definicije prikazane u gornjoj tablici sa starih vrijednosti na odgovarajuće vrijednosti za novu stranicu.

#### Ostale datoteke

Možda postoje druge datoteke na koje treba obratiti pažnju kada se vaše web mjesto premjesti. Neki uobičajeni primjeri su API ključevi za razne usluge koje mogu biti povezane s domenom, kao što su:

* Google karte
* Recaptch2
* Kao gumbi
* Dijeljenje poveznica i/ili oglašavanje poput Shareaholic ili AddThisPromjena ove vrste pridruživanja ne može se lako automatizirati, budući da su veze sa starom domenom obično dio registracije na strani usluge. U nekim slučajevima to može jednostavno dodati ili promijeniti domenu povezanu s uslugom.

### Kopirajte datoteke na novo mjesto

Kopirajte svoje sada izmijenjene datoteke na svoju novu stranicu. Tehnike su iste koje su korištene tijekom [Instalacije](../installation/installation/), tj. koristeći FTP.

## Kopirajte postojeću bazu podataka stranice

### Izradite sigurnosnu kopiju baze podataka sa starog poslužitelja

Za ovaj se korak preporučuje korištenje _phpMyAdmin_. Prijavite se na _phpMyAdmin_ za svoju postojeću stranicu, odaberite svoju bazu podataka i odaberite _Izvoz_.

Zadane postavke su obično u redu, pa samo odaberite "Metoda izvoza" od _Quick_ i "Format" od _SQL_.

Koristite gumb _Idi_ za preuzimanje sigurnosne kopije baze podataka.

![Izvoz baze podataka s phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Ako imate tablice u svojoj bazi podataka koje nisu iz XOOPS ili njegovog modules, i NE bi se trebale premještati, trebali biste odabrati "Metodu izvoza" od _Prilagođeno_ i odabrati samo XOOPS povezane tablice u vašoj bazi podataka. (Oni počinju s "prefiksom" koji ste naveli tijekom instalacije. Možete potražiti prefiks vaše baze podataka u datoteci `xoops_data/data/secure.php`.)

### Vratite bazu podataka na novi poslužitelj

Na vašem novom hostu, pomoću vaše nove baze podataka, vratite bazu podataka pomoću [alata](../tools/tools.md) kao što je kartica _Import_ u _phpMyAdmin_ (ili _bigdump_ ako je potrebno.)

### Ažurirajte URL-ove i staze u bazi podataka

Ažurirajte sve http veze na resurse na vašoj web stranici u vašoj bazi podataka. To može biti veliki napor, a postoji [alat](../tools/tools.md) koji to olakšava.

Interconnect/it ima proizvod pod nazivom Search-Replace-DB koji može pomoći u tome. Dolazi s ugrađenim okruženjima Wordpress i Drupal. Ovako, ovaj alat može biti od velike pomoći, ali je još bolji kada je svjestan vašeg XOOPS. Možete pronaći XOOPS svjesnu verziju na [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Slijedite upute u datoteci README.md da biste preuzeli i privremeno instalirali ovaj uslužni program na svoju stranicu. Ranije smo promijenili definiciju XOOPS_URL. Kada pokrenete ovaj alat, želite zamijeniti izvornu XOOPS_URL definiciju novom definicijom, tj. zamijeniti [http://localhost/xoops](http://localhost/xoops) s [https://example.com](https://example.com)

![Upotreba pretraživanja i zamjene DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Unesite svoj stari i novi URL i odaberite opciju suhog rada. Pregledajte promjene i ako sve izgleda dobro, odaberite opciju pokretanja uživo. Ovaj korak će uhvatiti konfiguracijske stavke i veze unutar vašeg sadržaja koji se odnose na vašu web stranicu URL.

![Pregled izmjena u SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Ponovite postupak koristeći stare i nove vrijednosti za XOOPS_ROOT_PATH.

#### Alternativni pristup bez SRDB

Drugi način za postizanje ovog koraka bez srdb alata bio bi ispis baze podataka, uređivanje ispisa u uređivaču teksta mijenjajući URL-ove i staze, a zatim ponovno učitavanje baze podataka iz uređenog ispisa. Da, taj je proces dovoljno uključen i nosi dovoljno rizika da su ljudi bili motivirani stvoriti specijalizirane alate kao što je Search-Replace-DB.

## Isprobajte svoju premještenu stranicu

U ovom trenutku vaša bi stranica trebala biti spremna za rad u novom okruženju!Problema, naravno, uvijek može biti. Ne bojte se postavljati pitanja na [xoops.org forumima](https://xoops.org/modules/newbb/index.php).
