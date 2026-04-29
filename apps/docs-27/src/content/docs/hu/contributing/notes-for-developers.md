---
title: "Megjegyzések fejlesztőknek"
---
Míg a XOOPS fejlesztési használatra való tényleges telepítése hasonló a már leírt normál telepítéshez, a fejlesztőre kész rendszer felépítése során lényeges különbségek vannak.

Az egyik nagy különbség a fejlesztői telepítésben az, hogy ahelyett, hogy csak a _htdocs_ könyvtár tartalmára összpontosítana, a fejlesztői telepítés megtartja az összes fájlt, és a git segítségével forráskód-vezérlés alatt tartja őket.

Egy másik különbség az, hogy a _xoops_data_ és _xoops_lib_ könyvtárak általában a helyükön maradhatnak átnevezés nélkül, mindaddig, amíg a fejlesztői rendszer nem érhető el közvetlenül a nyílt interneten (azaz magánhálózaton, például útválasztó mögött).

A legtöbb fejlesztő egy _localhost_ rendszeren dolgozik, amely rendelkezik a forráskóddal, egy webszerver veremmel és minden olyan eszközzel, amely a kóddal és az adatbázissal való munkához szükséges.

További információkat a [Tools of the Trade](../tools/tools.md) fejezetben talál.

## Git és virtuális gazdagépek

A legtöbb fejlesztő szeretne naprakészen tartani az aktuális forrásokat, és hozzájárulni a változtatásokhoz az upstream [XOOPS/XOOPSCore27 adattárhoz a GitHubon](https://github.com/XOOPS/XOOPSCore27). Ez azt jelenti, hogy a kiadási archívum letöltése helyett érdemes [fork](https://help.github.com/articles/fork-a-repo/) a XOOPS másolatát használni, és a **git** használatával [klónozni](https://help.github.com/categories/bootcamp/) azt a tárolót a fejlesztői dobozba.

Mivel a lerakatnak sajátos szerkezete van, ahelyett, hogy a _htdocs_ könyvtárból a webszerverre _másolna_ fájlokat, jobb, ha a webszervert a helyileg klónozott lerakaton belüli htdocs mappába irányítja. Ennek elérése érdekében általában létrehozunk egy új _Virtual Host_ vagy _vhost_-t, amely a git által vezérelt forráskódunkra mutat.

Egy [WAMP](http://www.wampserver.com/) környezetben az alapértelmezett [localhost](http://localhost/) oldal _Eszközök_ részében egy hivatkozás található a _Add a Virtual Host_ linkre, amely ide vezet:

![WAMP Virtuális gazdagép hozzáadása](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Ezzel beállíthat egy VirtualHost bejegyzést, amely közvetlenül a (még mindig) git által vezérelt adattárba kerül.

Íme egy példabejegyzés a `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`-ban

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Előfordulhat, hogy egy bejegyzést is hozzá kell adnia a `Windows/System32/drivers/etc/hosts`-ban:

```text
127.0.0.1    xoops.localhost
```

Most már telepítheti a `http://xoops.localhost/`-t tesztelés céljából, miközben érintetlenül hagyja a tárat, és a webszervert a htdocs könyvtáron belül tartja egy egyszerű URL segítségével. Ezenkívül bármikor frissítheti a XOOPS helyi példányát a legújabb mesterre anélkül, hogy újra kellene telepítenie vagy másolnia kellene a fájlokat. A kódon pedig fejlesztéseket és javításokat hajthat végre, hogy hozzájáruljon a XOOPS-hoz a GitHubon keresztül.

## Zeneszerzői függőségek

A XOOPS 2.7.0 a [Composer](https://getcomposer.org/) segítségével kezeli PHP függőségeit. A függőségi fa a `htdocs/xoops_lib/`-ban található a forrástáron belül:

* A `composer.dist.json` a kiadással együtt szállított függőségek fő listája.
* A `composer.json` a helyi másolat, amelyet szükség esetén testre szabhat a fejlesztői környezethez.
* A `composer.lock` pontos verziókat rögzít, így a telepítések reprodukálhatók.
* A `vendor/` tartalmazza a telepített könyvtárakat (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monológ, symfony/var-dumper, xoops/xmf, QZX0, PHPZ00000067HPXZQ és egyebek).

A XOOPS 2.7.0 friss git klónjához a repo gyökértől kezdve futtassa:

```text
cd htdocs/xoops_lib
composer install
```

Vegye figyelembe, hogy a repo gyökérben nincs `composer.json` – a projekt `htdocs/xoops_lib/` alatt él, ezért a Composer futtatása előtt `cd`-t kell beírnia abba a könyvtárba.

A kiadási tarballok előre feltöltött `vendor/`-val kerülnek szállításra, de a git klónok nem feltétlenül. A `vendor/` érintetlen maradjon a fejlesztési telepítéseknél — A XOOPS onnan tölti be függőségeit futás közben.

A [XMF (XOOPS module Framework)](https://github.com/XOOPS/xmf) könyvtárat a 2.7.0-s verzióban Composer-függőségként szállítjuk, így használhatja a `XMF\Request`QZ0,QZXPHHZ0 osztályokat a modul kódjában további telepítés nélkül.

## DebugBar modulA XOOPS 2.7.0 Symfony VarDumper alapú **DebugBar** modult szállít. Hibakereső eszköztárat ad a megjelenített oldalakhoz, amely felfedi a kéréseket, az adatbázisokat és a sablonokat. Telepítse a modulok adminisztrátori területéről a fejlesztési és állomáshelyi webhelyeken. Ne hagyja nyilvános gyártási helyen telepítve, hacsak nem tudja, hogy ezt akarja.
