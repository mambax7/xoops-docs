---
title: "Indice ADR"
description: "Indice di tutti i Record di Decisione Architettura per XOOPS CMS"
---

# 📋 Indice dei Record di Decisione Architettura

> Indice completo delle decisioni architettoniche che hanno modellato XOOPS CMS.

---

## Cosa sono i Record ADR?

I Record di Decisione Architettura (ADR) documentano significative decisioni architettoniche prese durante lo sviluppo di XOOPS. Catturano il contesto, la decisione e le conseguenze di ogni scelta, fornendo un contesto storico prezioso per i manutentori e i contributori.

---

## Legenda Stato ADR

| Stato | Significato |
|--------|---------|
| **Proposto** | In discussione, non ancora accettato |
| **Accettato** | La decisione è stata adottata |
| **Deprecato** | Non più consigliato |
| **Sostituito** | Sostituito da un altro ADR |

---

## ADR Attuali

### Decisioni Fondamentali

| ADR | Titolo | Stato | Impatto |
|-----|-------|--------|--------|
| ADR-001 | Architettura Modulare | Accettato | Core |
| ADR-002 | Accesso Database Orientato agli Oggetti | Accettato | Core |
| ADR-003 | Motore Template Smarty | Accettato | Core |

### ADR Pianificati (XOOPS 4.0)

| ADR | Titolo | Stato | Impatto |
|-----|-------|--------|--------|
| ADR-004 | Design Sistema Sicurezza | Proposto | Sicurezza |
| ADR-005 | Middleware PSR-15 | Proposto | Architettura |
| ADR-006 | Contenitore Dependency Injection | Proposto | Architettura |
| ADR-007 | Redesign Sistema Eventi | Proposto | Architettura |

---

## Relazioni ADR

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

## Sequenza Temporale

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

## Creazione di Nuovi ADR

Quando proponi una nuova decisione architetturale:

1. Copia il Modello ADR
2. Compila tutte le sezioni
3. Invia come Pull Request
4. Discussione in GitHub Issues
5. Aggiorna lo stato dopo la decisione

### Struttura Modello ADR

```markdown
# ADR-XXX: Titolo

## Stato
Proposto | Accettato | Deprecato | Sostituito

## Contesto
Quale è il problema che motiva questa decisione?

## Decisione
Quale è il cambiamento che stiamo proponendo?

## Conseguenze
Cosa diventa più facile o più difficile come risultato?

## Alternative Considerate
Quali altre opzioni sono state valutate?
```

---

## 🔗 Documentazione Correlata

- Concetti Core
- Linee Guida Contribuzione
- Roadmap XOOPS 4.0

---

#xoops #adr #architecture #index #decisions
