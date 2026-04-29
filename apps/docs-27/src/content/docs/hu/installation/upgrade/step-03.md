---
title: "Hibaelhárítás"
---
## Smarty 4 sablonhibák

A XOOPS 2.5.x-ről 2.7.0-ra való frissítéskor a leggyakoribb problémák a Smarty 4 sablonok inkompatibilitása. Ha kihagyta vagy nem fejezte be az [Preflight Check](preflight.md) műveletet, akkor a frissítés után sablonhibák jelenhetnek meg a kezelőfelületen vagy az adminisztrációs területen.

A helyreállításhoz:

1. **Futtassa újra a repülés előtti szkennert** a `/upgrade/preflight.php` helyen. Alkalmazza az általa kínált automatikus javításokat, vagy manuálisan javítsa ki a megjelölt sablonokat.
2. **Törölje a lefordított sablon gyorsítótárát.** A `index.html` kivételével távolítson el mindent a `xoops_data/caches/smarty_compile/` fájlból. A Smarty 3 összeállított sablonok nem kompatibilisek a Smarty 4-gyel, és az elavult fájlok zavaró hibákat okozhatnak.
3. **Átmenetileg váltson egy szállított témára.** Az adminisztrációs területen válassza ki a `xbootstrap5` vagy `default` aktív témát. Ez megerősíti, hogy a probléma egyéni témára korlátozódik-e, vagy az egész webhelyet érinti.
4. **Érvényesítse az egyéni témákat és modulsablonokat**, mielőtt újra bekapcsolná az éles forgalmat. Fordítson különös figyelmet azokra a sablonokra, amelyek `{php}` blokkokat, elavult módosítókat vagy nem szabványos határoló szintaxist használnak – ezek a Smarty 4 leggyakoribb törései.

Lásd még a Smarty 4 részt a [Speciális témák](../../installation/specialtopics.md) részben.

## Engedélyproblémák

Előfordulhat, hogy a XOOPS frissítésnek olyan fájlokra kell írnia, amelyeket korábban csak olvashatóvá tettek. Ha ez a helyzet, akkor egy ehhez hasonló üzenetet fog látni:

![XOOPS frissítés, írható hiba](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

A megoldás az engedélyek módosítása. Az engedélyeket a FTP használatával módosíthatja, ha nincs közvetlenebb hozzáférése. Íme egy példa a FileZilla használatára:

![FileZilla módosítási engedély](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Hibakeresési kimenet

Extra hibakeresési kimenetet engedélyezhet a naplózóban, ha a frissítés elindításához használt URL hibakeresési paramétert ad hozzá:

```text
http://example.com/upgrade/?debug=1
```
