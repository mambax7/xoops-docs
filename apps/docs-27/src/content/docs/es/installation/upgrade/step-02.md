---
title: "Ejecutando Actualización"
---

Antes de ejecutar el actualizador principal, asegúrate de que has completado la [Comprobación Previa](preflight.md). La UI de actualización requiere que lo previo sea ejecutado al menos una vez y te dirigirá allí si no lo has hecho.

Lanza la actualización apuntando tu navegador al directorio _upgrade_ de tu sitio:

```text
http://example.com/upgrade/
```

Esto debería mostrar una página como esta:

![Inicio de Actualización de XOOPS](/xoops-docs/2.7/img/installation/upgrade-01.png)

Selecciona el botón "Continuar" para proceder.

Cada "Continuar" avanza a través de otro parche. Sigue continuando hasta que todos los parches se apliquen, y se presente la página de Actualización del Módulo del Sistema.

![Parche Aplicado de Actualización de XOOPS](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Qué Aplica la Actualización 2.5.11 → 2.7.0

Cuando actualizas de XOOPS 2.5.11 a 2.7.0, el actualizador aplica los siguientes parches. Cada uno se presenta como un paso separado en el asistente para que puedas confirmar qué se está siendo cambiado:

1. **Eliminar PHPMailer incluido obsoleto.** La copia incluida de PHPMailer dentro del módulo Protector se elimina. PHPMailer ahora se suministra a través de Composer en `xoops_lib/vendor/`.
2. **Eliminar carpeta HTMLPurifier obsoleta.** De manera similar, la carpeta HTMLPurifier antigua dentro del módulo Protector se elimina. HTMLPurifier ahora se suministra a través de Composer.
3. **Crear la tabla `tokens`.** Una nueva tabla `tokens` se añade para almacenamiento genérico de tokens alcanzados. La tabla tiene columnas para id de token, id de usuario, alcance, hash, y marcas de tiempo de emisión/expiración/uso, y es usada por características basadas en tokens en XOOPS 2.7.0.
4. **Ampliar `bannerclient.passwd`.** La columna `bannerclient.passwd` se amplía a `VARCHAR(255)` para que pueda almacenar valores hash de contraseña modernos (bcrypt, argon2) en lugar de la columna antigua angosta.
5. **Añadir preferencias de cookie de sesión.** Dos nuevas preferencias se insertan: `session_cookie_samesite` (para el atributo de cookie SameSite) y `session_cookie_secure` (para forzar cookies solo HTTPS). Consulta [Después de la Actualización](ustep-04.md) para cómo revisar estos después de que la actualización se complete.

Ninguno de estos pasos toca tus datos de contenido. Tus usuarios, publicaciones, imágenes y datos de módulo permanecen sin tocar.

## Eligiendo un Idioma

La distribución principal de XOOPS viene con soporte en inglés. El soporte para configuraciones locales adicionales se suministra por [sitios de soporte local de XOOPS](https://xoops.org/modules/xoopspartners/). Este soporte puede venir en forma de una distribución personalizada, o archivos adicionales a añadir a la distribución principal.

Las traducciones de XOOPS se mantienen en [transifex](https://www.transifex.com/xoops/public/)

Si tu Actualizador de XOOPS tiene soporte de idioma adicional, puedes cambiar el idioma seleccionando el icono de idioma en los menús superiores, y eligiendo un idioma diferente.

![Idioma de Actualización de XOOPS](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
