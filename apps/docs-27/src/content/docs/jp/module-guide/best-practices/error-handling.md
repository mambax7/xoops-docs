---
title: "エラーハンドリングのベストプラクティス"
description: "例外管理、ログ、ユーザーフレンドリーなエラーメッセージ"
---

# XOOPSのエラーハンドリングのベストプラクティス

適切なエラーハンドリングはアプリケーション信頼性、デバッグ、ユーザー体験に重要です。

## 例外の階層

```php
<?php
// ベース例外
class ModuleException extends \Exception
{
    protected $statusCode = 500;
    
    public function __construct($message = '', $code = 0, $statusCode = 500)
    {
        parent::__construct($message, $code);
        $this->statusCode = $statusCode;
    }
    
    public function getStatusCode()
    {
        return $this->statusCode;
    }
}

// 特定の例外
class ValidationException extends ModuleException
{
    protected $statusCode = 400;
    private $errors = [];
    
    public function __construct($message, $errors = [])
    {
        parent::__construct($message, 0, 400);
        $this->errors = $errors;
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
}

class NotFoundException extends ModuleException
{
    protected $statusCode = 404;
}

class UnauthorizedException extends ModuleException
{
    protected $statusCode = 403;
}
?>
```

## Try-Catchパターン

```php
<?php
class UserService
{
    public function createUser($username, $email, $password)
    {
        try {
            // 検証
            $this->validate($username, $email, $password);
            
            // ユーザー作成
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
            $user->setPassword($password);
            
            // 保存
            $userId = $this->userRepository->save($user);
            
            return $userId;
            
        } catch (ValidationException $e) {
            \xoops_logger()->error($e->getMessage());
            throw $e;
            
        } catch (\Exception $e) {
            \xoops_logger()->critical($e->getMessage());
            throw new \RuntimeException('Failed to create user');
        }
    }
}
?>
```

## エラーのログ記録

```php
<?php
class ErrorHandler
{
    public static function logError($message, $context = [])
    {
        \xoops_logger()->error($message, $context);
    }
    
    public static function logException(\Exception $e)
    {
        $context = [
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ];
        
        \xoops_logger()->critical($e->getMessage(), $context);
    }
}
?>
```

## ユーザーフレンドリーなエラーメッセージ

```php
<?php
class ErrorHandler
{
    public static function getUserMessage(\Exception $e)
    {
        switch (true) {
            case $e instanceof ValidationException:
                return $e->getMessage();
                
            case $e instanceof NotFoundException:
                return '要求されたリソースが見つかりません。';
                
            case $e instanceof UnauthorizedException:
                return 'このアクションを実行する権限がありません。';
                
            default:
                return '予期しないエラーが発生しました。';
        }
    }
    
    public static function getStatusCode(\Exception $e)
    {
        if (method_exists($e, 'getStatusCode')) {
            return $e->getStatusCode();
        }
        return 500;
    }
}
?>
```

## コントローラーでのエラーハンドリング

```php
<?php
class UserController
{
    public function registerAction()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return [];
            }
            
            $userId = $this->userService->register(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return ['success' => true, 'userId' => $userId];
            
        } catch (\Exception $e) {
            ErrorHandler::logException($e);
            
            return [
                'success' => false,
                'message' => ErrorHandler::getUserMessage($e),
                'statusCode' => ErrorHandler::getStatusCode($e),
            ];
        }
    }
}
?>
```

## ベストプラクティス

- 特定の例外型を作成
- 早く投げる、後で捕捉
- コンテキストを含むすべての例外をログ
- ユーザーフレンドリーなメッセージを提供
- 一貫したエラー応答形式を使用
- エラーハンドリングパスをテスト
- 機密情報をユーザーに公開しない

## 関連ドキュメント

関連トピック:
- コード組織 - プロジェクト構造
- テスト - エラーテスト戦略
- ../Patterns/Service-Layer - サービス例外

---

タグ: #best-practices #error-handling #exceptions #logging #module-development
