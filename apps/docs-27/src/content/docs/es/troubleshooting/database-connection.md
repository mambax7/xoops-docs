---
title: "Errores de conexión a la base de datos"
description: "Guía de resolución de problemas para problemas de conexión a bases de datos de XOOPS"
---

Los errores de conexión a base de datos son entre los problemas más comunes en las instalaciones de XOOPS. Esta guía proporciona pasos de solución de problemas sistemáticos para identificar y resolver problemas de conexión.

## Mensajes de error comunes

### "No se puede conectar al servidor MySQL"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Este error típicamente indica que el servidor MySQL no se está ejecutando o no es accesible.

### "Acceso denegado para el usuario"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Esto indica credenciales de base de datos incorrectas en su configuración.

### "Base de datos desconocida"

```
Error: Unknown database 'xoops_db'
```

La base de datos especificada no existe en el servidor MySQL.

## Archivos de configuración

### Ubicación de la configuración de XOOPS

El archivo de configuración principal se encuentra en:

```
/mainfile.php
```

Configuración clave de la base de datos:

```php
// Configuración de base de datos
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'su_contraseña');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## Pasos de resolución de problemas

### Paso 1: Verificar que el servicio MySQL se está ejecutando

#### En Linux/Unix

```bash
# Comprobar si MySQL se está ejecutando
sudo systemctl status mysql

# Iniciar MySQL si no se ejecuta
sudo systemctl start mysql

# Reiniciar MySQL
sudo systemctl restart mysql
```

### Paso 2: Prueba de conectividad de MySQL

#### Usando la línea de comandos

```bash
# Prueba de conexión con credenciales
mysql -h localhost -u xoops_user -p xoops_db

# Si se solicita contraseña, introdúzcala
# El éxito muestra: mysql>

# Salir de MySQL
mysql> EXIT;
```

### Paso 3: Verificar credenciales de la base de datos

#### Verificar configuración de XOOPS

```php
// En mainfile.php, verificar estas constantes:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "Usuario: " . XOOPS_DB_USER . "\n";
echo "Puerto: " . XOOPS_DB_PORT . "\n";
echo "Base de datos: " . XOOPS_DB_NAME . "\n";
```

### Paso 4: Verificar que la base de datos existe

```bash
# Conectar a MySQL
mysql -u root -p

# Listar todas las bases de datos
SHOW DATABASES;

# Buscar su base de datos
SHOW DATABASES LIKE 'xoops_db';

# Si no se encuentra, créela
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Salir
EXIT;
```

### Paso 5: Verificar permisos del usuario

```bash
# Conectar como root
mysql -u root -p

# Verificar privilegios del usuario
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Otorgar todos los privilegios si es necesario
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Recargar privilegios
FLUSH PRIVILEGES;
```

## Problemas comunes y soluciones

### Problema 1: MySQL no se está ejecutando

**Síntomas:**
- Error de conexión rechazada
- No se puede conectar a localhost

**Soluciones:**

```bash
# Linux: Comprobar e iniciar MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problema 2: Credenciales incorrectas

**Síntomas:**
- Error "Acceso denegado"
- "usando contraseña: SÍ" o "usando contraseña: NO"

**Soluciones:**

```bash
# Restablecer contraseña (como root)
mysql -u root -p

# Cambiar contraseña de usuario
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'nueva_contraseña';

# Actualizar mainfile.php
define('XOOPS_DB_PASS', 'nueva_contraseña');
```

### Problema 3: Base de datos no creada

**Síntomas:**
- Error "base de datos desconocida"
- La instalación falló en la creación de la base de datos

**Soluciones:**

```bash
# Comprobar si la base de datos existe
mysql -u root -p -e "SHOW DATABASES;"

# Crear base de datos si falta
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Script de diagnóstico

Cree un script de diagnóstico integral:

```php
<?php
// diagnose-db.php

echo "=== Diagnóstico de base de datos de XOOPS ===\n\n";

// Comprobar constantes definidas
echo "1. Verificación de configuración:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NO DEFINIDO") . "\n";
echo "   Usuario: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NO DEFINIDO") . "\n";
echo "   Base de datos: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NO DEFINIDO") . "\n\n";

// Comprobar extensión de PHP MySQL
echo "2. Verificación de extensión:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "SÍ" : "NO") . "\n\n";

// Prueba de conexión
echo "3. Prueba de conexión:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FALLIDO: " . $conn->connect_error . "\n";
    } else {
        echo "   ÉXITO: Conectado a MySQL\n";
        echo "   Información del servidor: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPCIÓN: " . $e->getMessage() . "\n";
}

echo "\n=== Fin del diagnóstico ===\n";
?>
```

## Documentación relacionada

- White-Screen-of-Death - Resolución común de problemas WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Optimización del rendimiento de la base de datos
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Configuración inicial de XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Referencia de API de base de datos

---

**Última actualización:** 2026-01-31
**Aplica a:** XOOPS 2.5.7+
**Versiones de PHP:** 7.4+
