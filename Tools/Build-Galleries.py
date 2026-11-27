"""
Build-Galleries.py

Writes the images the package page galleries show, from the store media in Sources/.
docs/_data/media.yml lists, per package, its Sources folder, video and screenshots.

For each package, into docs/assets/media/<slug>/:
  NN.webp        Screenshot NN, at most 1950 px wide (the store's size), for the viewer
                 and the fullscreen view.
  NN-thumb.webp  The same at 240 px wide, for the thumbnail strip.
  video.webp     The YouTube thumbnail without its black bars, saved here so the
                 page loads nothing from YouTube until the visitor presses play.

Run from anywhere:  python Tools/Build-Galleries.py
Needs Pillow (pip install pillow). Overwrites the outputs every run.
"""
import json
import re
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "docs" / "_data" / "media.yml"
OUT = ROOT / "docs" / "assets" / "media"

FULL_WIDTH = 1950
THUMB_WIDTH = 240


def read_media():
    """Reads media.yml. Its shape is fixed (see the file's header), so a small reader
    does the job and the script needs nothing beyond Pillow."""
    packages, current = {}, None
    for line in DATA.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line.startswith(" "):
            current = packages.setdefault(line.rstrip(":"), {"screenshots": []})
        elif m := re.match(r"\s+- alt: (.*)", line):
            current["screenshots"].append(json.loads(m.group(1)))
        elif m := re.match(r"\s+(source|video): (.*)", line):
            value = m.group(2)
            current[m.group(1)] = json.loads(value) if value.startswith('"') else value
    return packages


def save(image, path, width, quality):
    image = image.convert("RGB")
    if image.width > width:
        image = image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
    image.save(path, "WEBP", quality=quality, method=6)


def trim_bars(image):
    """Crops the black bars YouTube adds when a thumbnail is not 16:9."""
    mask = image.convert("L").point(lambda v: 255 if v > 16 else 0)
    box = mask.getbbox()
    return image.crop(box) if box else image


def main():
    for slug, media in read_media().items():
        source = ROOT / "Sources" / media["source"] / "_Store Images & Text"
        target = OUT / slug
        target.mkdir(parents=True, exist_ok=True)

        for n, _ in enumerate(media["screenshots"], 1):
            matches = sorted(source.glob(f"Screenshot {n:02d}.*"))
            if not matches:
                sys.exit(f"{slug}: missing {source / f'Screenshot {n:02d}'}.png or .jpg")
            with Image.open(matches[0]) as image:
                save(image, target / f"{n:02d}.webp", FULL_WIDTH, 85)
                save(image, target / f"{n:02d}-thumb.webp", THUMB_WIDTH, 80)

        if video := media.get("video"):
            for name in ("maxresdefault", "hqdefault"):
                try:
                    url = f"https://i.ytimg.com/vi/{video}/{name}.jpg"
                    data = urllib.request.urlopen(url, timeout=20).read()
                    break
                except OSError:
                    data = None
            if data is None:
                sys.exit(f"{slug}: could not download the thumbnail of video {video}")
            with Image.open(BytesIO(data)) as image:
                image = trim_bars(image.convert("RGB"))
                save(image, target / "video.webp", 1280, 82)
                save(image, target / "video-thumb.webp", THUMB_WIDTH, 80)

        print(f"{slug}: {len(media['screenshots'])} screenshots" + (", video" if media.get("video") else ""))


if __name__ == "__main__":
    main()
