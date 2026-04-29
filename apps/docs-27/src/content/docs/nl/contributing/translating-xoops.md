---
title: "Bijlage 3: XOOPS vertalen naar een lokale taal"
---
XOOPS 2.7.0 wordt alleen geleverd met Engelstalige bestanden. Vertalingen in andere talen worden onderhouden door de community en gedistribueerd via GitHub en de verschillende lokale XOOPS-ondersteuningssites.

## Waar u bestaande vertalingen kunt vinden

- **GitHub** — gemeenschapsvertalingen worden steeds vaker gepubliceerd als afzonderlijke opslagplaatsen onder de [XOOPS-organisatie](https://github.com/XOOPS) en op de accounts van individuele bijdragers. Zoek in GitHub naar `xoops-language-<your-language>` of blader door de XOOPS-organisatie voor actuele pakketten.
- **Lokale XOOPS-ondersteuningssites** — veel regionale XOOPS-gemeenschappen publiceren vertalingen op hun eigen sites. Bezoek [https://xoops.org](https://xoops.org) en volg de links naar lokale gemeenschappen.
- **Modulevertalingen** — vertalingen voor individuele communitymodules bevinden zich doorgaans naast de module zelf in de `XoopsModules25x` GitHub-organisatie (de `25x` in de naam is historisch; modules worden daar onderhouden voor zowel XOOPS 2.5.x als 2.7.x).

Als er al een vertaling voor uw taal bestaat, plaatst u de taalmappen in uw XOOPS-installatie (zie "Een vertaling installeren" hieronder).

## Wat moet worden vertaald

XOOPS 2.7.0 bewaart taalbestanden naast de code die ze gebruikt. Een volledige vertaling omvat al deze locaties:

- **Kern** — `htdocs/language/english/` — constanten voor de hele site die door elke pagina worden gebruikt (inloggen, veelvoorkomende fouten, datums, e-mailsjablonen, enz.).
- **Installatieprogramma** — `htdocs/install/language/english/` — tekenreeksen weergegeven door de installatiewizard. Vertaal deze *voor*dat u het installatieprogramma uitvoert als u een gelokaliseerde installatie-ervaring wilt.
- **Systeemmodule** — `htdocs/modules/system/language/english/` — veruit de grootste set; bestrijkt het volledige beheerdersdashboard.
- **Gebundelde modules** — elk van `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` en `htdocs/modules/debugbar/language/english/`.
- **Thema's** — een handvol thema's verzenden hun eigen taalbestanden; controleer `htdocs/themes/<theme>/language/` of deze bestaat.

Een "alleen kern"-vertaling is de minimaal bruikbare eenheid en komt overeen met de eerste twee punten hierboven.

## Hoe te vertalen

1. Kopieer de map `english/` ernaast en hernoem de kopie naar uw taal. De mapnaam moet de Engelse naam in kleine letters van de taal zijn (`spanish`, `german`, `french`, `japanese`, `arabic`, enz.).

   
```
   htdocs/language/english/    →    htdocs/language/spanish/
   
```

2. Open elk `.php`-bestand in de nieuwe map en vertaal de **tekenreekswaarden** binnen de `define()`-aanroepen. Wijzig **niet** de constante namen; er wordt in de kern naar de PHP-code verwezen.

   
```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   
```

3. **Elk bestand opslaan als UTF-8 *zonder* BOM.** XOOPS 2.7.0 gebruikt `utf8mb4` end-to-end (database, sessies, uitvoer) en weigert bestanden met een bytevolgordemarkering. In Notepad++ is dit de optie **"UTF-8"**, *niet* "UTF-8-BOM". In VS Code is dit de standaard; bevestig gewoon de codering in de statusbalk.

4. Werk de metagegevens van de taal en de tekenset bovenaan elk bestand bij, zodat deze overeenkomen met uw taal:

   
```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   
```

   `_LANGCODE` moet de [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) code voor uw taal zijn. `_CHARSET` is altijd `UTF-8` in XOOPS 2.7.0 - er is niet langer een ISO-8859-1 variant.

5. Herhaal dit voor het installatieprogramma, de Systeemmodule en eventuele gebundelde modules die u nodig heeft.

## Hoe een vertaling te installeren

Als u een voltooide vertaling als directorystructuur heeft verkregen:

1. Kopieer elke `<language>/`-map naar de overeenkomende `language/english/`-bovenliggende map in uw XOOPS-installatie. Kopieer bijvoorbeeld `language/spanish/` naar `htdocs/language/`, `install/language/spanish/` naar `htdocs/install/language/`, enzovoort.
2. Zorg ervoor dat het eigendom van bestanden en de machtigingen leesbaar zijn voor de webserver.
3. Selecteer de nieuwe taal tijdens de installatie (de wizard scant `htdocs/language/` op beschikbare talen) of wijzig op een bestaande site de taal in **Beheerder → Systeem → Voorkeuren → Algemene instellingen**.

## Deel uw vertaling terug

Draag uw vertaling alstublieft bij aan de gemeenschap.1. Maak een GitHub-repository (of splits een bestaande taalrepository op als deze voor uw taal bestaat).
2. Gebruik een duidelijke naam zoals `xoops-language-<language-code>` (bijvoorbeeld `xoops-language-es`, `xoops-language-pt-br`).
3. Spiegel de mapstructuur XOOPS in uw repository, zodat de bestanden op één lijn liggen met waar ze worden gekopieerd:

   
```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   
```

4. Voeg een `README.md`-documentatie bij:
   - Taalnaam en ISO-code
   - Compatibiliteit met XOOPS-versie (bijv. `XOOPS 2.7.0+`)
   - Vertaler en kredieten
   - Of de vertaling alleen de kern is of gebundelde modules omvat
5. Open een pull-request voor de relevante module/core-repository op GitHub of plaats een aankondiging op [https://xoops.org](https://xoops.org), zodat de community deze kan vinden.

> **Opmerking**
>
> Als uw taal wijzigingen in de kern van de datum- of kalenderopmaak vereist, neem deze wijzigingen dan ook op in het pakket. Talen met rechts-naar-links-scripts (Arabisch, Hebreeuws, Perzisch, Urdu) werken out-of-the-box in XOOPS 2.7.0 - RTL-ondersteuning is in deze release toegevoegd en individuele thema's pikken deze automatisch op.