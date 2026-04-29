---
title: "Ghi chú dành cho nhà phát triển"
---
Mặc dù quá trình cài đặt thực tế của XOOPS để sử dụng cho mục đích phát triển tương tự như quá trình cài đặt thông thường đã được mô tả, nhưng có những điểm khác biệt chính khi xây dựng hệ thống sẵn sàng cho nhà phát triển.

Một điểm khác biệt lớn trong bản cài đặt dành cho nhà phát triển là thay vì chỉ tập trung vào nội dung của thư mục _htdocs_, bản cài đặt dành cho nhà phát triển sẽ giữ tất cả các tệp và giữ chúng dưới sự kiểm soát mã nguồn bằng git.

Một điểm khác biệt nữa là các thư mục _xoops_data_ và _xoops_lib_ thường có thể giữ nguyên mà không cần đổi tên, miễn là hệ thống phát triển của bạn không thể truy cập trực tiếp trên internet mở (tức là trên mạng riêng, chẳng hạn như phía sau bộ định tuyến.)

Hầu hết các nhà phát triển đều làm việc trên hệ thống _localhost_, có mã nguồn, ngăn xếp máy chủ web và mọi công cụ cần thiết để làm việc với mã và cơ sở dữ liệu.

Bạn có thể tìm thêm thông tin trong chương [Công cụ giao dịch](../tools/tools.md).

## Git và máy chủ ảo

Hầu hết các nhà phát triển đều muốn có thể cập nhật các nguồn hiện tại và đóng góp các thay đổi trở lại kho lưu trữ ngược dòng [XOOPS/XoopsCore27 trên GitHub](https://github.com/XOOPS/XoopsCore27). Điều này có nghĩa là thay vì tải xuống kho lưu trữ phát hành, bạn sẽ muốn [phân nhánh](https://help.github.com/articles/fork-a-repo/) một bản sao của XOOPS và sử dụng **git** để [sao chép](https://help.github.com/categories/bootcamp/) kho lưu trữ đó vào hộp nhà phát triển của bạn.

Vì kho lưu trữ có cấu trúc cụ thể, thay vì _copying_ tệp từ thư mục _htdocs_ đến máy chủ web của bạn, tốt hơn là trỏ máy chủ web của bạn đến thư mục htdocs bên trong kho lưu trữ được sao chép cục bộ của bạn. Để hoàn thành việc này, chúng tôi thường tạo một _Virtual Host_ hoặc _vhost_ mới trỏ đến git controlled source code. của chúng tôi

Trong môi trường [WAMP](http://www.wampserver.com/), trang [localhost](http://localhost/) mặc định có trong phần _Tools_ một liên kết đến _Thêm máy chủ ảo_ dẫn đến đây:

![WAMP Thêm máy chủ ảo](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Bằng cách sử dụng điều này, bạn có thể thiết lập một mục Virtualhost sẽ thả ngay vào git controlled repository. (vẫn) của bạn

Đây là một mục ví dụ trong `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

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

Bạn cũng có thể cần thêm mục nhập trong `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Giờ đây, bạn có thể cài đặt trên `http://xoops.localhost/` để thử nghiệm, đồng thời giữ nguyên kho lưu trữ của mình và giữ máy chủ web bên trong thư mục htdocs bằng một URL đơn giản. Ngoài ra, bạn có thể cập nhật bản sao cục bộ của XOOPS lên bản gốc mới nhất bất kỳ lúc nào mà không cần phải cài đặt lại hoặc sao chép tệp. Ngoài ra, bạn có thể thực hiện các cải tiến và sửa lỗi mã để đóng góp lại cho XOOPS thông qua GitHub.

## Sự phụ thuộc của trình soạn thảo

XOOPS 2.7.0 sử dụng [Trình soạn thảo](https://getcomposer.org/) để quản lý các phần phụ thuộc PHP của nó. Cây phụ thuộc nằm trong `htdocs/xoops_lib/` bên trong kho lưu trữ nguồn:

* `composer.dist.json` là danh sách chính các phần phụ thuộc đi kèm với bản phát hành.
* `composer.json` là bản sao cục bộ mà bạn có thể tùy chỉnh cho môi trường phát triển của mình nếu cần.
* `composer.lock` ghim các phiên bản chính xác để có thể lặp lại các lượt cài đặt.
* `vendor/` chứa các thư viện đã cài đặt (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom và các thư viện khác).

Dành cho git clone of XOOPS 2.7.0, starting from the repo root, run: mới

```text
cd htdocs/xoops_lib
composer install
```Lưu ý rằng không có `composer.json` ở thư mục gốc repo — dự án nằm trong `htdocs/xoops_lib/`, vì vậy bạn phải `cd` vào thư mục đó trước khi chạy Composer.

Phát hành tarball có `vendor/` được điền sẵn nhưng git clones may not. Keep `vendor/` intact on development installs — XOOPS will load its dependencies from there at runtime.

Thư viện [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) được cung cấp dưới dạng phần phụ thuộc Composer trong 2.7.0, vì vậy bạn có thể sử dụng `Xmf\Request`, `Xmf\Database\TableLoad` và các nội dung liên quan classes trong mã mô-đun của bạn mà không cần cài đặt bổ sung.

## Mô-đun DebugBar

XOOPS 2.7.0 cung cấp mô-đun **DebugBar** dựa trên Symfony VarDumper. Nó thêm một thanh công cụ gỡ lỗi vào các trang được hiển thị để hiển thị thông tin yêu cầu, cơ sở dữ liệu và mẫu. Cài đặt nó từ khu vực Mô-đun admin trên các trang web phát triển và dàn dựng. Đừng để nó được cài đặt trên một địa điểm sản xuất công khai trừ khi bạn biết mình muốn.