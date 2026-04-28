---
title: "Solución de Problemas"
---

## Errores de Plantilla Smarty 4

La clase más común de problemas al actualizar de XOOPS 2.5.x a 2.7.0 es la incompatibilidad de plantilla Smarty 4. Si omitiste o no completaste la [Comprobación Previa](preflight.md), podrías ver errores de plantilla en el frontend o en el área de admin después de la actualización.

Para recuperarte:

1. **Vuelve a ejecutar el escáner previa** en `/upgrade/preflight.php`. Aplica cualquier reparación automática que ofrezca, o arregla las plantillas señaladas manualmente.
2. **Borra la caché de plantilla compilada.** Elimina todo excepto `index.html` de `xoops_data/caches/smarty_compile/`. Las plantillas compiladas de Smarty 3 no son compatibles con Smarty 4 y los archivos obsoletos pueden causar errores confusos.
3. **Cambia a un tema enviado temporalmente.** Desde el área de admin, selecciona `xbootstrap5` o `default` como tema activo. Esto confirmará si el problema está limitado a un tema personalizado o es a nivel de sitio.
4. **Valida cualquier tema personalizado y plantillas de módulo** antes de cambiar el tráfico de producción de vuelta. Presta atención particular a las plantillas que usan bloques `{php}`, modificadores deprecados, o sintaxis de delimitador no estándar — estos son los breakages más comunes de Smarty 4.

Consulta también la sección Smarty 4 en [Temas Especiales](../../installation/specialtopics.md).

## Problemas de Permiso

La Actualización de XOOPS puede necesitar escribir en archivos que han sido previamente hechos de solo lectura. Si este es el caso, verás un mensaje como este:

![Error de Hacer Escribible de Actualización de XOOPS](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

La solución es cambiar los permisos. Puedes cambiar permisos usando FTP si no tienes acceso más directo. Aquí hay un ejemplo usando FileZilla:

![Cambiar Permiso de FileZilla](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Salida de Depuración

Puedes habilitar salida de depuración extra en el registrador añadiendo un parámetro de depuración a la URL usada para lanzar la Actualización:

```text
http://example.com/upgrade/?debug=1
```
