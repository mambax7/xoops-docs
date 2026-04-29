---
title: "Vereisten"
---
## Softwareomgeving (de stapel)

De meeste XOOPS-productiesites draaien op een _LAMP_-stack (een **L**inux-systeem met **A**pache, **M**ySQL en **P**HP), maar er zijn veel verschillende mogelijke stacks.

Het is vaak het gemakkelijkst om een ​​prototype van een nieuwe site op een lokale machine te maken. In dit geval kiezen veel XOOPS-gebruikers een _WAMP_-stack (met **W**indows als besturingssysteem), terwijl anderen _LAMP_- of _MAMP_ (**M**AC)-stacks gebruiken.

### PHP

Elke PHP-versie &gt;= 8.2.0 (PHP 8.4 of hoger wordt sterk aanbevolen)

> **Belangrijk:** Voor XOOPS 2.7.0 is **PHP 8.2 of nieuwer** vereist. PHP 7.x en eerder worden niet langer ondersteund. Als u een oudere site upgradet, controleer dan voordat u begint of uw host PHP 8.2+ aanbiedt.

### MySQL

MySQL server 5.7 of hoger (MySQL Server 8.4 of hoger wordt sterk aanbevolen.) MySQL 9.0 wordt ook ondersteund. MariaDB is een achterwaarts compatibele, binaire drop-in vervanging van MySQL en werkt ook prima met XOOPS.

### Webserver

Een webserver die het uitvoeren van PHP-scripts ondersteunt, zoals Apache, NGINX, LiteSpeed, enz.

### Vereiste PHP-extensies

Het XOOPS-installatieprogramma controleert of de volgende extensies zijn geladen voordat de installatie kan worden voortgezet:

* `mysqli` — MySQL-databasestuurprogramma
* `session` — sessieafhandeling
* `pcre` — Perl-compatibele reguliere expressies
* `filter` — invoerfiltering en -validatie
* `fileinfo` — MIME-type detectie voor uploads

### Vereiste PHP-instellingen

Naast de bovenstaande extensies verifieert het installatieprogramma de volgende `php.ini`-instelling:

* `file_uploads` moet **Aan** zijn. Zonder dit kan XOOPS geen geüploade bestanden accepteren

### Aanbevolen PHP-extensies

Het installatieprogramma controleert ook op deze extensies. Ze zijn niet strikt vereist, maar XOOPS en de meeste modules vertrouwen erop voor volledige functionaliteit. Schakel zoveel in als uw host toestaat:

* `mbstring` — verwerking van meerdere bytes
* `intl` — internationalisering
* `iconv` — tekensetconversie
* `xml` — XML parseren
* `zlib` — compressie
* `gd` — beeldverwerking
* `exif` — metagegevens van afbeeldingen
* `curl` — HTTP-client voor feeds en API-oproepen

## Diensten

### Toegang tot bestandssysteem (voor webmastertoegang)

U hebt een methode nodig (FTP, SFTP, enz.) om de XOOPS-distributiebestanden naar de webserver over te brengen.

### Toegang tot bestandssysteem (voor webserverproces)

Om XOOPS uit te voeren, is de mogelijkheid nodig om bestanden en mappen te maken, lezen en verwijderen. Voor een normale installatie en voor normaal dagelijks gebruik moeten de volgende paden beschrijfbaar zijn door het webserverproces:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (schrijfbaar tijdens installatie en upgrade)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Database

XOOPS zal tabellen in MySQL moeten maken, wijzigen en opvragen. Hiervoor heb je nodig:

* een MySQL-gebruikersaccount en wachtwoord
* een MySQL-database waar de gebruiker alle rechten op heeft (of als alternatief kan de gebruiker het recht hebben om een dergelijke database te maken)

### E-mail

Voor een live site heeft u een werkend e-mailadres nodig dat XOOPS kan gebruiken voor gebruikerscommunicatie, zoals accountactiveringen en het opnieuw instellen van wachtwoorden. Hoewel dit niet strikt vereist is, wordt het aanbevolen om indien mogelijk een e-mailadres te gebruiken dat overeenkomt met het domein waarop uw XOOPS draait. Zo voorkomt u dat uw communicatie wordt afgewezen of als spam wordt gemarkeerd.

## Gereedschap

Mogelijk hebt u aanvullende hulpmiddelen nodig om uw XOOPS-installatie in te stellen en aan te passen. Deze kunnen het volgende omvatten:

* FTP Clientsoftware
* Teksteditor
* Archiefsoftware om te werken met XOOPS-releasebestanden (_.zip_ of _.tar.gz_).Zie de sectie [Tools of the Trade](../tools/tools.md) voor enkele suggesties voor geschikte tools en webserverstacks, indien nodig.

## Speciale onderwerpen

Voor sommige specifieke systeemsoftwarecombinaties zijn mogelijk aanvullende configuraties nodig om met XOOPS te kunnen werken. Als u een SELinux-omgeving gebruikt, of een oudere site upgradet met aangepaste thema's, raadpleeg dan [Speciale onderwerpen](specialtopics.md) voor meer informatie.