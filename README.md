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

## License

Licensed under **GPL-2.0-or-later**. See [LICENSE](LICENSE) for the complete terms.

## Author

Created and maintained by [mengyaozhu](https://github.com/mengyaozhu).

## Contributing

Bug reports, compatibility reports and improvements are welcome.

If you find Markdown that does not convert correctly, opening an issue with a small Markdown example and the expected WordPress output is especially helpful.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development, validation and release instructions.
