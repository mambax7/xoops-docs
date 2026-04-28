---
title: "Apêndice 3: Traduzindo XOOPS para um Idioma Local"
---

XOOPS 2.7.0 é enviado apenas com arquivos de idioma em inglês. Traduções para outros idiomas são mantidas pela comunidade e distribuídas através do GitHub e dos vários sites de suporte XOOPS locais.

## Onde encontrar traduções existentes

- **GitHub** — traduções comunitárias são cada vez mais publicadas como repositórios separados sob a [organização XOOPS](https://github.com/XOOPS) e em contas de contribuidores individuais. Procure no GitHub por `xoops-language-<seu-idioma>` ou navegue pela organização XOOPS para pacotes atuais.
- **Sites de suporte XOOPS locais** — muitas comunidades XOOPS regionais publicam traduções em seus próprios sites. Visite [https://xoops.org](https://xoops.org) e siga os links para comunidades locais.
- **Traduções de módulo** — traduções para módulos comunitários individuais normalmente ficam ao lado do próprio módulo na organização GitHub `XoopsModules25x` (o `25x` no nome é histórico; módulos lá são mantidos tanto para XOOPS 2.5.x quanto para 2.7.x).

Se uma tradução para seu idioma já existe, solte os diretórios de idioma em sua instalação XOOPS (veja "Como instalar uma tradução" abaixo).

## O que precisa ser traduzido

XOOPS 2.7.0 mantém arquivos de idioma ao lado do código que os consome. Uma tradução completa cobre todos esses locais:

- **Core** — `htdocs/language/english/` — constantes usadas em todo o site (login, erros comuns, datas, modelos de mail, etc.).
- **Instalador** — `htdocs/install/language/english/` — strings mostradas pelo assistente de instalação. Traduza estas *antes* de executar o instalador se quiser uma experiência de instalação localizada.
- **Módulo de sistema** — `htdocs/modules/system/language/english/` — de longe o maior conjunto; cobre todo o Painel de Controle de administrador.
- **Módulos inclusos** — cada um de `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` e `htdocs/modules/debugbar/language/english/`.
- **Temas** — alguns temas inclusos enviam seus próprios arquivos de idioma; verifique `htdocs/themes/<theme>/language/` se existir.

Uma tradução "somente core" é a unidade útil mínima e corresponde aos dois primeiros pontos acima.

## Como traduzir

1. Copie o diretório `english/` ao lado dele e renomeie a cópia para seu idioma. O nome do diretório deve ser o nome em inglês minúsculo do idioma (`spanish`, `german`, `french`, `japanese`, `arabic`, etc.).

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. Abra cada arquivo `.php` no novo diretório e traduza os **valores de string** dentro das chamadas `define()`. **Não** altere os nomes das constantes — eles são referenciados do código PHP em todo o core.

   ```php
   // Antes:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // Depois (Espanhol):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **Salve cada arquivo como UTF-8 *sem* BOM.** XOOPS 2.7.0 usa `utf8mb4` de ponta a ponta (banco de dados, sessões, saída) e rejeita arquivos com marca de ordem de byte. No Notepad++ isso é a opção **"UTF-8"**, *não* "UTF-8-BOM". No VS Code é o padrão; apenas confirme a codificação na barra de status.

4. Atualize os metadados de idioma e conjunto de caracteres no topo de cada arquivo para corresponder ao seu idioma:

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Tradutor: Seu Nome
   ```

   `_LANGCODE` deve ser o código [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) para seu idioma. `_CHARSET` é sempre `UTF-8` em XOOPS 2.7.0 — não há mais uma variante ISO-8859-1.

5. Repita para o instalador, o módulo de sistema e quaisquer módulos inclusos que você precise.

## Como instalar uma tradução

Se você obteve uma tradução concluída como uma árvore de diretórios:

1. Copie cada diretório `<language>/` para o `language/english/` pai correspondente em sua instalação XOOPS. Por exemplo, copie `language/spanish/` para `htdocs/language/`, `install/language/spanish/` para `htdocs/install/language/` e assim por diante.
2. Certifique-se de que a propriedade do arquivo e as permissões são legíveis pelo servidor web.
3. Selecione o novo idioma no momento da instalação (o assistente examina `htdocs/language/` para idiomas disponíveis) ou, em um site existente, altere o idioma em **Admin → System → Preferences → General Settings**.

## Compartilhando sua tradução de volta

Por favor, contribua sua tradução de volta para a comunidade.

1. Crie um repositório GitHub (ou faça fork de um repositório de idioma existente se um existir para seu idioma).
2. Use um nome claro como `xoops-language-<código-idioma>` (ex: `xoops-language-es`, `xoops-language-pt-br`).
3. Espelhe a estrutura de diretório XOOPS dentro de seu repositório para que os arquivos se alinhem com onde são copiados:

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. Inclua um `README.md` documentando:
   - Nome do idioma e código ISO
   - Compatibilidade de versão XOOPS (ex: `XOOPS 2.7.0+`)
   - Tradutor e créditos
   - Se a tradução é somente core ou cobre módulos inclusos
5. Abra um pull request contra o repositório relevante de módulo/core no GitHub ou poste um anúncio em [https://xoops.org](https://xoops.org) para que a comunidade possa encontrá-lo.

> **Nota**
>
> Se seu idioma requer mudanças no core para formatação de data ou calendário, inclua essas mudanças no pacote também. Idiomas com scripts da direita para esquerda (árabe, hebraico, persa, urdu) funcionam imediatamente em XOOPS 2.7.0 — suporte RTL foi adicionado nesta release e temas individuais o adquirem automaticamente.
