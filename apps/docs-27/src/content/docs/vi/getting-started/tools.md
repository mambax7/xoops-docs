---
title: "Công cụ giao dịch"
---
Có nhiều thứ cần thiết để tùy chỉnh và duy trì trang web XOOPS cần được thực hiện bên ngoài XOOPS hoặc được thực hiện dễ dàng hơn ở đó.

Đây là danh sách các loại công cụ mà bạn có thể muốn có sẵn, cùng với một số đề xuất về các công cụ cụ thể mà quản trị viên web XOOPS thấy hữu ích.

## Biên tập viên

Biên tập viên là một lựa chọn rất cá nhân và mọi người có thể trở nên khá đam mê với sở thích của họ. Chúng tôi sẽ chỉ trình bày một vài trong số rất nhiều khả năng.

Để sử dụng XOOPS, bạn sẽ cần một trình chỉnh sửa để điều chỉnh một số tùy chọn cấu hình cũng như tùy chỉnh chủ đề cho trang web của mình. Đối với những mục đích sử dụng này, sẽ rất hữu ích nếu có một trình soạn thảo có thể làm việc với nhiều tệp cùng lúc, có thể tìm kiếm và thay thế trên nhiều tệp cũng như cung cấp tính năng đánh dấu cú pháp. Bạn có thể sử dụng một trình soạn thảo rất đơn giản, không rườm rà, nhưng bạn sẽ phải làm việc chăm chỉ hơn rất nhiều để hoàn thành một số nhiệm vụ.

**PhpStorm** từ _JetBrains_ là một IDE (môi trường phát triển tích hợp) được thiết kế riêng cho phát triển web PHP. _JetBrains_ đã rất hữu ích trong việc tài trợ cho XOOPS và các sản phẩm của nó được nhiều nhà phát triển yêu thích. Đây là một sản phẩm thương mại và có thể có giá quá cao đối với một số quản trị viên web mới, nhưng thời gian tiết kiệm được khiến nó trở nên hấp dẫn đối với các nhà phát triển có kinh nghiệm.

**Visual Studio Code** là trình chỉnh sửa mã nguồn đa nền tảng miễn phí của Microsoft. Nó có hỗ trợ, được tích hợp sẵn hoặc thông qua các tiện ích mở rộng, cho các công nghệ web cốt lõi như HTML, JavaScript và PHP, khiến nó rất phù hợp để sử dụng XOOPS.

**Notepad++** là một ứng cử viên miễn phí, được vinh danh theo thời gian trong danh mục này dành cho Windows, với những người dùng trung thành.

**Meld** không phải là trình chỉnh sửa nhưng nó so sánh các tệp văn bản thể hiện sự khác biệt và cho phép hợp nhất các thay đổi có chọn lọc và thực hiện các chỉnh sửa nhỏ. Nó rất hữu ích khi so sánh các tệp cấu hình, chủ đề templates và tất nhiên là mã PHP.

| Tên | Liên kết | Giấy phép | Nền tảng |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Thương mại | Bất kỳ |
| Mã Visual Studio | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Bất kỳ |
| Ghi chú++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Thắng |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Bất kỳ |

## Máy khách FTP

Giao thức truyền tệp (FTP) hoặc một biến thể của giao thức này được sử dụng để di chuyển tệp từ máy tính này sang máy tính khác. Hầu hết các cài đặt XOOPS sẽ cần máy khách FTP để di chuyển các tệp đến từ bản phân phối XOOPS sang hệ thống máy chủ nơi trang web sẽ được triển khai.

**FileZilla** là Ứng dụng khách FTP miễn phí và mạnh mẽ có sẵn cho hầu hết các nền tảng. Tính nhất quán đa nền tảng khiến nó trở thành lựa chọn cho các ví dụ FTP trong cuốn sách này.

**PuTTY** là ứng dụng khách SSH miễn phí, hữu ích cho việc Shell truy cập vào máy chủ cũng như cung cấp khả năng truyền tệp với SCP

**WinSCP** là ứng dụng khách FTP/SFTP/SCP dành cho hệ thống Windows.

| Tên | Liên kết | Giấy phép | Nền tảng |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Bất kỳ |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Giành chiến thắng/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDBCơ sở dữ liệu chứa tất cả nội dung trang web của bạn, cấu hình tùy chỉnh trang web của bạn, thông tin về người dùng trang web của bạn và hơn thế nữa. Việc bảo vệ và duy trì thông tin đó có thể dễ dàng hơn nhờ một số công cụ bổ sung liên quan cụ thể đến cơ sở dữ liệu.

**phpMyAdmin** là công cụ dựa trên web phổ biến nhất để làm việc với cơ sở dữ liệu MySQL, bao gồm cả việc tạo bản sao lưu một lần.

**BigDump** là một ơn trời dành cho các tài khoản lưu trữ hạn chế, nơi nó giúp khôi phục các kết xuất sao lưu cơ sở dữ liệu lớn đồng thời tránh các hạn chế về thời gian chờ và kích thước.

**srdb**, Tìm kiếm thay thế DB cho XOOPS là một phiên bản XOOPS của [Tìm kiếm và thay thế DB](https://github.com/interconnectit/Search-Replace-DB) từ kết nối/nó. Nó đặc biệt hữu ích khi thay đổi URL và tham chiếu hệ thống tệp trong dữ liệu MySQL khi bạn di chuyển một trang web.

| Tên | Liên kết | Giấy phép | Nền tảng |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Bất kỳ |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Bất kỳ |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Bất kỳ |

## Nhóm nhà phát triển

Một số nền tảng, chẳng hạn như Ubuntu, có toàn bộ ngăn xếp cần thiết để chạy XOOPS được tích hợp sẵn, trong khi những nền tảng khác cần một số bổ sung.

**WAMP** và **Uniform Server Zero** là các hệ thống tất cả trong một dành cho Windows.

**XAMPP**, một ngăn xếp tất cả trong một của Apache Friends, có sẵn cho nhiều nền tảng.

**bitnami** cung cấp nhiều loại ứng dụng dựng sẵn, bao gồm cả máy ảo và hình ảnh vùng chứa. Các dịch vụ của họ có thể là nguồn tài nguyên quý giá để dùng thử nhanh các ứng dụng (bao gồm XOOPS) hoặc các công nghệ web khác nhau. Chúng có thể phù hợp cho việc sản xuất cũng như sử dụng phát triển.

**Docker** là một nền tảng vùng chứa ứng dụng, được sử dụng để tạo và chạy các vùng chứa nhằm triển khai các môi trường tùy chỉnh. 

**Devilbox** là ngăn xếp phát triển dựa trên Docker được cấu hình dễ dàng. Nó cung cấp nhiều phiên bản cho tất cả các thành phần ngăn xếp và cho phép các nhà phát triển thử nghiệm trong môi trường có thể tái tạo và chia sẻ được. 

| Tên | Liên kết | Giấy phép | Nền tảng |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Nhiều | Thắng |
| Máy chủ thống nhất Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Nhiều | Thắng |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Nhiều | Bất kỳ |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Nhiều | Bất kỳ |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Nhiều | Bất kỳ |
| Hộp quỷ | [http://devilbox.org/](http://devilbox.org/) | MIT | Bất kỳ |