---
title: "Preflight-controle"
---
XOOPS 2.7.0 heeft zijn sjablonenengine geüpgraded van Smarty 3 naar Smarty 4. Smarty 4 is strenger wat betreft de syntaxis van sjablonen dan Smarty 3, en sommige aangepaste thema's en modulesjablonen moeten mogelijk worden aangepast voordat ze correct werken op XOOPS 2.7.0.

Om deze problemen te helpen identificeren en repareren voordat_ u de hoofdupgrade uitvoert, wordt XOOPS 2.7.0 geleverd met een **preflightscanner** in de map `upgrade/`. U moet de preflightscanner minstens één keer uitvoeren voordat u door de hoofdworkflow voor het upgraden kunt doorgaan.

## Wat de scanner doet

De preflightscanner doorloopt uw bestaande thema's en modulesjablonen op zoek naar bekende Smarty 4-incompatibiliteiten. Het kan:

* **Scan** uw `themes/`- en `modules/`-mappen voor `.tpl`- en `.html`-sjabloonbestanden die mogelijk moeten worden gewijzigd
* **Rapporteer** problemen gegroepeerd op bestand en op type probleem
* **Repareer** veel voorkomende problemen automatisch wanneer u daarom vraagt

Niet elk probleem kan automatisch worden gerepareerd. Sommige sjablonen moeten handmatig worden bewerkt, vooral als ze oudere Smarty 3-idiomen gebruiken die geen direct equivalent hebben in Smarty 4.

## De scanner uitvoeren

1. Kopieer de distributiemap `upgrade/` naar de webroot van uw site (als u dit nog niet heeft gedaan als onderdeel van de stap [Voorbereidingen voor upgrade](ustep-01.md).
2. Ga in uw browser naar preflight URL:

   
```text
   http://example.com/upgrade/preflight.php
   
```

3. Meld u aan met een beheerdersaccount wanneer daarom wordt gevraagd.
4. De scanner presenteert een formulier met drie bedieningselementen:
   * **Sjabloonmap**: laat dit leeg om zowel `themes/` als `modules/` te scannen. Voer een pad in zoals `/themes/mytheme/` om de scan te beperken tot één map.
   * **Sjabloonextensie**: laat dit leeg om zowel `.tpl`- als `.html`-bestanden te scannen. Voer één extensie in om de scan te verkleinen.
   * **Poging tot automatische oplossing**: vink dit vakje aan als u wilt dat de scanner problemen repareert waarvan hij weet hoe deze op te lossen. Laat dit uitgeschakeld voor een alleen-lezen scan.
5. Druk op de knop **Uitvoeren**. De scanner doorloopt de geselecteerde mappen en rapporteert elk gevonden probleem.

## Resultaten interpreteren

Het scanrapport vermeldt elk bestand dat is onderzocht en elk gevonden probleem. Bij elke uitgave wordt het volgende vermeld:

* Welk bestand bevat het probleem
* Welke Smarty 4-regel wordt overtreden
* Of de scanner het automatisch kan repareren

Als u de scan hebt uitgevoerd terwijl _Poging tot automatische oplossing_ is ingeschakeld, bevestigt het rapport ook welke bestanden zijn herschreven.

## Problemen handmatig oplossen

Voor problemen die de scanner niet automatisch kan herstellen, opent u het gemarkeerde sjabloonbestand in een editor en brengt u de vereiste wijzigingen aan. Veel voorkomende Smarty 4-incompatibiliteiten zijn onder meer:

* `{php} ... {/php}`-blokken (niet langer ondersteund in Smarty 4)
* Verouderde modifiers en functieaanroepen
* Gebruik van witruimtegevoelige scheidingstekens
* Aannames van plug-ins voor registratietijd die zijn gewijzigd in Smarty 4

Als u niet vertrouwd bent met het bewerken van sjablonen, is de veiligste aanpak om over te schakelen naar een meegeleverd thema (`xbootstrap5`, `default`, `xswatch5`, enz.) en het aangepaste thema afzonderlijk af te handelen nadat de upgrade is voltooid.

## Opnieuw draaien totdat het schoon is

Nadat u de correcties hebt aangebracht (automatisch of handmatig), voert u de preflight-scanner opnieuw uit. Herhaal dit totdat de scan geen resterende problemen meldt.

Zodra de scan schoon is, kunt u de preflightsessie beëindigen door op de knop **Scanner afsluiten** in de scannergebruikersinterface te drukken. Hierdoor wordt de preflight als voltooid gemarkeerd en kan de hoofdupgrade op `/upgrade/` doorgaan.

## Doorgaan met de upgrade

Als de preflight voltooid is, kunt u de hoofdupgrade starten op:

```text
http://example.com/upgrade/
```

Zie [Upgrade uitvoeren](ustep-02.md) voor de volgende stappen.

## Als u Preflight overslaat

Het overslaan van preflight wordt ten zeerste afgeraden, maar als u een upgrade hebt uitgevoerd zonder deze uit te voeren en nu sjabloonfouten ziet, raadpleeg dan de sectie Smarty 4-sjabloonfouten van [Problemen oplossen](ustep-03.md). U kunt achteraf preflight uitvoeren en `xoops_data/caches/smarty_compile/` wissen om te herstellen.