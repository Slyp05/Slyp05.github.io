# Builds the demo game the store and documentation captures show, in the throwaway project given as the first argument.
# "python seed.py <project>" writes the game as it stands before CloneBuster is imported; "python seed.py <project> N"
# saves step N (1 to 9), as a developer working on it would. Needs node and Chrome for the level art.
import io
import os
import struct
import subprocess
import sys
import wave
import zlib

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = os.environ.get("CHROME", r"C:\Program Files\Google\Chrome\Application\chrome.exe")
INK = (10, 19, 68, 255)


def path(*parts):
    full = os.path.join(*parts)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    return full


def write(file, data):
    with open(path(file), "wb") as f:
        f.write(data)


def text(file, content):
    with open(path(file), "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def art_cache(project):
    cache = os.path.join(project, "_StoreCaptures", "art")
    if os.path.exists(os.path.join(cache, "copy.png")) == False:
        subprocess.run(["node", os.path.join(HERE, "art.js"), cache], check=True)
        for name in [f"level-{i}" for i in range(10)] + ["copy"]:
            src = os.path.join(cache, name + ".html").replace("\\", "/")
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                            "--window-size=960,720", "--screenshot=" + os.path.join(cache, name + ".png"), "file:///" + src],
                           check=True, stderr=subprocess.DEVNULL)
    return cache


def level(project, stage):
    return Image.open(os.path.join(art_cache(project), f"level-{stage}.png")).convert("RGB")


# The hero as 32x32 pixel art, at four stages: a block, a face, colours, then a cap and shading.
def hero(stage):
    img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    body = (125, 133, 146, 255) if stage < 2 else (255, 77, 94, 255)
    d.rounded_rectangle((9, 6, 22, 29), 3, fill=body, outline=INK if stage >= 3 else None)
    if stage >= 1:
        d.rectangle((15, 11, 20, 15), fill=(255, 255, 255, 255))
        d.point([(18, 13), (19, 13)], fill=INK)
    if stage >= 3:
        d.rectangle((9, 4, 22, 7), fill=(73, 184, 90, 255), outline=INK)
        d.line((11, 10, 11, 26), fill=(255, 179, 187, 255))
    return img


def coin(stage):
    frames = []
    for i, width in enumerate((14, 10, 4, 10)):
        img = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        x0 = 8 - width // 2
        d.ellipse((x0, 1, x0 + width - 1, 14), fill=(255, 204, 0, 255), outline=INK if stage >= 1 else None)
        if stage >= 2 and width > 4:
            d.line((x0 + 3, 4, x0 + 3, 10), fill=(255, 244, 176, 255))
        frames.append(img)
    return frames


def psd(img):
    img = img.convert("RGB")
    w, h = img.size
    out = io.BytesIO()
    out.write(b"8BPS" + struct.pack(">H", 1) + b"\0" * 6 + struct.pack(">HIIHH", 3, h, w, 8, 3))
    out.write(struct.pack(">I", 0))
    info = struct.pack(">IB", 1, 1) + b"\0" * 8
    block = b"8BIM" + struct.pack(">H", 0x0421) + b"\0\0" + struct.pack(">I", len(info)) + info
    out.write(struct.pack(">I", len(block)) + block)
    out.write(struct.pack(">I", 0))
    out.write(struct.pack(">H", 0))
    for band in img.split():
        out.write(band.tobytes())
    return out.getvalue()


def aseprite(frames):
    w, h = frames[0].size
    body = b""
    for i, frame in enumerate(frames):
        chunks = []
        if i == 0:
            name = b"Layer 1"
            layer = struct.pack("<HHHHHHB3s", 1, 0, 0, 0, 0, 0, 255, b"\0\0\0") + struct.pack("<H", len(name)) + name
            chunks.append(struct.pack("<IH", len(layer) + 6, 0x2004) + layer)
        pixels = zlib.compress(frame.convert("RGBA").tobytes())
        cel = struct.pack("<HhhBHh5s", 0, 0, 0, 255, 2, 0, b"\0" * 5) + struct.pack("<HH", w, h) + pixels
        chunks.append(struct.pack("<IH", len(cel) + 6, 0x2005) + cel)
        data = b"".join(chunks)
        body += struct.pack("<IHHHHI", len(data) + 16, 0xF1FA, len(chunks), 100, 0, len(chunks)) + data
    header = struct.pack("<IHHHHHIHII", len(body) + 128, 0xA5E0, len(frames), w, h, 32, 1, 100, 0, 0)
    header += struct.pack("<B3sHBBhhHH", 0, b"\0\0\0", 0, 1, 1, 0, 0, 16, 16)
    return header + b"\0" * (128 - len(header)) + body


# The boss's concept painting: the level's final art, cropped on the platform, with the boss drawn in at each stage.
def boss(project, stage):
    img = level(project, 9).crop((420, 180, 960, 584)).resize((540, 404))
    d = ImageDraw.Draw(img)
    size = 90 + stage * 30
    d.rounded_rectangle((270 - size // 2, 330 - size, 270 + size // 2, 330), 24, fill=(120, 70, 170), outline=INK[:3], width=6)
    d.ellipse((240, 330 - size + 30, 262, 330 - size + 52), fill=(255, 255, 255))
    d.ellipse((280, 330 - size + 30, 302, 330 - size + 52), fill=(255, 255, 255))
    return img


def crate(height):
    v = [(x, y * height, z) for x in (-1, 1) for y in (0, 1) for z in (-1, 1)]
    faces = [(1, 2, 4, 3), (5, 7, 8, 6), (1, 5, 6, 2), (3, 4, 8, 7), (1, 3, 7, 5), (2, 6, 8, 4)]
    return "o Crate\n" + "".join("v %g %g %g\n" % p for p in v) + "".join("f %d %d %d %d\n" % f for f in faces)


def wav(file, hz):
    with wave.open(path(file), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(22050)
        w.writeframes(b"".join(struct.pack("<h", int(6000 * ((i * hz // 11025) % 2 * 2 - 1) * (1 - i / 4000))) for i in range(4000)))


PLAYER = [
    "    public float speed = 5f;\n",
    "    public float speed = 5f;\n    public float jumpForce = 7f;\n",
    "    public float speed = 6f;\n    public float jumpForce = 8f;\n    public int coins;\n",
    "    public float speed = 6f;\n    public float jumpForce = 8.5f;\n    public float coyoteTime = 0.1f;\n    public int coins;\n",
]


def player(n):
    return ("using UnityEngine;\n\npublic class PlayerController : MonoBehaviour\n{\n" + PLAYER[n] + "\n"
            "    void Update()\n    {\n        transform.position += Vector3.right * (Input.GetAxis(\"Horizontal\") * speed * Time.deltaTime);\n    }\n}\n")


def enemy(n):
    return ("using UnityEngine;\n\npublic class Enemy : MonoBehaviour\n{\n    public int health = %d;\n" % (3 + n)
            + ("    public float patrolDistance = 4f;\n" if n else "") + "}\n")


def seed(project):
    assets = os.path.join(project, "Assets")
    level(project, 0).save(path(assets, "Art", "Level 1.png"))
    hero(0).save(path(assets, "Art", "Hero.png"))
    write(os.path.join(assets, "Art", "Coin.aseprite"), aseprite(coin(0)))
    write(os.path.join(assets, "Art", "Boss.psd"), psd(boss(project, 0)))
    text(os.path.join(assets, "Models", "Crate.obj"), crate(1.0))
    text(os.path.join(assets, "Scripts", "PlayerController.cs"), player(0))
    text(os.path.join(assets, "Scripts", "Enemy.cs"), enemy(0))
    text(os.path.join(assets, "Scripts", "Coin.cs"), "using UnityEngine;\n\npublic class Coin : MonoBehaviour\n{\n    public int value = 1;\n}\n")
    wav(os.path.join(assets, "Audio", "Jump.wav"), 660)
    # A pack bought on the Asset Store: Unity writes its origin into each file's .meta.
    for i, name in enumerate(("Barrel", "Fence", "Signpost")):
        file = path(assets, "Pixel Props Pack", "Sprites", name + ".png")
        prop = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
        ImageDraw.Draw(prop).rectangle((6 + i * 2, 8, 25 - i * 2, 30), fill=(150, 100, 60, 255), outline=INK)
        prop.save(file)
        text(file + ".meta", "fileFormatVersion: 2\nguid: 5e1c0a7b2d3f4e5a8b9c%012d\nDefaultImporter:\n  externalObjects: {}\n  userData: \n  assetBundleName: \n  assetBundleVariant: \nAssetOrigin:\n  serializedVersion: 1\n  productId: 40001\n  packageName: Pixel Props Pack\n  packageVersion: 2.1\n  assetPath: Assets/Pixel Props Pack/Sprites/%s.png\n  uploadId: 70001\n" % (i, name))
    Image.open(os.path.join(art_cache(project), "copy.png")).convert("RGB").save(path(project, "_StoreCaptures", "Copy screenshot.png"))


def step(project, n):
    assets = os.path.join(project, "Assets")
    level(project, n).save(path(assets, "Art", "Level 1.png"))
    if n in (2, 6, 9):
        text(os.path.join(assets, "Scripts", "PlayerController.cs"), player((2, 6, 9).index(n) + 1))
    if n in (3, 7):
        hero(2 if n == 3 else 3).save(path(assets, "Art", "Hero.png"))
    if n in (5, 9):
        write(os.path.join(assets, "Art", "Coin.aseprite"), aseprite(coin((5, 9).index(n) + 1)))
    if n == 5:
        text(os.path.join(assets, "Scripts", "Enemy.cs"), enemy(1))
    if n in (4, 7):
        write(os.path.join(assets, "Art", "Boss.psd"), psd(boss(project, (4, 7).index(n) + 1)))
    if n == 8:
        text(os.path.join(assets, "Models", "Crate.obj"), crate(1.5))


if __name__ == "__main__":
    if len(sys.argv) > 2:
        step(sys.argv[1], int(sys.argv[2]))
    else:
        seed(sys.argv[1])
