---
title: "Databaseconfiguratie"
---
Deze pagina verzamelt de informatie over de database die XOOPS zal gebruiken.

Nadat u de gevraagde informatie heeft ingevoerd en eventuele problemen heeft verholpen, selecteert u de knop "Doorgaan" om door te gaan.

![XOOPS Installatiedatabaseconfiguratie](/xoops-docs/2.7/img/installation/installer-06.png)

## Gegevens verzameld in deze stap

### Database

#### Databasenaam

De naam van de database op de host die XOOPS moet gebruiken. De databasegebruiker die in de vorige stap is ingevoerd, moet alle rechten op deze database hebben. Het installatieprogramma zal proberen deze database te maken als deze niet bestaat.

#### Tabelvoorvoegsel

Dit voorvoegsel wordt toegevoegd aan de namen van alle nieuwe tabellen die door XOOPS zijn gemaakt. Dit helpt naamconflicten te voorkomen als de database wordt gedeeld met andere applicaties. Een uniek voorvoegsel maakt het ook moeilijker om tabelnamen te raden, wat veiligheidsvoordelen heeft. Als u het niet zeker weet, kunt u gewoon de standaardwaarde behouden

#### Databasetekenset

Het installatieprogramma gebruikt standaard `utf8mb4`, dat het volledige Unicode-bereik ondersteunt, inclusief emoji en aanvullende tekens. U kunt hier een andere tekenset selecteren, maar `utf8mb4` wordt aanbevolen voor vrijwel alle talen en landinstellingen en moet ongewijzigd blijven, tenzij u een specifieke reden hebt om deze te wijzigen.

#### Databasesortering

Het sorteerveld wordt standaard leeg gelaten. Als dit veld leeg is, past MySQL de standaardsortering toe voor de tekenset die hierboven is geselecteerd (voor `utf8mb4` is dit doorgaans `utf8mb4_general_ci` of `utf8mb4_0900_ai_ci`, afhankelijk van de MySQL-versie). Als u een specifieke sortering nodig heeft, bijvoorbeeld om te matchen met een bestaande database, selecteert u deze hier. Anders is het de aanbevolen keuze om het leeg te laten.