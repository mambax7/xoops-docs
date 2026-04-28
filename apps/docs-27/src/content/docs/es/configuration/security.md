---
title: "Configuración de Seguridad"
description: "Guía completa de endurecimiento de seguridad para XOOPS incluyendo permisos de archivo, SSL/HTTPS, directorios sensibles y mejores prácticas de seguridad"
---

# Configuración de Seguridad de XOOPS

Guía integral para asegurar su instalación de XOOPS contra vulnerabilidades web comunes.

## Lista de Verificación de Seguridad

Antes de lanzar su sitio, implemente estas medidas de seguridad:

- [ ] Permisos de archivo configurados correctamente (644/755)
- [ ] Carpeta de instalación eliminada o protegida
- [ ] mainfile.php protegido de modificación
- [ ] SSL/HTTPS habilitado en todas las páginas
- [ ] Carpeta de administración renombrada o protegida
- [ ] Archivos sensibles no accesibles por web
- [ ] Restricciones .htaccess en su lugar
- [ ] Copias de seguridad automáticas
- [ ] Encabezados de seguridad configurados
- [ ] Protección CSRF habilitada
- [ ] Protecciones contra inyección SQL activas
- [ ] Módulos/extensiones actualizados

## Seguridad del Sistema de Archivos

### Permisos de Archivo

Los permisos de archivo correctos son críticos para la seguridad.

#### Directrices de Permisos

| Ruta | Permisos | Propietario | Razón |
|---|---|---|---|
| mainfile.php | 644 | root | Contiene credenciales de BD |
| Archivos *.php | 644 | root | Prevenir modificación no autorizada |
| Directorios | 755 | root | Permitir lectura, prevenir escritura |
| cache/ | 777 | www-data | El servidor web debe escribir |
| templates_c/ | 777 | www-data | Plantillas compiladas |
| uploads/ | 777 | www-data | Cargas de usuario |
| var/ | 777 | www-data | Datos variables |
| install/ | Eliminar | - | Eliminar después de la instalación |
| configs/ | 755 | root | Legible, no escribible |

#### Script de Establecimiento de Permisos

```bash
#!/bin/bash
# Archivo: /usr/local/bin/xoops-secure.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

# Establecer propiedad
echo "Estableciendo propiedad..."
chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Establecer permisos restrictivos predeterminados
echo "Estableciendo permisos base..."
find $XOOPS_PATH -type d -exec chmod 755 {} \;
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Hacer escribibles directorios específicos
echo "Estableciendo directorios escribibles..."
chmod 777 $XOOPS_PATH/cache
chmod 777 $XOOPS_PATH/templates_c
chmod 777 $XOOPS_PATH/uploads
chmod 777 $XOOPS_PATH/var

# Proteger archivos sensibles
echo "Protegiendo archivos sensibles..."
chmod 644 $XOOPS_PATH/mainfile.php
chmod 444 $XOOPS_PATH/mainfile.php.dist  # Si existe (solo lectura)

# Verificar permisos
echo "Verificando permisos..."
ls -la $XOOPS_PATH | grep -E "mainfile|cache|uploads|var|templates_c"

echo "¡Endurecimiento de seguridad completado!"
```

Ejecutar el script:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### Eliminar Carpeta de Instalación

**CRÍTICO:** ¡La carpeta de instalación debe ser eliminada después de la instalación!

```bash
# Opción 1: Eliminar completamente
rm -rf /var/www/html/xoops/install/

# Opción 2: Renombrar y conservar para referencia
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verificar eliminación
ls -la /var/www/html/xoops/ | grep install
```

### Proteger Directorios Sensibles

Crear archivos .htaccess para bloquear acceso web a carpetas sensibles:

**Archivo: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**Archivo: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**Archivo: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### Proteger Directorio de Carga

Prevenir ejecución de scripts en cargas:

**Archivo: /var/www/html/xoops/uploads/.htaccess**

```apache
# Prevenir ejecución de script
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar|pl|py|jsp|asp|aspx|cgi|sh|bat|exe)$">
    Deny from all
</FilesMatch>

# Prevenir listado de directorio
Options -Indexes

# Protección adicional
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/uploads/

    # Bloquear archivos sospechosos
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```

## Configuración de SSL/HTTPS

Encriptar todo el tráfico entre usuarios y su servidor.

### Obtener Certificado SSL

**Opción 1: Certificado Gratuito de Let's Encrypt**

```bash
# Instalar Certbot
apt-get install certbot python3-certbot-apache

# Obtener certificado (auto-configura Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verificar certificado instalado
ls /etc/letsencrypt/live/your-domain.com/
```

**Opción 2: Certificado SSL Comercial**

Contactar proveedor de SSL o registrador:
1. Comprar certificado SSL
2. Verificar propiedad de dominio
3. Instalar archivos de certificado en servidor
4. Configurar servidor web

### Configuración de SSL de Apache

Crear host virtual HTTPS:

**Archivo: /etc/apache2/sites-available/xoops-ssl.conf**

```apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/xoops

    # Configuración SSL
    SSLEngine on
    SSLProtocol TLSv1.2 TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem

    # Encabezados de Seguridad
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"

    <Directory /var/www/html/xoops>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Restringir carpeta de instalación
    <Directory /var/www/html/xoops/install>
        Deny from all
    </Directory>

    # Registro
    ErrorLog ${APACHE_LOG_DIR}/xoops_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/xoops_ssl_access.log combined
</VirtualHost>

# Redirigir HTTP a HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect 301 / https://your-domain.com/
</VirtualHost>
```

Habilitar la configuración:

```bash
# Habilitar módulo SSL
a2enmod ssl

# Habilitar sitio
a2ensite xoops-ssl

# Desactivar sitio no-SSL si existe
a2dissite 000-default

# Probar configuración
apache2ctl configtest
# Debe mostrar: Syntax OK

# Reiniciar Apache
systemctl restart apache2
```

### Configuración de SSL de Nginx

**Archivo: /etc/nginx/sites-available/xoops**

```nginx
# Redireccionamiento de HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Servidor HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name your-domain.com www.your-domain.com;
    root /var/www/html/xoops;
    index index.php index.html;

    # Configuración del Certificado SSL
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Configuración SSL Moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Encabezado HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Encabezados de Seguridad
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    # Restringir carpeta de instalación
    location ~ ^/(install|upgrade)/ {
        deny all;
    }

    # Negar acceso a archivos sensibles
    location ~ /\. {
        deny all;
    }

    # Backend PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Caché de archivos estáticos
    location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Reescritura de URL
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Registro
    access_log /var/log/nginx/xoops_access.log;
    error_log /var/log/nginx/xoops_error.log;
}
```

Habilitar la configuración:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Verificar Instalación de HTTPS

```bash
# Probar configuración SSL
openssl s_client -connect your-domain.com:443 -tls1_2

# Verificar validez del certificado
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# Prueba SSL/TLS en línea
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### Auto-Renovación del Certificado Let's Encrypt

```bash
# Habilitar auto-renovación
systemctl enable certbot.timer
systemctl start certbot.timer

# Probar proceso de renovación
certbot renew --dry-run

# Renovación manual si es necesario
certbot renew --force-renewal
```

## Seguridad de Aplicación Web

### Proteger Contra Inyección SQL

XOOPS utiliza consultas parametrizadas (seguro por defecto), pero siempre:

```php
// INSEGURO - ¡Nunca hagas esto!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SEGURO - Usar declaraciones preparadas
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### Prevención de Cross-Site Scripting (XSS)

Siempre sanitizar entrada de usuario:

```php
// INSEGURO
echo $_GET['user_input'];

// SEGURO - Usar funciones de sanitización de XOOPS
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// O usar funciones de XOOPS
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### Prevención de Cross-Site Request Forgery (CSRF)

XOOPS incluye protección de token CSRF. Siempre incluir tokens:

```html
<!-- En formularios -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

### Deshabilitar Ejecución de PHP en Carpeta de Carga

Prevenir que atacantes suban y ejecuten PHP:

```bash
# Crear .htaccess en carpeta de cargas
cat > /var/www/html/xoops/uploads/.htaccess << 'EOF'
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
php_flag engine off
EOF

# Alternativa: Deshabilitar ejecución globalmente en cargas
chmod 444 /var/www/html/xoops/uploads/  # Solo lectura
```

### Encabezados de Seguridad

Configurar encabezados HTTP de seguridad importantes:

```apache
# Strict-Transport-Security (HSTS)
# Fuerza HTTPS por 1 año
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Content-Type-Options
# Previene olfateo de tipo MIME
Header always set X-Content-Type-Options "nosniff"

# X-Frame-Options
# Previene ataques de clickjacking
Header always set X-Frame-Options "SAMEORIGIN"

# X-XSS-Protection
# Protección XSS del navegador
Header always set X-XSS-Protection "1; mode=block"

# Referrer-Policy
# Controla información del referrer
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content-Security-Policy
# Controla carga de recursos
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'"
```

## Seguridad del Panel de Administración

### Renombrar Carpeta de Administración

Proteger carpeta de administración renombrándola:

```bash
# Renombrar carpeta de administración
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Actualizar URL de acceso de administración
# Antiguo: http://your-domain.com/xoops/admin/
# Nuevo: http://your-domain.com/xoops/myadmin123/
```

Configurar XOOPS para usar carpeta renombrada:

Editar mainfile.php:

```php
// Cambiar esta línea
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### Lista Blanca de IP para Administración

Restringir acceso de administración a IPs específicas:

**Archivo: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# Permitir solo IPs específicas
<RequireAll>
    Require ip 192.168.1.100   # Su IP de oficina
    Require ip 203.0.113.50    # Su IP de hogar
    Deny from all
</RequireAll>
```

O con Apache 2.2:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### Credenciales Fuertes de Administrador

Aplicar contraseñas fuertes para administradores:

1. Usar al menos 16 caracteres
2. Mezclar mayúsculas, minúsculas, números, símbolos
3. Cambiar contraseña regularmente (cada 90 días)
4. Usar un gestor de contraseñas
5. Habilitar autenticación de dos factores si está disponible

### Supervisar Actividad de Administración

Habilitar registro de inicio de sesión de administración:

**Panel de Administración > Sistema > Preferencias > Configuración de Usuario**

```
Registrar Inicios de Sesión de Administración: Sí
Registrar Intentos de Inicio de Sesión Fallidos: Sí
Alerta por Correo Electrónico en Inicio de Sesión de Administración: Sí
```

Revisar registros regularmente:

```bash
# Verificar base de datos para intentos de inicio de sesión
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## Mantenimiento Regular

### Actualizar XOOPS y Módulos

Mantener XOOPS y todos los módulos actualizados:

```bash
# Verificar actualizaciones en panel de administración
# Admin > Módulos > Verificar Actualizaciones

# O por línea de comando
cd /var/www/html/xoops
# Descargar e instalar versión más reciente
# Seguir guía de actualización
```

### Escaneo de Seguridad Automatizado

```bash
#!/bin/bash
# Script de auditoría de seguridad

# Verificar permisos de archivo
echo "Verificando permisos de archivo..."
find /var/www/html/xoops -type f ! -perm 644 ! -name "*.htaccess" | head -10

# Verificar archivos sospechosos
echo "Verificando archivos sospechosos..."
find /var/www/html/xoops -type f -name "*.php" -newer /var/www/html/xoops/install/ 2>/dev/null

# Verificar base de datos para actividad sospechosa
echo "Verificando intentos de inicio de sesión fallidos..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```

### Copias de Seguridad Regulares

Automatizar copias de seguridad diarias:

```bash
#!/bin/bash
# Script de copia de seguridad diaria

BACKUP_DIR="/backups/xoops"
RETENTION=30  # Mantener 30 días

# Copia de seguridad de base de datos
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# Copia de seguridad de archivos
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/xoops --exclude=cache --exclude=templates_c

# Eliminar copias de seguridad antiguas
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "Copia de seguridad completada a $(date)"
```

Programar con cron:

```bash
# Editar crontab
crontab -e

# Añadir línea (se ejecuta diariamente a las 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## Plantilla de Lista de Verificación de Seguridad

Usar esta plantilla para auditorías de seguridad regulares:

```
Lista de Verificación de Seguridad Semanal
========================

Fecha: ___________
Verificado por: ___________

Sistema de Archivos:
[ ] Permisos correctos (644/755)
[ ] Carpeta de instalación eliminada
[ ] Sin archivos sospechosos
[ ] mainfile.php protegido

Seguridad Web:
[ ] HTTPS/SSL funcionando
[ ] Encabezados de seguridad presentes
[ ] Panel de administración restringido
[ ] Restricciones de carga de archivo activas
[ ] Intentos de inicio de sesión registrados

Aplicación:
[ ] Versión de XOOPS actualizada
[ ] Todos los módulos actualizados
[ ] Sin mensajes de error en registros
[ ] Base de datos optimizada
[ ] Caché limpio

Copias de Seguridad:
[ ] Base de datos respaldada
[ ] Archivos respaldados
[ ] Copia de seguridad probada
[ ] Copia fuera del sitio verificada

Problemas Encontrados:
1. ___________
2. ___________
3. ___________

Acciones Tomadas:
1. ___________
2. ___________
```

## Recursos de Seguridad

- Requisitos del Servidor
- Configuración Básica
- Optimización del Rendimiento
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**Etiquetas:** #security #ssl #https #hardening #best-practices

**Artículos Relacionados:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- System-Settings
- ../Installation/Upgrading-XOOPS
