---
title: "Asistente de Instalación"
description: "Recorrido paso a paso del asistente de instalación de XOOPS — 15 pantallas explicadas."
---

El asistente de instalación de XOOPS te guía a través de un proceso de 15 pasos que configura tu base de datos, crea la cuenta de admin, y prepara tu sitio para primer uso.

## Antes de comenzar

- Has [subido XOOPS a tu servidor](/xoops-docs/2.7/installation/ftp-upload/) o configurado un entorno local
- Has [verificado los requisitos](/xoops-docs/2.7/installation/requirements/)
- Tienes tus credenciales de base de datos listas

## Pasos del asistente

| Paso | Pantalla | Qué sucede |
|------|----------|-----------|
| 1 | [Selección de Idioma](./step-01/) | Elige idioma de instalación |
| 2 | [Bienvenida](./step-02/) | Acuerdo de licencia |
| 3 | [Comprobación de Configuración](./step-03/) | Comprobación del entorno PHP/servidor |
| 4 | [Configuración de Ruta](./step-04/) | Establece ruta raíz y URL |
| 5 | [Conexión de Base de Datos](./step-05/) | Introduce host, usuario, contraseña de base de datos |
| 6 | [Configuración de Base de Datos](./step-06/) | Establece nombre de base de datos y prefijo de tabla |
| 7 | [Guardar Configuración](./step-07/) | Escribe mainfile.php |
| 8 | [Creación de Tabla](./step-08/) | Crea el esquema de base de datos |
| 9 | [Configuración Inicial](./step-09/) | Nombre del sitio, email de admin |
| 10 | [Inserción de Datos](./step-10/) | Puebla datos predeterminados |
| 11 | [Configuración del Sitio](./step-11/) | URL, zona horaria, idioma |
| 12 | [Seleccionar Tema](./step-12/) | Elige un tema predeterminado |
| 13 | [Instalación de Módulo](./step-13/) | Instala módulos incluidos |
| 14 | [Bienvenida](./step-14/) | Mensaje de instalación completada |
| 15 | [Limpieza](./step-15/) | Elimina la carpeta de instalación |

:::caution[Seguridad]
Después de completar el asistente, **elimina o renombra la carpeta `install/`** — el paso 15 te guía a través de esto. Dejarla accesible es un riesgo de seguridad.
:::
