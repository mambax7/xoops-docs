---
title: "Branchens værktøj"
---

Der er mange ting, der skal til for at tilpasse og vedligeholde et XOOPS-websted, som skal ske uden for XOOPS, eller det er nemmere at gøre der.

Dette er en liste over typer værktøjer, som du måske ønsker at have til rådighed, sammen med nogle forslag til specifikke værktøjer, som XOOPS webmastere har fundet nyttige.

## Redaktører

Redaktører er et meget personligt valg, og folk kan blive ret passionerede omkring deres favorit. Vi vil kun præsentere nogle få af de mange muligheder.

Til XOOPS brug skal du bruge en editor til at finjustere nogle konfigurationsmuligheder samt tilpasse et tema til dit websted. Til disse anvendelser kan det være meget nyttigt at have en editor, der kan arbejde med flere filer på samme tid, være i stand til at søge og erstatte på tværs af mange filer og give syntaksfremhævning. Du kan bruge en meget enkel editor uden dikkedarer, men du vil arbejde meget hårdere for at udføre nogle opgaver.

**PhpStorm** fra _JetBrains_ er et IDE (integreret udviklingsmiljø) specielt skræddersyet til PHP webudvikling. _JetBrains_ har været meget hjælpsom med at sponsorere XOOPS, og dets produkter er favoritter for mange udviklere. Det er et kommercielt produkt, og det kan være uoverkommeligt for nogle nye webmastere, men den tid, det kan spare, gør det attraktivt for erfarne udviklere.

**Visual Studio Code** er en gratis multi-platform kildekodeeditor fra Microsoft. Den har understøttelse, enten indbygget i eller gennem udvidelser, til kernewebteknologierne såsom HTML, JavaScript og PHP, hvilket gør den velegnet til XOOPS brug.

**Notepad++** er en gratis, hædret kandidat i denne kategori til Windows, med loyale brugere.

**Meld** er ikke en editor, men den sammenligner tekstfiler, der viser forskelle, og giver mulighed for at flette ændringer selektivt og foretage små redigeringer. Det er meget nyttigt, når man sammenligner konfigurationsfiler, temaskabeloner og selvfølgelig PHP-kode.

| Navn | Link | Licens | Platform |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Kommerciel | Enhver |
| Visual Studio-kode | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Enhver |
| Notesblok++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Vind |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Enhver |

## FTP klient

File Transfer Protocol (FTP,) eller en variation deraf, bruges til at flytte filer fra en computer til en anden. De fleste XOOPS-installationer har brug for en FTP-klient for at flytte filer, der kommer fra XOOPS-distributionen til et værtssystem, hvor webstedet vil blive installeret.

**FileZilla** er en gratis og kraftfuld FTP-klient, der er tilgængelig for de fleste platforme. Konsistensen på tværs af platforme gjorde det til valget for FTP-eksemplerne i denne bog.

**PuTTY** er en gratis SSH-klient, nyttig til Shell-adgang til en server, samt giver mulighed for filoverførsel med SCP

**WinSCP** er en FTP/SFTP/SCP-klient til Windows-systemer.

| Navn | Link | Licens | Platform |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Enhver |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Vind/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Vinduer |

## MySQL/MariaDB

Databasen indeholder alt indholdet på dit websted, de konfigurationer, der tilpasser dit websted, oplysningerne om brugerne af dit websted og mere. Det kan være lettere at beskytte og vedligeholde disse oplysninger med nogle ekstra værktøjer, der specifikt beskæftiger sig med databasen.

**phpMyAdmin** er det mest populære webbaserede værktøj til at arbejde med MySQL-databaser, herunder at lave engangssikkerhedskopier.

**BigDump** er en gave til begrænsede hostingkonti, hvor det hjælper med at gendanne store database backup-dumps, mens timeout og størrelsesbegrænsninger undgås.**srdb**, Search Replace DB for XOOPS er en XOOPS-tilpasning af [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) fra interconnect/it. Det er især nyttigt at ændre URL'er og filsystemreferencer i MySQL-data, når du flytter et websted.

| Navn | Link | Licens | Platform |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Enhver |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Enhver |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Enhver |

## Udviklerstabler

Nogle platforme, såsom Ubuntu, har hele stakken, der skal til for at køre XOOPS indbygget, mens andre har brug for nogle tilføjelser.

**WAMP** og **Uniform Server Zero** er alt-i-en stakke til Windows.

**XAMPP**, en alt-i-en stak fra Apache Friends, er tilgængelig til flere platforme.

**bitnami** tilbyder en bred vifte af forudbyggede applikationsstakke, herunder virtuelle maskine og containerbilleder. Deres tilbud kan være en værdifuld ressource til hurtigt at afprøve applikationer (inklusive XOOPS) eller forskellige webteknologier. De kan være velegnede til produktion såvel som udviklingsbrug.

**Docker** er en applikationscontainerplatform, der bruges til at oprette og køre containere for at implementere brugerdefinerede miljøer. 

**Devilbox** er en let konfigureret Docker-baseret udviklingsstak. Det tilbyder en bred vifte af versioner til alle stakkomponenter og giver udviklere mulighed for at teste i et reproducerbart og delbart miljø. 

| Navn | Link | Licens | Platform |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Flere | Vind |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Flere | Vind |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Flere | Enhver |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Flere | Enhver |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Flere | Enhver |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Enhver |
