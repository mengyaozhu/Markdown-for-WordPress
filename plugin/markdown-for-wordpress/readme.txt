=== Markdown for WordPress ===
Contributors: mengyaozhu
Tags: markdown, gutenberg, editor, import
Requires at least: 6.2
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Display Markdown as formatted WordPress content using the site theme. Supports Classic Editor HTML and native Gutenberg blocks.

== Installation ==
Upload the ZIP through Plugins > Add Plugin > Upload Plugin. Replace the installed version and activate if necessary. Reload the post editor.

== Classic Editor ==
Paste raw Markdown in Code mode. It converts automatically into HTML. Click Visual or Preview Changes to review the formatting, then Update or Publish when ready.
Pasting raw Markdown in Visual mode also converts automatically.
For Markdown already saved as plain text, cut it from Code mode and paste it back to trigger conversion.
There is no conversion button or instructional banner in Classic Editor.

== Gutenberg ==
Paste Markdown into an empty Paragraph block to create native editable blocks automatically. The top-right menu also offers Plugins > Paste Markdown for title extraction and whole-post replacement.

== Notes ==
Classic Editor saves standard HTML; Gutenberg saves native blocks. Imported content remains readable with this plugin deactivated.
The importer can strip a metadata heading before an initial separator. The parser supports common headings, emphasis, lists, links, images, tables, quotes and fenced code; it is not a full CommonMark implementation.

== Changelog ==
= 1.0.0 =
First release of Markdown for WordPress by mengyaozhu.
Automatic Markdown paste conversion in Classic Editor and Gutenberg, formatted content, and support for common headings, emphasis, lists, links, images, quotes, fenced code and tables.
