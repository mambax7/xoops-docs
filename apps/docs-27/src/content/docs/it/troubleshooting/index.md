---
title: "Risoluzione dei problemi"
description: "Soluzioni per i problemi comuni di XOOPS, tecniche di debug e domande frequenti"
---

> Soluzioni a problemi comuni e tecniche di debug per XOOPS CMS.

---

## 📋 Diagnosi rapida

Prima di approfondire i problemi specifici, controlla queste cause comuni:

1. **Autorizzazioni file** - Directory hanno bisogno 755, file hanno bisogno 644
2. **Versione PHP** - Assicurati PHP 7.4+ (8.x consigliato)
3. **Log di errore** - Controlla `xoops_data/logs/` e log di errore PHP
4. **Cache** - Cancella cache in Admin → Sistema → Manutenzione

---

## 🗂️ Contenuti sezione

### Problemi comuni
- White Screen of Death (WSOD)
- Errori di connessione al database
- Errori di accesso negato
- Errori di installazione modulo
- Errori di compilazione template

### Domande frequenti
- Domande frequenti installazione
- Domande frequenti moduli
- Domande frequenti temi
- Domande frequenti prestazioni

### Debug
- Attivazione modalità debug
- Utilizzo Ray Debugger
- Debug query database
- Debug template Smarty

---

## 🚨 Problemi comuni e soluzioni

### White Screen of Death (WSOD)

**Sintomi:** Pagina bianca vuota, nessun messaggio di errore

**Soluzioni:**

1. **Abilita visualizzazione errore PHP temporaneamente:**
   ```php
   // Aggiungi a mainfile.php temporaneamente
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Controlla log di errore PHP:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Cause comuni:**
   - Limite memoria superato
   - Errore sintassi PHP fatale
   - Estensione richiesta mancante

4. **Correggi problemi memoria:**
   ```php
   // In mainfile.php o php.ini
   ini_set('memory_limit', '256M');
   ```

---

### Errori di connessione database

**Sintomi:** "Impossibile connettersi al database" o simile

**Soluzioni:**

1. **Verifica credenziali in mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'tuo_utente');
   define('XOOPS_DB_PASS', 'tua_password');
   define('XOOPS_DB_NAME', 'tuo_database');
   ```

2. **Test connessione manuale:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connessione fallita: " . $conn->connect_error);
   }
   echo "Connesso con successo";
   ```

3. **Controlla servizio MySQL:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **Verifica autorizzazioni utente:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Errori di accesso negato

**Sintomi:** Impossibile caricare file, impossibile salvare impostazioni

**Soluzioni:**

1. **Imposta autorizzazioni corrette:**
   ```bash
   # Directory
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # File
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Directory scrivibili
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **Imposta proprietà corretta:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **Controlla SELinux (CentOS/RHEL):**
   ```bash
   # Controlla stato
   sestatus

   # Consenti httpd scrivere
   setsebool -P httpd_unified 1
   ```

---

### Errori installazione modulo

**Sintomi:** Modulo non si installa, errori SQL

**Soluzioni:**

1. **Controlla requisiti modulo:**
   - Compatibilità versione PHP
   - Estensioni PHP richieste
   - Compatibilità versione XOOPS

2. **Installazione SQL manuale:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **Cancella cache modulo:**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **Controlla sintassi xoops_version.php:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### Errori compilazione template

**Sintomi:** Errori Smarty, template non trovato

**Soluzioni:**

1. **Cancella cache Smarty:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **Controlla sintassi template:**
   ```smarty
   {* Corretto *}
   {$variable}

   {* Errato - manca $ *}
   {variable}
   ```

3. **Verifica esistenza template:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **Rigenerato template:**
   - Admin → Sistema → Manutenzione → Template → Rigenera

---

## 🐛 Tecniche di debug

### Abilita modalità debug XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Livelli:
// 0 = Off
// 1 = Debug PHP
// 2 = Debug PHP + SQL
// 3 = Debug PHP + SQL + template Smarty
```

### Utilizzo Ray Debugger

Ray è un ottimo strumento di debug per PHP:

```php
// Installa tramite Composer
composer require spatie/ray --dev

// Utilizzo nel tuo codice
ray($variable);
ray($object)->expand();
ray()->measure();

// Query database
ray($sql)->label('Query');
```

### Console debug Smarty

```smarty
{* Abilita in template *}
{debug}

{* O in PHP *}
$xoopsTpl->debugging = true;
```

### Logging query database

```php
// Abilita logging query
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Ottieni tutte le query
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ Domande frequenti

### Installazione

**D: La procedura guidata di installazione mostra una pagina vuota**
R: Controlla i log di errore PHP, assicurati che PHP abbia memoria sufficiente, verifica le autorizzazioni file.

**D: Impossibile scrivere su mainfile.php durante l'installazione**
R: Imposta autorizzazioni: `chmod 666 mainfile.php` durante l'installazione, quindi `chmod 444` dopo.

**D: Tabelle database non create**
R: Controlla che l'utente MySQL abbia privilegi CREATE TABLE, verifica che il database esista.

### Moduli

**D: La pagina admin del modulo è vuota**
R: Cancella cache, controlla admin/menu.php del modulo per errori sintassi.

**D: Blocchi modulo non visibili**
R: Controlla autorizzazioni blocchi in Admin → Blocchi, verifica che il blocco sia assegnato a pagine.

**D: Aggiornamento modulo fallisce**
R: Backup database, prova aggiornamenti SQL manuali, controlla requisiti versione.

### Temi

**D: Il tema non viene applicato correttamente**
R: Cancella cache Smarty, controlla che theme.html esista, verifica autorizzazioni tema.

**D: CSS personalizzato non viene caricato**
R: Controlla percorso file, cancella cache browser, verifica sintassi CSS.

**D: Immagini non visualizzate**
R: Controlla percorsi immagini, verifica autorizzazioni cartella uploads.

### Prestazioni

**D: Il sito è molto lento**
R: Abilita caching, ottimizza database, controlla query lente, abilita OpCache.

**D: Utilizzo memoria elevato**
R: Aumenta memory_limit, ottimizza query grandi, implementa paginazione.

---

## 🔧 Comandi manutenzione

### Cancella tutti i cache

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cancellato!"
```

### Ottimizzazione database

```sql
-- Ottimizza tutte le tabelle
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Ripeti per altre tabelle

-- O ottimizza tutto in una volta
mysqlcheck -o -u user -p database
```

### Controlla integrità file

```bash
# Confronta con installazione fresca
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Documentazione correlata

- Per iniziare
- Migliori pratiche di sicurezza
- Roadmap XOOPS 4.0

---

## 📚 Risorse esterne

- [Forum XOOPS](https://xoops.org/modules/newbb/)
- [Problemi GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [Riferimento errori PHP](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions
