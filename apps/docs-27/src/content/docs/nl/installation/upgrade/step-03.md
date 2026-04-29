---
title: "Problemen oplossen"
---
## Smarty 4-sjabloonfouten

De meest voorkomende problemen bij het upgraden van XOOPS 2.5.x naar 2.7.0 is incompatibiliteit met Smarty 4-sjablonen. Als u de [Preflightcontrole](preflight.md) hebt overgeslagen of niet hebt voltooid, ziet u na de upgrade mogelijk sjabloonfouten aan de voorkant of in het beheerdersgedeelte.

Om te herstellen:

1. **Voer de preflightscanner opnieuw uit** op `/upgrade/preflight.php`. Pas eventuele automatische reparaties toe, of repareer gemarkeerde sjablonen handmatig.
2. **Wis de gecompileerde sjablooncache.** Verwijder alles behalve `index.html` uit `xoops_data/caches/smarty_compile/`. Door Smarty 3 gecompileerde sjablonen zijn niet compatibel met Smarty 4 en verouderde bestanden kunnen verwarrende fouten veroorzaken.
3. **Schakel tijdelijk over naar een verzonden thema.** Selecteer in het beheerdersgedeelte `xbootstrap5` of `default` als het actieve thema. Dit zal bevestigen of het probleem beperkt is tot een aangepast thema of dat het de hele site betreft.
4. **Valideer eventuele aangepaste thema's en modulesjablonen** voordat u het productieverkeer weer inschakelt. Besteed bijzondere aandacht aan sjablonen die `{php}`-blokken, verouderde modifiers of niet-standaard scheidingstekensyntaxis gebruiken: dit zijn de meest voorkomende Smarty 4-breuken.

Zie ook de Smarty 4-sectie in [Speciale onderwerpen](../../installation/specialtopics.md).

## Toestemmingsproblemen

De XOOPS-upgrade moet mogelijk schrijven naar bestanden die eerder alleen-lezen zijn gemaakt. Als dit het geval is, ziet u een bericht als dit:

![XOOPS Upgrade maakt beschrijfbare fout](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

De oplossing is om de rechten te wijzigen. U kunt de machtigingen wijzigen met FTP als u geen directere toegang heeft. Hier is een voorbeeld met behulp van FileZilla:

![FileZilla Toestemming wijzigen](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Foutopsporing in uitvoer

U kunt extra debug-uitvoer in de logger inschakelen door een debug-parameter toe te voegen aan de URL die wordt gebruikt om de upgrade te starten:

```text
http://example.com/upgrade/?debug=1
```

