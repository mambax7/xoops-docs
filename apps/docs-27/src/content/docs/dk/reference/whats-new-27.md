---
title: "Hvad er nyt i XOOPS 2.7.0"
---

XOOPS 2.7.0 er en væsentlig opdatering fra 2.5.x-serien. Før du installerer eller opgraderer, skal du gennemgå ændringerne på denne side, så du ved, hvad du kan forvente. Listen nedenfor er fokuseret på elementer, der påvirker installation og webstedsadministration - for en komplet liste over ændringer, se udgivelsesbemærkningerne, der følger med distributionen.

## PHP 8.2 er det nye minimum

XOOPS 2.7.0 kræver **PHP 8.2 eller nyere**. PHP 7.x og tidligere understøttes ikke længere. PHP 8.4 eller højere anbefales kraftigt.

**Handling:** Bekræft, at din vært tilbyder PHP 8.2+, før du starter. Se [Krav](installation/requirements.md).

## MySQL 5.7 er det nye minimum

Det nye minimum er **MySQL 5.7** (eller en kompatibel MariaDB). MySQL 8.4 eller højere anbefales kraftigt. MySQL 9.0 understøttes også.

De gamle advarsler om PHP/MySQL 8 kompatibilitetsproblemer gælder ikke længere, fordi de berørte PHP-versioner ikke længere understøttes af XOOPS.

## Smarty 4 erstatter Smarty 3

Dette er den største enkeltstående ændring for eksisterende websteder. XOOPS 2.7.0 bruger **Smarty 4** som sin skabelonmotor. Smarty 4 er strengere med hensyn til skabelonsyntaks end Smarty 3, og nogle brugerdefinerede temaer og modulskabeloner skal muligvis justeres, før de gengives korrekt.

For at hjælpe dig med at identificere og reparere disse problemer, sender XOOPS 2.7.0 en **preflight-scanner** i `upgrade/`-biblioteket, der undersøger dine eksisterende skabeloner for kendte Smarty 4-inkompatibiliteter og automatisk kan reparere mange af dem.

**Handling:** Hvis du opgraderer fra 2.5.x og har brugerdefinerede temaer eller ældre moduler, skal du køre [Preflight Check](upgrading/upgrade/preflight.md) _før_ du kører hovedopgraderingen.

## Komponiststyrede afhængigheder

XOOPS 2.7.0 bruger **Composer** til at administrere sine PHP-afhængigheder. Disse bor i `xoops_lib/vendor/`. Tredjepartsbiblioteker, der tidligere var samlet i kernen eller i moduler - PHPMailer, HTMLPurifier, Smarty og andre - leveres nu gennem Composer.

**Handling:** De fleste webstedsoperatører behøver ikke at gøre noget - frigiv tarballs, der leveres med `vendor/` allerede udfyldt. Hvis du flytter eller opgraderer et websted, skal du kopiere hele `xoops_lib/`-træet, inklusive `vendor/`. Udviklere, der kloner git-lageret, bør køre `composer install` inde i `htdocs/xoops_lib/`. Se [Noter for Developers](notes-for-developers/developers.md).

## Nye hærdede sessions-cookie-præferencer

To nye præferencer tilføjes under opgraderingen:

* **`session_cookie_samesite`** — styrer SameSite-attributten på sessionscookies (`Lax`, `Strict` eller `None`).
* **`session_cookie_secure`** — når aktiveret, sendes sessionscookies kun over HTTPS.

**Handling:** Efter opgradering skal du gennemgå disse under Systemindstillinger → Indstillinger → Generelle indstillinger. Se [Efter opgraderingen](upgrading/upgrade/ustep-04.md).

## Ny `tokens` tabel

XOOPS 2.7.0 tilføjer en `tokens`-databasetabel til generisk scoped token-lagring. Opgraderingsprogrammet opretter denne tabel automatisk som en del af 2.5.11 → 2.7.0 opgraderingen.

## Moderniseret adgangskodelagring

Kolonnen `bannerclient.passwd` er blevet udvidet til `VARCHAR(255)`, så den kan indeholde moderne adgangskode-hash (bcrypt, argon2). Opgradereren udvider automatisk kolonnen.

## Opdateret tema og modulopstilling

XOOPS 2.7.0 leveres med opdaterede frontend-temaer:

* `default`, `xbootstrap` (legacy), `xbootstrap5`, `xswatch4`, `xswatch5`, qzxph000054qxphq0, 0z5x

Et nyt **Moderne** administratortema er inkluderet sammen med det eksisterende overgangstema.

Et nyt **DebugBar**-modul baseret på Symfony VarDumper leveres som et af de valgfri installerbare moduler. Det er nyttigt til udvikling og iscenesættelse, men er typisk ikke installeret på offentlige produktionssteder.

Se [Vælg tema](installation/installation/step-12.md) og [Moduler Installation](installation/installation/step-13.md).

## Kopiering i en ny udgivelse overskriver ikke længere konfigurationenTidligere krævede kopiering af en ny XOOPS-distribution oven på et eksisterende websted omhu for at undgå overskrivning af `mainfile.php` og andre konfigurationsfiler. I 2.7.0 efterlader kopieringsprocessen eksisterende konfigurationsfiler intakte, hvilket gør opgraderinger mærkbart sikrere.

Du bør stadig lave en fuld backup før enhver opgradering.

## Mulighed for overbelastning af skabeloner i systemadministratortemaer

Administratortemaer i XOOPS 2.7.0 kan nu tilsidesætte individuelle systemadministratorskabeloner, hvilket gør det nemmere at tilpasse administrationsbrugergrænsefladen uden at forkaste hele systemmodulet.

## Hvad er ikke ændret

Af hensyn til sikkerheden fungerer disse dele af XOOPS på samme måde i 2.7.0, som de gjorde i 2.5.x:

* Installationssiderækkefølgen og det overordnede flow
* Konfigurationsopdelingen `mainfile.php` plus `xoops_data/data/secure.php`
* Den anbefalede praksis med at flytte `xoops_data` og `xoops_lib` uden for webroden
* Modulinstallationsmodellen og `xoops_version.php` manifestformat
* Arbejdsgangen for flytning af websted (sikkerhedskopiering, rediger `mainfile.php`/`secure.php`, brug SRDB eller lignende)

## Hvor skal man hen næste gang

* Starter du på en frisk? Fortsæt til [Requirements](installation/requirements.md).
* Opgradering fra 2.5.x? Start med [Opgradering](upgrading/upgrade/README.md), kør derefter [Preflight Check](upgrading/upgrade/preflight.md).
