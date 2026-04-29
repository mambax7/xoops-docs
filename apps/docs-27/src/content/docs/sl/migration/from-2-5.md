---
title: Nadgradnja iz XOOPS 2.5 na 2.7
description: Vodnik po korakih za varno nadgradnjo vaše XOOPS namestitve z 2.5.x na 2.7.x.
---
:::previdno [najprej naredite varnostno kopijo]
Pred nadgradnjo vedno varnostno kopirajte bazo podatkov in datoteke. Brez izjem.
:::

## Kaj se je spremenilo v 2.7

- **PHP Zahtevana različica 8.2+** — PHP 7.x ni več podprta
- **Odvisnosti, ki jih upravlja skladatelj** — Jedrne knjižnice, upravljane prek `composer.json`
- **PSR-4 samodejno nalaganje** — Razredi modulov lahko uporabljajo imenske prostore
- **Izboljšan XoopsObject** — Nova varnost tipa `getVar()`, zastarela `obj2Array()`
- **Bootstrap 5 admin** — Administratorska plošča, obnovljena z Bootstrap 5

## Kontrolni seznam pred nadgradnjo

- [ ] PHP 8.2+ na voljo na vašem strežniku
- [ ] Varnostna kopija celotne baze (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Celotna varnostna kopija datoteke vaše namestitve
- [ ] Seznam nameščenih modulov in njihovih različic
- [ ] Tema po meri je varnostno kopirana ločeno

## Koraki nadgradnje

### 1. Stran postavite v vzdrževalni način
```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```
### 2. Prenos XOOPS 2.7
```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```
### 3. Zamenjajte jedrne datoteke

Naložite nove datoteke, **razen**:
- `uploads/` — vaše naložene datoteke
- `xoops_data/` — vaša konfiguracija
- `modules/` — vaši nameščeni moduli
- `themes/` — vaše teme
- `mainfile.php` — konfiguracija vašega spletnega mesta
```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```
### 4. Zaženite skript za nadgradnjo

V brskalniku se pomaknite do `https://yourdomain.com/upgrade/`.
Čarovnik za nadgradnjo bo uporabil selitve baze podatkov.

### 5. Posodobite module

XOOPS 2.7 moduli morajo biti PHP 8.2 združljivi.
Preverite [Ekosistem modula](/XOOPS-docs/2.7/module-guide/introduction/) za posodobljene različice.

V razdelku Admin → Modules kliknite **Posodobi** za vsak nameščen modul.

### 6. Odstranite vzdrževalni način in preizkusite

Odstranite vrstico `XOOPS_MAINTENANCE` iz `mainfile.php` in
preverite, ali se vse strani pravilno nalagajo.

## Pogoste težave

**Napake »Razreda ni bilo mogoče najti« po nadgradnji**
- Zaženite `composer dump-autoload` v korenu XOOPS
- Počistite imenik `xoops_data/caches/`

**Modul po posodobitvi pokvarjen**
- Preverite izdaje modula GitHub za različico, združljivo z 2.7
- Modul bo morda potreboval spremembe kode za PHP 8.2 (zastarele funkcije, tipizirane lastnosti)

**Administratorska plošča CSS pokvarjena**
- Počistite predpomnilnik brskalnika
- Prepričajte se, da je bil `xoops_lib/` v celoti zamenjan med nalaganjem datoteke