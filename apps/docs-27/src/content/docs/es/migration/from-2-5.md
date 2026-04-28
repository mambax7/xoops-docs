---
title: Actualizar de XOOPS 2.5 a 2.7
description: Guía paso a paso para actualizar de forma segura su instalación de XOOPS de 2.5.x a 2.7.x.
---

:::caution[Haga copia de seguridad primero]
Siempre haga copia de seguridad de su base de datos y archivos antes de actualizar. Sin excepciones.
:::

## Qué cambió en 2.7

- **PHP 8.2+ requerido** — PHP 7.x ya no es compatible
- **Dependencias administradas con Composer** — Librerías principales administradas mediante `composer.json`
- **Carga automática PSR-4** — Las clases del módulo pueden usar espacios de nombres
- **XoopsObject mejorado** — Nueva seguridad de tipo en `getVar()`, `obj2Array()` deprecado
- **Administración Bootstrap 5** — Panel de administración reconstruido con Bootstrap 5

## Lista de verificación previa a la actualización

- [ ] PHP 8.2+ disponible en su servidor
- [ ] Copia de seguridad completa de la base de datos (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Copia de seguridad completa de su instalación
- [ ] Lista de módulos instalados y sus versiones
- [ ] Tema personalizado respaldado por separado

## Pasos de actualización

### 1. Ponga el sitio en modo de mantenimiento

```php
// mainfile.php — agregue temporalmente
define('XOOPS_MAINTENANCE', true);
```

### 2. Descargue XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Reemplace los archivos principales

Cargue los nuevos archivos, **excluyendo**:
- `uploads/` — sus archivos cargados
- `xoops_data/` — su configuración
- `modules/` — sus módulos instalados
- `themes/` — sus temas
- `mainfile.php` — su configuración del sitio

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Ejecute el script de actualización

Navegue a `https://yourdomain.com/upgrade/` en su navegador.
El asistente de actualización aplicará las migraciones de la base de datos.

### 5. Actualice los módulos

Los módulos de XOOPS 2.7 deben ser compatibles con PHP 8.2.
Verifique el [Ecosistema de Módulos](/xoops-docs/2.7/module-guide/introduction/) para versiones actualizadas.

En Admin → Módulos, haga clic en **Actualizar** para cada módulo instalado.

### 6. Elimine el modo de mantenimiento y pruebe

Elimine la línea `XOOPS_MAINTENANCE` de `mainfile.php` y
verifique que todas las páginas se carguen correctamente.

## Problemas comunes

**Errores "Clase no encontrada" después de la actualización**
- Ejecute `composer dump-autoload` en la raíz de XOOPS
- Borre el directorio `xoops_data/caches/`

**Módulo roto después de la actualización**
- Verifique los lanzamientos de GitHub del módulo para una versión compatible con 2.7
- El módulo puede necesitar cambios de código para PHP 8.2 (funciones deprecadas, propiedades tipadas)

**CSS del panel de administración roto**
- Borre el caché de su navegador
- Asegúrese de que `xoops_lib/` se reemplazó completamente durante la carga de archivos
