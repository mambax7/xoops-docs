---
title：“phpinfo”
---

此步骤是可选的，但可以轻松地为您节省数小时的挫败感。

作为托管系统的预-install测试，在本地创建一个非常小但有用的PHP脚本，并将其上传到目标系统。

PHP脚本只有一行：

```php
<?php phpinfo();
```

使用文本编辑器，使用这一行创建一个名为 _info.php_ 的文件。

接下来，将此文件上传到您的网络根目录。

![Filezilla info.php Upload](/XOOPS-docs/2.7/img/installation/filezilla-01-info.png)

通过在浏览器中打开脚本来访问脚本，即访问 `http://example.com/info.php`。如果一切正常，您应该看到如下所示的页面：

![phpinfo() Example](/XOOPS-docs/2.7/img/installation/php-info.png)

注意：作为安全措施，某些托管服务可能会禁用 _phpinfo()_ 功能。如果是这种情况，您通常会收到一条消息。

该脚本的输出可能会在故障排除时派上用场，因此请考虑保存它的副本。

如果测试有效，您应该可以开始安装了。您应该删除 _info.php_ 脚本，然后继续安装。

如果测试失败，请调查原因！无论什么问题阻止这个简单的测试工作**都会**阻止真正的安装工作。