---
title: Nadogradnja sa XOOPS 2.5 na 2.7
description: Vodič korak po korak za sigurnu nadogradnju vaše XOOPS instalacije s 2.5.x na 2.7.x.
---
:::oprez[prvo napravite sigurnosnu kopiju]
Prije nadogradnje uvijek napravite sigurnosnu kopiju svoje baze podataka i datoteka. Nema izuzetaka.
:::

## Što se promijenilo u 2.7

- **Potreban je PHP 8.2+** — PHP 7.x više nije podržan
- **Ovisnosti kojima upravlja skladatelj** — Osnovnim bibliotekama upravlja putem `composer.json`
- **PSR-4 automatsko učitavanje** — modul classes može koristiti prostore imena
- **Poboljšani XoopsObject** — Nova sigurnost tipa `getVar()`, zastarjelo `obj2Array()`
- **Bootstrap 5 admin** — administratorska ploča ponovno izgrađena s Bootstrapom 5

## Kontrolni popis prije nadogradnje

- [ ] PHP 8.2+ dostupan na vašem poslužitelju
- [ ] Potpuna sigurnosna kopija baze podataka (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Potpuna sigurnosna kopija vaše instalacije
- [ ] Popis instaliranih modules i njihovih verzija
- [ ] Prilagođena tema zasebno je sigurnosno kopirana

## Koraci nadogradnje

### 1. Stavite stranicu u način održavanja

```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```

### 2. Preuzmite XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Zamijenite osnovne datoteke

Učitajte nove datoteke, **isključujući**:
- `uploads/` — vaše prenesene datoteke
- `xoops_data/` — vaša konfiguracija
- `modules/` — vaš instalirani modules
- `themes/` — vaš themes
- `mainfile.php` — konfiguracija vaše stranice

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Pokrenite skriptu za nadogradnju

Dođite do `https://yourdomain.com/upgrade/` u svom pregledniku.
Čarobnjak za nadogradnju primijenit će migracije baze podataka.

### 5. Ažurirajte modules

XOOPS 2.7 modules mora biti kompatibilan sa PHP 8.2.
Provjerite [Ekosustav modula](/xoops-docs/2.7/module-guide/introduction/) za ažurirane verzije.

U Administrator → moduli kliknite **Ažuriraj** za svaki instalirani modul.

### 6. Uklonite način održavanja i testirajte

Uklonite liniju `XOOPS_MAINTENANCE` iz `mainfile.php` i
provjerite da li se sve stranice pravilno učitavaju.

## Uobičajeni problemi

**Pogreške "Razred nije pronađen" nakon nadogradnje**
- Pokrenite `composer dump-autoload` u korijenu XOOPS
- Obrišite direktorij `xoops_data/caches/`

**modul je pokvaren nakon ažuriranja**
- Provjerite GitHub izdanja modula za verziju kompatibilnu s 2.7
- Modulu su možda potrebne promjene koda za PHP 8.2 (zastarjele funkcije, upisana svojstva)

**administratorska ploča CSS pokvarena**
- Očistite preglednik cache
- Provjerite je li `xoops_lib/` potpuno zamijenjen tijekom učitavanja datoteke
