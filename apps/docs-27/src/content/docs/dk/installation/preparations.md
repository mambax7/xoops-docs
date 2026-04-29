---
title: "phpinfo"
---

Dette trin er valgfrit, men kan nemt spare dig for timers frustration.

Som en præinstallationstest af hostingsystemet oprettes et meget lille, men nyttigt PHP-script lokalt og uploades til målsystemet.

PHP-scriptet er kun én linje:

```php
<?php phpinfo();
```

Brug en teksteditor til at oprette en fil med navnet _info.php_ med denne ene linje.

Upload derefter denne fil til din webrod.

![Filezilla info.php Upload](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Få adgang til dit script ved at åbne det i din browser, dvs. få adgang til `http://example.com/info.php`. Hvis alt fungerer korrekt, bør du se en side som denne:

![phpinfo() Eksempel](/xoops-docs/2.7/img/installation/php-info.png)

Bemærk: nogle hostingtjenester kan deaktivere _phpinfo()_-funktionen som en sikkerhedsforanstaltning. Du vil normalt modtage en besked herom, hvis det er tilfældet.

Outputtet af scriptet kan være nyttigt til fejlfinding, så overvej at gemme en kopi af det.

Hvis testen virker, bør du være god til at gå til installationen. Du bør slette _info.php_ scriptet og fortsætte med installationen.

Hvis testen mislykkes, så undersøg hvorfor! Uanset hvilket problem er at forhindre denne simple test i at virke **vil** forhindre en rigtig installation i at fungere.
