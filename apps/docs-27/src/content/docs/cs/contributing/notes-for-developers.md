---
title: "Poznámky pro vývojáře"
---

While the actual installation of XOOPS for development use is similar to the normal installation already described, there are key differences when building a developer ready system.

One big difference in a developer install is that instead of just focusing on the contents of the _htdocs_ directory, a developer install keeps all of the files, and keeps them under source code control using git.

Another difference is that the _xoops_data_ and _xoops_lib_ directories can usually remain in place without renaming, as long as your development system is not directly accessible on the open internet (i.e. on a private network, such as behind a router.)

Most developers work on a _localhost_ system, that has the source code, a web server stack, and any tools needed to work with the code and database.

Více informací naleznete v kapitole [Nástroje obchodu](../tools/tools.md).

## Git a virtuální hostitelé

Most developers want to be able to stay up to date with current sources, and contribute changes back to the upstream [XOOPS/XOOPSCore27 repository on GitHub](https://github.com/XOOPS/XOOPSCore27). This means that instead of downloading a release archive, you will want to [fork](https://help.github.com/articles/fork-a-repo/) a copy of XOOPS and use **git** to [clone](https://help.github.com/categories/bootcamp/) that repository to your dev box.

Since the repository has a specific structure, instead of _copying_ files from the _htdocs_ directory to your web server, it is better to point your web server to the htdocs folder inside your locally cloned repository. Abychom toho dosáhli, obvykle vytvoříme nového _Virtual Host_ nebo _vhost_, který ukazuje na náš git controlled source code.

In a [WAMP](http://www.wampserver.com/) environment, the default [localhost](http://localhost/) page has in the _Tools_ section a link to _Add a Virtual Host_ which leads here:

![WAMP Přidat virtuálního hostitele](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Pomocí tohoto můžete nastavit položku VirtualHost, která se vloží přímo do vašeho (stálého) git controlled repository.

Zde je příklad záznamu v `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Možná budete muset přidat položku do `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Now, you can install on `http://xoops.localhost/` for testing, while keeping your repository intact, and keeping the webserver inside the htdocs directory with a simple URL. Navíc můžete svou lokální kopii XOOPS kdykoli aktualizovat na nejnovější hlavní, aniž byste museli přeinstalovat nebo kopírovat soubory. A můžete provést vylepšení a opravy kódu, abyste přispěli zpět do XOOPS až GitHub.

## Composer Závislosti

XOOPS 2.7.0 používá [Composer](https://getcomposer.org/) ke správě svých závislostí PHP. Strom závislostí žije v `htdocs/xoops_lib/` ve zdrojovém úložišti:

* `composer.dist.json` je hlavní seznam závislostí dodávaných s vydáním.
* `composer.json` je lokální kopie, kterou si můžete v případě potřeby přizpůsobit pro své vývojové prostředí.
* `composer.lock` obsahuje přesné verze, takže instalace jsou reprodukovatelné.
* `vendor/` contains the installed libraries (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom, and others).

Pro nový git clone of XOOPS 2.7.0, starting from the repo root, run:

```text
cd htdocs/xoops_lib
composer install
```

Note that there is no `composer.json` at the repo root — the project lives under `htdocs/xoops_lib/`, so you must `cd` into that directory before running Composer.

Vydání tarballů se dodává s předvyplněným `vendor/`, ale git clones may not. Keep `vendor/` intact on development installs — XOOPS will load its dependencies from there at runtime.

The [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) library ships as a Composer dependency in 2.7.0, so you can use `XMF\Request`, `XMF\Database\TableLoad`, and related classes in your module code without jakákoli dodatečná instalace.

## Modul DebugBar

XOOPS 2.7.0 dodává modul **DebugBar** založený na Symfony VarDumper. K vykresleným stránkám přidává panel nástrojů pro ladění, který odhaluje informace o požadavku, databázi a šabloně. Nainstalujte jej z oblasti pro správu modulů na vývojových a zkušebních webech. Nenechávejte jej nainstalovaný na veřejně přístupném produkčním místě, pokud nevíte, že to chcete.