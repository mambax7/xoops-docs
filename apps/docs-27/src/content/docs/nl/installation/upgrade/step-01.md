---
title: "Voorbereidingen voor het upgraden"
---
## Schakel site uit

Voordat u het XOOPS-upgradeproces start, moet u het selectievakje 'Uw site uitschakelen?' instellen. item naar _Ja_ in de Voorkeuren -&gt; Systeemopties -&gt; Pagina Algemene instellingen in het Beheermenu.

Dit voorkomt dat gebruikers tijdens de upgrade een kapotte site tegenkomen. Het beperkt ook de strijd om hulpbronnen tot een minimum om een ​​soepelere upgrade te garanderen.

In plaats van fouten en een kapotte site, zullen uw bezoekers zoiets als dit zien:

![Site gesloten op mobiel](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Back-up

Het is een goed idee om de sectie XOOPS beheer _Onderhoud_ te gebruiken om _Cachemap opschonen_ voor alle caches voordat u een volledige back-up maakt van uw sitebestanden. Als de site uitgeschakeld is, wordt het gebruik van de tabel _Leeg de sessies_ ook aanbevolen, zodat als herstel nodig is, de verouderde sessies er geen deel van uitmaken.

### Bestanden

De bestandsback-up kan worden gemaakt met FTP, waarbij alle bestanden naar uw lokale computer worden gekopieerd. Als u directe shell-toegang tot de server heeft, kan het _veel_ sneller zijn om daar een kopie (of een archiefkopie) te maken.

### Database

Voor het maken van een databaseback-up kunt u gebruik maken van de ingebouwde functies in de sectie XOOPS beheer _Onderhoud_. U kunt ook de _Export_-functies in _phpMyAdmin_ gebruiken, indien beschikbaar. Als u shell-toegang hebt, kunt u de opdracht _mysql_ gebruiken om uw database te dumpen.

Vloeiend zijn in het maken van back-ups en het herstellen van uw database is een belangrijke vaardigheid voor webmasters. Er zijn veel online bronnen die u kunt gebruiken om meer te leren over deze bewerkingen, afhankelijk van uw installatie, zoals [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![phpMyAdmin-export](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Kopieer nieuwe bestanden naar de site

Het kopiëren van de nieuwe bestanden naar uw site is vrijwel identiek aan de stap [Voorbereidingen](../../installation/preparations/) tijdens de installatie. U moet de mappen _xoops_data_ en _xoops_lib_ kopiëren naar de locatie waar deze tijdens de installatie zijn verplaatst. Kopieer vervolgens de rest van de inhoud van de map _htdocs_ van de distributie (met een paar uitzonderingen die in de volgende sectie worden behandeld) over de bestaande bestanden en mappen in uw webroot.

In XOOPS 2.7.0 zal het kopiëren van een nieuwe distributie bovenop een bestaande site **bestaande configuratiebestanden niet overschrijven** zoals `mainfile.php` of `xoops_data/data/secure.php`. Dit is een welkome verandering ten opzichte van eerdere versies, maar u moet nog steeds een volledige back-up maken voordat u begint.

Kopieer de volledige map _upgrade_ van de distributie naar uw webroot en maak daar een map _upgrade_.

## Voer de Smarty 4 Preflight-controle uit

Voordat u de hoofdworkflow `/upgrade/` start, moet u de preflightscanner uitvoeren die is meegeleverd in de map `upgrade/`. Het onderzoekt uw bestaande thema's en modulesjablonen op compatibiliteitsproblemen met Smarty 4 en kan veel ervan automatisch repareren.

1. Ga in uw browser naar _your-site-url_/upgrade/preflight.php
2. Meld u aan met een beheerdersaccount
3. Voer de scan uit en bekijk het rapport
4. Pas eventuele aangeboden automatische reparaties toe of repareer gemarkeerde sjablonen handmatig
5. Voer de scan opnieuw uit totdat deze schoon is
6. Ga dan pas verder met de hoofdupgrade

Zie de pagina [Preflightcontrole](preflight.md) voor een volledig overzicht.

### Dingen die u misschien niet wilt kopiëren

U mag de map _install_ niet opnieuw kopiëren naar een werkend XOOPS-systeem. Als u de installatiemap in uw XOOPS-installatie verlaat, wordt uw systeem blootgesteld aan mogelijke beveiligingsproblemen. Het installatieprogramma hernoemt het willekeurig, maar u moet het verwijderen en ervoor zorgen dat u het niet naar een ander kopieert.

Er zijn enkele bestanden die u mogelijk hebt aangepast om uw site aan te passen, en u wilt deze graag bewaren. Hier vindt u een lijst met veelvoorkomende aanpassingen.

* _xoops_data/configs/xoopsconfig.php_ als dit is gewijzigd sinds de site is geïnstalleerd
* alle mappen in _themes_ indien aangepast voor uw site. In dit geval wilt u wellicht bestanden vergelijken om nuttige updates te identificeren.
* elk bestand in _class/captcha/_ dat begint met "config" als het is gewijzigd sinds de site is geïnstalleerd
* eventuele aanpassingen in _class/textsanitizer_
* eventuele aanpassingen in _class/xoopseditor_Als u zich na de upgrade realiseert dat er per ongeluk iets is overschreven, raak dan niet in paniek; daarom bent u begonnen met een volledige back-up. _(Je hebt toch een back-up gemaakt, toch?)_

## Controleer mainfile.php (upgraden van pre-2.5 XOOPS)

Deze stap is alleen van toepassing als u een upgrade uitvoert vanaf een oude XOOPS-versie (2.3 of eerder). Als u een upgrade uitvoert vanaf XOOPS 2.5.x, kunt u dit gedeelte overslaan.

Bij oude versies van XOOPS moesten enkele handmatige wijzigingen worden aangebracht in `mainfile.php` om de Protector-module in te schakelen. In uw webroot zou u een bestand moeten hebben met de naam `mainfile.php`. Open dat bestand in uw editor en zoek naar deze regels:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

en

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Verwijder deze regels als u ze vindt en sla het bestand op voordat u verdergaat.