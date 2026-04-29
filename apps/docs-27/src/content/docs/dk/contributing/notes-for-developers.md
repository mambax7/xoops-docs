---
title: "Noter til udviklere"
---

Mens den faktiske installation af XOOPS til udviklingsbrug ligner den normale installation, der allerede er beskrevet, er der vigtige forskelle, når man bygger et udviklerklart system.

En stor forskel i en udviklerinstallation er, at i stedet for blot at fokusere på indholdet af _htdocs_-mappen, beholder en udviklerinstallation alle filerne og holder dem under kildekodekontrol ved hjælp af git.

En anden forskel er, at mapperne _xoops_data_ og _xoops_lib_ normalt kan forblive på plads uden at omdøbe, så længe dit udviklingssystem ikke er direkte tilgængeligt på det åbne internet (dvs. på et privat netværk, såsom bag en router).

De fleste udviklere arbejder på et _localhost_-system, der har kildekoden, en webserverstak og alle nødvendige værktøjer til at arbejde med koden og databasen.

Du kan finde flere oplysninger i kapitlet [Tools of the Trade](../tools/tools.md).

## Git og virtuelle værter

De fleste udviklere ønsker at være i stand til at holde sig opdateret med aktuelle kilder og bidrage med ændringer tilbage til upstream [XOOPS/XoopsCore27 repository på GitHub](https://github.com/XOOPS/XoopsCore27). Dette betyder, at i stedet for at downloade et udgivelsesarkiv, vil du gerne [fork](https://help.github.com/articles/fork-a-repo/) en kopi af XOOPS og bruge **git** til at [klone](https://help.github.com/categories/bootcamp/) det lager til din dev-boks.

Da lageret har en specifik struktur, i stedet for at _kopiere_ filer fra mappen _htdocs_ til din webserver, er det bedre at pege din webserver til mappen htdocs inde i dit lokalt klonede lager. For at opnå dette opretter vi typisk en ny _Virtual Host_ eller _vhost_, der peger på vores git-kontrollerede kildekode.

I et [WAMP](http://www.wampserver.com/) miljø har standardsiden [localhost](http://localhost/) i sektionen _Tools_ et link til _Add a Virtual Host_, som fører her:

![WAMP Tilføj virtuel vært](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Ved at bruge dette kan du konfigurere en VirtualHost-post, der falder lige ind i dit (stadig) git-kontrollerede lager.

Her er et eksempel på en post i `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Du skal muligvis også tilføje en post i `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Nu kan du installere på `http://xoops.localhost/` til test, mens du holder dit lager intakt og holder webserveren inde i htdocs-biblioteket med en simpel URL. Derudover kan du til enhver tid opdatere din lokale kopi af XOOPS til den nyeste master uden at skulle geninstallere eller kopiere filer. Og du kan foretage forbedringer og rettelser til koden for at bidrage tilbage til XOOPS gennem GitHub.

## Komponistafhængigheder

XOOPS 2.7.0 bruger [Composer](https://getcomposer.org/) til at administrere sine PHP-afhængigheder. Afhængighedstræet lever i `htdocs/xoops_lib/` inde i kildelageret:

* `composer.dist.json` er hovedlisten over afhængigheder, der leveres med udgivelsen.
*`composer.json` er den lokale kopi, som du kan tilpasse til dit udviklingsmiljø, hvis det er nødvendigt.
* `composer.lock` stifter nøjagtige versioner, så installationer er reproducerbare.
* `vendor/` indeholder de installerede biblioteker (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom og andre).

For en frisk git-klon af XOOPS 2.7.0, startende fra reporoden, kør:

```text
cd htdocs/xoops_lib
composer install
```

Bemærk, at der ikke er nogen `composer.json` ved reporoden - projektet lever under `htdocs/xoops_lib/`, så du skal `cd` ind i den mappe, før du kører Composer.

Release tarballs sendes med `vendor/` forudbefolket, men git-kloner er muligvis ikke. Hold `vendor/` intakt ved udviklingsinstallationer - XOOPS indlæser sine afhængigheder derfra under kørsel.

[XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf)-biblioteket leveres som en Composer-afhængighed i 2.7.0, så du kan bruge `Xmf\Request`, 000061qxz og dine modul-, qzx- og relaterede koder i 2.7.0. ekstra installation.

## DebugBar modulXOOPS 2.7.0 sender et **DebugBar**-modul baseret på Symfony VarDumper. Det tilføjer en fejlretningsværktøjslinje til gengivet sider, der afslører oplysninger om anmodning, database og skabelon. Installer det fra modulets administrationsområde på udviklings- og iscenesættelsessteder. Lad det ikke være installeret på et offentligt vendt produktionssted, medmindre du ved, at du vil.
