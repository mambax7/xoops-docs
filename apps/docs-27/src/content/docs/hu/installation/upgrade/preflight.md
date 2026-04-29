---
title: "Repülés előtti ellenőrzés"
---
A XOOPS 2.7.0 a Smarty 3-ról Smarty 4-re frissítette sablonmotorját. A Smarty 4 szigorúbb a sablon szintaxisát illetően, mint a Smarty 3, és előfordulhat, hogy bizonyos egyéni témákat és modulsablonokat módosítani kell, mielőtt megfelelően működnének a QZXPH000023HPXZ.0.0.

A problémák azonosítása és kijavítása érdekében, _mielőtt_ elindítaná a fő frissítőt, a XOOPS 2.7.0 egy **preflight szkennert** tartalmaz a `upgrade/` könyvtárban. Legalább egyszer le kell futtatnia az előzetes vizsgálatot, mielőtt a fő frissítési munkafolyamat lehetővé teszi a folytatást.

## Mit csinál a szkenner

A repülés előtti szkenner végigjárja a meglévő témákat és modulsablonokat, keresve a Smarty 4 ismert inkompatibilitását. Lehetséges:

* **Szkennelje** a `themes/` és `modules/` könyvtárakat a `.tpl` és `.html` sablonfájlokhoz, amelyek módosításra szorulnak
* **Problémák jelentése** fájl és problématípus szerint csoportosítva
* **Automatikus javítás** számos gyakori probléma, amikor kéri

Nem minden probléma javítható automatikusan. Egyes sablonok manuális szerkesztést igényelnek, különösen, ha régebbi Smarty 3 idiómákat használnak, amelyeknek nincs közvetlen megfelelője a Smarty 4-ben.

## A szkenner futtatása

1. Másolja a terjesztési `upgrade/` könyvtárat a webhely gyökérkönyvtárába (ha még nem tette meg a [Frissítés előkészítése](ustep-01.md) lépés részeként).
2. Irányítsa böngészőjét a URL elővizsgálatra:

   
   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Amikor a rendszer kéri, jelentkezzen be rendszergazdai fiókkal.
4. A szkenner megjelenít egy űrlapot három vezérlővel:
   * **Sablonkönyvtár** — hagyja üresen a `themes/` és `modules/` vizsgálatához. Adjon meg egy elérési utat, például `/themes/mytheme/`, hogy a vizsgálatot egyetlen könyvtárra szűkítse.
   * **Sablonkiterjesztés** — hagyja üresen a `.tpl` és `.html` fájlok vizsgálatához. A keresés szűkítéséhez írjon be egyetlen kiterjesztést.
   * **Automatikus javítás megkísérlése** — jelölje be ezt a négyzetet, ha azt szeretné, hogy a lapolvasó kijavítsa azokat a problémákat, amelyeket tudja, hogyan kell javítani. Hagyja bejelölés nélkül a csak olvasható vizsgálathoz.
5. Nyomja meg a **Futtatás** gombot. A szkenner végigjárja a kiválasztott könyvtárakat, és minden talált problémát jelent.

## Eredmények tolmácsolása

A vizsgálati jelentés felsorolja az összes megvizsgált fájlt és minden talált hibát. Minden problémabejegyzés a következőket mondja:

* Melyik fájl tartalmazza a problémát
* Milyen Smarty 4 szabályt sért meg
* A lapolvasó képes-e automatikusan megjavítani

Ha a vizsgálatot az _Automatikus javítási kísérlet_ bekapcsolásával futtatta, a jelentés azt is megerősíti, hogy mely fájlok kerültek újraírásra.

## A problémák kézi javítása

Ha a lapolvasó nem tudja automatikusan kijavítani a problémákat, nyissa meg a megjelölt sablonfájlt egy szerkesztőben, és hajtsa végre a szükséges módosításokat. A Smarty 4 gyakori összeférhetetlenségei a következők:

* `{php} ... {/php}` blokkok (már nem támogatott a Smarty 4-ben)
* Elavult módosítók és függvényhívások
* Szóközérzékeny határoló használata
* A Smarty 4-ben megváltozott regisztrációs idő plugin feltételezések

Ha nem érzi kényelmesen a sablonok szerkesztését, a legbiztonságosabb megoldás az, ha átvált egy szállított témára (`xbootstrap5`, `default`, `xswatch5` stb.), és a frissítés befejezése után külön kezeli az egyéni témát.

## Újrafutás a tisztaságig

A javítások elvégzése után – legyen az automatikus vagy kézi – futtassa újra a vizsgálat előtti szkennert. Ismételje meg mindaddig, amíg a szkennelés nem jelez további problémákat.

Ha a szkennelés tiszta, leállíthatja a repülés előtti munkamenetet a **Kilépés a szkennerből** gomb megnyomásával a szkenner felhasználói felületén. Ez befejezettnek jelöli az elővizsgálatot, és lehetővé teszi a `/upgrade/` fő frissítőjének folytatását.

## Folytatás a frissítéshez

Az elővizsgálat befejeztével elindíthatja a fő frissítőt a következő címen:

```text
http://example.com/upgrade/
```

A következő lépésekért lásd a [Futó frissítés](ustep-02.md) részt.

## Ha kihagyja az előrepülést

Az elővizsgálat kihagyása erősen nem javasolt, de ha futtatása nélkül frissített, és most sablonhibákat lát, tekintse meg a [Hibaelhárítás](ustep-03.md) Smarty 4 sablonhibái című részét. Utána futtathatja az elővizsgálatot, és törölheti a `xoops_data/caches/smarty_compile/`-t a helyreállításhoz.
