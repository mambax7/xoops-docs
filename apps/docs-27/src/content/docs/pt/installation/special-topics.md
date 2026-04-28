---
title: "Tópicos Especiais"
---

Algumas combinações específicas de software de sistema podem exigir configurações adicionais para funcionar com XOOPS. Aqui estão alguns detalhes de problemas conhecidos e orientações para lidar com eles.

## Ambientes SELinux

Certos arquivos e diretórios precisam ser graváveis durante a instalação, atualização e operação normal do XOOPS. Em um ambiente Linux tradicional, isso é realizado garantindo que o usuário do sistema no qual o servidor web é executado tenha permissões nos diretórios do XOOPS, geralmente definindo o grupo apropriado para esses diretórios.

Sistemas habilitados para SELinux (como CentOS e RHEL) têm um contexto de segurança adicional que pode restringir a capacidade de um processo de alterar o sistema de arquivos. Esses sistemas podem exigir alterações no contexto de segurança para que o XOOPS funcione corretamente.

O XOOPS espera ser capaz de escrever livremente em certos diretórios durante a operação normal. Além disso, durante instalações e atualizações do XOOPS, certos arquivos devem ser graváveis.

Durante a operação normal, o XOOPS espera ser capaz de gravar arquivos e criar subdiretórios nestes diretórios:

- `uploads` na raiz web principal do XOOPS
- `xoops_data` onde quer que seja realocado durante a instalação

Durante um processo de instalação ou atualização do XOOPS precisará escrever para este arquivo:

- `mainfile.php` na raiz web principal do XOOPS

Para um sistema típico baseado em Apache do CentOS, as mudanças de contexto de segurança podem ser realizadas com estes comandos:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

Você pode tornar mainfile.php gravável com:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Nota: Ao instalar, você pode copiar um mainfile.php vazio do diretório *extras*.

Você também deve permitir que httpd envie e-mail:

```
setsebool -P httpd_can_sendmail=1
```

Outras configurações que você pode precisar incluem:

Permitir que httpd faça conexões de rede, ou seja, buscar feeds rss ou fazer chamadas de API:

```
setsebool -P httpd_can_network_connect 1
```

Habilitar conexão de rede com um banco de dados com:

```
setsebool -P httpd_can_network_connect_db=1
```

Para obter mais informações, consulte sua documentação de sistema e/ou seu administrador de sistemas.

## Smarty 4 e Temas Personalizados

O XOOPS 2.7.0 atualizou seu mecanismo de template do Smarty 3 para **Smarty 4**. Smarty 4 é mais rigoroso sobre a sintaxe do template do que Smarty 3, e alguns padrões que foram tolerados em templates mais antigos agora causarão erros. Se você estiver instalando uma cópia nova do XOOPS 2.7.0 usando apenas os temas e módulos fornecidos com a versão, não há nada para se preocupar — cada template fornecido foi atualizado para compatibilidade com Smarty 4.

A preocupação se aplica quando você está:

- Atualizando um site XOOPS 2.5.x existente que tem temas personalizados, ou
- Instalando temas personalizados ou módulos de terceiros mais antigos no XOOPS 2.7.0.

Antes de mudar o tráfego ao vivo para um site atualizado, execute o scanner de verificação prévia que é fornecido no diretório `/upgrade/`. Ele verifica `/themes/` e `/modules/` procurando por incompatibilidades do Smarty 4 e pode reparar automaticamente muitas delas. Veja a página [Verificação Prévia](../upgrading/upgrade/preflight.md) para obter detalhes.

Se você acertar erros de template após uma instalação ou atualização:

1. Execute novamente `/upgrade/preflight.php` e resolva quaisquer problemas relatados.
2. Limpe o cache de template compilado removendo tudo exceto `index.html` de `xoops_data/caches/smarty_compile/`.
3. Mude temporariamente para um tema enviado como `xbootstrap5` ou `default` para confirmar se o problema é específico do tema em vez de um site inteiro.
4. Valide quaisquer alterações de template de tema ou módulo personalizado antes de retornar o site à produção.
