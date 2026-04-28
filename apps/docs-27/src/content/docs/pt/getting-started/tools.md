---
title: "Ferramentas do Ofício"
---

Há muitas coisas necessárias para personalizar e manter um site XOOPS que precisam acontecer fora do XOOPS, ou são feitas mais facilmente lá.

Esta é uma lista de tipos de ferramentas que você pode querer ter disponível, juntamente com algumas sugestões de ferramentas específicas que webmasters XOOPS acharam úteis.

## Editores

Editores são uma escolha muito pessoal, e as pessoas podem ser bastante apaixonadas por seus favoritos. Apresentaremos apenas algumas das muitas possibilidades.

Para uso do XOOPS, você precisará de um editor para ajustar algumas opções de configuração, bem como personalizar um tema para seu site. Para esses usos, pode ser muito útil ter um editor que possa trabalhar com múltiplos arquivos simultaneamente, ser capaz de pesquisar e substituir em muitos arquivos e fornecer destaque de sintaxe. Você pode usar um editor muito simples e sem frills, mas estará trabalhando muito mais para realizar algumas tarefas.

**PhpStorm** de _JetBrains_ é um IDE (ambiente de desenvolvimento integrado) especificamente adaptado para desenvolvimento web PHP. _JetBrains_ tem sido muito útil no patrocínio do XOOPS, e seus produtos são favoritos de muitos desenvolvedores. É um produto comercial e pode ser proibitivo em custo para alguns webmasters novos, mas o tempo que pode economizar torna atraente para desenvolvedores experientes.

**Visual Studio Code** é um editor de código-fonte multiplataforma e gratuito da Microsoft. Ele tem suporte, integrado ou através de extensões, para tecnologias web principais, como HTML, JavaScript e PHP, tornando-o um bom ajuste para uso do XOOPS.

**Notepad++** é um contendor gratuito e respeitado nesta categoria para Windows, com usuários leais.

**Meld** não é um editor, mas compara arquivos de texto mostrando diferenças e permite mesclar alterações seletivamente e fazer pequenas edições. É muito útil ao comparar arquivos de configuração, templates de tema e é claro código PHP.

| Nome | Link | Licença | Plataforma |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Comercial | Qualquer |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Qualquer |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Qualquer |

## Cliente FTP

File Transfer Protocol (FTP,) ou uma variação dele, é usado para mover arquivos de um computador para outro. A maioria das instalações do XOOPS precisará de um cliente FTP para mover arquivos que vêm da distribuição do XOOPS para um sistema host onde o site será implantado.

**FileZilla** é um cliente FTP poderoso e gratuito disponível para a maioria das plataformas. A consistência entre plataformas o tornou a escolha para os exemplos FTP neste livro.

**PuTTY** é um cliente SSH gratuito, útil para acesso Shell a um servidor, bem como fornecendo capacidades de transferência de arquivo com SCP

**WinSCP** é um cliente FTP/SFTP/SCP para sistemas Windows.

| Nome | Link | Licença | Plataforma |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Qualquer |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

O banco de dados contém todo o conteúdo do seu site, as configurações que personalizam seu site, as informações sobre os usuários do seu site e muito mais. Proteger e manter essas informações pode ser mais fácil com algumas ferramentas extras que lidam especificamente com o banco de dados.

**phpMyAdmin** é a ferramenta mais popular baseada na web para trabalhar com bancos de dados MySQL, incluindo fazer backups únicos.

**BigDump** é uma graça para contas de hospedagem limitadas, onde ajuda na restauração de grandes dumps de backup de banco de dados evitando timeout e restrições de tamanho.

**srdb**, Search Replace DB para XOOPS é uma adaptação XOOPS de [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) de interconnect/it. É especialmente útil para alterar URLs e referências do sistema de arquivos em dados MySQL quando você está movendo um site.

| Nome | Link | Licença | Plataforma |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Qualquer |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Qualquer |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Qualquer |

## Pilhas de Desenvolvedor

Algumas plataformas, como Ubuntu, têm toda a pilha necessária para executar o XOOPS integrada, enquanto outras precisam de algumas adições.

**WAMP** e **Uniform Server Zero** são pilhas tudo-em-um para Windows.

**XAMPP**, uma pilha tudo-em-um de Apache Friends, está disponível para múltiplas plataformas.

**bitnami** oferece uma ampla gama de pilhas de aplicativos pré-construídas, incluindo imagens de máquina virtual e contêiner. Suas ofertas podem ser um recurso valioso para tentar rapidamente aplicativos (incluindo XOOPS) ou várias tecnologias web. Podem ser adequadas tanto para uso de desenvolvimento quanto de produção.

**Docker** é uma plataforma de contêiner de aplicativo, usada para criar e executar contêineres para implementar ambientes personalizados.

**Devilbox** é uma pilha de desenvolvimento baseada em Docker facilmente configurada. Oferece uma ampla gama de versões para todos os componentes da pilha e permite que os desenvolvedores testem em um ambiente reproduzível e compartilhável.

| Nome | Link | Licença | Plataforma |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Múltipla | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Múltipla | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Múltipla | Qualquer |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Múltipla | Qualquer |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Múltipla | Qualquer |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | Qualquer |
