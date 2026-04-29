---
title: "ADR-index"
description: "Index van alle architectuurbeslissingsrecords voor XOOPS CMS"
---
# 📋 Index van architectuurbeslissingsrecords

> Uitgebreide index van architectonische beslissingen die vorm hebben gegeven aan XOOPS CMS.

---

## Wat zijn bijwerkingen?

Architecture Decision Records (ADR's) documenteren belangrijke architecturale beslissingen die zijn genomen tijdens de ontwikkeling van XOOPS. Ze leggen de context, de beslissing en de gevolgen van elke keuze vast en bieden waardevolle historische context voor beheerders en bijdragers.

---

## ADR Statuslegenda

| Staat | Betekenis |
|--------|---------|
| **Voorgesteld** | In discussie, nog niet geaccepteerd |
| **Geaccepteerd** | Besluit is aangenomen |
| **Verouderd** | Niet langer aanbevolen |
| **Vervangen** | Vervangen door een andere ADR |

---

## Huidige bijwerkingen

### Fundamentele beslissingen

| ADR | Titel | Staat | Gevolgen |
|-----|-------|--------|--------|
| ADR-001 | Modulaire architectuur | Geaccepteerd | Kern |
| ADR-002 | Objectgeoriënteerde databasetoegang | Geaccepteerd | Kern |
| ADR-003 | Smarty-sjabloonengine | Geaccepteerd | Kern |

### Geplande bijwerkingen (XOOPS 4.0)

| ADR | Titel | Staat | Gevolgen |
|-----|-------|--------|--------|
| ADR-004 | Ontwerp van beveiligingssysteem | Voorgesteld | Beveiliging |
| ADR-005 | PSR-15 Middleware | Voorgesteld | Architectuur |
| ADR-006 | Afhankelijkheid injectiecontainer | Voorgesteld | Architectuur |
| ADR-007 | Herontwerp van evenementensysteem | Voorgesteld | Architectuur |

---

## ADR-relaties

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

## Tijdlijn

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

## Nieuwe ADR's aanmaken

Bij het voorstellen van een nieuw architectonisch besluit:

1. Kopieer de ADR-sjabloon
2. Vul alle secties in
3. Indienen als Pull Request
4. Bespreek problemen in GitHub
5. Update status na beslissing

### ADR-sjabloonstructuur

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

## 🔗 Gerelateerde documentatie

- Kernconcepten
- Richtlijnen voor bijdragen
- XOOPS 4.0-routekaart

---

#xoops #adr #architectuur #index #decisions