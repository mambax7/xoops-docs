---
title: "تكوين الأمان"
description: "دليل تقوية الأمان الشامل لـ XOOPS بما في ذلك أذونات الملفات و SSL/HTTPS والمجلدات الحساسة وأفضل ممارسات الأمان"
dir: rtl
lang: ar
---

# تكوين الأمان لـ XOOPS

دليل شامل لتأمين تثبيت XOOPS ضد نقاط الضعف الويب الشائعة.

## قائمة التحقق من الأمان

قبل إطلاق موقعك، طبّق هذه تدابير الأمان:

- [ ] تم تعيين أذونات الملفات بشكل صحيح (644/755)
- [ ] تم إزالة أو حماية مجلد التثبيت
- [ ] تم حماية mainfile.php من التعديل
- [ ] تم تفعيل SSL/HTTPS على جميع الصفحات
- [ ] تم إعادة تسمية أو حماية مجلد المسؤول
- [ ] الملفات الحساسة ليست قابلة للوصول من الويب
- [ ] تم وضع قيود .htaccess
- [ ] تم أتمتة النسخ الاحتياطية المنتظمة
- [ ] تم تكوين رؤوس الأمان
- [ ] تم تفعيل حماية CSRF
- [ ] حماية حقن SQL نشطة
- [ ] تم تحديث الوحدات/الملحقات

## أمان نظام الملفات

### أذونات الملفات

الأذونات الصحيحة حرجة للأمان.

#### إرشادات الأذونات

| المسار | الأذونات | المالك | السبب |
|--------|---------|--------|-------|
| mainfile.php | 644 | root | يحتوي على بيانات اعتماد قاعدة البيانات |
| ملفات *.php | 644 | root | منع التعديل غير المصرح |
| المجلدات | 755 | root | السماح بالقراءة، منع الكتابة |
| cache/ | 777 | www-data | يجب أن يكتب خادم الويب |
| templates_c/ | 777 | www-data | القوالب المترجمة |
| uploads/ | 777 | www-data | تحميلات المستخدم |
| var/ | 777 | www-data | بيانات متغيرة |
| install/ | حذف | - | احذف بعد التثبيت |
| configs/ | 755 | root | قابل للقراءة، غير قابل للكتابة |

#### سكريبت تعيين الأذونات

```bash
#!/bin/bash
# الملف: /usr/local/bin/xoops-secure.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

# تعيين الملكية
echo "تعيين الملكية..."
chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# تعيين الأذونات الافتراضية المقيدة
echo "تعيين الأذونات الأساسية..."
find $XOOPS_PATH -type d -exec chmod 755 {} \;
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# جعل المجلدات المحددة قابلة للكتابة
echo "تعيين المجلدات القابلة للكتابة..."
chmod 777 $XOOPS_PATH/cache
chmod 777 $XOOPS_PATH/templates_c
chmod 777 $XOOPS_PATH/uploads
chmod 777 $XOOPS_PATH/var

# حماية الملفات الحساسة
echo "حماية الملفات الحساسة..."
chmod 644 $XOOPS_PATH/mainfile.php
chmod 444 $XOOPS_PATH/mainfile.php.dist  # إن كانت موجودة (قراءة فقط)

# التحقق من الأذونات
echo "التحقق من الأذونات..."
ls -la $XOOPS_PATH | grep -E "mainfile|cache|uploads|var|templates_c"

echo "اكتمل تقوية الأمان!"
```

قم بتشغيل السكريبت:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### إزالة مجلد التثبيت

**حرج:** يجب إزالة مجلد التثبيت بعد التثبيت!

```bash
# الخيار 1: احذف بالكامل
rm -rf /var/www/html/xoops/install/

# الخيار 2: أعد التسمية واحفظ كمرجع
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# التحقق من الإزالة
ls -la /var/www/html/xoops/ | grep install
```

### حماية المجلدات الحساسة

أنشئ ملفات .htaccess لحجب الوصول من الويب للمجلدات الحساسة:

**الملف: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**الملف: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**الملف: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### حماية دليل التحميل

منع تنفيذ السكريبتات في المحميل:

**الملف: /var/www/html/xoops/uploads/.htaccess**

```apache
# منع تنفيذ السكريبتات
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar|pl|py|jsp|asp|aspx|cgi|sh|bat|exe)$">
    Deny from all
</FilesMatch>

# منع قائمة الفهرس
Options -Indexes

# حماية إضافية
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/uploads/

    # حجب الملفات المريبة
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```

## تكوين SSL/HTTPS

تشفير جميع حركة المستخدمين والخادم.

### الحصول على شهادة SSL

**الخيار 1: شهادة مجانية من Let's Encrypt**

```bash
# تثبيت Certbot
apt-get install certbot python3-certbot-apache

# الحصول على الشهادة (تكوين Apache تلقائي)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# التحقق من تثبيت الشهادة
ls /etc/letsencrypt/live/your-domain.com/
```

**الخيار 2: شهادة SSL تجارية**

اتصل بمزود SSL أو المسجل:
1. اشتر شهادة SSL
2. تحقق من ملكية المجال
3. ثبت ملفات الشهادة على الخادم
4. قم بتكوين خادم الويب

### تكوين SSL لـ Apache

أنشئ الاستضافة الافتراضية HTTPS:

**الملف: /etc/apache2/sites-available/xoops-ssl.conf**

```apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/xoops

    # تكوين SSL
    SSLEngine on
    SSLProtocol TLSv1.2 TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem

    # رؤوس الأمان
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

    # قيد مجلد التثبيت
    <Directory /var/www/html/xoops/install>
        Deny from all
    </Directory>

    # السجلات
    ErrorLog ${APACHE_LOG_DIR}/xoops_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/xoops_ssl_access.log combined
</VirtualHost>

# إعادة توجيه HTTP إلى HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect 301 / https://your-domain.com/
</VirtualHost>
```

تفعيل التكوين:

```bash
# تفعيل وحدة SSL
a2enmod ssl

# تفعيل الموقع
a2ensite xoops-ssl

# عطّل الموقع غير SSL إن كان موجود
a2dissite 000-default

# اختبر التكوين
apache2ctl configtest
# يجب أن يعرض: Syntax OK

# أعد تشغيل Apache
systemctl restart apache2
```

### تكوين SSL لـ Nginx

**الملف: /etc/nginx/sites-available/xoops**

```nginx
# إعادة توجيه HTTP إلى HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# خادم HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name your-domain.com www.your-domain.com;
    root /var/www/html/xoops;
    index index.php index.html;

    # تكوين شهادة SSL
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # تكوين SSL حديث
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # رأس HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # رؤوس الأمان
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    # قيد مجلد التثبيت
    location ~ ^/(install|upgrade)/ {
        deny all;
    }

    # رفض الوصول للملفات المخفية
    location ~ /\. {
        deny all;
    }

    # خلفية PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # التخزين المؤقت للملفات الثابتة
    location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # إعادة كتابة الرابط
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # السجلات
    access_log /var/log/nginx/xoops_access.log;
    error_log /var/log/nginx/xoops_error.log;
}
```

تفعيل التكوين:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### التحقق من تثبيت HTTPS

```bash
# اختبر تكوين SSL
openssl s_client -connect your-domain.com:443 -tls1_2

# تحقق من صحة الشهادة
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# اختبار SSL/TLS على الإنترنت
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### تجديد شهادة Let's Encrypt تلقائيًا

```bash
# تفعيل التجديد التلقائي
systemctl enable certbot.timer
systemctl start certbot.timer

# اختبر عملية التجديد
certbot renew --dry-run

# تجديد يدوي إذا لزم الأمر
certbot renew --force-renewal
```

## أمان تطبيق الويب

### الحماية من حقن SQL

يستخدم XOOPS استعلامات معاملية (آمنة افتراضيًا)، لكن دائمًا:

```php
// غير آمن - لا تفعل هذا أبدًا!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// آمن - استخدم البيانات الإعدادية
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### منع Cross-Site Scripting (XSS)

طهّر دائمًا إدخال المستخدم:

```php
// غير آمن
echo $_GET['user_input'];

// آمن - استخدم وظائف تطهير XOOPS
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// أو استخدم وظائف XOOPS
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### منع Cross-Site Request Forgery (CSRF)

يتضمن XOOPS حماية رموز CSRF. ضمّن دائمًا الرموز:

```html
<!-- في النماذج -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

### تعطيل تنفيذ PHP في مجلد التحميل

منع المهاجمين من تحميل وتنفيذ PHP:

```bash
# أنشئ .htaccess في مجلد التحميل
cat > /var/www/html/xoops/uploads/.htaccess << 'EOF'
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
php_flag engine off
EOF

# بديل: اجعل التحميل يقرأ فقط
chmod 444 /var/www/html/xoops/uploads/
```

### رؤوس الأمان

تكوين رؤوس أمان HTTP المهمة:

```apache
# Strict-Transport-Security (HSTS)
# فرض HTTPS لمدة سنة واحدة
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Content-Type-Options
# منع اكتشاف نوع MIME
Header always set X-Content-Type-Options "nosniff"

# X-Frame-Options
# منع هجمات Clickjacking
Header always set X-Frame-Options "SAMEORIGIN"

# X-XSS-Protection
# حماية XSS للمتصفح
Header always set X-XSS-Protection "1; mode=block"

# Referrer-Policy
# تحكم معلومات Referrer
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content-Security-Policy
# تحكم تحميل الموارد
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'"
```

## أمان لوحة التحكم

### إعادة تسمية مجلد المسؤول

حمِ مجلد المسؤول بإعادة تسميته:

```bash
# أعد تسمية مجلد المسؤول
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# حدّث عنوان الوصول للمسؤول
# القديم: http://your-domain.com/xoops/admin/
# الجديد: http://your-domain.com/xoops/myadmin123/
```

قم بتكوين XOOPS لاستخدام المجلد المعاد تسميته:

عدّل mainfile.php:

```php
// غيّر هذا السطر
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### قائمة بيضاء IP لوصول المسؤول

قيّد وصول المسؤول إلى IPs محددة:

**الملف: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# السماح لـ IPs محددة فقط
<RequireAll>
    Require ip 192.168.1.100   # IP مكتبك
    Require ip 203.0.113.50    # IP منزلك
    Deny from all
</RequireAll>
```

أو مع Apache 2.2:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### بيانات اعتماد مسؤول قوية

فرض كلمات مرور قوية للمسؤولين:

1. استخدم 16+ حرف على الأقل
2. امزج أحرف كبيرة وصغيرة وأرقام ورموز
3. غيّر كلمة المرور بانتظام (كل 90 يومًا)
4. استخدم مدير كلمات مرور
5. فعّل المصادقة متعددة العوامل إن أمكن

### مراقبة نشاط المسؤول

فعّل تسجيل دخول المسؤول:

**لوحة التحكم > System > Preferences > User Settings**

```
تسجيل دخول المسؤول: نعم
تسجيل محاولات الدخول الفاشلة: نعم
تنبيه البريد الإلكتروني عند دخول المسؤول: نعم
```

راجع السجلات بانتظام:

```bash
# تحقق من قاعدة البيانات لمحاولات الدخول
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## الصيانة المنتظمة

### تحديث XOOPS والوحدات

احفظ XOOPS والوحدات محدثة:

```bash
# تحقق من التحديثات في لوحة التحكم
# Admin > Modules > Check for Updates

# أو عبر سطر الأوامر
cd /var/www/html/xoops
# حمّل وثبّت الإصدار الأحدث
# اتّبع دليل الترقية
```

### فحص أمان آلي

```bash
#!/bin/bash
# سكريبت تدقيق الأمان

# تحقق من أذونات الملفات
echo "التحقق من أذونات الملفات..."
find /var/www/html/xoops -type f ! -perm 644 ! -name "*.htaccess" | head -10

# تحقق من الملفات المريبة
echo "التحقق من الملفات المريبة..."
find /var/www/html/xoops -type f -name "*.php" -newer /var/www/html/xoops/install/ 2>/dev/null

# تحقق من قاعدة البيانات للنشاط المريب
echo "التحقق من محاولات الدخول الفاشلة..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```

### النسخ الاحتياطية المنتظمة

أتمتة النسخ الاحتياطية اليومية:

```bash
#!/bin/bash
# سكريبت النسخة الاحتياطية اليومية

BACKUP_DIR="/backups/xoops"
RETENTION=30  # احفظ 30 يومًا

# نسخ احتياطي لقاعدة البيانات
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# نسخ احتياطي للملفات
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/xoops --exclude=cache --exclude=templates_c

# احذف النسخ الاحتياطية القديمة
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "اكتملت النسخة الاحتياطية في $(date)"
```

جدول مع cron:

```bash
# عدّل crontab
crontab -e

# أضف سطر (يعمل يوميًا في الساعة 2 صباحًا)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## قالب قائمة فحص الأمان

استخدم هذا القالب لعمليات تدقيق الأمان المنتظمة:

```
قائمة فحص الأمان الأسبوعية
========================

التاريخ: ___________
فحصها: ___________

نظام الملفات:
[ ] الأذونات صحيحة (644/755)
[ ] مجلد التثبيت محذوف
[ ] لا توجد ملفات مريبة
[ ] mainfile.php محمي

أمان الويب:
[ ] HTTPS/SSL يعمل
[ ] رؤوس الأمان موجودة
[ ] لوحة التحكم مقيدة
[ ] تقييد تحميل الملفات نشط
[ ] محاولات الدخول مسجلة

التطبيق:
[ ] إصدار XOOPS محدث
[ ] جميع الوحدات محدثة
[ ] لا رسائل خطأ في السجلات
[ ] قاعدة البيانات محسّنة
[ ] التخزين المؤقت مسح

النسخ الاحتياطية:
[ ] نسخة احتياطية لقاعدة البيانات
[ ] نسخة احتياطية للملفات
[ ] تم اختبار النسخة الاحتياطية
[ ] تم التحقق من النسخة خارج الموقع

مشاكل عُثِرَ عليها:
1. ___________
2. ___________
3. ___________

الإجراءات المتخذة:
1. ___________
2. ___________
```

## موارد الأمان

- متطلبات الخادم
- التكوين الأساسي
- تحسين الأداء
- أفضل 10 نقاط ضعف OWASP: https://owasp.org/www-project-top-ten/

---

**علامات:** #security #ssl #https #hardening #best-practices

**المقالات ذات الصلة:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- System-Settings
- ../Installation/Upgrading-XOOPS
