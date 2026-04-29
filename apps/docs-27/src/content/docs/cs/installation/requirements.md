---
title: "Požadavky"
---

## Softwarové prostředí (stack)

Většina produkčních lokalit XOOPS běží na zásobníku _LAMP_ (**L**inuxový systém se systémem **A**pache, **M**ySQL a **P**HP), ale existuje mnoho různých možných zásobníků.

Často je nejjednodušší vytvořit prototyp nového webu na místním počítači. V tomto případě si mnoho uživatelů XOOPS vybere zásobník _WAMP_ (pomocí **W**indows jako OS), zatímco jiní používají zásobníky _LAMP_ nebo _MAMP_ (**M**AC).

### PHP

Jakákoli verze PHP > 8.2.0 (důrazně se doporučuje PHP 8.4 nebo vyšší)

> **Důležité:** XOOPS 2.7.0 vyžaduje **PHP 8.2 nebo novější**. PHP 7.xa starší již nejsou podporovány. Pokud upgradujete starší web, před zahájením se ujistěte, že váš hostitel nabízí PHP 8.2+.

### MySQL

Server MySQL 5.7 nebo vyšší (důrazně se doporučuje server MySQL 8.4 nebo vyšší.) MySQL 9.0 je také podporován. MariaDB je zpětně kompatibilní, binární drop-in náhrada MySQL a také funguje dobře se XOOPS.

### Webový server

Webový server, který podporuje spouštění skriptů PHP, jako je Apache, NGINX, LiteSpeed atd.

### Požadovaná rozšíření PHP

Instalační program XOOPS před povolením instalace ověří, zda jsou načtena následující rozšíření:

* `mysqli` — ovladač databáze MySQL
* `session` — zpracování relace
* `pcre` — Regulární výrazy kompatibilní s Perl
* `filter` — vstupní filtrování a ověřování
* `fileinfo` — detekce typu MIME pro nahrávání

### Požadovaná nastavení PHP

Kromě výše uvedených rozšíření instalační program ověří následující nastavení `php.ini`:

* `file_uploads` musí být **Zapnuto** – bez něj nemůže XOOPS přijímat nahrané soubory

### Doporučená rozšíření PHP

Instalační program také kontroluje tato rozšíření. Nejsou striktně vyžadovány, ale XOOPS a většina modulů na ně spoléhá pro plnou funkčnost. Povolte tolik, kolik váš hostitel dovolí:

* `mbstring` — zpracování vícebajtových řetězců
* `intl` — internacionalizace
* `iconv` — převod znakové sady
* Analýza `xml` — XML
* `zlib` — komprese
* `gd` — zpracování obrazu
* `exif` — metadata obrázku
* Klient `curl` — HTTP pro kanály a volání API

## Služby

### Přístup k systému souborů (pro přístup správce webu)

K přenosu distribučních souborů XOOPS na webový server budete potřebovat nějakou metodu (FTP, SFTP atd.).

### Přístup k systému souborů (pro proces webového serveru)

Ke spuštění XOOPS je nutná schopnost vytvářet, číst a mazat soubory a adresáře. Následující cesty musí být zapisovatelné procesem webového serveru pro normální instalaci a pro běžný každodenní provoz:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (lze zapisovat během instalace a upgradu)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Databáze

XOOPS bude muset vytvářet, upravovat a dotazovat se na tabulky v MySQL. K tomu budete potřebovat:

* uživatelský účet a heslo MySQL
* databáze MySQL, ke které má uživatel všechna oprávnění (nebo alternativně může mít uživatel oprávnění takovou databázi vytvořit)

### E-mail

Pro živý web budete potřebovat funkční e-mailovou adresu, kterou může XOOPS používat pro uživatelskou komunikaci, jako je aktivace účtu a resetování hesla. I když to není striktně vyžadováno, doporučuje se, pokud je to možné, použít e-mailovou adresu, která odpovídá doméně, na které váš XOOPS běží. Pomůže to zabránit tomu, aby vaše komunikace skončila odmítnutím nebo označením jako spam.

## Nástroje

Možná budete potřebovat nějaké další nástroje k nastavení a přizpůsobení instalace XOOPS. Mohou zahrnovat:

* Klientský software FTP
* Textový editor
* Archivační software pro práci se soubory verze XOOPS (_.zip_ nebo _.tar.gz_).

V části [Tools of the Trade](../tools/tools.md) naleznete několik návrhů vhodných nástrojů a zásobníků webových serverů v případě potřeby.

## Speciální témataNěkteré specifické kombinace systémového softwaru mohou vyžadovat některé další konfigurace, aby fungovaly se XOOPS. Pokud používáte prostředí SELinux nebo upgradujete starší web s vlastními motivy, další informace naleznete v části [Speciální témata](specialtopics.md).