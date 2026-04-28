---
title: "Directrices de Contribución"
description: "Cómo contribuir al desarrollo de CMS XOOPS, estándares de codificación y directrices de la comunidad"
---

# 🤝 Contribuir a XOOPS

> Únase a la comunidad XOOPS y ayude a hacerla el mejor CMS del mundo.

---

## 📋 Resumen

XOOPS es un proyecto de código abierto que prospera con contribuciones de la comunidad. Si está arreglando errores, agregando características, mejorando documentación o ayudando a otros, sus contribuciones son valiosas.

---

## 🗂️ Contenidos de la Sección

### Directrices
- Código de Conducta
- Flujo de Contribución
- Directrices de Solicitud de Cambio
- Reporte de Problemas

### Estilo de Código
- Estándares de Codificación PHP
- Estándares JavaScript
- Directrices CSS
- Estándares de Plantillas Smarty

### Decisiones de Arquitectura
- Índice de ADR
- Plantilla de ADR
- ADR-001: Arquitectura Modular
- ADR-002: Abstracción de Base de Datos

---

## 🚀 Primeros Pasos

### 1. Configurar Entorno de Desarrollo

```bash
# Hacer fork del repositorio en GitHub
# Luego clonar su fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Agregar remote ascendente
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Instalar dependencias
composer install
```

### 2. Crear Rama de Característica

```bash
# Sincronizar con upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. Realizar Cambios

Seguir los estándares de codificación y escribir pruebas para nuevas características.

### 4. Enviar Solicitud de Cambio

```bash
# Hacer commit de cambios
git add .
git commit -m "Add: Brief description of changes"

# Enviar a su fork
git push origin feature/my-feature
```

Luego crear una Solicitud de Cambio en GitHub.

---

## 📝 Estándares de Codificación

### Estándares PHP

XOOPS sigue estándares de codificación PSR-1, PSR-4 y PSR-12.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * Class Item
 *
 * Represents an item in the module
 */
class Item extends XoopsObject
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Get formatted title
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### Convenciones Clave

| Regla | Ejemplo |
|------|---------|
| Nombres de clase | `PascalCase` |
| Nombres de método | `camelCase` |
| Constantes | `UPPER_SNAKE_CASE` |
| Variables | `$camelCase` |
| Archivos | `ClassName.php` |
| Indentación | 4 espacios |
| Longitud de línea | Máximo 120 caracteres |

### Plantillas Smarty

```smarty
{* Archivo: templates/mymodule_index.tpl *}
{* Descripción: Plantilla de página de índice *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## 🔀 Flujo de Trabajo Git

### Nombres de Rama

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Característica | `feature/description` | `feature/add-user-export` |
| Arreglo | `fix/description` | `fix/login-validation` |
| Arreglo urgente | `hotfix/description` | `hotfix/security-patch` |
| Versión | `release/version` | `release/2.7.0` |

### Mensajes de Commit

Seguir commits convencionales:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipos:**
- `feat`: Nueva característica
- `fix`: Arreglo de error
- `docs`: Documentación
- `style`: Estilo de código (sin cambio de lógica)
- `refactor`: Refactorización de código
- `test`: Agregar pruebas
- `chore`: Mantenimiento

**Ejemplos:**
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
- Add QR code generation for authenticator apps
- Store encrypted secrets in user profile
- Add backup codes feature

Closes #123
```

```
fix(forms): resolve XSS vulnerability in text input

Properly escape user input in XoopsFormText render method.

Security: CVE-2024-XXXX
```

---

## 🧪 Pruebas

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
./vendor/bin/phpunit

# Ejecutar suite de prueba específica
./vendor/bin/phpunit --testsuite unit

# Ejecutar con cobertura
./vendor/bin/phpunit --coverage-html coverage/
```

### Escribir Pruebas

```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```

---

## 📋 Lista de Verificación de Solicitud de Cambio

Antes de enviar un PR, asegúrese de:

- [ ] El código sigue estándares de codificación XOOPS
- [ ] Todas las pruebas pasan
- [ ] Nuevas características tienen pruebas
- [ ] Documentación actualizada si es necesario
- [ ] Sin conflictos de fusión con rama main
- [ ] Los mensajes de commit son descriptivos
- [ ] La descripción de PR explica cambios
- [ ] Los problemas relacionados están vinculados

---

## 🏗️ Registros de Decisiones de Arquitectura

Los ADRs documentan decisiones arquitectónicas significativas.

### Plantilla de ADR

```markdown
# ADR-XXX: Título

## Estado
Proposed | Accepted | Deprecated | Superseded

## Contexto
¿Cuál es el problema que estamos abordando?

## Decisión
¿Cuál es el cambio que se propone?

## Consecuencias
¿Cuáles son los efectos positivos y negativos?

## Alternativas Consideradas
¿Qué otras opciones se evaluaron?
```

### ADRs Actuales

| ADR | Título | Estado |
|-----|--------|--------|
| ADR-001 | Arquitectura Modular | Aceptado |
| ADR-002 | Acceso a Base de Datos Orientado a Objetos | Aceptado |
| ADR-003 | Motor de Plantillas Smarty | Aceptado |
| ADR-004 | Diseño del Sistema de Seguridad | Aceptado |
| ADR-005 | Middleware PSR-15 (4.0.x) | Propuesto |

---

## 🎖️ Reconocimiento

Los colaboradores son reconocidos a través de:

- **Lista de Colaboradores** - Listado en repositorio
- **Notas de Versión** - Créditos en versiones
- **Salón de la Fama** - Colaboradores destacados
- **Certificación de Módulo** - Insignia de calidad para módulos

---

## 🔗 Documentación Relacionada

- Hoja de Ruta de XOOPS 4.0
- Conceptos Principales
- Desarrollo de Módulos

---

## 📚 Recursos

- [Repositorio de GitHub](https://github.com/XOOPS/XoopsCore27)
- [Rastreador de Problemas](https://github.com/XOOPS/XoopsCore27/issues)
- [Foros de XOOPS](https://xoops.org/modules/newbb/)
- [Comunidad Discord](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
