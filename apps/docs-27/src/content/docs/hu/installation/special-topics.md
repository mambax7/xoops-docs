---
title: "Különleges témák"
---
Egyes speciális rendszerszoftver-kombinációk működéséhez további konfigurációkra lehet szükség
 XOOPS-val. Íme néhány részlet az ismert problémákról és útmutatás a kezelésükhöz.

## SELinux környezetek

Bizonyos fájloknak és könyvtáraknak írhatónak kell lenniük a telepítés, a frissítés és a normál működés során
XOOPS. Egy hagyományos Linux-környezetben ezt úgy érik el, hogy biztosítják, hogy a
Az a rendszerfelhasználó, aki alatt a webszerver fut, jogosultságokkal rendelkezik a XOOPS könyvtárakhoz, általában 
beállítja a megfelelő csoportot azokhoz a könyvtárakhoz.

A SELinux-kompatibilis rendszerek (például a CentOS és a RHEL) rendelkeznek egy további biztonsági kontextussal, amely
korlátozhatja a folyamatok azon képességét, hogy módosítsák a fájlrendszert. Ezek a rendszerek megkövetelhetik 
módosítja a biztonsági környezetet a XOOPS megfelelő működéséhez.

XOOPS elvárja, hogy normál működés közben szabadon tudjon írni bizonyos könyvtárakba. 
Ezenkívül a XOOPS telepítései és frissítései során bizonyos fájloknak írhatónak is kell lenniük.
 
Normál működés közben a XOOPS elvárja, hogy képes legyen fájlokat írni és alkönyvtárakat létrehozni 
ezekben a könyvtárakban:

- `uploads` a fő XOOPS webgyökérben
- `xoops_data` bárhová is helyezik át a telepítés során

A telepítési vagy frissítési folyamat során a XOOPS-nak ebbe a fájlba kell írnia:

- `mainfile.php` a fő XOOPS web gyökérben

Egy tipikus CentOS Apache alapú rendszer esetében a biztonsági környezet megváltozhat 
ezekkel a parancsokkal lehet elérni:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

A mainfile.php-t írhatóvá teheti:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Megjegyzés: Telepítéskor átmásolhat egy üres mainfile.php-t az *extra* könyvtárból.

Azt is engedélyeznie kell a httpd-nek, hogy leveleket küldjön:

```
setsebool -P httpd_can_sendmail=1
```

További beállítások, amelyekre szükség lehet:

Engedélyezze a httpd számára hálózati kapcsolatok létrehozását, azaz RSS-hírcsatornák lekérését vagy API-hívások kezdeményezését:

```
setsebool -P httpd_can_network_connect 1
```

Hálózati kapcsolat engedélyezése egy adatbázishoz a következőkkel:

```
setsebool -P httpd_can_network_connect_db=1
```

További információkért olvassa el a rendszerdokumentációt and/or rendszergazda.

## Smarty 4 és egyéni témák

A XOOPS 2.7.0 a sablonmotorját Smarty 3-ról **Smarty 4**-re frissítette. A Smarty 4 szigorúbb
a sablon szintaxisáról, mint a Smarty 3-nál, és néhány olyan mintáról, amelyeket a régebbi sablonok toleráltak
most hibákat fog okozni. Ha a XOOPS 2.7.0 friss példányát telepíti, csak a témák használatával
és a kiadással együtt szállított modulok, nincs ok az aggodalomra – minden szállított sablon
Frissült a Smarty 4 kompatibilitás érdekében.

Az aggodalom akkor érvényes, ha Ön:

- egy meglévő XOOPS 2.5.x webhely frissítése, amely egyéni témákkal rendelkezik, vagy
- egyéni témák vagy régebbi, harmadik féltől származó modulok telepítése a XOOPS 2.7.0-ba.

Mielőtt az élő forgalmat frissített webhelyre váltaná, futtassa a csomagban található repülés előtti szkennert
`/upgrade/` könyvtár. Beolvassa a `/themes/` és `/modules/` Smarty 4 inkompatibilitást keresve
és ezek közül sokat automatikusan megjavíthat. Lásd a
[Preflight Check](../upgrading/upgrade/preflight.md) oldalon a részletekért.

Ha sablonhibákat talál a telepítés vagy frissítés után:

1. Futtassa újra a `/upgrade/preflight.php` programot, és javítsa ki a jelentett problémákat.
2. Törölje a lefordított sablon gyorsítótárát úgy, hogy a `index.html` kivételével mindent eltávolít innen
   `xoops_data/caches/smarty_compile/`.
3. A probléma megerősítéséhez ideiglenesen váltson egy szállított témára, például `xbootstrap5` vagy `default`
   témaspecifikus, nem pedig webhelyszintű.
4. Érvényesítse az egyéni téma vagy modulsablon módosításait, mielőtt visszaállítaná a webhely éles állapotát.
