---
title: "Fejlfinding"
---

## Smarty 4 skabelonfejl

Den mest almindelige klasse af problemer ved opgradering fra XOOPS 2.5.x til 2.7.0 er inkompatibilitet med Smarty 4-skabeloner. Hvis du sprang over eller ikke gennemførte [Preflight Check](preflight.md), kan du se skabelonfejl på frontend eller i administrationsområdet efter opgraderingen.

Sådan gendannes:

1. **Kør preflight-scanneren igen** på `/upgrade/preflight.php`. Anvend eventuelle automatiske reparationer, det tilbyder, eller ret flagede skabeloner manuelt.
2. **Ryd den kompilerede skabeloncache.** Fjern alt undtagen `index.html` fra `xoops_data/caches/smarty_compile/`. Smarty 3 kompilerede skabeloner er ikke kompatible med Smarty 4, og forældede filer kan forårsage forvirrende fejl.
3. **Skift midlertidigt til et afsendt tema.** Fra administrationsområdet skal du vælge `xbootstrap5` eller `default` som det aktive tema. Dette vil bekræfte, om problemet er begrænset til et brugerdefineret tema eller er hele webstedet.
4. **Valider eventuelle brugerdefinerede temaer og modulskabeloner** før du tænder for produktionstrafik igen. Vær særlig opmærksom på skabeloner, der bruger `{php}`-blokke, forældede modifikatorer eller ikke-standard afgrænsersyntaks - disse er de mest almindelige Smarty 4-brud.

Se også Smarty 4-sektionen i [Special Topics](../../installation/specialtopics.md).

## Tilladelsesproblemer

XOOPS-opgraderingen skal muligvis skrive til filer, der tidligere er gjort skrivebeskyttet. Hvis dette er tilfældet, vil du se en meddelelse som denne:

![XOOPS Opgradering Gør skrivbar fejl](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

Løsningen er at ændre tilladelserne. Du kan ændre tilladelser ved at bruge FTP, hvis du ikke har mere direkte adgang. Her er et eksempel, der bruger FileZilla:

![FileZilla Skift tilladelse](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Debugging output

Du kan aktivere ekstra debugging-output i loggeren ved at tilføje en debug-parameter til den URL, der blev brugt til at starte opgraderingen:

```text
http://example.com/upgrade/?debug=1
```

