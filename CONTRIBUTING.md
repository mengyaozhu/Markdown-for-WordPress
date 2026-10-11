# Contributing to Markdown for WordPress

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

