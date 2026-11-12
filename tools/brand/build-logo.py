"""Логотип ShiftFlow: знак (шар-«день» на линии) + надпись SHIFTFLOW шрифтом приложения (Sofia Sans Extra Condensed 900)
и девиз «Твой график — твой доход» (Caveat). Текст переводится в контуры, поэтому SVG не зависят от установленных шрифтов.

Запуск:  pip install fonttools brotli  &&  python3 tools/brand/build-logo.py
Пишет SVG в store/brand/; PNG из них делает  node tools/brand/render-logo.mjs
"""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'store', 'brand')
os.makedirs(OUT, exist_ok=True)

# Цвета бренда (как в tools/brand/mark.mjs и приложении)
INK, PAPER, MINT = '#1F1D1A', '#F3EFE4', '#3DDCB0'
MINT_DARK = '#14806A'          # «FLOW» и шар на светлом фоне — темнее, чтобы читалось
TAG_DARK, TAG_LIGHT = '#ABA699', '#5E5A50'

# Знак в квадрате 100×100 (та же геометрия, что markGeometry() в mark.mjs)
MARK_D = 'M15 51.8 L24.56 51.8 A7 7 0 0 1 30.74 55.52 A21.8 21.8 0 0 0 69.26 55.52 A7 7 0 0 1 75.44 51.8 L85 51.8'
MARK_CY, MARK_R, MARK_SW = 45.3, 14, 8
MARK_BOX = (11, 31.3, 89, 77.3)   # видимые границы знака (x0, y0, x1, y1) с учётом толщины линии


def load(name, wght=None):
    f = TTFont(os.path.join(ROOT, 'web', 'fonts', name))
    if 'fvar' in f:
        f = instantiateVariableFont(f, {'wght': wght or 400})
    return f


DISPLAY = load('sofia-condensed.woff2', 900)
HAND = load('caveat.woff2')


def text(font, s, x, baseline, size, tracking=0.0):
    """Контур строки: (svg path d, ширина). tracking — межбуквенный интервал в долях кегля."""
    cmap, gs, hmtx, upm = font.getBestCmap(), font.getGlyphSet(), font['hmtx'], font['head'].unitsPerEm
    sc, cx, parts = size / upm, x, []
    for i, ch in enumerate(s):
        gn = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[gn].draw(TransformPen(pen, (sc, 0, 0, -sc, cx, baseline)))
        parts.append(pen.getCommands())
        cx += hmtx[gn][0] * sc + (tracking * size if i < len(s) - 1 else 0)
    return ' '.join(p for p in parts if p), cx - x


def cap(font):
    return font['OS/2'].sCapHeight / font['head'].unitsPerEm


def mark(x, y, size, line, ball):
    """Знак: левый верх (x, y), сторона квадрата 100×100 → size."""
    s = size / 100
    return (f'<g transform="translate({x:.2f} {y:.2f}) scale({s:.4f})">'
            f'<path d="{MARK_D}" fill="none" stroke="{line}" stroke-width="{MARK_SW}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<circle cx="50" cy="{MARK_CY}" r="{MARK_R}" fill="{ball}"/></g>')


def svg(w, h, body, bg=None):
    b = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{b}{body}</svg>\n'


def wordmark(x, baseline, size, shift, flow):
    d1, w1 = text(DISPLAY, 'SHIFT', x, baseline, size, .02)
    d2, w2 = text(DISPLAY, 'FLOW', x + w1 + .02 * size, baseline, size, .02)
    return f'<path d="{d1}" fill="{shift}"/><path d="{d2}" fill="{flow}"/>', w1 + .02 * size + w2


def horizontal(theme, tagline=False, bg=None):
    """Знак слева, надпись справа. theme: 'dark' — для тёмного фона, 'light' — для светлого."""
    line, ball, shift, flow, tag = (PAPER, MINT, PAPER, MINT, TAG_DARK) if theme == 'dark' else (INK, MINT_DARK, INK, MINT_DARK, TAG_LIGHT)
    H = 400
    ms = 400                                   # знак 100 → 400 px
    mx0, my0, mx1, my1 = (v * ms / 100 for v in MARK_BOX)
    size = 230                                 # кегль надписи
    capH = cap(DISPLAY) * size
    mid = (my0 + my1) / 2                      # оптический центр знака
    if tagline:
        tsize = 92
        gap = 26
        block = capH + gap + tsize * .62
        base = mid - block / 2 + capH
    else:
        base = mid + capH / 2
    pad = 40
    wx = mx1 - mx0 + pad + 70
    body = mark(pad - mx0, 0, ms, line, ball)
    wm, ww = wordmark(wx, base, size, shift, flow)
    body += wm
    W = wx + ww
    if tagline:
        d, tw = text(HAND, 'Твой график — твой доход', wx + 4, base + gap + tsize * .62, tsize)
        body += f'<path d="{d}" fill="{tag}"/>'
        W = max(W, wx + 4 + tw)
    W = int(W + pad)
    return svg(W, H, body, bg)


def stacked(theme, bg=None):
    """Знак над надписью — квадрат (аватарки, соцсети)."""
    line, ball, shift, flow = (PAPER, MINT, PAPER, MINT) if theme == 'dark' else (INK, MINT_DARK, INK, MINT_DARK)
    S = 1200
    ms = 640
    mx0, my0, mx1, my1 = (v * ms / 100 for v in MARK_BOX)
    size = 230
    capH = cap(DISPLAY) * size
    _, ww = wordmark(0, 0, size, shift, flow)
    gap = 70
    total = (my1 - my0) + gap + capH
    top = (S - total) / 2
    body = mark((S - ms) / 2, top - my0, ms, line, ball)
    wm, _ = wordmark((S - ww) / 2, top + (my1 - my0) + gap + capH, size, shift, flow)
    return svg(S, S, body + wm, bg)


def mark_only(theme, size=1024, tile=False, rounded=False):
    line, ball = (PAPER, MINT) if theme == 'dark' else (INK, MINT_DARK)
    if tile:
        r = f' rx="{size * .225:.1f}"' if rounded else ''
        bg = f'<rect width="{size}" height="{size}"{r} fill="{INK}"/>'
        inner = size * .74
        return svg(size, size, bg + mark((size - inner) / 2, (size - inner) / 2, inner, PAPER, MINT))
    return svg(size, size, mark(0, 0, size, line, ball))


def avatar():
    """Аватар 400×400 (VK, RuStore — страница разработчика): знак крупно, влезает в круг."""
    S, inner = 400, 400 * .86
    return svg(S, S, mark((S - inner) / 2, (S - inner) / 2 + 400 * .02, inner, PAPER, MINT), INK)


files = {
    'shiftflow-logo-dark.svg': horizontal('dark'),
    'shiftflow-logo-light.svg': horizontal('light'),
    'shiftflow-logo-tagline-dark.svg': horizontal('dark', True),
    'shiftflow-logo-tagline-light.svg': horizontal('light', True),
    'shiftflow-logo-on-ink.svg': horizontal('dark', True, INK),
    'shiftflow-logo-on-paper.svg': horizontal('light', True, '#ECE7DA'),
    'shiftflow-stacked-on-ink.svg': stacked('dark', INK),
    'shiftflow-stacked-on-paper.svg': stacked('light', '#ECE7DA'),
    'shiftflow-mark-dark.svg': mark_only('dark'),
    'shiftflow-mark-light.svg': mark_only('light'),
    'shiftflow-icon.svg': mark_only('dark', 1024, True, False),
    'shiftflow-icon-rounded.svg': mark_only('dark', 1024, True, True),
    'shiftflow-avatar.svg': avatar(),
}
for name, data in files.items():
    open(os.path.join(OUT, name), 'w', encoding='utf-8').write(data)
print('svg:', len(files), '→', OUT)
