---
title: "phpinfo"
---
Deze stap is optioneel, maar kan u gemakkelijk urenlange frustratie besparen.

Als pre-installatietest van het hostingsysteem wordt lokaal een zeer klein, maar nuttig PHP-script gemaakt en naar het doelsysteem geüpload.

Het PHP-script bestaat uit slechts één regel:

```php
<?php phpinfo();
```

Maak met behulp van een teksteditor een bestand met de naam _info.php_ met deze ene regel.

Upload dit bestand vervolgens naar uw webroot.

![Bestand info.php uploaden](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Krijg toegang tot uw script door het in uw browser te openen, d.w.z. door naar `http://example.com/info.php` te gaan. Als alles correct werkt, zou u een pagina als deze moeten zien:

![phpinfo() Voorbeeld](/xoops-docs/2.7/img/installation/php-info.png)

Opmerking: sommige hostingdiensten kunnen de functie _phpinfo()_ uitschakelen als veiligheidsmaatregel. Meestal ontvangt u daarvan een bericht als dat het geval is.

De uitvoer van het script kan van pas komen bij het oplossen van problemen, dus overweeg om er een kopie van te bewaren.

Als de test werkt, zou je goed moeten zijn om voor de installatie te gaan. U moet het _info.php_-script verwijderen en doorgaan met de installatie.

Als de test mislukt, onderzoek dan waarom! Welk probleem er ook voor zorgt dat deze eenvoudige test niet werkt, **zal** voorkomen dat een echte installatie werkt.