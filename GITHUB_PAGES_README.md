# Agipix GitHub Pages Website

This repository contains the source files for the Agipix project website, built with Jekyll and hosted on GitHub Pages.

## Features

- **Dark Theme with Dark Red Accents**: Futuristic design emphasizing the digital twin concept
- **Osake-style Font**: Using Orbitron font for the "AGIPIX" header
- **Sim-to-Real Focus**: Split sections highlighting both simulation and real hardware deployability
- **Responsive Design**: Mobile-friendly layout
- **Documentation Integration**: Automatic rendering of markdown documentation from `doc/` directory
- **Custom Styling**: SCSS-based theming with CSS variables for easy customization

## Site Structure

```
/
├── _config.yml              # Jekyll configuration
├── _layouts/                # Page layouts
│   ├── default.html         # Main layout with header, nav, footer
│   └── doc.html             # Documentation page layout
├── _includes/               # Reusable components (if needed)
├── assets/
│   └── css/
│       └── style.scss       # Main stylesheet with dark theme
├── docs/                    # Documentation pages
│   ├── sim-setup.md
│   ├── hardware-assembly.md
│   ├── flashing-hardware.md
│   ├── software-setup.md
│   └── autonomy.md
├── index.html               # Homepage
├── bom.md                   # Bill of Materials page
└── Gemfile                  # Ruby dependencies
```

## Enabling GitHub Pages

To enable GitHub Pages for this repository:

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select:
   - Branch: `main` (or your desired branch)
   - Folder: `/ (root)`
3. Click **Save**
4. GitHub will automatically build and deploy the site

The site will be available at: `https://sasakuruppuarachchi.github.io/agipix/`

## Local Development

### Prerequisites

- Ruby 2.7 or higher
- Bundler gem
- Jekyll gem

### Setup

1. Install dependencies:
   ```bash
   gem install bundler jekyll
   ```

2. Install project gems:
   ```bash
   bundle install
   ```

3. Build the site:
   ```bash
   jekyll build
   ```

4. Serve the site locally:
   ```bash
   jekyll serve
   ```

5. Open `http://localhost:4000/agipix/` in your browser

### Building Without Gemfile

If you prefer not to use Bundler:

```bash
jekyll build --baseurl /agipix
jekyll serve --baseurl /agipix
```

## Theme Customization

The theme uses CSS variables defined in `assets/css/style.scss`:

```scss
:root {
  --primary-bg: #0a0a0a;          /* Main background */
  --secondary-bg: #1a1a1a;        /* Secondary background */
  --accent-red: #8b1a1a;          /* Primary accent color */
  --accent-red-light: #b32424;    /* Light accent */
  --accent-red-dark: #5a0f0f;     /* Dark accent */
  --text-primary: #e0e0e0;        /* Primary text color */
  --text-secondary: #a0a0a0;      /* Secondary text color */
}
```

Modify these variables to change the color scheme.

## Fonts

- **Header Font**: Orbitron (from Google Fonts) - used for "AGIPIX" title
- **Body Font**: System fonts for optimal performance

## Content Updates

### Updating Documentation

Documentation pages in `docs/` pull content from the main repository documentation:
- `doc/sim/1_setup_sim.md` → Simulation setup
- `doc/real/1_hardware_assembly.md` → Hardware assembly
- `doc/real/2_flashing_hardware.Md` → Flashing guide
- `doc/real/3_software_setup.md` → Software setup
- `doc/autonomy/2_planning_control.md` → Autonomy framework

When documentation in the `doc/` directory changes, the corresponding pages in `docs/` should be updated to reflect those changes.

### Adding New Pages

1. Create a new markdown file in the appropriate directory
2. Add front matter:
   ```yaml
   ---
   layout: doc
   title: Your Page Title
   ---
   ```
3. Add content in markdown format
4. Update navigation in `_layouts/default.html` if needed

## Assets

- Images: `assets/images/`
- The site uses images directly from the repository's `assets` directory
- Image paths in the site: `/assets/images/filename.ext`

## Configuration

Key settings in `_config.yml`:

- `baseurl: "/agipix"` - Repository name (for GitHub Pages)
- `url: "https://sasakuruppuarachchi.github.io"` - Base URL
- `title: "Agipix"` - Site title
- `description: "An Open Sourced Aerial Autonomy from Sim-to-Real"`

## Troubleshooting

### Site not building?

- Check the **Actions** tab in GitHub for build errors
- Ensure all file paths are correct
- Verify that `_config.yml` is properly formatted

### Images not showing?

- Verify image paths start with `/` and include the baseurl
- Check that images exist in `assets/images/` directory
- Use relative_url filter in Liquid: `{{ '/assets/images/file.png' | relative_url }}`

### Local serve not working?

- Ensure you have the correct Ruby version
- Try: `bundle exec jekyll serve --baseurl /agipix`
- Clear the cache: `jekyll clean && jekyll build`

## License

This website follows the same license as the Agipix project. See [LICENSE](LICENSE) for details.

## Contact

- Sasanka Kuruppu Arachchige — sasa.kuruppuarachchi@gmail.com
- Joni Kämäräinen — joni.kamarainen@tuni.fi
