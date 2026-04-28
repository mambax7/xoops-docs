---
title: "Notas para Desarrolladores"
---

Aunque la instalación real de XOOPS para uso en desarrollo es similar a la instalación normal ya descrita, hay diferencias clave al construir un sistema listo para desarrollador.

Una gran diferencia en una instalación de desarrollador es que en lugar de solo enfocarse en el contenido del directorio _htdocs_, una instalación de desarrollador mantiene todos los archivos y los mantiene bajo control de versión de código utilizando git.

Otra diferencia es que los directorios _xoops_data_ y _xoops_lib_ generalmente pueden permanecer en su lugar sin cambiar de nombre, siempre que su sistema de desarrollo no sea directamente accesible en Internet abierto (es decir, en una red privada, como detrás de un enrutador).

La mayoría de los desarrolladores trabajan en un sistema _localhost_, que tiene el código fuente, una pila de servidor web y las herramientas necesarias para trabajar con el código y la base de datos.

Puede encontrar más información en el capítulo [Herramientas del Oficio](../tools/tools.md).

## Git y Hosts Virtuales

La mayoría de los desarrolladores desean poder mantenerse actualizados con las fuentes actuales y contribuir cambios de vuelta al repositorio [XOOPS/XoopsCore27 en GitHub](https://github.com/XOOPS/XoopsCore27). Esto significa que en lugar de descargar un archivo de versión, querrá [hacer un fork](https://help.github.com/articles/fork-a-repo/) de una copia de XOOPS y usar **git** para [clonar](https://help.github.com/categories/bootcamp/) ese repositorio en su caja de desarrollo.

Dado que el repositorio tiene una estructura específica, en lugar de _copiar_ archivos del directorio _htdocs_ a su servidor web, es mejor apuntar su servidor web a la carpeta htdocs dentro de su repositorio clonado localmente. Para lograr esto, generalmente creamos un nuevo _Host Virtual_, o _vhost_, que apunte a nuestro código fuente controlado por git.

En un entorno [WAMP](http://www.wampserver.com/), la página predeterminada [localhost](http://localhost/) tiene en la sección _Herramientas_ un enlace a _Agregar un Host Virtual_ que lleva aquí:

![WAMP Agregar Host Virtual](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Usando esto, puede configurar una entrada de VirtualHost que irá directamente a su repositorio (todavía) controlado por git.

Aquí hay una entrada de ejemplo en `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

También podría necesitar agregar una entrada en `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Ahora, puede instalar en `http://xoops.localhost/` para pruebas, mientras mantiene su repositorio intacto, y manteniendo el servidor web dentro del directorio htdocs con una URL simple. Además, puede actualizar su copia local de XOOPS al master más reciente en cualquier momento sin tener que reinstalar o copiar archivos. Y, puede hacer mejoras y arreglos al código para contribuir de vuelta a XOOPS a través de GitHub.

## Dependencias de Composer

XOOPS 2.7.0 utiliza [Composer](https://getcomposer.org/) para gestionar sus dependencias de PHP. El árbol de dependencias vive en `htdocs/xoops_lib/` dentro del repositorio de fuentes:

* `composer.dist.json` es la lista maestra de dependencias enviadas con la versión.
* `composer.json` es la copia local, que puede personalizar para su entorno de desarrollo si es necesario.
* `composer.lock` fija versiones exactas para que las instalaciones sean reproducibles.
* `vendor/` contiene las librerías instaladas (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom, y otros).

Para un clon fresco de git de XOOPS 2.7.0, comenzando desde la raíz del repositorio, ejecute:

```text
cd htdocs/xoops_lib
composer install
```

Tenga en cuenta que no hay `composer.json` en la raíz del repositorio — el proyecto vive bajo `htdocs/xoops_lib/`, por lo que debe `cd` a ese directorio antes de ejecutar Composer.

Los tarballs de versión se envían con `vendor/` pre-poblado, pero los clones de git podrían no tenerlo. Mantenga `vendor/` intacto en instalaciones de desarrollo — XOOPS cargará sus dependencias desde allí en tiempo de ejecución.

La librería [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) se envía como una dependencia de Composer en 2.7.0, por lo que puede usar `Xmf\Request`, `Xmf\Database\TableLoad`, y clases relacionadas en su código de módulo sin ninguna instalación adicional.

## Módulo DebugBar

XOOPS 2.7.0 envía un módulo **DebugBar** basado en Symfony VarDumper. Agrega una barra de herramientas de depuración a las páginas renderizadas que expone información de solicitud, base de datos y plantilla. Instálelo desde el área de administración de Módulos en sitios de desarrollo y pruebas. No lo dejes instalado en un sitio de producción que enfrenta al público a menos que sepas que quieres hacerlo.
