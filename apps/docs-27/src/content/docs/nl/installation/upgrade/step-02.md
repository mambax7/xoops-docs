---
title: "Upgrade uitvoeren"
---
Voordat u de hoofdupgrade uitvoert, moet u ervoor zorgen dat u de [Preflight-controle](preflight.md) hebt voltooid. De upgrade-UI vereist dat preflight minstens één keer wordt uitgevoerd en zal u daarheen leiden als u dat nog niet heeft gedaan.

Start de upgrade door uw browser naar de map _upgrade_ van uw site te verwijzen:

```text
http://example.com/upgrade/
```

Dit zou een pagina als deze moeten tonen:

![XOOPS Upgrade opstarten](/xoops-docs/2.7/img/installation/upgrade-01.png)

Selecteer de knop "Doorgaan" om door te gaan.

Elke "Continue" gaat door een andere patch. Blijf doorgaan totdat alle patches zijn toegepast en de pagina Systeemmodule-update wordt weergegeven.

![XOOPS Upgrade toegepaste patch](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Waar de upgrade 2.5.11 → 2.7.0 van toepassing is

Bij het upgraden van XOOPS 2.5.11 naar 2.7.0 past de upgrader de volgende patches toe. Elke stap wordt gepresenteerd als een afzonderlijke stap in de wizard, zodat u kunt bevestigen wat er wordt gewijzigd:

1. **Verwijder de verouderde gebundelde PHPMailer.** De gebundelde kopie van PHPMailer in de Protector-module is verwijderd. PHPMailer wordt nu geleverd via Composer in `xoops_lib/vendor/`.
2. **Verwijder de verouderde HTMLPurifier-map.** Op dezelfde manier wordt de oude HTMLPurifier-map in de Protector-module verwijderd. HTMLPurifier wordt nu geleverd via Composer.
3. **Maak de tabel `tokens`.** Er is een nieuwe tabel `tokens` toegevoegd voor algemene tokenopslag. De tabel bevat kolommen voor token-ID, gebruikers-ID, bereik, hash en uitgegeven/verloopt/gebruikte tijdstempels, en wordt gebruikt door op tokens gebaseerde functies in XOOPS 2.7.0.
4. **Verbreed `bannerclient.passwd`.** De kolom `bannerclient.passwd` is verbreed naar `VARCHAR(255)`, zodat deze moderne wachtwoord-hashes (bcrypt, argon2) kan opslaan in plaats van de oude smalle kolom.
5. **Voeg sessiecookievoorkeuren toe.** Er zijn twee nieuwe voorkeuren ingevoegd: `session_cookie_samesite` (voor het SameSite-cookiekenmerk) en `session_cookie_secure` (om alleen HTTPS-cookies af te dwingen). Zie [Na de upgrade](ustep-04.md) voor hoe u deze kunt bekijken nadat de upgrade is voltooid.

Geen van deze stappen heeft invloed op uw inhoudsgegevens. Uw gebruikers, berichten, afbeeldingen en modulegegevens blijven onaangetast.

## Een taal kiezen

De hoofddistributie XOOPS wordt geleverd met Engelse ondersteuning. Ondersteuning voor extra landinstellingen wordt geleverd door [XOOPS Lokale ondersteuningssites](https://xoops.org/modules/xoopspartners/). Deze ondersteuning kan de vorm hebben van een aangepaste distributie, of van extra bestanden die aan de hoofddistributie kunnen worden toegevoegd.

XOOPS-vertalingen worden bijgehouden op [transifex](https://www.transifex.com/xoops/public/)

Als uw XOOPS Upgrader extra taalondersteuning heeft, kunt u de taal wijzigen door het taalpictogram in de hoofdmenu's te selecteren en een andere taal te kiezen.

![XOOPS Upgrade-taal](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)