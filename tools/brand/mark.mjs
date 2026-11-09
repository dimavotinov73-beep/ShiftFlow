// ShiftFlow brand mark: a "day" bubble resting in the notch of a flowing line.
// The same shape is used by the app's tab bar, so the logo and the UI tell one story.
// All geometry is computed here, so every icon size is generated from one source.

export const BRAND = {
  mint: '#3DDCB0',
  mintLight: '#B9FFEA',
  mintDeep: '#119C7E',
  ink: '#07090A',
  inkTeal: '#0E2622',
  line: '#F4FBF9',
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
  return `
  <defs>
    <radialGradient id="${idp}-ball" cx="0.36" cy="0.3" r="0.78">
      <stop offset="0" stop-color="${BRAND.mintLight}"/>
      <stop offset="0.45" stop-color="${BRAND.mint}"/>
      <stop offset="1" stop-color="${BRAND.mintDeep}"/>
    </radialGradient>
    <linearGradient id="${idp}-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BRAND.line}" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="${BRAND.line}"/>
      <stop offset="1" stop-color="${BRAND.line}" stop-opacity="0.55"/>
    </linearGradient>
    <filter id="${idp}-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
  </defs>
  <circle cx="${g.cx}" cy="${f2(g.cy + 2)}" r="${g.r + 2}" fill="${BRAND.mint}" opacity="0.55" filter="url(#${idp}-glow)"/>
  <path d="${g.d}" fill="none" stroke="url(#${idp}-line)" stroke-width="${g.sw}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${g.cx}" cy="${f2(g.cy)}" r="${g.r}" fill="url(#${idp}-ball)"/>
  <ellipse cx="${f2(g.cx - 4.2)}" cy="${f2(g.cy - 5.4)}" rx="4.6" ry="2.6" fill="#fff" opacity="0.38" transform="rotate(-28 ${f2(g.cx - 4.2)} ${f2(g.cy - 5.4)})"/>`;
}

function background({ rounded, idp }) {
  const shape = rounded
    ? `<rect width="100" height="100" rx="22.5" fill="url(#${idp}-bg)"/>`
    : `<rect width="100" height="100" fill="url(#${idp}-bg)"/>`;
  const sheen = rounded
    ? `<rect x="0.5" y="0.5" width="99" height="99" rx="22" fill="none" stroke="#fff" stroke-opacity="0.07"/>`
    : '';
  return `
  <defs>
    <linearGradient id="${idp}-bg" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0" stop-color="${BRAND.inkTeal}"/>
      <stop offset="1" stop-color="${BRAND.ink}"/>
    </linearGradient>
    <radialGradient id="${idp}-halo" cx="0.5" cy="0.42" r="0.5">
      <stop offset="0" stop-color="${BRAND.mint}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${BRAND.mint}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${shape}
  <rect width="100" height="100" ${rounded ? 'rx="22.5"' : ''} fill="url(#${idp}-halo)"/>
  ${sheen}`;
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
