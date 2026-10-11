# Markdown for WordPress

**Copy Markdown. Paste it into WordPress. Publish.**

Markdown for WordPress converts pasted Markdown into editable content in the Gutenberg and Classic editors. Write your article in Markdown, paste it into WordPress, then review and publish it.

## Features

- Automatic Markdown conversion when pasting.
- Native WordPress blocks in Gutenberg and standard HTML in Classic Editor.
- Support for common article formatting, including images, code blocks and tables.
- Optional Gutenberg import tool for title extraction and metadata handling.

## Installation

Download `markdown-for-wordpress-VERSION.zip` under **Assets** on the [GitHub Releases page](https://github.com/mengyaozhu/Markdown-for-WordPress/releases). The automatically generated **Source code** archives are not the installable plugin ZIP.

In WordPress:

1. Go to **Plugins → Add Plugin**.
2. Select **Upload Plugin**.
3. Choose the downloaded ZIP file.
4. Select **Install Now**.
5. Activate **Markdown for WordPress**.

Then create a post and paste your Markdown into the editor.

### Requirements

- WordPress 6.2 or later
- PHP 7.4 or later

## Usage

### Gutenberg / Block Editor

Create or edit a post and paste Markdown into an empty **Paragraph** block. The plugin automatically converts it into native WordPress blocks where appropriate, which you can edit normally. Existing blocks are preserved during normal paste conversion.

### Classic Editor

Paste Markdown in **Code** mode to convert it into HTML, then switch to **Visual** mode to review and edit the result. Pasting directly into Visual mode is also supported.

### Optional Gutenberg import tool

Open **⋮ → Plugins → Paste Markdown** for additional options, including title extraction and metadata-preamble handling. Normal paste conversion does not require this dialog.

**The dialog's full Convert operation replaces the post body.** Use it carefully when editing an existing post.

### Published content

Conversion happens when you paste. Posts are stored as normal WordPress content and remain readable if the plugin is deactivated; no ongoing frontend Markdown processing is required. Your WordPress theme controls the visual presentation.

## Supported Markdown

- Headings and paragraphs
- Bold, italic and strikethrough text
- Links and images
- Ordered and unordered lists
- Blockquotes and horizontal separators
- Inline code and fenced code blocks
- Pipe-style tables

### Limitations

The plugin uses a lightweight parser and does not implement the complete CommonMark specification. Advanced escaping, complex link syntax, nested lists and some Markdown extensions may have limitations or behave differently from dedicated CommonMark parsers.

## Development

The runtime plugin does not require npm packages or a build process on the WordPress server.

For repository development and validation, use Node.js 22.13 or later and Python 3:

```sh
npm ci
npm run check
npm test
python3 scripts/check-version.py
python3 scripts/package.py
```

The generated installable ZIP is placed in `dist/`.

Releases are published automatically when a `vMAJOR.MINOR.PATCH` tag is pushed. The tag must match the versions in `package.json`, `package-lock.json`, the plugin header, the script asset versions in the plugin PHP file and the plugin stable tag. The release workflow validates versions, runs checks and tests, packages the plugin and uploads the installable ZIP to GitHub Releases.

Never move or reuse a published release tag. For a corrected release, update the versions and push a new patch-version tag.

### Repository structure

```text
plugin/markdown-for-wordpress/   WordPress plugin source
tests/                           Conversion and editor tests
scripts/                         Validation and packaging tools
.github/workflows/validate.yml   GitHub Actions validation
.github/workflows/release.yml    Tag-driven GitHub Releases
```

The automated test suite checks registration contracts, clipboard handling, Classic Editor behavior and representative Markdown conversion structures.

WordPress integration testing should additionally verify plugin activation, editor rendering, Gutenberg block validity, save/reload behavior and published frontend output.

## License

Licensed under **GPL-2.0-or-later**. See [LICENSE](LICENSE) for the complete terms.

## Author

Created and maintained by [mengyaozhu](https://github.com/mengyaozhu).

## Contributing

Bug reports, compatibility reports and improvements are welcome.

If you find Markdown that does not convert correctly, opening an issue with a small Markdown example and the expected WordPress output is especially helpful.
