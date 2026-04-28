---
title: "Comprobación Previa"
---

XOOPS 2.7.0 actualizó su motor de templating de Smarty 3 a Smarty 4. Smarty 4 es más estricto sobre la sintaxis de plantilla que Smarty 3, y algunos temas personalizados y plantillas de módulos pueden necesitar ser ajustados antes de que funcionen correctamente en XOOPS 2.7.0.

Para ayudar a identificar y reparar estos problemas _antes_ de ejecutar el actualizador principal, XOOPS 2.7.0 viene con un **escáner previa** en el directorio `upgrade/`. Debes ejecutar el escáner previa al menos una vez antes de que el flujo de trabajo de actualización principal te permita continuar.

## Qué Hace el Escáner

El escáner previa recorre tus temas existentes y plantillas de módulos buscando incompatibilidades conocidas con Smarty 4. Puede:

* **Escanear** tus directorios `themes/` y `modules/` para archivos de plantilla `.tpl` y `.html` que podrían necesitar cambios
* **Reportar** problemas agrupados por archivo y por tipo de problema
* **Reparar automáticamente** muchos problemas comunes cuando se lo pidas

No todos los problemas pueden ser reparados automáticamente. Algunas plantillas necesitarán edición manual, especialmente si usan idiomas antiguos de Smarty 3 que no tienen equivalente directo en Smarty 4.

## Ejecutando el Escáner

1. Copia el directorio `upgrade/` de distribución en tu raíz web del sitio (si aún no lo has hecho como parte del paso [Preparaciones para Actualizar](ustep-01.md)).
2. Apunta tu navegador a la URL previa:

   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Inicia sesión con una cuenta de administrador cuando se te solicite.
4. El escáner presenta un formulario con tres controles:
   * **Directorio de plantilla** — déjalo en blanco para escanear tanto `themes/` como `modules/`. Introduce una ruta como `/themes/mytheme/` para restringir el escaneo a un único directorio.
   * **Extensión de plantilla** — déjalo en blanco para escanear tanto archivos `.tpl` como `.html`. Introduce una única extensión para restringir el escaneo.
   * **Intenta corregir automáticamente** — marca esta casilla si quieres que el escáner repare problemas que sabe cómo arreglar. Déjalo desmarcado para un escaneo de solo lectura.
5. Presiona el botón **Ejecutar**. El escáner recorre los directorios seleccionados y reporta cada problema que encuentra.

## Interpretando Resultados

El informe de escaneo lista cada archivo que examinó y cada problema que encontró. Cada entrada de problema te dice:

* Qué archivo contiene el problema
* Qué regla de Smarty 4 infringe
* Si el escáner podría repararlo automáticamente

Si ejecutaste el escaneo con _Intenta corregir automáticamente_ habilitado, el informe también confirmará qué archivos fueron reescritos.

## Arreglando Problemas Manualmente

Para problemas que el escáner no puede reparar automáticamente, abre el archivo de plantilla señalado en un editor e haz los cambios requeridos. Las incompatibilidades comunes de Smarty 4 incluyen:

* Bloques `{php} ... {/php}` (ya no soportado en Smarty 4)
* Modificadores y llamadas de función deprecadas
* Uso de delimitador sensible al espacio en blanco
* Suposiciones de plugin de registro que cambiaron en Smarty 4

Si no te sientes cómodo editando plantillas, el enfoque más seguro es cambiar a un tema enviado (`xbootstrap5`, `default`, `xswatch5`, etc.) y lidiar con el tema personalizado por separado después de que la actualización se complete.

## Volviendo a Ejecutar Hasta Limpio

Después de hacer correcciones — ya sea automáticas o manuales — vuelve a ejecutar el escáner previa. Repite hasta que el escaneo reporte que no hay problemas restantes.

Una vez que el escaneo esté limpio, puedes terminar la sesión previa presionando el botón **Salir del Escáner** en la UI del escáner. Esto marca lo previo como completo y permite que el actualizador principal en `/upgrade/` proceda.

## Continuando a la Actualización

Con lo previo completo, puedes lanzar el actualizador principal en:

```text
http://example.com/upgrade/
```

Consulta [Ejecutar Actualización](ustep-02.md) para los próximos pasos.

## Si Saltas Previa

Se desaconseja fuertemente omitir lo previo, pero si actualizaste sin ejecutarlo y ahora estás viendo errores de plantilla, consulta la sección Errores de Plantilla Smarty 4 de [Solución de Problemas](ustep-03.md). Puedes ejecutar lo previo después de los hechos y limpiar `xoops_data/caches/smarty_compile/` para recuperarte.
