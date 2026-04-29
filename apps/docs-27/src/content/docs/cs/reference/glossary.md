---
title: "XOOPS Slovník"
description: "Definice termínů a konceptů specifických pro XOOPS"
---

> Komplexní glosář terminologie a konceptů specifické pro XOOPS.

---

## A

### Admin Framework
Standardizovaný rámec administrativního rozhraní představený v XOOPS 2.3, který poskytuje konzistentní stránky pro správu napříč moduly.

### Automatické načítání
Automatické načítání tříd PHP, když jsou potřeba, pomocí standardu PSR-4 v moderním XOOPS.

---

## B

### Blokovat
Samostatná jednotka obsahu, kterou lze umístit do tematických oblastí. Bloky mohou zobrazovat obsah modulu, vlastní HTML nebo dynamická data.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Proces inicializace jádra XOOPS před provedením kódu modulu, obvykle prostřednictvím `mainfile.php` a `header.php`.

---

## C

### Kritéria / CriteriaCompo
Třídy pro vytváření podmínek databázových dotazů objektově orientovaným způsobem.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (falšování požadavků napříč stránkami)
V XOOPS bylo zabráněno bezpečnostnímu útoku pomocí bezpečnostních tokenů přes `XOOPSFormHiddenToken`.

---

## D

### DI (Dependency Injection)
Návrhový vzor plánovaný pro XOOPS 4.0, kde jsou závislosti vkládány spíše než interně vytvářeny.

### Dirname
Název adresáře modulu používaný jako jedinečný identifikátor v celém systému.

### DTYPE (typ dat)
Konstanty definující, jak jsou proměnné XOOPSObject uloženy a dezinfikovány:
- `XOBJ_DTYPE_INT` - Celé číslo
- `XOBJ_DTYPE_TXTBOX` - Text (jeden řádek)
- `XOBJ_DTYPE_TXTAREA` - Text (víceřádkový)
- `XOBJ_DTYPE_EMAIL` - E-mailová adresa

---

## E

### Událost
Výskyt v životním cyklu XOOPS, který může spustit vlastní kód prostřednictvím předběžného načtení nebo zavěšení.

---

## F

### Rámec
Viz XMF (XOOPS Module Framework).

### Prvek formuláře
Komponenta systému formulářů XOOPS představující pole formuláře HTML.

---

## G

### Skupina
Kolekce uživatelů se sdílenými oprávněními. Mezi základní skupiny patří: Webmasteři, Registrovaní uživatelé, Anonymní.

---

## H

### Psovod
Třída, která spravuje operace CRUD pro instance XOOPSObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Pomocník
Třída utility poskytující snadný přístup k obslužným rutinám modulů, konfiguracím a službám.

```php
$helper = \XOOPSModules\MyModule\Helper::getInstance();
```

---

## K

### Jádro
Základní třídy XOOPS poskytující základní funkce: přístup k databázi, správa uživatelů, zabezpečení atd.

---

## L

### Jazykový soubor
Soubory PHP obsahující konstanty pro internacionalizaci, uložené v adresářích `language/[code]/`.

---

## M

### mainfile.php
Primární konfigurační soubor pro XOOPS obsahující pověření databáze a definice cest.

### MCP (Model-Controller-Presenter)
Architektonický vzor podobný MVC, často používaný při vývoji modulů XOOPS.

### Middleware
Software, který se nachází mezi požadavkem a odpovědí, plánovaný pro XOOPS 4.0 pomocí PSR-15.

### Modul
Samostatný balíček, který rozšiřuje funkčnost XOOPS, nainstalovaný v adresáři `modules/`.

### MOC (Mapa obsahu)
Obsidiánový koncept pro přehledové poznámky, které odkazují na související obsah.

---

## N

### Jmenný prostor
Funkce PHP pro organizování tříd, použitá v XOOPS 2.5+:
```php
namespace XOOPSModules\MyModule;
```

### Oznámení
Systém XOOPS pro upozorňování uživatelů na události prostřednictvím e-mailu nebo PM.

---

## O

### Objekt
Viz XOOPSObject.

---

## P

### Povolení
Řízení přístupu spravované prostřednictvím skupin a obslužných rutin oprávnění.

### Předpětí
Třída, která se připojuje k událostem XOOPS, načte se automaticky z adresáře `preloads/`.

### PSR (doporučení standardů PHP)
Normy od PHP-FIG, které bude XOOPS 4.0 plně implementovat.

---

## R

### Renderer
Třída, která vydává prvky formuláře nebo jiné komponenty uživatelského rozhraní ve specifických formátech (Bootstrap atd.).

---

## S

### Smarty
Šablonový engine používaný XOOPS pro oddělení prezentace od logiky.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Služba
Třída poskytující opakovaně použitelnou obchodní logiku, obvykle přístupná přes Helper.

---

## T

### Šablona
Soubor Smarty (`.tpl` nebo `.html`) definující prezentační vrstvu pro moduly.

### Téma
Kolekce šablon a datových zdrojů definujících vizuální vzhled webu.### Token
Bezpečnostní mechanismus (ochrana CSRF), který zajišťuje, že odesílání formulářů pochází z legitimních zdrojů.

---

## U

### uid
ID uživatele – jedinečný identifikátor pro každého uživatele v systému.

---

## V

### Proměnná (Var)
Pole definované na XOOPSObject pomocí `initVar()`.

---

## W

### Widget
Malá samostatná komponenta uživatelského rozhraní podobná blokům.

---

## X

### XMF (XOOPS Module Framework)
Kolekce utilit a tříd pro vývoj moderních modulů XOOPS.

### XOBJ_DTYPE
Konstanty pro definování proměnných datových typů v XOOPSObject.

### XOOPSDatabase
Databázová abstrakce vrstva zajišťující provádění dotazů a escapování.

### Formulář XOOPS
Systém generování formulářů pro vytváření formulářů HTML programově.

### XOOPSObject
Základní třída pro všechny datové objekty v XOOPS poskytující správu proměnných a sanitaci.

### xoops_version.php
Soubor manifestu modulu definující vlastnosti modulu, tabulky, bloky, šablony a konfiguraci.

---

## Běžné zkratky

| Zkratka | Význam |
|---------|---------|
| XOOPS | Rozšiřitelný objektově orientovaný portálový systém |
| XMF | Rámec modulu XOOPS |
| CSRF | Padělání požadavků napříč stránkami |
| XSS | Cross-Site Scripting |
| ORM | Objektově-relační mapování |
| PSR | PHP Doporučení norem |
| DI | Dependency Injection |
| MVC | Model-View-Controller |
| CRUD | Vytvořit, Číst, Aktualizovat, Smazat |

---

## 🔗 Související dokumentace

- Základní koncepty
- Reference API
- Externí zdroje

---

#xoops #glosář #odkaz #terminologie #definice