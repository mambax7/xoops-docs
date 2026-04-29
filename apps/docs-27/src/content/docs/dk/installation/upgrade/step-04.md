---
title: "Efter opgraderingen"
---

## Opdater systemmodulet

Når alle nødvendige patches er blevet anvendt, vil valg af _Fortsæt_ indstille alt til at opdatere **system**-modulet. Dette er et meget vigtigt skridt og er nødvendigt for at fuldføre opgraderingen korrekt.

![XOOPS Update System Module](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Vælg _Opdater_ for at udføre opdateringen af systemmodulet.

## Opdater Andre XOOPS leverede moduler

XOOPS leveres med tre valgfrie moduler - pm (Privat Messaging) profil (Brugerprofil) og Protector (Protector) Du bør lave en opdatering på alle disse moduler, der er installeret.

![XOOPS Opdater andre moduler](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Opdater andre moduler

Det er sandsynligt, at der er opdateringer til andre moduler, der kan gøre det muligt for modulerne at fungere bedre under din nu opdaterede XOOPS. Du bør undersøge og anvende passende modulopdateringer.

## Gennemgå nye præferencer for hærdning af cookies

XOOPS 2.7.0-opgraderingen tilføjer to nye præferencer, der styrer, hvordan sessionscookies udstedes:

* **`session_cookie_samesite`** — styrer SameSite cookie-attributten. `Lax` er en sikker standard for de fleste websteder. Brug `Strict` for maksimal beskyttelse, hvis dit websted ikke er afhængig af krydsoprindelsesnavigation. `None` er kun passende, hvis du ved, at du har brug for det.
* **`session_cookie_secure`** — når den er aktiveret, sendes sessionscookien kun over HTTPS-forbindelser. Slå dette til, hvis dit websted kører på HTTPS.

Du kan gennemgå disse indstillinger under Systemindstillinger → Indstillinger → Generelle indstillinger.

## Valider brugerdefinerede temaer

Hvis dit websted bruger et tilpasset tema, skal du gå gennem frontend- og administrationsområdet for at bekræfte, at siderne gengives korrekt. Opgraderingen til Smarty 4 kan påvirke brugerdefinerede skabeloner, selvom preflight-scanningen bestod. Hvis du ser gengivelsesproblemer, skal du gense [Fejlfinding](ustep-03.md).

## Ryd op i installations- og opgraderingsfiler

Af sikkerhedsmæssige årsager skal du fjerne disse mapper fra din webrod, når opgraderingen er bekræftet, at den virker:

* `upgrade/` — mappen med opgraderingsarbejdsgange
* `install/` — hvis den findes, enten som `install/` eller som en omdøbt `installremove*`-mappe

Hvis du efterlader disse på plads, afsløres opgraderings- og installationsscripts for alle, der kan nå dit websted.

## Åbn dit websted

Hvis du fulgte rådet om at _Sluk dit websted_, bør du tænde det igen, når du har fastslået, at det fungerer korrekt.
