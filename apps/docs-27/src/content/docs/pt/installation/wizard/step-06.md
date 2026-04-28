---
title: "Configuração de Banco de Dados"
---

Esta página coleta as informações sobre o banco de dados que XOOPS usará.

Após digitar as informações solicitadas e corrigir quaisquer problemas, selecione o botão "Continuar" para prosseguir.

![Configuração de Banco de Dados do Instalador XOOPS](/xoops-docs/2.7/img/installation/installer-06.png)

## Dados Coletados Nesta Etapa

### Banco de Dados

#### Nome do banco de dados

O nome do banco de dados no host que XOOPS deve usar. O usuário do banco de dados digitado na etapa anterior deve ter todos os privilégios neste banco de dados. O instalador tentará criar este banco de dados se não existir.

#### Prefixo de tabela

Este prefixo será adicionado aos nomes de todas as novas tabelas criadas pelo XOOPS. Isto ajuda a evitar conflitos de nome se o banco de dados for compartilhado com outros aplicativos. Um prefixo único também torna mais difícil adivinhar nomes de tabela, o que tem benefícios de segurança. Se não tiver certeza, apenas mantenha o padrão

#### Conjunto de caracteres do banco de dados

O instalador assume como padrão `utf8mb4`, que suporta o intervalo Unicode completo, incluindo emoji e caracteres suplementares. Você pode selecionar um conjunto de caracteres diferente aqui, mas `utf8mb4` é recomendado para virtualmente todos os idiomas e locales e deve ser deixado como está, a menos que tenha uma razão específica para alterá-lo.

#### Colação do banco de dados

O campo colação é deixado em branco por padrão. Quando em branco, MySQL aplica a colação padrão para qualquer conjunto de caracteres selecionado acima (para `utf8mb4` isso é tipicamente `utf8mb4_general_ci` ou `utf8mb4_0900_ai_ci`, dependendo da versão MySQL). Se você precisar de uma colação específica — por exemplo, para corresponder a um banco de dados existente — selecione-a aqui. Caso contrário, deixar em branco é a escolha recomendada.
