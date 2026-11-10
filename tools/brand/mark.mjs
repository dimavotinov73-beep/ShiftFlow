// ShiftFlow brand mark: a "day" bubble resting in the notch of a flowing line.
// The same shape is used by the app's tab bar, so the logo and the UI tell one story.
// All geometry is computed here, so every icon size is generated from one source.

export const BRAND = {
  mint: '#3DDCB0',
  ink: '#1F1D1A',     // чернила
  line: '#F3EFE4',    // бумага
};

const f2 = (n) => Math.round(n * 100) / 100;

/**
 * Geometry of the mark inside a 100x100 box.
 * Returns the ball (circle) and the centre-line path of the cradle stroke.
 */
export function markGeometry({ cx = 50, lift = 6.5, r = 14, sw = 8, gap = 3.8, fillet = 7, half = 35 } = {}) {
  // Vertical layout: keep the whole mark optically centred in the box.
  const rc = r + gap + sw / 2;                 // radius of the cradle centre-line
  const top = -lift - r;                        // ball top relative to line
  const bottom = -lift + rc + sw / 2;           // cradle bottom edge relative to line
  const y0 = 50 - (top + bottom) / 2 + 1.2;     // line y (slightly low = optical centre)
  const cy = y0 - lift;                         // ball centre
  const sx = Math.sqrt((rc + fillet) ** 2 - (lift + fillet) ** 2);
  const k = rc / (rc + fillet);
  const pL = [cx - sx * k, cy + (lift + fillet) * k];
  const pR = [cx + sx * k, cy + (lift + fillet) * k];
  const d = [
    `M${f2(cx - half)} ${f2(y0)}`,
    `L${f2(cx - sx)} ${f2(y0)}`,
    `A${f2(fillet)} ${f2(fillet)} 0 0 1 ${f2(pL[0])} ${f2(pL[1])}`,
    `A${f2(rc)} ${f2(rc)} 0 0 0 ${f2(pR[0])} ${f2(pR[1])}`,
    `A${f2(fillet)} ${f2(fillet)} 0 0 1 ${f2(cx + sx)} ${f2(y0)}`,
    `L${f2(cx + half)} ${f2(y0)}`,
  ].join(' ');
  return { cx, cy, r, sw, d, y0 };
}

/** Mark drawn in a 100x100 coordinate system (no background). */
export function markSvgBody({ mono = false, color = BRAND.line, idp = 'sf' } = {}) {
  const g = markGeometry();
  if (mono) {
    return `<path d="${g.d}" fill="none" stroke="${color}" stroke-width="${g.sw}" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<circle cx="${g.cx}" cy="${f2(g.cy)}" r="${g.r}" fill="${color}"/>`;
  }
  // Плоский знак: линия цвета бумаги и шар акцентного цвета — без градиентов, блика и свечения
  return `<path d="${g.d}" fill="none" stroke="${BRAND.line}" stroke-width="${g.sw}" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<circle cx="${g.cx}" cy="${f2(g.cy)}" r="${g.r}" fill="${BRAND.mint}"/>`;
}

function background({ rounded }) {
  return rounded
    ? `<rect width="100" height="100" rx="22.5" fill="${BRAND.ink}"/>`
    : `<rect width="100" height="100" fill="${BRAND.ink}"/>`;
}

/**
 * Full icon.
 *  kind: 'rounded'  – app icon with rounded-square background (web, store)
 *        'full'     – full-bleed square background, mark inside the maskable safe zone
 *        'fg'       – transparent foreground for Android adaptive icons (108dp canvas)
 *        'bg'       – background layer only for Android adaptive icons
 *        'mono'     – single-colour mark for Android 13+ themed icons / favicons
 */
export function iconSvg(kind = 'rounded', size = 512) {
  const idp = 'sf' + kind;
  let body = '';
  if (kind === 'rounded') {
    body = background({ rounded: true, idp }) + `<g transform="translate(8 8) scale(0.84)">${markSvgBody({ idp })}</g>`;
  } else if (kind === 'full') {
    body = background({ rounded: false, idp }) + `<g transform="translate(13 13) scale(0.74)">${markSvgBody({ idp })}</g>`;
  } else if (kind === 'fg') {
    // Adaptive icon: 108dp canvas, 66dp safe circle -> mark spans the central ~56%.
    body = `<g transform="translate(17 17) scale(0.66)">${markSvgBody({ idp })}</g>`;
  } else if (kind === 'bg') {
    body = background({ rounded: false, idp });
  } else if (kind === 'mono') {
    body = `<g transform="translate(17 17) scale(0.66)">${markSvgBody({ mono: true, color: '#000' })}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">${body}</svg>`;
}

/** Small favicon: simpler, thicker, no glow so it stays crisp at 16–32px. */
export function faviconSvg() {
  const g = markGeometry({ sw: 10, r: 15.5, gap: 3.6, half: 38 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">`
    + `<rect width="100" height="100" rx="24" fill="${BRAND.ink}"/>`
    + `<g transform="translate(4 4) scale(0.92)">`
    + `<path d="${g.d}" fill="none" stroke="${BRAND.line}" stroke-width="${g.sw}" stroke-linecap="round"/>`
    + `<circle cx="${g.cx}" cy="${f2(g.cy)}" r="${g.r}" fill="${BRAND.mint}"/></g></svg>`;
}

/** Inline mark for the app header: uses currentColor for the line and the accent for the ball. */
export function inlineMarkSvg() {
  const g = markGeometry();
  return `<svg viewBox="10 27 80 48" fill="none" aria-hidden="true">`
    + `<path d="${g.d}" stroke="currentColor" stroke-width="${g.sw}" stroke-linecap="round"/>`
    + `<circle cx="${g.cx}" cy="${f2(g.cy)}" r="${g.r}" fill="var(--accent)"/></svg>`;
}
