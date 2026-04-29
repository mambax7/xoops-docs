---
title: "Særlige emner"
---

Nogle specifikke systemsoftwarekombinationer kræver muligvis nogle yderligere konfigurationer for at fungere
 med XOOPS. Her er nogle detaljer om kendte problemer og vejledning til håndtering af dem.

## SELinux-miljøer

Visse filer og mapper skal kunne skrives under installation, opgradering og normal drift
af XOOPS. I et traditionelt Linux-miljø opnås dette ved at sikre, at
systembruger, som webserveren kører under, har tilladelser til XOOPS-bibliotekerne, normalt af 
indstille den passende gruppe for disse mapper.

SELinux-aktiverede systemer (såsom CentOS og RHEL) har en yderligere, en sikkerhedskontekst, som
kan begrænse en process evne til at ændre filsystemet. Disse systemer kan kræve 
ændringer i sikkerhedskonteksten for, at XOOPS fungerer korrekt.

XOOPS forventer frit at kunne skrive til visse mapper under normal drift. 
Derudover skal visse filer også være skrivbare under installationer og opgraderinger af XOOPS.
 
Under normal drift forventer XOOPS at være i stand til at skrive filer og oprette undermapper 
i disse mapper:

- `uploads` i den primære XOOPS webrod
- `xoops_data` uanset hvor den flyttes under installationen

Under en installations- eller opgraderingsproces skal XOOPS skrive til denne fil:

- `mainfile.php` i den primære XOOPS webrod

For et typisk CentOS Apache-baseret system kan ændringerne i sikkerhedskonteksten være 
udføres med disse kommandoer:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

Du kan gøre mainfile.php skrivbar med:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Bemærk: Når du installerer, kan du kopiere en tom hovedfil.php fra mappen *extras*.

Du bør også tillade httpd at sende mail:

```
setsebool -P httpd_can_sendmail=1
```

Andre indstillinger, du muligvis har brug for, omfatter:

Tillad httpd at oprette netværksforbindelser, dvs. hente rss-feeds eller foretage et API-kald:

```
setsebool -P httpd_can_network_connect 1
```

Aktiver netværksforbindelse til en database med:

```
setsebool -P httpd_can_network_connect_db=1
```

For mere information, se din systemdokumentation og/eller systemadministrator.

## Smarty 4 og brugerdefinerede temaer

XOOPS 2.7.0 opgraderede sin skabelonmotor fra Smarty 3 til **Smarty 4**. Smarty 4 er strengere
om skabelonsyntaks end Smarty 3, og et par mønstre, der blev tolereret i ældre skabeloner
vil nu forårsage fejl. Hvis du installerer en ny kopi af XOOPS 2.7.0 ved kun at bruge temaerne
og moduler, der leveres med udgivelsen, er der intet at bekymre sig om - hver afsendt skabelon
er blevet opdateret til Smarty 4-kompatibilitet.

Bekymringen gælder, når du er:

- opgradering af et eksisterende XOOPS 2.5.x-websted, der har brugerdefinerede temaer, eller
- installation af brugerdefinerede temaer eller ældre tredjepartsmoduler i XOOPS 2.7.0.

Før du skifter direkte trafik til et opgraderet websted, skal du køre preflight-scanneren, der leveres i
`/upgrade/` bibliotek. Den scanner `/themes/` og `/modules/` på udkig efter Smarty 4-inkompatibiliteter
og kan automatisk reparere mange af dem. Se den
[Preflight Check](../upgrading/upgrade/preflight.md) side for detaljer.

Hvis du rammer skabelonfejl efter en installation eller opgradering:

1. Kør `/upgrade/preflight.php` igen og løs eventuelle rapporterede problemer.
2. Ryd den kompilerede skabeloncache ved at fjerne alt undtagen `index.html` fra
   `xoops_data/caches/smarty_compile/`.
3. Skift midlertidigt til et afsendt tema, såsom `xbootstrap5` eller `default` for at bekræfte problemet
   er temaspecifik snarere end webstedsdækkende.
4. Valider eventuelle ændringer i tilpasset tema eller modulskabelon, før webstedet returneres til produktion.
