---
title: "Di chuyển một trang web"
---
Đây có thể là một kỹ thuật rất hữu ích để tạo nguyên mẫu một trang XOOPS mới trên hệ thống cục bộ hoặc máy chủ phát triển. Bạn cũng nên thử nghiệm bản nâng cấp XOOPS trên bản sao trang web sản xuất của mình trước tiên, đề phòng trường hợp có sự cố xảy ra. Để thực hiện những điều này, bạn cần có khả năng di chuyển trang XOOPS của mình từ trang này sang trang khác. Dưới đây là những điều bạn cần biết để di chuyển thành công trang XOOPS của bạn.

Bước đầu tiên là thiết lập môi trường trang web mới của bạn. Các mục tương tự có trong phần [Chuẩn bị trước](../installation/preparations/) cũng được áp dụng ở đây.

Khi xem xét, các bước đó là:

* có được dịch vụ lưu trữ, bao gồm mọi yêu cầu về tên miền hoặc email
* lấy tài khoản và mật khẩu người dùng MySQL
* lấy cơ sở dữ liệu MySQL mà người dùng trên có tất cả các đặc quyền trên

Phần còn lại của quá trình này khá giống với quá trình cài đặt thông thường, nhưng:

* thay vì sao chép các tệp từ bản phân phối XOOPS, bạn sẽ sao chép chúng từ trang hiện có
* thay vì chạy trình cài đặt, bạn sẽ nhập cơ sở dữ liệu đã được điền sẵn
* thay vì nhập câu trả lời vào trình cài đặt, bạn sẽ thay đổi câu trả lời trước đó trong tệp và cơ sở dữ liệu

## Sao chép các tập tin trang web hiện có

Tạo một bản sao đầy đủ các tệp của trang web hiện tại của bạn vào máy cục bộ nơi bạn có thể chỉnh sửa chúng. Nếu bạn đang làm việc với một máy chủ từ xa, bạn có thể sử dụng FTP để sao chép các tập tin. Bạn cần một bản sao để làm việc ngay cả khi trang web đang chạy trên máy cục bộ của bạn, chỉ cần tạo một bản sao khác cho các thư mục của trang web trong trường hợp đó.

Điều quan trọng cần nhớ là include các thư mục _xoops_data_ và _xoops_lib_ ngay cả khi chúng đã được đổi tên và/hoặc di dời.

Để làm cho mọi thứ mượt mà hơn, bạn nên loại bỏ bộ đệm và các tệp Smarty đã biên dịch khỏi bản sao của bạn. Các tệp này sẽ được tạo lại trong môi trường mới của bạn và có thể gây ra sự cố với thông tin cũ không chính xác được giữ lại nếu không bị xóa. Để thực hiện việc này, hãy xóa tất cả các tệp, ngoại trừ _index.html_, trong cả ba thư mục sau:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Lưu ý:** Việc xóa `smarty_compile` đặc biệt quan trọng khi di chuyển một trang web đến hoặc từ XOOPS 2.7.0. XOOPS 2.7.0 sử dụng Smarty 4 và Smarty 4 được biên dịch templates không thể hoán đổi với Smarty 3 được biên dịch templates. Việc để lại các tệp đã biên dịch cũ sẽ gây ra lỗi mẫu khi tải trang đầu tiên trên trang web mới.

### `xoops_lib` và phần phụ thuộc của trình soạn thảo

XOOPS 2.7.0 quản lý các phần phụ thuộc PHP thông qua Composer, bên trong `xoops_lib/`. Thư mục `xoops_lib/vendor/` chứa các thư viện của bên thứ ba mà XOOPS cần trong thời gian chạy (Smarty 4, PHPMailer, HTMLPurifier, v.v.). Khi di chuyển một trang web, bạn phải sao chép toàn bộ cây `xoops_lib/` — bao gồm `vendor/` — sang máy chủ mới. Không cố gắng tạo lại `vendor/` trên máy chủ đích trừ khi bạn là nhà phát triển đã tùy chỉnh `composer.json` và có sẵn Trình soạn thảo trên máy chủ đích.

## Thiết lập môi trường mớiCác mục tương tự có trong phần [Chuẩn bị trước](../installation/preparations/) cũng được áp dụng ở đây. Ở đây chúng tôi sẽ giả định rằng bạn có bất kỳ dịch vụ lưu trữ nào bạn cần cho trang web bạn đang di chuyển.

### Thông tin chính (mainfile.php và safe.php)

Di chuyển thành công một trang web bao gồm việc thay đổi mọi tham chiếu đến tên tệp và đường dẫn tuyệt đối, URL, tham số cơ sở dữ liệu và thông tin xác thực truy cập.

Hai tệp, `mainfile.php` trong thư mục gốc của trang web và `data/secure.php` trong thư mục _xoops_data_ của trang web (đã được đổi tên và/hoặc di dời) xác định các tham số cơ bản của trang web, chẳng hạn như URL, vị trí nằm trong hệ thống tệp máy chủ và cách nó kết nối với cơ sở dữ liệu.

Bạn sẽ cần biết cả giá trị trong hệ thống cũ và giá trị của chúng trong hệ thống mới.

#### mainfile.php

| Tên | Giá trị cũ trong mainfile.php | Giá trị mới trong mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Mở _mainfile.php_ trong trình chỉnh sửa của bạn. Thay đổi các giá trị cho các định nghĩa được hiển thị trong biểu đồ ở trên từ các giá trị cũ thành các giá trị thích hợp cho trang web mới.

Hãy ghi lại những giá trị cũ và mới, vì chúng ta sẽ cần thực hiện những thay đổi tương tự ở những nơi khác trong một số bước sau.

Ví dụ: nếu bạn đang di chuyển một trang web từ PC cục bộ sang dịch vụ lưu trữ thương mại, các giá trị của bạn có thể trông như sau:

| Tên | Giá trị cũ trong mainfile.php | Giá trị mới trong mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | ví dụ.com |

Sau khi bạn thay đổi _mainfile.php_, hãy lưu nó.

Có thể một số tệp khác có thể chứa các tham chiếu được mã hóa cứng đến URL của bạn hoặc thậm chí cả các đường dẫn. Điều này có nhiều khả năng xảy ra trong các menu và themes được tùy chỉnh, nhưng với trình chỉnh sửa của mình, bạn có thể tìm kiếm trên tất cả các tệp để đảm bảo.

Trong trình chỉnh sửa của bạn, hãy thực hiện tìm kiếm trên các tệp trong bản sao của bạn, tìm kiếm giá trị XOOPS_URL cũ và thay thế bằng giá trị mới.

Thực hiện tương tự với giá trị XOOPS_ROOT_PATH cũ, thay thế tất cả các lần xuất hiện bằng giá trị mới.

Hãy giữ lại các ghi chú của bạn vì chúng ta sẽ phải sử dụng lại chúng sau này khi di chuyển cơ sở dữ liệu.

#### dữ liệu/bảo mật.php

| Name | Old Value in data/secure.php | New Value in data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Mở _data/secure.php_ trong thư mục _xoops_data_ đã được đổi tên và/hoặc di dời trong trình chỉnh sửa của bạn. Thay đổi các giá trị cho các định nghĩa được hiển thị trong biểu đồ ở trên từ các giá trị cũ thành các giá trị thích hợp cho trang web mới.

#### Các tập tin khác

Có thể có các tệp khác cần được chú ý khi trang web của bạn di chuyển. Một số ví dụ phổ biến là khóa API cho các dịch vụ khác nhau có thể được liên kết với miền, chẳng hạn như:

* Bản đồ Google
* Chụp lại 2
* Nút thích
* Chia sẻ liên kết và/hoặc quảng cáo như Shareaholic hoặc AddThisViệc thay đổi các loại liên kết này không thể dễ dàng được tự động hóa vì các kết nối đến miền cũ thường là một phần của quá trình đăng ký ở phía dịch vụ. Trong một số trường hợp, việc này có thể chỉ đơn giản là thêm hoặc thay đổi miền được liên kết với dịch vụ.

### Sao chép tệp vào trang web mới

Sao chép các tập tin đã được sửa đổi vào trang web mới của bạn. Các kỹ thuật này giống như đã được sử dụng trong [Cài đặt](../installation/installation/), tức là sử dụng FTP.

## Sao chép cơ sở dữ liệu trang web hiện có

### Sao lưu cơ sở dữ liệu từ máy chủ cũ

Đối với bước này, bạn nên sử dụng _phpMyAdmin_. Đăng nhập vào _phpMyAdmin_ cho trang web hiện tại của bạn, chọn cơ sở dữ liệu của bạn và chọn _Export_.

Cài đặt mặc định thường ổn nên chỉ cần chọn "Phương thức xuất" của _Quick_ và "Định dạng" của _SQL_.

Sử dụng nút _Go_ để tải xuống bản sao lưu cơ sở dữ liệu.

![Xuất cơ sở dữ liệu bằng phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Nếu bạn có các bảng trong cơ sở dữ liệu không phải từ XOOPS hoặc modules của nó và KHÔNG được di chuyển, bạn nên chọn "Phương thức xuất" của _Custom_ và chỉ chọn các bảng liên quan đến XOOPS trong cơ sở dữ liệu của mình. (Chúng bắt đầu bằng "tiền tố" mà bạn đã chỉ định trong quá trình cài đặt. Bạn có thể tra cứu tiền tố cơ sở dữ liệu của mình trong tệp `xoops_data/data/secure.php`.)

### Khôi phục cơ sở dữ liệu về máy chủ mới

Trên máy chủ mới của bạn, sử dụng cơ sở dữ liệu mới, khôi phục cơ sở dữ liệu bằng [công cụ](../tools/tools.md), chẳng hạn như tab _Import_ trong _phpMyAdmin_ (hoặc _bigdump_ nếu cần.)

### Cập nhật URL và đường dẫn trong cơ sở dữ liệu

Cập nhật mọi liên kết http tới tài nguyên trên trang web của bạn trong cơ sở dữ liệu. Đây có thể là một nỗ lực rất lớn và có một [công cụ](../tools/tools.md) để thực hiện việc này dễ dàng hơn.

Kết nối/nó có một sản phẩm tên là Search-Replace-DB có thể trợ giúp việc này. Nó đi kèm với nhận thức về môi trường Wordpress và Drupal được tích hợp sẵn. Như vậy, công cụ này có thể rất hữu ích, nhưng thậm chí còn tốt hơn khi nó nhận biết được XOOPS của bạn. Bạn có thể tìm thấy phiên bản nhận biết XOOPS tại [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Làm theo hướng dẫn trong tệp README.md để tải xuống và cài đặt tạm thời tiện ích này trên trang web của bạn. Trước đó, chúng tôi đã thay đổi định nghĩa XOOPS_URL. Khi chạy công cụ này, bạn muốn thay thế định nghĩa XOOPS_URL ban đầu bằng định nghĩa mới, tức là thay thế [http://localhost/xoops](http://localhost/xoops) bằng [https://example.com](https://example.com)

![Sử dụng Tìm kiếm và Thay thế DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Nhập URL cũ và mới của bạn rồi chọn tùy chọn chạy khô. Xem lại các thay đổi và nếu mọi thứ đều ổn, hãy chọn tùy chọn chạy trực tiếp. Bước này sẽ nắm bắt các mục cấu hình và liên kết bên trong nội dung đề cập đến trang web URL của bạn.

![Xem lại các thay đổi trong SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Lặp lại quy trình bằng cách sử dụng các giá trị cũ và mới của bạn cho XOOPS_ROOT_PATH.

#### Phương pháp thay thế không có SRDB

Một cách khác để hoàn thành bước này mà không cần công cụ srdb là kết xuất cơ sở dữ liệu của bạn, chỉnh sửa kết xuất trong trình soạn thảo văn bản bằng cách thay đổi URL và đường dẫn, sau đó tải lại cơ sở dữ liệu từ kết xuất đã chỉnh sửa của bạn. Đúng, quá trình đó có đủ sự tham gia và mang đủ rủi ro đến mức mọi người có động lực tạo ra các công cụ chuyên dụng như Search-Replace-DB.

## Hãy thử trang web đã di dời của bạn

Tại thời điểm này, trang web của bạn đã sẵn sàng để chạy trong môi trường mới!Tất nhiên, luôn có thể có vấn đề. Đừng ngại đăng bất kỳ câu hỏi nào trên [Diễn đàn xoops.org](https://xoops.org/modules/newbb/index.php).