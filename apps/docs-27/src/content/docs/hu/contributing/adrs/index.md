---
title: "ADR Index"
description: "Az XOOPS CMS összes architektúra-döntési rekordjának indexe"
---
# 📋 Architecture Decision Records Index

> A XOOPS CMS-t formáló építészeti döntések átfogó indexe.

---

## Mik azok az ADR-ek?

Az Architecture Decision Records (ADR-ek) a XOOPS fejlesztése során hozott jelentős építészeti döntéseket dokumentálják. Megragadják az egyes választások kontextusát, döntését és következményeit, értékes történelmi kontextust biztosítva a fenntartók és a közreműködők számára.

---

## ADR Állapotjelmagyarázat

| Állapot | Jelentése |
|--------|----------|
| **Javasolt** | Megbeszélés alatt, még nem fogadták el |
| **Elfogadva** | A határozatot elfogadták |
| **Elavult** | Már nem ajánlott |
| **Felváltva** | Egy másik ADR |

---

## Jelenlegi ADR-ek

### Alapozó határozatok

| ADR | Cím | Állapot | Hatás |
|-----|-------|--------|---------|
| ADR-001 | moduláris architektúra | Elfogadva | Core |
| ADR-002 | Objektum-orientált adatbázis-hozzáférés | Elfogadva | Core |
| ADR-003 | Smarty Template Engine | Elfogadva | Core |

### Tervezett ADR-ek (XOOPS 4.0)

| ADR | Cím | Állapot | Hatás |
|-----|-------|--------|---------|
| ADR-004 | Biztonsági rendszer tervezése | Javasolt | Biztonság |
| ADR-005 | PSR-15 Köztes szoftver | Javasolt | Építészet |
| ADR-006 | Dependency Injection Container | Javasolt | Építészet |
| ADR-007 | Rendezvényrendszer újratervezése | Javasolt | Építészet |

---

## ADR Kapcsolatok

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

## Idővonal

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

## Új ADR létrehozása

Új építészeti döntés meghozatalakor:

1. Másolja ki a ADR sablont
2. Töltse ki az összes részt
3. Küldje el lehívási kérelemként
4. Beszélje meg a GitHub-problémákat
5. Frissítse az állapotot a döntés után

### ADR sablonszerkezet

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

## 🔗 Kapcsolódó dokumentáció

- Alapvető fogalmak
- Hozzájárulási irányelvek
- XOOPS 4.0 ütemterv

---

#xoops #adr #architecture #index #döntések
