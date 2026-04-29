---
title: "ADR Index"
description: "Indeks over alle arkitekturbeslutningsposter for XOOPS CMS"
---

# 📋 Indeks for arkitekturbeslutninger

> Omfattende indeks over arkitektoniske beslutninger, der formede XOOPS CMS.

---

## Hvad er bivirkninger?

Architecture Decision Records (ADR'er) dokumenterer væsentlige arkitektoniske beslutninger truffet under udviklingen af ​​XOOPS. De fanger konteksten, beslutningen og konsekvenserne af hvert valg og giver værdifuld historisk kontekst for vedligeholdere og bidragydere.

---

## ADR Statusforklaring

| Status | Betydning |
|--------|--------|
| **Foreslået** | Under diskussion, endnu ikke accepteret |
| **Accepteret** | Beslutningen er vedtaget |
| **Forældet** | Ikke længere anbefalet |
| **Afløst** | Erstattet af en anden ADR |

---

## Aktuelle ADRs

### Grundlæggende beslutninger

| ADR | Titel | Status | Indvirkning |
|-----|-------|--------|--------|
| ADR-001 | Modulær arkitektur | Accepteret | Kerne |
| ADR-002 | Objektorienteret databaseadgang | Accepteret | Kerne |
| ADR-003 | Smarty skabelonmotor | Accepteret | Kerne |

### Planlagte ADR'er (XOOPS 4.0)

| ADR | Titel | Status | Indvirkning |
|-----|-------|--------|--------|
| ADR-004 | Design af sikkerhedssystemer | Foreslået | Sikkerhed |
| ADR-005 | PSR-15 Middleware | Foreslået | Arkitektur |
| ADR-006 | Dependency Injection Container | Foreslået | Arkitektur |
| ADR-007 | Event System Redesign | Foreslået | Arkitektur |

---

## ADR Relationer

```mermaid
graph TB
    subgraph "Core Architecture"
        A[ADR-001<br>Modular Architecture]
        B[ADR-002<br>Database Abstraction]
        C[ADR-003<br>Template Engine]
    end

    subgraph "Security"
        D[ADR-004<br>Security System]
    end

    subgraph "XOOPS 4.0"
        E[ADR-005<br>Middleware]
        F[ADR-006<br>DI Container]
        G[ADR-007<br>Events]
    end

    A --> B
    A --> C
    A --> D
    B --> F
    C --> E
    D --> E
    F --> G

    style A fill:#9f9,stroke:#333
    style B fill:#9f9,stroke:#333
    style C fill:#9f9,stroke:#333
    style D fill:#ff9,stroke:#333
    style E fill:#ff9,stroke:#333
    style F fill:#ff9,stroke:#333
    style G fill:#ff9,stroke:#333
```

---

## Tidslinje

```mermaid
timeline
    title ADR Timeline
    2001-2003 : ADR-001 Modular Architecture
              : ADR-002 Database Abstraction
              : ADR-003 Template Engine
    2007 : ADR-004 Security System
    2026 : ADR-005 Middleware
         : ADR-006 DI Container
         : ADR-007 Events
```

---

## Oprettelse af nye ADR'er

Når du foreslår en ny arkitektonisk beslutning:

1. Kopier ADR skabelonen
2. Udfyld alle sektioner
3. Send som Pull-anmodning
4. Diskuter i GitHub Issues
5. Opdater status efter beslutning

### ADR skabelonstruktur

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue motivating this decision?

## Decision
What is the change that we're proposing?

## Consequences
What becomes easier or harder as a result?

## Alternatives Considered
What other options were evaluated?
```

---

## 🔗 Relateret dokumentation

- Kernekoncepter
- Bidragende retningslinjer
- XOOPS 4.0 køreplan

---

#xoops #adr #arkitektur #indeks #beslutninger
