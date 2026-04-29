---
title: "Een site verplaatsen"
---
Het kan een zeer nuttige techniek zijn om een ​​prototype te maken van een nieuwe XOOPS-site op een lokaal systeem of een ontwikkelingsserver. Het kan ook erg verstandig zijn om een ​​XOOPS-upgrade eerst op een kopie van uw productiesite te testen, voor het geval er iets misgaat. Om dit te bereiken moet u uw XOOPS-site van de ene site naar de andere kunnen verplaatsen. Dit is wat u moet weten om uw XOOPS-site succesvol te verplaatsen.

De eerste stap is het opzetten van uw nieuwe siteomgeving. Dezelfde items die worden behandeld in de sectie [Voorbereidingen](../installation/preparations/) zijn hier ook van toepassing.

Kort samengevat zijn deze stappen:

* hosting verkrijgen, inclusief eventuele domeinnaam- of e-mailvereisten
* verkrijg een MySQL-gebruikersaccount en wachtwoord
* verkrijg een MySQL-database waar de bovenstaande gebruiker alle rechten op heeft

De rest van het proces lijkt veel op een normale installatie, maar:

* in plaats van de bestanden uit de XOOPS-distributie te kopiëren, kopieert u ze vanaf de bestaande site
* in plaats van het installatieprogramma uit te voeren, importeert u een reeds ingevulde database
* in plaats van antwoorden in te voeren in het installatieprogramma, wijzigt u de eerdere antwoorden in de bestanden en database

## Kopieer de bestaande sitebestanden

Maak een volledige kopie van de bestanden van uw bestaande site naar uw lokale computer, waar u ze kunt bewerken. Als u met een externe host werkt, kunt u FTP gebruiken om de bestanden te kopiëren. U hebt een kopie nodig om mee te werken, zelfs als de site op uw lokale computer draait. Maak in dat geval gewoon nog een kopie van de mappen van de site.

Het is belangrijk om te onthouden dat u de mappen _xoops_data_ en _xoops_lib_ opneemt, zelfs als deze zijn hernoemd en/of verplaatst.

Om de zaken soepeler te laten verlopen, moet u de cache en door Smarty gecompileerde sjabloonbestanden uit uw kopie verwijderen. Deze bestanden worden opnieuw aangemaakt in uw nieuwe omgeving en kunnen problemen veroorzaken waarbij oude onjuiste informatie behouden blijft als deze niet wordt gewist. Om dit te doen, verwijdert u alle bestanden, behalve _index.html_, in alle drie deze mappen:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Opmerking:** Het wissen van `smarty_compile` is vooral belangrijk wanneer u een site verplaatst naar of van XOOPS 2.7.0. XOOPS 2.7.0 maakt gebruik van Smarty 4, en door Smarty 4 gecompileerde sjablonen zijn niet uitwisselbaar met door Smarty 3 gecompileerde sjablonen. Als u oude, gecompileerde bestanden op hun plaats laat staan, ontstaan ​​er sjabloonfouten bij het laden van de eerste pagina op de nieuwe site.

### `xoops_lib` en afhankelijkheden van componist

XOOPS 2.7.0 beheert de PHP-afhankelijkheden via Composer, binnen `xoops_lib/`. De map `xoops_lib/vendor/` bevat de bibliotheken van derden die XOOPS tijdens runtime nodig heeft (Smarty 4, PHPMailer, HTMLPurifier, enz.). Wanneer u een site verplaatst, moet u de volledige `xoops_lib/`-structuur, inclusief `vendor/`, naar de nieuwe host kopiëren. Probeer `vendor/` niet opnieuw te genereren op de doelhost, tenzij u een ontwikkelaar bent die `composer.json` heeft aangepast en Composer beschikbaar heeft op de doelhost.

## Stel de nieuwe omgeving in

Dezelfde items die worden behandeld in de sectie [Voorbereidingen](../installation/preparations/) zijn hier ook van toepassing. We gaan er hier van uit dat u over de hosting beschikt die u nodig heeft voor de site die u verplaatst.

### Belangrijke informatie (mainfile.php en secure.php)

Voor het succesvol verplaatsen van een site zijn alle verwijzingen naar absolute bestands- en padnamen, URL's, databaseparameters en toegangsgegevens gewijzigd.

Twee bestanden, `mainfile.php` in de webroot van uw site, en `data/secure.php` in de (hernoemde en/of verplaatste) map _xoops_data_ van uw site, definiëren de basisparameters van uw site, zoals de URL, waar deze zich bevindt in het hostbestandssysteem en hoe deze verbinding maakt met de database.

Je zult zowel moeten weten wat de waarden in het oude systeem zijn, als wat ze in het nieuwe systeem zullen zijn.

#### mainfile.php

| Naam | Oude waarde in mainfile.php | Nieuwe waarde in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |Open _mainfile.php_ in uw editor. Wijzig de waarden voor de definities in het bovenstaande diagram van de oude waarden naar de juiste waarden voor de nieuwe site.

Houd notities bij van de oude en nieuwe waarden, omdat we in een aantal latere stappen soortgelijke wijzigingen op andere plaatsen zullen moeten aanbrengen.

Als u bijvoorbeeld een site van uw lokale pc naar een commerciële hostingservice verplaatst, kunnen uw waarden er als volgt uitzien:

| Naam | Oude waarde in mainfile.php | Nieuwe waarde in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/voorbeeld/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/voorbeeld/privé/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/voorbeeld/privé/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | lokalehost | voorbeeld.com |

Nadat u _mainfile.php_ heeft gewijzigd, slaat u het op.

Het is mogelijk dat sommige andere bestanden hardgecodeerde verwijzingen naar uw URL of zelfs paden bevatten. Dit is waarschijnlijker bij aangepaste thema's en menu's, maar met uw editor kunt u voor de zekerheid door alle bestanden zoeken.

Voer in uw editor een zoekopdracht uit in de bestanden in uw kopie, zoek naar de oude XOOPS_URL-waarde en vervang deze door de nieuwe waarde.

Doe hetzelfde voor de oude XOOPS_ROOT_PATH-waarde, waarbij u alle exemplaren vervangt door de nieuwe waarde.

Bewaar uw aantekeningen, want we zullen ze later opnieuw moeten gebruiken als we de database verhuizen.

#### data/secure.php

| Naam | Oude waarde in data/secure.php | Nieuwe waarde in data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Open de _data/secure.php_ in de hernoemde en/of verplaatste map _xoops_data_ in uw editor. Wijzig de waarden voor de definities in het bovenstaande diagram van de oude waarden naar de juiste waarden voor de nieuwe site.

#### Andere bestanden

Er kunnen andere bestanden zijn die aandacht nodig hebben wanneer uw site wordt verplaatst. Enkele veel voorkomende voorbeelden zijn API-sleutels voor verschillende services die mogelijk aan het domein zijn gekoppeld, zoals:

* Google Maps
* Heropname2
* Zoals knoppen
* Link delen en/of adverteren zoals Shareaholic of AddThis

Het wijzigen van dit soort koppelingen is niet eenvoudig te automatiseren, omdat de koppelingen met het oude domein doorgaans onderdeel zijn van de registratie aan de servicekant. In sommige gevallen kan dit eenvoudigweg het domein toevoegen of wijzigen dat aan de service is gekoppeld.

### Kopieer de bestanden naar de nieuwe site

Kopieer uw nu gewijzigde bestanden naar uw nieuwe site. De technieken zijn dezelfde als die werden gebruikt tijdens [Installatie](../installation/installation/), d.w.z. met behulp van FTP.

## Kopieer de bestaande sitedatabase

### Maak een back-up van de database vanaf de oude server

Voor deze stap wordt het gebruik van _phpMyAdmin_ ten zeerste aanbevolen. Log in op _phpMyAdmin_ voor uw bestaande site, selecteer uw database en kies _Export_.

De standaardinstellingen zijn meestal prima, dus selecteer gewoon "Exportmethode" van _Quick_ en "Format" van _SQL_.

Gebruik de knop _Go_ om de databaseback-up te downloaden.

![Een database exporteren met phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Als u tabellen in uw database heeft die niet afkomstig zijn uit XOOPS of de modules ervan, en NOT geacht wordt te worden verplaatst, moet u de "Exportmethode" van _Aangepast_ selecteren en alleen de XOOPS-gerelateerde tabellen in uw database kiezen. (Deze beginnen met het "voorvoegsel" dat u tijdens de installatie hebt opgegeven. U kunt uw databasevoorvoegsel opzoeken in het bestand `xoops_data/data/secure.php`.)

### Herstel de database naar de nieuwe server

Op uw nieuwe host, met behulp van uw nieuwe database, herstelt u de database met behulp van [tools](../tools/tools.md), zoals het tabblad _Import_ in _phpMyAdmin_ (of _bigdump_ indien nodig).

### Update URL's en paden in de database

Update alle http-links naar bronnen op uw site in uw database. Dit kan een enorme inspanning zijn, en er is een [tool](../tools/tools.md) om dit gemakkelijker te maken.Interconnect/it heeft een product genaamd Search-Replace-DB dat hierbij kan helpen. Het wordt geleverd met ingebouwde kennis van Wordpress- en Drupal-omgevingen. Zoals het nu is, kan deze tool erg nuttig zijn, maar het is nog beter als het op de hoogte is van uw XOOPS. U kunt een XOOPS-bewuste versie vinden op [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Volg de instructies in het bestand README.md om dit hulpprogramma te downloaden en tijdelijk op uw site te installeren. Eerder hebben we de definitie van XOOPS_URL gewijzigd. Wanneer u dit hulpprogramma uitvoert, wilt u de originele XOOPS_URL-definitie vervangen door de nieuwe definitie, d.w.z. vervang [http://localhost/xoops](http://localhost/xoops) door [https://example.com](https://example.com)

![DB zoeken en vervangen gebruiken](/xoops-docs/2.7/img/installation/srdb-01.png)

Voer uw oude en nieuwe URL's in en kies de optie voor proefdraaien. Bekijk de wijzigingen en als alles er goed uitziet, ga dan voor de live run-optie. Met deze stap worden configuratie-items en links in uw inhoud opgespoord die verwijzen naar uw site URL.

![Wijzigingen in SRDB bekijken](/xoops-docs/2.7/img/installation/srdb-02.png)

Herhaal het proces met uw oude en nieuwe waarden voor XOOPS_ROOT_PATH.

#### Alternatieve aanpak zonder SRDB

Een andere manier om deze stap uit te voeren zonder de srdb-tool is door uw database te dumpen, de dump in een teksteditor te bewerken, de URL's en paden te wijzigen, en vervolgens de database opnieuw te laden vanuit uw bewerkte dump. Ja, dat proces is voldoende betrokken en brengt voldoende risico met zich mee dat mensen gemotiveerd werden om gespecialiseerde tools zoals Search-Replace-DB te maken.

## Probeer uw verplaatste site uit

Op dit punt zou uw site klaar moeten zijn om in de nieuwe omgeving te draaien!

Natuurlijk kunnen er altijd problemen zijn. Wees niet bang om vragen te stellen op de [xoops.org-forums](https://xoops.org/modules/newbb/index.php).