---
title: "XOOPS Rječnik"
description: "Definicije izraza i koncepata specifičnih za XOOPS"
---
> Sveobuhvatni rječnik terminologije i koncepata specifičnih za XOOPS.

---

## A

### Administratorski okvir
Standardizirani okvir sučelja administrative predstavljen u XOOPS 2.3, pruža dosljedne admin stranice u modules.

### Automatsko učitavanje
Automatsko učitavanje PHP classes kada su potrebni, koristeći standard PSR-4 u modernom XOOPS.

---

## B

### Blokiraj
Samostalna jedinica sadržaja koja se može postaviti u tematske regije. Blokovi mogu prikazati sadržaj modula, prilagođene HTML ili dinamičke podatke.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Proces inicijalizacije jezgre XOOPS prije izvršavanja koda modula, obično putem `mainfile.php` i `header.php`.

---

## C

### Kriteriji / CriteriaCompo
Klase za izgradnju uvjeta upita baze podataka na objektno orijentiran način.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Krivotvorenje zahtjeva s više stranica)
Sigurnosni napad spriječen u XOOPS korištenjem sigurnosnih tokena putem `XoopsFormHiddenToken`.

---

## D

### DI (injekcija ovisnosti)
Uzorak dizajna planiran za XOOPS 4.0 gdje se ovisnosti ubacuju, a ne stvaraju interno.

### Dirname
Naziv direktorija modula koji se koristi kao jedinstveni identifikator u cijelom sustavu.

### DTYPE (vrsta podataka)
Konstante koje definiraju kako se varijable XoopsObject pohranjuju i čiste:
- `XOBJ_DTYPE_INT` - Cijeli broj
- `XOBJ_DTYPE_TXTBOX` - Tekst (jedan red)
- `XOBJ_DTYPE_TXTAREA` - Tekst (više redaka)
- `XOBJ_DTYPE_EMAIL` - Adresa e-pošte

---

## E

### Događaj
Pojava u životnom ciklusu XOOPS koja može pokrenuti prilagođeni kod putem predučitavanja ili zakačenja.

---

## F

### Okvir
Pogledajte XMF (XOOPS okvir modula).

### Element obrasca
Komponenta sustava obrasca XOOPS koja predstavlja polje obrasca HTML.

---

## G

### Grupa
Zbirka korisnika sa zajedničkim dopuštenjima. Osnovne grupe include: Webmasteri, Registrirani korisnici, Anonimni.

---

## H

### Rukovatelj
class koji upravlja operacijama CRUD za instance XoopsObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Pomoćnik
Uslužni program class koji omogućuje jednostavan pristup rukovateljima modulima, konfiguracijama i uslugama.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Jezgra XOOPS classes pruža temeljnu funkcionalnost: pristup bazi podataka, upravljanje korisnicima, sigurnost itd.

---

## L

### Jezična datoteka
PHP datoteke koje sadrže konstante za internacionalizaciju, pohranjene u direktorije `language/[code]/`.

---

## M

### mainfile.php
Primarna konfiguracijska datoteka za XOOPS koja sadrži vjerodajnice baze podataka i definicije puta.

### MCP (Model-Controller-Presenter)
Arhitektonski uzorak sličan MVC, koji se često koristi u razvoju modula XOOPS.

### Middleware
Softver koji se nalazi između zahtjeva i odgovora, planiran za XOOPS 4.0 koristeći PSR-15.

### modul
Samostalni paket koji proširuje funkcionalnost XOOPS, instaliran u direktoriju `modules/`.

### MOC (Mapa sadržaja)
Obsidian koncept za pregledne bilješke koje povezuju na povezani sadržaj.

---

## N### Imenski prostor
Značajka PHP za organiziranje classes, koja se koristi u XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Obavijest
XOOPS sustav za obavještavanje korisnika o događajima putem e-pošte ili PM-a.

---

## O

### Objekt
Pogledajte XoopsObject.

---

## P

### Dopuštenje
Kontrola pristupa upravljana putem grupa i rukovatelja dozvolama.

### Predučitavanje
class koji se spaja na događaje XOOPS, automatski se učitava iz direktorija `preloads/`.

### PSR (PHP standardna preporuka)
Standardi iz PHP-FIG koje će XOOPS 4.0 u potpunosti implementirati.

---

## R

### Renderer
class koji daje elemente obrasca ili druge komponente korisničkog sučelja u određenim formatima (Bootstrap, itd.).

---

## S

### Smarty
predložak koji koristi XOOPS za odvajanje prezentacije od logike.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Usluga
class pruža višekratnu poslovnu logiku, kojoj se obično pristupa preko Helpera.

---

## T

### predložak
Datoteka Smarty (`.tpl` ili `.html`) koja definira prezentacijski sloj za modules.

### tema
Zbirka templates i assets koja definira vizualni izgled stranice.

### Token
Sigurnosni mehanizam (zaštita CSRF) koji osigurava da podnošenje obrazaca potječe iz legitimnih izvora.

---

## U

### uid
ID korisnika - jedinstveni identifikator za svakog korisnika u sustavu.

---

## V

### Varijabla (Var)
Polje definirano na XoopsObjectu koristeći `initVar()`.

---

## W

### Widget
Mala, samostalna komponenta korisničkog sučelja, slična blokovima.

---

## X

### XMF (XOOPS okvir modula)
Zbirka pomoćnih programa i classes za moderni razvoj modula XOOPS.

### XOBJ_DTYPE
Konstante za definiranje varijabilnih tipova podataka u XoopsObject.

### Xoops baza podataka
Sloj apstrakcije baze podataka koji omogućuje izvođenje i izbjegavanje upita.

### XoopsForm
Sustav za generiranje obrazaca za kreiranje obrazaca HTML programski.

### XoopsObject
Baza class za sve podatkovne objekte u XOOPS, pružajući upravljanje varijablama i sanaciju.

### xoops_version.php
Datoteka manifesta modula koja definira svojstva modula, tablice, blokove, templates i konfiguraciju.

---

## Uobičajeni akronimi

| Akronim | Značenje |
|---------|---------|
| XOOPS | Proširivi objektno orijentirani portalski sustav |
| XMF | XOOPS Okvir modula |
| CSRF | Krivotvorenje zahtjeva između web-mjesta |
| XSS | Skriptiranje na različitim mjestima |
| ORM | Objektno-relacijsko preslikavanje |
| PSR | PHP Preporuka standarda |
| DI | Injekcija ovisnosti |
| MVC | Model-View-Controller |
| CRUD | Stvaranje, čitanje, ažuriranje, brisanje |

---

## 🔗 Povezana dokumentacija

- Temeljni koncepti
- API Referenca
- Vanjski resursi

---

#xoops #glosar #referenca #terminologija #definicije
