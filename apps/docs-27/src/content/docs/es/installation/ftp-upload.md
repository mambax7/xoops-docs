---
title: "Apéndice 2: Subir XOOPS por FTP"
---

Este apéndice te guía a través de la implementación de XOOPS 2.7.0 en un host remoto usando FTP o SFTP. Cualquier panel de control (cPanel, Plesk, DirectAdmin, etc.) expondrá los mismos pasos subyacentes.

## 1. Prepara la base de datos

A través del panel de control de tu host:

1. Crea una nueva base de datos MySQL para XOOPS.
2. Crea un usuario de base de datos con una contraseña fuerte.
3. Concede al usuario todos los privilegios en la base de datos recién creada.
4. Registra el nombre de la base de datos, nombre de usuario, contraseña y host — los introducirás en el instalador de XOOPS.

> **Consejo**
>
> Los paneles de control modernos generan contraseñas fuertes por ti. Dado que la aplicación almacena la contraseña en `xoops_data/data/secure.php`, no necesitas escribirla a menudo — prefiere un valor largo y generado aleatoriamente.

## 2. Crear un buzón de correo del administrador

Crea un buzón de correo que recibirá notificaciones de administración del sitio. El instalador de XOOPS te pide esta dirección durante la configuración de la cuenta de webmaster y la valida con `FILTER_VALIDATE_EMAIL`.

## 3. Sube los archivos

XOOPS 2.7.0 viene con sus dependencias de terceros preinstaladas en `xoops_lib/vendor/` (paquetes de Composer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF, y más). Esto hace que `xoops_lib/` sea significativamente más grande que en 2.5.x — espera decenas de megabytes.

**No omitas selectivamente archivos dentro de `xoops_lib/vendor/`.** Omitir archivos en el árbol del proveedor de Composer romperá la carga automática y la instalación fallará.

Estructura de subida (asumiendo que `public_html` es la raíz del documento):

1. Sube `xoops_data/` y `xoops_lib/` **al lado de** `public_html`, no dentro de él. Colocarlos fuera de la raíz web es la postura de seguridad recomendada para 2.7.0.

   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← sube aquí
   └── xoops_lib/      ← sube aquí
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Sube el contenido restante del directorio de distribución `htdocs/` en `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Si tu host no permite directorios fuera de la raíz del documento**
>
> Sube `xoops_data/` y `xoops_lib/` **dentro de** `public_html/` y **cambia su nombre a nombres no obvios** (por ejemplo `xdata_8f3k2/` y `xlib_7h2m1/`). Introducirás las rutas renombradas en el instalador cuando te pida la Ruta de Datos de XOOPS y la Ruta de Biblioteca de XOOPS.

## 4. Haz que los directorios escribibles sean escribibles

A través del diálogo CHMOD del cliente FTP (o SSH), haz que los directorios listados en el Capítulo 2 sean escribibles por el servidor web. En la mayoría de los hosts compartidos, `0775` en directorios y `0664` en `mainfile.php` son suficientes. `0777` es aceptable durante la instalación si tu host ejecuta PHP bajo un usuario diferente al usuario FTP, pero aprieta los permisos después de que la instalación se complete.

## 5. Lanza el instalador

Apunta tu navegador a la URL pública del sitio. Si todos los archivos están en su lugar, el Asistente de Instalación de XOOPS comienza y puedes seguir el resto de esta guía desde [Capítulo 2](chapter-2-introduction.md) en adelante.
