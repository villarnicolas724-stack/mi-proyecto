// Shared SVG builders for "El pequeño osito que devolvió la luz".
// Every scene file is generated from these, so the three characters look identical in every shot.

export const C = {
  cream: "#F3E6CF", creamL: "#FFF7E8", creamD: "#D8BF98",
  nose: "#7A5235", eye: "#33241E", mouthIn: "#8A4A3A",
  pinkIn: "#F6C1D4", cheek: "#F4A2B6",
  scarf: "#8EC9EE", scarfD: "#62A6D6",
  lila: "#F6C1D4", lilaL: "#FFE6EF", lilaD: "#E096B4", flower: "#C9B6E8",
  bruno: "#A9CDEB", brunoL: "#D6EAF8", brunoD: "#7FAAD3", patch: "#FBE38E",
  gold: "#FBE38E", goldD: "#F2BE3C", goldL: "#FFF6C9",
  mint: "#BFE6D3", mintD: "#93CDB3", lav: "#C9B6E8", lavD: "#9E8BCB",
  night: "#4B3F72", nightD: "#2F2752", sky: "#8EC9EE",
};

const r6 = (n) => Math.round(n * 10) / 10;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- defs: gradients and the plush "fuzz" filter ----------
function rad(id, l, m, d) {
  return `<radialGradient id="${id}" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="${l}"/><stop offset="0.55" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></radialGradient>`;
}
export function defs(P) {
  return `<defs>
  ${rad(`${P}-gCream`, C.creamL, C.cream, C.creamD)}
  ${rad(`${P}-gPink`, C.lilaL, C.lila, C.lilaD)}
  ${rad(`${P}-gBlue`, C.brunoL, C.bruno, C.brunoD)}
  ${rad(`${P}-gScarf`, "#C4E5FA", C.scarf, C.scarfD)}
  ${rad(`${P}-gWhite`, "#FFFFFF", "#F7F3FA", "#D9D0E8")}
  ${rad(`${P}-gMint`, "#E2F6EC", C.mint, C.mintD)}
  ${rad(`${P}-gLav`, "#E7DDF7", C.lav, C.lavD)}
  ${rad(`${P}-gRose`, "#FFE3EC", "#F7C6D6", "#E3A2BC")}
  ${rad(`${P}-gStar`, C.goldL, C.gold, C.goldD)}
  <radialGradient id="${P}-gGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF4C2" stop-opacity="0.95"/><stop offset="0.35" stop-color="#FFE07A" stop-opacity="0.45"/><stop offset="1" stop-color="#FFD25A" stop-opacity="0"/></radialGradient>
  <radialGradient id="${P}-gWarm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE9A8" stop-opacity="0.75"/><stop offset="1" stop-color="#FFC96B" stop-opacity="0"/></radialGradient>
  <filter id="${P}-fuzz" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="9" result="t"/>
    <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.3  0 0 0 -1.6 1.05" result="ta"/>
    <feComposite in="ta" in2="d" operator="in" result="tex"/>
    <feComposite in="tex" in2="d" operator="over" k1="0" result="o"/>
    <feMerge><feMergeNode in="d"/><feMergeNode in="tex"/></feMerge>
  </filter>
  <filter id="${P}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="${P}-blur3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>`;
}

const stitch = (col, w = 2.4) => `fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="7 6" stroke-linecap="round"`;

function eyes(p, xs, y, rx, ry) {
  return xs
    .map(
      (x, i) => `<g id="${p}-eye${i ? "R" : "L"}"><g id="${p}-look${i ? "R" : "L"}">
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.eye}"/>
      <circle cx="${x - rx * 0.32}" cy="${y - ry * 0.38}" r="${rx * 0.38}" fill="#fff"/>
      <circle cx="${x + rx * 0.35}" cy="${y + ry * 0.35}" r="${rx * 0.17}" fill="#fff" opacity="0.85"/></g></g>`,
    )
    .join("");
}
function happyEyes(p, xs, y, w) {
  return `<g id="${p}-heyes" opacity="0">${xs
    .map((x) => `<path d="M${x - w} ${y + 3} Q${x} ${y - w * 1.1} ${x + w} ${y + 3}" fill="none" stroke="${C.eye}" stroke-width="5" stroke-linecap="round"/>`)
    .join("")}</g>`;
}
function brows(p, xs, y, col) {
  return `<g id="${p}-brows" opacity="0"><path d="M${xs[0] - 13} ${y + 4} L${xs[0] + 11} ${y - 6}" stroke="${col}" stroke-width="4.5" stroke-linecap="round"/><path d="M${xs[1] - 11} ${y - 6} L${xs[1] + 13} ${y + 4}" stroke="${col}" stroke-width="4.5" stroke-linecap="round"/></g>`;
}
// mouths: smile / open (wonder) / worry / effort / laugh
function mouths(p, cx, y, col, w = 14) {
  const s = `stroke="${col}" stroke-width="4" stroke-linecap="round" fill="none"`;
  return `
  <g id="${p}-m-smile"><path d="M${cx - w} ${y} Q${cx - w / 2} ${y + 10} ${cx} ${y} Q${cx + w / 2} ${y + 10} ${cx + w} ${y}" ${s}/></g>
  <g id="${p}-m-open" opacity="0"><ellipse cx="${cx}" cy="${y + 6}" rx="${w * 0.5}" ry="${w * 0.62}" fill="${C.mouthIn}"/></g>
  <g id="${p}-m-worry" opacity="0"><path d="M${cx - w * 0.85} ${y + 9} Q${cx} ${y - 1} ${cx + w * 0.85} ${y + 9}" ${s}/></g>
  <g id="${p}-m-effort" opacity="0"><path d="M${cx - w} ${y + 5} L${cx - w * 0.3} ${y + 1} L${cx + w * 0.3} ${y + 7} L${cx + w} ${y + 3}" ${s}/></g>
  <g id="${p}-m-laugh" opacity="0"><path d="M${cx - w * 1.1} ${y} Q${cx} ${y + w * 1.7} ${cx + w * 1.1} ${y} Z" fill="${C.mouthIn}" stroke="${col}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${y + w * 0.9}" rx="${w * 0.5}" ry="${w * 0.3}" fill="#E8838F"/></g>`;
}

// ---------- NUBI ----------
export function bear(P, p, { lantern = false } = {}) {
  const g = (n) => `url(#${P}-${n})`;
  return `<g id="${p}" filter="url(#${P}-fuzz)">
  <ellipse id="${p}-shadow" cx="0" cy="2" rx="78" ry="12" fill="#2b2140" opacity="0.18"/>
  <g id="${p}-legL"><ellipse cx="-32" cy="-22" rx="28" ry="25" fill="${g("gCream")}"/><ellipse cx="-32" cy="-15" rx="15" ry="10" fill="${C.pinkIn}" opacity="0.8"/></g>
  <g id="${p}-legR"><ellipse cx="32" cy="-22" rx="28" ry="25" fill="${g("gCream")}"/><ellipse cx="32" cy="-15" rx="15" ry="10" fill="${C.pinkIn}" opacity="0.8"/></g>
  <g id="${p}-body"><ellipse cx="0" cy="-80" rx="63" ry="64" fill="${g("gCream")}"/>
    <ellipse cx="0" cy="-70" rx="38" ry="40" fill="${C.creamL}" opacity="0.9"/>
    <ellipse cx="0" cy="-70" rx="38" ry="40" ${stitch("#C7A97E")}/></g>
  <g id="${p}-armL"><ellipse cx="-66" cy="-84" rx="20" ry="34" fill="${g("gCream")}" transform="rotate(22 -66 -84)"/><ellipse cx="-76" cy="-60" rx="11" ry="9" fill="${C.pinkIn}" opacity="0.7"/></g>
  <g id="${p}-armR"><ellipse cx="66" cy="-84" rx="20" ry="34" fill="${g("gCream")}" transform="rotate(-22 66 -84)"/><ellipse cx="76" cy="-60" rx="11" ry="9" fill="${C.pinkIn}" opacity="0.7"/>
    ${lantern ? `<g id="${p}-lantern"><circle cx="86" cy="-34" r="120" fill="${g("gWarm")}"/><path d="M78 -58 L94 -58" stroke="#B08A5A" stroke-width="4"/><rect x="72" y="-56" width="28" height="36" rx="10" fill="#FFE39A"/><rect x="72" y="-56" width="28" height="36" rx="10" ${stitch("#E0A94A", 2)}/></g>` : ""}</g>
  <g id="${p}-scarfTail"><rect x="18" y="-122" width="26" height="66" rx="11" fill="${g("gScarf")}" transform="rotate(8 31 -122)"/>
    <path d="M24 -110 L44 -108 M22 -96 L42 -93 M20 -82 L40 -79" ${stitch("#ffffff", 2)}/>
    <circle cx="26" cy="-52" r="8" fill="#fff"/><circle cx="40" cy="-50" r="8" fill="#fff"/></g>
  <g id="${p}-head">
    <g id="${p}-earL"><circle cx="-56" cy="-232" r="29" fill="${g("gCream")}"/><circle cx="-56" cy="-232" r="16" fill="${C.pinkIn}"/></g>
    <g id="${p}-earR"><circle cx="56" cy="-232" r="29" fill="${g("gCream")}"/><circle cx="56" cy="-232" r="16" fill="${C.pinkIn}"/></g>
    <ellipse cx="0" cy="-182" rx="78" ry="68" fill="${g("gCream")}"/>
    <path d="M0 -250 L0 -236" ${stitch("#C7A97E")}/>
    <g id="${p}-cheeks"><ellipse cx="-50" cy="-160" rx="13" ry="8" fill="${C.cheek}" opacity="0.55"/><ellipse cx="50" cy="-160" rx="13" ry="8" fill="${C.cheek}" opacity="0.55"/></g>
    <ellipse cx="0" cy="-157" rx="34" ry="25" fill="${C.creamL}"/>
    <ellipse cx="0" cy="-168" rx="12" ry="8.5" fill="${C.nose}"/><ellipse cx="-3" cy="-171" rx="4" ry="2.4" fill="#fff" opacity="0.5"/>
    <path d="M0 -160 L0 -152" stroke="${C.nose}" stroke-width="4" stroke-linecap="round"/>
    ${mouths(p, 0, -152, C.nose)}
    ${eyes(p, [-30, 30], -190, 13, 15)}
    ${happyEyes(p, [-30, 30], -190, 13)}
    ${brows(p, [-30, 30], -214, C.nose)}
  </g>
  <g id="${p}-scarf"><rect x="-62" y="-134" width="124" height="28" rx="14" fill="${g("gScarf")}"/>
    <path d="M-50 -128 L-50 -112 M-30 -128 L-30 -112 M-10 -128 L-10 -112 M10 -128 L10 -112 M30 -128 L30 -112 M50 -128 L50 -112" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"/></g>
</g>`;
}

// ---------- LILA ----------
export function bunny(P, p) {
  const g = (n) => `url(#${P}-${n})`;
  return `<g id="${p}" filter="url(#${P}-fuzz)">
  <ellipse cx="0" cy="2" rx="72" ry="11" fill="#2b2140" opacity="0.18"/>
  <circle cx="54" cy="-48" r="20" fill="${g("gWhite")}"/>
  <g id="${p}-legL"><ellipse cx="-28" cy="-20" rx="26" ry="22" fill="${g("gPink")}"/><ellipse cx="-28" cy="-14" rx="13" ry="9" fill="#fff" opacity="0.7"/></g>
  <g id="${p}-legR"><ellipse cx="28" cy="-20" rx="26" ry="22" fill="${g("gPink")}"/><ellipse cx="28" cy="-14" rx="13" ry="9" fill="#fff" opacity="0.7"/></g>
  <g id="${p}-body"><ellipse cx="0" cy="-74" rx="56" ry="58" fill="${g("gPink")}"/>
    <ellipse cx="0" cy="-66" rx="33" ry="36" fill="${C.lilaL}"/><ellipse cx="0" cy="-66" rx="33" ry="36" ${stitch("#D88BAA")}/></g>
  <g id="${p}-armL"><ellipse cx="-58" cy="-78" rx="17" ry="30" fill="${g("gPink")}" transform="rotate(22 -58 -78)"/></g>
  <g id="${p}-armR"><ellipse cx="58" cy="-78" rx="17" ry="30" fill="${g("gPink")}" transform="rotate(-22 58 -78)"/></g>
  <g id="${p}-head">
    <g id="${p}-earL"><ellipse cx="-30" cy="-292" rx="21" ry="64" fill="${g("gPink")}" transform="rotate(-12 -30 -292)"/><ellipse cx="-30" cy="-288" rx="10" ry="46" fill="#fff" transform="rotate(-12 -30 -288)"/></g>
    <g id="${p}-earR"><ellipse cx="30" cy="-292" rx="21" ry="64" fill="${g("gPink")}" transform="rotate(12 30 -292)"/><ellipse cx="30" cy="-288" rx="10" ry="46" fill="#fff" transform="rotate(12 30 -288)"/>
      <g transform="translate(46 -318)"><circle cx="0" cy="-12" r="9" fill="${C.flower}"/><circle cx="11" cy="-4" r="9" fill="${C.flower}"/><circle cx="7" cy="10" r="9" fill="${C.flower}"/><circle cx="-7" cy="10" r="9" fill="${C.flower}"/><circle cx="-11" cy="-4" r="9" fill="${C.flower}"/><circle cx="0" cy="0" r="7" fill="${C.gold}"/></g></g>
    <ellipse cx="0" cy="-172" rx="70" ry="62" fill="${g("gPink")}"/>
    <g id="${p}-cheeks"><ellipse cx="-44" cy="-152" rx="12" ry="7" fill="#EF8FAE" opacity="0.6"/><ellipse cx="44" cy="-152" rx="12" ry="7" fill="#EF8FAE" opacity="0.6"/></g>
    <ellipse cx="0" cy="-150" rx="28" ry="20" fill="${C.lilaL}"/>
    <path d="M-8 -162 Q0 -168 8 -162 Q0 -152 -8 -162 Z" fill="#E0708F"/>
    <path d="M0 -156 L0 -149" stroke="#C25A7A" stroke-width="3.5" stroke-linecap="round"/>
    ${mouths(p, 0, -149, "#C25A7A", 12)}
    ${eyes(p, [-28, 28], -180, 14, 16)}
    ${happyEyes(p, [-28, 28], -180, 13)}
    ${brows(p, [-28, 28], -205, "#C25A7A")}
  </g>
</g>`;
}

// ---------- BRUNO ----------
export function elephant(P, p) {
  const g = (n) => `url(#${P}-${n})`;
  return `<g id="${p}" filter="url(#${P}-fuzz)">
  <ellipse cx="0" cy="2" rx="108" ry="14" fill="#2b2140" opacity="0.18"/>
  <g id="${p}-legL"><rect x="-70" y="-62" width="48" height="62" rx="22" fill="${g("gBlue")}"/><ellipse cx="-46" cy="-10" rx="18" ry="8" fill="${C.brunoL}"/></g>
  <g id="${p}-legR"><rect x="22" y="-62" width="48" height="62" rx="22" fill="${g("gBlue")}"/><ellipse cx="46" cy="-10" rx="18" ry="8" fill="${C.brunoL}"/></g>
  <g id="${p}-body"><ellipse cx="0" cy="-100" rx="94" ry="86" fill="${g("gBlue")}"/>
    <path d="M-60 -160 Q0 -186 60 -160" ${stitch("#6F9CC8")}/>
    <g transform="translate(0 -92)"><path d="M0 -26 L8 -8 L27 -8 L12 4 L18 23 L0 12 L-18 23 L-12 4 L-27 -8 L-8 -8 Z" fill="${C.patch}" stroke="${C.patch}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M0 -26 L8 -8 L27 -8 L12 4 L18 23 L0 12 L-18 23 L-12 4 L-27 -8 L-8 -8 Z" fill="none" stroke="#D9A93A" stroke-width="1.8" stroke-dasharray="4 4"/></g></g>
  <g id="${p}-armL"><ellipse cx="-92" cy="-104" rx="24" ry="42" fill="${g("gBlue")}" transform="rotate(20 -92 -104)"/></g>
  <g id="${p}-armR"><ellipse cx="92" cy="-104" rx="24" ry="42" fill="${g("gBlue")}" transform="rotate(-20 92 -104)"/></g>
  <g id="${p}-head">
    <g id="${p}-earL"><ellipse cx="-104" cy="-238" rx="62" ry="74" fill="${g("gBlue")}"/><ellipse cx="-100" cy="-236" rx="40" ry="52" fill="#F4C9DA" opacity="0.85"/><ellipse cx="-104" cy="-238" rx="62" ry="74" ${stitch("#6F9CC8")}/></g>
    <g id="${p}-earR"><ellipse cx="104" cy="-238" rx="62" ry="74" fill="${g("gBlue")}"/><ellipse cx="100" cy="-236" rx="40" ry="52" fill="#F4C9DA" opacity="0.85"/><ellipse cx="104" cy="-238" rx="62" ry="74" ${stitch("#6F9CC8")}/></g>
    <ellipse cx="0" cy="-236" rx="92" ry="80" fill="${g("gBlue")}"/>
    <g id="${p}-cheeks"><ellipse cx="-56" cy="-206" rx="15" ry="9" fill="${C.cheek}" opacity="0.5"/><ellipse cx="56" cy="-206" rx="15" ry="9" fill="${C.cheek}" opacity="0.5"/></g>
    ${mouths(p, 0, -184, "#4E6F96", 16)}
    <g id="${p}-trunk"><path d="M0 -222 C2 -180 -4 -150 14 -132 C26 -122 40 -132 36 -146" fill="none" stroke="${C.bruno}" stroke-width="30" stroke-linecap="round"/>
      <path d="M-12 -196 L12 -196 M-12 -176 L12 -176 M-6 -156 L16 -154" stroke="#7FAAD3" stroke-width="2.2" stroke-dasharray="4 4"/></g>
    ${eyes(p, [-40, 40], -250, 14, 16)}
    ${happyEyes(p, [-40, 40], -250, 14)}
    ${brows(p, [-40, 40], -276, "#4E6F96")}
  </g>
</g>`;
}

// ---------- STAR ----------
export function starPath(R, r) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    d += `${i ? "L" : "M"}${r6(Math.cos(a) * rr)} ${r6(Math.sin(a) * rr)} `;
  }
  return d + "Z";
}
export function magicStar(P, p) {
  return `<g id="${p}">
  <circle id="${p}-glow" cx="0" cy="0" r="230" fill="url(#${P}-gGlow)"/>
  <g id="${p}-body" filter="url(#${P}-fuzz)"><path d="${starPath(92, 44)}" fill="url(#${P}-gStar)" stroke="${C.gold}" stroke-width="22" stroke-linejoin="round"/>
    <path d="${starPath(72, 34)}" fill="none" stroke="#E2A93A" stroke-width="2.2" stroke-dasharray="6 5"/>
    <ellipse cx="-24" cy="10" rx="9" ry="5" fill="${C.cheek}" opacity="0.6"/><ellipse cx="24" cy="10" rx="9" ry="5" fill="${C.cheek}" opacity="0.6"/>
    <g id="${p}-closed"><path d="M-26 -4 Q-17 3 -8 -4 M8 -4 Q17 3 26 -4" fill="none" stroke="${C.eye}" stroke-width="4" stroke-linecap="round"/></g>
    <g id="${p}-open" opacity="0"><ellipse cx="-17" cy="-6" rx="7" ry="9" fill="${C.eye}"/><ellipse cx="17" cy="-6" rx="7" ry="9" fill="${C.eye}"/><circle cx="-19" cy="-9" r="3" fill="#fff"/><circle cx="15" cy="-9" r="3" fill="#fff"/></g>
    <path d="M-9 12 Q0 21 9 12" fill="none" stroke="${C.eye}" stroke-width="4" stroke-linecap="round"/></g>
</g>`;
}

// ---------- scenery ----------
export function skyRect(id, stops) {
  return `<linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient><rect id="${id}" x="-400" y="-400" width="2720" height="1880" fill="url(#${id}-g)"/>`;
}
export function tinyStars(P, prefix, n, seed, box = [0, 0, 1920, 560], sizes = [6, 13]) {
  const R = rng(seed);
  let s = "";
  const list = [];
  for (let i = 0; i < n; i++) {
    const x = r6(box[0] + R() * box[2]), y = r6(box[1] + R() * box[3]);
    const k = sizes[0] + R() * (sizes[1] - sizes[0]);
    list.push([x, y]);
    s += `<g id="${prefix}${i}" transform="translate(${x} ${y})"><g id="${prefix}${i}i"><circle r="${r6(k * 2.6)}" fill="url(#${P}-gGlow)"/><path d="${starPath(k, k * 0.48)}" fill="${C.gold}" stroke="${C.gold}" stroke-width="${r6(k * 0.35)}" stroke-linejoin="round"/></g></g>`;
  }
  return { svg: s, list };
}
export function cloud(P, x, y, s, op = 1, id = "") {
  return `<g ${id ? `id="${id}"` : ""} transform="translate(${x} ${y}) scale(${s})" opacity="${op}" filter="url(#${P}-fuzz)"><ellipse cx="0" cy="0" rx="120" ry="44" fill="url(#${P}-gWhite)"/><circle cx="-50" cy="-24" r="48" fill="url(#${P}-gWhite)"/><circle cx="18" cy="-44" r="62" fill="url(#${P}-gWhite)"/><circle cx="78" cy="-14" r="42" fill="url(#${P}-gWhite)"/></g>`;
}
export function cottonMountains(P, y, fill, seed, n = 7, base = 220) {
  const R = rng(seed);
  let s = `<g filter="url(#${P}-fuzz)">`;
  for (let i = 0; i < n; i++) {
    const x = -150 + (i * 2220) / (n - 1) + (R() - 0.5) * 120;
    const r = base + R() * 140;
    s += `<circle cx="${r6(x)}" cy="${r6(y + r * 0.35)}" r="${r6(r)}" fill="${fill}"/><circle cx="${r6(x - r * 0.45)}" cy="${r6(y + r * 0.45)}" r="${r6(r * 0.62)}" fill="${fill}"/>`;
  }
  return s + `<rect x="-400" y="${y + 200}" width="2720" height="900" fill="${fill}"/></g>`;
}
export function hill(P, d, fill = "gMint", stitchCol = "#A9D9C2") {
  return `<g filter="url(#${P}-fuzz)"><path d="${d}" fill="url(#${P}-${fill})"/><path d="${d}" ${stitch(stitchCol, 3)} transform="translate(0 14) scale(1 1)"/></g>`;
}
export function tree(P, x, y, s, canopy = "gRose", id = "", lights = false) {
  const R = rng(Math.round(x * 7 + y));
  const balls = [[0, -230, 74], [-62, -190, 58], [62, -194, 60], [-30, -268, 52], [36, -262, 50]];
  let L = "";
  if (lights) {
    for (let i = 0; i < 9; i++) {
      const a = -2.6 + i * 0.36;
      L += `<circle class="${id}-bulb" id="${id}-b${i}" cx="${r6(Math.cos(a) * 92)}" cy="${r6(-215 + Math.sin(a) * 40 + 46)}" r="7" fill="#FFE9A0" opacity="0"/>`;
    }
  }
  return `<g ${id ? `id="${id}"` : ""} transform="translate(${x} ${y}) scale(${s})"><g filter="url(#${P}-fuzz)">
    <rect x="-20" y="-170" width="40" height="172" rx="16" fill="#D7B28E"/>
    <path d="M-18 -140 L18 -140 M-18 -110 L18 -110 M-18 -80 L18 -80 M-18 -50 L18 -50 M-18 -20 L18 -20" stroke="#B88E6A" stroke-width="3" stroke-dasharray="5 4"/>
    ${balls.map(([bx, by, br]) => `<circle cx="${bx}" cy="${by}" r="${r6(br * (0.95 + R() * 0.1))}" fill="url(#${P}-${canopy})"/>`).join("")}
  </g>${L}</g>`;
}
export function cottage(P, x, y, s, id) {
  return `<g id="${id}" transform="translate(${x} ${y}) scale(${s})"><g filter="url(#${P}-fuzz)">
    <rect x="-90" y="-130" width="180" height="130" rx="18" fill="url(#${P}-gCream)"/>
    <path d="M-80 -100 L80 -100 M-80 -60 L80 -60 M-80 -20 L80 -20" ${stitch("#CDB088", 2.2)}/>
    <path d="M-118 -118 Q0 -250 118 -118 Z" fill="url(#${P}-gRose)" stroke="#E7A9C0" stroke-width="10" stroke-linejoin="round"/>
    <rect x="44" y="-238" width="30" height="62" rx="8" fill="#C9B6E8"/>
    <rect x="-22" y="-62" width="44" height="62" rx="20" fill="#C9A27C"/>
  </g>
  <circle id="${id}-glow" cx="-52" cy="-78" r="70" fill="url(#${P}-gWarm)" opacity="0"/>
  <circle id="${id}-win" cx="-52" cy="-78" r="22" fill="#FFE59A"/>
  <circle cx="-58" cy="-84" r="3" fill="#B88E6A"/><circle cx="-46" cy="-84" r="3" fill="#B88E6A"/><circle cx="-58" cy="-72" r="3" fill="#B88E6A"/><circle cx="-46" cy="-72" r="3" fill="#B88E6A"/>
  <circle id="${id}-win2" cx="52" cy="-78" r="22" fill="#FFE59A"/>
  <circle cx="46" cy="-84" r="3" fill="#B88E6A"/><circle cx="58" cy="-84" r="3" fill="#B88E6A"/><circle cx="46" cy="-72" r="3" fill="#B88E6A"/><circle cx="58" cy="-72" r="3" fill="#B88E6A"/>
  </g>`;
}
export function flower(x, y, s, col) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L0 -40" stroke="#93CDB3" stroke-width="6" stroke-linecap="round"/>${[0, 72, 144, 216, 288]
    .map((a) => `<circle cx="${r6(Math.cos((a * Math.PI) / 180) * 13)}" cy="${r6(-46 + Math.sin((a * Math.PI) / 180) * 13)}" r="11" fill="${col}"/>`)
    .join("")}<circle cx="0" cy="-46" r="8" fill="${C.gold}"/></g>`;
}
export function mushroom(P, x, y, s, id) {
  return `<g id="${id}" transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-40" r="70" fill="url(#${P}-gWarm)" opacity="0.6"/><g filter="url(#${P}-fuzz)"><rect x="-12" y="-40" width="24" height="40" rx="10" fill="#FFF7E8"/><path d="M-40 -36 Q0 -86 40 -36 Z" fill="#F7C6D6" stroke="#F7C6D6" stroke-width="8" stroke-linejoin="round"/><circle cx="-14" cy="-52" r="5" fill="#fff"/><circle cx="12" cy="-58" r="4" fill="#fff"/></g></g>`;
}
export function fireflies(P, prefix, n, seed, box) {
  const R = rng(seed);
  let s = "";
  for (let i = 0; i < n; i++) {
    s += `<g id="${prefix}${i}" transform="translate(${r6(box[0] + R() * box[2])} ${r6(box[1] + R() * box[3])})"><circle r="26" fill="url(#${P}-gGlow)"/><circle r="5" fill="#FFF2B0"/></g>`;
  }
  return s;
}

// ---------- shared runtime helpers (injected as text into each scene script) ----------
export const RUNTIME = String.raw`
const H = (() => {
  function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
  const MOUTHS=["smile","open","worry","effort","laugh"];
  // a mood change is a take: tiny squash, new face, settle
  function mood(tl,p,m,t,{brows=false,happy=false}={}){
    const q="#"+p+"-head";
    tl.to(q,{scaleY:0.95,scaleX:1.03,duration:0.09,ease:"power2.in"},t);
    tl.to(q,{scaleY:1,scaleX:1,duration:0.35,ease:"back.out(3)"},t+0.09);
    MOUTHS.forEach(k=>tl.to("#"+p+"-m-"+k,{opacity:k===m?1:0,duration:0.1},t+0.06));
    tl.to("#"+p+"-brows",{opacity:brows?1:0,duration:0.15},t+0.06);
    tl.to("#"+p+"-heyes",{opacity:happy?1:0,duration:0.1},t+0.06);
    tl.to(["#"+p+"-eyeL","#"+p+"-eyeR"],{opacity:happy?0:1,duration:0.1},t+0.06);
  }
  function setOrigins(p,kind){
    const o = kind==="bunny"?{head:"0 -120",earL:"-22 -240",earR:"22 -240",armL:"-48 -100",armR:"48 -100",body:"0 0",legL:"-28 -36",legR:"28 -36"}
           : kind==="elephant"?{head:"0 -170",earL:"-60 -238",earR:"60 -238",armL:"-80 -140",armR:"80 -140",body:"0 0",legL:"-46 -60",legR:"46 -60",trunk:"0 -222"}
           : {head:"0 -125",earL:"-46 -214",earR:"46 -214",armL:"-52 -112",armR:"52 -112",body:"0 0",legL:"-32 -40",legR:"32 -40",scarfTail:"31 -122"};
    Object.entries(o).forEach(([k,v])=>{const el=document.getElementById(p+"-"+k); if(el) gsap.set(el,{svgOrigin:v});});
    ["eyeL","eyeR"].forEach(k=>{const el=document.getElementById(p+"-"+k); if(el){const b=el.getBBox(); gsap.set(el,{svgOrigin:(b.x+b.width/2)+" "+(b.y+b.height/2)});}});
  }
  function blinks(tl,p,t0,t1,seed){
    const R=rng(seed); let t=t0+0.4+R()*1.2;
    while(t<t1-0.3){ tl.to(["#"+p+"-eyeL","#"+p+"-eyeR"],{scaleY:0.08,duration:0.06,ease:"power1.in"},t); tl.to(["#"+p+"-eyeL","#"+p+"-eyeR"],{scaleY:1,duration:0.1,ease:"power1.out"},t+0.09); t+=2.2+R()*2.2; }
  }
  // idle breathing + ear / scarf follow-through, parts offset so nothing moves in unison
  function idle(tl,p,t0,dur,seed,amp=1){
    const R=rng(seed); const per=1.6+R()*0.5; const n=Math.max(1,Math.floor(dur/per));
    tl.fromTo("#"+p+"-body",{scaleY:1},{scaleY:1+0.025*amp,duration:per/2,ease:"sine.inOut",yoyo:true,repeat:n*2-1},t0);
    tl.fromTo("#"+p+"-head",{y:0},{y:-3*amp,duration:per/2,ease:"sine.inOut",yoyo:true,repeat:n*2-1},t0+0.12);
    if(document.getElementById(p+"-scarfTail")) tl.fromTo("#"+p+"-scarfTail",{rotation:-3},{rotation:5,duration:per*0.6,ease:"sine.inOut",yoyo:true,repeat:Math.max(1,Math.floor(dur/(per*0.6)))-1},t0+0.2);
    tl.fromTo("#"+p+"-earL",{rotation:0},{rotation:-4*amp,duration:per*0.55,ease:"sine.inOut",yoyo:true,repeat:Math.max(1,Math.floor(dur/(per*0.55)))-1},t0+0.3);
    tl.fromTo("#"+p+"-earR",{rotation:0},{rotation:3*amp,duration:per*0.6,ease:"sine.inOut",yoyo:true,repeat:Math.max(1,Math.floor(dur/(per*0.6)))-1},t0+0.45);
  }
  // walk cycle: bob, alternate legs and arms, slight sway
  function walk(tl,p,t0,dur,step=0.36,hop=false){
    const n=Math.max(1,Math.floor(dur/step));
    tl.fromTo("#"+p+"-legL",{rotation:-14},{rotation:14,duration:step,ease:"sine.inOut",yoyo:true,repeat:n-1},t0);
    tl.fromTo("#"+p+"-legR",{rotation:14},{rotation:-14,duration:step,ease:"sine.inOut",yoyo:true,repeat:n-1},t0);
    tl.fromTo("#"+p+"-armL",{rotation:10},{rotation:-12,duration:step,ease:"sine.inOut",yoyo:true,repeat:n-1},t0+0.04);
    tl.fromTo("#"+p+"-armR",{rotation:-10},{rotation:12,duration:step,ease:"sine.inOut",yoyo:true,repeat:n-1},t0+0.04);
    tl.fromTo("#"+p+"-body",{y:0},{y:hop?-26:-7,duration:step/2,ease:hop?"power2.out":"sine.out",yoyo:true,repeat:n*2-1},t0);
    tl.fromTo("#"+p+"-head",{rotation:-2.5,y:0},{rotation:2.5,y:hop?-26:-7,duration:step,ease:"sine.inOut",yoyo:true,repeat:n-1},t0+0.06);
  }
  function look(tl,p,dx,dy,t,d=0.3){ tl.to(["#"+p+"-lookL","#"+p+"-lookR"],{x:dx,y:dy,duration:d,ease:"power2.out"},t); }
  function body(p){ return ["body","head","legL","legR","armL","armR"].map(k=>"#"+p+"-"+k); }
  return {rng,mood,setOrigins,blinks,idle,walk,look,body};
})();
`;
