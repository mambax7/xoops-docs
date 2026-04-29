---
title: "XOOPS Ordliste"
description: "Definitioner af XOOPS-specifikke termer og begreber"
---

> Omfattende ordliste med XOOPS-specifik terminologi og begreber.

---

## A

### Admin Framework
Den standardiserede administrative grænseflade, der blev introduceret i XOOPS 2.3, giver ensartede administratorsider på tværs af moduler.

### Autoloading
Den automatiske indlæsning af PHP klasser, når de er nødvendige, ved hjælp af PSR-4 standard i moderne XOOPS.

---

## B

### Bloker
En selvstændig indholdsenhed, der kan placeres i temaområder. Blokke kan vise modulindhold, tilpasset HTML eller dynamiske data.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Processen med at initialisere XOOPS kerne før udførelse af modulkode, typisk gennem `mainfile.php` og `header.php`.

---

## C

### Kriterier / CriteriaCompo
Klasser til opbygning af databaseforespørgselsbetingelser på en objektorienteret måde.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Forfalskning af anmodninger på tværs af websteder)
Et sikkerhedsangreb forhindret i XOOPS ved hjælp af sikkerhedstokens via `XoopsFormHiddenToken`.

---

## D

### DI (Dependency Injection)
Et designmønster planlagt til XOOPS 4.0, hvor afhængigheder injiceres i stedet for internt.

### Dirname
Biblioteksnavnet på et modul, der bruges som en unik identifikator i hele systemet.

### DTYPE (datatype)
Konstanter, der definerer, hvordan XoopsObject-variabler lagres og renses:
- `XOBJ_DTYPE_INT` - Heltal
- `XOBJ_DTYPE_TXTBOX` - Tekst (enkelt linje)
- `XOBJ_DTYPE_TXTAREA` - Tekst (flerlinjer)
- `XOBJ_DTYPE_EMAIL` - E-mailadresse

---

## E

### Begivenhed
En forekomst i XOOPS-livscyklussen, der kan udløse tilpasset kode gennem forudindlæsninger eller kroge.

---

## F

### Ramme
Se XMF (XOOPS Module Framework).

### Formelement
En komponent i XOOPS-formularsystemet, der repræsenterer et HTML-formularfelt.

---

## G

### Gruppe
En samling af brugere med delte tilladelser. Kernegrupper omfatter: Webmastere, Registrerede Brugere, Anonyme.

---

## H

### Behandler
En klasse, der administrerer CRUD-operationer for XoopsObject-forekomster.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Hjælper
En hjælpeklasse, der giver nem adgang til modulhandlere, konfigurationer og tjenester.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Kerneklasserne XOOPS giver grundlæggende funktionalitet: databaseadgang, brugeradministration, sikkerhed osv.

---

## L

### Sprogfil
PHP filer, der indeholder konstanter til internationalisering, gemt i `language/[code]/` mapper.

---

## M

### hovedfil.php
Den primære konfigurationsfil for XOOPS, der indeholder databaselegitimationsoplysninger og stidefinitioner.

### MCP (Model-Controller-Presenter)
Et arkitektonisk mønster, der ligner MVC, ofte brugt i XOOPS-moduludvikling.

### Middleware
Software, der sidder mellem anmodningen og svaret, planlagt til XOOPS 4.0 ved hjælp af PSR-15.

### Modul
En selvstændig pakke, der udvider XOOPS-funktionaliteten, installeret i `modules/`-biblioteket.

### MOC (Indholdskort)
Et Obsidian-koncept til oversigtsnotater, der linker til relateret indhold.

---

## N

### Navneområde
PHP-funktion til organisering af klasser, brugt i XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Meddelelse
XOOPS-systemet til at advare brugere om begivenheder via e-mail eller PM.

---

## O

### Objekt
Se XoopsObject.

---

## P

### Tilladelse
Adgangskontrol administreres gennem grupper og tilladelsesbehandlere.

### Forudindlæs
En klasse, der tilslutter sig XOOPS begivenheder, indlæst automatisk fra `preloads/` bibliotek.

### PSR (PHP standardanbefaling)
Standarder fra PHP-FIG, som XOOPS 4.0 vil implementere fuldt ud.

---

## R

### Renderer
En klasse, der udsender formelementer eller andre UI-komponenter i specifikke formater (Bootstrap osv.).

---

## S

### Smart
Skabelonmotoren brugt af XOOPS til at adskille præsentation fra logik.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Service
En klasse, der giver genanvendelig forretningslogik, som typisk tilgås via Hjælperen.

---

## T### Skabelon
En Smarty-fil (`.tpl` eller `.html`), der definerer præsentationslaget for moduler.

### Tema
En samling skabeloner og aktiver, der definerer webstedets visuelle udseende.

### Token
En sikkerhedsmekanisme (CSRF-beskyttelse), der sikrer, at formularindsendelser stammer fra legitime kilder.

---

## U

### uid
Bruger-id - den unikke identifikator for hver bruger i systemet.

---

## V

### Variabel (Var)
Et felt defineret på en XoopsObject ved hjælp af `initVar()`.

---

## W

### Widget
En lille, selvstændig UI-komponent, der ligner blokke.

---

## X

### XMF (XOOPS Modul Framework)
En samling af hjælpeprogrammer og klasser til moderne XOOPS-moduludvikling.

### XOBJ_DTYPE
Konstanter til at definere variable datatyper i XoopsObject.

### XoopsDatabase
Databaseabstraktionslaget giver forespørgselsudførelse og escape.

### XoopsForm
Formgenereringssystemet til at oprette HTML-formularer programmatisk.

### XoopsObject
Basisklassen for alle dataobjekter i XOOPS, der giver variabel styring og rensning.

### xoops_version.php
Modulmanifestfilen, der definerer modulegenskaber, tabeller, blokke, skabeloner og konfiguration.

---

## Almindelige akronymer

| Akronym | Betydning |
|--------|--------|
| XOOPS | eXtensible objektorienteret portalsystem |
| XMF | XOOPS Modulramme |
| CSRF | Forfalskning af anmodninger på tværs af websteder |
| XSS | Cross-Site Scripting |
| ORM | Objekt-relationel kortlægning |
| PSR | PHP Standardanbefaling |
| DI | Dependency Injection |
| MVC | Model-View-Controller |
| CRUD | Opret, læs, opdater, slet |

---

## 🔗 Relateret dokumentation

- Kernekoncepter
- API Reference
- Eksterne ressourcer

---

#xoops #ordliste #reference #terminologi #definitioner
