# Markdown for WordPress

**Copy Markdown. Paste it into WordPress. Publish.**

Markdown for WordPress makes Markdown content work naturally in the WordPress post editor.

If you write articles in Markdown—or generate content as `.md` files—you should not have to manually remove Markdown syntax, convert the file to HTML, rebuild headings and lists, or use a special publishing workflow just to put the article on WordPress.

With Markdown for WordPress, simply copy the Markdown content and paste it into the WordPress post editor.

```text
Markdown file
     ↓
Copy
     ↓
Paste into WordPress
     ↓
Properly formatted post
     ↓
Publish
```

The plugin converts the pasted Markdown into normal WordPress content so that it is properly formatted in the editor and properly displayed in the published post.

## Why Markdown for WordPress?

WordPress and Markdown use different content formats.

A Markdown article might look like this:

```markdown
# How to Write a Better Resume

A good resume should show **what you accomplished**, not only what you were responsible for.

## Focus on achievements

Instead of:

- Responsible for managing social media.

Write:

- Planned and published weekly content across three social media channels.

> Describe the work. Demonstrate the contribution.

[Learn more](https://example.com)
```

Normally, pasting Markdown into an editor can leave Markdown syntax visible or require additional conversion and cleanup.

Markdown for WordPress is designed to remove that extra step.

Copy the Markdown and paste it into the WordPress editor. The plugin recognizes the Markdown structure and converts it into properly formatted WordPress content.

## How It Works

### Gutenberg / Block Editor

Create or edit a WordPress post and paste your Markdown into an empty Paragraph block.

The conversion happens automatically.

Markdown structures are converted into native WordPress blocks where appropriate, including:

- Headings
- Paragraphs
- Bold and italic text
- Strikethrough
- Links
- Images
- Ordered lists
- Unordered lists
- Blockquotes
- Code blocks
- Horizontal separators
- Tables

After conversion, the content can be edited normally using the WordPress block editor.

Existing blocks in the post are preserved when using the normal paste workflow.

### Classic Editor

Markdown can also be pasted into the Classic Editor.

When pasted in Code mode, the Markdown is automatically converted to standard HTML. You can then switch to Visual mode to review and edit the formatted article.

Pasting Markdown directly into Visual mode is also supported.

## No Special Frontend Processing

Markdown for WordPress is a **conversion plugin**, not a frontend Markdown renderer.

That distinction is intentional.

The plugin converts your Markdown when you paste it into WordPress. The resulting post is stored as normal WordPress content.

This means your published articles do not depend on the plugin continuously processing Markdown every time somebody visits the page.

Your WordPress theme remains responsible for the visual presentation of the article, including fonts, colors, spacing, content width, heading styles and other design choices.

If the plugin is later deactivated, content that has already been converted remains readable.

## Markdown Support

The plugin currently supports common Markdown used in articles and blog posts, including:

```markdown
# Heading 1
## Heading 2
### Heading 3

Normal paragraph text.

**Bold text**

*Italic text*

~~Strikethrough~~

[Link text](https://example.com)

- Unordered item
- Another item

1. Ordered item
2. Another item

> Blockquote

---

`inline code`
```

Fenced code blocks, images and pipe-style Markdown tables are also supported.

### Current limitations

The plugin uses a lightweight Markdown parser rather than implementing the complete CommonMark specification.

Some advanced Markdown syntax and extensions may therefore behave differently from dedicated CommonMark parsers.

Current limitations include advanced escaping, complex link syntax and some Markdown extensions. Nested lists may also have limitations.

The goal of the project is straightforward and reliable conversion of the Markdown commonly used for WordPress articles—not to implement every Markdown dialect.

## Installation

Download `markdown-for-wordpress-VERSION.zip` from the [GitHub Releases page](https://github.com/mengyaozhu/Markdown-for-WordPress/releases).

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

## Optional Gutenberg Import Tool

For normal use, you do not need an import interface or conversion button. Just paste Markdown into the editor.

The Gutenberg **⋮ → Plugins → Paste Markdown** interface is available for cases where you want additional control, including title extraction and metadata-preamble handling.

Unlike normal paste conversion, using the dialog's full Convert operation replaces the post body, so use it carefully when editing an existing post.

## Development

The runtime plugin does not require npm packages or a build process on the WordPress server.

For repository development and validation, use Node.js 22.13 or later and Python 3:

```sh
npm ci
npm run check
npm test
python3 scripts/package.py
```

The generated installable ZIP is placed in `dist/`.

Releases are published automatically when a `vMAJOR.MINOR.PATCH` tag is pushed. The tag must match the versions in `package.json`, `package-lock.json`, the plugin header and the plugin stable tag. The release workflow validates versions, runs checks and tests, packages the plugin and uploads the installable ZIP to GitHub Releases.

### Repository structure

```text
plugin/markdown-for-wordpress/   WordPress plugin source
tests/                           Conversion and editor tests
scripts/                         Validation and packaging tools
.github/workflows/validate.yml   GitHub Actions validation
```

The automated test suite checks registration contracts, clipboard handling, Classic Editor behavior and representative Markdown conversion structures.

WordPress integration testing should additionally verify plugin activation, editor rendering, Gutenberg block validity, save/reload behavior and published frontend output.

## License

Markdown for WordPress is licensed under **GPL-2.0-or-later**.

WordPress itself is distributed under the GNU General Public License, version 2 or any later version. WordPress plugins are designed to run as extensions of WordPress, so using a GPL-compatible license is the standard approach for WordPress plugin development.

`GPL-2.0-or-later` means you may use, study, modify and redistribute this plugin under the terms of **GPL version 2 or, at your option, any later version of the GPL**.

The “or later” designation avoids permanently restricting the project to GPL version 2 and maintains compatibility with future versions of the GNU GPL.

See [LICENSE](LICENSE) for the complete license terms.

## Author

Created and maintained by **mengyaozhu**.

## Contributing

Bug reports, compatibility reports and improvements are welcome.

If you find Markdown that does not convert correctly, opening an issue with a small Markdown example and the expected WordPress output is especially helpful.
