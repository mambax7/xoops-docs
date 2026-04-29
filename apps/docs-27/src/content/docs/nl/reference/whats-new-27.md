---
title: "Wat is er nieuw in XOOPS 2.7.0"
---
XOOPS 2.7.0 is een belangrijke update van de 2.5.x-serie. Bekijk de wijzigingen op deze pagina voordat u installeert of upgradet, zodat u weet wat u kunt verwachten. De onderstaande lijst is gericht op items die van invloed zijn op de installatie en het sitebeheer. Voor een volledige lijst met wijzigingen raadpleegt u de release-opmerkingen die bij de distributie worden geleverd.

## PHP 8.2 is het nieuwe minimum

XOOPS 2.7.0 vereist **PHP 8.2 of nieuwer**. PHP 7.x en eerder worden niet langer ondersteund. PHP 8.4 of hoger wordt sterk aanbevolen.

**Actie:** Controleer of uw host PHP 8.2+ aanbiedt voordat u begint. Zie [Vereisten](installation/requirements.md).

## MySQL 5.7 is het nieuwe minimum

Het nieuwe minimum is **MySQL 5.7** (of een compatibele MariaDB). MySQL 8.4 of hoger wordt sterk aanbevolen. MySQL 9.0 wordt ook ondersteund.

De oude waarschuwingen over compatibiliteitsproblemen met PHP/MySQL 8 zijn niet langer van toepassing, omdat de getroffen PHP-versies niet langer worden ondersteund door XOOPS.

## Smarty 4 vervangt Smarty 3

Dit is de grootste verandering voor bestaande sites. XOOPS 2.7.0 gebruikt **Smarty 4** als sjabloonengine. Smarty 4 is strenger wat betreft sjabloonsyntaxis dan Smarty 3, en sommige aangepaste thema's en modulesjablonen moeten mogelijk worden aangepast voordat ze correct worden weergegeven.

Om u te helpen deze problemen te identificeren en te repareren, levert XOOPS 2.7.0 een **preflightscanner** in de `upgrade/`-directory die uw bestaande sjablonen onderzoekt op bekende Smarty 4-incompatibiliteiten en veel daarvan automatisch kan repareren.

**Actie:** Als u een upgrade uitvoert vanaf 2.5.x en aangepaste thema's of oudere modules hebt, voert u de [Preflightcontrole](upgrading/upgrade/preflight.md) uit voordat_ u de hoofdupgrade uitvoert.

## Door de componist beheerde afhankelijkheden

XOOPS 2.7.0 gebruikt **Composer** om de PHP-afhankelijkheden te beheren. Deze wonen in `xoops_lib/vendor/`. Bibliotheken van derden die voorheen in de kern of in modules waren gebundeld – PHPMailer, HTMLPurifier, Smarty en andere – worden nu geleverd via Composer.

**Actie:** De meeste site-exploitanten hoeven niets te doen — tarballs worden verzonden terwijl `vendor/` al is ingevuld. Als u een site verplaatst of upgradet, kopieert u de volledige `xoops_lib/`-structuur, inclusief `vendor/`. Ontwikkelaars die de git-repository klonen, moeten `composer install` in `htdocs/xoops_lib/` uitvoeren. Zie [Opmerkingen voor ontwikkelaars](notes-for-developers/developers.md).

## Nieuwe, strengere sessiecookievoorkeuren

Tijdens de upgrade worden twee nieuwe voorkeuren toegevoegd:

* **`session_cookie_samesite`** — beheert het SameSite-kenmerk voor sessiecookies (`Lax`, `Strict` of `None`).
* **`session_cookie_secure`** — indien ingeschakeld, worden sessiecookies alleen verzonden via HTTPS.

**Actie:** Controleer deze na het upgraden onder Systeemopties → Voorkeuren → Algemene instellingen. Zie [Na de upgrade](upgrading/upgrade/ustep-04.md).

## Nieuwe `tokens`-tabel

XOOPS 2.7.0 voegt een `tokens`-databasetabel toe voor generieke tokenopslag. De upgrader maakt deze tabel automatisch aan als onderdeel van de upgrade 2.5.11 → 2.7.0.

## Gemoderniseerde wachtwoordopslag

De kolom `bannerclient.passwd` is uitgebreid naar `VARCHAR(255)`, zodat deze moderne wachtwoord-hashes kan bevatten (bcrypt, argon2). De upgrader verbreedt de kolom automatisch.

## Bijgewerkte thema- en moduleopstelling

XOOPS 2.7.0 wordt geleverd met bijgewerkte front-endthema's:

* `default`, `xbootstrap` (verouderd), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Naast het bestaande Transition-thema is een nieuw **Modern** beheerdersthema opgenomen.

Een nieuwe **DebugBar**-module gebaseerd op Symfony VarDumper wordt geleverd als een van de optionele installeerbare modules. Het is nuttig voor ontwikkeling en enscenering, maar wordt doorgaans niet geïnstalleerd op openbare productielocaties.

Zie [Thema selecteren](installation/installation/step-12.md) en [Modules installeren](installation/installation/step-13.md).

## Bij het kopiëren naar een nieuwe release wordt de configuratie niet langer overschrevenVoorheen vereiste het kopiëren van een nieuwe XOOPS-distributie bovenop een bestaande site voorzichtigheid om te voorkomen dat `mainfile.php` en andere configuratiebestanden werden overschreven. In 2.7.0 laat het kopieerproces bestaande configuratiebestanden intact, wat upgrades merkbaar veiliger maakt.

U moet nog steeds een volledige back-up maken voordat u een upgrade uitvoert.

## Mogelijkheid tot overbelasting van sjablonen in systeembeheerthema's

Beheerdersthema's in XOOPS 2.7.0 kunnen nu individuele systeembeheerderssjablonen overschrijven, waardoor het eenvoudiger wordt om de beheerinterface aan te passen zonder de hele systeemmodule te splitsen.

## Wat is er niet veranderd

Ter geruststelling: deze onderdelen van XOOPS werken in 2.7.0 op dezelfde manier als in 2.5.x:

* De volgorde van de installatiepagina en de algehele stroom
* De `mainfile.php` plus `xoops_data/data/secure.php` configuratiesplitsing
* De aanbevolen praktijk om `xoops_data` en `xoops_lib` buiten de webroot te verplaatsen
* Het module-installatiemodel en het `xoops_version.php`-manifestformaat
* De workflow voor het verplaatsen van sites (back-up maken, `mainfile.php`/`secure.php` bewerken, SRDB of iets dergelijks gebruiken)

## Waar nu heen

* Vers beginnen? Ga verder naar [Vereisten](installation/requirements.md).
* Upgraden vanaf 2.5.x? Begin met [Upgraden](upgrading/upgrade/README.md) en voer vervolgens de [Preflightcontrole](upgrading/upgrade/preflight.md) uit.