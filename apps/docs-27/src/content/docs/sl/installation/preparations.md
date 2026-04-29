---
title: "phpinfo"
---
Ta korak ni obvezen, vendar vam lahko zlahka prihrani ure frustracij.

Kot preskus pred namestitvijo sistema gostovanja se lokalno ustvari zelo majhen, a uporaben skript PHP, ki se naloži v ciljni sistem.

Skript PHP je samo ena vrstica:
```php
<?php phpinfo();
```
Z urejevalnikom besedil ustvarite datoteko z imenom _info.php_ s to eno vrstico.

Nato naložite to datoteko v svoj spletni koren.

![Podatki o datoteki.php Upload](/XOOPS-docs/2.7/img/installation/filezilla-01-info.png)

Do svojega skripta dostopate tako, da ga odprete v brskalniku, tj. dostopate do `http://example.com/info.php`. Če vse deluje pravilno, bi morali videti približno takšno stran:

![phpinfo() Primer](/XOOPS-docs/2.7/img/installation/php-info.png)

Opomba: nekatere storitve gostovanja lahko onemogočijo funkcijo _phpinfo()_ kot varnostni ukrep. Običajno prejmete sporočilo o tem, če je temu tako.

Izhod skripta bi lahko prišel prav pri odpravljanju težav, zato razmislite o shranjevanju njegove kopije.

Če preizkus deluje, bi morali biti pripravljeni na namestitev. Izbrišite skript _info.php_ in nadaljujte z namestitvijo.

Če test ne uspe, raziščite zakaj! Ne glede na težavo, ki preprečuje delovanje tega preprostega preizkusa, **bo** preprečila delovanje prave namestitve.