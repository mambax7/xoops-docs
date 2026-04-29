---
title: "カスタムフォームレンダラー"
---

## 概要

XOOPSはカスタムレンダラーを通じたフォームレンダリングのカスタマイズを許可します。これはテーマ固有のスタイリング、アクセシビリティの向上、BootstrapやTailwind CSSなどのフロントエンドフレームワークとの統合を有効にします。

## デフォルトレンダリング

デフォルトでは、XOOPSフォームは`XoopsFormRenderer`クラスを使用して基本的なHTMLを出力します:

```php
// デフォルトレンダリング
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->addElement(new XoopsFormText('Name', 'name', 50, 255));
echo $form->render();
```

## カスタムレンダラーアーキテクチャ

```mermaid
classDiagram
    class XoopsFormRenderer {
        <<interface>>
        +renderForm(XoopsForm form)
        +renderElement(XoopsFormElement element)
        +renderLabel(string caption)
    }

    XoopsFormRenderer <|-- XoopsFormRendererBootstrap4
    XoopsFormRenderer <|-- XoopsFormRendererBootstrap5
    XoopsFormRenderer <|-- XoopsFormRendererTailwind
    XoopsFormRenderer <|-- CustomFormRenderer
```

## カスタムレンダラーを作成

### 基本的なレンダラークラス

```php
namespace Xoops\Modules\MyModule\Form;

use XoopsFormRenderer;
use XoopsForm;
use XoopsFormElement;

class BootstrapRenderer extends XoopsFormRenderer
{
    public function renderFormStart(XoopsForm $form): string
    {
        $class = $form->getExtra() ?: 'needs-validation';
        return sprintf(
            '<form name="%s" id="%s" action="%s" method="%s" class="%s" %s>',
            $form->getName(),
            $form->getName(),
            $form->getAction(),
            $form->getMethod(),
            $class,
            $form->getExtra()
        );
    }

    public function renderFormEnd(): string
    {
        return '</form>';
    }

    public function renderElement(XoopsFormElement $element): string
    {
        $output = '<div class="mb-3">';

        // ラベル
        if ($element->getCaption()) {
            $output .= sprintf(
                '<label for="%s" class="form-label">%s</label>',
                $element->getName(),
                $element->getCaption()
            );
        }

        // Bootstrapクラス付き要素
        $element->setExtra($element->getExtra() . ' class="form-control"');
        $output .= $element->render();

        // 説明
        if ($element->getDescription()) {
            $output .= sprintf(
                '<div class="form-text">%s</div>',
                $element->getDescription()
            );
        }

        $output .= '</div>';

        return $output;
    }

    public function renderButton(XoopsFormElement $button): string
    {
        $type = $button->getType() === 'submit' ? 'btn-primary' : 'btn-secondary';
        return sprintf(
            '<button type="%s" name="%s" class="btn %s">%s</button>',
            $button->getType(),
            $button->getName(),
            $type,
            $button->getValue()
        );
    }
}
```

### レンダラーを登録

```php
// モジュールのxoops_version.phpまたはブートストラップ内
$GLOBALS['xoopsOption']['form_renderer'] = new BootstrapRenderer();

// またはフォームごとに設定
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->setRenderer(new BootstrapRenderer());
```

## 組み込みレンダラー

### Bootstrap 4 レンダラー

```php
use Xoops\Form\Renderer\Bootstrap4Renderer;

$form->setRenderer(new Bootstrap4Renderer());
```

### Bootstrap 5 レンダラー

```php
use Xoops\Form\Renderer\Bootstrap5Renderer;

$form->setRenderer(new Bootstrap5Renderer([
    'floating_labels' => true,
    'validation_style' => 'tooltip'
]));
```

## 特定要素をレンダリング

### カスタムセレクトレンダラー

```php
public function renderSelect(XoopsFormSelect $select): string
{
    $multiple = $select->isMultiple() ? 'multiple' : '';
    $size = $select->getSize();

    $output = sprintf(
        '<select name="%s%s" id="%s" class="form-select" %s size="%d">',
        $select->getName(),
        $multiple ? '[]' : '',
        $select->getName(),
        $multiple,
        $size
    );

    foreach ($select->getOptions() as $value => $label) {
        $selected = in_array($value, (array)$select->getValue()) ? 'selected' : '';
        $output .= sprintf(
            '<option value="%s" %s>%s</option>',
            htmlspecialchars($value),
            $selected,
            htmlspecialchars($label)
        );
    }

    $output .= '</select>';

    return $output;
}
```

### カスタムファイル入力レンダラー

```php
public function renderFile(XoopsFormFile $file): string
{
    return sprintf(
        '<div class="mb-3">
            <label for="%s" class="form-label">%s</label>
            <input type="file" class="form-control" id="%s" name="%s" %s>
        </div>',
        $file->getName(),
        $file->getCaption(),
        $file->getName(),
        $file->getName(),
        $file->getExtra()
    );
}
```

## テーマ統合

### テーマテンプレート内

```smarty
{* テーマのform.tpl内 *}
{foreach $form.elements as $element}
    <div class="form-group {$element.class}">
        {if $element.caption}
            <label class="control-label">{$element.caption}</label>
        {/if}
        {$element.body}
        {if $element.description}
            <span class="help-block">{$element.description}</span>
        {/if}
    </div>
{/foreach}
```

## ベストプラクティス

1. **基本レンダラーから継承** - 一貫性のため`XoopsFormRenderer`を拡張
2. **すべての要素型をサポート** - テキスト、セレクト、チェックボックス、ラジオなどを処理
3. **アクセシビリティ** - 適切なラベル、ARIA属性を含める
4. **検証スタイル** - エラー状態を適切に表示
5. **レスポンシブ設計** - フォームはモバイルで動作することを確認

## 関連ドキュメント

- Forms Overview
- Form Elements Reference
- Form Validation
- Theme Development
