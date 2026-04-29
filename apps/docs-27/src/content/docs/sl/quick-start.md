---
title: Hitri začetek
description: Zaženite XOOPS 2.7 v manj kot 5 minutah.
---
## Zahteve

| Komponenta | Najmanj | Priporočeno |
|------------|------------------------|--------------|
| PHP | 8,2 | 8,4+ |
| MySQL | 5,7 | 8,0+ |
| MariaDB | 10,4 | 10.11+ |
| Spletni strežnik | Apache 2.4 / Nginx 1.20 | Najnovejša stabilna |

## Prenos

Prenesite najnovejšo izdajo iz [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).
```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```
## Koraki namestitve

1. **Naložite datoteke** v koren dokumenta vašega spletnega strežnika (npr. `public_html/`).
2. **Ustvarite bazo podatkov MySQL** in uporabnika s polnimi pravicami zanjo.
3. **Odprite brskalnik** in se pomaknite do svoje domene — namestitveni program XOOPS se zažene samodejno.
4. **Sledite čarovniku v 5 korakih** — konfigurira poti, ustvari tabele in nastavi vaš skrbniški račun.
5. **Izbrišite mapo `install/`**, ko ste pozvani. To je obvezno zaradi varnosti.

## Preverite namestitev

Po nastavitvi obiščite:

- **Prednja stran:** `https://yourdomain.com/`
- **Administratorska plošča:** `https://yourdomain.com/xoops_data/` *(pot, ki ste jo izbrali med namestitvijo)*

## Naslednji koraki

- [Celoten vodnik za namestitev](./installation/) — konfiguracija strežnika, dovoljenja, odpravljanje težav
- [Vodnik po modulih](./module-guide/introduction/) — sestavite svoj prvi modul
- [Tematski vodnik](./theme-guide/introduction/) — ustvarite ali prilagodite temo