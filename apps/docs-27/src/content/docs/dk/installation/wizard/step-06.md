---
title: "Databasekonfiguration"
---

Denne side indsamler oplysninger om databasen, som XOOPS vil bruge.

Når du har indtastet de ønskede oplysninger og rettet eventuelle problemer, skal du vælge knappen "Fortsæt" for at fortsætte.

![XOOPS Installationsdatabasekonfiguration](/xoops-docs/2.7/img/installation/installer-06.png)

## Data indsamlet i dette trin

### Database

#### Databasenavn

Navnet på databasen på værten, som XOOPS skal bruge. Den databasebruger, der blev indtastet i det foregående trin, skal have alle privilegier på denne database. Installationsprogrammet vil forsøge at oprette denne database, hvis den ikke findes.

#### Tabelpræfiks

Dette præfiks vil blive tilføjet til navnene på alle nye tabeller oprettet af XOOPS. Dette hjælper med at undgå navnekonflikter, hvis databasen deles med andre programmer. Et unikt præfiks gør det også sværere at gætte tabelnavne, hvilket har sikkerhedsmæssige fordele. Hvis du er usikker, skal du bare beholde standarden

#### Database tegnsæt

Installationsprogrammet er som standard `utf8mb4`, som understøtter hele Unicode-området inklusive emoji og supplerende tegn. Du kan vælge et andet tegnsæt her, men `utf8mb4` anbefales til stort set alle sprog og lokaliteter og bør efterlades som det er, medmindre du har en specifik grund til at ændre det.

#### Databasesortering

Sorteringsfeltet efterlades som standard tomt. Når tom, anvender MySQL standardsorteringen for det tegnsæt, der er valgt ovenfor (for `utf8mb4` er dette typisk `utf8mb4_general_ci` eller `utf8mb4_0900_ai_ci`, afhængigt af MySQL-versionen). Hvis du har brug for en specifik sortering - for eksempel for at matche en eksisterende database - vælg den her. Ellers er det anbefalede valg at lade det være tomt.
