---
title: "Alati zanata"
---
Postoje mnoge stvari koje su potrebne za prilagodbu i održavanje XOOPS web stranice koje se moraju dogoditi izvan XOOPS, ili ih je lakše učiniti tamo.

Ovo je popis vrsta alata koje biste možda željeli imati na raspolaganju, zajedno s nekim prijedlozima za specifične alate koje XOOPS webmasteri smatraju korisnima.

## Urednici

Urednici su vrlo osoban izbor, a ljudi mogu postati prilično strastveni oko svog favorita. Predstavit ćemo samo neke od brojnih mogućnosti.

Za korištenje XOOPS, trebat će vam uređivač za podešavanje nekih konfiguracijskih opcija, kao i za prilagodbu teme za vaše web mjesto. Za ove namjene može biti od velike pomoći imati uređivač koji može raditi s više datoteka u isto vrijeme, moći pretraživati ​​i mijenjati više datoteka i omogućiti isticanje sintakse. Možete koristiti vrlo jednostavan uređivač bez dodataka, ali ćete raditi puno više da biste izvršili neke zadatke.

**PhpStorm** iz _JetBrains_ je IDE (integrirano razvojno okruženje) posebno skrojeno za PHP web razvoj. _JetBrains_ je bio od velike pomoći u sponzoriranju XOOPS, a njegovi su proizvodi omiljeni mnogim programerima. To je komercijalni proizvod i mogao bi biti previsok za neke nove webmastere, ali vrijeme koje može uštedjeti čini ga privlačnim iskusnim programerima.

**Visual Studio Code** besplatan je uređivač izvornog koda za više platformi tvrtke Microsoft. Ima podršku, ugrađenu ili putem ekstenzija, za osnovne web tehnologije kao što su JavaScript i PHP, što ga čini dobrim za korištenje XOOPS.

**Notepad++** je besplatan, vremenom počašćen natjecatelj u ovoj kategoriji za Windows, s lojalnim korisnicima.

**Meld** nije uređivač, ali uspoređuje tekstualne datoteke pokazujući razlike i omogućuje selektivno spajanje promjena i male izmjene. Vrlo je korisno kada se uspoređuju konfiguracijske datoteke, tema templates, i naravno PHP kod.

| Ime | Link | Licenca | Platforma |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Komercijalni | Bilo koji |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Bilo koji |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Pobjeda |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Bilo koji |

## FTP klijent

File Transfer Protocol (FTP) ili njegova varijacija koristi se za premještanje datoteka s jednog računala na drugo. Većina instalacija XOOPS trebat će FTP klijent za premještanje datoteka koje dolaze iz distribucije XOOPS na glavni sustav na kojem će se stranica postaviti.

**FileZilla** je besplatan i moćan FTP klijent koji je dostupan za većinu platformi. Dosljednost na više platformi učinila ga je izborom za FTP primjere u ovoj knjizi.

**PuTTY** je besplatni SSH klijent, koristan za Shell pristup poslužitelju, kao i pružanje mogućnosti prijenosa datoteka sa SCP-om

**WinSCP** je FTP/SFTP/SCP klijent za Windows sustave.

| Ime | Link | Licenca | Platforma |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Bilo koji |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDBBaza podataka sadrži sav sadržaj vaše stranice, konfiguracije koje prilagođavaju vašu stranicu, podatke o korisnicima vaše stranice i još mnogo toga. Zaštita i održavanje tih informacija može biti lakše s nekim dodatnim alatima koji se bave posebno bazom podataka.

**phpMyAdmin** je najpopularniji alat temeljen na webu za rad s MySQL bazama podataka, uključujući izradu jednokratnih sigurnosnih kopija.

**BigDump** je božji dar za ograničene hosting račune, gdje pomaže u vraćanju velikih kopija baze podataka uz izbjegavanje vremenskog ograničenja i ograničenja veličine.

**srdb**, Traži i zamijeni DB za XOOPS je XOOPS adaptacija [Traži i zamijeni DB](https://github.com/interconnectit/Search-Replace-DB) od interconnect/it. Posebno je korisno promijeniti URL-ove i reference datotečnog sustava u podacima MySQL kada premještate web mjesto.

| Ime | Link | Licenca | Platforma |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Bilo koji |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Bilo koji |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Bilo koji |

## Razvojni nizovi

Neke platforme, poput Ubuntua, imaju ugrađen cijeli snop potreban za pokretanje XOOPS, dok druge trebaju neke dodatke.

**WAMP** i **Uniform Server Zero** skupovi su sve u jednom za Windows.

**XAMPP**, sve-u-jednom skup od Apache Friends, dostupan je za više platformi.

**bitnami** nudi širok raspon unaprijed izgrađenih skupova aplikacija, uključujući slike virtualnih strojeva i spremnika. Njihova ponuda može biti vrijedan resurs za brzo isprobavanje aplikacija (uključujući XOOPS) ili raznih web tehnologija. Mogu biti prikladni za proizvodnju kao i za razvoj.

**Docker** je platforma spremnika aplikacija koja se koristi za stvaranje i pokretanje spremnika za implementaciju prilagođenih okruženja. 

**Devilbox** je razvojni skup temeljen na Dockeru koji se lako konfigurira. Nudi širok raspon verzija za sve komponente hrpe i omogućuje razvojnim programerima testiranje u reproducibilnom okruženju koje se može dijeliti. 

| Ime | Link | Licenca | Platforma |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Više | Pobjeda |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Više | Pobjeda |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Više | Bilo koji |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Više | Bilo koji |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Više | Bilo koji |
| Đavolja kutija | [http://devilbox.org/](http://devilbox.org/) | MIT | Bilo koji |
