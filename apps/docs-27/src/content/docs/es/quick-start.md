---
title: Inicio Rápido
description: Ejecute XOOPS 2.7 en menos de 5 minutos.
---

## Requisitos

| Componente | Mínimo                  | Recomendado   |
|------------|-------------------------|---------------|
| PHP        | 8.2                    | 8.4+         |
| MySQL      | 5.7                     | 8.0+          |
| MariaDB    | 10.4                    | 10.11+        |
| Servidor web | Apache 2.4 / Nginx 1.20 | Última estable |

## Descargar

Descargue la última versión desde [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# O clone directamente
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Pasos de Instalación

1. **Cargue los archivos** en la raíz de documentos de su servidor web (ej. `public_html/`).
2. **Cree una base de datos MySQL** y un usuario con permisos completos.
3. **Abra su navegador** y navegue a su dominio — el instalador de XOOPS se inicia automáticamente.
4. **Siga el asistente de 5 pasos** — configura rutas, crea tablas y configura su cuenta de administrador.
5. **Elimine la carpeta `install/`** cuando se le solicite. Esto es obligatorio por seguridad.

## Verificar la Instalación

Después de la configuración, visite:

- **Página principal:** `https://yourdomain.com/`
- **Panel de administración:** `https://yourdomain.com/xoops_data/` *(ruta que eligió durante la instalación)*

## Próximos Pasos

- [Guía de Instalación Completa](./installation/) — configuración del servidor, permisos, solución de problemas
- [Guía de Módulos](./module-guide/introduction/) — cree su primer módulo
- [Guía de Temas](./theme-guide/introduction/) — cree o personalice un tema
