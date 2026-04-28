---
title: "Outils du métier"
---

Il y a beaucoup de choses qui sont nécessaires pour personnaliser et maintenir un site Web XOOPS qui doit se produire en dehors de XOOPS, ou qui sont plus facilement faites ailleurs.

Ceci est une liste de types d'outils que vous pourriez vouloir avoir à disposition, ainsi que quelques suggestions pour des outils spécifiques que les webmestres XOOPS ont trouvés utiles.

## Éditeurs

Les éditeurs sont un choix très personnel, et les gens peuvent devenir plutôt passionnés par leurs favoris. Nous ne présentons que quelques-unes des nombreuses possibilités.

Pour l'utilisation de XOOPS, vous aurez besoin d'un éditeur pour affiner certaines options de configuration ainsi que pour personnaliser un thème pour votre site. Pour ces utilisations, il peut être très utile d'avoir un éditeur qui peut fonctionner avec plusieurs fichiers à la fois, être capable de rechercher et remplacer dans de nombreux fichiers, et fournir une mise en évidence de la syntaxe. Vous pouvez utiliser un très simple éditeur sans fioritures, mais vous travaillerez beaucoup plus dur pour accomplir certaines tâches.

**PhpStorm** de _JetBrains_ est un IDE (environnement de développement intégré) spécialement conçu pour le développement Web PHP. _JetBrains_ a été très utile pour parrainer XOOPS, et ses produits sont les favoris de nombreux développeurs. C'est un produit commercial, et il peut être prohibitif en coût pour certains nouveaux webmestres, mais le temps qu'il peut économiser le rend attrayant pour les développeurs expérimentés.

**Visual Studio Code** est un éditeur de code source gratuit et multiplateforme de Microsoft. Il a un support, soit intégré soit via des extensions, pour les technologies Web essentielles telles que HTML, JavaScript et PHP, ce qui en fait un bon choix pour l'utilisation de XOOPS.

**Notepad++** est un prétendant libre et respecté dans cette catégorie pour Windows, avec des utilisateurs fidèles.

**Meld** n'est pas un éditeur, mais il compare les fichiers texte montrant les différences, et permet de fusionner les modifications sélectivement, et de faire de petites éditions. C'est très utile pour comparer les fichiers de configuration, les modèles de thème, et bien sûr le code PHP.

| Nom | Lien | Licence | Plateforme |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Commercial | Toute |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Toute |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Toute |

## Client FTP

File Transfer Protocol (FTP), ou une variation de celui-ci, est utilisé pour déplacer des fichiers d'un ordinateur à un autre. La plupart des installations XOOPS auront besoin d'un client FTP pour déplacer les fichiers provenant de la distribution XOOPS vers un système hôte où le site sera déployé.

**FileZilla** est un client FTP puissant et gratuit disponible pour la plupart des plates-formes. La cohérence multiplateforme en a fait le choix pour les exemples FTP de ce livre.

**PuTTY** est un client SSH gratuit, utile pour l'accès Shell à un serveur, ainsi que pour fournir des capacités de transfert de fichiers avec SCP

**WinSCP** est un client FTP/SFTP/SCP pour les systèmes Windows.

| Nom | Lien | Licence | Plateforme |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Toute |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

La base de données contient tout le contenu de votre site, les configurations qui personnalisent votre site, les informations sur les utilisateurs de votre site, et plus encore. La protection et la maintenance de ces informations peuvent être plus faciles avec certains outils supplémentaires qui traitent spécifiquement de la base de données.

**phpMyAdmin** est l'outil basé sur le Web le plus populaire pour travailler avec les bases de données MySQL, y compris les sauvegardes occasionnelles.

**BigDump** est un don du ciel pour les comptes d'hébergement limités, où il aide à restaurer les grandes sauvegardes de base de données en évitant les délais d'expiration et les restrictions de taille.

**srdb**, Search Replace DB pour XOOPS est une adaptation XOOPS de [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) de interconnect/it. Il est particulièrement utile pour modifier les URL et les références du système de fichiers dans les données MySQL lors du déplacement d'un site.

| Nom | Lien | Licence | Plateforme |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Toute |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Toute |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Toute |

## Piles de développement

Certaines plates-formes, comme Ubuntu, ont la pile complète nécessaire pour exécuter XOOPS intégrée, tandis que d'autres ont besoin de quelques ajouts.

**WAMP** et **Uniform Server Zero** sont des piles tout-en-un pour Windows.

**XAMPP**, une pile tout-en-un de Apache Friends, est disponible pour plusieurs plates-formes.

**bitnami** offre une large gamme de piles d'applications prédéfinies, y compris des images de machine virtuelle et de conteneur. Leurs offres peuvent être une ressource précieuse pour essayer rapidement les applications (y compris XOOPS) ou diverses technologies Web. Elles peuvent convenir à la production ainsi qu'à l'utilisation en développement.

**Docker** est une plateforme de conteneur d'application, utilisée pour créer et exécuter des conteneurs pour mettre en œuvre des environnements personnalisés.

**Devilbox** est une pile de développement basée sur Docker facilement configurable. Elle offre une large gamme de versions pour tous les composants de la pile, et permet aux développeurs de tester dans un environnement reproductible et partageable.

| Nom | Lien | Licence | Plateforme |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Multiple | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Multiple | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Multiple | Toute |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Multiple | Toute |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Multiple | Toute |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Toute |
