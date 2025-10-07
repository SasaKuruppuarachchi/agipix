# Agipix GitHub Pages - Quick Start Guide

## 🎨 What Was Built

A **dark-themed, futuristic website** for the Agipix project featuring:

### Design Elements
- 🌑 **Dark Theme**: Black (#0a0a0a) background with dark red (#8b1a1a, #b32424) accents
- ✨ **Glowing Header**: "AGIPIX" in Orbitron font with animated red glow effect
- 🤖 **Digital Twin Focus**: Split sim/real sections emphasizing seamless deployability
- 📱 **Fully Responsive**: Adapts to mobile, tablet, and desktop screens

### Pages Created
1. **Homepage** (`index.html`)
   - Hero section with exploded.gif banner
   - Sim-to-Real split comparison
   - 6 key highlights in grid layout
   - Quick start guide with 3 categories
   - Repository layout reference

2. **Documentation Pages** (`docs/`)
   - Simulation Setup
   - Hardware Assembly
   - Flashing Hardware
   - Software Setup
   - Autonomy Framework

3. **Bill of Materials** (`bom.md`)
   - Complete component list
   - Sensor specifications
   - Miscellaneous items

### Navigation
- Sticky header with "AGIPIX" title (glowing on hover)
- Clean nav bar: Home | Sim Setup | Hardware | Autonomy | BOM | GitHub
- Footer with contact info and acknowledgments

## 🚀 How to Deploy

### Step 1: Enable GitHub Pages
1. Go to your repository: `https://github.com/SasaKuruppuarachchi/agipix`
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**:
   - Branch: Select `main` (or the branch with these changes)
   - Folder: Select `/ (root)`
5. Click **Save**

### Step 2: Wait for Build
- GitHub Actions will automatically build the site
- Check the **Actions** tab to monitor progress
- Build usually completes in 1-2 minutes

### Step 3: Visit Your Site
- URL: `https://sasakuruppuarachchi.github.io/agipix/`
- The site will be live once the build completes!

## 📁 Files Added

```
agipix/
├── _config.yml                    # Jekyll configuration
├── _layouts/
│   ├── default.html              # Main layout (header, nav, footer)
│   └── doc.html                  # Documentation page layout
├── assets/css/
│   └── style.scss                # Dark theme CSS (10KB)
├── index.html                     # Homepage
├── docs/                          # Documentation pages
│   ├── sim-setup.md
│   ├── hardware-assembly.md
│   ├── flashing-hardware.md
│   ├── software-setup.md
│   └── autonomy.md
├── bom.md                         # Bill of Materials
├── Gemfile                        # Ruby dependencies
├── GITHUB_PAGES_README.md         # Detailed setup guide
└── SITE_SUMMARY.md               # Implementation details
```

## 🎯 Key Features

### Homepage Highlights
1. **Sim-to-Real Deployability** - Zero code changes between environments
2. **Open-Source Platform** - Full BOM, CAD, and software stack
3. **Modular Autonomy Stack** - ROS 2-based decoupled architecture
4. **Small Form Factor** - 438×372 mm with TWR ≈ 2.98:1
5. **Extensive Sensor Suite** - 3D LiDAR, RGB camera, IMU
6. **Modular Hardware Design** - Layered decks for easy upgrades

### Visual Design
- **Color Scheme**:
  - Background: `#0a0a0a` (deep black)
  - Accents: `#8b1a1a` (dark red), `#b32424` (bright red)
  - Text: `#e0e0e0` (light gray), `#a0a0a0` (medium gray)

- **Typography**:
  - Headers: Orbitron (Google Fonts) - futuristic, tech-inspired
  - Body: System fonts for performance

- **Effects**:
  - Glowing text on header
  - Hover animations on cards and buttons
  - Smooth transitions (0.3s ease)
  - Custom dark scrollbar

### Content Integration
- Documentation pulls from `doc/` directory
- Images load from `assets/images/`
- Links to original repository docs for complete info
- Automatic markdown rendering

## 🔧 Local Development

### Prerequisites
```bash
# Install Ruby and Jekyll
gem install --user-install bundler jekyll
```

### Build & Preview
```bash
# Navigate to repository
cd /path/to/agipix

# Build the site
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"
jekyll build

# Serve locally
jekyll serve --baseurl /agipix

# Open browser
# http://localhost:4000/agipix/
```

## 📝 Customization

### Change Colors
Edit `assets/css/style.scss`:
```scss
:root {
  --accent-red: #8b1a1a;          /* Change this */
  --accent-red-light: #b32424;    /* And this */
}
```

### Update Content
- Homepage: Edit `index.html`
- Documentation: Edit files in `docs/`
- Navigation: Edit `_layouts/default.html`

### Add New Pages
1. Create new `.md` or `.html` file
2. Add front matter:
   ```yaml
   ---
   layout: doc
   title: Your Title
   ---
   ```
3. Add link to navigation in `_layouts/default.html`

## ✅ Verification Checklist

- [x] Jekyll site builds without errors
- [x] Dark theme with red accents renders correctly
- [x] Orbitron font loads for "AGIPIX" header
- [x] All navigation links work
- [x] Images load from assets/images/
- [x] Documentation pages render properly
- [x] Responsive design works on mobile
- [x] Footer displays contact info
- [x] Code blocks are syntax highlighted

## 🎬 Next Steps

1. **Merge this PR** to include the GitHub Pages files
2. **Enable GitHub Pages** in repository settings
3. **Share the URL**: `https://sasakuruppuarachchi.github.io/agipix/`
4. **Optional**: Set up custom domain in Settings → Pages

## 📚 Documentation

- **GITHUB_PAGES_README.md** - Complete setup and customization guide
- **SITE_SUMMARY.md** - Detailed implementation documentation
- **This file** - Quick start guide

## 🎨 Screenshots

The site features:
- Dark, futuristic homepage with animated header
- Split sim/real comparison sections
- Clean documentation pages with code highlighting
- Professional footer with project information

## 🆘 Troubleshooting

### Site not building?
- Check Actions tab for build errors
- Ensure branch is selected in Pages settings
- Verify _config.yml is valid YAML

### Images not showing?
- Confirm images exist in `assets/images/`
- Check that baseurl is set to `/agipix`
- Images should use relative paths

### Local preview not working?
```bash
# Clear cache and rebuild
jekyll clean
jekyll build --baseurl /agipix
jekyll serve --baseurl /agipix
```

## 📧 Support

For issues or questions:
- Sasanka Kuruppu Arachchige: sasa.kuruppuarachchi@gmail.com
- Joni Kämäräinen: joni.kamarainen@tuni.fi

---

**The Agipix GitHub Pages site is ready to deploy! 🚀**
