---
title: "Cấu hình cơ sở dữ liệu"
---
Trang này thu thập thông tin về cơ sở dữ liệu mà XOOPS sẽ sử dụng.

Sau khi nhập thông tin được yêu cầu và khắc phục mọi vấn đề, hãy chọn nút "Tiếp tục" để tiếp tục.

![XOOPS Cấu hình cơ sở dữ liệu trình cài đặt](/xoops-docs/2.7/img/installation/installer-06.png)

## Dữ liệu được thu thập ở bước này

### Cơ sở dữ liệu

#### Tên cơ sở dữ liệu

Tên cơ sở dữ liệu trên máy chủ mà XOOPS nên sử dụng. Người dùng cơ sở dữ liệu đã nhập ở bước trước phải có tất cả các đặc quyền trên cơ sở dữ liệu này. Trình cài đặt sẽ cố gắng tạo cơ sở dữ liệu này nếu không tồn tại.

#### Tiền tố bảng

Tiền tố này sẽ được thêm vào tên của tất cả các bảng mới được tạo bởi XOOPS. Điều này giúp tránh xung đột tên nếu cơ sở dữ liệu được chia sẻ với các ứng dụng khác. Tiền tố duy nhất cũng khiến việc đoán tên bảng trở nên khó khăn hơn, điều này mang lại lợi ích bảo mật. Nếu bạn không chắc chắn, chỉ cần giữ mặc định

#### Bộ ký tự cơ sở dữ liệu

Trình cài đặt mặc định là `utf8mb4`, hỗ trợ phạm vi Unicode đầy đủ bao gồm biểu tượng cảm xúc và ký tự bổ sung. Bạn có thể chọn một bộ ký tự khác ở đây, nhưng `utf8mb4` được khuyên dùng cho hầu như tất cả languages và các ngôn ngữ, đồng thời nên giữ nguyên trừ khi bạn có lý do cụ thể để thay đổi.

#### Đối chiếu cơ sở dữ liệu

Trường đối chiếu được để trống theo mặc định. Khi để trống, MySQL áp dụng đối chiếu mặc định cho bất kỳ bộ ký tự nào được chọn ở trên (đối với `utf8mb4`, đây thường là `utf8mb4_general_ci` hoặc `utf8mb4_0900_ai_ci`, tùy thuộc vào phiên bản MySQL). Nếu bạn cần một đối chiếu cụ thể — ví dụ: để khớp với cơ sở dữ liệu hiện có — hãy chọn nó ở đây. Nếu không, để trống là lựa chọn được khuyến nghị.