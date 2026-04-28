---
title: "Preparaciones para la Actualización"
---

## Apagar el Sitio

Antes de comenzar el proceso de actualización de XOOPS, deberías establecer el elemento "¿Apagar tu sitio?" a _Sí_ en la página Preferencias -> Opciones del Sistema -> Configuración General en el Menú de Administración.

Esto evita que los usuarios se encuentren con un sitio roto durante la actualización. También mantiene la contención de recursos al mínimo para asegurar una actualización más suave.

En lugar de errores y un sitio roto, tus visitantes verán algo como esto:

![Sitio Cerrado en Móvil](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Copia de Seguridad

Es una buena idea usar la sección _Mantenimiento_ de administración de XOOPS para _Limpiar carpeta de caché_ para todos los cachés antes de hacer una copia de seguridad completa de tus archivos de sitio. Con el sitio apagado, usar _Vaciar tabla de sesiones_ también es recomendado para que si se necesita una restauración, las sesiones obsoletas no sean parte de ella.

### Archivos

La copia de seguridad de archivos puede hacerse con FTP, copiando todos los archivos a tu máquina local. Si tienes acceso directo al shell del servidor, puede ser _mucho_ más rápido hacer una copia (o una copia de archivo) allí.

### Base de Datos

Para hacer una copia de seguridad de la base de datos, puedes usar las funciones incorporadas en la sección _Mantenimiento_ de administración de XOOPS. También puedes usar las funciones de _Exportar_ en _phpMyAdmin_, si está disponible. Si tienes acceso al shell, puedes usar el comando _mysql_ para volcar tu base de datos.

Estar versado en hacer copia de seguridad, y _restaurar_ tu base de datos es una habilidad importante de webmaster. Hay muchos recursos en línea que puedes usar para aprender más sobre estas operaciones según sea apropiado para tu instalación, como [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![Exportar phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Copiar Archivos Nuevos al Sitio

Copiar los nuevos archivos a tu sitio es virtualmente idéntico al paso de [Preparaciones](../../installation/preparations/) durante la instalación. Deberías copiar los directorios _xoops_data_ y _xoops_lib_ a dondequiera que fueron reubicados durante la instalación. Luego, copia el resto del contenido del directorio _htdocs_ de la distribución (con algunas excepciones cubiertas en la próxima sección) sobre los archivos y directorios existentes en tu raíz web.

En XOOPS 2.7.0, copiar una nueva distribución sobre un sitio existente **no sobrescribirá archivos de configuración existentes** como `mainfile.php` o `xoops_data/data/secure.php`. Este es un cambio bienvenido de versiones anteriores, pero aún deberías hacer una copia de seguridad completa antes de comenzar.

Copia el directorio _upgrade_ completo de la distribución a tu raíz web, creando un directorio _upgrade_ allí.

## Ejecutar la Comprobación Previa de Smarty 4

Antes de lanzar el flujo de trabajo principal de `/upgrade/`, debes ejecutar el escáner previa enviado en el directorio `upgrade/`. Examina tus temas existentes y plantillas de módulos para problemas de compatibilidad con Smarty 4 y puede reparar automáticamente muchos de ellos.

1. Apunta tu navegador a _tu-url-sitio_/upgrade/preflight.php
2. Inicia sesión con una cuenta de administrador
3. Ejecuta el escaneo y revisa el informe
4. Aplica cualquier reparación automática ofrecida, o arregla las plantillas señaladas manualmente
5. Vuelve a ejecutar el escaneo hasta que esté limpio
6. Solo entonces continúa con la actualización principal

Consulta la página [Comprobación Previa](preflight.md) para un recorrido completo.

### Cosas Que Quizás No Quieras Copiar

No deberías recopiar el directorio _install_ en un sistema XOOPS funcional. Dejar la carpeta de instalación en tu instalación de XOOPS expone tu sistema a posibles problemas de seguridad. El instalador la renombra aleatoriamente, pero deberías eliminarla y asegurarte de que no copies otra.

Hay algunos archivos que quizás hayas editado para personalizar tu sitio, y querrás preservar esos. Aquí hay una lista de personalizaciones comunes.

* _xoops_data/configs/xoopsconfig.php_ si ha sido cambiado desde que el sitio fue instalado
* cualquier directorio en _themes_ si está personalizado para tu sitio. En este caso quizás quieras comparar archivos para identificar actualizaciones útiles.
* cualquier archivo en _class/captcha/_ comenzando con "config" si ha sido cambiado desde que el sitio fue instalado
* cualquier personalización en _class/textsanitizer_
* cualquier personalización en _class/xoopseditor_

Si te das cuenta después de la actualización que algo fue accidentalmente sobrescrito, no te asustes -- por eso comenzaste con una copia de seguridad completa. _(¿Hiciste una copia de seguridad, verdad?)_

## Comprueba mainfile.php (Actualizando desde XOOPS Pre-2.5)

Este paso solo aplica si estás actualizando desde una versión antigua de XOOPS (2.3 o anterior). Si estás actualizando desde XOOPS 2.5.x puedes omitir esta sección.

Las versiones antiguas de XOOPS requerían algunos cambios manuales a ser hechos en `mainfile.php` para habilitar el módulo Protector. En tu raíz web deberías tener un archivo llamado `mainfile.php`. Abre ese archivo en tu editor y busca estas líneas:

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

y

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Elimina estas líneas si las encuentras, y guarda el archivo antes de continuar.
