---
title: "Orodja trgovine"
---
Za prilagoditev in vzdrževanje spletnega mesta XOOPS je potrebnih veliko stvari, ki se morajo zgoditi izven XOOPS ali jih je tam lažje narediti.

To je seznam vrst orodij, ki bi jih morda želeli imeti na voljo, skupaj z nekaj predlogi za posebna orodja, ki so se XOOPS spletnim skrbnikom zdela koristna.

## Uredniki

Uredniki so zelo osebna izbira in ljudje se lahko navdušijo nad svojim najljubšim. Predstavili bomo le nekaj od številnih možnosti.

Za uporabo XOOPS boste potrebovali urejevalnik, ki bo prilagodil nekatere konfiguracijske možnosti in prilagodil temo za vaše spletno mesto. Za te namene je lahko zelo koristno imeti urejevalnik, ki lahko dela z več datotekami hkrati, lahko išče in zamenja v številnih datotekah ter zagotavlja označevanje sintakse. Uporabite lahko zelo preprost urejevalnik brez dodatkov, vendar boste za izpolnitev nekaterih nalog delali veliko več.

**PhpStorm** iz _JetBrains_ je IDE (integrirano razvojno okolje), posebej prilagojeno za PHP spletni razvoj. _JetBrains_ je bil v veliko pomoč pri sponzoriranju XOOPS in njegovi izdelki so priljubljeni mnogim razvijalcem. Je komercialni izdelek in bi lahko bil za nekatere nove spletne skrbnike previsok, vendar je zaradi časa, ki ga lahko prihrani, privlačen za izkušene razvijalce.**Visual Studio Code** je Microsoftov brezplačen urejevalnik izvorne kode za več platform. Ima vgrajeno ali prek razširitev podporo za osnovne spletne tehnologije, kot so HTML, JavaScript in PHP, zaradi česar je primeren za uporabo XOOPS.

**Notepad++** je brezplačen, s časom počaščen kandidat v tej kategoriji za Windows z zvestimi uporabniki.

**Meld** ni urejevalnik, vendar primerja besedilne datoteke, ki kažejo razlike, in omogoča selektivno združevanje sprememb ter vnašanje majhnih popravkov. Zelo uporaben je pri primerjavi konfiguracijskih datotek, predlog tem in seveda kode PHP.

| Ime | Povezava | Licenca | Platforma |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Komercialno | Kateri koli |
| Koda Visual Studio | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Kateri koli |
| Beležnica++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Zmaga |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Kateri koli |

## FTP Stranka

Protokol za prenos datotek (FTP,) ali njegova različica se uporablja za premikanje datotek iz enega računalnika v drugega. Večina namestitev XOOPS bo potrebovala odjemalca FTP za premikanje datotek, ki prihajajo iz distribucije XOOPS, v gostiteljski sistem, kjer bo mesto nameščeno.**FileZilla** je brezplačen in zmogljiv odjemalec FTP, ki je na voljo za večino platform. Zaradi doslednosti med platformami je bil izbran za FTP primere v tej knjigi.

**PuTTY** je brezplačen odjemalec SSH, uporaben za Shellov dostop do strežnika in omogoča tudi prenos datotek z SCP

**WinSCP** je odjemalec FTP/SFTP/SCP za sisteme Windows.

| Ime | Povezava | Licenca | Platforma |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Kateri koli |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

Baza podatkov vsebuje vso vsebino vašega spletnega mesta, konfiguracije, ki prilagajajo vaše spletno mesto, informacije o uporabnikih vašega spletnega mesta in drugo. Zaščita in vzdrževanje teh informacij je morda lažja z nekaterimi dodatnimi orodji, ki se ukvarjajo posebej z bazo podatkov.

**phpMyAdmin** je najbolj priljubljeno spletno orodje za delo z bazami podatkov MySQL, vključno z izdelavo enkratnih varnostnih kopij.

**BigDump** je božji dar za račune z omejenim gostovanjem, kjer pomaga pri obnavljanju velikih izpisov varnostne kopije baze podatkov, hkrati pa se izogne ​​časovni omejitvi in ​​omejitvam velikosti.**srdb**, Iskanje Zamenjaj DB za XOOPS je XOOPS prilagoditev [Išči in Zamenjaj DB](https://github.com/interconnectit/Search-Replace-DB) iz interconnect/it. Ko premikate spletno mesto, je še posebej koristno spremeniti URL-je in reference datotečnega sistema v podatkih MySQL.

| Ime | Povezava | Licenca | Platforma |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Kateri koli |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Kateri koli |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Kateri koli |

## Razvijalski skladi

Nekatere platforme, kot je Ubuntu, imajo vgrajen celoten sklad, ki je potreben za izvajanje XOOPS, druge pa potrebujejo nekaj dodatkov.

**WAMP** in **Uniform Server Zero** sta sklada vse v enem za Windows.

**XAMPP**, vse-v-enem sklad iz Apache Friends, je na voljo za več platform.

**bitnami** ponuja široko paleto vnaprej izdelanih skladov aplikacij, vključno s slikami virtualnih strojev in vsebnikov. Njihova ponudba je lahko dragocen vir za hitro preizkušanje aplikacij (vključno z XOOPS) ali različnih spletnih tehnologij. Lahko so primerni tako za proizvodnjo kot za razvoj.**Docker** je platforma vsebnika aplikacij, ki se uporablja za ustvarjanje in izvajanje vsebnikov za implementacijo okolij po meri. 

**Devilbox** je enostavno konfiguriran razvojni sklad, ki temelji na Dockerju. Ponuja široko paleto različic za vse komponente sklada in razvijalcem omogoča testiranje v ponovljivem okolju, ki ga je mogoče deliti. 

| Ime | Povezava | Licenca | Platforma |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Več | Zmaga |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Več | Zmaga |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Več | Kateri koli |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Več | Kateri koli |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Več | Kateri koli |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Kateri koli |