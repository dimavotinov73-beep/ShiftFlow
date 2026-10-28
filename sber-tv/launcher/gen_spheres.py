"""Abstract wallpapers in the spirit of the iPhone 16 ones: large matte spheres, softly lit, each with a thin glowing
rim, overlapping on a dark ground. Original renders (no Apple artwork), 1920x1080 for a TV.

usage: python3 gen_spheres.py OUT_DIR [NAME ...]
"""
import os
import sys

import numpy as np
from PIL import Image

W, H, SS = 1920, 1080, 2          # output size, supersampling
w, h = W * SS, H * SS


def hexrgb(s):
    s = s.lstrip('#')
    return np.array([int(s[i:i + 2], 16) / 255.0 for i in (0, 2, 4)], dtype=np.float32)


def norm(v):
    v = np.asarray(v, dtype=np.float32)
    return v / np.linalg.norm(v)


yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
# Coordinates in units of the screen height: x 0..1.78, y 0..1.
X, Y = xx / h, yy / h


def background(top, bottom, angle=0.0):
    t = np.clip((Y * np.cos(angle) + (X / 1.78) * np.sin(angle)), 0, 1)[..., None]
    return hexrgb(top) * (1 - t) + hexrgb(bottom) * t


def sphere(img, cx, cy, r, dark, light, rim, rim2, key=(-0.78, -0.5, 0.38), back=(0.75, 0.66),
           rim_width=0.0028, glow=0.22, shadow=0.7, wrap=0.12, gamma=1.9):
    """Paints one sphere over img (painter's order: later spheres lie on top)."""
    dx, dy = (X - cx) / r, (Y - cy) / r
    d2 = dx * dx + dy * dy
    d = np.sqrt(d2)
    inside = d < 1.0
    # Soft contact shadow on what lies below, just outside the edge.
    out = (d >= 1.0)
    falloff = np.exp(-np.maximum(d - 1.0, 0) * r / 0.045)
    img *= (1 - shadow * falloff * out)[..., None]

    nz = np.sqrt(np.clip(1 - d2, 0, 1))
    L = norm(key)
    lam = (dx * L[0] + dy * L[1] + nz * L[2])
    diffuse = np.clip((lam + wrap) / (1 + wrap), 0, 1) ** gamma
    col = hexrgb(dark)[None, None, :] * (1 - diffuse[..., None]) + hexrgb(light)[None, None, :] * diffuse[..., None]
    # Fresnel-like edge: a thin bright line right at the rim, coloured by where the light comes from.
    edge = np.exp(-(1 - np.clip(d, 0, 1)) * r / rim_width)
    B = norm(back)
    side = np.clip(dx * B[0] + dy * B[1], -1, 1)               # +1 on the back-lit side
    lit = np.clip(-(dx * L[0] + dy * L[1]), -1, 1)              # +1 on the key-lit side
    rim_col = (hexrgb(rim)[None, None, :] * np.clip(side, 0, 1)[..., None] ** 1.5
               + hexrgb(rim2)[None, None, :] * np.clip(lit, 0, 1)[..., None] ** 2 * 0.7)
    col = col + rim_col * edge[..., None] * 1.1
    # A broad inner sheen along the back-lit edge, and a softer one along the lit edge.
    band = 1 - np.clip(d, 0, 1)
    sheen = np.exp(-band * r / 0.035) * np.clip(side, 0, 1) ** 2
    col = col + hexrgb(rim)[None, None, :] * sheen[..., None] * 0.30
    lit_sheen = np.exp(-band * r / 0.06) * np.clip(lit, 0, 1) ** 2
    col = col + hexrgb(light)[None, None, :] * lit_sheen[..., None] * 0.25
    img[inside] = col[inside]
    # Faint halo just outside the rim on the back-lit side.
    gap = np.maximum(d - 1.0, 0) * r
    halo = (np.exp(-gap / 0.006) * 0.6 + np.exp(-gap / 0.05) * 0.4) * out * np.clip(side, 0, 1) ** 1.5 * glow
    img += hexrgb(rim)[None, None, :] * halo[..., None]
    return img


PALETTES = {
    # name: ground top, ground bottom, sphere dark, sphere light, back rim, key rim
    'graphite-teal': ('#1b2125', '#05080a', '#030405', '#8b979c', '#55e0cf', '#dfe8ea'),
    'midnight-silver': ('#141416', '#030303', '#030304', '#9a9ca2', '#c9ced6', '#ffffff'),
    'deep-blue': ('#0c1a38', '#02050d', '#020610', '#4f78c4', '#7fb2ff', '#cfe0ff'),
    'ultraviolet': ('#1d1236', '#05030c', '#05030a', '#7c5cc8', '#c09bff', '#ecdfff'),
    'desert-gold': ('#2b2014', '#060403', '#070503', '#c09a68', '#ffcf8a', '#fff1dc'),
    'forest': ('#0f2219', '#020604', '#020504', '#4f9a78', '#8ef0c2', '#e2fff2'),
    'rose': ('#2e1220', '#070205', '#080205', '#c46a95', '#ff9fc8', '#ffe5f0'),
    'ocean': ('#0a2a33', '#010608', '#010608', '#3c9db0', '#6fe7ff', '#dbfbff'),
    'ember': ('#2a120c', '#060201', '#080302', '#c4643f', '#ff9b6b', '#ffe3d6'),
    'storm': ('#1f2630', '#06080b', '#05070a', '#8797ad', '#a8c4ff', '#f0f4ff'),
}

LAYOUTS = {
    # spheres as (cx, cy, r) in screen-height units, back to front
    'a': [(0.25, -0.30, 0.85), (1.55, 0.05, 0.70), (0.95, 1.35, 0.78), (1.18, 0.62, 0.36)],
    'b': [(-0.10, 0.75, 0.80), (0.85, 1.55, 0.95), (1.70, 0.30, 0.75), (0.95, 0.20, 0.42)],
    'c': [(1.95, 1.05, 1.05), (0.20, 0.10, 0.70), (0.80, 0.95, 0.55)],
    'd': [(0.45, 1.20, 0.95), (1.55, 1.25, 0.80), (1.05, -0.45, 0.85), (0.20, 0.25, 0.30)],
}

PLAN = [
    ('graphite-teal', 'a'), ('midnight-silver', 'b'), ('deep-blue', 'c'), ('ultraviolet', 'd'),
    ('desert-gold', 'a'), ('forest', 'b'), ('rose', 'c'), ('ocean', 'd'),
    ('ember', 'b'), ('storm', 'a'), ('graphite-teal', 'c'), ('deep-blue', 'd'),
]


def render(palette, layout):
    top, bottom, dark, light, rim, rim2 = PALETTES[palette]
    img = background(top, bottom, angle=0.35)
    for cx, cy, r in LAYOUTS[layout]:
        img = sphere(img, cx, cy, r, dark, light, rim, rim2)
    # A soft vignette: the corners and the bottom (where the apps sit) a little darker.
    vx = (X / 1.78 - 0.5) * 2
    vy = (Y - 0.45) * 2
    vig = 1 - 0.28 * np.clip(vx * vx * 0.6 + vy * vy * 0.8, 0, 1) ** 1.5
    img = img * vig[..., None]
    # A whisper of grain so the gradients never band on a TV panel.
    img = img + (np.random.default_rng(7).random(img.shape, dtype=np.float32) - 0.5) / 255.0
    img = np.clip(img, 0, 1)
    pic = Image.fromarray((img * 255 + 0.5).astype(np.uint8), 'RGB')
    return pic.resize((W, H), Image.LANCZOS)


if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    only = set(sys.argv[2:])
    for i, (palette, layout) in enumerate(PLAN, 1):
        name = f'{i:02d}-{palette}-{layout}'
        if only and name not in only and str(i) not in only:
            continue
        render(palette, layout).save(os.path.join(out, name + '.jpg'), 'JPEG', quality=92, optimize=True,
                                     progressive=True, subsampling=0)
        print(name)
