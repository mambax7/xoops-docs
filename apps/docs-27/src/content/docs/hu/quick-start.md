---
title: Gyors kezdés
description: Futtassa az XOOPS 2.7-et kevesebb mint 5 perc alatt.
---
## Követelmények

| Alkatrész | Minimum | Ajánlott |
|------------|-------------------------|----------------|
| PHP | 8.2 | 8,4+ |
| MySQL | 5,7 | 8,0+ |
| MariaDB | 10.4 | 10.11+ |
| Webszerver | Apache 2.4 / Nginx 1.20 | Legújabb stabil |

## Letöltés

Töltse le a legújabb kiadást a [GitHub Releases](https://github.com/XOOPS/XOOPSCore27/releases) oldalról.

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Telepítési lépések

1. **Töltsön fel fájlokat** a webszerver dokumentumgyökérébe (pl. `public_html/`).
2. **Hozzon létre egy MySQL adatbázist** és egy felhasználót a teljes jogosultságokkal.
3. **Nyissa meg böngészőjét**, és navigáljon a domainjére – a XOOPS telepítő automatikusan elindul.
4. **Kövesse az 5 lépésből álló varázslót** — konfigurálja az elérési utakat, létrehozza a táblázatokat, és beállítja a rendszergazdai fiókját.
5. **Amikor a rendszer kéri, törölje a `install/` mappát**. Ez a biztonság érdekében kötelező.

## Ellenőrizze a telepítést

A beállítás után látogasson el:

- **Első oldal:** `https://yourdomain.com/`
- **Adminisztrációs panel:** `https://yourdomain.com/xoops_data/` *(a telepítés során választott elérési út)*

## Következő lépések

- [Teljes telepítési útmutató](./installation/) – szerverkonfiguráció, engedélyek, hibaelhárítás
- [modul útmutató](./module-guide/introduction/) – készítse el első modulját
- [Téma útmutató](./theme-guide/introduction/) – téma létrehozása vagy testreszabása
