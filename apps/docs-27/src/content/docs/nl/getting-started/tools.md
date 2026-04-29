---
title: "Gereedschappen van de handel"
---
Er zijn veel dingen nodig om een ​​XOOPS-website aan te passen en te onderhouden, die buiten XOOPS moeten gebeuren, of daar gemakkelijker kunnen worden gedaan.

Dit is een lijst met soorten tools die u mogelijk beschikbaar wilt hebben, samen met enkele suggesties voor specifieke tools die XOOPS-webmasters nuttig hebben gevonden.

## Redacteuren

Editors zijn een zeer persoonlijke keuze en mensen kunnen behoorlijk gepassioneerd raken door hun favoriet. Wij presenteren slechts enkele van de vele mogelijkheden.

Voor gebruik van XOOPS heeft u een editor nodig om enkele configuratie-opties aan te passen en een thema voor uw site aan te passen. Voor deze toepassingen kan het erg handig zijn om een ​​editor te hebben die met meerdere bestanden tegelijk kan werken, die in veel bestanden kan zoeken en vervangen, en syntaxisaccentuering kan bieden. U kunt een heel eenvoudige, no-nonsense editor gebruiken, maar u zult veel harder moeten werken om sommige taken uit te voeren.

**PhpStorm** van _JetBrains_ is een IDE (geïntegreerde ontwikkelomgeving) die specifiek is afgestemd op PHP webontwikkeling. _JetBrains_ is zeer behulpzaam geweest bij het sponsoren van XOOPS, en zijn producten zijn favoriet bij veel ontwikkelaars. Het is een commercieel product en voor sommige nieuwe webmasters kan de prijs onbetaalbaar zijn, maar de tijd die het kan besparen maakt het aantrekkelijk voor ervaren ontwikkelaars.

**Visual Studio Code** is een gratis broncode-editor voor meerdere platforms van Microsoft. Het heeft ondersteuning, hetzij ingebouwd, hetzij via extensies, voor de belangrijkste webtechnologieën zoals HTML, JavaScript en PHP, waardoor het goed geschikt is voor XOOPS-gebruik.

**Notepad++** is een gratis, aloude kanshebber in deze categorie voor Windows, met trouwe gebruikers.

**Meld** is geen editor, maar vergelijkt tekstbestanden die verschillen vertonen, en maakt het selectief samenvoegen van wijzigingen en het maken van kleine bewerkingen mogelijk. Het is erg handig bij het vergelijken van configuratiebestanden, themasjablonen en natuurlijk PHP-code.

| Naam | Koppeling | Licentie | Platform |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Commercieel | Elke |
| Visual Studio-code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Elke |
| Kladblok++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Winnen |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Elke |

## FTP-client

File Transfer Protocol (FTP,) of een variant daarvan, wordt gebruikt om bestanden van de ene computer naar de andere te verplaatsen. Voor de meeste XOOPS-installaties is een FTP-client nodig om bestanden die afkomstig zijn van de XOOPS-distributie te verplaatsen naar een hostsysteem waarop de site zal worden geïmplementeerd.

**FileZilla** is een gratis en krachtige FTP-client die beschikbaar is voor de meeste platforms. De consistentie tussen platforms maakte dit de keuze voor de FTP-voorbeelden in dit boek.

**PuTTY** is een gratis SSH-client, handig voor Shell-toegang tot een server, en biedt mogelijkheden voor bestandsoverdracht met SCP

**WinSCP** is een FTP/SFTP/SCP-client voor Windows-systemen.

| Naam | Koppeling | Licentie | Platform |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Elke |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

De database bevat alle inhoud van uw site, de configuraties waarmee uw site wordt aangepast, de informatie over de gebruikers van uw site, en meer. Het beschermen en onderhouden van die informatie kan eenvoudiger zijn met enkele extra tools die specifiek met de database omgaan.

**phpMyAdmin** is de populairste webgebaseerde tool voor het werken met MySQL-databases, inclusief het maken van eenmalige back-ups.

**BigDump** is een uitkomst voor beperkte hostingaccounts, waar het helpt bij het herstellen van grote databaseback-updumps en tegelijkertijd time-out- en groottebeperkingen vermijdt.**srdb**, Search Replace DB for XOOPS is een XOOPS-aanpassing van [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) van interconnect/it. Het is vooral handig om URL's en bestandssysteemreferenties in MySQL-gegevens te wijzigen wanneer u een site verplaatst.

| Naam | Koppeling | Licentie | Platform |
| :--- | :--- | :--- | :--- |
| phpMijnAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Elke |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Elke |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Elke |

## Ontwikkelaarsstapels

Op sommige platforms, zoals Ubuntu, is de hele stapel die nodig is om XOOPS uit te voeren ingebouwd, terwijl op andere enkele toevoegingen nodig zijn.

**WAMP** en **Uniform Server Zero** zijn alles-in-één stacks voor Windows.

**XAMPP**, een alles-in-één-stack van Apache Friends, is beschikbaar voor meerdere platforms.

**bitnami** biedt een breed scala aan vooraf gebouwde applicatiestacks, inclusief virtuele machine- en containerimages. Hun aanbod kan een waardevolle bron zijn om snel applicaties (waaronder XOOPS) of verschillende webtechnologieën uit te proberen. Ze kunnen geschikt zijn voor zowel productie- als ontwikkelingsdoeleinden.

**Docker** is een applicatiecontainerplatform dat wordt gebruikt om containers te maken en uit te voeren om aangepaste omgevingen te implementeren. 

**Devilbox** is een eenvoudig te configureren, op Docker gebaseerde ontwikkelingsstack. Het biedt een breed scala aan versies voor alle stackcomponenten en stelt ontwikkelaars in staat te testen in een reproduceerbare en deelbare omgeving. 

| Naam | Koppeling | Licentie | Platform |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Meerdere | Winnen |
| Uniforme server nul | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Meerdere | Winnen |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Meerdere | Elke |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Meerdere | Elke |
| Dokwerker | [https://www.docker.com/](https://www.docker.com/) | Meerdere | Elke |
| Duiveldoos | [http://devilbox.org/](http://devilbox.org/) | MIT | Elke |