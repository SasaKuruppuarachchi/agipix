# Agipix Documentation

This directory contains the source files for the Agipix documentation website, which is built using [MkDocs](https://www.mkdocs.org/) with the [Material theme](https://squidfunk.github.io/mkdocs-material/).

## Building the Documentation Locally

### Prerequisites

```bash
pip install -r requirements-docs.txt
```

Or install dependencies manually:

```bash
pip install mkdocs-material mkdocs-git-revision-date-localized-plugin
```

### Build and Serve Locally

To preview the documentation locally:

```bash
mkdocs serve
```

Then open your browser to `http://127.0.0.1:8000`

### Build Static Site

To build the static HTML site:

```bash
mkdocs build
```

The generated site will be in the `site/` directory.

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment is handled by the GitHub Actions workflow in `.github/workflows/deploy-docs.yml`.

The site will be available at: `https://sasakuruppuarachchi.github.io/agipix/`

## Structure

- `docs/` - Documentation source files (Markdown)
- `mkdocs.yml` - MkDocs configuration file
- `.github/workflows/deploy-docs.yml` - GitHub Actions workflow for auto-deployment

## Contributing to Documentation

To contribute to the documentation:

1. Edit the Markdown files in the `docs/` directory
2. Test your changes locally with `mkdocs serve`
3. Commit and push your changes
4. The site will be automatically rebuilt and deployed

## Configuration

The site configuration is in `mkdocs.yml`. You can customize:

- Navigation structure
- Theme settings
- Plugins
- Extensions
- And more

See the [MkDocs documentation](https://www.mkdocs.org/) for details.
