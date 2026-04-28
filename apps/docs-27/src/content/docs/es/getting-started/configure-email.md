---
title: "Configurar Correo Electrónico"
---

![Configuración de Correo Electrónico de XOOPS](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS depende del correo electrónico para muchas interacciones críticas del usuario, como validar un registro o restablecer una contraseña. Por lo tanto, es importante que se configure correctamente.

Configurar el correo electrónico del sitio puede ser muy fácil en algunos casos y frustrante en otros.

Aquí hay algunos consejos para ayudar a que su configuración sea un éxito.

## Método de Entrega de Correo Electrónico

Esta sección de la configuración tiene 4 valores posibles

* **PHP Mail()** - la forma más fácil, si está disponible. Depende del programa _sendmail_ del sistema.
* **sendmail** - Una opción de clase industrial, pero a menudo dirigida para SPAM explotando debilidades en otro software.
* **SMTP** - El Protocolo Simple de Transferencia de Correo no suele estar disponible en nuevas cuentas de alojamiento debido a problemas de seguridad y potencial de abuso. Ha sido reemplazado en gran medida por SMTP Auth.
* **SMTP Auth** - SMTP con Autorización generalmente se prefiere sobre SMTP simple. En este caso, XOOPS se conecta directamente al servidor de correo de una manera más segura.

## Hosts SMTP

Si necesita usar SMTP, con o sin "Auth", deberá especificar un nombre de servidor aquí. Ese nombre puede ser un nombre de host simple o dirección IP, o puede incluir información de puerto y protocolo adicional. El caso más simple sería `localhost` para un servidor SMTP (sin autenticación) ejecutándose en la misma máquina que el servidor web.

El nombre de usuario SMTP y la contraseña SMTP siempre son obligatorios cuando se usa SMTP Auth. Es posible especificar TLS o SSL, así como un puerto en el campo de configuración de Hosts SMTP de XOOPS.

Esto podría usarse para conectarse a Gmail SMTP: `tls://smtp.gmail.com:587`

Otro ejemplo usando SSL: `ssl://mail.example.com:465`

## Consejos para la Solución de Problemas

A veces, las cosas no van tan bien como esperamos. Aquí hay algunas sugerencias y recursos que podrían ayudar.

### Consulte la documentación de su proveedor de alojamiento

Cuando establece un servicio de alojamiento con un proveedor, deben proporcionar información sobre cómo acceder a los servidores de correo electrónico. Desea tener esto disponible cuando configure el correo electrónico para su sistema XOOPS.

### XOOPS Usa PHPMailer

XOOPS utiliza la biblioteca [PHPMailer](https://github.com/PHPMailer/PHPMailer) para enviar correo electrónico. La sección de [solución de problemas](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) en la wiki ofrece algunas ideas.
