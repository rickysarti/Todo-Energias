# Generador del logo TodoEnergías (trazado vectorial con Montserrat).
# Requiere: pip fonttools y Montserrat[wght].ttf (Google Fonts, OFL) en esta carpeta como Montserrat.ttf
# Uso: python3 gen.py  -> genera wordmark.svg, lockup.svg, mark.svg, icon.svg
import math
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

_cache = {}
def font(w):
    if w not in _cache:
        _cache[w] = instantiateVariableFont(TTFont('Montserrat.ttf'), {'wght': w})
    return _cache[w]

def text_path(txt, size, x, y, weight=800, tracking=0):
    f = font(weight); gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
    s = size / upm; d = []; cx = x
    for ch in txt:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        d.append(pen.getCommands())
        cx += gs[g].width * s + tracking
    return ' '.join(d), cx - x - tracking

CHAR = '#333C47'; ORANGE = '#F7A21B'; YELLOW = '#FCCF0A'; GREEN = '#00A650'; WHITE = '#FFFFFF'

def arc(cx, cy, r, a0, a1):
    p = lambda a: (cx + r*math.sin(math.radians(a)), cy - r*math.cos(math.radians(a)))
    x0, y0 = p(a0); x1, y1 = p(a1); large = 1 if (a1 - a0) > 180 else 0
    return f'M{x0:.2f} {y0:.2f} A{r:.2f} {r:.2f} 0 {large} 1 {x1:.2f} {y1:.2f}'

def mark(ox=0, oy=0, s=1.0, ink=CHAR, mono=None, needle=60):
    """Símbolo: medidor de 270° en tres tramos (sol, electricidad, renovables) + aguja. Caja 120x120."""
    cx, cy, r, sw = 60*s + ox, 62*s + oy, 44*s, 17*s
    gap = 7; start = -135; seg = (270 - 2*gap) / 3
    cols = [mono]*3 if mono else [ORANGE, YELLOW, GREEN]
    out = []; a = start
    for c in cols:
        out.append(f'<path d="{arc(cx, cy, r, a, a + seg)}" fill="none" stroke="{c}" stroke-width="{sw:.2f}"/>')
        a += seg + gap
    ink = mono or ink
    ang = math.radians(needle); L = 34*s; w = 6.5*s
    tx, ty = cx + L*math.sin(ang), cy - L*math.cos(ang)
    px, py = math.cos(ang)*w, math.sin(ang)*w
    out.append(f'<path d="M{cx+px:.2f} {cy+py:.2f} L{tx:.2f} {ty:.2f} L{cx-px:.2f} {cy-py:.2f} Z" fill="{ink}" stroke="{ink}" stroke-width="{3*s:.2f}" stroke-linejoin="round"/>')
    out.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{11*s:.2f}" fill="{ink}"/>')
    return ''.join(out)

def svg(w, h, body, bg=None):
    b = f'<rect width="{w:.0f}" height="{h:.0f}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}">{b}{body}</svg>'

def wordmark(ink=CHAR, tag=True, mono=None, tagline='ENERGÍA, EN CLARO'):
    """Logotipo principal: la O de TODO es el medidor (como el sol de SolarPower)."""
    size = 100; base = 100
    dT, wT = text_path('T', size, 0, base, 800)
    s = 0.83; mx = wT + 1
    m = mark(mx, 19, s, ink=ink, mono=mono)
    x = mx + 120*s
    dD, wD = text_path('DO', size, x, base, 800)
    x2 = x + wD + 26
    dE, wE = text_path('ENERGÍAS', size, x2, base, 800)
    W = x2 + wE + 2
    body = f'<path d="{dT}" fill="{ink}"/>{m}<path d="{dD}" fill="{ink}"/><path d="{dE}" fill="{ink}"/>'
    H = 112
    if tag:
        dt, wt = text_path(tagline, 27, 0, 0, 600, tracking=0)
        tr = (W - 4 - wt) / (len(tagline) - 1)
        dt, wt = text_path(tagline, 27, 2, 152, 600, tracking=tr)
        body += f'<path d="{dt}" fill="{ink}"/>'
        H = 158
    return svg(W, H, body)

def lockup_h(ink=CHAR, mono=None):
    """Variante compacta: símbolo + TODOENERGÍAS en dos pesos (navbar, firmas)."""
    m = mark(0, 4, 1.0, ink=ink, mono=mono)
    d1, w1 = text_path('TODO', 60, 136, 82, 800, tracking=0.5)
    d2, w2 = text_path('ENERGÍAS', 60, 136 + w1 + 2, 82, 500, tracking=0.5)
    return svg(136 + w1 + 2 + w2 + 4, 124, m + f'<path d="{d1}" fill="{ink}"/><path d="{d2}" fill="{ink}"/>')

def app_icon(bg=CHAR, size=512, pad=0.16, radius=0.22):
    s = size*(1-2*pad)/120
    body = f'<rect width="{size}" height="{size}" rx="{size*radius:.1f}" fill="{bg}"/>' + mark(size*pad, size*pad - 4*s, s, ink=WHITE)
    return svg(size, size, body)

if __name__ == '__main__':
    open('wordmark.svg', 'w').write(wordmark())
    open('wordmark-white.svg', 'w').write(wordmark(ink=WHITE))
    open('lockup.svg', 'w').write(lockup_h())
    open('mark.svg', 'w').write(svg(120, 120, mark()))
    open('icon.svg', 'w').write(app_icon())
