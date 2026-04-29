---
title: "Adatbázis konfiguráció"
---
Ez az oldal a XOOPS által használt adatbázissal kapcsolatos információkat gyűjti össze.

A kért adatok megadása és az esetleges hibák kijavítása után a folytatáshoz kattintson a „Folytatás” gombra.

![XOOPS Telepítői adatbázis-konfiguráció](/xoops-docs/2.7/img/installation/installer-06.png)

## Ebben a lépésben gyűjtött adatok

### Adatbázis

#### Adatbázis neve

Az adatbázis neve a gazdagépen, amelyet a XOOPS-nak használnia kell. Az előző lépésben megadott adatbázis-felhasználónak rendelkeznie kell az adatbázis összes jogosultságával. A telepítő megpróbálja létrehozni ezt az adatbázist, ha nem létezik.

#### Táblázat előtag

Ez az előtag hozzáadódik a XOOPS által létrehozott összes új tábla nevéhez. Ez segít elkerülni a névütközéseket, ha az adatbázis meg van osztva más alkalmazásokkal. Az egyedi előtag a táblanevek kitalálását is megnehezíti, ami biztonsági előnyökkel jár. Ha nem biztos benne, tartsa meg az alapértelmezett értéket

#### Adatbázis karakterkészlet

A telepítő alapértelmezett értéke a `utf8mb4`, amely támogatja a teljes Unicode-tartományt, beleértve az emojikat és a kiegészítő karaktereket. Itt választhat egy másik karakterkészletet, de a `utf8mb4` gyakorlatilag minden nyelvhez és területi beállításhoz ajánlott, és hagyni kell, hacsak nincs konkrét oka a módosítására.

#### Adatbázis-összeállítás

A leválogatási mező alapértelmezés szerint üresen marad. Ha üres, a MySQL az alapértelmezett leválogatást alkalmazza a fent kiválasztott karakterkészlethez (`utf8mb4` esetén ez általában `utf8mb4_general_ci` vagy `utf8mb4_0900_ai_ci`, a QZXH0PXZQ17 verziótól függően). Ha egy konkrét leválogatásra van szüksége – például egy meglévő adatbázishoz – válassza ki itt. Ellenkező esetben az üresen hagyása az ajánlott választás.
