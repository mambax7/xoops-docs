---
title: "Dodatek 5: Zvyšte zabezpečení své instalace XOOPS"
---

Po instalaci XOOPS 2.7.0 proveďte následující kroky k posílení webu. Každý krok je volitelný samostatně, ale společně výrazně zvyšují základní bezpečnost instalace.

## 1. Nainstalujte a nakonfigurujte modul Protector

Přiložený modul `protector` je firewall XOOPS. Pokud jste jej nenainstalovali během úvodního průvodce, nainstalujte jej nyní z obrazovky Správce → Moduly.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Otevřete panel správce aplikace Protector a prohlédněte si varování, která zobrazuje. Starší direktivy PHP, jako je `register_globals`, již neexistují (PHP 8.2+ je odstranil), takže tato varování již neuvidíte. Aktuální varování se obvykle týkají oprávnění k adresáři, nastavení relace a konfigurace důvěryhodné cesty.

## 2. Uzamkněte `mainfile.php` a `secure.php`

Po dokončení instalace se pokusí označit oba soubory jako pouze pro čtení, ale někteří hostitelé oprávnění vrátí. Ověřte a v případě potřeby znovu použijte:

- `mainfile.php` → `0444` (vlastník, skupina, ostatní pouze pro čtení)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` definuje konstanty cesty (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, ZX8QPHZ000) a výrobní příznaky. `secure.php` obsahuje přihlašovací údaje k databázi:

- Ve verzi 2.5.x jsou přihlašovací údaje k databázi používané v `mainfile.php`. Nyní jsou uloženy v `xoops_data/data/secure.php`, který je načten `mainfile.php` za běhu. Uchovávání `secure.php` uvnitř `xoops_data/` – adresáře, který se doporučuje přemístit mimo kořen dokumentu – značně ztěžuje útočníkovi získat přihlašovací údaje přes HTTP.

## 3. Přesuňte `xoops_lib/` a `xoops_data/` mimo kořen dokumentu

Pokud jste tak ještě neučinili, přesuňte tyto dva adresáře o jednu úroveň nad webový kořenový adresář a přejmenujte je. Poté aktualizujte odpovídající konstanty v `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Umístění těchto adresářů mimo kořen dokumentu zabrání přímému přístupu ke stromu `vendor/` Composer, šablonám uloženým v mezipaměti, souborům relací, nahraným datům a přihlašovacím údajům databáze v `secure.php`.

## 4. Konfigurace domény cookie

XOOPS 2.7.0 zavádí dvě konstanty domény cookie v `mainfile.php`:

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

Pokyny:

- Ponechejte `XOOPS_COOKIE_DOMAIN` prázdné, pokud obsluhujete XOOPS z jednoho názvu hostitele nebo z IP adresy.
- Použijte úplný hostitel (např. `www.example.com`) k rozsahu souborů cookie pouze pro tento název hostitele.
– Použijte registrovatelnou doménu (např. `example.com`), pokud chcete soubory cookie sdílet mezi `www.example.com`, `blog.example.com` atd.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` umožňuje XOOPS správně rozdělit složené TLD (`co.uk`, `com.au`, …) namísto náhodného nastavení souboru cookie na efektivní TLD.

## 5. Výrobní příznaky v `mainfile.php`

`mainfile.dist.php` se dodává s těmito dvěma příznaky nastavenými na `false` pro výrobu:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

Nechte je ve výrobě. Dočasně je povolte ve vývojovém nebo pracovním prostředí, když chcete:

- pátrat po přetrvávajících voláních starších databází (`XOOPS_DB_LEGACY_LOG = true`);
- povrchová oznámení `E_USER_DEPRECATED` a další výstup ladění (`XOOPS_DEBUG = true`).

## 6. Smažte instalační program

Po dokončení instalace:

1. Odstraňte jakýkoli přejmenovaný adresář `install_remove_*` z webového kořenového adresáře.
2. Odstraňte všechny skripty `install_cleanup_*.php`, které průvodce vytvořil během čištění.
3. Ujistěte se, že adresář `install/` již není dostupný přes HTTP.

Ponechání zakázaného, ​​ale současného adresáře instalačního programu je málo závažné, ale lze se mu vyhnout.

## 7. Udržujte XOOPS a moduly aktuální

XOOPS dodržuje běžnou kadenci patchů. Přihlaste se k odběru repozitáře XOOPSCore27 GitHub pro oznámení o vydání a aktualizujte svůj web a všechny moduly třetích stran, kdykoli bude dodáno nové vydání. Aktualizace zabezpečení pro 2.7.x jsou publikovány na stránce Releases úložiště.