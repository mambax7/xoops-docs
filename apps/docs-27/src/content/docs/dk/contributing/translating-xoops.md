---
title: "Bilag 3: Oversættelse af XOOPS til et lokalt sprog"
---

XOOPS 2.7.0 leveres kun med engelsksprogede filer. Oversættelser til andre sprog vedligeholdes af fællesskabet og distribueres gennem GitHub og de forskellige lokale XOOPS-supportsider.

## Hvor kan man finde eksisterende oversættelser

- **GitHub** — fællesskabsoversættelser udgives i stigende grad som separate arkiver under [XOOPS organisationen](https://github.com/XOOPS) og på individuelle bidragyders konti. Søg i GitHub efter `xoops-language-<your-language>` eller gennemse XOOPS-organisationen for aktuelle pakker.
- **Lokale XOOPS-supportwebsteder** — mange regionale XOOPS-fællesskaber udgiver oversættelser på deres egne websteder. Besøg [https://xoops.org](https://xoops.org) og følg links til lokalsamfund.
- **Moduloversættelser** — oversættelser til individuelle fællesskabsmoduler findes typisk ved siden af ​​selve modulet i `XoopsModules25x` GitHub-organisationen (`25x` i navnet er historisk; moduler der opretholdes for både `XoopsModules25x` og .x200035qxz).

Hvis der allerede findes en oversættelse til dit sprog, skal du slippe sprogbibliotekerne i din XOOPS installation (se "Sådan installerer du en oversættelse" nedenfor).

## Hvad skal oversættes

XOOPS 2.7.0 opbevarer sprogfiler ved siden af koden, der bruger dem. En komplet oversættelse dækker alle disse steder:

- **Core** — `htdocs/language/english/` — konstanter på hele webstedet, der bruges af hver side (login, almindelige fejl, datoer, mailskabeloner osv.).
- **Installationsprogram** — `htdocs/install/language/english/` — strenge vist af installationsguiden. Oversæt disse *før* du kører installationsprogrammet, hvis du ønsker en lokaliseret installationsoplevelse.
- **Systemmodul** — `htdocs/modules/system/language/english/` — langt det største sæt; dækker hele admin kontrolpanelet.
- **Bundte moduler** — hver af `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` og `htdocs/modules/debugbar/language/english/`.
- **Temaer** — en håndfuld temaer sender deres egne sprogfiler; tjek `htdocs/themes/<theme>/language/`, hvis den findes.

En "kun kerne"-oversættelse er den mindste brugbare enhed og svarer til de to første punkttegn ovenfor.

## Sådan oversætter du

1. Kopier mappen `english/` ved siden af den, og omdøb kopien til dit sprog. Biblioteksnavnet skal være det engelske sprogs små bogstaver (`spanish`, `german`, `french`, `japanese`, `arabic` osv.).

   
```
   htdocs/language/engelsk/ → htdocs/language/spanish/
   
```

2. Åbn hver `.php`-fil i den nye mappe og oversæt **strengværdierne** inde i `define()`-kaldene. Ændr **ikke** konstantnavnene - de refereres fra PHP-koden i hele kernen.

   
```php
   // Før:
   define('_CM_COMDELETED', 'Kommentar(er) slettet.');
   define('_CM_COMDELETENG', 'Kunne ikke slette kommentar.');
   define('_CM_DELETESELECT', 'Slet alle dens underordnede kommentarer?');

   // Efter (spansk):
   define('_CM_COMDELETED', 'Kommentar(er) elimineret(er).');
   define('_CM_COMDELETENG', 'Der er ingen kommentarer.');
   define('_CM_DELETESELECT', '¿Vil du fjerne alle andre kommentarer?');
   
```

3. **Gem hver fil som UTF-8 *uden* BOM.** XOOPS 2.7.0 bruger `utf8mb4` end-to-end (database, sessioner, output-markering) og byte-ord-filer. I Notepad++ er dette indstillingen **"UTF-8"**, *ikke* "UTF-8-BOM". I VS-kode er det standard; bekræft blot kodningen i statuslinjen.

4. Opdater sprog- og tegnsætmetadataene øverst i hver fil, så de matcher dit sprog:

   
```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Oversætter: Dit navn
   
```

   `_LANGCODE` skal være [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php)-koden for dit sprog. `_CHARSET` er altid `UTF-8` i XOOPS 2.7.0 — der er ikke længere en ISO-8859-1 variant.

5. Gentag for installationsprogrammet, systemmodulet og eventuelle medfølgende moduler, du har brug for.

## Sådan installeres en oversættelse

Hvis du har fået en færdig oversættelse som et bibliotekstræ:1. Kopier hver `<language>/`-mappe til den matchende `language/english/`-forælder i din XOOPS-installation. Kopier f.eks. `language/spanish/` til `htdocs/language/`, `install/language/spanish/` til `htdocs/install/language/` og så videre.
2. Sørg for, at filejerskab og tilladelser kan læses af webserveren.
3. Vælg enten det nye sprog på installationstidspunktet (guiden scanner `htdocs/language/` for tilgængelige sprog) eller, på et eksisterende websted, skift sproget i **Admin → System → Indstillinger → Generelle indstillinger**.

## Deler din oversættelse tilbage

Bidrag venligst din oversættelse tilbage til fællesskabet.

1. Opret et GitHub-lager (eller fordel et eksisterende sproglager, hvis der findes et til dit sprog).
2. Brug et klart navn, f.eks. `xoops-language-<language-code>` (f.eks. `xoops-language-es`, `xoops-language-pt-br`).
3. Spejl XOOPS-biblioteksstrukturen inde i dit lager, så filer stemmer overens med, hvor de bliver kopieret:

   
```
   xoops-language-es/
   ├── sprog/spansk/(filer).php
   ├── installer/sprog/spansk/(filer).php
   └── moduler/system/sprog/spansk/(filer).php
   
```

4. Inkluder en `README.md`, der dokumenterer:
   - Sprognavn og ISO-kode
   - XOOPS versionskompatibilitet (f.eks. `XOOPS 2.7.0+`)
   - Oversætter og kreditter
   - Om oversættelsen kun er kerne eller dækker bundtede moduler
5. Åbn en pull-anmodning mod det relevante modul/kernelager på GitHub eller post en meddelelse på [https://xoops.org](https://xoops.org), så fællesskabet kan finde det.

> **Bemærk**
>
> Hvis dit sprog kræver ændringer af kernen til dato- eller kalenderformatering, skal du også inkludere disse ændringer i pakken. Sprog med højre-til-venstre-scripts (arabisk, hebraisk, persisk, urdu) fungerer ud af boksen i XOOPS 2.7.0 — RTL-understøttelse blev tilføjet i denne udgivelse, og individuelle temaer henter det automatisk.
