---
title: "Herramientas del Oficio"
---

Hay muchas cosas que se necesitan para personalizar y mantener un sitio web de XOOPS que deben suceder fuera de XOOPS, o se hacen más fácilmente allí.

Esta es una lista de tipos de herramientas que podría desear tener disponibles, junto con algunas sugerencias para herramientas específicas que los webmasters de XOOPS han encontrado útiles.

## Editores

Los editores son una opción muy personal, y la gente puede volverse bastante apasionada por su favorita. Presentaremos solo algunas de las muchas posibilidades.

Para usar XOOPS, necesitará un editor para ajustar algunas opciones de configuración, así como personalizar un tema para su sitio. Para estos usos, puede ser muy útil tener un editor que pueda trabajar con varios archivos al mismo tiempo, poder buscar y reemplazar en muchos archivos, y proporcionar resaltado de sintaxis. Puede usar un editor muy simple sin características, pero trabajará mucho más para lograr algunas tareas.

**PhpStorm** de _JetBrains_ es un IDE (entorno de desarrollo integrado) diseñado específicamente para el desarrollo web PHP. _JetBrains_ ha sido muy útil patrocinando a XOOPS, y sus productos son favoritos para muchos desarrolladores. Es un producto comercial, y podría ser prohibitivo de costos para algunos nuevos webmasters, pero el tiempo que puede ahorrar lo hace atractivo para los desarrolladores experimentados.

**Visual Studio Code** es un editor de código fuente gratuito y multiplataforma de Microsoft. Tiene soporte, ya sea incorporado o a través de extensiones, para las tecnologías web principales como HTML, JavaScript y PHP, lo que lo convierte en una buena opción para el uso de XOOPS.

**Notepad++** es un competidor gratuito y experimentado en esta categoría para Windows, con usuarios leales.

**Meld** no es un editor, pero compara archivos de texto mostrando diferencias, y permite fusionar cambios selectivamente y realizar ediciones pequeñas. Es muy útil cuando se comparan archivos de configuración, plantillas de tema y, por supuesto, código PHP.

| Nombre | Enlace | Licencia | Plataforma |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Comercial | Cualquiera |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Cualquiera |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Cualquiera |

## Cliente FTP

El Protocolo de Transferencia de Archivos (FTP) o una variación del mismo, se utiliza para mover archivos de una computadora a otra. La mayoría de las instalaciones de XOOPS necesitarán un cliente FTP para mover archivos que provengan de la distribución de XOOPS a un sistema host donde se implementará el sitio.

**FileZilla** es un cliente FTP gratuito y poderoso que está disponible para la mayoría de plataformas. La coherencia multiplataforma lo convirtió en la opción para los ejemplos de FTP en este libro.

**PuTTY** es un cliente SSH gratuito, útil para acceso de Shell a un servidor, así como también proporciona capacidades de transferencia de archivos con SCP

**WinSCP** es un cliente FTP/SFTP/SCP para sistemas Windows.

| Nombre | Enlace | Licencia | Plataforma |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Cualquiera |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

La base de datos contiene todo el contenido de su sitio, las configuraciones que personalizan su sitio, la información sobre los usuarios de su sitio y más. Proteger y mantener esa información puede ser más fácil con algunas herramientas adicionales que se ocupan específicamente de la base de datos.

**phpMyAdmin** es la herramienta basada en web más popular para trabajar con bases de datos MySQL, incluyendo hacer copias de seguridad puntuales.

**BigDump** es una bendición para cuentas de alojamiento limitadas, donde ayuda a restaurar grandes volcados de base de datos mientras se evitan tiempos de espera y restricciones de tamaño.

**srdb**, Search Replace DB para XOOPS es una adaptación de XOOPS de [Buscar y Reemplazar DB](https://github.com/interconnectit/Search-Replace-DB) de interconnect/it. Es especialmente útil para cambiar URL y referencias del sistema de archivos en datos MySQL cuando mueve un sitio.

| Nombre | Enlace | Licencia | Plataforma |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Cualquiera |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Cualquiera |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Cualquiera |

## Pilas de Desarrolladores

Algunas plataformas, como Ubuntu, tienen toda la pila necesaria para ejecutar XOOPS integrada, mientras que otras necesitan algunas adiciones.

**WAMP** y **Uniform Server Zero** son pilas todo en uno para Windows.

**XAMPP**, una pila todo en uno de Apache Friends, está disponible para múltiples plataformas.

**bitnami** ofrece una amplia gama de pilas de aplicaciones precompiladas, incluidas imágenes de máquina virtual y contenedor. Sus ofertas pueden ser un recurso valioso para probar rápidamente aplicaciones (incluido XOOPS) o varias tecnologías web. También pueden ser adecuadas para uso en producción y desarrollo.

**Docker** es una plataforma de contenedor de aplicación, utilizada para crear y ejecutar contenedores para implementar entornos personalizados.

**Devilbox** es una pila de desarrollo basada en Docker fácil de configurar. Ofrece una amplia gama de versiones para todos los componentes de la pila, y permite a los desarrolladores probar en un entorno reproducible y compartible.

| Nombre | Enlace | Licencia | Plataforma |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Múltiple | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Múltiple | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Múltiple | Cualquiera |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Múltiple | Cualquiera |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Múltiple | Cualquiera |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Cualquiera |
