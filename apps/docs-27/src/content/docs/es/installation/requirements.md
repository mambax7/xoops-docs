---
title: "Requisitos"
---

## Entorno de Software (el Stack)

La mayoría de sitios de producción de XOOPS se ejecutan en un stack _LAMP_ (un sistema **L**inux ejecutando **A**pache, **M**ySQL y **P**HP) pero, hay muchas pilas diferentes posibles.

A menudo es más fácil crear un prototipo de un nuevo sitio en una máquina local. Para este caso, muchos usuarios de XOOPS eligen un stack _WAMP_ (usando **W**indows como el SO,) mientras que otros ejecutan stacks _LAMP_ o _MAMP_ (**M**AC).

### PHP

Cualquier versión de PHP >= 8.2.0 (Se recomienda fuertemente PHP 8.4 o superior)

> **Importante:** XOOPS 2.7.0 requiere **PHP 8.2 o más nuevo**. PHP 7.x y anteriores ya no son soportados. Si estás actualizando un sitio antiguo, confirma que tu host ofrece PHP 8.2+ antes de comenzar.

### MySQL

Servidor MySQL 5.7 o superior (Se recomienda fuertemente Servidor MySQL 8.4 o superior.) MySQL 9.0 también es soportado. MariaDB es un reemplazo compatible hacia atrás, de reemplazo binario directo de MySQL, y también funciona bien con XOOPS.

### Servidor web

Un servidor web que soporte la ejecución de scripts PHP, como Apache, NGINX, LiteSpeed, etc.

### Extensiones PHP Requeridas

El instalador de XOOPS verifica que las siguientes extensiones estén cargadas antes de permitir que la instalación proceda:

* `mysqli` — Controlador de base de datos MySQL
* `session` — Manejo de sesión
* `pcre` — Expresiones regulares compatibles con Perl
* `filter` — Filtrado y validación de entrada
* `fileinfo` — Detección de tipo MIME para cargas

### Configuración PHP Requerida

Además de las extensiones anteriores, el instalador verifica la siguiente configuración de `php.ini`:

* `file_uploads` debe ser **Activo** — sin él, XOOPS no puede aceptar archivos cargados

### Extensiones PHP Recomendadas

El instalador también comprueba estas extensiones. No son estrictamente requeridas, pero XOOPS y la mayoría de módulos dependen de ellas para funcionalidad completa. Habilita tantas como tu host permita:

* `mbstring` — Manejo de cadenas de múltiples bytes
* `intl` — Internacionalización
* `iconv` — Conversión de conjunto de caracteres
* `xml` — Análisis XML
* `zlib` — Compresión
* `gd` — Procesamiento de imágenes
* `exif` — Metadatos de imagen
* `curl` — Cliente HTTP para feeds y llamadas API

## Servicios

### Acceso al Sistema de Archivos (para Acceso del Webmaster)

Necesitarás algún método (FTP, SFTP, etc.) para transferir los archivos de distribución de XOOPS al servidor web.

### Acceso al Sistema de Archivos (para Proceso del Servidor Web)

Para ejecutar XOOPS, se necesita la capacidad de crear, leer y eliminar archivos y directorios. Las siguientes rutas deben ser escribibles por el proceso del servidor web para una instalación normal y para operación normal del día a día:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (escribible durante instalación y actualización)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Base de Datos

XOOPS necesitará crear, modificar y consultar tablas en MySQL. Para esto necesitarás:

* una cuenta de usuario MySQL y contraseña
* una base de datos MySQL en la que ese usuario tenga todos los privilegios (o alternativamente, el usuario puede tener privilegio para crear tal base de datos)

### Email

Para un sitio en vivo, necesitarás una dirección de correo funcional que XOOPS pueda usar para comunicación de usuario, como activaciones de cuenta y restablecimiento de contraseña. Aunque no es estrictamente requerido, se recomienda si es posible usar una dirección de correo que coincida con el dominio en el que se ejecuta tu XOOPS. Eso ayuda a evitar que tus comunicaciones terminen siendo rechazadas o marcadas como spam.

## Herramientas

Puede que necesites algunas herramientas adicionales para configurar y personalizar tu instalación de XOOPS. Estas pueden incluir:

* Software Cliente FTP
* Editor de Texto
* Software de Archivo para trabajar con archivos de lanzamiento de XOOPS (archivos _.zip_ o _.tar.gz_).

Consulta la sección [Herramientas del Oficio](../tools/tools.md) para algunas sugerencias de herramientas adecuadas y stacks de servidor web si es necesario.

## Temas Especiales

Algunas combinaciones de software de sistema específico pueden requerir algunas configuraciones adicionales para trabajar con XOOPS. Si estás usando un entorno SELinux, o actualizando un sitio antiguo con temas personalizados, consulta [Temas Especiales](specialtopics.md) para más información.
