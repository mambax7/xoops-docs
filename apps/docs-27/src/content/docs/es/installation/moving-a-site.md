---
title: "Moviendo un Sitio"
---

Puede ser una técnica muy útil el crear un prototipo de un nuevo sitio XOOPS en un sistema local o un servidor de desarrollo. También puede ser muy prudente probar una actualización de XOOPS en una copia de tu sitio de producción primero, solo en caso de que algo salga mal. Para lograr esto, necesitas poder mover tu sitio XOOPS de un sitio a otro. Aquí está lo que necesitas saber para mover exitosamente tu sitio XOOPS.

El primer paso es establecer tu nuevo entorno de sitio. Los mismos elementos que se cubren en la sección [Preparaciones Avanzadas](../installation/preparations/) aplican aquí también.

En resumen, esos pasos son:

* obtener alojamiento, incluyendo cualquier requisito de nombre de dominio o email
* obtener una cuenta de usuario MySQL y contraseña
* obtener una base de datos MySQL que ese usuario anterior tiene todos los privilegios en

El resto del proceso es bastante similar a una instalación normal, pero:

* en lugar de copiar los archivos de la distribución de XOOPS, los copiarás del sitio existente
* en lugar de ejecutar el instalador, importarás una base de datos ya poblada
* en lugar de introducir respuestas en el instalador, cambiarás las respuestas anteriores en los archivos y la base de datos

## Copiar los Archivos del Sitio Existente

Haz una copia completa de los archivos de tu sitio existente en tu máquina local donde puedas editarlos. Si estás trabajando con un host remoto, puedes usar FTP para copiar los archivos. Necesitas una copia para trabajar incluso si el sitio se ejecuta en tu máquina local, solo haz otra copia de los directorios del sitio en ese caso.

Es importante recordar incluir los directorios _xoops_data_ y _xoops_lib_ incluso si fueron renombrados y/o reubicados.

Para suavizar las cosas, deberías eliminar los archivos de caché y las plantillas compiladas de Smarty de tu copia. Estos archivos serán recreados en tu nuevo entorno, y podrían causar problemas con información antigua incorrecta siendo retenida si no se limpian. Para hacer esto, elimina todos los archivos, excepto _index.html_, en estos tres directorios:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Nota:** Limpiar `smarty_compile` es especialmente importante cuando se mueve un sitio hacia o desde XOOPS 2.7.0. XOOPS 2.7.0 usa Smarty 4, y las plantillas compiladas de Smarty 4 no son intercambiables con las plantillas compiladas de Smarty 3. Dejar archivos compilados obsoletos en su lugar causará errores de plantilla en la primera carga de página en el nuevo sitio.

### `xoops_lib` y Dependencias de Composer

XOOPS 2.7.0 gestiona sus dependencias PHP a través de Composer, dentro de `xoops_lib/`. El directorio `xoops_lib/vendor/` contiene las bibliotecas de terceros que XOOPS necesita en tiempo de ejecución (Smarty 4, PHPMailer, HTMLPurifier, etc.). Cuando mueves un sitio, debes copiar todo el árbol `xoops_lib/` — incluyendo `vendor/` — al nuevo host. No intentes regenerar `vendor/` en el host de destino a menos que seas un desarrollador que ha personalizado `composer.json` y tiene Composer disponible en el destino.

## Configurar el Nuevo Entorno

Los mismos elementos que se cubren en la sección [Preparaciones Avanzadas](../installation/preparations/) aplican aquí también. Asumiremos aquí que tienes el alojamiento que necesitarás para el sitio que estás moviendo.

### Información Clave (mainfile.php y secure.php)

Mover un sitio exitosamente implica cambiar cualquier referencia a nombres de archivo absolutos y rutas, URLs, parámetros de base de datos y credenciales de acceso.

Dos archivos, `mainfile.php` en la raíz web de tu sitio, y `data/secure.php` en tu (renombrado y/o reubicado) directorio _xoops_data_ definen los parámetros básicos de tu sitio, como su URL, dónde se encuentra en el sistema de archivos del host, y cómo se conecta a la base de datos.

Necesitarás saber tanto cuáles son los valores en el sistema antiguo, como cuáles serán en el nuevo sistema.

#### mainfile.php

| Nombre | Valor Antiguo en mainfile.php | Valor Nuevo en mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Abre _mainfile.php_ en tu editor. Cambia los valores para los defines mostrados en la tabla anterior de los valores antiguos, a los valores apropiados para el nuevo sitio.

Mantén notas de los valores antiguos y nuevos, ya que necesitaremos hacer cambios similares en otros lugares en algunos pasos posteriores.

Como ejemplo, si estás moviendo un sitio desde tu PC local a un servicio de alojamiento comercial, tus valores podrían verse así:

| Nombre | Valor Antiguo en mainfile.php | Valor Nuevo en mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

Después de haber cambiado _mainfile.php_, guárdalo.

Es posible que algunos otros archivos puedan contener referencias codificadas de tu URL o incluso rutas. Esto es más probable en temas y menús personalizados, pero con tu editor, puedes buscar en todos los archivos, solo para estar seguro.

En tu editor, haz una búsqueda en los archivos de tu copia, buscando el valor antiguo de XOOPS_URL, y reemplázalo con el nuevo valor.

Haz lo mismo para el valor antiguo de XOOPS_ROOT_PATH, reemplazando todas las ocurrencias con el nuevo valor.

Mantén tus notas, porque tendremos que usarlas de nuevo más tarde mientras movemos la base de datos.

#### data/secure.php

| Nombre | Valor Antiguo en data/secure.php | Valor Nuevo en data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Abre _data/secure.php_ en el (renombrado y/o reubicado) directorio _xoops_data_ en tu editor. Cambia los valores para los defines mostrados en la tabla anterior de los valores antiguos, a los valores apropiados para el nuevo sitio.

#### Otros Archivos

Puede haber otros archivos que requieran atención cuando tu sitio se mueve. Algunos ejemplos comunes son claves API para varios servicios que pueden estar vinculados al dominio, como:

* Google Maps
* Recaptch2
* Botones tipo me gusta
* Compartir enlaces y/o publicidad como Shareaholic o AddThis

Cambiar estos tipos de asociaciones no puede automatizarse fácilmente, ya que las conexiones al dominio antiguo son típicamente parte del registro en el lado del servicio. En algunos casos, esto puede simplemente ser agregar o cambiar el dominio asociado con el servicio.

### Copiar los Archivos al Nuevo Sitio

Copia tus archivos ahora modificados a tu nuevo sitio. Las técnicas son las mismas que se usaron durante la [Instalación](../installation/installation/), es decir, usando FTP.

## Copiar la Base de Datos del Sitio Existente

### Hacer una Copia de Seguridad de la Base de Datos desde el Servidor Antiguo

Para este paso, usar _phpMyAdmin_ es altamente recomendado. Inicia sesión en _phpMyAdmin_ para tu sitio existente, selecciona tu base de datos, y elige _Exportar_.

Los ajustes predeterminados son generalmente finos, así que solo selecciona "Método de exportación" de _Rápido_ y "Formato" de _SQL_.

Usa el botón _Ir_ para descargar la copia de seguridad de la base de datos.

![Exportando una Base de Datos con phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Si tienes tablas en tu base de datos que no son de XOOPS o sus módulos, y NO se supone que se muevan, deberías seleccionar "Método de exportación" de _Personalizado_ y elegir solo las tablas relacionadas con XOOPS en tu base de datos. (Estas comienzan con el "prefijo" que especificaste durante la instalación. Puedes ver el prefijo de tu base de datos en el archivo `xoops_data/data/secure.php`.)

### Restaurar la Base de Datos al Nuevo Servidor

En tu nuevo host, usando tu nueva base de datos, restaura la base de datos usando [herramientas](../tools/tools.md) como la pestaña _Importar_ en _phpMyAdmin_ (o _bigdump_ si es necesario.)

### Actualizar URLs y Rutas en la Base de Datos

Actualiza cualquier enlace http a recursos en tu sitio en tu base de datos. Esto puede ser un esfuerzo enorme, y hay una [herramienta](../tools/tools.md) para hacerlo más fácil.

Interconnect/it tiene un producto llamado Search-Replace-DB que puede ayudar con esto. Viene con conciencia de entornos Wordpress y Drupal incorporada. Tal como es, esta herramienta puede ser muy útil, pero es aún mejor cuando es consciente de tu XOOPS. Puedes encontrar una versión consciente de XOOPS en [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Sigue las instrucciones en el archivo README.md para descargar e instalar temporalmente esta utilidad en tu sitio. Anteriormente, cambiamos el define de XOOPS_URL. Cuando ejecutes esta herramienta, quieres reemplazar la definición original de XOOPS_URL con la nueva definición, es decir reemplazar [http://localhost/xoops](http://localhost/xoops) con [https://example.com](https://example.com)

![Usando Búsqueda y Reemplazo de BD](/xoops-docs/2.7/img/installation/srdb-01.png)

Introduce tus URLs antiguas y nuevas, y elige la opción de ejecución de prueba. Revisa los cambios, y si todo se ve bien, ve por la opción de ejecución en vivo. Este paso capturará elementos de configuración y enlaces dentro de tu contenido que se refieren a tu URL de sitio.

![Revisando Cambios en SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Repite el proceso usando tus valores antiguos y nuevos para XOOPS_ROOT_PATH.

#### Enfoque Alternativo Sin SRDB

Otra forma de lograr este paso sin la herramienta srdb sería volcar tu base de datos, editar el volcado en un editor de texto cambiando las URLs y rutas, y luego recargar la base de datos desde tu volcado editado. Sí, ese proceso es lo suficientemente involucrado y conlleva suficiente riesgo que las personas fueron motivadas a crear herramientas especializadas como Search-Replace-DB.

## Prueba tu Sitio Reubicado

¡En este punto, tu sitio debería estar listo para ejecutarse en su nuevo entorno!

Por supuesto, siempre puede haber problemas. No tengas miedo de publicar cualquier pregunta en los [Foros de xoops.org](https://xoops.org/modules/newbb/index.php).
