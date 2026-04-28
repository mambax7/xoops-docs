---
title: "組態電子郵件"
---

![XOOPS 電子郵件組態](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS 在許多關鍵的使用者互動中依賴電子郵件，例如驗證註冊或重設密碼。因此，確保正確設定它非常重要。

組態網站電子郵件在某些情況下可能非常簡單，在其他情況下可能會令人沮喪。

以下是一些可幫助您成功設定的提示。

## 電子郵件傳遞方法

此組態部分有 4 個可能的值

* **PHP Mail()** - 最簡單的方式，如果可用的話。取決於系統的 _sendmail_ 程式。
* **sendmail** - 一個工業強度的選項，但通常因利用其他軟體中的漏洞而成為垃圾郵件目標。
* **SMTP** - 簡易郵件傳輸協定通常在新主機帳戶中因安全考慮和濫用風險而無法使用。它在很大程度上已被 SMTP Auth 取代。
* **SMTP Auth** - 具有授權的 SMTP 通常優先於純 SMTP。在這種情況下，XOOPS 以更安全的方式直接連線到郵件伺服器。

## SMTP 主機

如果您需要使用 SMTP，無論有無「Auth」，您都需要在此處指定伺服器名稱。該名稱可以是簡單主機名稱或 IP 位址，也可以包含其他連接埠和協定資訊。最簡單的情況是在與網頁伺服器相同的機器上執行的 SMTP（無驗證）伺服器的 `localhost`。

使用 SMTP Auth 時始終需要 SMTP 使用者名稱和 SMTP 密碼。在 XOOPS 組態欄位 SMTP Hosts 中，可以指定 TLS 或 SSL 以及連接埠。

這可用於連線到 Gmail 的 SMTP：`tls://smtp.gmail.com:587`

另一個使用 SSL 的範例：`ssl://mail.example.com:465`

## 疑難排解提示

有時，事情不會如我們希望的那樣順利進行。以下是一些可能有幫助的建議和資源。

### 檢查您的主機提供商文件

當您建立與提供者的主機服務時，他們應該提供有關如何存取電子郵件伺服器的資訊。當您組態 XOOPS 系統的電子郵件時，您希望有這些資訊可用。

### XOOPS 使用 PHPMailer

XOOPS 使用 [PHPMailer](https://github.com/PHPMailer/PHPMailer) 庫來傳送電子郵件。維基上的 [疑難排解](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) 部分提供了一些見解。
