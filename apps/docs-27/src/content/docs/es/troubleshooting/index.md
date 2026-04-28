---
title: "Solución de problemas"
description: "Soluciones para problemas comunes de XOOPS, técnicas de depuración y preguntas frecuentes"
---

> Soluciones a problemas comunes y técnicas de depuración para el CMS XOOPS.

---

## 📋 Diagnóstico rápido

Antes de profundizar en problemas específicos, compruebe estas causas comunes:

1. **Permisos de archivo** - Los directorios necesitan 755, los archivos necesitan 644
2. **Versión de PHP** - Asegúrese de tener PHP 7.4+ (8.x recomendado)
3. **Registros de error** - Compruebe `xoops_data/logs/` y los registros de error de PHP
4. **Caché** - Limpie caché en Admin → Sistema → Mantenimiento

---

## 🗂️ Contenido de sección

### Problemas comunes
- Pantalla blanca de la muerte (WSOD)
- Errores de conexión a base de datos
- Errores de permiso denegado
- Fallos en la instalación de módulos
- Errores de compilación de plantilla

### Preguntas frecuentes
- FAQ de instalación
- FAQ de módulos
- FAQ de temas
- FAQ de rendimiento

### Depuración
- Habilitación del modo de depuración
- Uso del depurador Ray
- Depuración de consultas de base de datos
- Depuración de plantillas Smarty

---

## 🚨 Problemas comunes y soluciones

### Pantalla blanca de la muerte (WSOD)

**Síntomas:** Página blanca en blanco, sin mensaje de error

**Soluciones:**

1. **Habilitar visualización de error PHP temporalmente:**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Compruebe el registro de errores de PHP:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Causas comunes:**
   - Límite de memoria excedido
   - Error fatal de sintaxis PHP
   - Extensión requerida faltante

4. **Corregir problemas de memoria:**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### Errores de conexión a base de datos

**Síntomas:** "No se puede conectar a la base de datos" o similar

**Soluciones:**

1. **Verificar credenciales en mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **Probar la conexión manualmente:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **Comprobar servicio MySQL:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **Verificar permisos de usuario:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Errores de permiso denegado

**Síntomas:** No se pueden cargar archivos, no se pueden guardar configuraciones

**Soluciones:**

1. **Establecer permisos correctos:**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **Establecer la propiedad correcta:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **Comprobar SELinux (CentOS/RHEL):**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### Fallos en la instalación del módulo

**Síntomas:** El módulo no se instala, errores SQL

**Soluciones:**

1. **Compruebe los requisitos del módulo:**
   - Compatibilidad de versión de PHP
   - Extensiones de PHP requeridas
   - Compatibilidad de versión de XOOPS

2. **Instalación manual de SQL:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **Limpiar caché de módulo:**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **Compruebe la sintaxis de xoops_version.php:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### Errores de compilación de plantilla

**Síntomas:** Errores de Smarty, plantilla no encontrada

**Soluciones:**

1. **Limpiar caché de Smarty:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **Verificar sintaxis de plantilla:**
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

3. **Verificar que la plantilla existe:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **Regenerar plantillas:**
   - Admin → Sistema → Mantenimiento → Plantillas → Regenerar

---

## 🐛 Técnicas de depuración

### Habilitar modo de depuración de XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Usando el depurador Ray

Ray es una excelente herramienta de depuración para PHP:

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

### Consola de depuración de Smarty

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Registro de consultas de base de datos

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ Preguntas frecuentes

### Instalación

**P: El asistente de instalación muestra una página en blanco**
R: Compruebe los registros de error de PHP, asegúrese de que PHP tenga suficiente memoria, verifique los permisos de archivo.

**P: No se puede escribir en mainfile.php durante la instalación**
R: Establezca permisos: `chmod 666 mainfile.php` durante la instalación, luego `chmod 444` después.

**P: Las tablas de base de datos no se crearon**
R: Compruebe que el usuario de MySQL tiene privilegios CREATE TABLE, verifique que la base de datos existe.

### Módulos

**P: La página de administración del módulo está en blanco**
R: Limpie caché, compruebe admin/menu.php del módulo para errores de sintaxis.

**P: Los bloques del módulo no se muestran**
R: Compruebe permisos de bloque en Admin → Bloques, verifique que el bloque está asignado a páginas.

**P: La actualización del módulo falla**
R: Copia de seguridad de base de datos, intente actualizaciones SQL manuales, compruebe requisitos de versión.

### Temas

**P: El tema no se aplica correctamente**
R: Limpie caché de Smarty, compruebe que theme.html existe, verifique permisos de tema.

**P: El CSS personalizado no se carga**
R: Compruebe ruta de archivo, limpie caché de navegador, verifique sintaxis de CSS.

**P: Las imágenes no se muestran**
R: Compruebe rutas de imagen, verifique permisos de carpeta de carga.

### Rendimiento

**P: El sitio es muy lento**
R: Habilite almacenamiento en caché, optimice la base de datos, compruebe consultas lentas, habilite OpCache.

**P: Uso de memoria alto**
R: Aumente memory_limit, optimice consultas grandes, implemente paginación.

---

## 🔧 Comandos de mantenimiento

### Limpiar todos los cachés

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Optimización de base de datos

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Comprobar integridad de archivo

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Documentación relacionada

- Comenzar
- Mejores prácticas de seguridad
- Mapa de ruta de XOOPS 4.0

---

## 📚 Recursos externos

- [Foros de XOOPS](https://xoops.org/modules/newbb/)
- [Problemas de GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [Referencia de error de PHP](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions
