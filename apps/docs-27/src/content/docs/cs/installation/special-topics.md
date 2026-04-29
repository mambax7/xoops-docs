---
title: "Speciální témata"
---

Některé specifické kombinace systémového softwaru mohou vyžadovat některé další konfigurace, aby fungovaly
 s XOOPS. Zde jsou některé podrobnosti o známých problémech a pokyny, jak je řešit.

## Prostředí SELinux

Některé soubory a adresáře musí být zapisovatelné během instalace, upgradu a normálního provozu
z XOOPS. V tradičním prostředí Linuxu je toho dosaženo zajištěním, že
systémový uživatel, pod kterým webový server běží, má oprávnění k adresářům XOOPS, obvykle 
nastavení příslušné skupiny pro tyto adresáře.

Systémy podporující SELinux (jako CentOS a RHEL) mají další bezpečnostní kontext, který
může omezit schopnost procesů změnit systém souborů. Tyto systémy mohou vyžadovat 
změní kontext zabezpečení pro XOOPS, aby fungoval správně.

XOOPS očekává, že během normálního provozu bude moci volně zapisovat do určitých adresářů. 
Kromě toho během instalací a upgradů XOOPS musí být možné zapisovat také určité soubory.
 
Během normálního provozu XOOPS očekává, že bude schopen zapisovat soubory a vytvářet podadresáře 
v těchto adresářích:

- `uploads` v hlavním webovém kořeni XOOPS
- `xoops_data` bez ohledu na to, kde se během instalace přemístí

Během procesu instalace nebo upgradu bude muset XOOPS zapsat do tohoto souboru:

- `mainfile.php` v hlavním webovém kořeni XOOPS

U typického systému založeného na CentOS Apache může dojít ke změnám kontextu zabezpečení 
provedené těmito příkazy:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

mainfile.php můžete učinit zapisovatelným pomocí:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Poznámka: Při instalaci můžete zkopírovat prázdný mainfile.php z adresáře *extras*.

Také byste měli povolit httpd odesílat poštu:

```
setsebool -P httpd_can_sendmail=1
```

Mezi další nastavení, která můžete potřebovat, patří:

Povolit httpd vytvářet síťová připojení, tj. načítat zdroje RSS nebo provádět volání API:

```
setsebool -P httpd_can_network_connect 1
```

Povolte síťové připojení k databázi pomocí:

```
setsebool -P httpd_can_network_connect_db=1
```

Další informace naleznete v dokumentaci systému and/or správce systému.

## Smarty 4 a vlastní motivy

XOOPS 2.7.0 upgradoval svůj šablonovací engine z Smarty 3 na **Smarty 4**. Smarty 4 je přísnější
o syntaxi šablony než Smarty 3 a několika vzorech, které byly tolerovány ve starších šablonách
nyní způsobí chyby. Pokud instalujete novou kopii XOOPS 2.7.0 pouze pomocí motivů
a moduly dodávané s vydáním, není se čeho bát — každá dodávaná šablona
byl aktualizován pro kompatibilitu Smarty 4.

Obava platí, když jste:

- upgrade stávajícího webu XOOPS 2.5.x, který má vlastní motivy, nebo
- instalace vlastních motivů nebo starších modulů třetích stran do XOOPS 2.7.0.

Před přepnutím živého provozu na aktualizovaný web spusťte předletový skener, který je součástí dodávky
Adresář `/upgrade/`. Skenuje `/themes/` a `/modules/` a hledá nekompatibility Smarty 4
a mnoho z nich dokáže automaticky opravit. Viz
Podrobnosti na stránce [Předletová kontrola](../upgrading/upgrade/preflight.md).

Pokud po instalaci nebo upgradu narazíte na chyby šablony:

1. Spusťte znovu `/upgrade/preflight.php` a vyřešte všechny hlášené problémy.
2. Vymažte mezipaměť kompilované šablony odstraněním všeho kromě `index.html`
   `xoops_data/caches/smarty_compile/`.
3. Dočasně přepněte na dodaný motiv, jako je `xbootstrap5` nebo `default`, abyste potvrdili problém
   je spíše tématicky zaměřený než celý web.
4. Před vrácením webu do výroby ověřte jakékoli změny vlastního motivu nebo šablony modulu.