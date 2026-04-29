---
title: Hurtig start
description: Få XOOPS 2.7 til at køre på under 5 minutter.
---

## Krav

| Komponent | Minimum | Anbefalet |
|------------|------------------------|-----------|
| PHP | 8.2 | 8,4+ |
| MySQL | 5,7 | 8,0+ |
| MariaDB | 10,4 | 10.11+ |
| Webserver | Apache 2.4 / Nginx 1.20 | Seneste stald |

## Download

Download den seneste udgivelse fra [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Installationstrin

1. **Upload filer** til din webservers dokumentrod (f.eks. `public_html/`).
2. **Opret en MySQL-database** og en bruger med fulde rettigheder på den.
3. **Åbn din browser** og naviger til dit domæne - XOOPS-installationsprogrammet starter automatisk.
4. **Følg 5-trins guiden** — den konfigurerer stier, opretter tabeller og opsætter din administratorkonto.
5. **Slet mappen `install/`** når du bliver bedt om det. Dette er obligatorisk for sikkerheden.

## Bekræft installationen

Efter opsætning, besøg:

- **Forside:** `https://yourdomain.com/`
- **Admin panel:** `https://yourdomain.com/xoops_data/` *(sti, du valgte under installationen)*

## Næste trin

- [Fuld installationsvejledning](./installation/) — serverkonfiguration, tilladelser, fejlfinding
- [Modulvejledning](./module-guide/introduction/) — byg dit første modul
- [Temaguide](./theme-guide/introduction/) — opret eller tilpas et tema
