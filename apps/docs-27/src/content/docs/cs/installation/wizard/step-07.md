---
title: "Uložit konfiguraci"
---

Tato stránka zobrazuje výsledky ukládání konfiguračních informací, které jste do tohoto okamžiku zadali.

Po kontrole a opravě případných problémů pokračujte kliknutím na tlačítko „Pokračovat“.

## O úspěchu

Sekce _Uložení konfigurace systému_ zobrazuje informace, které byly uloženy. Nastavení se uloží do jednoho ze dvou souborů. Jeden soubor je _mainfile.php_ v kořenovém adresáři webu. Druhý je _data/secure.php_ v adresáři _xoops_data_.

![XOOPS Installer Save Configuration](/xoops-docs/2.7/img/installation/installer-07.png)

Oba soubory jsou generovány ze souborů šablon dodaných se XOOPS 2.7.0:

* `mainfile.php` se generuje z `mainfile.dist.php` v kořenovém adresáři webu.
* `xoops_data/data/secure.php` je generován z `xoops_data/data/secure.dist.php`.

Kromě cest a URL, které jste zadali, `mainfile.php` nyní obsahuje několik konstant, které jsou nové v XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — zachováno jako zpětně kompatibilní alias `XOOPS_PATH`; nemusíte jej konfigurovat samostatně.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — výchozí `true`; používá seznam veřejných přípon k odvození správné domény souborů cookie.
* `XOOPS_DB_LEGACY_LOG` — výchozí `false`; nastavena na `true` ve vývoji pro protokolování použití starších databázových API.
* `XOOPS_DEBUG` — výchozí `false`; nastaven na `true` ve vývoji, aby bylo možné hlásit další chyby.

Během instalace je nemusíte ručně upravovat – výchozí hodnoty jsou vhodné pro produkční web. Jsou zde zmíněny, abyste věděli, co hledat, pokud `mainfile.php` otevřete později.

## Chyby

Pokud XOOPS zjistí chyby při zápisu konfiguračních souborů, zobrazí zprávy s podrobnostmi o tom, co je špatně.

![Chyby konfigurace uložení instalačního programu XOOPS](/xoops-docs/2.7/img/installation/installer-07-errors.png)

V mnoha případech je zdrojem chyb výchozí instalace systému odvozeného z Debianu pomocí mod_php v Apache. Většina poskytovatelů hostingu má konfigurace, které tyto problémy nemají.

### Problémy s oprávněním skupiny

Proces PHP je spuštěn pomocí oprávnění některého uživatele. Soubory jsou také ve vlastnictví některých uživatelů. Pokud tito dva nejsou stejným uživatelem, lze použít skupinová oprávnění, která procesu PHP umožní sdílet soubory s vaším uživatelským účtem. To obvykle znamená, že musíte změnit skupinu souborů a adresářů, do kterých XOOPS potřebuje zapisovat.

Pro výchozí konfiguraci uvedenou výše to znamená, že skupina _www-data_ musí být specifikována jako skupina pro soubory a adresáře a tyto soubory a adresáře musí být zapisovatelné po skupinách.

Měli byste pečlivě zkontrolovat konfiguraci a pečlivě zvolit, jak tyto problémy vyřešit pro krabici dostupnou na otevřeném internetu.

Příklad příkazů může být:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Nelze vytvořit mainfile.php

V systémech podobných Unixu závisí oprávnění k vytvoření nového souboru na oprávněních udělených nadřazené složce. V některých případech toto povolení není k dispozici a jeho udělení může představovat bezpečnostní problém.

Pokud máte problém s konfigurací, můžete najít fiktivní soubor _mainfile.php_ v adresáři _extras_ v distribuci XOOPS. Zkopírujte tento soubor do webového kořenového adresáře a nastavte oprávnění k souboru:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### Prostředí SELinux

Kontexty zabezpečení SELinux mohou být zdrojem problémů. Pokud by to mohlo platit, další informace naleznete v části [Speciální témata](../specialtopics.md).