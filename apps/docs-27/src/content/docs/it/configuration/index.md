---
title: "Configurazione di Base"
description: "Configurazione iniziale di XOOPS incluse impostazioni mainfile.php, nome del sito, email e timezone"
---

# Configurazione di Base di XOOPS

Questa guida copre le impostazioni di configurazione essenziali per far funzionare correttamente il tuo sito XOOPS dopo l'installazione.

## Configurazione di mainfile.php

Il file `mainfile.php` contiene la configurazione critica della tua installazione XOOPS. Viene creato durante l'installazione, ma potrebbe essere necessario modificarlo manualmente.

### Ubicazione

```
/var/www/html/xoops/mainfile.php
```

### Struttura del File

```php
<?php
// Configurazione Database
define('XOOPS_DB_TYPE', 'mysqli');  // Tipo di database
define('XOOPS_DB_HOST', 'localhost');  // Host database
define('XOOPS_DB_USER', 'xoops_user');  // Utente database
define('XOOPS_DB_PASS', 'password');  // Password database
define('XOOPS_DB_NAME', 'xoops_db');  // Nome database
define('XOOPS_DB_PREFIX', 'xoops_');  // Prefisso tabelle

// Configurazione Sito
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // Percorso file system
define('XOOPS_URL', 'http://your-domain.com/xoops');  // URL web
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Percorso trusted

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Charset database
define('_CHARSET', 'UTF-8');  // Charset pagina

// Modalità Debug (impostare a 0 in produzione)
define('XOOPS_DEBUG', 0);  // Impostare a 1 per debug
?>
```

### Impostazioni Critiche Spiegate

| Impostazione | Scopo | Esempio |
|---|---|---|
| `XOOPS_DB_TYPE` | Sistema database | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Ubicazione server database | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Nome utente database | `xoops_user` |
| `XOOPS_DB_PASS` | Password database | [secure_password] |
| `XOOPS_DB_NAME` | Nome database | `xoops_db` |
| `XOOPS_DB_PREFIX` | Prefisso nome tabella | `xoops_` (permette XOOPS multipli su un DB) |
| `XOOPS_ROOT_PATH` | Percorso file system fisico | `/var/www/html/xoops` |
| `XOOPS_URL` | URL accessibile dal web | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Percorso trusted (fuori dalla root web) | `/var/www/xoops_var` |

### Modifica mainfile.php

Apri mainfile.php in un editor di testo:

```bash
# Usando nano
nano /var/www/html/xoops/mainfile.php

# Usando vi
vi /var/www/html/xoops/mainfile.php

# Usando sed (trova e sostituisci)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Modifiche Comuni a mainfile.php

**Cambia URL sito:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Abilita modalità debug (solo sviluppo):**
```php
define('XOOPS_DEBUG', 1);
```

**Cambia prefisso tabelle (se necessario):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Sposta percorso trust fuori dalla root web (avanzato):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Configurazione Pannello Admin

Configura impostazioni di base attraverso il pannello admin di XOOPS.

### Accesso alle Impostazioni di Sistema

1. Accedi al pannello admin: `http://your-domain.com/xoops/admin/`
2. Naviga a: **Sistema > Preferenze > Impostazioni Generali**
3. Modifica impostazioni (vedi sotto)
4. Fai clic su "Salva" in fondo

### Nome del Sito e Descrizione

Configura come appare il tuo sito:

```
Nome Sito: My XOOPS Site
Descrizione Sito: Un sistema di gestione dei contenuti dinamico
Slogan Sito: Costruito con XOOPS
```

### Informazioni di Contatto

Imposta i dettagli di contatto del sito:

```
Email Admin Sito: admin@your-domain.com
Nome Admin Sito: Amministratore del Sito
Email Modulo Contatti: support@your-domain.com
Email Supporto: help@your-domain.com
```

### Lingua e Regione

Imposta lingua e regione predefinite:

```
Lingua Predefinita: English
Timezone Predefinito: America/New_York  (o il tuo timezone)
Formato Data: %Y-%m-%d
Formato Ora: %H:%M:%S
```

## Configurazione Email

Configura impostazioni email per notifiche e comunicazioni utente.

### Ubicazione Impostazioni Email

**Pannello Admin:** Sistema > Preferenze > Impostazioni Email

### Configurazione SMTP

Per un'affidabile consegna email, usa SMTP invece di mail() di PHP:

```
Usa SMTP: Yes
Host SMTP: smtp.gmail.com  (o tuo provider SMTP)
Porta SMTP: 587  (TLS) o 465 (SSL)
Nome Utente SMTP: your-email@gmail.com
Password SMTP: [app_password]
Sicurezza SMTP: TLS o SSL
```

### Esempio Configurazione Gmail

Configura XOOPS per inviare email tramite Gmail:

```
Host SMTP: smtp.gmail.com
Porta SMTP: 587
Sicurezza SMTP: TLS
Nome Utente SMTP: your-email@gmail.com
Password SMTP: [Google App Password - NON password Gmail regolare]
Indirizzo Da: your-email@gmail.com
Nome Da: Nome Tuo Sito
```

**Nota:** Gmail richiede App Password, non la password Gmail:
1. Vai a https://myaccount.google.com/apppasswords
2. Genera app password per "Mail" e "Windows Computer"
3. Usa password generata in XOOPS

### Configurazione mail() di PHP (Più Semplice ma Meno Affidabile)

Se SMTP non disponibile, usa mail() di PHP:

```
Usa SMTP: No
Indirizzo Da: noreply@your-domain.com
Nome Da: Nome Tuo Sito
```

Assicurati che il server abbia sendmail o postfix configurati:

```bash
# Controlla se sendmail è disponibile
which sendmail

# Oppure controlla postfix
systemctl status postfix
```

### Impostazioni Funzione Email

Configura cosa attiva le email:

```
Invia Notifiche: Yes
Notifica Admin alla Registrazione Utente: Yes
Invia Email di Benvenuto a Nuovi Utenti: Yes
Invia Link Reset Password: Yes
Abilita Email Utente: Yes
Abilita Messaggi Privati: Yes
Notifica su Azioni Admin: Yes
```

## Configurazione Timezone

Imposta il timezone corretto per timestamp e programmazione corretti.

### Impostazione Timezone nel Pannello Admin

**Percorso:** Sistema > Preferenze > Impostazioni Generali

```
Timezone Predefinito: [Seleziona il tuo timezone]
```

**Timezone Comuni:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Verifica Timezone

Controlla il timezone attuale del server:

```bash
# Mostra timezone attuale
timedatectl

# Oppure controlla data
date +%Z

# Elenca timezone disponibili
timedatectl list-timezones
```

### Imposta Timezone di Sistema (Linux)

```bash
# Imposta timezone
timedatectl set-timezone America/New_York

# Oppure usa metodo symlink
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verifica
date
```

## Configurazione URL

### Abilita URL Puliti (URL Amichevoli)

Per URL come `/page/about` invece di `/index.php?page=about`

**Requisiti:**
- Apache con mod_rewrite abilitato
- File `.htaccess` nella root XOOPS

**Abilita nel Pannello Admin:**

1. Vai a: **Sistema > Preferenze > Impostazioni URL**
2. Spunta: "Abilita URL Amichevoli"
3. Seleziona: "Tipo URL" (Path Info o Query)
4. Salva

**Verifica che .htaccess Esista:**

```bash
cat /var/www/html/xoops/.htaccess
```

Contenuto .htaccess di esempio:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Risoluzione Problemi URL Puliti:**

```bash
# Verifica se mod_rewrite è abilitato
apache2ctl -M | grep rewrite

# Abilita se necessario
a2enmod rewrite

# Riavvia Apache
systemctl restart apache2

# Prova regola rewrite
curl -I http://your-domain.com/xoops/index.php
```

### Configura URL Sito

**Pannello Admin:** Sistema > Preferenze > Impostazioni Generali

Imposta URL corretto per il tuo dominio:

```
URL Sito: http://your-domain.com/xoops/
```

O se XOOPS è nella root:

```
URL Sito: http://your-domain.com/
```

## Ottimizzazione per Motori di Ricerca (SEO)

Configura impostazioni SEO per una migliore visibilità nei motori di ricerca.

### Meta Tag

Imposta meta tag globali:

**Pannello Admin:** Sistema > Preferenze > Impostazioni SEO

```
Meta Keywords: xoops, cms, gestione contenuti
Meta Description: Un sistema di gestione dei contenuti dinamico
```

Questi appaiono nella pagina `<head>`:

```html
<meta name="keywords" content="xoops, cms, gestione contenuti">
<meta name="description" content="Un sistema di gestione dei contenuti dinamico">
```

### Sitemap

Abilita sitemap XML per i motori di ricerca:

1. Vai a: **Sistema > Moduli**
2. Trova modulo "Sitemap"
3. Fai clic per installare e abilitare
4. Accedi a sitemap su: `/xoops/sitemap.xml`

### Robots.txt

Controlla la crawling dei motori di ricerca:

Crea `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Impostazioni Utente

Configura impostazioni predefinite relative all'utente.

### Registrazione Utente

**Pannello Admin:** Sistema > Preferenze > Impostazioni Utente

```
Consenti Registrazione Utente: Yes/No
Tipo Registrazione Utente:
  - Istantaneo (Approvazione automatica)
  - Richiesta Approvazione (Approvazione admin necessaria)
  - Verifica Email (Conferma email richiesta)

Conferma Email Richiesta: Yes/No
Metodo Attivazione Account: Automatico/Manuale
```

### Profilo Utente

```
Abilita Profili Utente: Yes
Mostra Elenco Membri: Yes
Mostra Statistiche Utente: Yes
Mostra Ultimo Orario Online: Yes
Consenti Avatar Utente: Yes
Dimensione Max Avatar: 100KB
Dimensioni Avatar: 100x100 pixel
```

### Visualizzazione Email Utente

```
Mostra Email Utente: No (per privacy)
Gli Utenti Possono Nascondere Email: Yes
Gli Utenti Possono Cambiare Avatar: Yes
Gli Utenti Possono Caricare File: Yes
```

## Configurazione Cache

Migliora le prestazioni con il caching appropriato.

### Impostazioni Cache

**Pannello Admin:** Sistema > Preferenze > Impostazioni Cache

```
Abilita Caching: Yes
Tipo Cache: File Cache (o APCu/Memcache se disponibile)
Durata Cache: 3600 secondi (1 ora)
```

### Cancella Cache

Cancella file cache vecchi:

```bash
# Cancella cache manuale
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# Dal pannello admin:
# Sistema > Dashboard > Strumenti > Cancella Cache
```

## Checklist Impostazioni Iniziali

Dopo l'installazione, configura:

- [ ] Nome e descrizione sito impostati correttamente
- [ ] Email admin configurata
- [ ] Impostazioni email SMTP configurate e testate
- [ ] Timezone impostato per la tua regione
- [ ] URL configurato correttamente
- [ ] URL puliti (URL amichevoli) abilitati se desiderato
- [ ] Impostazioni registrazione utente configurate
- [ ] Meta tag per SEO configurati
- [ ] Lingua predefinita selezionata
- [ ] Impostazioni cache abilitate
- [ ] Password utente admin è forte (16+ caratteri)
- [ ] Testa registrazione utente
- [ ] Testa funzionalità email
- [ ] Testa caricamento file
- [ ] Visita homepage e verifica aspetto

## Test Configurazione

### Testa Email

Invia un'email di test:

**Pannello Admin:** Sistema > Test Email

O manualmente:

```php
<?php
// Crea file test: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('Questa è un\'email di test da XOOPS');

if ($mailer->send()) {
    echo "Email inviata con successo!";
} else {
    echo "Fallimento invio email: " . $mailer->getError();
}
?>
```

### Testa Connessione Database

```php
<?php
// Crea file test: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connesso con successo!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query riuscita!";
    }
} else {
    echo "Connessione database fallita!";
}
?>
```

**Importante:** Cancella file test dopo il test!

```bash
rm /var/www/html/xoops/test-*.php
```

## Riepilogo File Configurazione

| File | Scopo | Metodo Modifica |
|---|---|---|
| mainfile.php | Impostazioni database e core | Editor testo |
| Pannello Admin | La maggior parte impostazioni | Interfaccia web |
| .htaccess | Riscrittura URL | Editor testo |
| robots.txt | Crawling motori di ricerca | Editor testo |

## Prossimi Passi

Dopo configurazione di base:

1. Configura impostazioni di sistema in dettaglio
2. Rafforza sicurezza
3. Esplora pannello admin
4. Crea primo contenuto
5. Configura account utente

---

**Tag:** #configurazione #setup #email #timezone #seo

**Articoli Correlati:**
- ../Installation/Installation
- System-Settings
- Security-Configuration
- Performance-Optimization
