# Markdown for WordPress

Convert raw Markdown into formatted, editable WordPress content. By **mengyaozhu**. Version **1.0.0**.

Classic Editor saves standard HTML. Gutenberg creates native blocks. Your WordPress theme supplies the fonts, colors and spacing. Converted content remains readable after the plugin is deactivated.

## Installation

Download the installable ZIP from a GitHub release when one is available, or build it from this repository. In WordPress, open **Plugins → Add Plugin → Upload Plugin**, upload the ZIP and activate it.

Requires WordPress 6.2 or later and PHP 7.4 or later. When moving from a development package with the old `markdown-paste-gutenberg` directory, deactivate that old plugin before activating this renamed package.

## Classic Editor

1. Paste raw Markdown in **Code** mode. Conversion to HTML happens automatically.
2. Click **Visual** or **Preview Changes** to review the formatting.
3. Save, Update or Publish when ready.

Pasting raw Markdown into Visual mode also converts automatically. For Markdown already stored as plain text, cut it from Code mode and paste it back. There is no conversion button or instructional banner.

## Gutenberg

Paste Markdown into an **empty Paragraph block** to create native blocks automatically. Existing post blocks are preserved. The article H1 remains in the body.

The editor's **⋮ → Plugins → Paste Markdown** dialog also offers title extraction and metadata-preamble handling. Its Convert action replaces the entire post body; save a copy before using it on existing content.

## Markdown support and limits

Supports common headings, paragraphs, emphasis, strikethrough, links, images, ordered/unordered lists, quotations, fenced code, separators and pipe tables. A metadata heading before an initial separator can be removed automatically.

This is a lightweight parser, not a complete CommonMark implementation. Nested lists are currently flattened; advanced escaping, complex link syntax and some Markdown extensions are limited. This plugin converts pasted text; it does not upload `.md` files or add frontend Markdown processing.

## Development

Use Node.js 22.13 or later and Python 3. Runtime plugin scripts need no npm packages or build step.

```sh
npm ci
npm run check
npm test
python3 scripts/package.py
```

The generated ZIP appears under `dist/` and contains only plugin runtime files, WordPress metadata and the license. Generated ZIPs and dependencies are excluded from Git.

## Validation status

The automated suite checks registration contracts, clipboard handling, Classic Editor DOM behavior and representative conversion structures. TinyMCE and WordPress APIs are stubbed in these tests. Live WordPress activation, editor rendering, block validity, save/reload and frontend output still require integration testing. PHP syntax is checked by a parser locally and by `php -l` in CI.

## Repository layout

- `plugin/markdown-for-wordpress/`: installable runtime source.
- `tests/`: editor and conversion tests with a synthetic public fixture.
- `scripts/`: validation and ZIP packaging.
- `.github/workflows/validate.yml`: checks on pushes and pull requests; no publishing or deployment.

## License

GPL-2.0-or-later. See [LICENSE](LICENSE). Author and contributor: **mengyaozhu**.
