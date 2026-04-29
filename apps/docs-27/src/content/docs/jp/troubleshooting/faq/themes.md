---
title: "テーマ FAQ"
description: "XOOPS テーマについてのよくある質問"
---

# テーマ よくある質問

> XOOPS テーマ、カスタマイズ、管理についてのよくある質問と回答。

---

## テーマ インストールと有効化

### Q: XOOPS に新しいテーマをインストールするには？

**A:**
1. テーマ zip ファイルをダウンロード
2. XOOPS 管理 > 外観 > テーマ に移動
3. 「アップロード」をクリックして zip ファイルを選択
4. テーマがテーマリストに表示
5. クリックしてサイトで有効化

別の方法として、`/themes/` ディレクトリに手動で展開して、管理パネルをリフレッシュします。

---

### Q: テーマアップロードが「アクセス拒否」で失敗します

**A:** テーマディレクトリのパーミッションを修正：

```bash
# テーマディレクトリを書き込み可能にする
chmod 755 /path/to/xoops/themes

# アップロード時にアップロードを修正
chmod 777 /path/to/xoops/uploads

# 必要に応じて所有権を修正
chown -R www-data:www-data /path/to/xoops/themes
```

---

### Q: 特定のユーザーに異なるテーマを設定できますか？

**A:**
1. ユーザー管理 > ユーザーを編集 に移動
2. 「その他」タブに移動
3. 「ユーザーテーマ」ドロップダウンで推奨テーマを選択
4. 保存

ユーザーが選択したテーマはデフォルトサイトテーマをオーバーライドします。

---

### Q: 管理サイトとユーザーサイトで異なるテーマを使用できますか？

**A:** はい、XOOPS 管理 > 設定 で設定：

1. **フロントエンド テーマ** - デフォルトサイト テーマ
2. **管理者テーマ** - 管理コントロールパネル テーマ（通常は別）

以下の設定を探してください：
- `theme_set` - フロントエンド テーマ
- `admin_theme` - 管理者 テーマ

---

## テーマ カスタマイズ

### Q: 既存のテーマをカスタマイズするには？

**A:** アップデートを保存するため、子テーマを作成：

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* 編集用にコピーを作成 *}
    ├── style.css
    ├── templates/
    └── images/
```

その後、カスタムテーマの `theme.html` を編集します。

---

### Q: テーマの色を変更するには？

**A:** テーマの CSS ファイルを編集：

```bash
# テーマ CSS を探す
themes/mytheme/style.css

# または テーマテンプレート
themes/mytheme/theme.html
```

XOOPS テーマの場合：

```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```

---

### Q: テーマにカスタム CSS を追加するには？

**A:** いくつかのオプション：

**オプション 1: theme.html を編集**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* 既存の CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**オプション 2: custom.css を作成**
```bash
# ファイルを作成
themes/mytheme/custom.css

# スタイルを追加
body { background: #fff; }
```

**オプション 3: 管理者設定（サポートされている場合）**
XOOPS 管理 > 設定 > テーマ設定 に移動してカスタム CSS を追加します。

---

### Q: テーマ HTML テンプレートを修正するには？

**A:** テンプレートファイルを探す：

```bash
# テーマテンプレートをリスト
ls -la themes/mytheme/templates/

# よくあるテンプレート
themes/mytheme/templates/theme.html      {* メインレイアウト *}
themes/mytheme/templates/header.html     {* ヘッダー *}
themes/mytheme/templates/footer.html     {* フッター *}
themes/mytheme/templates/sidebar.html    {* サイドバー *}
```

適切な Smarty 構文で編集：

```html
<!-- themes/mytheme/templates/theme.html -->
{* XOOPS テーマ テンプレート *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```

---

## テーマ 構造

### Q: テーマに必要なファイルは何ですか？

**A:** 最小限の構造：

```
themes/mytheme/
├── theme.html              {* メインテンプレート（必須） *}
├── style.css              {* スタイルシート（オプション ただし推奨） *}
├── screenshot.png         {* 管理者プレビュー画像（オプション） *}
├── images/                {* テーマ画像 *}
│   └── logo.png
└── templates/             {* オプション: 追加テンプレート *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

詳細は「テーマ構造」を参照してください。

---

### Q: テーマをゼロから作成するには？

**A:** 構造を作成：

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

`theme.html` を作成：
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```

`style.css` を作成：
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## テーマ 変数

### Q: テーマテンプレートで利用可能な変数は何ですか？

**A:** 一般的な XOOPS テーマ変数：

```smarty
{* サイト情報 *}
{$xoops_sitename}          {* サイト名 *}
{$xoops_url}               {* サイト URL *}
{$xoops_theme}             {* 現在のテーマ名 *}

{* ページコンテンツ *}
{$xoops_contents}          {* メインページコンテンツ *}
{$xoops_pagetitle}         {* ページタイトル *}
{$xoops_headers}           {* メタタグ、スタイル（head） *}

{* モジュール情報 *}
{$xoops_module_header}     {* モジュール固有ヘッダー *}
{$xoops_moduledesc}        {* モジュール説明 *}

{* ユーザー情報 *}
{$xoops_isuser}            {* ユーザーはログインしていますか？ *}
{$xoops_userid}            {* ユーザー ID *}
{$xoops_uname}             {* ユーザー名 *}

{* ブロック *}
{$xoops_blocks}            {* すべてのブロック コンテンツ *}

{* その他 *}
{$xoops_charset}           {* ドキュメント charset *}
{$xoops_version}           {* XOOPS バージョン *}
```

---

### Q: カスタム変数をテーマに追加するには？

**A:** レンダリング前に PHP コード内：

```php
<?php
// モジュールまたは管理コード内
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// カスタム変数を追加
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// テーマテンプレートを表示
$xoopsTpl->display('file:theme.html');
?>
```

テーマ内：
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## テーマ スタイル

### Q: テーマをレスポンシブにするには？

**A:** CSS Grid または Flexbox を使用：

```css
/* themes/mytheme/style.css */

/* モバイルファースト アプローチ */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* タブレット 以上 */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* デスクトップ 以上 */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

または Bootstrap を統合：
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* サイドバー *}</div>
    </div>
</div>
```

---

### Q: テーマにダークモードを追加するには？

**A:**
```css
/* themes/mytheme/style.css */

/* ライトモード（デフォルト） */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* ダークモード */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* または CSS クラスで */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```

JavaScript でトグル：
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// 環境設定を読み込み
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```

---

## テーマ 問題

### Q: テーマが「未認識テンプレート変数」エラーを表示します

**A:** 変数がテンプレートに渡されていません。確認：

1. **変数が PHP 内で割り当てられている**:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **テンプレートが指定された場所に存在する**
3. **テンプレート構文が正しい**:
```smarty
{* 正しい *}
{$variable_name}

{* 誤り *}
$variable_name
{variable_name}
```

---

### Q: CSS の変更がブラウザに表示されない

**A:** ブラウザキャッシュをクリア：

1. ハードリフレッシュ: `Ctrl+Shift+R`（Mac では `Cmd+Shift+R`）
2. サーバーのテーマキャッシュをクリア：
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. CSS ファイルパスをテーマで確認：
```bash
ls -la themes/mytheme/style.css
```

---

### Q: テーマの画像が読み込まれない

**A:** 画像パスを確認：

```html
{* 誤り - Web ルートからの相対パス *}
<img src="themes/mytheme/images/logo.png">

{* 正しい - xoops_url を使用 *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* または CSS 内 *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### Q: テーマテンプレートが見つからないか、エラーが発生しています

**A:** 「テンプレート エラー」を参照してデバッグします。

---

## テーマ 配布

### Q: 配布用にテーマをパッケージ化するには？

**A:** 配布可能な zip を作成：

```bash
# 構造
mytheme/
├── theme.html           {* 必須 *}
├── style.css
├── screenshot.png       {* 推奨 300x225 *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* オプション *}
    ├── header.html
    └── footer.html

# zip を作成
zip -r mytheme.zip mytheme/
```

---

### Q: XOOPS テーマを売却できますか？

**A:** XOOPS ライセンスを確認：
- XOOPS クラス/テンプレートを使用するテーマは XOOPS ライセンスを尊重する必要があります
- 純粋な CSS/HTML テーマの制限は少ない
- 詳細は「XOOPS 貢献ガイドライン」を確認してください

---

## テーマ パフォーマンス

### Q: テーマパフォーマンスを最適化するには？

**A:**
1. **CSS/JS を最小化** - 不要なコードを削除
2. **画像を最適化** - 適切な形式（WebP、AVIF）を使用
3. **CDN を使用** リソース向けに
4. **画像を遅延読み込み**:
```html
<img src="image.jpg" loading="lazy">
```

5. **キャッシュバスト バージョン**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

詳細は「パフォーマンス FAQ」を参照してください。

---

## 関連ドキュメント

- テンプレート エラー
- テーマ構造
- パフォーマンス FAQ
- Smarty デバッグ

---

#xoops #themes #faq #troubleshooting #customization
