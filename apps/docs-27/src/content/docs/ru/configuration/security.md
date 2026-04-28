---
title: "Конфигурация безопасности"
description: "Полное руководство по защите XOOPS, включая пароли, разрешения файлов, HTTPS, защиту от инъекций и аудит безопасности"
---

# Конфигурация безопасности XOOPS

Полное руководство по защите вашей установки XOOPS от угроз безопасности.

## Основные параметры безопасности

Основные области безопасности:
1. Пароли и аутентификация (сильные пароли, 2FA)
2. Разрешения файлов (ограничение доступа)
3. HTTPS и шифрование (SSL/TLS)
4. Защита от инъекций (SQL, XSS, CSRF)
5. Резервные копии и восстановление
6. Мониторинг и логирование

## Пароли и аутентификация

### Установка политики пароля

**Панель администратора > Система > Параметры > Параметры пользователя**

```
Минимальная длина пароля: 12 символов
Требовать прописные буквы: Да
Требовать числа: Да
Требовать специальные символы: Да
Срок действия пароля: 90 дней
История паролей: 5 предыдущих
```

### Сильные пароли для администратора

Используйте очень сильные пароли для учётных записей администратора:

```
✓ XOOPS@Admin#2025!Secure
✓ MyS1te#Adm!n$ecure2025
✗ admin123 (слишком простой)
✗ password (очень слабый)
```

### Двухфакторная аутентификация

Если доступно, включите 2FA:

**Панель администратора > Система > Параметры > Безопасность**

```
Двухфакторная аутентификация: Включено
Методы 2FA:
☑ Электронная почта
☑ SMS (если настроено)
☑ Приложение аутентификатора
```

## Разрешения файлов

### Установка разрешений

Правильные разрешения защищают от несанкционированного доступа:

```bash
# Директории: 755 (владелец может читать/писать, другие только читают)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# Файлы: 644 (владелец может читать/писать, другие только читают)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Специальные директории (требуют записи)
chmod 777 /var/www/html/xoops/cache
chmod 777 /var/www/html/xoops/templates_c
chmod 777 /var/www/html/xoops/uploads
chmod 777 /var/www/html/xoops/var

# Защитить mainfile.php
chmod 644 /var/www/html/xoops/mainfile.php
```

### Удалить папку установки

**КРИТИЧЕСКИ:** Папка install должна быть удалена после установки!

```bash
# Опция 1: Удалить полностью
rm -rf /var/www/html/xoops/install/

# Опция 2: Переименовать и сохранить
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Проверить удаление
ls -la /var/www/html/xoops/ | grep install
```

### Защитить чувствительные директории

Создайте файлы .htaccess, чтобы заблокировать веб-доступ:

**Файл: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

## HTTPS и шифрование

### Получить SSL сертификат

Используйте Let's Encrypt для бесплатных SSL сертификатов:

```bash
# Установить Certbot
apt-get install certbot python3-certbot-apache

# Получить сертификат
certbot certonly --apache -d your-domain.com

# Автоматическое обновление
systemctl enable certbot.timer
systemctl start certbot.timer
```

### Настроить HTTP Redirect

Перенаправьте все HTTP на HTTPS:

**Apache: /etc/apache2/sites-available/000-default.conf**

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    
    DocumentRoot /var/www/html/xoops
</VirtualHost>
```

### Обновить URL в XOOPS

**Панель администратора > Система > Параметры > Общие параметры**

```
URL сайта: https://your-domain.com/
```

## Защита от уязвимостей

### Защита от SQL-инъекций

XOOPS использует подготовленные выражения. Убедитесь, что модули следуют этому:

```php
// ✗ НЕБЕЗОПАСНО
$uid = $_GET['uid'];
$sql = "SELECT * FROM xoops_users WHERE uid = $uid";

// ✓ БЕЗОПАСНО
$uid = $_GET['uid'];
$sql = "SELECT * FROM xoops_users WHERE uid = ?";
$result = $connection->query($sql, [$uid]);
```

### Защита от XSS (кросс-сайтовые скрипты)

Всегда проверяйте пользовательский вввод:

```php
// Очищение вывода
echo htmlspecialchars($_GET['query'], ENT_QUOTES, 'UTF-8');

// Использование функций XOOPS
echo $xoops->htmlspecialchars($user_input);
```

### Защита от CSRF (подделка межсайтовых запросов)

Используйте токены CSRF в формах:

```html
<!-- В форме XOOPS -->
<form method="POST" action="">
    <input type="hidden" name="xoops_token_request" value="{$xoops_token}">
    <!-- Остальные поля формы -->
</form>
```

## Резервные копии и восстановление

### Автоматические резервные копии

Создайте скрипт резервного копирования:

```bash
#!/bin/bash
# Ежедневная резервная копия

BACKUP_DIR="/backups/xoops"
SITE_DIR="/var/www/html/xoops"
DB_NAME="xoops_db"
DB_USER="xoops_user"

# Создать директорию резервной копии
mkdir -p $BACKUP_DIR/$(date +%Y-%m-%d)

# Резервная копия файлов
tar -czf $BACKUP_DIR/$(date +%Y-%m-%d)/files.tar.gz $SITE_DIR

# Резервная копия БД
mysqldump -u $DB_USER -p $DB_NAME | gzip > $BACKUP_DIR/$(date +%Y-%m-%d)/database.sql.gz

# Удалить старые резервные копии (старше 30 дней)
find $BACKUP_DIR -maxdepth 1 -type d -mtime +30 -exec rm -rf {} \;

echo "Резервная копия завершена!"
```

Запланируйте с cron:

```bash
crontab -e
# Добавьте: 0 3 * * * /usr/local/bin/xoops-backup.sh
```

## Мониторинг безопасности

### Проверить логи безопасности

**Панель администратора > Система > Логи**

Проверьте наличие подозрительной активности:
- Неудачные попытки входа
- Несанкционированные попытки доступа
- Ошибки и исключения

### Сканирование на вредоносные ПО

Используйте инструменты сканирования:

```bash
# ClamAV сканирование
apt-get install clamav clamav-daemon

# Обновить сигнатуры
freshclam

# Сканировать сайт
clamscan -r /var/www/html/xoops

# Результаты
clamscan -r /var/www/html/xoops | grep "Infected"
```

## Контрольный список безопасности

После установки убедитесь в:

- [ ] Пароль администратора сильный (16+ символов)
- [ ] HTTPS настроен и включён
- [ ] Папка install удалена
- [ ] Разрешения файлов установлены правильно
- [ ] mainfile.php защищён
- [ ] Регулярные резервные копии автоматизированы
- [ ] Логирование и мониторинг включены
- [ ] Модули из доверенных источников
- [ ] Системы регулярно обновляются
- [ ] Тестируется процесс восстановления БД

---

**Теги:** #security #protection #encryption #passwords #backups

**Связанные статьи:**
- Index
- System-Settings
- Performance-Optimization
