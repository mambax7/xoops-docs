---
title: "Después de la Actualización"
---

## Actualizar el Módulo del Sistema

Después de que todos los parches necesarios hayan sido aplicados, seleccionar _Continuar_ configurará todo para actualizar el módulo **system**. Este es un paso muy importante y es requerido para completar la actualización correctamente.

![Actualizar Módulo del Sistema de XOOPS](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Selecciona _Actualizar_ para realizar la actualización del módulo Sistema.

## Actualizar Otros Módulos Suministrados por XOOPS

XOOPS viene con tres módulos opcionales - pm (Mensajería Privada,) profile (Perfil de Usuario) y protector (Protector). Deberías hacer una actualización en cualquiera de estos módulos que estén instalados.

![Actualizar Otros Módulos de XOOPS](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Actualizar Otros Módulos

Es probable que haya actualizaciones para otros módulos que podrían permitir que los módulos funcionen mejor bajo tu ahora actualizado XOOPS. Deberías investigar y aplicar cualquier actualización de módulo apropiada.

## Revisar Nuevas Preferencias de Endurecimiento de Cookie

La actualización de XOOPS 2.7.0 añade dos nuevas preferencias que controlan cómo se emiten las cookies de sesión:

* **`session_cookie_samesite`** — controla el atributo de cookie SameSite. `Lax` es un valor predeterminado seguro para la mayoría de sitios. Usa `Strict` para máxima protección si tu sitio no se basa en navegación entre orígenes. `None` solo es apropiado si sabes que lo necesitas.
* **`session_cookie_secure`** — cuando está habilitado, la cookie de sesión solo se envía a través de conexiones HTTPS. Activa esto si tu sitio se ejecuta en HTTPS.

Puedes revisar estas configuración bajo Opciones del Sistema → Preferencias → Configuración General.

## Validar Temas Personalizados

Si tu sitio usa un tema personalizado, recorre el frontend y el área de admin para confirmar que las páginas se renderizan correctamente. La actualización a Smarty 4 puede afectar plantillas personalizadas incluso si el escaneo previa pasó. Si ves problemas de representación, revisita [Solución de Problemas](ustep-03.md).

## Limpiar Archivos de Instalación y Actualización

Por seguridad, elimina estos directorios de tu raíz web una vez que se confirme que la actualización funciona:

* `upgrade/` — el directorio de flujo de trabajo de actualización
* `install/` — si está presente, ya sea como `install/` o como un directorio renombrado `installremove*`

Dejar estos en su lugar expone los scripts de actualización e instalación a cualquiera que pueda llegar a tu sitio.

## Abre tu Sitio

Si seguiste el consejo de _Apagar tu sitio_, deberías apagarlo de nuevo una vez que hayas determinado que funciona correctamente.
