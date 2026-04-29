---
title: "Co je nového v XOOPS 2.7.0"
---

XOOPS 2.7.0 je významnou aktualizací z řady 2.5.x. Před instalací nebo upgradem si přečtěte změny na této stránce, abyste věděli, co můžete očekávat. Níže uvedený seznam je zaměřen na položky, které ovlivňují instalaci a správu webu – úplný seznam změn naleznete v poznámkách k vydání, které jsou součástí distribuce.

## PHP 8.2 je nové minimum

XOOPS 2.7.0 vyžaduje **PHP 8.2 nebo novější**. PHP 7.xa starší již nejsou podporovány. Důrazně se doporučuje PHP 8.4 nebo vyšší.

**Akce:** Než začnete, potvrďte, že váš hostitel nabízí PHP 8.2+. Viz [Požadavky](installation/requirements.md).

## MySQL 5.7 je nové minimum

Nové minimum je **MySQL 5.7** (nebo kompatibilní MariaDB). Důrazně se doporučuje MySQL 8.4 nebo vyšší. Podporován je také MySQL 9.0.

Stará varování o problémech s kompatibilitou PHP/MySQL 8 již neplatí, protože dotčené verze PHP již nejsou podporovány XOOPS.

## Smarty 4 nahrazuje Smarty 3

Toto je největší změna pro stávající weby. XOOPS 2.7.0 používá jako svůj šablonovací modul **Smarty 4**. Smarty 4 je v syntaxi šablon přísnější než Smarty 3 a některá vlastní témata a šablony modulů mohou vyžadovat úpravy, než se vykreslí správně.

Aby vám pomohl identifikovat a opravit tyto problémy, XOOPS 2.7.0 dodává **preflight scanner** v adresáři `upgrade/`, který prozkoumá vaše stávající šablony na známé nekompatibility Smarty 4 a dokáže automaticky opravit mnoho z nich.

**Akce:** Pokud upgradujete z 2.5.xa máte vlastní motivy nebo starší moduly, spusťte [Preflight Check](upgrading/upgrade/preflight.md) _před_ spuštěním hlavního upgradu.

## Závislosti spravované Composer

XOOPS 2.7.0 používá **Composer** ke správě svých závislostí PHP. Tyto žijí v `xoops_lib/vendor/`. Knihovny třetích stran, které byly dříve součástí jádra nebo modulů – PHPMailer, HTMLPurifier, Smarty a další – jsou nyní dodávány prostřednictvím Composer.

**Akce:** Většina provozovatelů stránek nemusí nic dělat – tarbally se dodávají s již vyplněným `vendor/`. Pokud přesouváte nebo upgradujete web, zkopírujte celý strom `xoops_lib/`, včetně `vendor/`. Vývojáři klonující git repository should run `composer install` inside `htdocs/xoops_lib/`. See [Notes for Developers](notes-for-developers/developers.md).

## Nové předvolby souborů cookie relace

Během upgradu jsou přidány dvě nové předvolby:

* **`session_cookie_samesite`** – řídí atribut SameSite u souborů cookie relace (`Lax`, `Strict` nebo `None`).
* **`session_cookie_secure`** — když je povoleno, soubory cookie relace se odesílají pouze přes HTTPS.

**Akce:** Po upgradu je zkontrolujte v části Možnosti systému → Předvolby → Obecná nastavení. Viz [Po upgradu](upgrading/upgrade/ustep-04.md).

## Nový stůl `tokens`

XOOPS 2.7.0 přidává databázovou tabulku `tokens` pro obecné úložiště tokenů s rozsahem. Aktualizátor vytvoří tuto tabulku automaticky jako součást aktualizace 2.5.11 → 2.7.0.

## Modernizované úložiště hesel

Sloupec `bannerclient.passwd` byl rozšířen na `VARCHAR(255)`, takže může obsahovat moderní hash hesel (bcrypt, argon2). Upgrader automaticky rozšíří sloupec.

## Aktualizováno téma a sestava modulů

XOOPS 2.7.0 se dodává s aktualizovanými předními motivy:

* `default`, `xbootstrap` (starší), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, ZX2QPH00013

Vedle stávajícího motivu Přechod je zahrnuto nové **Moderní** téma pro správu.

Nový modul **DebugBar** založený na Symfony VarDumper se dodává jako jeden z volitelných instalovatelných modulů. Je užitečný pro vývoj a přípravu, ale obvykle se neinstaluje na veřejných produkčních místech.

Viz [Vybrat motiv](installation/installation/step-12.md) a [Instalace modulů](installation/installation/step-13.md).

## Kopírování v nové verzi již nepřepisuje konfiguraci

Dříve vyžadovalo zkopírování nové distribuce XOOPS na stávající web opatrně, aby nedošlo k přepsání `mainfile.php` a dalších konfiguračních souborů. Ve verzi 2.7.0 ponechává proces kopírování stávající konfigurační soubory nedotčené, díky čemuž jsou aktualizace znatelně bezpečnější.

Před každým upgradem byste měli přesto vytvořit úplnou zálohu.

## Možnost přetížení šablon v motivech správce systémuMotivy správce v XOOPS 2.7.0 nyní mohou přepsat jednotlivé šablony správce systému, což usnadňuje přizpůsobení uživatelského rozhraní pro správu bez rozvětvení celého modulu systému.

## Co se nezměnilo

Pro jistotu, tyto části XOOPS fungují ve verzi 2.7.0 stejným způsobem jako ve verzi 2.5.x:

* Pořadí stránek instalačního programu a celkový postup
* Rozdělení konfigurace `mainfile.php` plus `xoops_data/data/secure.php`
* Doporučený postup přemístění `xoops_data` a `xoops_lib` mimo kořen webu
* Model instalace modulu a formát manifestu `xoops_version.php`
* Pracovní postup při přesunu webu (zálohování, úprava `mainfile.php`/`secure.php`, použití SRDB nebo podobně)

## Kam dál

* Začínáte znovu? Pokračujte na [Požadavky](installation/requirements.md).
* Upgrade z 2.5.x? Začněte s [Upgrading](upgrading/upgrade/README.md), poté spusťte [Preflight Check](upgrading/upgrade/preflight.md).