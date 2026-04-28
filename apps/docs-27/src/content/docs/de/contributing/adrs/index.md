---
title: "ADR Index"
description: "Index aller Architecture Decision Records für XOOPS CMS"
---

# Architektur Decision Records Index

> Umfassender Index architektonischer Entscheidungen, die XOOPS CMS geprägt haben.

---

## Was sind ADRs?

Architecture Decision Records (ADRs) dokumentieren bedeutsame architektonische Entscheidungen während der XOOPS-Entwicklung. Sie erfassen Kontext, Entscheidung und Konsequenzen jeder Wahl und bieten wertvollen historischen Kontext für Betreuer und Mitwirkende.

---

## ADR Status-Legend

| Status | Meaning |
|--------|---------|
| **Proposed** | Unter Diskussion, noch nicht akzeptiert |
| **Accepted** | Entscheidung wurde angenommen |
| **Deprecated** | Nicht mehr empfohlen |
| **Superseded** | Ersetzt durch ein anderes ADR |

---

## Aktuelle ADRs

### Grundlegende Entscheidungen

| ADR | Title | Status | Impact |
|-----|-------|--------|--------|
| ADR-001 | Modular Architecture | Accepted | Core |
| ADR-002 | Object-Oriented Database Access | Accepted | Core |
| ADR-003 | Smarty Template Engine | Accepted | Core |

### Geplante ADRs (XOOPS 4.0)

| ADR | Title | Status | Impact |
|-----|-------|--------|--------|
| ADR-004 | Security System Design | Proposed | Security |
| ADR-005 | PSR-15 Middleware | Proposed | Architecture |
| ADR-006 | Dependency Injection Container | Proposed | Architecture |
| ADR-007 | Event System Redesign | Proposed | Architecture |

---

## ADR-Beziehungen

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

## Timeline

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

## Erstellen neuer ADRs

Beim Vorschlag einer neuen architektonischen Entscheidung:

1. Kopieren Sie die ADR-Vorlage
2. Füllen Sie alle Abschnitte aus
3. Reichen Sie als Pull Request ein
4. Diskutieren Sie in GitHub Issues
5. Aktualisieren Sie Status nach Entscheidung

### ADR-Template-Struktur

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

## Verwandte Dokumentation

- Core Concepts
- Contributing Guidelines
- XOOPS 4.0 Roadmap

---

#xoops #adr #architecture #index #decisions
