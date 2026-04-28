---
title: "Índice de ADR"
description: "Índice de todos los Registros de Decisión Arquitectónica para XOOPS CMS"
---

# 📋 Índice de Registros de Decisión Arquitectónica

> Índice completo de decisiones arquitectónicas que dieron forma a XOOPS CMS.

---

## ¿Qué son los ADR?

Los Registros de Decisión Arquitectónica (ADR, por sus siglas en inglés) documentan decisiones arquitectónicas significativas tomadas durante el desarrollo de XOOPS. Capturan el contexto, la decisión y las consecuencias de cada elección, proporcionando un contexto histórico valioso para los mantenedores y colaboradores.

---

## Leyenda de Estado de ADR

| Estado | Significado |
|--------|---------|
| **Propuesto** | Bajo discusión, no aceptado aún |
| **Aceptado** | La decisión ha sido adoptada |
| **Deprecado** | Ya no se recomienda |
| **Superado** | Reemplazado por otro ADR |

---

## ADR Actuales

### Decisiones Fundamentales

| ADR | Título | Estado | Impacto |
|-----|-------|--------|--------|
| ADR-001 | Arquitectura Modular | Aceptado | Core |
| ADR-002 | Acceso a Base de Datos Orientado a Objetos | Aceptado | Core |
| ADR-003 | Motor de Plantillas Smarty | Aceptado | Core |

### ADR Planificados (XOOPS 4.0)

| ADR | Título | Estado | Impacto |
|-----|-------|--------|--------|
| ADR-004 | Diseño del Sistema de Seguridad | Propuesto | Seguridad |
| ADR-005 | Middleware PSR-15 | Propuesto | Arquitectura |
| ADR-006 | Contenedor de Inyección de Dependencias | Propuesto | Arquitectura |
| ADR-007 | Rediseño del Sistema de Eventos | Propuesto | Arquitectura |

---

## Relaciones de ADR

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

## Línea de Tiempo

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

## Creación de Nuevos ADR

Cuando se propone una nueva decisión arquitectónica:

1. Copie la Plantilla de ADR
2. Complete todas las secciones
3. Envíe como Pull Request
4. Discuta en GitHub Issues
5. Actualice el estado después de la decisión

### Estructura de Plantilla de ADR

```markdown
# ADR-XXX: Título

## Estado
Propuesto | Aceptado | Deprecado | Superado

## Contexto
¿Cuál es el problema que motiva esta decisión?

## Decisión
¿Cuál es el cambio que estamos proponiendo?

## Consecuencias
¿Qué se vuelve más fácil o más difícil como resultado?

## Alternativas Consideradas
¿Qué otras opciones fueron evaluadas?
```

---

## 🔗 Documentación Relacionada

- Conceptos Principales
- Directrices de Contribución
- Mapa de Ruta XOOPS 4.0

---

#xoops #adr #architecture #index #decisions
