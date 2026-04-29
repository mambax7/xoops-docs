---
title: "ADR Kazalo"
description: "Kazalo vseh zapisov odločitve o arhitekturi za XOOPS CMS"
---
# 📋 Indeks zapisov arhitekturnih odločitev

> Celovit indeks arhitekturnih odločitev, ki so oblikovale XOOPS CMS.

---

## Kaj so neželeni učinki?

Zapisi o arhitekturnih odločitvah (ADR) dokumentirajo pomembne arhitekturne odločitve, sprejete med razvojem XOOPS. Zajamejo kontekst, odločitev in posledice vsake izbire ter zagotavljajo dragocen zgodovinski kontekst za vzdrževalce in sodelavce.

---

## ADR Legenda stanja

| Stanje | Pomen |
|--------|---------|
| **Predlagano** | V razpravi, še ni sprejet |
| **Sprejeto** | Sklep je bil sprejet |
| **Zastarelo** | Ni več priporočljivo |
| **Nadomeščeno** | Zamenjana z drugo ADR |

---

## Trenutni neželeni učinki

### Temeljne odločitve

| ADR | Naslov | Stanje | Vpliv |
|-----|-------|--------|--------|
| ADR-001 | Modularna arhitektura | Sprejeto | Jedro |
| ADR-002 | Objektno usmerjen dostop do baze podatkov | Sprejeto | Jedro |
| ADR-003 | Smarty Template Engine | Sprejeto | Jedro |

### Načrtovani neželeni učinki (XOOPS 4.0)

| ADR | Naslov | Stanje | Vpliv |
|-----|-------|--------|--------|
| ADR-004 | Oblikovanje varnostnega sistema | Predlagano | Varnost |
| ADR-005 | PSR-15 Vmesna programska oprema | Predlagano | Arhitektura |
| ADR-006 | Vsebnik za vstavljanje odvisnosti | Predlagano | Arhitektura |
| ADR-007 | Prenova sistema dogodkov | Predlagano | Arhitektura |---

## ADR Odnosi
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

## Časovnica
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

## Ustvarjanje novih neželenih učinkov

Pri predlaganju nove arhitekturne odločitve:

1. Kopirajte predlogo ADR
2. Izpolnite vse razdelke
3. Predložite kot zahtevo za vlečenje
4. Razpravljajte v GitHub Issues
5. Posodobite status po odločitvi

### ADR Struktura predloge
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

## 🔗 Povezana dokumentacija

- Temeljni koncepti
- Smernice za prispevanje
- XOOPS 4.0 Načrt

---

#XOOPS #adr #architecture #index #odločitve