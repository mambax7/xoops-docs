---
title: "Novedades en XOOPS 2.7.0"
---

XOOPS 2.7.0 es una actualización significativa respecto a la serie 2.5.x. Antes de instalar o actualizar, revise los cambios en esta página para saber qué esperar. La lista a continuación se enfoca en elementos que afectan la instalación y administración del sitio — para una lista completa de cambios, consulte las notas de versión que se envían con la distribución.

## PHP 8.2 es el nuevo mínimo

XOOPS 2.7.0 requiere **PHP 8.2 o más reciente**. PHP 7.x y versiones anteriores ya no se soportan. Se recomienda fuertemente PHP 8.4 o superior.

**Acción:** Confirme que su proveedor de alojamiento ofrece PHP 8.2+ antes de comenzar. Vea [Requisitos](installation/requirements.md).

## MySQL 5.7 es el nuevo mínimo

El nuevo mínimo es **MySQL 5.7** (o una MariaDB compatible). Se recomienda fuertemente MySQL 8.4 o superior. MySQL 9.0 también se soporta.

Las antiguas advertencias sobre problemas de compatibilidad entre PHP/MySQL 8 ya no aplican, porque las versiones de PHP afectadas ya no se soportan en XOOPS.

## Smarty 4 reemplaza a Smarty 3

Este es el cambio más importante para sitios existentes. XOOPS 2.7.0 utiliza **Smarty 4** como su motor de plantillas. Smarty 4 es más estricto con la sintaxis de plantillas que Smarty 3, y algunas plantillas personalizadas de temas y módulos pueden necesitar ajustes antes de renderizarse correctamente.

Para ayudarlo a identificar y reparar estos problemas, XOOPS 2.7.0 incluye un **escáner preflight** en el directorio `upgrade/` que examina sus plantillas existentes para detectar incompatibilidades conocidas de Smarty 4 y puede reparar muchas de ellas automáticamente.

**Acción:** Si está actualizando desde 2.5.x y tiene temas personalizados o módulos antiguos, ejecute la [Verificación Preflight](upgrading/upgrade/preflight.md) _antes_ de ejecutar el actualizador principal.

## Dependencias gestionadas por Composer

XOOPS 2.7.0 utiliza **Composer** para gestionar sus dependencias PHP. Estas se encuentran en `xoops_lib/vendor/`. Bibliotecas de terceros que anteriormente se incluían en el núcleo o en módulos — PHPMailer, HTMLPurifier, Smarty y otras — ahora se suministran a través de Composer.

**Acción:** La mayoría de los operadores de sitios no necesitan hacer nada — los tarballs de versión se envían con `vendor/` ya poblado. Si está moviendo o actualizando un sitio, copie todo el árbol `xoops_lib/`, incluyendo `vendor/`. Los desarrolladores que clonan el repositorio git deben ejecutar `composer install` dentro de `htdocs/xoops_lib/`. Vea [Notas para Desarrolladores](notes-for-developers/developers.md).

## Nuevas preferencias de cookies de sesión endurecidas

Dos nuevas preferencias se agregan durante la actualización:

* **`session_cookie_samesite`** — controla el atributo SameSite en cookies de sesión (`Lax`, `Strict`, o `None`).
* **`session_cookie_secure`** — cuando se habilita, las cookies de sesión solo se envían por HTTPS.

**Acción:** Después de actualizar, revise estos bajo Opciones del Sistema → Preferencias → Configuración General. Vea [Después de la Actualización](upgrading/upgrade/ustep-04.md).

## Nueva tabla `tokens`

XOOPS 2.7.0 agrega una tabla de base de datos `tokens` para almacenamiento genérico de tokens con ámbito. El actualizador crea esta tabla automáticamente como parte de la actualización 2.5.11 → 2.7.0.

## Almacenamiento de contraseña modernizado

La columna `bannerclient.passwd` se ha ampliado a `VARCHAR(255)` para que pueda contener hashes de contraseñas modernas (bcrypt, argon2). El actualizador amplía la columna automáticamente.

## Alineación actualizada de temas y módulos

XOOPS 2.7.0 incluye temas de interfaz actualizado:

* `default`, `xbootstrap` (heredado), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Un nuevo tema de administración **Moderno** se incluye junto con el tema Transición existente.

Un nuevo módulo **DebugBar** basado en Symfony VarDumper se incluye como uno de los módulos instalables opcionales. Es útil para desarrollo y staging, pero típicamente no se instala en sitios de producción públicos.

Vea [Seleccionar Tema](installation/installation/step-12.md) e [Instalación de Módulos](installation/installation/step-13.md).

## Copiar una nueva versión ya no sobrescribe la configuración

Anteriormente, copiar una nueva distribución de XOOPS sobre un sitio existente requería cuidado para evitar sobrescribir `mainfile.php` y otros archivos de configuración. En 2.7.0, el proceso de copia deja los archivos de configuración existentes intactos, lo que hace que las actualizaciones sean notablemente más seguras.

Aún debe hacer una copia de seguridad completa antes de cualquier actualización.

## Capacidad de sobrecarga de plantillas en temas de administración del sistema

Los temas de administración en XOOPS 2.7.0 ahora pueden anular plantillas individuales de administración del sistema, haciendo más fácil personalizar la interfaz de administración sin bifurcar todo el módulo del sistema.

## Lo que no ha cambiado

Para tranquilidad suya, estas partes de XOOPS funcionan de la misma manera en 2.7.0 que en 2.5.x:

* El orden y flujo general de las páginas del instalador
* La división de configuración `mainfile.php` más `xoops_data/data/secure.php`
* La práctica recomendada de reubicar `xoops_data` y `xoops_lib` fuera de la raíz web
* El modelo de instalación de módulos y formato de manifiesto `xoops_version.php`
* El flujo de trabajo de movimiento de sitio (copia de seguridad, editar `mainfile.php`/`secure.php`, usar SRDB o similar)

## Próximos pasos

* ¿Comenzando desde cero? Continúe a [Requisitos](installation/requirements.md).
* ¿Actualizando desde 2.5.x? Comience con [Actualización](upgrading/upgrade/README.md), luego ejecute la [Verificación Preflight](upgrading/upgrade/preflight.md).
