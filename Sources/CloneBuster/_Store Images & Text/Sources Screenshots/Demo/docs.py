# Writes the documentation's images from the 1x captures in ../Captures, into Assets/CloneBuster/Documentation/img/.
# Each image is saved as PNG under an extensionless name, as the pages reference it.
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CAPTURES = os.path.join(HERE, "..", "Captures")
OUT = os.path.join(HERE, "..", "..", "..", "Assets", "CloneBuster", "Documentation", "img")

# Name in the docs: capture file, crop box (left, top, right, bottom) or None for the whole capture.
IMAGES = {
    "window_first_open": ("doc-first-open.png", None),
    "inspector_line": ("doc-inspector.png", (0, 0, 559, 220)),
    "proof_tab": ("doc-proof-tab.png", None),
    "proof_options": ("doc-proof-options.png", (0, 0, 820, 346)),
    "proof_result": ("doc-proof-result.png", (0, 0, 820, 346)),
    "proof_pdf": ("pdf-3.png", (40, 30, 754, 560)),
    "reel_tab": ("doc-reel-tab.png", None),
    "settings_page": ("doc-settings.png", (0, 0, 1001, 530)),
    "purchased_file": ("doc-purchased.png", None),
    "no_composite": ("doc-no-composite.png", None),
}


def reel_frames():
    # A dated version, the original beside the copy, and the end card, side by side.
    frames = [Image.open(os.path.join(CAPTURES, f"reel-{i:03d}.png")).convert("RGB").resize((360, 296), Image.LANCZOS) for i in (4, 10, 11)]
    sheet = Image.new("RGBA", (360 * 3 + 16 * 2, 296), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.paste(frame, (i * 376, 0))
    return sheet


os.makedirs(OUT, exist_ok=True)
for name, (capture, box) in IMAGES.items():
    image = Image.open(os.path.join(CAPTURES, capture)).convert("RGB")
    if box:
        image = image.crop(box)
    image.save(os.path.join(OUT, name), "PNG")
    print(name, image.size)

reel_frames().save(os.path.join(OUT, "reel_frames"), "PNG")
print("reel_frames")
