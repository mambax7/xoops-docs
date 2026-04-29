---
title: "XOOPS Glosar"
description: "Definicije izrazov in konceptov, specifičnih za XOOPS"
---
> Obsežen glosar terminologije in konceptov, specifičnih za XOOPS.

---

## A

### Skrbniški okvir
Standardizirano ogrodje skrbniškega vmesnika, predstavljeno v XOOPS 2.3, zagotavlja dosledne skrbniške strani v modulih.

### Samodejno nalaganje
Samodejno nalaganje razredov PHP, ko so potrebni, z uporabo standarda PSR-4 v sodobnem XOOPS.

---

## B

### Blokiraj
Samostojna vsebinska enota, ki jo je mogoče postaviti v tematska področja. Bloki lahko prikazujejo vsebino modula, HTML po meri ali dinamične podatke.
```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```
### Bootstrap
Postopek inicializacije jedra XOOPS pred izvajanjem kode modula, običajno prek `mainfile.php` in `header.php`.

---

## C

### Merila / CriteriaCompo
Razredi za gradnjo pogojev poizvedbe po bazi podatkov na objektno usmerjen način.
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```
### CSRF (Ponarejanje zahtev med spletnimi mesti)
Varnostni napad preprečen v XOOPS z uporabo varnostnih žetonov prek `XoopsFormHiddenToken`.

---

## D

### DI (vbrizgavanje odvisnosti)
Načrtovalni vzorec, načrtovan za XOOPS 4.0, kjer so odvisnosti vstavljene in ne ustvarjene interno.

### Dirime
Ime imenika modula, ki se uporablja kot enolični identifikator v celotnem sistemu.

### DTYPE (vrsta podatkov)
Konstante, ki določajo, kako so spremenljivke XoopsObject shranjene in razčiščene:
- `XOBJ_DTYPE_INT` - Celo število
- `XOBJ_DTYPE_TXTBOX` - Besedilo (ena vrstica)
- `XOBJ_DTYPE_TXTAREA` - Besedilo (večvrstično)
- `XOBJ_DTYPE_EMAIL` - Elektronski naslov

---

## E

### Dogodek
Dogodek v življenjskem ciklu XOOPS, ki lahko sproži kodo po meri prek prednalaganja ali kavljev.

---

## F

### Okvir
Glej XMF (XOOPS ogrodje modula).

### Element obrazca
Komponenta sistema obrazcev XOOPS, ki predstavlja polje obrazca HTML.

---

## G

### Skupina
Zbirka uporabnikov s skupnimi dovoljenji. Glavne skupine vključujejo: spletne skrbnike, registrirane uporabnike, anonimneže.

---

## H

### Voditelj
Razred, ki upravlja CRUD operacije za primerke XoopsObject.
```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```
### Pomočnik
Razred pripomočkov, ki omogoča enostaven dostop do upravljavcev modulov, konfiguracij in storitev.
```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```
---

## K

### Jedro
Osnovni razredi XOOPS zagotavljajo temeljno funkcionalnost: dostop do baze podatkov, upravljanje uporabnikov, varnost itd.

---

## L

### Jezikovna datoteka
PHP datoteke, ki vsebujejo konstante za internacionalizacijo, shranjene v `language/[code]/` imenikih.

---

## M

### glavna datoteka.php
The primary configuration file for XOOPS containing database credentials and path definitions.

### MCP (Model-Krmilnik-Predstavljalec)
Arhitekturni vzorec, podoben MVC, ki se pogosto uporablja pri razvoju modulov XOOPS.

### Vmesna programska oprema
Programska oprema, ki se nahaja med zahtevo in odgovorom, načrtovana za XOOPS 4.0 z uporabo PSR-15.

### Modul
Samostojen paket, ki razširja funkcionalnost XOOPS, nameščen v imeniku `modules/`.

### MOC (Zemljevid vsebine)
Koncept Obsidian za pregledne opombe, ki se povezujejo na sorodno vsebino.

---

## N

### Imenski prostor
PHP funkcija za organiziranje predavanj, uporabljena v XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```
### Obvestilo
Sistem XOOPS za obveščanje uporabnikov o dogodkih preko elektronske pošte ali PM.

---

## O

### Objekt
Glejte XoopsObject.

---

## P

### Dovoljenje
Nadzor dostopa upravlja prek skupin in upravljavcev dovoljenj.

### Prednalaganje
Razred, ki se priklopi na dogodke XOOPS, samodejno naložen iz imenika `preloads/`.

### PSR (PHP standardno priporočilo)
Standardi od PHP-FIG, ki jih XOOPS 4.0 bodo v celoti izvajali.

---

## R

### Upodabljalnik
Razred, ki izpiše elemente obrazca ali druge komponente uporabniškega vmesnika v posebnih formatih (Bootstrap itd.).

---

## S

### Pametno
Mehanizem predlog, ki ga uporablja XOOPS za ločevanje predstavitve od logike.
```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```
### Storitev
Razred, ki nudi poslovno logiko za večkratno uporabo, do katere običajno dostopate prek pomočnika.

---

## T

### Predloga
Datoteka Smarty (`.tpl` ali `.html`), ki definira predstavitveni sloj za module.

### Tema
Zbirka predlog in sredstev, ki določajo vizualni videz spletnega mesta.

### Žeton
Varnostni mehanizem (CSRF zaščita), ki zagotavlja, da oddaje obrazcev izvirajo iz zakonitih virov.

---

## U

### uid
ID uporabnika - enolični identifikator za vsakega uporabnika v sistemu.

---

## V

### Spremenljivka (Var)
Polje, definirano v objektu XoopsObject z uporabo `initVar()`.

---

## W

### Widget
Majhna, samostojna komponenta uporabniškega vmesnika, podobna blokom.

---

## X

### XMF (XOOPS Ogrodje modula)
Zbirka pripomočkov in razredov za sodoben razvoj modulov XOOPS.

### XOBJ_DTYPE
Konstante za definiranje spremenljivih tipov podatkov v XoopsObject.

### XoopsDatabase
Abstraktna plast baze podatkov, ki zagotavlja izvajanje poizvedbe in uhajanje.

### XoopsForm
Sistem za ustvarjanje obrazcev za programsko ustvarjanje obrazcev HTML.

### XoopsObject
Osnovni razred za vse podatkovne objekte v XOOPS, ki zagotavlja upravljanje in čiščenje spremenljivk.

### xoops_version.php
The module manifest file defining module properties, tables, blocks, templates, and configuration.---

## Pogoste kratice

| Kratica | Pomen |
|---------|---------|
| XOOPS | Razširljiv objektno usmerjen portalski sistem |
| XMF | XOOPS Ogrodje modula |
| CSRF | Ponarejanje zahtev med spletnimi mesti |
| XSS | Skriptno izvajanje med spletnimi mesti |
| ORM | Objektno-relacijsko preslikavo |
| PSR | PHP Priporočilo standardov |
| DI | Injekcija odvisnosti |
| MVC | Model-Pogled-Krmilnik |
| CRUD | Ustvari, preberi, posodobi, izbriši |

---

## 🔗 Povezana dokumentacija

- Temeljni koncepti
- API Sklic
- Zunanji viri

---

#XOOPS #glossary #reference #terminology #definitions