---
title: "Salvar Configuração"
---

Esta página exibe os resultados de salvar as informações de configuração que você inseriu até este ponto.

Após revisar e corrigir quaisquer problemas, selecione o botão "Continuar" para prosseguir.

## No Sucesso

A seção _Salvando sua configuração de sistema_ mostra as informações que foram salvas. As configurações são salvas em um de dois arquivos. Um arquivo é _mainfile.php_ na raiz da web. O outro é _data/secure.php_ no diretório _xoops_data_.

![Salvar Configuração do Instalador XOOPS](/xoops-docs/2.7/img/installation/installer-07.png)

Ambos os arquivos são gerados a partir de arquivos de template fornecidos com XOOPS 2.7.0:

* `mainfile.php` é gerado a partir de `mainfile.dist.php` na raiz da web.
* `xoops_data/data/secure.php` é gerado a partir de `xoops_data/data/secure.dist.php`.

Além dos caminhos e URL que você digitou, `mainfile.php` agora inclui várias constantes que são novas no XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — mantido como alias compatível com versão anterior de `XOOPS_PATH`; você não precisa configurá-lo separadamente.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — assume como padrão `true`; usa a Lista de Sufixo Público para derivar o domínio de cookie correto.
* `XOOPS_DB_LEGACY_LOG` — assume como padrão `false`; defina como `true` em desenvolvimento para registrar o uso de APIs de banco de dados herdadas.
* `XOOPS_DEBUG` — assume como padrão `false`; defina como `true` em desenvolvimento para habilitar relatório de erro adicional.

Você não precisa editar esses manualmente durante a instalação — os padrões são apropriados para um site de produção. Eles são mencionados aqui para que você saiba o que procurar se abrir `mainfile.php` mais tarde.

## Erros

Se XOOPS detectar erros ao escrever os arquivos de configuração, ele exibirá mensagens detalhando o que está errado.

![Erros de Salvar Configuração do Instalador XOOPS](/xoops-docs/2.7/img/installation/installer-07-errors.png)

Em muitos casos, uma instalação padrão de um sistema derivado de Debian usando mod_php no Apache é a fonte de erros. A maioria dos provedores de hospedagem têm configurações que não têm esses problemas.

### Problemas de permissão de grupo

O processo PHP é executado usando as permissões de algum usuário. Os arquivos também são de propriedade de algum usuário. Se esses dois não forem o mesmo usuário, as permissões de grupo podem ser usadas para permitir que o processo PHP compartilhe arquivos com sua conta de usuário. Isto geralmente significa que você precisa alterar o grupo dos arquivos e diretórios dos quais XOOPS precisa escrever.

Para a configuração padrão mencionada acima, isto significa que o grupo _www-data_ precisa ser especificado como o grupo para os arquivos e diretórios, e esses arquivos e diretórios precisam ser graváveis por grupo.

Você deve revisar sua configuração cuidadosamente e escolher cuidadosamente como resolver esses problemas para uma caixa disponível na internet aberta.

Comandos de exemplo podem ser:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Não é possível criar mainfile.php

Em sistemas similares ao Unix, a permissão para criar um novo arquivo depende das permissões concedidas na pasta pai. Em alguns casos, essa permissão não está disponível e concedê-la pode ser uma preocupação de segurança.

Se você tem um problema de configuração, você pode encontrar um _mainfile.php_ fictício no diretório _extras_ na distribuição XOOPS. Copie esse arquivo para a raiz da web e defina as permissões no arquivo:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### Ambientes SELinux

Os contextos de segurança do SELinux podem ser uma fonte de problemas. Se isto pode se aplicar, consulte [Tópicos Especiais](../specialtopics.md) para mais informações.
