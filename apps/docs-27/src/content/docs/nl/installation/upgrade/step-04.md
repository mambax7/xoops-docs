---
title: "Na de upgrade"
---
## Update de systeemmodule

Nadat alle benodigde patches zijn toegepast, wordt door het selecteren van _Doorgaan_ alles ingesteld om de **systeem**-module bij te werken. Dit is een zeer belangrijke stap en is vereist om de upgrade correct te voltooien.

![XOOPS Update systeemmodule](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Selecteer _Update_ om de update van de systeemmodule uit te voeren.

## Update andere door XOOPS geleverde modules

XOOPS wordt geleverd met drie optionele modules: pm (privéberichten) profiel (gebruikersprofiel) en protector (beschermer). U moet een update uitvoeren op elk van deze modules die zijn geïnstalleerd.

![XOOPS Andere modules bijwerken](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Andere modules bijwerken

Het is waarschijnlijk dat er updates zijn voor andere modules waardoor de modules beter kunnen werken onder uw nu bijgewerkte XOOPS. U dient alle relevante module-updates te onderzoeken en toe te passen.

## Bekijk nieuwe voorkeuren voor het verharden van cookies

De XOOPS 2.7.0-upgrade voegt twee nieuwe voorkeuren toe die bepalen hoe sessiecookies worden uitgegeven:

* **`session_cookie_samesite`** — beheert het SameSite-cookiekenmerk. `Lax` is een veilige standaard voor de meeste sites. Gebruik `Strict` voor maximale bescherming als uw site niet afhankelijk is van cross-origin navigatie. `None` is alleen geschikt als u weet dat u het nodig heeft.
* **`session_cookie_secure`** — indien ingeschakeld, wordt de sessiecookie alleen verzonden via HTTPS-verbindingen. Schakel dit in als uw site draait op HTTPS.

U kunt deze instellingen bekijken onder Systeemopties → Voorkeuren → Algemene instellingen.

## Valideer aangepaste thema's

Als uw site een aangepast thema gebruikt, loop dan door het frontend- en beheerdersgedeelte om te controleren of de pagina's correct worden weergegeven. De upgrade naar Smarty 4 kan van invloed zijn op aangepaste sjablonen, zelfs als de preflightscan is geslaagd. Als u weergaveproblemen tegenkomt, gaat u opnieuw naar [Problemen oplossen](ustep-03.md).

## Installatie- en upgradebestanden opschonen

Om veiligheidsredenen verwijdert u deze mappen uit uw webroot zodra is bevestigd dat de upgrade werkt:

* `upgrade/` — de map voor de upgradeworkflow
* `install/` — indien aanwezig, hetzij als `install/` of als een hernoemde map `installremove*`

Als u deze op hun plaats laat, worden de upgrade- en installatiescripts zichtbaar voor iedereen die uw site kan bereiken.

## Open uw site

Als u het advies _Zet uw site uit_ heeft opgevolgd, moet u deze weer inschakelen zodra u heeft vastgesteld dat deze correct werkt.