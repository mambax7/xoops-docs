---
title: "phpinfo"
---

Cette étape est optionnelle, mais peut facilement vous économiser des heures de frustration.

Comme un test pré-installation du système d'hébergement, un très petit, mais utile script PHP est créé localement et chargé vers le système cible.

Le script PHP n'est que d'une ligne :

```php
<?php phpinfo();
```

En utilisant un éditeur de texte, créez un fichier nommé _info.php_ avec cette une ligne.

Ensuite, chargez ce fichier vers votre racine web.

![Filezilla info.php Upload](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Accédez à votre script en l'ouvrant dans votre navigateur, c'est-à-dire en accédant à `http://example.com/info.php`. Si tout fonctionne correctement, vous devriez voir une page comme celle-ci :

![phpinfo() Example](/xoops-docs/2.7/img/installation/php-info.png)

Remarque : certains services d'hébergement peuvent désactiver la fonction _phpinfo()_ comme mesure de sécurité. Vous recevrez généralement un message à cet effet, si c'est le cas.

La sortie du script peut être utile pour le dépannage, alors considérez à sauvegarder une copie.

Si le test fonctionne, vous devriez être bon pour l'installation. Vous devriez supprimer le script _info.php_ et procéder à l'installation.

Si le test échoue, enquêter pourquoi ! Tout problème empêchant ce simple test de fonctionner **empêchera** une installation réelle de fonctionner.
