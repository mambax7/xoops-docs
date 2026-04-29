---
title: "XOOPS 2.7.0 Kontrola kompatibility pro tuto příručku"
---

Tento dokument uvádí změny potřebné v tomto úložišti tak, aby instalační příručka odpovídala XOOPS 2.7.0.

Základ hodnocení:

- Aktuální úložiště průvodce: `L:\GitHub\XOOPSDocs\xoops-installation-guide`
- Jádro XOOPS 2.7.0 recenzováno na: `L:\GitHub\MAMBAX7\CORE\XOOPSCore27`
- Primární zdroje 2.7.0 zkontrolovány:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Rozsah

Toto repo aktuálně obsahuje:

- Jako hlavní průvodce se používají soubory anglického Markdown na kořenové úrovni.
- Částečná kopie `en/`.
- Úplné stromy knih `de/` a `fr/` s vlastními aktivy.

Soubory na kořenové úrovni potřebují první průchod. Poté je třeba ekvivalentní změny zrcadlit do `de/book/` a `fr/book/`. Strom `en/` také potřebuje vyčistit, protože se zdá být udržován pouze částečně.

## 1. Změny globálního úložiště

### 1.1 Verze a metadata

Aktualizujte všechny reference na úrovni průvodce z XOOPS 2.5.x na XOOPS 2.7.0.

Dotčené soubory:

- `README.md`
- `SUMMARY.md` — primární živé TOC pro kořenové vodítko; navigační štítky a nadpisy sekcí musí odpovídat novým názvům kapitol a přejmenované části Historické poznámky k upgradu
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- lokalizované `de/book/*.md` a `fr/book/*.md`

Požadované změny:

- Změňte `for XOOPS 2.5.7.x` na `for XOOPS 2.7.0`.
- Aktualizujte rok autorských práv z `2018` na `2026`.
- Nahraďte staré odkazy XOOPS 2.5.xa 2.6.0 tam, kde popisují aktuální vydání.
- Nahraďte návod ke stažení z éry SourceForge vydáním GitHub:
  - `https://github.com/XOOPS/XOOPSCore27/releases`

### 1.2 Obnovení odkazu

`about-xoops-cms.md` a lokalizované soubory `10aboutxoops.md` stále ukazují na stará umístění 2.5.xa 2.6.0 GitHub. Tyto odkazy je třeba aktualizovat na aktuální umístění projektu 2.7.x.

### 1.3 Obnovení snímku obrazovky

Všechny snímky obrazovky zobrazující instalační program, uživatelské rozhraní upgradu, řídicí panel správce, výběr motivu, výběr modulu a obrazovky po instalaci jsou zastaralé.

Dotčené stromy aktiv:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Jedná se o úplné obnovení, nikoli o částečné. Instalační program 2.7.0 používá jiné rozložení založené na Bootstrapu a jinou vizuální strukturu.

## 2. Kapitola 2: Úvod

Soubor:

- `chapter-2-introduction.md`

### 2.1 Systémové požadavky musí být přepsány

Aktuální kapitola uvádí pouze Apache, MySQL a PHP. XOOPS 2.7.0 má explicitní minima:

| Komponenta | 2.7.0 minimum | 2.7.0 doporučení |
| --- | --- | --- |
| PHP | 8.2.0 | 8,4+ |
| MySQL | 5.7.8 | 8,4+ |
| Webový server | Jakýkoli server podporující požadované PHP | Doporučeno Apache nebo Nginx |

Poznámky k doplnění:

- IIS je stále uveden v instalačním programu jako možné, ale doporučenými příklady jsou Apache a Nginx.
- Poznámky k verzi také uvádějí kompatibilitu MySQL 9.0.

### 2.2 Přidejte požadovaný a doporučený kontrolní seznam rozšíření PHP

Instalační program 2.7.0 nyní odděluje náročné požadavky od doporučených rozšíření.

Požadované kontroly zobrazené instalačním programem:

- MySQLi
- Zasedání
- PCRE
- filtr
- `file_uploads`
- informace o souboru

Doporučená rozšíření:

- mbstring
- intl
- ikonav
- xml
- zlib
- gd
- exif
- zvlnit

### 2.3 Odstraňte instrukce kontrolního součtu

Aktuální krok 5 popisuje `checksum.php` a `checksum.mdi`. Tyto soubory nejsou součástí XOOPS 2.7.0.

Akce:

- Úplně odstraňte část pro ověření kontrolního součtu.

### 2.4 Aktualizace balíčku a pokyny k nahrání

Zachovejte popis rozvržení balíčku `docs/`, `extras/`, `htdocs/`, `upgrade/`, ale aktualizujte text nahrávání a přípravy tak, aby odrážel aktuální očekávání zapisovatelných cest:

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

Průvodce to v současné době podceňuje.

### 2.5 Nahradit jazyk SourceForge translation/downloadAktuální text stále říká, že je třeba navštívit XOOPS na SourceForge pro další jazykové balíčky. To je třeba nahradit aktuálními pokyny ke stažení project/community.

## 3. Kapitola 3: Kontrola konfigurace serveru

Soubor:

- `chapter-3-server-configuration-check.md`

Požadované změny:

- Přepište popis stránky kolem aktuálního dvoublokového rozložení:
  - Požadavky
  - Doporučená rozšíření
- Nahraďte starý snímek obrazovky.
- Explicitně zdokumentujte výše uvedené kontroly požadavků.

## 4. Kapitola 4: Jděte správnou cestou

Soubor:

- `chapter-4-take-the-right-path.md`

Požadované změny:

- Přidejte nové pole `Cookie Domain`.
- Aktualizujte názvy a popisy polí cesty tak, aby odpovídaly verzi 2.7.0:
  - Kořenová cesta XOOPS
  - XOOPS datová cesta
  - Cesta knihovny XOOPS
  - XOOPS URL
  - Doména cookie
- Přidejte poznámku, že změna cesty knihovny nyní vyžaduje platný automatický zavaděč Composer na `vendor/autoload.php`.

Toto je skutečná kontrola kompatibility ve verzi 2.7.0 a měla by být jasně zdokumentována. Aktuální průvodce se o Composer vůbec nezmiňuje.

## 5. Kapitola 5: Databázová připojení

Soubor:

- `chapter-5-database-connections.md`

Požadované změny:

- Zachovejte prohlášení, že je podporován pouze MySQL.
- Aktualizujte sekci konfigurace databáze, aby odrážela:
  - výchozí znaková sada je nyní `utf8mb4`
  - výběr kolace se dynamicky aktualizuje, když se změní znaková sada
- Nahraďte snímky obrazovky pro připojení k databázi a konfigurační stránky.

Současný text, který říká, že znaková sada a řazení nevyžadují pozornost, je pro 2.7.0 příliš slabý. Mělo by se zmínit alespoň o novém výchozím nastavení `utf8mb4` a voliči dynamického řazení.

## 6. Kapitola 6: Konečná konfigurace systému

Soubor:

- `chapter-6-final-system-configuration.md`

### 6.1 Generované konfigurační soubory změněny

Průvodce aktuálně říká, že instalační program zapisuje `mainfile.php` a `secure.php`.

Ve verzi 2.7.0 také instaluje konfigurační soubory do `xoops_data/configs/`, včetně:

- `xoopsconfig.php`
- konfigurační soubory captcha
- konfigurační soubory textsanitizer

### 6.2 Stávající konfigurační soubory v `xoops_data/configs/` nejsou přepsány

Chování nepřepisování je **rozsah**, není globální. Dvě odlišné cesty kódu v konfiguračních souborech zápisu `page_configsave.php`:

- `writeConfigurationFile()` (voláno na řádcích 59 a 66) **vždy** regeneruje `xoops_data/data/secure.php` a `mainfile.php` ze vstupu průvodce. Neexistuje žádná kontrola existence; existující kopie je nahrazena.
- `copyConfigDistFiles()` (volané na řádku 62, definované na řádku 317) zkopíruje pouze soubory `xoops_data/configs/` (`xoopsconfig.php`, konfigurace captcha, konfigurace textsanitizer) **pokud cíl ještě neexistuje**.

Přepsání kapitoly musí jasně odrážet obě chování:

- Pro `mainfile.php` a `secure.php`: varujte, že jakékoli ruční úpravy těchto souborů budou přepsány při opětovném spuštění instalačního programu.
- Pro soubory `xoops_data/configs/`: vysvětlete, že místní přizpůsobení jsou zachována při opakovaných spuštěních a aktualizacích a že obnovení dodaných výchozích nastavení vyžaduje odstranění souboru a opětovné spuštění (nebo ruční zkopírování odpovídajícího `.dist.php`).

Nezobecňujte „existující soubory jsou zachovány“ ve všech konfiguračních souborech napsaných instalačním technikem – to je nesprávné a zmátlo by to administrátory upravující `mainfile.php` nebo `secure.php`.

### 6.3 HTTPS a zpracování reverzního proxy změněno

Generovaný `mainfile.php` nyní podporuje širší detekci protokolu, včetně reverzních proxy hlaviček. Průvodce by to měl zmínit namísto toho, aby implikoval pouze přímou detekci `http` nebo `https`.

### 6.4 Počet stolů je nesprávný

Aktuální kapitola říká, že nový web vytváří tabulky `32`.

XOOPS 2.7.0 vytváří tabulky `33`. Chybí tabulka:

- `tokens`

Akce:

- Aktualizujte počet z 32 na 33.
- Přidejte `tokens` do seznamu tabulek.

## 7. Kapitola 7: Nastavení správy

Soubor:

- `chapter-7-administration-settings.md`

### 7.1 Popis uživatelského rozhraní hesla je zastaralý

Instalační program stále obsahuje generování hesla, ale nyní také obsahuje:

- Měřič síly hesla založený na zxcvbn
- štítky vizuální síly
- 16znakový generátor a tok kopírování

Aktualizujte text a snímky obrazovky tak, aby popisovaly aktuální panel hesel.

### 7.2 Nyní je vynuceno ověření e-mailu

E-mail správce je ověřen pomocí `FILTER_VALIDATE_EMAIL`. Kapitola by měla zmínit, že neplatné e-mailové hodnoty jsou odmítnuty.

### 7.3 Sekce licenčního klíče je chybnáToto je jedna z nejdůležitějších věcných oprav.

Aktuální průvodce říká:

- existuje `License System Key`
- je uložen v `/include/license.php`
- `/include/license.php` musí být zapisovatelný během instalace

To už není přesné.

Co 2.7.0 ve skutečnosti dělá:

- instalace zapíše licenční data do `xoops_data/data/license.php`
- `htdocs/include/license.php` je nyní pouze zastaralý obal, který načítá soubor ze `XOOPS_VAR_PATH`
- staré znění o vytvoření zapisovatelné `/include/license.php` by mělo být odstraněno

Akce:

- Přepište tuto sekci namísto smazání.
- Aktualizujte cestu z `/include/license.php` na `xoops_data/data/license.php`.

### 7.4 Seznam témat je zastaralý

Aktuální průvodce stále odkazuje na Zetagenesis a starší sadu témat z éry 2,5.

Motivy přítomné v XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Poznámka:

- `xswatch4` je aktuální výchozí motiv vložený instalačními daty.
- Zetageneze již není součástí zabaleného seznamu témat.

### 7.5 Seznam modulů je zastaralý

Moduly přítomné v balíčku 2.7.0:

- `system` – instaluje se automaticky během kroků vyplňování tabulky / vkládání dat. Vždy přítomné, nikdy viditelné v nástroji pro výběr.
- `debugbar` — lze vybrat v kroku instalačního programu.
- `pm` — lze vybrat v kroku instalačního programu.
- `profile` — lze vybrat v kroku instalačního programu.
- `protector` — lze vybrat v kroku instalačního programu.

Důležité: Stránka instalačního programu modulu (`htdocs/install/page_moduleinstaller.php`) vytváří svůj seznam kandidátů iterací přes `XOOPSLists::getModulesList()` a **odfiltrováním všeho, co je již v tabulce modulů** (řádky 95-102 shromažďují `$listed_mods`; řádek 116 přeskakuje jakýkoli adresář přítomný v seznamu). Protože `system` je nainstalován před spuštěním tohoto kroku, nikdy se nezobrazí jako zaškrtávací políčko.

Potřebné změny průvodce:

- Přestaňte říkat, že existují pouze tři přibalené moduly.
- Popište instalační krok tak, že ukazuje **čtyři volitelné moduly** (`debugbar`, `pm`, `profile`, `protector`), nikoli pět.
- Dokumentujte `system` samostatně jako vždy instalovaný základní modul, který se nezobrazuje v nástroji pro výběr.
- Přidejte `debugbar` do popisu přibaleného modulu jako nový ve verzi 2.7.0.
- Všimněte si, že výchozí předvolba modulu instalačního programu je nyní prázdná; moduly jsou k dispozici na výběr, ale nejsou předem zkontrolovány konfigurací instalačního programu.

## 8. Kapitola 8: Připraveno

Soubor:

- `chapter-8-ready-to-go.md`

### 8.1 Proces čištění instalace vyžaduje přepsání

Aktuální průvodce říká, že instalační program přejmenuje instalační složku na jedinečný název.

Ve skutečnosti to stále platí, ale mechanismus se změnil:

- v kořenovém adresáři webu je vytvořen externí čistící skript
- poslední stránka spustí čištění pomocí AJAX
- instalační složka je přejmenována na `install_remove_<unique suffix>`
- stále existuje záložní verze `cleanup.php`

Akce:

- Aktualizujte vysvětlení.
- Udržujte pokyny pro uživatele jednoduché: po instalaci odstraňte přejmenovaný instalační adresář.

### 8.2 Odkazy na přílohy administračního panelu jsou zastaralé

Kapitola 8 stále odkazuje čtenářům na starou Oxygen éru administrátorů. To musí být v souladu s aktuálními tématy správce:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 Pokyny pro úpravu cesty po instalaci vyžadují opravu

Aktuální text říká čtenářům, aby aktualizovali `secure.php` s definicemi cest. Ve verzi 2.7.0 jsou tyto konstanty cesty definovány v `mainfile.php`, zatímco `secure.php` uchovává zabezpečená data. Vzorový blok v této kapitole by měl být odpovídajícím způsobem opraven.

### 8.4 Mělo by být přidáno produkční nastavení

Příručka by měla výslovně zmínit výchozí výchozí nastavení výroby, která jsou nyní v `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` by mělo zůstat `false`
- `XOOPS_DEBUG` by mělo zůstat `false`

## 9. Kapitola 9: Upgrade stávající instalace XOOPS

Soubor:

- `chapter-9-upgrade-existing-xoops-installation.md`

Tato kapitola vyžaduje největší přepsání.

### 9.1 Přidat povinný Smarty 4 předletový krok

Proces upgradu XOOPS 2.7.0 nyní vynucuje proces předběžné kontroly před dokončením upgradu.

Nový požadovaný tok:

1. Zkopírujte adresář `upgrade/` do kořenového adresáře webu.
2. Spusťte `/upgrade/preflight.php`.
3. Naskenujte `/themes/` a `/modules/` pro starou syntaxi Smarty.
4. V případě potřeby použijte volitelný režim opravy.
5. Spusťte znovu, dokud nebude čistý.
6. Pokračujte do `/upgrade/`.Současná kapitola se o tom vůbec nezmiňuje, což ji činí nekompatibilní s pokyny 2.7.0.

### 9.2 Nahraďte ruční vyprávění o sloučení z éry 2.5.2

Aktuální kapitola stále popisuje ruční upgrade ve stylu 2.5.2 se sloučením rámce, poznámkami AltSys a ručně spravovanou restrukturalizací souborů. To by mělo být nahrazeno aktuální sekvencí upgradu 2.7.x ze `release_notes.txt` a `upgrade/README.md`.

Doporučený nástin kapitoly:

1. Zálohujte soubory a databázi.
2. Vypněte web.
3. Zkopírujte `htdocs/` přes živý kořenový adresář.
4. Zkopírujte `htdocs/xoops_lib` do cesty aktivní knihovny.
5. Zkopírujte `htdocs/xoops_data` do aktivní datové cesty.
6. Zkopírujte `upgrade/` do webového kořenového adresáře.
7. Spusťte `preflight.php`.
8. Spusťte `/upgrade/`.
9. Dokončete výzvy aktualizačního programu.
10. Aktualizujte modul `system`.
11. Aktualizujte `pm`, `profile` a `protector`, pokud jsou nainstalovány.
12. Vymažte `upgrade/`.
13. Znovu zapněte web.

### 9.3 Dokumentujte skutečné změny upgradu 2.7.0

Aktualizátor pro 2.7.0 obsahuje alespoň tyto konkrétní změny:

- vytvořte tabulku `tokens`
- rozšířit `bannerclient.passwd` o moderní hash hesel
- přidat nastavení předvoleb souborů cookie relace
- odstranit zastaralé svázané adresáře

Průvodce nemusí odhalovat každý detail implementace, ale měl by přestat naznačovat, že upgrade je pouze kopie souboru plus aktualizace modulu.

## 10. Historické stránky upgradu

Soubory:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Stav:** Strukturální rozhodnutí je již vyřešeno – kořenový `SUMMARY.md` je přesouvá do vyhrazené sekce **Historické poznámky k upgradu** a každý soubor nese popisek „Historický odkaz“, který čtenáře odkazuje na kapitolu 9 pro upgrady 2.7.0. Už to nejsou prvotřídní pokyny pro upgrade.

**Zbývající práce (pouze konzistentnost):**

- Ujistěte se, že `README.md` (root) je uvádí pod stejným nadpisem „Historické poznámky k upgradu“, nikoli pod obecným záhlavím „Upgrady“.
- Zrcadlete stejnou separaci v `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` a `en/SUMMARY.md`.
- Zajistěte, aby každá historická stránka upgradu (kořen a lokalizované kopie `de/book/upg*.md` / `fr/book/upg*.md`) obsahovala popis zastaralého obsahu odkazující zpět na kapitolu 9.

## 11. Příloha 1: Admin GUI

Soubor:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Tento dodatek je vázán na správce Oxygen GUI a potřebuje přepsat.

Požadované změny:

- nahradit všechny odkazy na kyslík
- nahradit staré snímky obrazovky icon/menu
- zdokumentujte aktuální témata správce:
  - výchozí
  - tmavý
  - moderní
  - přechod
- zmínit současné možnosti správce 2.7.0 uvedené v poznámkách k vydání:
  - schopnost přetížení šablony v tématech správce systému
  - aktualizovaná sada témat správce

## 12. Příloha 2: Nahrávání XOOPS přes FTP

Soubor:

- `appendix-2-uploading-xoops-via-ftp.md`

Požadované změny:

- odstranit předpoklady specifické pro HostGator a cPanel
- modernizovat znění pro nahrávání souborů
- Všimněte si, že `xoops_lib` nyní obsahuje závislosti Composer, takže uploady jsou větší a neměly by být selektivně ořezávány

## 13. Příloha 5: Zabezpečení

Soubor:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Požadované změny:

- zcela odstranit diskusi `register_globals`
- odstranit zastaralý jazyk host-ticket
- opravte text oprávnění od `404` do `0444`, kde je určeno pouze pro čtení
- aktualizujte diskusi `mainfile.php` a `secure.php` tak, aby odpovídala rozložení 2.7.0
- přidejte nový konstantní kontext související se zabezpečením domény cookie:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- přidat návod k výrobě pro:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Dopad údržby napříč jazyky

Po opravě anglických souborů na úrovni root jsou nutné ekvivalentní aktualizace v:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

Strom `en/` také potřebuje kontrolu, protože obsahuje samostatnou sadu README a aktiv, ale zdá se, že má pouze částečný strom `book/`.

## 15. Přednostní pořadí

### Kritické před vydáním

1. Aktualizujte odkazy repo/version na 2.7.0.
2. Přepište kapitolu 9 kolem skutečného postupu upgradu na verzi 2.7.0 a předběžné kontroly Smarty 4.
3. Aktualizujte systémové požadavky na PHP 8.2+ a MySQL 5.7.8+.
4. Opravte cestu k souboru licenčního klíče podle kapitoly 7.
5. Opravte inventář témat a modulů.
6. Opravte počet tabulek v kapitole 6 z 32 na 33.### Důležité pro přesnost

7. Přepište vedení zapisovatelné cesty.
8. Přidejte požadavek na automatické zavádění Composer do nastavení cesty.
9. Aktualizujte pokyny pro znakovou sadu databáze na `utf8mb4`.
10. Opravte pokyny pro úpravu cesty podle kapitoly 8, aby byly konstanty zdokumentovány ve správném souboru.
11. Odstraňte instrukce kontrolního součtu.
12. Odstraňte `register_globals` a další mrtvé vedení PHP.

### Čištění v kvalitě vydání

13. Nahraďte všechny screenshoty instalačního programu a správce.
14. Přesuňte historické stránky upgradu z hlavního toku.
15. Po opravě angličtiny synchronizujte německé a francouzské kopie.
16. Vyčistěte zastaralé spoje a duplikované linky README.