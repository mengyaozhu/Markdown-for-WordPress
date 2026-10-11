const fs = require('node:fs');
const Engine = require('php-parser');
new Engine({parser:{version:'7.4',suppressErrors:false}}).parseCode(fs.readFileSync('plugin/markdown-for-wordpress/markdown-for-wordpress.php','utf8'));
console.log('PHP 7.4 syntax parser check passed.');
