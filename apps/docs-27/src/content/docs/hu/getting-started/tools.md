---
title: "A kereskedelem eszközei"
---
A XOOPS webhelyek testreszabásához és karbantartásához sok olyan dologra van szükség, amelyeknek a XOOPS-n kívül kell megtörténniük, vagy ott könnyebben elvégezhetők.

Ez a rendelkezésre álló eszközök típusainak listája, valamint néhány javaslat a XOOPS webmesterek által hasznosnak talált eszközökre vonatkozóan.

## Szerkesztők

A szerkesztők nagyon személyes döntések, és az emberek nagyon szenvedélyesek lehetnek kedvenceik iránt. A sok lehetőség közül csak néhányat mutatunk be.

A XOOPS használatához szüksége lesz egy szerkesztőre, hogy módosítson néhány konfigurációs beállítást, valamint testreszabjon egy témát a webhelyéhez. Ilyen célokra nagyon hasznos lehet egy olyan szerkesztő, amely egyszerre több fájllal is tud dolgozni, képes több fájlban keresni és cserélni, valamint szintaktikai kiemelést biztosít. Használhat egy nagyon egyszerű, sallangmentes szerkesztőt, de bizonyos feladatok elvégzése érdekében sokkal keményebben kell dolgoznia.

A _JetBrains_ **PhpStorm** egy IDE (integrált fejlesztői környezet), amelyet kifejezetten a PHP webfejlesztéshez szabtak. A _JetBrains_ nagyon sokat segített a XOOPS szponzorálásában, termékei pedig sok fejlesztő kedvencei. Ez egy kereskedelmi termék, és egyes új webmesterek számára költséges lehet, de az általa megtakarítható idő vonzóvá teszi a tapasztalt fejlesztők számára.

A **Visual Studio Code** a Microsoft ingyenes, többplatformos forráskód-szerkesztője. Beépítetten vagy bővítményeken keresztül támogatja az alapvető webtechnológiákat, mint például a HTML, a JavaScript és a PHP, így jól illeszkedik a XOOPS használatához.

A **Notepad++** egy ingyenes, idők óta elismert versenyző ebben a Windows-kategóriában, hűséges felhasználókkal.

A **Meld** nem szerkesztő, de összehasonlítja a különbségeket mutató szöveges fájlokat, és lehetővé teszi a változtatások szelektív összevonását és kis szerkesztéseket. Nagyon hasznos konfigurációs fájlok, témasablonok és természetesen PHP kód összehasonlításakor.

| Név | Link | Licenc | Platform |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Kereskedelmi | Bármilyen |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Bármilyen |
| Jegyzettömb++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Bármilyen |

## FTP kliens

A fájlátviteli protokoll (FTP,) vagy annak egy változata a fájlok egyik számítógépről a másikra való áthelyezésére szolgál. A legtöbb XOOPS-telepítéshez FTP-ügyfélre lesz szükség ahhoz, hogy a XOOPS disztribúcióból származó fájlokat olyan hosztrendszerre helyezze át, amelyre a webhelyet telepíteni fogják.

A **FileZilla** egy ingyenes és hatékony FTP kliens, amely a legtöbb platformon elérhető. A platformok közötti konzisztencia tette a választást a könyv FTP példáihoz.

A **PuTTY** egy ingyenes SSH kliens, amely hasznos a Shell szerver eléréséhez, valamint fájlátviteli képességeket biztosít a SCP segítségével.

A **WinSCP** egy FTP/SFTP/SCP kliens Windows rendszerekhez.

| Név | Link | Licenc | Platform |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Bármilyen |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

Az adatbázis tartalmazza a webhely összes tartalmát, a webhelyet testreszabó konfigurációkat, a webhely felhasználóira vonatkozó információkat és egyebeket. Ezeknek az információknak a védelme és karbantartása egyszerűbb lehet néhány extra eszközzel, amelyek kifejezetten az adatbázissal foglalkoznak.

A **phpMyAdmin** a legnépszerűbb webalapú eszköz a MySQL adatbázisokkal való munkavégzéshez, beleértve az egyszeri biztonsági mentések készítését is.

A **BigDump** egy áldás a korlátozott tárhelyfiókok számára, ahol segít a nagy adatbázis-mentési kiíratások visszaállításában, miközben elkerüli az időtúllépést és a méretkorlátozásokat.**srdb**, Keresés Csere DB a XOOPS XOOPS adaptációja a [Keresés és csere DB](QZXPH0000097 from Q0ZH) különösen hasznos az URL-ek és a fájlrendszer-hivatkozások megváltoztatásához a MySQL adatokban, amikor webhelyet helyez át.

| Név | Link | Licenc | Platform |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Bármilyen |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Bármilyen |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Bármilyen |

## Fejlesztői halmok

Egyes platformok, például az Ubuntu, beépítették a XOOPS futtatásához szükséges teljes stacket, míg másokon néhány kiegészítésre van szükség.

A **WAMP** és a **Uniform Server Zero** minden az egyben veremek Windowshoz.

A **XAMPP**, az Apache Friends többfunkciós stackje több platformon is elérhető.

A **bitnami** előre elkészített alkalmazásveremek széles skáláját kínálja, beleértve a virtuális gépeket és a konténerképeket. Kínálatuk értékes forrás lehet az alkalmazások (beleértve a XOOPS) vagy a különféle webes technológiák gyors kipróbálásához. Gyártásra és fejlesztésre egyaránt alkalmasak lehetnek.

A **Docker** egy alkalmazástároló platform, amely tárolók létrehozására és futtatására szolgál egyéni környezetek megvalósításához. 

A **Devilbox** egy könnyen konfigurálható Docker alapú fejlesztési verem. Verziók széles skáláját kínálja az összes veremkomponenshez, és lehetővé teszi a fejlesztők számára, hogy reprodukálható és megosztható környezetben teszteljék. 

| Név | Link | Licenc | Platform |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Többszörös | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Többszörös | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Többszörös | Bármilyen |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Többszörös | Bármilyen |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Többszörös | Bármilyen |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Bármilyen |
