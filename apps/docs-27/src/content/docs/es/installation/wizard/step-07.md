---
title: "Guardar Configuración"
---

Esta página muestra los resultados de guardar la información de configuración que has introducido hasta este punto.

Después de revisar y corregir cualquier problema, selecciona el botón "Continuar" para proceder.

## En Caso de Éxito

La sección _Guardando la configuración de tu sistema_ muestra la información que fue guardada. La configuración se guarda en uno de dos archivos. Un archivo es _mainfile.php_ en la raíz web. El otro es _data/secure.php_ en el directorio _xoops_data_.

![Guardar Configuración del Instalador de XOOPS](/xoops-docs/2.7/img/installation/installer-07.png)

Ambos archivos se generan a partir de archivos de plantilla enviados con XOOPS 2.7.0:

* `mainfile.php` se genera a partir de `mainfile.dist.php` en la raíz web.
* `xoops_data/data/secure.php` se genera a partir de `xoops_data/data/secure.dist.php`.

Además de las rutas y URL que introdujiste, `mainfile.php` ahora incluye varios constantes que son nuevos en XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — mantenido como alias compatible hacia atrás de `XOOPS_PATH`; no necesitas configurarlo por separado.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — por defecto a `true`; usa la Lista de Sufijo Público para derivar el dominio de cookie correcto.
* `XOOPS_DB_LEGACY_LOG` — por defecto a `false`; establece a `true` en desarrollo para registrar el uso de APIs de base de datos heredadas.
* `XOOPS_DEBUG` — por defecto a `false`; establece a `true` en desarrollo para habilitar reportaje de errores adicional.

No necesitas editar estos a mano durante la instalación — los valores predeterminados son apropiados para un sitio de producción. Se mencionan aquí para que sepas qué buscar si abres `mainfile.php` más tarde.

## Errores

Si XOOPS detecta errores al escribir los archivos de configuración, mostrará mensajes, detallando qué está mal.

![Errores de Guardar Configuración del Instalador de XOOPS](/xoops-docs/2.7/img/installation/installer-07-errors.png)

En muchos casos, una instalación por defecto de un sistema derivado de Debian usando mod_php en Apache es la fuente de errores. La mayoría de proveedores de alojamiento tienen configuraciones que no tienen estos problemas.

### Problemas de permiso de grupo

El proceso PHP se ejecuta usando los permisos de algún usuario. Los archivos también son propiedad de algún usuario. Si estos dos no son el mismo usuario, los permisos de grupo se pueden usar para permitir que el proceso PHP comparta archivos con tu cuenta de usuario. Esto generalmente significa que necesitas cambiar el grupo de los archivos y directorios que XOOPS necesita escribir.

Para la configuración predeterminada mencionada anteriormente esto significa que el grupo _www-data_ necesita ser especificado como el grupo para los archivos y directorios, y esos archivos y directorios necesitan ser escribibles por grupo.

Deberías revisar tu configuración cuidadosamente, y elegir cuidadosamente cómo resolver estos problemas para una caja disponible en la internet abierta.

Los comandos de ejemplo podrían ser:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### No se puede crear mainfile.php

En sistemas tipo Unix, el permiso para crear un nuevo archivo depende de los permisos otorgados en la carpeta padre. En algunos casos ese permiso no está disponible, y otorgarlo puede ser una preocupación de seguridad.

Si tienes una configuración problemática, puedes encontrar un archivo _mainfile.php_ ficticio en el directorio _extras_ en la distribución de XOOPS. Copia ese archivo en la raíz web y establece los permisos en el archivo:
