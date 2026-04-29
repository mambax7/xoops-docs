---
title: Brzi početak
description: Pokrenite XOOPS 2.7 za manje od 5 minuta.
---
## Zahtjevi

| Komponenta | Minimalno | Preporučeno |
|------------|------------------------|---------------|
| PHP | 8.2 | 8,4+ |
| MySQL | 5.7 | 8.0+ |
| MariaDB | 10.4 | 10.11+ |
| Web poslužitelj | Apache 2.4 / Nginx 1.20 | Najnovija stabilna |

## Preuzmi

Preuzmite najnovije izdanje s [GitHub izdanja](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Koraci instalacije

1. **Učitajte datoteke** u korijenski dokument vašeg web poslužitelja (npr. `public_html/`).
2. **Kreirajte MySQL bazu podataka** i korisnika s punim privilegijama na njoj.
3. **Otvorite svoj preglednik** i idite na svoju domenu — instalacijski program XOOPS pokreće se automatski.
4. **Slijedite čarobnjaka u 5 koraka** — on konfigurira staze, stvara tablice i postavlja vaš admin račun.
5. **Izbrišite mapu `install/`** kada se to od vas zatraži. Ovo je obavezno radi sigurnosti.

## Provjerite instalaciju

Nakon postavljanja posjetite:

- **Prednja stranica:** `https://yourdomain.com/`
- **administratorska ploča:** `https://yourdomain.com/xoops_data/` *(put koji ste odabrali tijekom instalacije)*

## Sljedeći koraci

- [Potpuni vodič za instalaciju](./installation/) — konfiguracija poslužitelja, dopuštenja, rješavanje problema
- [Vodič za module](./module-guide/introduction/) — izgradite svoj prvi modul
- [Vodič za teme](./theme-guide/introduction/) — izradite ili prilagodite temu
