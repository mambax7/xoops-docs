---
title: "Revisión de Compatibilidad XOOPS 2.7.0 Para Esta Guía"
---

Este documento enumera los cambios necesarios en este repositorio para que la Guía de Instalación coincida con XOOPS 2.7.0.

Base de revisión:

- Repositorio de guía actual: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- Núcleo XOOPS 2.7.0 revisado en: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Fuentes principales de 2.7.0 verificadas:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Alcance

Este repositorio actualmente contiene:

- Archivos Markdown en inglés a nivel raíz utilizados como la guía principal.
- Una copia parcial `en/`.
- Árboles de libros completos `de/` y `fr/` con sus propios activos.

Los archivos a nivel raíz necesitan la primera pasada. Después, los cambios equivalentes deben reflejarse en `de/book/` y `fr/book/`. El árbol `en/` también necesita limpieza porque parece ser solo parcialmente mantenido.

## 1. Cambios de Repositorio Global

### 1.1 Control de versión y metadatos

Actualice todas las referencias a nivel de guía de XOOPS 2.5.x a XOOPS 2.7.0.

Archivos afectados:

- `README.md`
- `SUMMARY.md` — Tabla de contenido principal en vivo; las etiquetas de navegación y títulos de sección deben coincidir con los nuevos títulos de capítulo y la sección de Notas de Actualización Histórica renombrada
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- `de/book/*.md` y `fr/book/*.md` localizados

Cambios necesarios:

- Cambiar `para XOOPS 2.5.7.x` a `para XOOPS 2.7.0`.
- Actualizar año de copyright de `2018` a `2026`.
- Reemplazar referencias antiguas de XOOPS 2.5.x y 2.6.0 donde describen la versión actual.
- Reemplazar orientación de descarga de era de SourceForge con Versiones de GitHub:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Actualización de enlaces

`about-xoops-cms.md` y los archivos `10aboutxoops.md` localizados aún apuntan a ubicaciones antiguas de GitHub 2.5.x y 2.6.0. Esos enlaces deben actualizarse a las ubicaciones actuales del proyecto 2.7.x.

### 1.3 Actualización de capturas de pantalla

Todas las capturas de pantalla que muestran el instalador, interfaz de actualización, panel de admin, selector de temas, selector de módulos y pantallas posteriores a la instalación están obsoletas.

Árboles de activos afectados:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Esta es una actualización completa, no una parcial. El instalador 2.7.0 utiliza un diseño basado en Bootstrap diferente y una estructura visual diferente.

## 2. Capítulo 2: Introducción

Archivo:

- `chapter-2-introduction.md`

### 2.1 Los requisitos del sistema deben reescribirse

El capítulo actual solo dice Apache, MySQL y PHP. XOOPS 2.7.0 tiene mínimos explícitos:

| Componente | Mínimo 2.7.0 | Recomendación 2.7.0 |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| Servidor web | Cualquier servidor que admita PHP requerido | Apache o Nginx recomendado |

Notas para agregar:

- IIS aún aparece en el instalador como posible, pero Apache y Nginx son los ejemplos recomendados.
- Las notas de lanzamiento también señalan la compatibilidad de MySQL 9.0.

### 2.2 Agregar lista de verificación de extensión de PHP requerida y recomendada

El instalador 2.7.0 ahora separa requisitos duros de extensiones recomendadas.

Comprobaciones de requisitos mostradas por el instalador:

- MySQLi
- Sesión
- PCRE
- filtro
- `file_uploads`
- fileinfo

Extensiones recomendadas:

- mbstring
- intl
- iconv
- xml
- zlib
- gd
- exif
- curl

### 2.3 Eliminar instrucciones de suma de verificación

La descripción actual del paso 5 describe `checksum.php` y `checksum.mdi`. Esos archivos no son parte de XOOPS 2.7.0.

Acción:

- Elimine completamente la sección de verificación de suma de verificación.

### 2.4 Actualizar instrucciones de paquete y carga

Mantenga la descripción del diseño del paquete `docs/`, `extras/`, `htdocs/`, `upgrade/`, pero actualice el texto de carga y preparación para reflejar expectativas de ruta escribible actual:

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

La guía actualmente subestima esto.

### 2.5 Reemplazar idioma de traducción/descarga de SourceForge

El texto actual aún dice que visite XOOPS en SourceForge para otros paquetes de idioma. Eso debe reemplazarse con orientación actual de descarga de proyecto/comunidad.

## 3. Capítulo 3: Comprobación de Configuración del Servidor

Archivo:

- `chapter-3-server-configuration-check.md`

Cambios necesarios:

- Reescriba la descripción de página alrededor del diseño actual de dos bloques:
  - Requisitos
  - Extensiones recomendadas
- Reemplace la captura de pantalla anterior.
- Documente explícitamente las comprobaciones de requisitos enumeradas arriba.

## 4. Capítulo 4: Tomar el Camino Correcto

Archivo:

- `chapter-4-take-the-right-path.md`

Cambios necesarios:

- Agregue el nuevo campo `Dominio de Cookie`.
- Actualice los nombres y descripciones de los campos de ruta para coincidir con 2.7.0:
  - Ruta Raíz de XOOPS
  - Ruta de Datos de XOOPS
  - Ruta de Biblioteca de XOOPS
  - URL XOOPS
  - Dominio de Cookie
- Agregue una nota de que cambiar la ruta de la biblioteca ahora requiere un cargador automático de Composer válido en `vendor/autoload.php`.

Esta es una comprobación de compatibilidad real en 2.7.0 y debe documentarse claramente. La guía actual no menciona Composer en absoluto.

## 5. Capítulo 5: Conexiones de Base de Datos

Archivo:

- `chapter-5-database-connections.md`

Cambios necesarios:

- Mantenga la declaración de que solo MySQL es compatible.
- Actualice la sección de configuración de base de datos para reflejar:
  - el conjunto de caracteres predeterminado es ahora `utf8mb4`
  - la selección de intercalación se actualiza dinámicamente cuando cambia el conjunto de caracteres
- Reemplace las capturas de pantalla tanto para la página de conexión de base de datos como para la de configuración.

El texto actual que dice que el conjunto de caracteres y la intercalación no necesitan atención es demasiado débil para 2.7.0. Al menos debe mencionar el nuevo estándar `utf8mb4` y el selector de intercalación dinámico.

## 6. Capítulo 6: Configuración del Sistema Final

Archivo:

- `chapter-6-final-system-configuration.md`

### 6.1 Archivos de configuración generados cambiados

La guía actual dice que el instalador escribe `mainfile.php` y `secure.php`.

En 2.7.0 también instala archivos de configuración en `xoops_data/configs/`, incluyendo:

- `xoopsconfig.php`
- archivos de configuración de captcha
- archivos de configuración de textsanitizer

### 6.2 Los archivos de configuración existentes en `xoops_data/configs/` no se sobrescriben

El comportamiento de no sobrescritura es **limitado**, no global. Dos caminos de código distintos en `page_configsave.php` escriben archivos de configuración:

- `writeConfigurationFile()` (llamado en líneas 59 y 66) **siempre** regenera `xoops_data/data/secure.php` y `mainfile.php` desde la entrada del asistente. No hay comprobación de existencia; se reemplaza una copia existente.
- `copyConfigDistFiles()` (llamado en línea 62, definido en línea 317) solo copia los archivos `xoops_data/configs/` (`xoopsconfig.php`, los configs de captcha, los configs de textsanitizer) **si el destino ya no existe**.

La reescritura del capítulo debe reflejar ambos comportamientos claramente:

- Para `mainfile.php` y `secure.php`: advierta que las ediciones manuales a estos archivos se sobrescribirán cuando se ejecute nuevamente el instalador.
- Para los archivos `xoops_data/configs/`: explique que las personalizaciones locales se preservan entre ejecuciones nuevas y actualizaciones, y que restaurar los valores predeterminados enviados requiere eliminar el archivo y ejecutar nuevamente (o copiar el `.dist.php` correspondiente a mano).

No generalice "los archivos existentes se preservan" en todos los archivos de configuración escritos por el instalador — eso es incorrecto y sería engañoso para los administradores que editan `mainfile.php` o `secure.php`.

### 6.3 El manejo de HTTPS y proxy inverso cambió

El `mainfile.php` generado ahora soporta detección de protocolo más amplia, incluidos encabezados de proxy inverso. La guía debe mencionar esto en lugar de implicar solo detección directa `http` o `https`.

### 6.4 El conteo de tabla es incorrecto

El capítulo actual dice que un sitio nuevo crea `32` tablas.

XOOPS 2.7.0 crea `33` tablas. La tabla faltante es:

- `tokens`

Acción:

- Actualice el conteo de 32 a 33.
- Agregue `tokens` a la lista de tablas.

## 7. Capítulo 7: Configuración de Administración

Archivo:

- `chapter-7-administration-settings.md`

### 7.1 La descripción de la interfaz de usuario de contraseña está desactualizada

El instalador aún incluye generación de contraseña, pero ahora también incluye:

- medidor de resistencia de contraseña basado en zxcvbn
- etiquetas de resistencia visual
- flujo de generador y copia de 16 caracteres

Actualice el texto y las capturas de pantalla para describir el panel de contraseña actual.

### 7.2 La validación de correo ahora se aplica

El correo de administrador se valida con `FILTER_VALIDATE_EMAIL`. El capítulo debe mencionar que los valores de correo inválidos se rechazan.

### 7.3 La sección de clave de licencia es incorrecta

Esta es una de las correcciones de hechos más importantes.

La guía actual dice:

- hay una `License System Key`
- se almacena en `/include/license.php`
- `/include/license.php` debe ser escribible durante la instalación

Eso ya no es preciso.

Lo que 2.7.0 realmente hace:

- la instalación escribe los datos de licencia en `xoops_data/data/license.php`
- `htdocs/include/license.php` ahora es solo un contenedor obsoleto que carga el archivo desde `XOOPS_VAR_PATH`
- la redacción anterior sobre hacer `/include/license.php` escribible debe eliminarse

Acción:

- Reescriba esta sección en lugar de eliminarla.
- Actualice la ruta de `/include/license.php` a `xoops_data/data/license.php`.

### 7.4 La lista de temas está desactualizada

La guía actual aún se refiere a Zetagenesis y al conjunto de temas anterior de la era 2.5.

Temas presentes en XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

También tenga en cuenta:

- `xswatch4` es el tema predeterminado actual insertado por datos del instalador.
- Zetagenesis ya no es parte de la lista de temas empaquetados.

### 7.5 La lista de módulos está desactualizada

Módulos presentes en el paquete 2.7.0:

- `system` — se instala automáticamente durante los pasos de llenado de tabla / inserción de datos. Siempre presente, nunca visible en el selector.
- `debugbar` — seleccionable en el paso del instalador.
- `pm` — seleccionable en el paso del instalador.
- `profile` — seleccionable en el paso del instalador.
- `protector` — seleccionable en el paso del instalador.

Importante: la página del instalador de módulos (`htdocs/install/page_moduleinstaller.php`) construye su lista de candidatos iterando sobre `XoopsLists::getModulesList()` y **filtrando cualquier cosa ya en la tabla de módulos** (las líneas 95-102 recopilan `$listed_mods`; la línea 116 omite cualquier directorio presente en esa lista). Como `system` se instala antes de este paso, nunca aparece como una casilla de verificación.

Cambios de guía necesarios:

- Deje de decir que solo hay tres módulos incluidos.
- Describa el paso del instalador como mostrando **cuatro módulos seleccionables** (`debugbar`, `pm`, `profile`, `protector`), no cinco.
- Documente `system` por separado como el módulo central siempre instalado que no aparece en el selector.
- Agregue `debugbar` a la descripción del módulo incluido como nuevo en 2.7.0.
- Tenga en cuenta que la preselección del módulo predeterminado del instalador ahora está vacía; los módulos están disponibles para elegir, pero no están preseleccionados por configuración del instalador.

## 8. Capítulo 8: Listo para Ir

Archivo:

- `chapter-8-ready-to-go.md`

### 8.1 El proceso de limpieza de instalación necesita reescritura

La guía actual dice que el instalador renombra la carpeta de instalación a un nombre único.

Eso sigue siendo verdadero en efecto, pero el mecanismo cambió:

- se crea un script de limpieza externo en la raíz web
- la página final desencadena la limpieza a través de AJAX
- la carpeta de instalación se renombra a `install_remove_<sufijo único>`
- existe respaldo a `cleanup.php`

Acción:

- Actualice la explicación.
- Mantenga la instrucción del usuario final simple: elimine el directorio de instalación renombrado después de la instalación.

### 8.2 Las referencias de apéndice del panel de control de administración están obsoletas

El capítulo 8 aún apunta a los lectores hacia la experiencia de administración antigua de la era de Oxygen. Eso necesita alinearse con los temas de administración actuales:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 La orientación de edición de ruta posterior a la instalación necesita corrección

El texto actual le dice a los lectores que actualicen `secure.php` con definiciones de ruta. En 2.7.0, esas constantes de ruta se definen en `mainfile.php`, mientras que `secure.php` mantiene datos seguros. El bloque de ejemplo en este capítulo debe corregirse en consecuencia.

### 8.4 Se deben agregar configuraciones de producción

La guía debe mencionar explícitamente los valores predeterminados de producción ahora presentes en `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` debe permanecer `false`
- `XOOPS_DEBUG` debe permanecer `false`

## 9. Capítulo 9: Actualizar Instalación XOOPS Existente

Archivo:

- `chapter-9-upgrade-existing-xoops-installation.md`

Este capítulo requiere la reescritura más grande.

### 9.1 Agregue paso obligatorio de preflight de Smarty 4

El flujo de actualización de XOOPS 2.7.0 ahora fuerza el proceso de preflight antes de completar la actualización.

Flujo requerido nuevo:

1. Copie el directorio `upgrade/` a la raíz del sitio.
2. Ejecute `/upgrade/preflight.php`.
3. Escanee `/themes/` y `/modules/` para sintaxis Smarty antigua.
4. Utilice el modo de reparación opcional cuando corresponda.
5. Ejecute nuevamente hasta limpiar.
6. Continúe en `/upgrade/`.

El capítulo actual no menciona esto en absoluto, lo que lo hace incompatible con la orientación 2.7.0.

### 9.2 Reemplace la narrativa de fusión manual de la era 2.5.2

El capítulo actual aún describe una actualización manual de estilo 2.5.2 con fusiones de marco, notas de AltSys y reestructuración de archivos administrada manualmente. Eso debe reemplazarse con la secuencia de actualización real de 2.7.x de `release_notes.txt` y `upgrade/README.md`.

Esquema de capítulo recomendado:

1. Haga copia de seguridad de archivos y base de datos.
2. Apague el sitio.
3. Copie `htdocs/` sobre la raíz activa.
4. Copie `htdocs/xoops_lib` en la ruta de biblioteca activa.
5. Copie `htdocs/xoops_data` en la ruta de datos activa.
6. Copie `upgrade/` a la raíz web.
7. Ejecute `preflight.php`.
8. Ejecute `/upgrade/`.
9. Complete los mensajes del actualizador.
10. Actualice el módulo `system`.
11. Actualice `pm`, `profile` y `protector` si están instalados.
12. Elimine `upgrade/`.
13. Encienda el sitio de nuevo.

### 9.3 Documente cambios reales de actualización de 2.7.0

El actualizador de 2.7.0 incluye al menos estos cambios concretos:

- crear tabla `tokens`
- ampliar `bannerclient.passwd` para hashes de contraseña modernos
- agregar configuración de preferencia de cookie de sesión
- eliminar directorios obsoletos incluidos

La guía no necesita exponer cada detalle de implementación, pero debe dejar de implicar que la actualización es solo una copia de archivo más actualización de módulo.

## 10. Páginas de Actualización Histórica

Archivos:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Estado:** la decisión estructural ya se resolvió — el `SUMMARY.md` raíz mueve estos a una sección **Notas de Actualización Histórica** dedicada, y cada archivo lleva una llamada "Referencia histórica" que apunta a los lectores al Capítulo 9 para actualizaciones de 2.7.0. Ya no son orientación de actualización de primera clase.

**Trabajo restante (solo consistencia):**

- Asegúrese de que `README.md` (raíz) enumere estos bajo el mismo encabezado "Notas de Actualización Histórica", no bajo un encabezado "Actualizaciones" genérico.
- Refleje la misma separación en `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` y `en/SUMMARY.md`.
- Asegúrese de que cada página de actualización histórica (raíz y copias localizadas de `de/book/upg*.md` / `fr/book/upg*.md`) lleve una llamada de contenido obsoleto vinculándose al Capítulo 9.

## 11. Apéndice 1: Interfaz Gráfica de Admin

Archivo:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Este apéndice está vinculado a la interfaz gráfica de admin de Oxygen y necesita una reescritura.

Cambios necesarios:

- reemplazar todas las referencias de Oxygen
- reemplazar capturas de pantalla de icono/menú antiguas
- documentar los temas de admin actuales:
  - default
  - dark
  - modern
  - transition
- mencionar capacidades actuales de 2.7.0 destacadas en notas de lanzamiento:
  - capacidad de sobrecarga de plantilla en temas de admin del sistema
  - conjunto de tema de admin actualizado

## 12. Apéndice 2: Cargando XOOPS Vía FTP

Archivo:

- `appendix-2-uploading-xoops-via-ftp.md`

Cambios necesarios:

- eliminar suposiciones específicas de HostGator y cPanel
- modernizar la redacción de carga de archivos
- tenga en cuenta que `xoops_lib` ahora incluye dependencias de Composer, por lo que las cargas son más grandes y no deben ser selectivamente recortadas

## 13. Apéndice 5: Seguridad

Archivo:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Cambios necesarios:

- eliminar completamente la discusión de `register_globals`
- eliminar lenguaje de boleto de host obsoleto
- corregir texto de permisos de `404` a `0444` donde se pretende solo lectura
- actualizar la discusión de `mainfile.php` y `secure.php` para coincidir con el diseño 2.7.0
- agregar contexto de constante relacionado con seguridad de nuevo dominio de cookie:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- agregar orientación de producción para:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Impacto de Mantenimiento Entre Idiomas

Después de que se corrijan los archivos en inglés a nivel raíz, se necesitan actualizaciones equivalentes en:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

El árbol `en/` también necesita revisión porque contiene un README separado y conjunto de activos, pero parece tener solo un árbol de `book/` parcial.

## 15. Orden de Prioridad

### Crítico antes del lanzamiento

1. Actualice referencias de repositorio/versión a 2.7.0.
2. Reescriba el Capítulo 9 alrededor del flujo real de actualización de 2.7.0 y preflight de Smarty 4.
3. Actualice los requisitos del sistema a PHP 8.2+ y MySQL 5.7.8+.
4. Corrija la ruta del archivo de clave de licencia del Capítulo 7.
5. Corrija inventarios de tema y módulo.
6. Corrija el conteo de tablas del Capítulo 6 de 32 a 33.

### Importante para precisión

7. Reescriba orientación de ruta escribible.
8. Agregue requisito de cargador automático de Composer a configuración de ruta.
9. Actualice orientación de conjunto de caracteres de base de datos a `utf8mb4`.
10. Corrija la orientación de edición de ruta del Capítulo 8 para que las constantes estén documentadas en el archivo correcto.
11. Elimine instrucciones de suma de verificación.
12. Elimine `register_globals` y otra orientación de PHP muerta.

### Limpieza de calidad de lanzamiento

13. Reemplace todas las capturas de pantalla del instalador y admin.
14. Mueva las páginas de actualización histórica fuera del flujo principal.
15. Sincronice copias alemán y francés después de que se corrija el inglés.
16. Limpie enlaces obsoletos y líneas README duplicadas.

