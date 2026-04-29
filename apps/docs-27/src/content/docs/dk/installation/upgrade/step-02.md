---
title: "Kører opgradering"
---

Før du kører hovedopgraderingen, skal du sikre dig, at du har gennemført [Preflight Check](preflight.md). Opgraderingsbrugergrænsefladen kræver, at preflight køres mindst én gang og vil dirigere dig dertil, hvis du ikke har gjort det.

Start opgraderingen ved at pege din browser til mappen _upgrade_ på dit websted:

```text
http://example.com/upgrade/
```

Dette skulle vise en side som denne:

![XOOPS Upgrade Startup](/xoops-docs/2.7/img/installation/upgrade-01.png)

Vælg knappen "Fortsæt" for at fortsætte.

Hver "Fortsæt" går videre gennem en anden patch. Fortsæt, indtil alle programrettelser er påført, og siden med opdatering af systemmoduler vises.

![XOOPS Upgrade Applied Patch](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Hvad 2.5.11 → 2.7.0-opgraderingen gælder

Ved opgradering fra XOOPS 2.5.11 til 2.7.0 anvender opgraderingsprogrammet følgende patches. Hvert trin præsenteres som et separat trin i guiden, så du kan bekræfte, hvad der ændres:

1. **Fjern forældede bundtede PHPMailer.** Den medfølgende kopi af PHPMailer inde i Protector-modulet slettes. PHPMailer leveres nu gennem Composer i `xoops_lib/vendor/`.
2. **Fjern forældet HTMLPurifier-mappe.** På samme måde slettes den gamle HTMLPurifier-mappe inde i Protector-modulet. HTMLPurifier leveres nu gennem Composer.
3. **Opret `tokens`-tabellen.** En ny `tokens`-tabel er tilføjet til generisk scoped token-lagring. Tabellen har kolonner for token-id, bruger-id, omfang, hash og udstedte/udløber/brugte tidsstempler og bruges af token-baserede funktioner i XOOPS 2.7.0.
4. **Udvid `bannerclient.passwd`.** Kolonnen `bannerclient.passwd` er udvidet til `VARCHAR(255)`, så den kan gemme moderne adgangskode-hashes (bcrypt, argon2) i stedet for den gamle smalle kolonne.
5. **Tilføj sessionscookie-præferencer.** To nye præferencer er indsat: `session_cookie_samesite` (for SameSite cookie-attributten) og `session_cookie_secure` (for at tvinge HTTPS-på cookies). Se [Efter opgraderingen](ustep-04.md) for, hvordan du gennemgår disse efter opgraderingen er fuldført.

Ingen af ​​disse trin berører dine indholdsdata. Dine brugere, indlæg, billeder og moduldata forbliver uberørte.

## Valg af sprog

Den primære XOOPS-distribution leveres med engelsk support. Support til yderligere lokaliteter leveres af [XOOPS lokale supportwebsteder](https://xoops.org/modules/xoopspartners/). Denne support kan komme i form af en tilpasset distribution eller yderligere filer til at føje til hoveddistributionen.

XOOPS-oversættelser vedligeholdes på [transifex](https://www.transifex.com/xoops/public/)

Hvis din XOOPS Upgrader har yderligere sprogunderstøttelse, kan du ændre sproget ved at vælge sprogikonet i topmenuerne og vælge et andet sprog.

![XOOPS opgraderingssprog](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
