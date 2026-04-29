---
title: "Nástroje obchodu"
---

Existuje mnoho věcí, které jsou potřeba k přizpůsobení a údržbě webové stránky XOOPS, které se musí dít mimo XOOPS nebo je tam lze snadněji provést.

Toto je seznam typů nástrojů, které byste mohli chtít mít k dispozici, spolu s některými návrhy konkrétních nástrojů, které webmasteři XOOPS považovali za užitečné.

## Redakce

Redaktoři jsou velmi osobní volbou a lidé se mohou pro svého oblíbence docela nadchnout. Uvedeme jen některé z mnoha možností.

Pro použití XOOPS budete potřebovat editor, který vyladí některé možnosti konfigurace a také přizpůsobí motiv pro váš web. Pro tato použití může být velmi užitečné mít editor, který dokáže pracovat s více soubory současně, dokáže vyhledávat a nahrazovat mnoho souborů a poskytuje zvýraznění syntaxe. Můžete použít velmi jednoduchý editor bez kudrlinek, ale na splnění některých úkolů budete pracovat mnohem tvrději.

**PHPStorm** od _JetBrains_ je IDE (integrované vývojové prostředí) speciálně přizpůsobené pro vývoj webu PHP. Společnost _JetBrains_ byla velmi nápomocná při sponzorování XOOPS a její produkty jsou oblíbené pro mnoho vývojářů. Je to komerční produkt a pro některé nové webmastery může být cenově nedostupný, ale čas, který může ušetřit, jej činí atraktivním pro zkušené vývojáře.

**Visual Studio Code** je bezplatný editor zdrojového kódu pro více platforem od společnosti Microsoft. Má podporu, buď vestavěnou, nebo prostřednictvím rozšíření, pro základní webové technologie, jako jsou HTML, JavaScript a PHP, takže se dobře hodí pro použití XOOPS.

**Poznámkový blok++** je bezplatný, časem oceněný uchazeč v této kategorii pro Windows s věrnými uživateli.

**Meld** není editor, ale porovnává textové soubory vykazující rozdíly a umožňuje selektivně slučovat změny a provádět malé úpravy. Je to velmi užitečné při porovnávání konfiguračních souborů, šablon témat a samozřejmě kódu PHP.

| Jméno | Odkaz | Licence | Platforma |
| :--- | :--- | :--- | :--- |
| PHPStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Komerční | Jakékoli |
| Kód Visual Studio | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Jakékoli |
| Poznámkový blok++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Vyhrát |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Jakékoli |

## Klient FTP

File Transfer Protocol (FTP) nebo jeho varianta se používá k přesunu souborů z jednoho počítače do druhého. Většina instalací XOOPS bude potřebovat klienta FTP pro přesun souborů pocházejících z distribuce XOOPS do hostitelského systému, kde bude lokalita nasazena.

**FileZilla** je bezplatný a výkonný klient FTP, který je dostupný pro většinu platforem. Konzistence napříč platformami z něj udělala volbu pro příklady FTP v této knize.

**PuTTY** je bezplatný klient SSH, který je užitečný pro přístup k serveru Shell a také poskytuje možnosti přenosu souborů pomocí SCP

**WinSCP** je klient FTP/SFTP/SCP pro systémy Windows.

| Jméno | Odkaz | Licence | Platforma |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Jakékoli |
| Tmel | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

Databáze obsahuje veškerý obsah vašeho webu, konfigurace, které váš web přizpůsobují, informace o uživatelích vašeho webu a další. Ochrana a údržba těchto informací může být snazší s některými dalšími nástroji, které se zabývají konkrétně databází.

**phpMyAdmin** je nejoblíbenější webový nástroj pro práci s databázemi MySQL, včetně vytváření jednorázových záloh.

**BigDump** je dar z nebes pro omezené hostingové účty, kde pomáhá při obnově velkých záloh zálohování databáze a zároveň se vyhne časovým limitům a omezením velikosti.

**srdb**, Search Replace DB for XOOPS je XOOPS adaptace [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) z interconnect/it. Je zvláště užitečné změnit adresy URL a odkazy na souborový systém v datech MySQL, když přesouváte web.| Jméno | Odkaz | Licence | Platforma |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Jakékoli |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Jakékoli |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Jakékoli |

## Vývojářské sady

Některé platformy, jako je Ubuntu, mají vestavěný celý zásobník potřebný ke spuštění XOOPS, zatímco jiné potřebují nějaké doplňky.

**WAMP** a **Uniform Server Zero** jsou sady vše v jednom pro Windows.

**XAMPP**, all-in-one stack od Apache Friends, je dostupný pro více platforem.

**bitnami** nabízí širokou škálu předpřipravených zásobníků aplikací, včetně obrazů virtuálních strojů a kontejnerů. Jejich nabídka může být cenným zdrojem pro rychlé vyzkoušení aplikací (včetně XOOPS) nebo různých webových technologií. Mohou být vhodné pro výrobní i vývojové použití.

**Docker** je aplikační kontejnerová platforma, která se používá k vytváření a spouštění kontejnerů pro implementaci vlastních prostředí. 

**Devilbox** je snadno konfigurovatelný vývojový zásobník založený na Dockeru. Nabízí širokou škálu verzí pro všechny komponenty zásobníku a umožňuje vývojářům testovat v reprodukovatelném a sdíleném prostředí. 

| Jméno | Odkaz | Licence | Platforma |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Více | Vyhrát |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Více | Vyhrát |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Více | Jakékoli |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Více | Jakékoli |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Více | Jakékoli |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Jakékoli |