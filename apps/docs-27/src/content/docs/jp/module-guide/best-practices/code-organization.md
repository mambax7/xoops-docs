---
title: "コード組織のベストプラクティス"
description: "モジュール構造、命名規約、PSR-4オートローディング"
---

# XOOPSのコード組織のベストプラクティス

適切なコード組織は保守性、スケーラビリティ、チーム協力に不可欠です。

## モジュールディレクトリ構造

適切に整理されたXOOPSモジュールは以下の構造に従うべきです:

```
mymodule/
├── xoops_version.php           # モジュールメタデータ
├── index.php                    # フロントエンドエントリーポイント
├── admin.php                    # 管理者エントリーポイント
├── class/
│   ├── Controller/             # リクエストハンドラー
│   ├── Handler/                # データハンドラー
│   ├── Repository/             # データアクセス
│   ├── Entity/                 # ドメインオブジェクト
│   ├── Service/                # ビジネスロジック
│   ├── DTO/                    # データ転送オブジェクト
│   └── Exception/              # カスタム例外
├── templates/                  # Smartyテンプレート
│   ├── admin/                  # 管理者テンプレート
│   └── blocks/                 # ブロックテンプレート
├── assets/
│   ├── css/                    # スタイルシート
│   ├── js/                     # JavaScript
│   └── images/                 # 画像
├── sql/                        # データベーススキーマ
├── tests/                      # ユニット・統合テスト
├── docs/                       # ドキュメント
└── composer.json              # Composer設定
```

## 命名規約

### PHP命名標準（PSR-12）

```
クラス:      パスカルケース         (UserController, PostRepository)
メソッド:    キャメルケース          (getUserById, createUser)
プロパティ:   キャメルケース          ($userId, $username)
定数:        大文字スネークケース   (DEFAULT_LIMIT, MAX_USERS)
関数:        スネークケース         (get_user_data, validate_email)
ファイル:    パスカルケース.php     (UserController.php)
```

### ファイルとディレクトリの組織

- 1ファイルに1クラス
- ファイル名はクラス名と一致
- ディレクトリ構造は名前空間の階層と一致
- 関連クラスを一緒に保つ
- モジュール全体で一貫した命名を使用

## PSR-4オートローディング

### Composer設定

```json
{
  "autoload": {
    "psr-4": {
      "Xoops\\Module\\Mymodule\\": "class/"
    }
  }
}
```

### 手動オートローダー

```php
<?php
class Autoloader
{
    public static function register()
    {
        spl_autoload_register([self::class, 'autoload']);
    }
    
    public static function autoload($class)
    {
        $prefix = 'Xoops\\Module\\Mymodule\\';
        if (strpos($class, $prefix) !== 0) {
            return;
        }
        
        $relative = substr($class, strlen($prefix));
        $file = __DIR__ . '/' . 
                str_replace('\\', '/', $relative) . '.php';
        
        if (file_exists($file)) {
            require $file;
        }
    }
}
?>
```

## ベストプラクティス

### 1. 単一責任
- 各クラスは変更する理由を1つ持つべき
- 関心事を異なるクラスに分離
- クラスはフォーカスされており、結合度は高い

### 2. 一貫した命名
- 意味のある、説明的な名前を使用
- PSR-12コーディング標準に従う
- 明白な場合を除き、略語は避ける
- 一貫したパターンを使用

### 3. ディレクトリ組織
- 関連クラスをグループ化
- 関心事をサブディレクトリに分離
- テンプレートと資産を整理
- 一貫したファイル命名を使用

### 4. 名前空間の使用
- すべてのクラスに適切な名前空間を使用
- PSR-4オートローディングに従う
- 名前空間はディレクトリ構造と一致

### 5. 設定管理
- 設定をconfigディレクトリに一元化
- 環境ベースの設定を使用
- 設定をハードコードしない

## モジュールブートストラップ

```php
<?php
class Bootstrap
{
    private static $serviceContainer;
    private static $initialized = false;
    
    public static function initialize()
    {
        if (self::$initialized) {
            return;
        }
        
        global $xoopsDB;
        self::$serviceContainer = new ServiceContainer($xoopsDB);
        self::$initialized = true;
    }
    
    public static function getServiceContainer()
    {
        if (!self::$initialized) {
            self::initialize();
        }
        return self::$serviceContainer;
    }
}
?>
```

## 関連ドキュメント

関連トピック:
- エラーハンドリング - 例外管理
- テスト - テスト組織
- ../Patterns/MVC-Pattern - コントローラー構造

---

タグ: #best-practices #code-organization #psr-4 #module-development
