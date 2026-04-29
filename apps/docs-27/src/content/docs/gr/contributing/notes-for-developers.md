---
title: "Σημειώσεις για προγραμματιστές"
---

Ενώ η πραγματική εγκατάσταση τουXOOPSγια ανάπτυξη, η χρήση είναι παρόμοια με την κανονική εγκατάσταση που έχει ήδη περιγραφεί, υπάρχουν βασικές διαφορές κατά την κατασκευή ενός συστήματος έτοιμου προγραμματιστή.

Μια μεγάλη διαφορά σε μια εγκατάσταση προγραμματιστή είναι ότι αντί να εστιάζει απλώς στα περιεχόμενα του καταλόγου _htdocs_, μια εγκατάσταση προγραμματιστή διατηρεί όλα τα αρχεία και τα διατηρεί υπό έλεγχο πηγαίου κώδικα χρησιμοποιώντας το git.

Μια άλλη διαφορά είναι ότι οι κατάλογοι _xoops_data_ και _xoops_lib_ μπορούν συνήθως να παραμείνουν στη θέση τους χωρίς μετονομασία, εφόσον το σύστημα ανάπτυξής σας δεν είναι άμεσα προσβάσιμο στο ανοιχτό διαδίκτυο (δηλαδή σε ιδιωτικό δίκτυο, όπως πίσω από έναν δρομολογητή.)

Οι περισσότεροι προγραμματιστές εργάζονται σε ένα σύστημα _localhost_, το οποίο έχει τον πηγαίο κώδικα, μια στοίβα διακομιστή ιστού και όλα τα εργαλεία που απαιτούνται για την εργασία με τον κώδικα και τη βάση δεδομένων.

Μπορείτε να βρείτε περισσότερες πληροφορίες στο [Tools of the Trade](../tools/tools.md) κεφάλαιο.

## Git and Virtual HostsΟι περισσότεροι προγραμματιστές θέλουν να είναι σε θέση να παραμένουν ενημερωμένοι με τις τρέχουσες πηγές και να συνεισφέρουν αλλαγές στο upstream [XOOPS/XoopsCore27αποθετήριο στο GitHub](https://github.com/XOOPS/XoopsCore27). Αυτό σημαίνει ότι αντί να κάνετε λήψη ενός αρχείου έκδοσης, θα θέλετε να [fork](https://help.github.com/articles/fork-a-repo/) αντίγραφο τουXOOPSκαι χρησιμοποιήστε το **git** για [κλωνοποίηση](https://help.github.com/categories/bootcamp/) αυτό το αποθετήριο στο πλαίσιο προγραμματιστή σας.

Εφόσον το αποθετήριο έχει μια συγκεκριμένη δομή, αντί να _αντιγράφει_ αρχεία από τον κατάλογο _htdocs_ στον διακομιστή ιστού σας, είναι καλύτερο να κατευθύνετε τον διακομιστή ιστού σας στο φάκελο htdocs μέσα στο τοπικά κλωνοποιημένο αποθετήριο. Για να το πετύχουμε αυτό, συνήθως δημιουργούμε έναν νέο _Virtual Host_, ή _vhost_ που μας οδηγείgit controlled source code.Σε ένα [WAMP](http://www.wampserver.com/) περιβάλλον, το προεπιλεγμένο [localhost](http://localhost/) η σελίδα έχει στην ενότητα _Tools_ έναν σύνδεσμο προς _Add a Virtual Host_ που οδηγεί εδώ:

![WAMPΠροσθήκη εικονικού κεντρικού υπολογιστή](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Χρησιμοποιώντας αυτό, μπορείτε να ρυθμίσετε μια καταχώρηση VirtualHost που θα πέσει απευθείας στο (ακόμα)git controlled repository.Εδώ είναι ένα παράδειγμα καταχώρισης `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

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

Μπορεί επίσης να χρειαστεί να προσθέσετε μια καταχώρηση `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Τώρα, μπορείτε να εγκαταστήσετε `http://XOOPS.localhost/` για δοκιμή, διατηρώντας το αποθετήριο ανέπαφο και τον διακομιστή web μέσα στον κατάλογο htdocs με ένα απλόURL. Επιπλέον, μπορείτε να ενημερώσετε το τοπικό σας αντίγραφο τουXOOPSστο πιο πρόσφατο master ανά πάσα στιγμή χωρίς να χρειάζεται να εγκαταστήσετε ξανά ή να αντιγράψετε αρχεία. Και, μπορείτε να κάνετε βελτιώσεις και διορθώσεις στον κώδικα για να συνεισφέρετε ξανάXOOPSμέσω του GitHub.

## Composer Dependencies

XOOPS2.7.0 χρησιμοποιεί το [Composer](https://getcomposer.org/) για τη διαχείριση τουPHP dependencies. The dependency tree lives in `htdocs/xoops_lib/` inside the source repository:

* `composer.dist.json` είναι η κύρια λίστα των εξαρτήσεων που αποστέλλονται με την έκδοση.
* `composer.json` είναι το τοπικό αντίγραφο, το οποίο μπορείτε να προσαρμόσετε για το περιβάλλον ανάπτυξής σας, εάν χρειαστεί.
* `composer.lock` καρφιτσώνει τις ακριβείς εκδόσεις, ώστε οι εγκαταστάσεις να είναι αναπαραγώγιμες.
* `vendor/` περιέχει τις εγκατεστημένες βιβλιοθήκες (Smarty 4, PHPMailer, HTMLPurifier,firebase/php-jwt, μονόλογος,symfony/var-dumper, XOOPS/XMF, XOOPS/regdomκαι άλλα).

Για ένα φρέσκοgit clone of XOOPS 2.7.0, starting from the repo root, run:

```text
cd htdocs/xoops_lib
composer install
```

Σημειώστε ότι δεν υπάρχει `composer.json ` στη ρίζα του repo — το έργο ζει κάτω ` htdocs/xoops_lib/`, άρα πρέπει ` cd` σε αυτόν τον κατάλογο πριν εκτελέσετε το Composer.

Απελευθέρωση tarballs πλοίο με `vendor/` προκατοικημένο, αλλάgit clones may not. Keep ` vendor/` intact on development installs — XOOPS will load its dependencies from there at runtime.το [XMF (XOOPSΠλαίσιο ενότητας)](https://github.com/XOOPS/xmf) πλοία βιβλιοθήκης ως αComposer dependency in 2.7.0, so you can use ` XMF\Request `, ` XMF\Database\TableLoad`, and related classes in your module code without any additional installation.## Μονάδα DebugBarXOOPSΤο 2.7.0 αποστέλλει μια ενότητα **DebugBar** που βασίζεται στο Symfony VarDumper. Προσθέτει μια γραμμή εργαλείων εντοπισμού σφαλμάτων σε σελίδες απόδοσης που εκθέτει πληροφορίες αιτημάτων, βάσης δεδομένων και προτύπων. Εγκαταστήστε το από την περιοχή διαχείρισης Ενοτήτων σε ιστότοπους ανάπτυξης και σταδιοποίησης. Μην το αφήνετε εγκατεστημένο σε δημόσιο χώρο παραγωγής, εκτός εάν το ξέρετε ότι το θέλετε.


