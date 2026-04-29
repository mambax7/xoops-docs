---
title: Rychlý start
description: Spusťte XOOPS 2.7 za méně než 5 minut.
---

## Požadavky

| Komponenta | Minimálně | Doporučeno |
|------------|-------------------------|---------------|
| PHP | 8,2 | 8,4+ |
| MySQL | 5,7 | 8,0+ |
| MariaDB | 10,4 | 10.11+ |
| Webový server | Apache 2.4 / Nginx 1.20 | Nejnovější stabilní |

## Stáhnout

Stáhněte si nejnovější verzi z [GitHub Releases](https://github.com/XOOPS/XOOPSCore27/releases).

```bash
# Or clone directly
git clone https://github.com/XOOPS/XOOPSCore27.git mysite
cd mysite
```

## Kroky instalace

1. **Nahrajte soubory** do kořenového adresáře dokumentů vašeho webového serveru (např. `public_html/`).
2. **Vytvořte databázi MySQL** a uživatele s plnými právy.
3. **Otevřete svůj prohlížeč** a přejděte do své domény – automaticky se spustí instalační program XOOPS.
4. **Postupujte podle 5krokového průvodce** – nakonfiguruje cesty, vytvoří tabulky a nastaví váš účet správce.
5. **Po zobrazení výzvy smažte složku `install/`**. Toto je povinné pro bezpečnost.

## Ověřte instalaci

Po nastavení navštivte:

- **Přední strana:** `https://yourdomain.com/`
- **Panel správce:** `https://yourdomain.com/xoops_data/` *(cesta, kterou jste zvolili během instalace)*

## Další kroky

- [Úplný průvodce instalací](./installation/) – konfigurace serveru, oprávnění, odstraňování problémů
- [Průvodce modulem](./module-guide/introduction/) – sestavte svůj první modul
- [Průvodce motivem](./theme-guide/introduction/) – vytvořte nebo přizpůsobte motiv