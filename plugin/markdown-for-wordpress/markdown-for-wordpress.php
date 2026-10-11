<?php
/**
 * Plugin Name: Markdown for WordPress
 * Plugin URI: https://github.com/mengyaozhu/Markdown-for-WordPress
 * Description: Convert Markdown into editable WordPress content with formatted headings, lists, emphasis, tables and other supported elements. Supports Classic Editor and Gutenberg.
 * Version: 1.0.0
 * Requires at least: 6.2
 * Requires PHP: 7.4
 * Author: mengyaozhu
 * Author URI: https://github.com/mengyaozhu
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) exit;

function mfw_enqueue_markdown_converter() {
    wp_enqueue_script(
        'mfw-markdown',
        plugins_url('assets/markdown.js', __FILE__),
        array(),
        '1.0.0-' . filemtime(__DIR__ . '/assets/markdown.js'),
        true
    );
}

add_action('enqueue_block_editor_assets', function () {
    $screen = get_current_screen();
    if (!$screen || $screen->base !== 'post' || !$screen->is_block_editor()) return;
    mfw_enqueue_markdown_converter();
    wp_enqueue_script(
        'mfw-editor',
        plugins_url('assets/editor.js', __FILE__),
        array('mfw-markdown','wp-dom-ready','wp-plugins','wp-editor','wp-edit-post','wp-element','wp-components','wp-data','wp-blocks','wp-block-editor'),
        '1.0.0-' . filemtime(__DIR__ . '/assets/editor.js'),
        true
    );
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'post.php' && $hook !== 'post-new.php') return;
    $screen = get_current_screen();
    if (!$screen || $screen->base !== 'post' || $screen->is_block_editor() || !post_type_supports($screen->post_type, 'editor')) return;
    mfw_enqueue_markdown_converter();
    wp_enqueue_script(
        'mfw-classic',
        plugins_url('assets/classic.js', __FILE__),
        array('mfw-markdown','wp-dom-ready'),
        '1.0.0-' . filemtime(__DIR__ . '/assets/classic.js'),
        true
    );
});
