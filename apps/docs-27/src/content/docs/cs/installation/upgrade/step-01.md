---
title: "Přípravy na upgrade"
---

## Vypnout web

Před zahájením procesu upgradu XOOPS byste měli nastavit "Vypnout svůj web?" položku na _Ano_ v Předvolbách -&gt; Možnosti systému -&gt; Stránka Obecná nastavení v nabídce Správa.

Uživatelé tak během upgradu nenarazí na nefunkční web. Také udržuje spory o zdroje na minimu, aby byl zajištěn hladší upgrade.

Místo chyb a nefunkčního webu se vašim návštěvníkům zobrazí něco takového:

![Web pro mobily uzavřen](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Záloha

Před provedením úplné zálohy souborů webu je dobré použít sekci _Údržba_ XOOPS k _Vyčištění složky mezipaměti_ pro všechny mezipaměti. Při vypnutém webu se také doporučuje použít _Empty the sessions table_, takže pokud je potřeba obnovení, nebudou zastaralé relace součástí.

### Soubory

Zálohu souborů lze provést pomocí FTP, zkopírováním všech souborů do místního počítače. Pokud máte přímý přístup k serveru, může být _mnohem_ rychlejší vytvořit tam kopii (nebo archivní kopii).

### Databáze

Pro vytvoření zálohy databáze můžete použít vestavěné funkce v sekci Správa XOOPS _Maintenance_. Můžete také použít funkce _Export_ v _phpMyAdmin_, pokud jsou k dispozici. Pokud máte přístup k shellu, můžete použít příkaz _mysql_ k výpisu databáze.

Umět plynule zálohovat a _obnovovat_ databázi je důležitá dovednost webmastera. Existuje mnoho online zdrojů, které můžete použít, abyste se dozvěděli více o těchto operacích podle vaší instalace, například [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![Export phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Zkopírujte nové soubory na web

Kopírování nových souborů na váš web je prakticky totožné s krokem [Přípravy](../../installation/preparations/) během instalace. Adresáře _xoops_data_ a _xoops_lib_ byste měli zkopírovat kamkoli, kam byly během instalace přemístěny. Poté zkopírujte zbytek obsahu adresáře _htdocs_ distribuce (s několika výjimkami uvedenými v další části) přes existující soubory a adresáře ve vašem webovém kořenovém adresáři.

V XOOPS 2.7.0 kopírování nové distribuce nad existující web **nepřepíše existující konfigurační soubory**, jako je `mainfile.php` nebo `xoops_data/data/secure.php`. Toto je vítaná změna oproti dřívějším verzím, ale přesto byste měli před spuštěním provést úplnou zálohu.

Zkopírujte celý adresář _upgrade_ z distribuce do svého webového kořenového adresáře a vytvořte v něm adresář _upgrade_.

## Spusťte kontrolu před výstupem Smarty 4

Před spuštěním hlavního pracovního postupu `/upgrade/` musíte spustit skener kontroly před výstupem dodaný v adresáři `upgrade/`. Zkoumá vaše stávající motivy a šablony modulů na problémy s kompatibilitou Smarty 4 a mnoho z nich dokáže automaticky opravit.

1. Nasměrujte svůj prohlížeč na _your-site-url_/upgrade/preflight.php
2. Přihlaste se pomocí účtu správce
3. Spusťte kontrolu a zkontrolujte zprávu
4. Použijte všechny nabízené automatické opravy nebo opravte označené šablony ručně
5. Znovu spusťte kontrolu, dokud nebude čistá
6. Teprve poté pokračujte k hlavní aktualizaci

Úplný návod najdete na stránce [Preflight Check](preflight.md).

### Věci, které byste možná nechtěli kopírovat

Neměli byste znovu kopírovat adresář _install_ do funkčního systému XOOPS. Ponechání instalační složky v instalaci XOOPS vystavuje váš systém potenciálním bezpečnostním problémům. Instalační program jej náhodně přejmenuje, ale měli byste jej odstranit a ujistit se, že nekopírujete do jiného.

Některé soubory jste možná upravili za účelem přizpůsobení svého webu a budete je chtít zachovat. Zde je seznam běžných přizpůsobení.

* _xoops_data/configs/xoopsconfig.php_, pokud byl od instalace webu změněn
* všechny adresáře v _themes_, pokud jsou přizpůsobeny pro váš web. V tomto případě možná budete chtít porovnat soubory, abyste zjistili užitečné aktualizace.
* jakýkoli soubor v _class/captcha/_ začínající "config", pokud byl změněn od instalace webu
* jakékoli úpravy v _class/textsanitizer_
* jakékoli úpravy v _class/xoopseditor_

Pokud po upgradu zjistíte, že bylo něco omylem přepsáno, nepropadejte panice – proto jste začali s plnou zálohou. _(Udělal jsi zálohu, že?)_

## Zkontrolujte mainfile.php (upgrade z Pre-2.5 XOOPS)Tento krok platí pouze v případě, že upgradujete ze staré verze XOOPS (2.3 nebo starší). Pokud upgradujete ze XOOPS 2.5.x, můžete tuto část přeskočit.

Staré verze XOOPS vyžadovaly provedení některých ručních změn v `mainfile.php`, aby byl modul Protector povolen. V kořenovém adresáři webu byste měli mít soubor s názvem `mainfile.php`. Otevřete tento soubor v editoru a vyhledejte tyto řádky:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

a

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Pokud tyto řádky najdete, odstraňte je a před pokračováním soubor uložte.