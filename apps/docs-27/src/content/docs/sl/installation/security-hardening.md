---
title: "Dodatek 5: Povečajte varnost vaše namestitve XOOPS"
---
Po namestitvi XOOPS 2.7.0 izvedite naslednje korake za utrjevanje mesta. Vsak korak je posamično neobvezen, vendar skupaj bistveno povečajo osnovno varnost namestitve.

## 1. Namestite in konfigurirajte modul Protector

Priloženi modul `protector` je požarni zid XOOPS. Če ga niste namestili med začetnim čarovnikom, ga zdaj namestite na zaslonu Admin → Modules.

![](/XOOPS-docs/2.7/img/installation/img_73.jpg)

Odprite skrbniško ploščo Protectorja in preglejte opozorila, ki jih prikazuje. Podedovane direktive PHP, kot je `register_globals`, ne obstajajo več (PHP 8.2+ jih je odstranil), zato teh opozoril ne boste več videli. Trenutna opozorila se običajno nanašajo na dovoljenja imenika, nastavitve seje in konfiguracijo poti zaupanja.

## 2. Zakleni `mainfile.php` in `secure.php`

Ko namestitveni program konča, poskuša obe datoteki označiti kot samo za branje, vendar nekateri gostitelji razveljavijo dovoljenja. Preverite in po potrebi znova uporabite:

- `mainfile.php` → `0444` (lastnik, skupina, drugo samo za branje)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` določa konstante poti (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) in proizvodne zastavice. `secure.php` hrani poverilnice baze podatkov:- V 2.5.x so poverilnice baze podatkov živele v `mainfile.php`. Zdaj so shranjeni v `xoops_data/data/secure.php`, ki ga naloži `mainfile.php` med izvajanjem. Če `secure.php` hranite znotraj `xoops_data/` – imenika, ki ga priporočamo, da premaknete izven korena dokumenta – napadalec veliko težje doseže poverilnice nad HTTP.

## 3. Premaknite `xoops_lib/` in `xoops_data/` izven korena dokumenta

Če tega še niste storili, premaknite ta dva imenika eno raven nad svoj spletni koren in ju preimenujte. Nato posodobite ustrezne konstante v `mainfile.php`:
```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```
Postavitev teh imenikov zunaj korena dokumenta preprečuje neposreden dostop do drevesa Composer `vendor/`, predpomnjenih predlog, datotek sej, naloženih podatkov in poverilnic baze podatkov v `secure.php`.

## 4. Konfiguracija domene piškotkov

XOOPS 2.7.0 uvaja dve konstanti domene piškotka v `mainfile.php`:
```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```
Smernice:

- Pustite `XOOPS_COOKIE_DOMAIN` prazno, če strežete XOOPS z enega samega imena gostitelja ali z IP-ja.
- Uporabite polnega gostitelja (npr. `www.example.com`), da piškotke razširite samo na to ime gostitelja.
- Uporabite domeno, ki jo je mogoče registrirati (npr. `example.com`), če želite, da se piškotki delijo med `www.example.com`, `blog.example.com` itd.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` omogoča XOOPS pravilno razdelitev sestavljenih TLD (`co.uk`, `com.au`, …), namesto da pomotoma nastavi piškotek na efektivni TLD.

## 5. Proizvodne zastavice v `mainfile.php`

`mainfile.dist.php` se pošilja s tema dvema zastavama, nastavljenima na `false` za proizvodnjo:
```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```
Pustite jih pri proizvodnji. Začasno jih omogočite v razvojnem ali uprizoritvenem okolju, ko želite:

- odkrivanje dolgotrajnih klicev baze podatkov (`XOOPS_DB_LEGACY_LOG = true`);
- površinska `E_USER_DEPRECATED` obvestila in drugi rezultati odpravljanja napak (`XOOPS_DEBUG = true`).

## 6. Izbrišite namestitveni program

Ko je namestitev končana:

1. Izbrišite vse preimenovane imenike `install_remove_*` iz spletnega korena.
2. Izbrišite vse skripte `install_cleanup_*.php`, ki jih je čarovnik ustvaril med čiščenjem.
3. Potrdite, da imenik `install/` ni več dosegljiv prek HTTP.

Če zapustite onemogočen, vendar prisoten imenik namestitvenega programa, je tveganje nizke resnosti, a se mu lahko izognete.

## 7. Posodabljajte XOOPS in module

XOOPS sledi redni kadenci popravkov. Naročite se na repozitorij XoopsCore27 GitHub za obvestila o izdajah in posodobite svoje spletno mesto in morebitne module tretjih oseb, ko pride nova izdaja. Varnostne posodobitve za 2.7.x so objavljene na strani Releases v repozitoriju.