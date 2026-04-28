---
title: "phpinfo"
---

Este paso es opcional, pero puede ahorrarte fácilmente horas de frustración.

Como prueba previa a la instalación del sistema de alojamiento, se crea un pequeño script PHP muy útil localmente, y se sube al sistema de destino.

El script PHP es solo una línea:

```php
<?php phpinfo();
```

Usando un editor de texto, crea un archivo llamado _info.php_ con esta línea.

Luego, sube este archivo a tu raíz web.

![Subida de info.php de Filezilla](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Accede a tu script abriendo en tu navegador, es decir accediendo a `http://example.com/info.php`. Si todo funciona correctamente, deberías ver una página algo así:

![Ejemplo de phpinfo()](/xoops-docs/2.7/img/installation/php-info.png)

Nota: algunos servicios de alojamiento pueden deshabilitar la función _phpinfo()_ como medida de seguridad. Por lo general, recibirás un mensaje a ese efecto, si ese es el caso.

La salida del script podría ser útil para la solución de problemas, así que considera guardar una copia de ella.

Si la prueba funciona, deberías estar listo para la instalación. Deberías eliminar el script _info.php_, y proceder con la instalación.

Si la prueba falla, ¡investiga por qué! Lo que sea que esté impidiendo que esta prueba simple funcione **evitará** que una instalación real funcione.
