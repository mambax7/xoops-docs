---
title: "Directrices de Solicitudes de Cambio"
description: "Directrices para enviar solicitudes de cambio a proyectos XOOPS"
---

Este documento proporciona directrices exhaustivas para enviar solicitudes de cambio a proyectos XOOPS. Seguir estas directrices asegura revisiones de código sin problemas y tiempos de fusión más rápidos.

## Antes de Crear una Solicitud de Cambio

### Paso 1: Verificar Problemas Existentes

```
1. Visitar el repositorio de GitHub
2. Ir a la pestaña de Problemas
3. Buscar problemas relacionados con su cambio
4. Verificar tanto problemas abiertos como cerrados
```

### Paso 2: Hacer Fork y Clonar el Repositorio

```bash
# Hacer fork del repositorio en GitHub
# Hacer clic en botón "Fork" en la página del repositorio

# Clonar su fork
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Agregar remote ascendente
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verificar remotes
git remote -v
# Debe mostrar: origin (su fork) y upstream (oficial)
```

### Paso 3: Crear Rama de Característica

```bash
# Actualizar rama main
git fetch upstream
git checkout main
git merge upstream/main

# Crear rama de característica
# Usar nombres descriptivos: bugfix/issue-number o feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### Paso 4: Realizar Sus Cambios

```bash
# Realizar cambios en sus archivos
# Seguir directrices de estilo de código

# Preparar cambios
git add .

# Hacer commit con mensaje claro
git commit -m "Fix database connection timeout issue"

# Crear múltiples commits para cambios lógicos
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## Estándares de Mensaje de Commit

### Buenos Mensajes de Commit

Usar mensajes claros y descriptivos siguiendo estos patrones:

```
# Formato
<type>: <subject>

<body>

<footer>

# Ejemplo 1: Arreglo de error
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Ejemplo 2: Característica
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

### Categorías de Tipo de Commit

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva característica | `feat: add user dashboard widget` |
| `fix` | Arreglo de error | `fix: resolve cache invalidation bug` |
| `docs` | Documentación | `docs: update API reference` |
| `style` | Estilo de código (sin cambio de lógica) | `style: format imports` |
| `refactor` | Refactorización de código | `refactor: simplify service layer` |
| `perf` | Mejora de rendimiento | `perf: optimize database queries` |
| `test` | Cambios de prueba | `test: add integration tests` |
| `chore` | Cambios de construcción/herramientas | `chore: update dependencies` |

## Descripción de Solicitud de Cambio

### Plantilla de PR

```markdown
## Descripción
Descripción clara de cambios realizados y por qué.

## Tipo de Cambio
- [ ] Arreglo de error
- [ ] Nueva característica
- [ ] Cambio importante
- [ ] Actualización de documentación

## Problemas Relacionados
Closes #123
Related to #456

## Cambios Realizados
- Cambio 1
- Cambio 2
- Cambio 3

## Pruebas
- [ ] Probado localmente
- [ ] Todas las pruebas pasan
- [ ] Se agregaron nuevas pruebas
- [ ] Pasos de prueba manual incluidos

## Lista de Verificación
- [ ] El código sigue directrices de estilo
- [ ] Revisión automática completada
- [ ] Comentarios agregados para lógica compleja
- [ ] Documentación actualizada
- [ ] Sin nuevas advertencias generadas
- [ ] Pruebas agregadas para nueva funcionalidad
- [ ] Todas las pruebas pasando
```

## Requisitos de Calidad de Código

### Estilo de Código

Seguir directrices de Estilo-de-Código:

```php
<?php
// Bien: estilo PSR-12
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

## Requisitos de Prueba

### Pruebas Unitarias

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
vendor/bin/phpunit

# Ejecutar archivo de prueba específico
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Ejecutar con cobertura
vendor/bin/phpunit --coverage-html coverage/
```

## Trabajar con Ramas

### Mantener Rama Actualizada

```bash
# Obtener lo último de upstream
git fetch upstream

# Hacer rebase sobre el main más reciente
git rebase upstream/main

# O fusionar si lo prefiere
git merge upstream/main

# Force push si se hizo rebase (¡advertencia: solo en su rama!)
git push -f origin bugfix/123-fix-database-connection
```

## Crear la Solicitud de Cambio

### Formato de Título de PR

```
[Tipo] Descripción corta (fix/feature/docs)

Ejemplos:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Proceso de Revisión de Código

### Qué Buscan los Revisores

1. **Corrección**
   - ¿El código resuelve el problema indicado?
   - ¿Se manejan casos límite?
   - ¿Es el manejo de errores apropiado?

2. **Calidad**
   - ¿Sigue estándares de codificación?
   - ¿Es mantenible?
   - ¿Está bien probado?

3. **Rendimiento**
   - ¿Alguna regresión de rendimiento?
   - ¿Las consultas están optimizadas?
   - ¿El uso de memoria es razonable?

4. **Seguridad**
   - ¿Validación de entrada?
   - ¿Prevención de inyección SQL?
   - ¿Autenticación/autorización?

### Responder a Retroalimentación

```bash
# Abordar retroalimentación
# Editar archivos basados en comentarios de revisión

# Hacer commit de cambios
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# Enviar cambios
git push origin bugfix/123-fix-database-connection
```

## Problemas Comunes de PR y Soluciones

### Problema 1: PR es Demasiado Grande

**Problema:** Los revisores no pueden revisar PRs masivos de manera efectiva

**Solución:** Dividir en PRs más pequeños
- Primer PR: Cambios principales
- Segundo PR: Pruebas
- Tercer PR: Documentación

### Problema 2: Sin Pruebas Incluidas

**Problema:** Los revisores no pueden verificar funcionalidad

**Solución:** Agregar pruebas exhaustivas antes de enviar

### Problema 3: Conflictos con Main

**Problema:** Su rama está fuera de sincronización con main

**Solución:** Hacer rebase sobre el main más reciente

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Después de Fusionar

### Limpieza

```bash
# Cambiar a main
git checkout main

# Actualizar main
git pull upstream main

# Eliminar rama local
git branch -d bugfix/123-fix-database-connection

# Eliminar rama remota
git push origin --delete bugfix/123-fix-database-connection
```

## Resumen de Mejores Prácticas

### Sí

- Crear mensajes de commit descriptivos
- Hacer PRs enfocados y de propósito único
- Incluir pruebas para nueva funcionalidad
- Actualizar documentación
- Referenciar problemas relacionados
- Mantener descripciones de PR claras
- Responder rápidamente a revisiones

### No

- Incluir cambios no relacionados
- Fusionar main en su rama (usar rebase)
- Hacer force push después de que comience la revisión
- Omitir pruebas
- Enviar trabajo en progreso
- Ignorar retroalimentación de revisión de código

## Documentación Relacionada

- ../Contributing - Descripción general de contribución
- Code-Style - Directrices de estilo de código
- ../../03-Module-Development/Best-Practices/Testing - Mejores prácticas de prueba
- ../Architecture-Decisions/ADR-Index - Directrices arquitectónicas

## Recursos

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organization](https://github.com/XOOPS)

---

**Última Actualización:** 2026-01-31
**Se Aplica A:** Todos los proyectos XOOPS
**Repositorio:** https://github.com/XOOPS/XOOPS
