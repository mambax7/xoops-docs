---
title: "phpinfo"
---
Ovaj korak nije obavezan, ali vam lako može uštedjeti sate frustracije.

Kao test prije instalacije hosting sustava, vrlo mala, ali korisna PHP skripta kreira se lokalno i prenese na ciljni sustav.

Skripta PHP sastoji se od samo jednog retka:

```php
<?php phpinfo();
```

Pomoću uređivača teksta stvorite datoteku pod nazivom _info.php_ s ovim jednim retkom.

Zatim prenesite ovu datoteku u svoj web root.

![Filezilla info.php Upload](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Pristupite svojoj skripti tako da je otvorite u svom pregledniku, tj. pristupite `http://example.com/info.php`. Ako sve radi ispravno, trebali biste vidjeti stranicu otprilike ovu:

![phpinfo() Primjer](/xoops-docs/2.7/img/installation/php-info.png)

Napomena: neke usluge hostinga mogu onemogućiti funkciju _phpinfo()_ kao sigurnosnu mjeru. Obično ćete primiti poruku u tom smislu, ako je to slučaj.

Izlaz skripte mogao bi biti koristan za rješavanje problema, stoga razmislite o spremanju njegove kopije.

Ako test uspije, trebali biste biti spremni za instalaciju. Trebali biste izbrisati skriptu _info.php_ i nastaviti s instalacijom.

Ako test ne uspije, istražite zašto! Bilo koji problem koji sprječava rad ovog jednostavnog testa **spriječiće** stvarnu instalaciju da radi.
