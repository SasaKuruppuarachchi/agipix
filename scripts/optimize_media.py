#!/usr/bin/env python3
"""Make web-sized derivatives of the site's images and videos.

Originals are never modified or deleted. For every raster image the site uses
(found by scanning pages, layouts and styles) this writes, next to the original:

    name.web.webp   max 2000 px on the long side (what the pages load)
    name.web.jpg    same size, for browsers without WebP   (opaque images)
    name.web.png    same size, for browsers without WebP   (images with transparency)
    name.web.sm.webp  960 px, for srcset on small screens and card thumbnails (large images only)

and records each one in _data/media.yml. The doc layout reads that manifest to
swap derivatives in (with width/height) at build time, so Markdown keeps
pointing at the originals and the lightbox can still open them.

It also makes:
    assets/videos/exploded.web.mp4 + exploded.poster.{webp,jpg}   hero loop (from exploded.mp4)
    assets/images/social-card.jpg                                   1200x630 Open Graph image
    assets/icons/{favicon-32,icon-192,icon-512,apple-touch-icon}.png

Usage (from the repository root):
    python3 scripts/optimize_media.py            # only new or changed files
    python3 scripts/optimize_media.py --force    # rebuild everything
    python3 scripts/optimize_media.py --all      # every image under assets/images, used or not
    python3 scripts/optimize_media.py --no-video --no-brand

Needs Pillow. Video needs ffmpeg on PATH or `pip install imageio-ffmpeg`.
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "assets" / "images"
MANIFEST = ROOT / "_data" / "media.yml"
MAX_SIDE = 2000
WEBP_QUALITY = 82          # photos
WEBP_QUALITY_GRAPHIC = 90  # diagrams / screenshots (PNG sources)
JPEG_QUALITY = 82
SMALL_SIDE = 960           # extra srcset candidate for images wider than ~1.3x this
SMALL_QUALITY = 76
# Per-file WebP quality (e.g. textures that sit under a dark overlay)
QUALITY_OVERRIDES = {"assets/images/carbon.jpg": 50}
RASTER = {".jpg", ".jpeg", ".png"}
SCAN_GLOBS = ["*.md", "*.Md", "*.html", "_layouts/*.html", "_includes/*.html", "docs/**/*.md",
              "docs/**/*.Md", "assets/css/*.scss", "assets/css/*.css"]
SKIP_DIRS = {"_site", ".git", "cad", "vendor", "node_modules"}
REF_RE = re.compile(r"assets/images/[^\s\"')<>]+?\.(?:png|jpe?g)", re.I)

VIDEO_JOBS = [
    # source, output, width, crf, poster time (s): pick a representative frame
    ("assets/videos/exploded.mp4", "assets/videos/exploded.web.mp4", 1280, 27, 10),
]


def is_derivative(p: Path) -> bool:
    return ".web." in p.name or p.name.startswith("social-card")


def referenced_images() -> set[Path]:
    found: set[Path] = set()
    for pattern in SCAN_GLOBS:
        for f in ROOT.glob(pattern):
            if any(part in SKIP_DIRS for part in f.relative_to(ROOT).parts):
                continue
            text = f.read_text(encoding="utf-8", errors="ignore")
            for m in REF_RE.finditer(text):
                p = ROOT / m.group(0)
                if p.exists() and not is_derivative(p):
                    found.add(p)
    # header backgrounds are referenced relatively from the stylesheet
    for name in ("carbon.jpg", "banner.png", "banner_text.png"):
        if (IMAGES / name).exists():
            found.add(IMAGES / name)
    return found


def all_images() -> set[Path]:
    return {p for p in IMAGES.rglob("*") if p.suffix.lower() in RASTER and not is_derivative(p)
            and "_etc" not in p.parts}


def has_alpha(im: Image.Image) -> bool:
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        alpha = im.convert("RGBA").getchannel("A")
        return alpha.getextrema()[0] < 250
    return False


def derive(job: tuple[str, bool]) -> dict:
    src_s, force = job
    src = Path(src_s)
    stem = src.with_suffix("")
    webp = stem.with_name(stem.name + ".web.webp")
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)  # bake camera orientation into the pixels
    alpha = has_alpha(im)
    fallback = stem.with_name(stem.name + (".web.png" if alpha else ".web.jpg"))
    im = im.convert("RGBA" if alpha else "RGB")
    if max(im.size) > MAX_SIDE:
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    stale = lambda p: force or not p.exists() or p.stat().st_mtime < src.stat().st_mtime
    graphic = src.suffix.lower() == ".png"
    quality = QUALITY_OVERRIDES.get(src.relative_to(ROOT).as_posix(), WEBP_QUALITY_GRAPHIC if graphic else WEBP_QUALITY)
    if stale(webp):
        im.save(webp, "WEBP", quality=quality, method=6)
        if graphic:  # flat diagrams are often smaller lossless
            tmp = webp.with_suffix(".tmp")
            im.save(tmp, "WEBP", lossless=True, quality=100, method=5)
            if tmp.stat().st_size < webp.stat().st_size:
                tmp.replace(webp)
            else:
                tmp.unlink()
    if stale(fallback):
        if alpha:
            im.save(fallback, "PNG", optimize=True)
        else:
            im.save(fallback, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    small = stem.with_name(stem.name + ".web.sm.webp")
    has_small = im.width > SMALL_SIDE * 1.3
    if has_small and stale(small):
        sm = im.copy()
        sm.thumbnail((SMALL_SIDE, SMALL_SIDE * 4), Image.LANCZOS)
        sm.save(small, "WEBP", quality=min(quality, SMALL_QUALITY) if not graphic else quality, method=6)
    elif not has_small and small.exists():
        small.unlink()
    orig_bytes = src.stat().st_size
    rel = lambda p: p.relative_to(ROOT).as_posix()
    # a small original that is already lighter than its WebP is served as-is
    use = webp if webp.stat().st_size < orig_bytes else src
    return {
        "src": rel(src), "webp": rel(use), "fallback": rel(fallback),
        "sm": rel(small) if has_small else "", "sm_w": SMALL_SIDE if has_small else 0,
        "w": im.width, "h": im.height, "bytes": orig_bytes,
        "web_bytes": webp.stat().st_size, "fallback_bytes": fallback.stat().st_size,
    }


def write_manifest(entries: list[dict]) -> None:
    MANIFEST.parent.mkdir(exist_ok=True)
    lines = ["# Generated by scripts/optimize_media.py - do not edit by hand.",
             "# The layouts swap `src` for `webp` (with width/height) at build time;",
             "# `src` stays reachable as the full-resolution original."]
    for e in sorted(entries, key=lambda e: e["src"]):
        lines.append(f"- src: \"{e['src']}\"")
        for k in ("webp", "fallback", "sm"):
            lines.append(f"  {k}: \"{e[k]}\"")
        for k in ("sm_w", "w", "h", "bytes", "web_bytes", "fallback_bytes"):
            lines.append(f"  {k}: {e[k]}")
    MANIFEST.write_text("\n".join(lines) + "\n", encoding="utf-8")


def ffmpeg_exe() -> str | None:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg  # type: ignore
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return None


def videos(force: bool) -> None:
    exe = ffmpeg_exe()
    if not exe:
        print("! ffmpeg not found (pip install imageio-ffmpeg); skipping video")
        return
    for src_s, out_s, width, crf, poster_t in VIDEO_JOBS:
        src, out = ROOT / src_s, ROOT / out_s
        if not src.exists():
            print(f"! missing {src_s}")
            continue
        poster = out.with_name(out.name.replace(".web.mp4", ".poster.jpg"))
        if force or not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
            subprocess.run([exe, "-y", "-loglevel", "error", "-i", str(src), "-an",
                            "-vf", f"scale={width}:-2:flags=lanczos,format=yuv420p",
                            "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-profile:v", "high",
                            "-movflags", "+faststart", str(out)], check=True)
        if force or not poster.exists() or poster.stat().st_mtime < src.stat().st_mtime:
            subprocess.run([exe, "-y", "-loglevel", "error", "-ss", str(poster_t), "-i", str(src), "-vf",
                            f"scale={width}:-2:flags=lanczos", "-frames:v", "1", "-q:v", "3", str(poster)],
                           check=True)
            Image.open(poster).save(poster.with_suffix(".webp"), "WEBP", quality=80, method=6)
        print(f"  {src_s} ({src.stat().st_size / 1e6:.1f} MB) -> {out_s} ({out.stat().st_size / 1e6:.2f} MB) + poster")


def font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = (["NotoSans-Bold.ttf", "DejaVuSans-Bold.ttf"] if bold else ["NotoSans-Regular.ttf", "DejaVuSans.ttf"])
    for d in ("/usr/share/fonts", "/Library/Fonts", "C:/Windows/Fonts", os.path.expanduser("~/.fonts")):
        for n in names:
            for p in Path(d).rglob(n) if Path(d).exists() else []:
                return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def brand(force: bool) -> None:
    icons = ROOT / "assets" / "icons"
    icons.mkdir(exist_ok=True)
    card = IMAGES / "social-card.jpg"
    text = Image.open(IMAGES / "banner_text.png").convert("RGBA")
    drone = Image.open(IMAGES / "banner.png").convert("RGBA")

    if force or not card.exists():
        W, H = 1200, 630
        bg = ImageOps.fit(Image.open(IMAGES / "carbon.jpg").convert("RGB"), (W, H), Image.LANCZOS)
        bg = Image.blend(bg, Image.new("RGB", (W, H), (8, 8, 8)), 0.55).convert("RGBA")
        layer = Image.new("RGBA", drone.size)
        layer.alpha_composite(drone)
        glow = text.copy()
        r, g, b, a = glow.split()
        glow = Image.merge("RGBA", (r.point(lambda _: 221), g.point(lambda _: 79), b.point(lambda _: 23), a))
        glow = glow.filter(ImageFilter.GaussianBlur(18))
        layer.alpha_composite(glow)
        layer.alpha_composite(text)
        layer.thumbnail((1100, 440), Image.LANCZOS)
        bg.alpha_composite(layer, ((W - layer.width) // 2, 18))
        d = ImageDraw.Draw(bg)
        d.rectangle([0, H - 150, W, H], fill=(10, 10, 10, 235))
        d.rectangle([0, H - 152, W, H - 149], fill=(221, 79, 23, 255))
        f1, f2 = font(36), font(24, bold=False)
        t1 = "Bridging Simulation and Reality in Indoor Aerial Inspection"
        t2 = "ICUAS 2026  ·  open hardware, ROS 2 autonomy, Isaac Sim digital twin"
        for t, f, y, c in ((t1, f1, H - 128, (240, 240, 240)), (t2, f2, H - 70, (190, 190, 190))):
            w = d.textlength(t, font=f)
            d.text(((W - w) / 2, y), t, font=f, fill=c)
        bg.convert("RGB").save(card, "JPEG", quality=86, optimize=True, progressive=True)
        print(f"  social card -> {card.relative_to(ROOT)} ({card.stat().st_size / 1e3:.0f} kB)")

    # App icon: the wordmark's "A" on the site's near-black, with the accent glow
    if force or not (icons / "apple-touch-icon.png").exists():
        bbox = text.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
        word = text.crop(bbox)
        cols = [x for x in range(word.width) if word.getchannel("A").crop((x, 0, x + 1, word.height)).getextrema()[1] > 40]
        # first glyph = first run of non-empty columns
        end = cols[0]
        for x in cols[1:]:
            if x != end + 1:
                break
            end = x
        letter = word.crop((cols[0], 0, end + 1, word.height))
        letter = letter.crop(letter.getbbox())
        for size, name, pad in ((512, "icon-512.png", 0.2), (192, "icon-192.png", 0.2),
                                (180, "apple-touch-icon.png", 0.18), (32, "favicon-32.png", 0.08)):
            base = Image.new("RGBA", (size, size), (10, 10, 10, 255))
            inner = int(size * (1 - 2 * pad))
            g = letter.copy()
            g.thumbnail((inner, inner), Image.LANCZOS)
            ox, oy = (size - g.width) // 2, (size - g.height) // 2
            if size >= 64:
                halo = Image.new("RGBA", (size, size))
                tint = Image.new("RGBA", g.size, (221, 79, 23, 255))
                tint.putalpha(g.getchannel("A"))
                halo.alpha_composite(tint, (ox, oy))
                base.alpha_composite(halo.filter(ImageFilter.GaussianBlur(size / 28)))
                d = ImageDraw.Draw(base)
                d.rectangle([0, size - max(3, size // 32), size, size], fill=(221, 79, 23, 255))
            base.alpha_composite(g, (ox, oy))
            base.convert("RGB").save(icons / name, "PNG", optimize=True)
        print(f"  icons -> {icons.relative_to(ROOT)}/")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--force", action="store_true", help="rebuild derivatives even if they are up to date")
    ap.add_argument("--all", action="store_true", help="process every image under assets/images")
    ap.add_argument("--no-video", action="store_true")
    ap.add_argument("--no-brand", action="store_true")
    a = ap.parse_args()

    os.chdir(ROOT)
    srcs = sorted(all_images() if a.all else referenced_images())
    print(f"Images: {len(srcs)}")
    with ProcessPoolExecutor() as pool:
        entries = list(pool.map(derive, [(str(p), a.force) for p in srcs]))
    before = sum(e["bytes"] for e in entries)
    after = sum(e["web_bytes"] for e in entries)
    for e in entries:
        print(f"  {e['bytes'] / 1e6:6.2f} MB -> {e['web_bytes'] / 1e6:5.2f} MB  {e['src']}")
    print(f"Total: {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB (webp)")
    # keep entries for images processed in earlier --all runs
    if MANIFEST.exists() and not a.all:
        known = {e["src"] for e in entries}
        for m in re.finditer(r'- src: "([^"]+)"', MANIFEST.read_text()):
            p = ROOT / m.group(1)
            if m.group(1) not in known and p.exists():
                entries.append(derive((str(p), False)))
    write_manifest(entries)
    print(f"Manifest: {MANIFEST.relative_to(ROOT)} ({len(entries)} entries)")
    if not a.no_video:
        videos(a.force)
    if not a.no_brand:
        brand(a.force)
    return 0


if __name__ == "__main__":
    sys.exit(main())
