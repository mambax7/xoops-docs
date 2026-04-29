---
title: "XOOPS Woordenlijst"
description: "Definities van XOOPS-specifieke termen en concepten"
---
> Uitgebreide verklarende woordenlijst van XOOPS-specifieke terminologie en concepten.

---

## EEN

### Beheerdersframework
Het gestandaardiseerde beheerinterfaceframework geïntroduceerd in XOOPS 2.3, dat consistente beheerderspagina's voor alle modules biedt.

### Automatisch laden
Het automatisch laden van PHP-klassen wanneer ze nodig zijn, met behulp van de PSR-4-standaard in de moderne XOOPS.

---

## B

### Blokkeren
Een op zichzelf staande inhoudseenheid die in themaregio's kan worden geplaatst. Blokken kunnen module-inhoud, aangepaste HTML of dynamische gegevens weergeven.

```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Het proces van het initialiseren van de XOOPS-kern voordat de modulecode wordt uitgevoerd, meestal via `mainfile.php` en `header.php`.

---

## C

### Criteria / CriteriaCompo
Klassen voor het bouwen van databasequeryvoorwaarden op een objectgeoriënteerde manier.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (vervalsing op meerdere sites)
Een beveiligingsaanval is voorkomen in XOOPS met behulp van beveiligingstokens via `XoopsFormHiddenToken`.

---

## D

### DI (afhankelijkheidsinjectie)
Een ontwerppatroon gepland voor XOOPS 4.0, waarbij afhankelijkheden worden geïnjecteerd in plaats van intern gecreëerd.

### Dirnaam
De mapnaam van een module, die door het hele systeem als unieke identificatie wordt gebruikt.

### DTYPE (gegevenstype)
Constanten die definiëren hoe XoopsObject-variabelen worden opgeslagen en opgeschoond:
- `XOBJ_DTYPE_INT` - Geheel getal
- `XOBJ_DTYPE_TXTBOX` - Tekst (enkele regel)
- `XOBJ_DTYPE_TXTAREA` - Tekst (meerdere regels)
- `XOBJ_DTYPE_EMAIL` - E-mailadres

---

## E

### Evenement
Een gebeurtenis in de levenscyclus van XOOPS die aangepaste code kan activeren via vooraf geladen of hooks.

---

## F

### Kader
Zie XMF (XOOPS-moduleframework).

### Formulierelement
Een onderdeel van het XOOPS-formuliersysteem dat een HTML-formulierveld vertegenwoordigt.

---

## G

### Groep
Een verzameling gebruikers met gedeelde machtigingen. Kerngroepen zijn onder meer: ​​Webmasters, Geregistreerde gebruikers, Anoniem.

---

## H

### Behandelaar
Een klasse die CRUD-bewerkingen voor XoopsObject-instanties beheert.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Helper
Een hulpprogrammaklasse die gemakkelijke toegang biedt tot modulehandlers, configuraties en services.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
De kernklassen XOOPS die fundamentele functionaliteit bieden: databasetoegang, gebruikersbeheer, beveiliging, enz.

---

## L

### Taalbestand
PHP-bestanden met constanten voor internationalisering, opgeslagen in `language/[code]/`-directory's.

---

## M

### mainfile.php
Het primaire configuratiebestand voor XOOPS met databasereferenties en paddefinities.

### MCP (model-controller-presentator)
Een architectonisch patroon vergelijkbaar met MVC, vaak gebruikt bij de ontwikkeling van XOOPS-modules.

### Middleware
Software die zich tussen het verzoek en het antwoord bevindt, gepland voor XOOPS 4.0 met behulp van PSR-15.

### Module
Een op zichzelf staand pakket dat de functionaliteit van XOOPS uitbreidt, geïnstalleerd in de map `modules/`.

### MOC (kaart met inhoud)
Een Obsidian-concept voor overzichtsnotities die verwijzen naar gerelateerde inhoud.

---

## N

### Naamruimte
PHP-functie voor het organiseren van lessen, gebruikt in XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Melding
Het XOOPS-systeem om gebruikers via e-mail of PM te waarschuwen voor gebeurtenissen.

---

## O

### Voorwerp
Zie XoopsObject.

---

## P

### Toestemming
Toegangscontrole beheerd via groepen en toestemmingshandlers.

### Voorladen
Een klasse die aansluit bij XOOPS-gebeurtenissen, automatisch geladen vanuit de map `preloads/`.

### PSR (PHP-standaardaanbeveling)
Normen van PHP-FIG die XOOPS 4.0 volledig zal implementeren.

---

## R

### Renderer
Een klasse die formulierelementen of andere UI-componenten in specifieke formaten (Bootstrap, enz.) uitvoert.

---

## S

### Slim
De sjabloonengine die door XOOPS wordt gebruikt voor het scheiden van presentatie en logica.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Dienst
Een klasse die herbruikbare bedrijfslogica biedt, doorgaans toegankelijk via de Helper.

---

## T### Sjabloon
Een Smarty-bestand (`.tpl` of `.html`) dat de presentatielaag voor modules definieert.

### Thema
Een verzameling sjablonen en elementen die het visuele uiterlijk van de site bepalen.

### Token
Een beveiligingsmechanisme (CSRF-bescherming) dat ervoor zorgt dat formulierinzendingen afkomstig zijn van legitieme bronnen.

---

## U

### vloeistof
Gebruikers-ID - de unieke identificatie voor elke gebruiker in het systeem.

---

## V

### Variabel (Var)
Een veld dat is gedefinieerd op een XoopsObject met behulp van `initVar()`.

---

## W

### Widget
Een kleine, op zichzelf staande UI-component, vergelijkbaar met blokken.

---

## X

### XMF (XOOPS-moduleframework)
Een verzameling hulpprogramma's en klassen voor de moderne XOOPS-moduleontwikkeling.

### XOBJ_DTYPE
Constanten voor het definiëren van variabele gegevenstypen in XoopsObject.

### XoopsDatabase
De database-abstractielaag die de uitvoering en ontsnapping van query's mogelijk maakt.

### XoopsForm
Het formuliergeneratiesysteem voor het programmatisch maken van HTML-formulieren.

### XoopsObject
De basisklasse voor alle gegevensobjecten in XOOPS, die variabel beheer en opschoning biedt.

### xoops_version.php
Het modulemanifestbestand dat module-eigenschappen, tabellen, blokken, sjablonen en configuratie definieert.

---

## Veel voorkomende acroniemen

| Acroniem | Betekenis |
|---------|---------|
| XOOPS | uitbreidbaar objectgeoriënteerd portaalsysteem |
| XMF | XOOPS Moduleframework |
| CSRF | Vervalsing op verschillende sites |
| XSS | Cross-site-scripting |
| ORM | Object-relationele mapping |
| PSR | PHP Normenaanbeveling |
| DI | Afhankelijkheidsinjectie |
| MVC | Model-View-Controller |
| CRUD | Maken, lezen, bijwerken, verwijderen |

---

## 🔗 Gerelateerde documentatie

- Kernconcepten
- API-referentie
- Externe bronnen

---

#xoops #woordenlijst #referentie #terminologie #definities