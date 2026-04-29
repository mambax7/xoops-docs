---
title: "Bijlage 5: Verhoog de veiligheid van uw XOOPS installatie"
---
Nadat u XOOPS 2.7.0 hebt geïnstalleerd, voert u de volgende stappen uit om de site te verharden. Elke stap is afzonderlijk optioneel, maar samen verhogen ze de basisbeveiliging van de installatie aanzienlijk.

## 1. Installeer en configureer de Protector-module

De meegeleverde `protector`-module is de XOOPS-firewall. Als u het niet tijdens de initiële wizard hebt geïnstalleerd, installeer het dan nu vanuit het scherm Beheerder → Modules.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Open het beheerderspaneel van Protector en bekijk de waarschuwingen die worden weergegeven. Legacy PHP-richtlijnen zoals `register_globals` bestaan ​​niet meer (PHP 8.2+ heeft ze verwijderd), dus u zult deze waarschuwingen niet meer zien. Huidige waarschuwingen hebben meestal betrekking op maprechten, sessie-instellingen en configuratie van het vertrouwenspad.

## 2. Vergrendel `mainfile.php` en `secure.php`

Wanneer het installatieprogramma klaar is, probeert het beide bestanden als alleen-lezen te markeren, maar sommige hosts draaien de machtigingen terug. Verifiëren en indien nodig opnieuw toepassen:

- `mainfile.php` → `0444` (eigenaar, groep, andere alleen-lezen)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` definieert de padconstanten (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) en productievlaggen. `secure.php` bevat de databasereferenties:

- In 2.5.x bevonden de databasereferenties zich in `mainfile.php`. Ze worden nu opgeslagen in `xoops_data/data/secure.php`, dat tijdens runtime door `mainfile.php` wordt geladen. Door `secure.php` binnen `xoops_data/` te houden – een map die u buiten de hoofdmap van het document moet verplaatsen – wordt het voor een aanvaller veel moeilijker om de inloggegevens via HTTP te bereiken.

## 3. Verplaats `xoops_lib/` en `xoops_data/` buiten de documenthoofdmap

Als u dit nog niet heeft gedaan, verplaatst u deze twee mappen één niveau boven uw webroot en hernoemt u ze. Werk vervolgens de overeenkomstige constanten in `mainfile.php` bij:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Door deze mappen buiten de hoofdmap van het document te plaatsen, wordt directe toegang tot de `vendor/`-structuur van Composer, in de cache opgeslagen sjablonen, sessiebestanden, geüploade gegevens en de databasegegevens in `secure.php` voorkomen.

## 4. Cookie-domeinconfiguratie

XOOPS 2.7.0 introduceert twee cookie-domeinconstanten in `mainfile.php`:

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

Richtlijnen:

- Laat `XOOPS_COOKIE_DOMAIN` leeg als u XOOPS bedient vanaf een enkele hostnaam of vanaf een IP-adres.
- Gebruik de volledige host (bijvoorbeeld `www.example.com`) om cookies alleen op die hostnaam te richten.
- Gebruik het registreerbare domein (bijvoorbeeld `example.com`) als u wilt dat cookies worden gedeeld tussen `www.example.com`, `blog.example.com`, enz.
- Met `XOOPS_COOKIE_DOMAIN_USE_PSL = true` kan XOOPS samengestelde TLD's (`co.uk`, `com.au`, …) correct splitsen in plaats van per ongeluk een cookie in te stellen op de effectieve TLD.

## 5. Productievlaggen in `mainfile.php`

`mainfile.dist.php` wordt geleverd met deze twee vlaggen ingesteld op `false` voor productie:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

Laat ze staan tijdens de productie. Schakel ze tijdelijk in in een ontwikkelings- of faseringsomgeving wanneer u het volgende wilt:

- slepende verouderde databaseoproepen opsporen (`XOOPS_DB_LEGACY_LOG = true`);
- `E_USER_DEPRECATED`-meldingen en andere foutopsporingsuitvoer (`XOOPS_DEBUG = true`) weergeven.

## 6. Verwijder het installatieprogramma

Nadat de installatie is voltooid:

1. Verwijder alle hernoemde `install_remove_*`-directory's uit de webroot.
2. Verwijder alle `install_cleanup_*.php`-scripts die de wizard tijdens het opschonen heeft gemaakt.
3. Controleer of de map `install/` niet langer bereikbaar is via HTTP.

Het verlaten van een uitgeschakelde maar aanwezige installatiemap is een laag maar vermijdbaar risico.

## 7. XOOPS en modules up-to-date houden

XOOPS volgt een regelmatige patchcadans. Abonneer u op de XoopsCore27 GitHub-repository voor releasemeldingen en update uw site en eventuele modules van derden wanneer er een nieuwe release wordt uitgebracht. De beveiligingsupdates voor 2.7.x worden gepubliceerd via de Releases-pagina van de repository.