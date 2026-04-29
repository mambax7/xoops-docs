---
title: "Přesouvání webu"
---

Může to být velmi užitečná technika prototypování nového webu XOOPS na místním systému nebo vývojovém serveru. Může být také velmi prozíravé nejprve otestovat upgrade XOOPS na kopii vašeho produkčního webu, pro případ, že by se něco pokazilo. Abyste toho dosáhli, musíte být schopni přesunout svůj web XOOPS z jednoho webu na druhý. Zde je to, co potřebujete vědět, abyste mohli úspěšně přesunout svůj web XOOPS.

Prvním krokem je vytvoření nového prostředí webu. Stejné položky, které jsou uvedeny v části [Pokročilé přípravy](../installation/preparations/), platí i zde.

V přehledu jsou tyto kroky:

* Získejte hosting, včetně jakýchkoli požadavků na název domény nebo e-mail
* získat uživatelský účet a heslo MySQL
* získat databázi MySQL, ke které má výše uvedený uživatel všechna oprávnění

Zbytek procesu je velmi podobný běžné instalaci, ale:

* místo kopírování souborů z distribuce XOOPS je zkopírujete z existujícího webu
* místo spuštění instalačního programu importujete již naplněnou databázi
* místo zadávání odpovědí v instalátoru změníte předchozí odpovědi v souborech a databázi

## Zkopírujte existující soubory webu

Vytvořte úplnou kopii souborů svého stávajícího webu na místní počítač, kde je můžete upravovat. Pokud pracujete se vzdáleným hostitelem, můžete ke kopírování souborů použít FTP. Potřebujete kopii, se kterou budete pracovat, i když web běží na vašem místním počítači, v takovém případě vytvořte další kopii adresářů webu.

Je důležité nezapomenout zahrnout adresáře _xoops_data_ a _xoops_lib_, i když byly přejmenovány na and/or přemístěny.

Aby to bylo plynulejší, měli byste ze své kopie odstranit soubory mezipaměti a kompilovaných šablon Smarty. Tyto soubory budou znovu vytvořeny ve vašem novém prostředí a mohou způsobit problémy se zachováním starých nesprávných informací, pokud nebudou vymazány. Chcete-li to provést, odstraňte všechny soubory, kromě _index.html_, ve všech třech těchto adresářích:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Poznámka:** Vymazání `smarty_compile` je zvláště důležité při přesouvání webu do nebo ze XOOPS 2.7.0. XOOPS 2.7.0 používá Smarty 4 a kompilované šablony Smarty 4 nejsou zaměnitelné s kompilovanými šablonami Smarty 3. Ponechání zastaralých kompilovaných souborů na místě způsobí chyby šablony při prvním načtení stránky na novém webu.

### Závislosti `xoops_lib` a Composer

XOOPS 2.7.0 spravuje své závislosti PHP prostřednictvím Composer uvnitř `xoops_lib/`. Adresář `xoops_lib/vendor/` obsahuje knihovny třetích stran, které XOOPS potřebuje za běhu (Smarty 4, PHPMailer, HTMLPurifier atd.). Při přesouvání webu musíte zkopírovat celý strom `xoops_lib/` – včetně `vendor/` – do nového hostitele. Nepokoušejte se znovu vygenerovat `vendor/` na cílovém hostiteli, pokud nejste vývojář, který si přizpůsobil `composer.json` a má na cíli k dispozici Composer.

## Nastavte nové prostředí

Stejné položky, které jsou popsány v části [Pokročilé přípravy](../installation/preparations/), platí i zde. Budeme předpokládat, že máte jakýkoli hosting, který budete potřebovat pro web, který přesouváte.

### Klíčové informace (mainfile.php a secure.php)

Úspěšné přesunutí webu zahrnuje změnu veškerých odkazů na absolutní názvy souborů a cest, adresy URL, parametry databáze a přístupové údaje.

Dva soubory, `mainfile.php` ve webovém kořenovém adresáři vašeho webu a `data/secure.php` v adresáři _xoops_data_ vašeho webu (přejmenovaném na and/or přemístěný), definují základní parametry vašeho webu, jako je jeho ZXQPH00Z, kde se systém připojuje k hostitelskému souboru sitsQ, kde je systém sitsQ. databáze.

Budete potřebovat vědět, jaké hodnoty jsou ve starém systému a jaké budou v novém systému.

#### mainfile.php

| Jméno | Stará hodnota v mainfile.php | Nová hodnota v mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Otevřete _mainfile.php_ ve svém editoru. Změňte hodnoty pro definice zobrazené v grafu výše ze starých hodnot na hodnoty vhodné pro nový web.Poznamenejte si staré a nové hodnoty, protože v některých pozdějších krocích budeme muset provést podobné změny na jiných místech.

Pokud například přesouváte web z místního počítače do komerční hostingové služby, vaše hodnoty mohou vypadat takto:

| Jméno | Stará hodnota v mainfile.php | Nová hodnota v mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

Po změně _mainfile.php_ jej uložte.

Je možné, že některé další soubory mohou obsahovat pevně zakódované odkazy na váš URL nebo dokonce cesty. To je pravděpodobnější u přizpůsobených motivů a nabídek, ale s vaším editorem můžete pro jistotu prohledávat všechny soubory.

Ve svém editoru proveďte prohledávání souborů ve vaší kopii, vyhledejte starou hodnotu XOOPS_URL a nahraďte ji novou hodnotou.

Proveďte totéž pro starou hodnotu XOOPS_ROOT_PATH a nahraďte všechny výskyty novou hodnotou.

Své poznámky si uschovejte, protože je budeme muset později znovu použít při přesunu databáze.

#### data/secure.php

| Jméno | Stará hodnota v data/secure.php | Nová hodnota v data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Otevřete _data/secure.php_ v přejmenovaném and/or přemístěném adresáři _xoops_data_ ve svém editoru. Změňte hodnoty pro definice zobrazené v grafu výše ze starých hodnot na hodnoty vhodné pro nový web.

#### Další soubory

Mohou existovat další soubory, které mohou vyžadovat pozornost, když se váš web přesouvá. Některé běžné příklady jsou klíče API pro různé služby, které mohou být svázány s doménou, jako například:

* Mapy Google
* Recaptch2
* Jako tlačítka
* Sdílení odkazů and/or reklama, jako je Shareaholic nebo AddThis

Změnu těchto typů přidružení nelze snadno automatizovat, protože připojení ke staré doméně jsou obvykle součástí registrace na straně služby. V některých případech to může jednoduše přidat nebo změnit doménu spojenou se službou.

### Zkopírujte soubory na nový web

Zkopírujte nyní upravené soubory na svůj nový web. Techniky jsou stejné, jaké byly použity během [Instalace](../installation/installation/), tj. pomocí FTP.

## Zkopírujte databázi existujících stránek

### Zálohujte databázi ze starého serveru

Pro tento krok se důrazně doporučuje použít _phpMyAdmin_. Přihlaste se do _phpMyAdmin_ pro svůj stávající web, vyberte svou databázi a zvolte _Export_.

Výchozí nastavení je obvykle v pořádku, takže stačí vybrat "Export method" z _Quick_ a "Format" z _SQL_.

Pomocí tlačítka _Go_ stáhněte zálohu databáze.

![Export databáze pomocí phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Pokud máte v databázi tabulky, které nepocházejí ze XOOPS nebo jeho modulů a mají být přesunuty NOT, měli byste vybrat "Metodu exportu" _Custom_ a vybrat pouze tabulky související se XOOPS ve vaší databázi. (Ty začínají "prefixem", který jste zadali během instalace. Předponu databáze můžete vyhledat v souboru `xoops_data/data/secure.php`.)

### Obnovte databázi na nový server

Na svém novém hostiteli pomocí nové databáze obnovte databázi pomocí [tools](../tools/tools.md), jako je karta _Import_ v _phpMyAdmin_ (nebo _bigdump_ v případě potřeby.)

### Aktualizujte adresy URL a cesty v databázi

Aktualizujte všechny http odkazy na zdroje na vašem webu ve vaší databázi. To může být obrovské úsilí a existuje [nástroj](../tools/tools.md), který to usnadní.

Interconnect/it má produkt s názvem Search-Replace-DB, který s tím může pomoci. Dodává se s vestavěným povědomím o prostředích Wordpress a Drupal. Jako takový může být tento nástroj velmi užitečný, ale je ještě lepší, když si je vědom vašeho XOOPS. Verzi s podporou XOOPS najdete na [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Podle pokynů v souboru README.md stáhněte a dočasně nainstalujte tento nástroj na svůj web. Dříve jsme změnili definici XOOPS_URL. Když spustíte tento nástroj, chcete nahradit původní definici XOOPS_URL novou definicí, tj. nahradit [http://localhost/xoops](http://localhost/xoops) za [https://example.com](https://example.com)![Pomocí hledání a nahrazení DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Zadejte své staré a nové adresy URL a vyberte možnost suchého běhu. Zkontrolujte změny, a pokud vše vypadá dobře, přejděte na možnost živého spuštění. Tento krok zachytí konfigurační položky a odkazy ve vašem obsahu, které odkazují na váš web URL.

![Kontrola změn v SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Opakujte proces s použitím starých a nových hodnot pro XOOPS_ROOT_PATH.

#### Alternativní přístup bez SRDB

Dalším způsobem, jak provést tento krok bez nástroje srdb, by bylo vypsat databázi, upravit výpis v textovém editoru, změnit adresy URL a cesty a poté znovu načíst databázi z upraveného výpisu. Ano, tento proces je dostatečně zapojen a nese dostatečné riziko, že lidé byli motivováni k vytvoření specializovaných nástrojů, jako je Search-Replace-DB.

## Vyzkoušejte svůj přemístěný web

V tuto chvíli by měl být váš web připraven ke spuštění v novém prostředí!

Samozřejmě vždy mohou nastat problémy. Nebojte se zveřejňovat jakékoli dotazy na [xoops.org fórech](https://xoops.org/modules/newbb/index.php).