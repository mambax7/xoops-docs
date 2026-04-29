---
title: "Telepítő varázsló"
description: "A XOOPS telepítővarázsló lépésről lépésre bemutatása – 15 képernyő magyarázata."
---
A XOOPS telepítővarázsló végigvezeti Önt egy 15 lépésből álló folyamaton, amely konfigurálja az adatbázist, létrehozza a rendszergazdai fiókot, és előkészíti a webhelyet az első használatra.

## Mielőtt elkezdené

- [Feltöltötte a XOOPS-t a szerverére](/xoops-docs/2.7/installation/ftp-upload/), vagy beállított egy helyi környezetet
- Ön [ellenőrizte a követelményeket](/xoops-docs/2.7/installation/requirements/)
- Az adatbázis hitelesítő adatai készen állnak

## A varázsló lépései

| lépés | Képernyő | Mi történik |
|------|--------|---------------|
| 1 | [Nyelvválasztás](./step-01/) | Válasszon telepítési nyelvet |
| 2 | [Üdvözöljük](./step-02/) | Licencszerződés |
| 3 | [Konfiguráció ellenőrzése](./step-03/) | PHP/server környezeti ellenőrzés |
| 4 | [Útvonal beállítása](./step-04/) | Állítsa be a gyökér elérési útját és a URL |
| 5 | [Adatbázis-kapcsolat](./step-05/) | Adja meg az adatbázis gazdagépét, felhasználóját, jelszavát |
| 6 | [Adatbázis-konfiguráció](./step-06/) | Állítsa be az adatbázis nevét és a tábla előtagját |
| 7 | [Konfiguráció mentése](./step-07/) | Írjon mainfile.php |
| 8 | [Táblázat létrehozása](./step-08/) | Hozza létre az adatbázissémát |
| 9 | [Kezdeti beállítások](./step-09/) | Webhely neve, rendszergazdai e-mail |
| 10 | [Adatbeillesztés](./step-10/) | Alapértelmezett adatok feltöltése |
| 11 | [Webhely konfigurációja](./step-11/) | URL, időzóna, nyelv |
| 12 | [Téma kiválasztása](./step-12/) | Válasszon alapértelmezett témát |
| 13 | [modul telepítése](./step-13/) | A mellékelt modulok telepítése |
| 14 | [Üdvözöljük](./step-14/) | A telepítés befejeződött üzenet |
| 15 | [Tisztítás](./step-15/) | Távolítsa el a telepítési mappát |

:::vigyázat[Biztonság]
A varázsló befejezése után **törölje vagy nevezze át a `install/` mappát** – a 15. lépés végigvezeti Önt ezen. Hozzáférhetővé tétele biztonsági kockázatot jelent.
:::
