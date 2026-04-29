---
title: "Configuratie opslaan"
---
Op deze pagina worden de resultaten weergegeven van het opslaan van de configuratie-informatie die u tot nu toe hebt ingevoerd.

Nadat u eventuele problemen heeft gecontroleerd en gecorrigeerd, selecteert u de knop 'Doorgaan' om door te gaan.

## Over succes

In het gedeelte _Uw systeemconfiguratie opslaan_ wordt de informatie weergegeven die is opgeslagen. De instellingen worden opgeslagen in een van de twee bestanden. Eén bestand is _mainfile.php_ in de webroot. De andere is _data/secure.php_ in de map _xoops_data_.

![XOOPS Installatieconfiguratie opslaan](/xoops-docs/2.7/img/installation/installer-07.png)

Beide bestanden worden gegenereerd op basis van sjabloonbestanden die worden meegeleverd met XOOPS 2.7.0:

* `mainfile.php` wordt gegenereerd vanuit `mainfile.dist.php` in de webroot.
* `xoops_data/data/secure.php` wordt gegenereerd op basis van `xoops_data/data/secure.dist.php`.

Naast de paden en URL die u hebt ingevoerd, bevat `mainfile.php` nu verschillende constanten die nieuw zijn in XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — bewaard als achterwaarts compatibele alias van `XOOPS_PATH`; u hoeft het niet afzonderlijk te configureren.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — standaard ingesteld op `true`; gebruikt de openbare achtervoegsellijst om het juiste cookiedomein af te leiden.
* `XOOPS_DB_LEGACY_LOG` — standaard ingesteld op `false`; ingesteld op `true` in ontwikkeling om het gebruik van oudere database-API's te registreren.
* `XOOPS_DEBUG` — standaard ingesteld op `false`; tijdens de ontwikkeling ingesteld op `true` om aanvullende foutrapportage mogelijk te maken.

U hoeft deze tijdens de installatie niet handmatig te bewerken; de standaardinstellingen zijn geschikt voor een productielocatie. Ze worden hier vermeld, zodat u weet waar u op moet letten als u `mainfile.php` later opent.

## Fouten

Als XOOPS fouten detecteert bij het schrijven van de configuratiebestanden, worden er berichten weergegeven met details over wat er mis is.

![XOOPS installatieconfiguratiefouten opslaan](/xoops-docs/2.7/img/installation/installer-07-errors.png)

In veel gevallen is een standaardinstallatie van een van Debian afgeleid systeem met behulp van mod_php in Apache de bron van fouten. De meeste hostingproviders hebben configuraties die deze problemen niet hebben.

### Problemen met groepsrechten

Het PHP-proces wordt uitgevoerd met de machtigingen van een bepaalde gebruiker. Bestanden zijn ook eigendom van een bepaalde gebruiker. Als deze twee niet dezelfde gebruiker zijn, kunnen groepsmachtigingen worden gebruikt om het PHP-proces bestanden te laten delen met uw gebruikersaccount. Dit betekent meestal dat u de groep bestanden en mappen waarnaar XOOPS moet schrijven, moet wijzigen.

Voor de hierboven genoemde standaardconfiguratie betekent dit dat de groep _www-data_ moet worden opgegeven als de groep voor de bestanden en mappen, en dat deze bestanden en mappen per groep schrijfbaar moeten zijn.

U dient uw configuratie zorgvuldig te beoordelen en zorgvuldig te kiezen hoe u deze problemen oplost voor een box die beschikbaar is op het open internet.

Voorbeeldopdrachten kunnen zijn:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Kan mainfile.php niet maken

In Unix-achtige systemen hangt de toestemming om een nieuw bestand te maken af van de rechten die zijn verleend aan de bovenliggende map. In sommige gevallen is die toestemming niet beschikbaar en kan het verlenen ervan een veiligheidsrisico vormen.

Als u een probleem met de configuratie heeft, kunt u een dummy _mainfile.php_ vinden in de map _extras_ in de XOOPS-distributie. Kopieer dat bestand naar de webroot en stel de machtigingen voor het bestand in:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### SELinux-omgevingen

SELinux beveiligingscontexten kunnen een bron van problemen zijn. Als dit van toepassing zou kunnen zijn, raadpleeg dan [Speciale onderwerpen](../specialtopics.md) voor meer informatie.