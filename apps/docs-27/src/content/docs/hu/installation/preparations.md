---
title: "phpinfo"
---
Ez a lépés nem kötelező, de könnyen megspórolhat órákat a frusztrációtól.

A hosting rendszer telepítés előtti tesztjeként egy nagyon kicsi, de hasznos PHP szkript készül lokálisan, és feltöltődik a célrendszerre.

A PHP szkript csak egy sorból áll:

```php
<?php phpinfo();
```

Szövegszerkesztővel hozzon létre egy _info.php_ nevű fájlt ezzel az egy sorral.

Ezután töltse fel ezt a fájlt a webgyökérbe.

![Filezilla info.php Feltöltés](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

A szkript eléréséhez nyissa meg a böngészőben, azaz a `http://example.com/info.php`. elérésével. Ha minden megfelelően működik, egy ehhez hasonló oldalt kell látnia:

![phpinfo() Példa](/xoops-docs/2.7/img/installation/php-info.png)

Megjegyzés: egyes tárhelyszolgáltatások biztonsági intézkedésként letilthatják a _phpinfo()_ funkciót. Általában erre vonatkozó üzenetet fog kapni, ha ez a helyzet.

A szkript kimenete hasznos lehet a hibaelhárításhoz, ezért fontolja meg egy másolat mentését.

Ha a teszt működik, akkor készen kell állnia a telepítésre. Törölje az _info.php_ szkriptet, és folytassa a telepítést.

Ha a teszt sikertelen, vizsgálja meg, miért! Bármilyen probléma is akadályozza ennek az egyszerű tesztnek a működését, az megakadályozza** a valódi telepítést.
