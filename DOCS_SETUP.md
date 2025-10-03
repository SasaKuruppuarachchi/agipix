# GitHub Pages Setup Instructions

The documentation site is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

## Enabling GitHub Pages

To enable GitHub Pages for this repository:

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

## First Deployment

The GitHub Actions workflow (`.github/workflows/deploy-docs.yml`) will automatically:

1. Trigger on every push to the `main` branch
2. Install MkDocs and dependencies
3. Build the documentation site
4. Deploy it to the `gh-pages` branch

After the first deployment completes (check the Actions tab), your site will be available at:

**https://sasakuruppuarachchi.github.io/agipix/**

## Local Development

To work on the documentation locally:

### Install Dependencies

```bash
pip install -r requirements-docs.txt
```

Or manually:

```bash
pip install mkdocs-material mkdocs-git-revision-date-localized-plugin
```

### Preview Locally

```bash
mkdocs serve
```

Then open http://127.0.0.1:8000 in your browser.

### Build Static Site

```bash
mkdocs build
```

The generated site will be in the `site/` directory.

## Customization

### Site Configuration

Edit `mkdocs.yml` to customize:
- Site name, description, and URL
- Navigation structure
- Theme colors and features
- Plugins and extensions

### Content

All documentation content is in the `docs/` directory as Markdown files:
- `docs/index.md` - Homepage
- `docs/getting-started/` - Getting started guides
- `docs/simulation/` - Simulation setup
- `docs/hardware/` - Hardware guides
- `docs/autonomy/` - Autonomy stack docs
- `docs/bom/` - Bill of Materials
- `docs/about/` - License, citation, contact

### Images

Images are stored in `docs/assets/images/` and can be referenced in Markdown as:

```markdown
![Alt text](../assets/images/image.png)
```

## Troubleshooting

### GitHub Actions Fails

Check the Actions tab for error logs. Common issues:
- Missing dependencies (update workflow)
- Invalid Markdown syntax
- Broken internal links

### Site Not Updating

1. Ensure the workflow completed successfully (Actions tab)
2. Wait a few minutes for GitHub Pages to update
3. Clear your browser cache
4. Check that gh-pages branch exists and has content

### Local Build Fails

1. Ensure all dependencies are installed
2. Check for broken links in Markdown files
3. Verify image paths are correct

## Resources

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
