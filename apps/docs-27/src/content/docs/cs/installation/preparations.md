---
title: "phpinfo"
---

Tento krok je volitelný, ale může vám snadno ušetřit hodiny frustrace.

Jako předinstalační test hostitelského systému je lokálně vytvořen velmi malý, ale užitečný skript PHP a nahrán do cílového systému.

Skript PHP je pouze jeden řádek:

```php
<?php phpinfo();
```

Pomocí textového editoru vytvořte soubor s názvem _info.php_ s tímto jedním řádkem.

Dále nahrajte tento soubor do svého webového kořenového adresáře.

![Nahrání souboru info.php](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Otevřete svůj skript otevřením v prohlížeči, tj. přístupem k `http://example.com/info.php`. Pokud vše funguje správně, měla by se vám zobrazit stránka podobná této:

![phpinfo() příklad](/xoops-docs/2.7/img/installation/php-info.png)

Poznámka: Některé hostingové služby mohou jako bezpečnostní opatření zakázat funkci _phpinfo()_. Pokud tomu tak je, obvykle obdržíte zprávu v tomto smyslu.

Výstup skriptu se může hodit při odstraňování problémů, zvažte proto uložení jeho kopie.

Pokud test funguje, měli byste jít na instalaci. Měli byste smazat skript _info.php_ a pokračovat v instalaci.

Pokud test selže, zjistěte proč! Bez ohledu na problém, který brání fungování tohoto jednoduchého testu, **bude** bránit skutečné instalaci ve fungování.