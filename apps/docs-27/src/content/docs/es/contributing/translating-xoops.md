---
title: "Apéndice 3: Traducir XOOPS a un Idioma Local"
---

XOOPS 2.7.0 se envía solo con archivos de idioma inglés. Las traducciones a otros idiomas son mantenidas por la comunidad y distribuidas a través de GitHub y varios sitios de soporte local de XOOPS.

## Dónde encontrar traducciones existentes

- **GitHub** — Las traducciones comunitarias se publican cada vez más como repositorios separados bajo la [organización XOOPS](https://github.com/XOOPS) y en cuentas de colaboradores individuales. Buscar en GitHub `xoops-language-<your-language>` o explorar la organización XOOPS para paquetes actuales.
- **Sitios de soporte local de XOOPS** — Muchas comunidades locales de XOOPS publican traducciones en sus propios sitios. Visite [https://xoops.org](https://xoops.org) y siga los enlaces a comunidades locales.
- **Traducciones de módulos** — Las traducciones para módulos comunitarios individuales generalmente viven junto al módulo mismo en la organización de GitHub `XoopsModules25x` (el `25x` en el nombre es histórico; los módulos allí se mantienen tanto para XOOPS 2.5.x como para 2.7.x).

Si ya existe una traducción para su idioma, deje caer los directorios de idioma en su instalación de XOOPS (vea "Cómo instalar una traducción" a continuación).

## Qué necesita ser traducido

XOOPS 2.7.0 mantiene archivos de idioma junto con el código que los consume. Una traducción completa cubre todos estos lugares:

- **Núcleo** — `htdocs/language/english/` — constantes de todo el sitio utilizadas por cada página (login, errores comunes, fechas, plantillas de correo, etc.).
- **Instalador** — `htdocs/install/language/english/` — cadenas mostradas por el asistente de instalación. Traduzca esto *antes* de ejecutar el instalador si desea una experiencia de instalación localizada.
- **Módulo de sistema** — `htdocs/modules/system/language/english/` — por lejos el conjunto más grande; cubre todo el Panel de Control de administración.
- **Módulos incluidos** — cada uno de `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/`, y `htdocs/modules/debugbar/language/english/`.
- **Temas** — algunos temas enviados tienen sus propios archivos de idioma; verifique `htdocs/themes/<theme>/language/` si existe.

Una traducción "solo núcleo" es la unidad mínima útil y corresponde a los dos primeros puntos anteriores.

## Cómo traducir

1. Copie el directorio `english/` junto a él y renombre la copia a su idioma. El nombre del directorio debe ser el nombre en inglés en minúsculas del idioma (`spanish`, `german`, `french`, `japanese`, `arabic`, etc.).

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. Abra cada archivo `.php` en el nuevo directorio y traduzca los **valores de cadena** dentro de las llamadas `define()`. NO cambie los nombres de las constantes — se hace referencia a ellas desde código PHP en todo el núcleo.

   ```php
   // Antes:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // Después (Español):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **Guardar cada archivo como UTF-8 *sin* BOM.** XOOPS 2.7.0 utiliza `utf8mb4` de un extremo a otro (base de datos, sesiones, salida) y rechaza archivos con una marca de orden de bytes. En Notepad++ esta es la opción **"UTF-8"**, *no* "UTF-8-BOM". En VS Code es el predeterminado; solo confirme la codificación en la barra de estado.

4. Actualice los metadatos de idioma y conjunto de caracteres en la parte superior de cada archivo para que coincida con su idioma:

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE` debe ser el código [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) de su idioma. `_CHARSET` es siempre `UTF-8` en XOOPS 2.7.0 — ya no hay variante ISO-8859-1.

5. Repita para el instalador, el módulo de sistema y los módulos incluidos que necesite.

## Cómo instalar una traducción

Si obtuvo una traducción terminada como un árbol de directorios:

1. Copie cada directorio `<language>/` en el directorio padre `language/english/` coincidente en su instalación de XOOPS. Por ejemplo, copie `language/spanish/` en `htdocs/language/`, `install/language/spanish/` en `htdocs/install/language/`, etc.
2. Asegúrese de que la propiedad del archivo y los permisos sean legibles por el servidor web.
3. Seleccione el nuevo idioma en el tiempo de instalación (el asistente escanea `htdocs/language/` para idiomas disponibles) o, en un sitio existente, cambie el idioma en **Admin → System → Preferences → General Settings**.

## Compartir su traducción de vuelta

Por favor, contribuya su traducción de vuelta a la comunidad.

1. Cree un repositorio de GitHub (o haga un fork de un repositorio de idioma existente si uno existe para su idioma).
2. Utilice un nombre claro como `xoops-language-<language-code>` (por ejemplo, `xoops-language-es`, `xoops-language-pt-br`).
3. Refleje la estructura de directorio de XOOPS dentro de su repositorio para que los archivos se alineen con dónde se copian:

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. Incluya un `README.md` documentando:
   - Nombre del idioma y código ISO
   - Compatibilidad de versión de XOOPS (por ejemplo, `XOOPS 2.7.0+`)
   - Traductor y créditos
   - Si la traducción es solo núcleo o cubre módulos incluidos
5. Abra una solicitud de cambio contra el repositorio de módulo/núcleo relevante en GitHub o publique un anuncio en [https://xoops.org](https://xoops.org) para que la comunidad pueda encontrarlo.

> **Nota**
>
> Si su idioma requiere cambios en el núcleo para formato de fecha o calendario, incluya esos cambios en el paquete también. Los idiomas con scripts de derecha a izquierda (árabe, hebreo, persa, urdú) funcionan de inmediato en XOOPS 2.7.0 — Se agregó soporte RTL en esta versión y los temas individuales lo detectan automáticamente.
