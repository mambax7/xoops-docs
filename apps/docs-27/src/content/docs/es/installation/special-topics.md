---
title: "Temas Especiales"
---

Algunas combinaciones de software de sistema específico pueden requerir algunas configuraciones adicionales para trabajar con XOOPS. Aquí hay algunos detalles de problemas conocidos y orientación para tratarlos.

## Entornos SELinux

Ciertos archivos y directorios deben ser escribibles durante la instalación, actualización y operación normal de XOOPS. En un entorno tradicional de Linux, esto se logra asegurando que el usuario del sistema bajo el cual se ejecuta el servidor web tenga permisos en los directorios de XOOPS, generalmente estableciendo el grupo apropiado para esos directorios.

Los sistemas con SELinux habilitado (como CentOS y RHEL) tienen un contexto de seguridad adicional, que puede restringir la capacidad de un proceso de cambiar el sistema de archivos. Estos sistemas pueden requerir cambios en el contexto de seguridad para que XOOPS funcione correctamente.

XOOPS espera poder escribir libremente en ciertos directorios durante la operación normal. Además, durante instalaciones y actualizaciones de XOOPS, ciertos archivos también deben ser escribibles.

Durante la operación normal, XOOPS espera poder escribir archivos y crear subdirectorios en estos directorios:

- `uploads` en la raíz web principal de XOOPS
- `xoops_data` dondequiera que se reubique durante la instalación

Durante un proceso de instalación o actualización, XOOPS necesitará escribir en este archivo:

- `mainfile.php` en la raíz web principal de XOOPS

Para un sistema típico basado en Apache de CentOS, los cambios de contexto de seguridad podrían ser realizados con estos comandos:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

Puedes hacer mainfile.php escribible con:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Nota: Cuando instales, puedes copiar un mainfile.php vacío del directorio *extras*.

También deberías permitir que httpd envíe correo:

```
setsebool -P httpd_can_sendmail=1
```

Otras configuraciones que podrías necesitar incluyen:

Permitir que httpd realice conexiones de red, es decir recuperar feeds rss o realizar llamadas API:

```
setsebool -P httpd_can_network_connect 1
```

Habilitar la conexión de red a una base de datos con:

```
setsebool -P httpd_can_network_connect_db=1
```

Para más información consulta la documentación de tu sistema y/o administrador de sistemas.

## Smarty 4 y Temas Personalizados

XOOPS 2.7.0 actualizó su motor de templating de Smarty 3 a **Smarty 4**. Smarty 4 es más estricto sobre la sintaxis de plantilla que Smarty 3, y algunos patrones que fueron tolerados en plantillas antiguas ahora causarán errores. Si estás instalando una copia nueva de XOOPS 2.7.0 usando solo los temas y módulos enviados con la versión, no hay nada de qué preocuparse — cada plantilla enviada ha sido actualizada para compatibilidad con Smarty 4.

La preocupación aplica cuando:

- estás actualizando un sitio XOOPS 2.5.x existente que tiene temas personalizados, o
- estás instalando temas personalizados o módulos de terceros más antiguos en XOOPS 2.7.0.

Antes de cambiar el tráfico en vivo a un sitio actualizado, ejecuta el escáner de control previo que viene en el directorio `/upgrade/`. Escanea `/themes/` y `/modules/` buscando incompatibilidades con Smarty 4 y puede reparar automáticamente muchas de ellas. Consulta la página [Comprobación Previa](../upgrading/upgrade/preflight.md) para más detalles.

Si encuentras errores de plantilla después de una instalación o actualización:

1. Vuelve a ejecutar `/upgrade/preflight.php` y aborda cualquier problema reportado.
2. Borra la caché de plantilla compilada eliminando todo excepto `index.html` de `xoops_data/caches/smarty_compile/`.
3. Cambia temporalmente a un tema enviado como `xbootstrap5` o `default` para confirmar que el problema es específico del tema en lugar de a nivel de sitio.
4. Valida cualquier cambio de plantilla de tema o módulo personalizado antes de devolver el sitio a producción.
