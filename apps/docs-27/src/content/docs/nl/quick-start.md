---
title: Snel beginnen
description: Zorg dat XOOPS 2.7 binnen 5 minuten actief is.
---
## Vereisten

| Onderdeel | Minimaal | Aanbevolen |
|-----------|-----------------------|--------------|
| PHP | 8.2 | 8,4+ |
| MySQL | 5,7 | 8,0+ |
| MariaDB | 10.4 | 10.11+ |
| Webserver | Apache 2.4 / Nginx 1.20 | Laatste stabiele |

## Downloaden

Download de nieuwste release van [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Installatiestappen

1. **Upload bestanden** naar de documentroot van uw webserver (bijvoorbeeld `public_html/`).
2. **Maak een MySQL-database** en een gebruiker met volledige rechten.
3. **Open uw browser** en navigeer naar uw domein. Het XOOPS-installatieprogramma start automatisch.
4. **Volg de wizard van 5 stappen**: deze configureert paden, maakt tabellen en stelt uw beheerdersaccount in.
5. **Verwijder de map `install/`** wanneer daarom wordt gevraagd. Dit is verplicht voor de veiligheid.

## Controleer de installatie

Ga na het instellen naar:

- **Voorpagina:** `https://yourdomain.com/`
- **Beheerderspaneel:** `https://yourdomain.com/xoops_data/` *(pad dat u tijdens de installatie heeft gekozen)*

## Volgende stappen

- [Volledige installatiehandleiding](./installation/) — serverconfiguratie, machtigingen, probleemoplossing
- [Modulegids](./module-guide/introduction/) — bouw uw eerste module
- [Themagids](./theme-guide/introduction/) — maak een thema of pas het aan