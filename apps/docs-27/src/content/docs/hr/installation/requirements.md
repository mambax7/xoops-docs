---
title: "Zahtjevi"
---
## Softversko okruženje (skup)

Većina XOOPS produkcijskih stranica radi na _LAMP_ stogu (**L**inux sustav koji pokreće **A**pache, **M**ySQL i **P**HP), ali postoji mnogo različitih mogućih nizova.

Često je najlakše izraditi prototip nove stranice na lokalnom računalu. Za ovaj slučaj, mnogi korisnici XOOPS odabiru _WAMP_ stog (koristeći **W**indows kao OS), dok drugi pokreću _LAMP_ ili _MAMP_ (**M**AC) nizove.

### PHP

Bilo koja verzija PHP &gt;= 8.2.0 (preporuča se PHP 8.4 ili novija)

> **Važno:** XOOPS 2.7.0 zahtijeva **PHP 8.2 ili noviji**. PHP 7.x i ranije više nisu podržane. Ako nadograđujete stariju stranicu, potvrdite da vaš host nudi PHP 8.2+ prije početka.

### MySQL

MySQL poslužitelj 5.7 ili noviji (strogo se preporučuje MySQL poslužitelj 8.4 ili noviji.) MySQL 9.0 je također podržan. MariaDB je unatrag kompatibilna, binarna zamjena za MySQL, a dobro radi i sa XOOPS.

### Web poslužitelj

Web poslužitelj koji podržava pokretanje PHP skripti, kao što su Apache, NGINX, LiteSpeed itd.

### Potrebna proširenja PHP

Instalacijski program XOOPS provjerava jesu li sljedeća proširenja učitana prije nego što dopusti nastavak instalacije:

* `mysqli` — MySQL upravljački program baze podataka
* `session` — rukovanje sesijom
* `pcre` — Perl-kompatibilni regularni izrazi
* `filter` — ulazno filtriranje i provjera valjanosti
* `fileinfo` — otkrivanje tipa MIME za uploads

### Potrebne postavke PHP

Uz gore navedena proširenja, instalacijski program provjerava sljedeću postavku `php.ini`:

* `file_uploads` mora biti **Uključeno** — bez njega XOOPS ne može prihvatiti učitane datoteke

### Preporučena proširenja PHP

Instalacijski program također provjerava ova proširenja. Nisu striktno potrebni, ali XOOPS i većina modules oslanjaju se na njih za punu funkcionalnost. Omogućite onoliko koliko vaš host dopušta:

* `mbstring` — rukovanje višebajtnim nizovima
* `intl` — internacionalizacija
* `iconv` — pretvorba skupa znakova
* `xml` — raščlanjivanje XML
* `zlib` — kompresija
* `gd` — obrada slike
* `exif` — metapodaci slike
* `curl` — HTTP klijent za feedove i API pozive

## Usluge

### Pristup sustavu datoteka (za pristup webmasteru)

Trebat će vam neka metoda (FTP, SFTP, itd.) za prijenos distribucijskih datoteka XOOPS na web poslužitelj.

### Pristup sustavu datoteka (za proces web poslužitelja)

Za pokretanje XOOPS potrebna je mogućnost stvaranja, čitanja i brisanja datoteka i direktorija. Proces web poslužitelja mora imati mogućnost pisanja u sljedeće staze za normalnu instalaciju i normalan svakodnevni rad:* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (može se pisati tijekom instalacije i nadogradnje)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### baza podataka

XOOPS će morati kreirati, modificirati i postavljati upite u tablice u MySQL. Za ovo će vam trebati:

* MySQL korisnički račun i lozinka
* baza podataka MySQL za koju korisnik ima sve privilegije (ili alternativno, korisnik može imati privilegiju za stvaranje takve baze podataka)

### E-pošta

Za web mjesto uživo trebat će vam radna adresa e-pošte koju XOOPS može koristiti za korisničku komunikaciju, kao što su aktivacije računa i ponovno postavljanje lozinke. Iako nije striktno potrebno, preporuča se ako je moguće koristiti adresu e-pošte koja odgovara domeni na kojoj radi vaš XOOPS. To pomaže da izbjegnete da vaša komunikacija na kraju bude odbijena ili označena kao neželjena pošta.

## Alati

Možda će vam trebati dodatni alati za postavljanje i prilagodbu instalacije XOOPS. Ovo mogu include:

* FTP klijentski softver
* Uređivač teksta
* Softver za arhiviranje za rad s datotekama izdanja XOOPS (_.zip_ ili _.tar.gz_).

Pogledajte odjeljak [Tools of the Trade](../tools/tools.md) za neke prijedloge za odgovarajuće alate i skupove web poslužitelja ako je potrebno.

## Posebne teme

Neke specifične kombinacije softvera sustava mogu zahtijevati neke dodatne konfiguracije za rad sa XOOPS. Ako koristite SELinux okruženje ili nadograđujete stariju stranicu s prilagođenim themes, pogledajte [Posebne teme](specialtopics.md) za više informacija.
