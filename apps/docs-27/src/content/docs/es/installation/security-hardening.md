---
title: "Apéndice 5: Aumenta la seguridad de tu instalación de XOOPS"
---

Después de instalar XOOPS 2.7.0, toma los siguientes pasos para endurecerlo. Cada paso es opcional individualmente, pero juntos elevan significativamente la seguridad base de la instalación.

## 1. Instala y configura el módulo Protector

El módulo `protector` incluido es el firewall de XOOPS. Si no lo instalaste durante el asistente inicial, instálalo ahora desde la pantalla Admin → Módulos.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Abre el panel de admin de Protector y revisa las advertencias que muestra. Las directivas PHP heredadas como `register_globals` ya no existen (PHP 8.2+ las ha eliminado), así que ya no verás esas advertencias. Las advertencias actuales generalmente se relacionan con permisos de directorio, configuración de sesión, y configuración de trust-path.

## 2. Asegura `mainfile.php` y `secure.php`

Cuando el instalador termina intenta marcar ambos archivos como de solo lectura, pero algunos hosts revierten los permisos. Verifica y reaplicalos si es necesario:

- `mainfile.php` → `0444` (propietario, grupo, otros de solo lectura)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` define los constantes de ruta (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) y banderas de producción. `secure.php` contiene las credenciales de base de datos:

- En 2.5.x, las credenciales de base de datos solían vivir en `mainfile.php`. Ahora se almacenan en `xoops_data/data/secure.php`, que se carga por `mainfile.php` en tiempo de ejecución. Mantener `secure.php` dentro de `xoops_data/` — un directorio que se te anima a reubicar fuera de la raíz del documento — hace que sea mucho más difícil para un atacante llegar a las credenciales sobre HTTP.

## 3. Mueve `xoops_lib/` y `xoops_data/` fuera de la raíz del documento

Si aún no lo has hecho, mueve estos dos directorios un nivel arriba de tu raíz web y renómbralos. Luego actualiza los constantes correspondientes en `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Colocar estos directorios fuera de la raíz del documento previene acceso directo al árbol `vendor/` de Composer, plantillas cacheadas, archivos de sesión, datos cargados, y las credenciales de base de datos en `secure.php`.

## 4. Configuración del dominio de cookie

XOOPS 2.7.0 introduce dos constantes de dominio de cookie en `mainfile.php`:

```php
// Usa la Lista de Sufijo Público (PSL) para derivar el dominio registrable.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Dominio de cookie explícito; puede estar en blanco, el host completo, o el dominio registrable.
define('XOOPS_COOKIE_DOMAIN', '');
```

Directrices:

- Deja `XOOPS_COOKIE_DOMAIN` en blanco si sirves XOOPS desde un único nombre de host o desde una IP.
- Usa el host completo (p. ej. `www.example.com`) para alcanzar cookies a ese nombre de host solamente.
- Usa el dominio registrable (p. ej. `example.com`) cuando quieras que las cookies se compartan a través de `www.example.com`, `blog.example.com`, etc.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` permite que XOOPS divida correctamente TLDs compuestos (`co.uk`, `com.au`, …) en lugar de accidentalmente establecer una cookie en el TLD efectivo.

## 5. Banderas de producción en `mainfile.php`

`mainfile.dist.php` viene con estas dos banderas establecidas a `false` para producción:

```php
define('XOOPS_DB_LEGACY_LOG', false); // deshabilita registro de uso SQL heredado
define('XOOPS_DEBUG',         false); // deshabilita avisos de depuración
```

Déjalas desactivadas en producción. Habilitaalas temporalmente en un entorno de desarrollo o preparación cuando quieras:

- cazar llamadas de base de datos heredadas restantes (`XOOPS_DB_LEGACY_LOG = true`);
- superficie avisos `E_USER_DEPRECATED` y otra salida de depuración (`XOOPS_DEBUG = true`).

## 6. Elimina el instalador

Después de que la instalación se complete:

1. Elimina cualquier directorio `install_remove_*` renombrado de la raíz web.
2. Elimina cualquier script `install_cleanup_*.php` que el asistente creó durante la limpieza.
3. Confirma que el directorio `install/` ya no sea alcanzable sobre HTTP.

Dejar un directorio del instalador deshabilitado pero presente es un riesgo de baja severidad pero evitable.

## 7. Mantén XOOPS y los módulos actualizados

XOOPS sigue un ciclo de parche regular. Suscríbete al repositorio GitHub de XoopsCore27 para notificaciones de lanzamiento, y actualiza tu sitio y cualquier módulo de terceros siempre que se lance una nueva versión. Las actualizaciones de seguridad para 2.7.x se publican a través de la página Releases del repositorio.
