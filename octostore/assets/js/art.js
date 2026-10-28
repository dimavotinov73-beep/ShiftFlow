/* Иллюстрации товаров: SVG-рендер устройства в цвете конкретной позиции.
   В канале нет фото на каждую модель, поэтому карточки рисуются здесь. */
(function () {
  "use strict";

  // Ключевые слова цвета → hex. Порядок важен: сначала более конкретные.
  const COLORS = [
    ["jet black", "#0c0c0f"], ["jetblack", "#0c0c0f"], ["space black", "#26262b"], ["midnight black", "#16171c"],
    ["space gray", "#6e7076"], ["cosmic blue", "#2d3f8f"], ["sky blue", "#a9cdec"], ["iceblue", "#c3dbef"],
    ["silverblue", "#adc0d6"], ["whitesilver", "#e6e8eb"], ["blue shadow", "#3d5576"], ["violet shadow", "#58507a"],
    ["cobalt violet", "#5a4aa0"], ["pink gold", "#ebc4b5"], ["rose gold", "#e8bba9"], ["light gold", "#e6d2a2"],
    ["dark bronze", "#6b5a3e"], ["navy blue", "#24365f"], ["purple fog", "#b8abc9"], ["bright blue", "#3b7bdc"],
    ["anchor blue", "#2c4566"], ["light blue", "#a7cbe8"], ["translucent", "#a9adb6"], ["prussian blue", "#2b3e6c"],
    ["vinca blue", "#4b6fb6"], ["red velvet", "#8c1d2b"], ["strawberry bronze", "#b46d5c"], ["patina", "#6aa39b"],
    ["ceramic pop", "#f2a1a6"], ["ceramic pink", "#f3c3c9"], ["kanzan pink", "#eea4bb"], ["jasper plum", "#6d3150"],
    ["apricot", "#f0b388"], ["amber silk", "#d69a46"], ["candy pink", "#f6b3c6"], ["dreamy purple", "#c5b3e6"],
    ["frost blue", "#a9d3ea"], ["lagoon green", "#8fd0bd"], ["clay white", "#efe6dc"], ["volcanic red", "#b8232c"],
    ["cosmic red", "#a8202f"], ["sterling silver", "#c9ccd1"], ["starlight blue", "#7fa6e0"], ["nova pink", "#f3a6c3"],
    ["galactic purple", "#6b4fb3"], ["matte black", "#1c1c1f"], ["shiny black", "#101012"], ["lunar silver", "#d2d4d8"],
    ["glacier", "#cfe0ea"], ["glasier", "#cfe0ea"], ["burgundy", "#7a2232"], ["ultramarine", "#5265d6"],
    ["lavender", "#c7b9e8"], ["lavander", "#c7b9e8"], ["blueberry", "#4a58a6"], ["pistachio", "#c3d9a3"],
    ["starlight", "#ece3d3"], ["midnight", "#1f2534"], ["graphite", "#45474d"], ["natural", "#cbc2b4"],
    ["desert", "#caa983"], ["indigo", "#3e4192"], ["citrus", "#e2df6c"], ["blush", "#f1c5c8"], ["sage", "#a9b89c"],
    ["teal", "#4fb0aa"], ["navy", "#26375e"], ["mint", "#b4e2cd"], ["cream", "#efe5cf"], ["olive", "#6d6b47"],
    ["sand", "#d9c49b"], ["copper", "#c07a4b"], ["nickel", "#9c9ea3"], ["iron", "#5d5f65"], ["topaz", "#3f7fa7"],
    ["bronze", "#a8744b"], ["camo", "#6c7451"], ["pearl", "#ece6df"], ["gold", "#e5c78e"], ["silver", "#d6d8db"],
    ["white", "#f3f3f1"], ["black", "#1b1b1e"], ["gray", "#7d7f85"], ["grey", "#7d7f85"], ["orange", "#f0883a"],
    ["yellow", "#f2d264"], ["green", "#7dbf8b"], ["purple", "#a68bd9"], ["violet", "#8e6fd6"], ["pink", "#f4b6c6"],
    ["red", "#cf3039"], ["blue", "#5a8ed8"], ["brown", "#7b5a43"], ["ocean", "#2c3f5f"], ["plum", "#6d3150"],
    ["черн", "#1b1b1e"], ["чёрн", "#1b1b1e"], ["бел", "#f3f3f1"], ["фиолет", "#8e6fd6"], ["лилов", "#b6a1dd"],
    ["зелен", "#4f9a68"], ["мятн", "#a9e0c9"], ["изумруд", "#1f8a6b"], ["бирюз", "#2fa79c"], ["сер", "#8e9096"],
    ["графит", "#45474d"], ["оранж", "#f0883a"], ["бежев", "#e3d3b8"], ["малин", "#c2185b"], ["розов", "#f4b6c6"],
    ["корал", "#ff7f6a"], ["син", "#3c64c8"], ["серебр", "#d6d8db"],
  ];

  function resolve(str) {
    if (!str) return null;
    const s = String(str).toLowerCase();
    for (const [k, v] of COLORS) if (s.includes(k)) return v;
    return null;
  }

  // Основной и дополнительный цвет: «Yellow/Nickel», «Matte Black / Transitions Gray».
  function palette(color) {
    if (!color) return [null, null];
    const parts = String(color).split("/");
    return [resolve(parts[0]) || resolve(color), parts[1] ? resolve(parts[1]) : null];
  }

  function rgb(h) { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); }
  function hex(r, g, b) { return "#" + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join(""); }
  function mix(a, b, t) { const x = rgb(a), y = rgb(b); return hex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t); }
  function shade(h, t) { return t < 0 ? mix(h, "#000000", -t) : mix(h, "#ffffff", t); }
  function lum(h) { const [r, g, b] = rgb(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }

  let uid = 0;

  // Общие градиенты: корпус (металлический блик) и экран (обои в тон корпуса).
  function defs(id, c) {
    const wall1 = shade(mix(c, "#3a2cff", 0.55), -0.35);
    const wall2 = mix(c, "#ff6fb1", 0.45);
    return `<defs>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(c, 0.28)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.22)}"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${wall1}"/><stop offset=".6" stop-color="${mix(wall1, wall2, 0.6)}"/><stop offset="1" stop-color="${wall2}"/></linearGradient>
      <radialGradient id="${id}g" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>`;
  }

  const S = "#0b0d14"; // стекло/чёрные детали

  const DRAW = {
    phone(x) {
      return `
        <rect x="64" y="14" width="60" height="130" rx="14" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="70" y="21" width="30" height="30" rx="9" fill="${shade(x.c, -0.08)}" stroke="${x.d}" stroke-width=".8"/>
        <circle cx="79" cy="30" r="5.6" fill="${S}" stroke="${shade(x.c, -0.3)}" stroke-width="1.6"/>
        <circle cx="91" cy="30" r="5.6" fill="${S}" stroke="${shade(x.c, -0.3)}" stroke-width="1.6"/>
        <circle cx="79" cy="42" r="5.6" fill="${S}" stroke="${shade(x.c, -0.3)}" stroke-width="1.6"/>
        <circle cx="91" cy="42" r="2" fill="${shade(x.c, 0.5)}"/>
        <rect x="34" y="22" width="60" height="130" rx="14" fill="${x.d}"/>
        <rect x="37.5" y="25.5" width="53" height="123" rx="11" fill="url(#${x.id}s)"/>
        <rect x="54" y="31" width="20" height="6" rx="3" fill="${S}"/>
        <rect x="37.5" y="25.5" width="53" height="123" rx="11" fill="url(#${x.id}g)"/>`;
    },
    fold(x) {
      return `
        <rect x="22" y="26" width="116" height="112" rx="12" fill="${x.d}"/>
        <rect x="26" y="30" width="108" height="104" rx="9" fill="url(#${x.id}s)"/>
        <line x1="80" y1="30" x2="80" y2="134" stroke="#ffffff" stroke-opacity=".18" stroke-width="1.5"/>
        <circle cx="116" cy="37" r="2.4" fill="${S}"/>
        <rect x="26" y="30" width="108" height="104" rx="9" fill="url(#${x.id}g)"/>
        <rect x="22" y="138" width="116" height="5" rx="2.5" fill="url(#${x.id}b)"/>`;
    },
    flip(x) {
      return `
        <rect x="50" y="12" width="60" height="136" rx="14" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="55" y="18" width="50" height="56" rx="9" fill="url(#${x.id}s)"/>
        <circle cx="64" cy="27" r="5" fill="${S}" stroke="${x.d}"/><circle cx="64" cy="41" r="5" fill="${S}" stroke="${x.d}"/>
        <rect x="50" y="78" width="60" height="6" fill="${x.d}" opacity=".55"/>
        <rect x="55" y="18" width="50" height="56" rx="9" fill="url(#${x.id}g)"/>`;
    },
    tablet(x) {
      return `
        <rect x="14" y="30" width="132" height="98" rx="12" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="20" y="36" width="120" height="86" rx="7" fill="url(#${x.id}s)"/>
        <rect x="20" y="36" width="120" height="86" rx="7" fill="url(#${x.id}g)"/>
        <circle cx="80" cy="33" r="1.3" fill="${S}"/>`;
    },
    laptop(x) {
      return `
        <rect x="28" y="26" width="104" height="72" rx="7" fill="${x.d}"/>
        <rect x="32" y="30" width="96" height="64" rx="4" fill="url(#${x.id}s)"/>
        <rect x="72" y="30" width="16" height="4" rx="2" fill="${S}"/>
        <rect x="32" y="30" width="96" height="64" rx="4" fill="url(#${x.id}g)"/>
        <path d="M12 100 H148 L144 110 Q143 113 139 113 H21 Q17 113 16 110 Z" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1"/>
        <rect x="68" y="100" width="24" height="3.5" rx="1.7" fill="${x.d}" opacity=".6"/>`;
    },
    imac(x) {
      const face = shade(x.c, 0.55);
      return `
        <path d="M66 104 H94 L98 132 H62 Z" fill="${shade(x.c, -0.08)}"/>
        <rect x="52" y="130" width="56" height="6" rx="3" fill="${x.c}"/>
        <rect x="18" y="16" width="124" height="92" rx="8" fill="${face}" stroke="${shade(x.c, -0.1)}" stroke-width="1"/>
        <rect x="23" y="21" width="114" height="68" rx="3" fill="url(#${x.id}s)"/>
        <rect x="23" y="21" width="114" height="68" rx="3" fill="url(#${x.id}g)"/>
        <path d="M18 92 H142 V100 Q142 108 134 108 H26 Q18 108 18 100 Z" fill="url(#${x.id}b)"/>`;
    },
    macmini(x) {
      return `
        <rect x="30" y="64" width="100" height="38" rx="14" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1"/>
        <path d="M44 64 H116" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
        <circle cx="44" cy="90" r="2" fill="#7CFFB2"/>
        <rect x="56" y="88" width="10" height="4" rx="2" fill="${x.d}"/><rect x="70" y="88" width="10" height="4" rx="2" fill="${x.d}"/>
        <ellipse cx="80" cy="108" rx="44" ry="4" fill="#000" opacity=".08"/>`;
    },
    watch(x) {
      const band = x.c2 || x.c;
      return `
        <rect x="58" y="8" width="44" height="42" rx="9" fill="${shade(band, -0.05)}"/>
        <rect x="58" y="110" width="44" height="42" rx="9" fill="${shade(band, -0.05)}"/>
        <g opacity=".25" fill="${shade(band, -0.4)}"><rect x="76" y="124" width="8" height="3" rx="1.5"/><rect x="76" y="132" width="8" height="3" rx="1.5"/></g>
        <rect x="48" y="40" width="64" height="80" rx="20" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="53" y="45" width="54" height="70" rx="16" fill="${S}"/>
        <text x="80" y="90" text-anchor="middle" font-family="Onest,system-ui,sans-serif" font-weight="700" font-size="16" fill="#fff">10:09</text>
        <circle cx="68" cy="60" r="5" fill="none" stroke="#ff5a7a" stroke-width="2.4"/><circle cx="92" cy="60" r="5" fill="none" stroke="#5ad1ff" stroke-width="2.4"/>
        <rect x="112" y="60" width="5" height="14" rx="2.5" fill="${x.d}"/>`;
    },
    "watch-round"(x) {
      return `
        <rect x="60" y="8" width="40" height="44" rx="8" fill="${shade(x.c, -0.15)}"/>
        <rect x="60" y="108" width="40" height="44" rx="8" fill="${shade(x.c, -0.15)}"/>
        <circle cx="80" cy="80" r="36" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <circle cx="80" cy="80" r="29" fill="${S}"/>
        <text x="80" y="86" text-anchor="middle" font-family="Onest,system-ui,sans-serif" font-weight="700" font-size="15" fill="#fff">10:09</text>
        <rect x="114" y="68" width="6" height="9" rx="2" fill="${x.d}"/><rect x="114" y="84" width="6" height="9" rx="2" fill="${x.d}"/>`;
    },
    earbuds(x) {
      return `
        <rect x="40" y="62" width="80" height="66" rx="26" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <path d="M40 84 H120" stroke="${x.d}" stroke-width="1.2"/>
        <circle cx="80" cy="104" r="2.6" fill="${shade(x.c, -0.3)}"/>
        <g transform="rotate(-18 62 46)"><ellipse cx="62" cy="40" rx="11" ry="12" fill="url(#${x.id}b)" stroke="${x.d}"/><rect x="57" y="44" width="9" height="26" rx="4.5" fill="url(#${x.id}b)" stroke="${x.d}"/><ellipse cx="62" cy="36" rx="5" ry="3" fill="${S}" opacity=".7"/></g>
        <g transform="rotate(18 98 46)"><ellipse cx="98" cy="40" rx="11" ry="12" fill="url(#${x.id}b)" stroke="${x.d}"/><rect x="94" y="44" width="9" height="26" rx="4.5" fill="url(#${x.id}b)" stroke="${x.d}"/><ellipse cx="98" cy="36" rx="5" ry="3" fill="${S}" opacity=".7"/></g>`;
    },
    earpods(x) {
      return `
        <path d="M58 64 C58 100 80 96 80 122 V148 M102 64 C102 100 80 96 80 122" fill="none" stroke="${shade(x.c, -0.08)}" stroke-width="3" stroke-linecap="round"/>
        <rect x="74" y="116" width="12" height="18" rx="5" fill="${x.c}" stroke="${x.d}"/>
        <ellipse cx="54" cy="44" rx="15" ry="17" fill="url(#${x.id}b)" stroke="${x.d}"/><rect x="51" y="54" width="10" height="20" rx="5" fill="url(#${x.id}b)" stroke="${x.d}"/>
        <ellipse cx="106" cy="44" rx="15" ry="17" fill="url(#${x.id}b)" stroke="${x.d}"/><rect x="99" y="54" width="10" height="20" rx="5" fill="url(#${x.id}b)" stroke="${x.d}"/>
        <ellipse cx="50" cy="40" rx="6" ry="4" fill="${S}" opacity=".5"/><ellipse cx="110" cy="40" rx="6" ry="4" fill="${S}" opacity=".5"/>`;
    },
    headphones(x) {
      const cush = lum(x.c) > 0.6 ? shade(x.c, -0.12) : shade(x.c, -0.35);
      return `
        <path d="M34 92 V74 C34 32 126 32 126 74 V92" fill="none" stroke="${x.d}" stroke-width="12" stroke-linecap="round"/>
        <path d="M34 92 V74 C34 32 126 32 126 74 V92" fill="none" stroke="url(#${x.id}b)" stroke-width="8" stroke-linecap="round"/>
        <rect x="18" y="78" width="36" height="58" rx="16" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="106" y="78" width="36" height="58" rx="16" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="44" y="84" width="12" height="46" rx="6" fill="${cush}"/><rect x="104" y="84" width="12" height="46" rx="6" fill="${cush}"/>`;
    },
    speaker(x) {
      const gold = "#c9a45c";
      return `
        <rect x="18" y="36" width="124" height="92" rx="10" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="26" y="56" width="108" height="64" rx="5" fill="${shade(x.c, -0.35)}"/>
        <g stroke="${shade(x.c, -0.1)}" stroke-width="1" opacity=".5">${Array.from({ length: 9 }, (_, i) => `<line x1="26" y1="${62 + i * 7}" x2="134" y2="${62 + i * 7}"/>`).join("")}</g>
        <rect x="26" y="42" width="108" height="9" rx="3" fill="${gold}"/>
        <circle cx="40" cy="46.5" r="3" fill="${shade(gold, -0.35)}"/><circle cx="52" cy="46.5" r="3" fill="${shade(gold, -0.35)}"/><circle cx="64" cy="46.5" r="3" fill="${shade(gold, -0.35)}"/>
        <rect x="34" y="128" width="8" height="5" rx="2" fill="${x.d}"/><rect x="118" y="128" width="8" height="5" rx="2" fill="${x.d}"/>`;
    },
    smartspeaker(x) {
      return `
        <rect x="44" y="26" width="72" height="112" rx="22" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <g stroke="${shade(x.c, -0.18)}" stroke-width="1.1" opacity=".55">${Array.from({ length: 13 }, (_, i) => `<line x1="48" y1="${46 + i * 7}" x2="112" y2="${46 + i * 7}"/>`).join("")}</g>
        <ellipse cx="80" cy="32" rx="26" ry="5" fill="#8b5cff" opacity=".85"/>
        <ellipse cx="80" cy="32" rx="16" ry="2.6" fill="#d7c8ff"/>
        <rect x="44" y="26" width="72" height="112" rx="22" fill="url(#${x.id}g)"/>`;
    },
    console(x) {
      const brand = (x.p && x.p.brand) || "";
      if (brand === "Sony") {
        return `
          <path d="M60 14 C44 30 40 80 46 146 H62 Z" fill="#f4f5f7" stroke="#c9ccd3" stroke-width="1.2"/>
          <path d="M100 14 C116 30 120 80 114 146 H98 Z" fill="#f4f5f7" stroke="#c9ccd3" stroke-width="1.2"/>
          <rect x="60" y="12" width="40" height="136" rx="6" fill="#16171c"/>
          <rect x="63" y="20" width="34" height="2" rx="1" fill="#3a6cff" opacity=".8"/>
          <ellipse cx="80" cy="150" rx="40" ry="4" fill="#000" opacity=".08"/>`;
      }
      const c = brand === "Microsoft" ? "#1a1b1e" : "#2a2d33";
      return `
        <rect x="42" y="18" width="76" height="128" rx="8" fill="${c}" stroke="#000" stroke-width="1"/>
        <ellipse cx="80" cy="30" rx="26" ry="6" fill="#0d0e10"/>
        <g fill="#2d3a2a">${Array.from({ length: 5 }, (_, i) => `<circle cx="${62 + i * 9}" cy="30" r="1.6" fill="#7fe07f" opacity=".35"/>`).join("")}</g>
        <rect x="46" y="22" width="6" height="120" rx="3" fill="#fff" opacity=".06"/>
        <circle cx="54" cy="134" r="3" fill="#fff" opacity=".7"/>`;
    },
    gamepad(x) {
      const c = x.c;
      return `
        <path d="M46 52 Q52 44 64 44 H96 Q108 44 114 52 L138 112 Q144 132 126 134 Q114 136 106 118 L100 106 H60 L54 118 Q46 136 34 134 Q16 132 22 112 Z" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.4"/>
        <path d="M58 48 H102 Q104 74 96 82 H64 Q56 74 58 48 Z" fill="${shade(c, lum(c) > 0.5 ? -0.08 : 0.12)}"/>
        <circle cx="62" cy="96" r="10" fill="${S}" stroke="${x.d}"/><circle cx="98" cy="96" r="10" fill="${S}" stroke="${x.d}"/>
        <g fill="${shade(c, -0.35)}"><rect x="38" y="64" width="16" height="5" rx="2"/><rect x="43.5" y="58.5" width="5" height="16" rx="2"/></g>
        <g fill="${shade(c, -0.35)}"><circle cx="118" cy="60" r="3"/><circle cx="118" cy="74" r="3"/><circle cx="111" cy="67" r="3"/><circle cx="125" cy="67" r="3"/></g>`;
    },
    vr(x) {
      const c = x.c;
      return `
        <path d="M30 80 C10 80 14 118 40 116" fill="none" stroke="${shade(c, -0.2)}" stroke-width="8" stroke-linecap="round"/>
        <path d="M130 80 C150 80 146 118 120 116" fill="none" stroke="${shade(c, -0.2)}" stroke-width="8" stroke-linecap="round"/>
        <rect x="24" y="52" width="112" height="60" rx="26" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="34" y="60" width="92" height="44" rx="20" fill="${S}"/>
        <circle cx="58" cy="82" r="5" fill="#2a2f45"/><circle cx="102" cy="82" r="5" fill="#2a2f45"/>
        <rect x="34" y="60" width="92" height="44" rx="20" fill="url(#${x.id}g)"/>`;
    },
    handheld(x) {
      const c = x.c;
      return `
        <rect x="8" y="50" width="144" height="62" rx="24" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="40" y="55" width="80" height="52" rx="6" fill="url(#${x.id}s)"/>
        <rect x="40" y="55" width="80" height="52" rx="6" fill="url(#${x.id}g)"/>
        <circle cx="24" cy="72" r="7" fill="${S}"/><circle cx="136" cy="92" r="7" fill="${S}"/>
        <g fill="${shade(c, -0.4)}"><circle cx="136" cy="64" r="2.5"/><circle cx="136" cy="76" r="2.5"/><circle cx="130" cy="70" r="2.5"/><circle cx="142" cy="70" r="2.5"/></g>
        <g fill="${shade(c, -0.4)}"><rect x="18" y="92" width="12" height="4" rx="1.5"/><rect x="22" y="88" width="4" height="12" rx="1.5"/></g>`;
    },
    game(x) {
      let h = 0;
      for (const ch of (x.p && x.p.name) || "") h = (h * 31 + ch.charCodeAt(0)) % 360;
      const a = `hsl(${h} 70% 45%)`, b = `hsl(${(h + 60) % 360} 75% 30%)`;
      return `
        <defs><linearGradient id="${x.id}art" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
        <rect x="40" y="14" width="80" height="132" rx="6" fill="#0d3d91"/>
        <rect x="40" y="14" width="80" height="18" rx="6" fill="#0070d1"/>
        <text x="48" y="27" font-family="Onest,system-ui,sans-serif" font-weight="800" font-size="10" fill="#fff">PS5</text>
        <rect x="44" y="34" width="72" height="108" rx="2" fill="url(#${x.id}art)"/>
        <circle cx="96" cy="70" r="22" fill="#fff" opacity=".12"/><path d="M44 120 L72 92 L92 110 L104 100 L116 112 V142 H44 Z" fill="#000" opacity=".25"/>`;
    },
    styler(x) {
      const c2 = x.c2 || shade(x.c, -0.25);
      return `
        <rect x="58" y="34" width="20" height="96" rx="10" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.1"/>
        <rect x="58" y="16" width="20" height="24" rx="4" fill="${c2}"/>
        <g stroke="${shade(c2, -0.3)}" stroke-width="1.2">${Array.from({ length: 5 }, (_, i) => `<line x1="58" y1="${20 + i * 4}" x2="78" y2="${20 + i * 4}"/>`).join("")}</g>
        <rect x="60" y="86" width="16" height="22" rx="4" fill="${c2}" opacity=".9"/>
        <path d="M68 130 C68 146 96 144 110 150" fill="none" stroke="${shade(x.c, -0.35)}" stroke-width="3"/>
        <rect x="92" y="40" width="16" height="70" rx="8" fill="${c2}" stroke="${shade(c2, -0.25)}"/>
        <rect x="92" y="40" width="16" height="16" rx="8" fill="${shade(c2, -0.2)}"/>`;
    },
    hairdryer(x) {
      const c2 = x.c2 || shade(x.c, -0.25);
      return `
        <path d="M80 90 V138" stroke="${shade(x.c, -0.15)}" stroke-width="22" stroke-linecap="round"/>
        <path d="M80 90 V138" stroke="url(#${x.id}b)" stroke-width="18" stroke-linecap="round"/>
        <circle cx="80" cy="60" r="34" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <circle cx="80" cy="60" r="16" fill="#f4f6fb" stroke="${c2}" stroke-width="5"/>
        <rect x="71" y="108" width="18" height="8" rx="3" fill="${c2}"/>
        <path d="M80 148 C80 156 110 154 120 158" fill="none" stroke="${shade(x.c, -0.35)}" stroke-width="3"/>`;
    },
    straightener(x) {
      const c2 = x.c2 || shade(x.c, -0.25);
      return `
        <path d="M74 140 L56 22 Q55 14 63 14 Q70 14 71 22 L82 136 Z" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.1"/>
        <path d="M86 140 L104 22 Q105 14 97 14 Q90 14 89 22 L78 136 Z" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.1"/>
        <rect x="58" y="20" width="10" height="44" rx="3" fill="${c2}" opacity=".85"/><rect x="92" y="20" width="10" height="44" rx="3" fill="${c2}" opacity=".85"/>
        <rect x="70" y="128" width="20" height="18" rx="6" fill="${c2}"/>`;
    },
    vacuum(x) {
      const c2 = x.c2 || "#9c9ea3";
      return `
        <path d="M92 66 L52 136" stroke="${shade(c2, -0.1)}" stroke-width="9" stroke-linecap="round"/>
        <path d="M92 66 L52 136" stroke="${shade(c2, 0.3)}" stroke-width="4" stroke-linecap="round"/>
        <rect x="26" y="128" width="50" height="16" rx="7" fill="${x.c}" stroke="${x.d}"/>
        <rect x="30" y="140" width="42" height="4" rx="2" fill="${S}" opacity=".5"/>
        <rect x="86" y="18" width="26" height="54" rx="12" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.1"/>
        <rect x="90" y="24" width="18" height="30" rx="9" fill="#d9ecf5" opacity=".7" stroke="${c2}"/>
        <path d="M112 30 Q130 30 128 52 L120 66" fill="none" stroke="${c2}" stroke-width="7" stroke-linecap="round"/>
        <rect x="84" y="62" width="30" height="12" rx="6" fill="${c2}"/>`;
    },
    purifier(x) {
      return `
        <ellipse cx="80" cy="58" rx="28" ry="40" fill="none" stroke="${x.d}" stroke-width="13"/>
        <ellipse cx="80" cy="58" rx="28" ry="40" fill="none" stroke="url(#${x.id}b)" stroke-width="10"/>
        <rect x="56" y="94" width="48" height="52" rx="12" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.1"/>
        <g fill="${shade(x.c, -0.3)}" opacity=".45">${Array.from({ length: 4 }, (_, r) => Array.from({ length: 6 }, (_, c) => `<circle cx="${64 + c * 6.4}" cy="${108 + r * 7}" r="1.4"/>`).join("")).join("")}</g>
        <circle cx="80" cy="99" r="2" fill="#7CFFB2"/>`;
    },
    handdryer(x) {
      return `
        <rect x="46" y="20" width="68" height="120" rx="30" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="54" y="98" width="52" height="6" rx="3" fill="${S}" opacity=".7"/>
        <circle cx="80" cy="44" r="3" fill="#5ad1ff"/>`;
    },
    camera(x) {
      const c = x.c;
      return `
        <rect x="56" y="34" width="22" height="10" rx="3" fill="${shade(c, -0.25)}"/>
        <rect x="100" y="36" width="14" height="8" rx="3" fill="${shade(c, -0.25)}"/>
        <rect x="18" y="42" width="124" height="80" rx="12" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="18" y="64" width="124" height="44" fill="${S}" opacity=".85"/>
        <circle cx="80" cy="84" r="30" fill="${shade(c, -0.2)}" stroke="${x.d}"/>
        <circle cx="80" cy="84" r="22" fill="${S}" stroke="#444" stroke-width="2"/>
        <circle cx="80" cy="84" r="12" fill="#1d2a52"/><circle cx="74" cy="78" r="4" fill="#fff" opacity=".5"/>
        <rect x="118" y="50" width="16" height="8" rx="2" fill="#e8e8ea" opacity=".9"/>`;
    },
    instant(x) {
      const c = x.c;
      return `
        <rect x="28" y="24" width="104" height="112" rx="22" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="48" y="24" width="64" height="6" rx="3" fill="${shade(c, -0.2)}"/>
        <rect x="38" y="36" width="26" height="18" rx="5" fill="#f7f7f7" stroke="${x.d}"/>
        <rect x="100" y="38" width="16" height="12" rx="3" fill="${S}"/>
        <circle cx="80" cy="88" r="32" fill="${shade(c, 0.2)}" stroke="${x.d}"/>
        <circle cx="80" cy="88" r="22" fill="${S}"/><circle cx="80" cy="88" r="11" fill="#22305e"/><circle cx="74" cy="82" r="4" fill="#fff" opacity=".5"/>`;
    },
    film(x) {
      return `
        <rect x="34" y="30" width="78" height="100" rx="6" fill="#f2f2f2" stroke="#c9c9cf" transform="rotate(-8 73 80)"/>
        <rect x="48" y="26" width="78" height="100" rx="6" fill="#fff" stroke="#c9c9cf"/>
        <rect x="56" y="34" width="62" height="66" rx="2" fill="url(#${x.id}s)"/>
        <rect x="56" y="34" width="62" height="66" rx="2" fill="url(#${x.id}g)"/>`;
    },
    glasses(x) {
      const lens = x.c2 || "#2b3346";
      return `
        <path d="M18 66 H142" stroke="${x.d}" stroke-width="2" opacity=".0"/>
        <path d="M16 62 L8 58" stroke="${x.c}" stroke-width="5" stroke-linecap="round"/><path d="M144 62 L152 58" stroke="${x.c}" stroke-width="5" stroke-linecap="round"/>
        <path d="M14 60 Q14 56 20 56 H70 Q74 56 74 62 L70 92 Q68 104 54 104 H32 Q20 104 18 92 Z" fill="${x.c}" stroke="${x.d}" stroke-width="1.2"/>
        <path d="M146 60 Q146 56 140 56 H90 Q86 56 86 62 L90 92 Q92 104 106 104 H128 Q140 104 142 92 Z" fill="${x.c}" stroke="${x.d}" stroke-width="1.2"/>
        <path d="M22 64 H66 L63 90 Q62 97 52 97 H34 Q26 97 25 90 Z" fill="${lens}" opacity=".92"/>
        <path d="M138 64 H94 L97 90 Q98 97 108 97 H126 Q134 97 135 90 Z" fill="${lens}" opacity=".92"/>
        <path d="M74 64 Q80 58 86 64" fill="none" stroke="${x.c}" stroke-width="6"/>
        <circle cx="24" cy="60" r="2" fill="#ddd"/><circle cx="136" cy="60" r="2" fill="#ddd"/>
        <path d="M28 68 L40 68 L30 86" fill="#fff" opacity=".18"/>`;
    },
    recorder(x) {
      const name = (x.p && x.p.name) || "";
      if (/NotePin/i.test(name)) {
        return `<rect x="64" y="20" width="32" height="120" rx="16" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
          <circle cx="80" cy="44" r="4" fill="${S}"/><rect x="76" y="60" width="8" height="40" rx="4" fill="${shade(x.c, -0.15)}"/>`;
      }
      return `<rect x="44" y="20" width="72" height="116" rx="12" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="52" y="28" width="56" height="100" rx="8" fill="${shade(x.c, -0.08)}"/>
        <circle cx="80" cy="44" r="4" fill="${S}"/><circle cx="80" cy="44" r="1.5" fill="#ff4d4d"/>
        <rect x="64" y="108" width="32" height="4" rx="2" fill="${shade(x.c, -0.3)}"/>`;
    },
    tag(x) {
      return `<circle cx="80" cy="80" r="44" fill="#f7f7f8" stroke="#c9cbd1" stroke-width="1.4"/>
        <circle cx="80" cy="80" r="30" fill="url(#${x.id}b)"/><circle cx="80" cy="80" r="44" fill="url(#${x.id}g)"/>`;
    },
    pencil(x) {
      return `<g transform="rotate(-40 80 80)"><rect x="74" y="10" width="12" height="122" rx="6" fill="#fafafa" stroke="#c9cbd1"/>
        <path d="M74 132 L80 150 L86 132 Z" fill="#e9e9ec" stroke="#c9cbd1"/><rect x="74" y="40" width="12" height="24" fill="#eceef2"/></g>`;
    },
    mouse(x) {
      return `<rect x="50" y="18" width="60" height="124" rx="30" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="50" y="18" width="60" height="124" rx="30" fill="url(#${x.id}g)"/>`;
    },
    trackpad(x) {
      return `<rect x="22" y="34" width="116" height="92" rx="14" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="22" y="34" width="116" height="92" rx="14" fill="url(#${x.id}g)"/>`;
    },
    keyboard(x) {
      const key = lum(x.c) > 0.5 ? "#ffffff" : shade(x.c, 0.12);
      let keys = "";
      for (let r = 0; r < 5; r++) for (let k = 0; k < 13; k++) keys += `<rect x="${16 + k * 10}" y="${58 + r * 9}" width="8" height="7" rx="1.6" fill="${key}" stroke="${shade(x.c, -0.12)}" stroke-width=".4"/>`;
      return `<rect x="10" y="52" width="140" height="54" rx="7" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>${keys}`;
    },
    cable(x) {
      const c = x.c || "#f3f3f1";
      return `<path d="M30 40 C80 10 130 50 100 80 C70 110 30 90 50 120 C66 144 110 140 128 126" fill="none" stroke="${shade(c, -0.15)}" stroke-width="7" stroke-linecap="round"/>
        <path d="M30 40 C80 10 130 50 100 80 C70 110 30 90 50 120 C66 144 110 140 128 126" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>
        <rect x="16" y="30" width="22" height="16" rx="4" fill="${c}" stroke="${shade(c, -0.25)}" transform="rotate(-25 27 38)"/>
        <rect x="124" y="118" width="22" height="16" rx="4" fill="${c}" stroke="${shade(c, -0.25)}" transform="rotate(-30 135 126)"/>`;
    },
    charger(x) {
      const c = x.c || "#f3f3f1";
      return `<rect x="44" y="44" width="72" height="72" rx="16" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <rect x="70" y="72" width="20" height="8" rx="4" fill="${shade(c, -0.35)}"/>
        <rect x="64" y="116" width="6" height="18" rx="2" fill="#b9bcc4"/><rect x="90" y="116" width="6" height="18" rx="2" fill="#b9bcc4"/>`;
    },
    glass(x) {
      return `<rect x="46" y="16" width="68" height="128" rx="14" fill="#dff1ff" fill-opacity=".55" stroke="#9cc6e6" stroke-width="1.6"/>
        <path d="M58 30 L92 30 L60 90 Z" fill="#fff" opacity=".6"/><path d="M98 70 L104 70 L74 130 L68 130 Z" fill="#fff" opacity=".5"/>
        <rect x="70" y="22" width="20" height="5" rx="2.5" fill="#9cc6e6"/>`;
    },
    case(x) {
      const clear = /clear/i.test((x.p && x.p.name) || "");
      const fill = clear ? "#dff1ff" : x.c || "#5a8ed8";
      return `<rect x="44" y="14" width="72" height="132" rx="16" fill="${fill}" fill-opacity="${clear ? 0.6 : 1}" stroke="${clear ? "#9cc6e6" : shade(fill, -0.25)}" stroke-width="2"/>
        <rect x="52" y="22" width="32" height="32" rx="9" fill="#f4f6fb" stroke="${clear ? "#9cc6e6" : shade(fill, -0.25)}"/>
        <rect x="116" y="44" width="3" height="18" rx="1.5" fill="${shade(fill, -0.25)}"/>`;
    },
    accessory(x) {
      return `<rect x="36" y="42" width="88" height="80" rx="10" fill="url(#${x.id}b)" stroke="${x.d}" stroke-width="1.2"/>
        <path d="M36 62 H124" stroke="${x.d}" stroke-width="1.2"/><rect x="66" y="42" width="28" height="20" fill="${shade(x.c, -0.12)}"/>`;
    },
  };

  // Цвет по умолчанию, если в названии товара цвет не указан.
  const DEFAULT = {
    phone: "#d6d8db", fold: "#2a2d33", flip: "#2a2d33", tablet: "#d6d8db", laptop: "#d6d8db", imac: "#5a8ed8",
    macmini: "#d6d8db", watch: "#1f2534", "watch-round": "#45474d", earbuds: "#f3f3f1", earpods: "#f3f3f1",
    headphones: "#d6d8db", speaker: "#1b1b1e", smartspeaker: "#45474d", console: "#f3f3f1", gamepad: "#f3f3f1",
    vr: "#f3f3f1", handheld: "#2a2d33", game: "#0d3d91", styler: "#9c9ea3", hairdryer: "#9c9ea3",
    straightener: "#9c9ea3", vacuum: "#9c9ea3", purifier: "#f3f3f1", handdryer: "#d6d8db", camera: "#d6d8db",
    instant: "#f4b6c6", film: "#ffffff", glasses: "#1b1b1e", recorder: "#1b1b1e", tag: "#d6d8db",
    pencil: "#f3f3f1", mouse: "#f3f3f1", keyboard: "#f3f3f1", trackpad: "#f3f3f1", cable: "#f3f3f1",
    charger: "#f3f3f1", glass: "#dff1ff", case: "#5a8ed8", accessory: "#d6d8db",
  };

  function art(p, opts) {
    opts = opts || {};
    const kind = DRAW[p.kind] ? p.kind : "accessory";
    let [c, c2] = palette(p.color);
    if (kind === "glasses") {
      // у очков «оправа / линзы»: второй цвет — оттенок линз
      const lens = p.specs && (p.specs.find((s) => s[0] === "Линзы") || [])[1];
      c2 = resolve(lens) || "#2b3346";
      if (/transitions/i.test(lens || "")) c2 = mix(c2, "#3a3f55", 0.35);
    }
    c = c || DEFAULT[kind];
    const id = "a" + (++uid) + "_";
    const x = { id, c, c2, d: shade(c, lum(c) > 0.55 ? -0.28 : -0.45), p };
    const label = opts.label ? ` role="img" aria-label="${String(opts.label).replace(/"/g, "&quot;")}"` : ` aria-hidden="true"`;
    return `<svg class="art" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg"${label}>${defs(id, c)}${DRAW[kind](x)}</svg>`;
  }

  // Мягкий фон плитки в тон товара (в тёмной теме — приглушённый).
  function tint(p, dark) {
    const [c] = palette(p.color);
    const base = c || DEFAULT[p.kind] || "#d6d8db";
    return dark
      ? [mix(base, "#161c3d", 0.78), mix(base, "#0f1430", 0.9)]
      : [mix(base, "#ffffff", 0.82), mix(base, "#eef1f8", 0.9)];
  }

  window.OctoArt = { art, tint, resolve, palette, mix, shade, lum };
})();
