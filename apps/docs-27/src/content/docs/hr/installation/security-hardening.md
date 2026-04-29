---
title: "Dodatak 5: Povećajte sigurnost svoje instalacije XOOPS"
---
Nakon instaliranja XOOPS 2.7.0, poduzmite sljedeće korake da očvrsnete mjesto. Svaki korak pojedinačno nije obavezan, ali zajedno značajno podižu osnovnu sigurnost instalacije.

## 1. Instalirajte i konfigurirajte modul Protector

Priloženi modul `protector` je vatrozid XOOPS. Ako ga niste instalirali tijekom početnog čarobnjaka, sada ga instalirajte sa zaslona Admin → moduli.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Otvorite Protector admin panel i pregledajte upozorenja koja prikazuje. Naslijeđene direktive PHP kao što je `register_globals` više ne postoje (PHP 8.2+ ih je uklonio), tako da više nećete vidjeti ta upozorenja. Trenutna upozorenja obično se odnose na dopuštenja direktorija, postavke sesije i konfiguraciju staze povjerenja.

## 2. Zaključajte `mainfile.php` i `secure.php`

Kada instalacijski program završi, pokušava obje datoteke označiti kao samo za čitanje, ali neki hostovi poništavaju dopuštenja. Provjerite i ponovno se prijavite ako je potrebno:

- `mainfile.php` → `0444` (vlasnik, grupa, ostalo samo za čitanje)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` definira konstante puta (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) i proizvodne zastavice. `secure.php` drži vjerodajnice baze podataka:

- U 2.5.x vjerodajnice baze podataka živjele su u `mainfile.php`. Sada su pohranjeni u `xoops_data/data/secure.php`, koji učitava `mainfile.php` tijekom izvođenja. Zadržavanje `secure.php` unutar `xoops_data/` — direktorija koji se potiče da premjestite izvan korijena dokumenta — napadaču je mnogo teže doći do vjerodajnica preko HTTP-a.

## 3. Premjestite `xoops_lib/` i `xoops_data/` izvan korijena dokumenta

Ako to već niste učinili, premjestite ova dva direktorija jednu razinu iznad web korijena i preimenujte ih. Zatim ažurirajte odgovarajuće konstante u `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Postavljanje ovih direktorija izvan korijena dokumenta sprječava izravan pristup stablu `vendor/`, cached templates, datotekama sesije, učitanim podacima i vjerodajnicama baze podataka u `secure.php`.

## 4. Konfiguracija domene kolačića

XOOPS 2.7.0 uvodi dvije konstante domene kolačića u `mainfile.php`:

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

Smjernice:

- Ostavite `XOOPS_COOKIE_DOMAIN` prazno ako poslužujete XOOPS s jednog imena glavnog računala ili s IP-a.
- Upotrijebite puni host (npr. `www.example.com`) da kolačiće postavite samo na taj naziv hosta.
- Koristite domenu koja se može registrirati (npr. `example.com`) kada želite da se kolačići dijele između `www.example.com`, `blog.example.com` itd.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` omogućuje XOOPS da ispravno podijeli složene TLD-ove (`co.uk`, `com.au`, …) umjesto slučajnog postavljanja kolačića na efektivni TLD.

## 5. Oznake proizvodnje u `mainfile.php`

`mainfile.dist.php` se isporučuje s ove dvije zastavice postavljene na `false` za proizvodnju:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

Ostavite ih u proizvodnji. Omogućite ih privremeno u razvojnom ili scenskom okruženju kada želite:

- lov na dugotrajne naslijeđene pozive baze podataka (`XOOPS_DB_LEGACY_LOG = true`);
- površinske `E_USER_DEPRECATED` obavijesti i drugi rezultati otklanjanja pogrešaka (`XOOPS_DEBUG = true`).

## 6. Izbrišite instalacijski programNakon dovršetka instalacije:

1. Izbrišite sve preimenovane direktorije `install_remove_*` iz web korijena.
2. Izbrišite sve `install_cleanup_*.php` skripte koje je čarobnjak kreirao tijekom čišćenja.
3. Potvrdite da direktorij `install/` više nije dostupan putem HTTP-a.

Ostavljanje onemogućenog, ali prisutnog direktorija programa za instalaciju je rizik niske ozbiljnosti, ali se može izbjeći.

## 7. Redovno ažurirajte XOOPS i modules

XOOPS slijedi uobičajenu kadencu zakrpa. Pretplatite se na repozitorij XoopsCore27 GitHub za obavijesti o izdanju i ažurirajte svoje web mjesto i modules treće strane kad god se pojavi novo izdanje. Sigurnosna ažuriranja za 2.7.x objavljena su putem stranice Izdanja repozitorija.
