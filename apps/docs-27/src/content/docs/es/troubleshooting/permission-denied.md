---
title: "Errores de permiso denegado"
description: "Solución de problemas de permisos de archivos y directorios en XOOPS"
---

Los problemas de permisos de archivos y directorios son comunes en las instalaciones de XOOPS, especialmente después de la carga o migración del servidor. Esta guía ayuda a diagnosticar y resolver problemas de permisos.

## Entendimiento de permisos de archivos

### Conceptos básicos de permisos de Linux/Unix

Los permisos de archivos se representan como códigos de tres dígitos:

```
rwxrwxrwx
||| ||| |||
||| ||| +-- Otros (mundo)
||| +------ Grupo
+--------- Propietario

r = lectura (4)
w = escritura (2)
x = ejecución (1)

755 = rwxr-xr-x (propietario completo, grupo lectura/ejecución, otros lectura/ejecución)
644 = rw-r--r-- (propietario lectura/escritura, grupo lectura, otros lectura)
777 = rwxrwxrwx (acceso completo para todos - NO RECOMENDADO)
```

## Errores de permisos comunes

### "Permiso denegado" en carga

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "No se puede escribir archivo"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "No se puede crear directorio"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Directorios críticos de XOOPS

### Directorios que requieren permisos de escritura

| Directorio | Mínimo | Propósito |
|-----------|---------|---------|
| `/uploads` | 755 | Cargas de usuarios |
| `/cache` | 755 | Archivos de caché |
| `/templates_c` | 755 | Plantillas compiladas |
| `/var` | 755 | Datos variables |
| `mainfile.php` | 644 | Configuración (legible) |

## Solución de problemas en Linux/Unix

### Paso 1: Comprobar permisos actuales

```bash
# Comprobar permisos de archivos
ls -l /var/www/html/xoops/

# Comprobar archivo específico
ls -l /var/www/html/xoops/mainfile.php

# Comprobar permisos del directorio
ls -ld /var/www/html/xoops/uploads/
```

### Paso 2: Identificar usuario del servidor web

```bash
# Comprobar usuario de Apache
ps aux | grep -E '[a]pache|[h]ttpd'
# Usualmente: www-data (Debian/Ubuntu) o apache (RedHat/CentOS)

# Comprobar usuario de Nginx
ps aux | grep -E '[n]ginx'
# Usualmente: www-data o nginx
```

### Paso 3: Arreglar propiedad

```bash
# Establecer propiedad correcta (asumiendo usuario www-data)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Arreglar solo directorios escribibles web
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Paso 4: Arreglar permisos

#### Opción A: Permisos restrictivos (recomendado)

```bash
# Todos los directorios: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# Todos los archivos: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Excepto directorios escribibles
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### Opción B: Script todo de una vez

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Arreglando permisos de XOOPS..."

# Establecer propiedad
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Establecer permisos del directorio
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Establecer permisos de archivos
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Asegurar directorios escribibles
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "¡Hecho! Permisos arreglados."
```

## Problemas de permisos por directorio

### Directorio de cargas

**Problema:** No se pueden cargar archivos

```bash
# Solución
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Directorio de caché

**Problema:** Los archivos de caché no se escriben

```bash
# Solución
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Caché de plantillas

**Problema:** Las plantillas no se compilan

```bash
# Solución
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Solución de problemas en Windows

### Paso 1: Comprobar propiedades del archivo

1. Clic derecho en archivo → Propiedades
2. Hacer clic en la pestaña "Seguridad"
3. Hacer clic en el botón "Editar"
4. Seleccionar usuario y verificar permisos

### Paso 2: Otorgar permisos de escritura

#### Mediante GUI:

```
1. Clic derecho en carpeta → Propiedades
2. Seleccionar pestaña "Seguridad"
3. Hacer clic en "Editar"
4. Seleccionar "IIS_IUSRS" o "NETWORK SERVICE"
5. Marcar "Modificar" y "Escribir"
6. Hacer clic en "Aplicar" y "Aceptar"
```

#### Mediante línea de comandos (PowerShell):

```powershell
# Ejecutar PowerShell como Administrador

# Otorgar permisos al grupo de aplicaciones IIS
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```

## Script PHP para comprobar permisos

```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>Comprobación de permisos de XOOPS</h2>";
echo "<table border='1'>";
echo "<tr><th>Ruta</th><th>Legible</th><th>Escribible</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'SÍ' : 'NO';
    $writable = is_writable($path) ? 'SÍ' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'SÍ' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'SÍ' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```

## Mejores prácticas

### 1. Principio del menor privilegio

```bash
# Solo otorgar permisos necesarios
# No usar 777 o 666

# Malo
chmod 777 /var/www/html/xoops/uploads/  # ¡Peligroso!

# Bien
chmod 755 /var/www/html/xoops/uploads/  # Seguro
```

### 2. Copia de seguridad antes de cambios

```bash
# Hacer copia de seguridad del estado actual
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Referencia rápida

```bash
# Arreglo rápido (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Documentación relacionada

- White-Screen-of-Death - Otros errores comunes
- Database-Connection-Errors - Problemas de base de datos
- ../../01-Getting-Started/Configuration/System-Settings - Configuración de XOOPS

---

**Última actualización:** 2026-01-31
**Aplica a:** XOOPS 2.5.7+
**SO:** Linux, Windows, macOS
