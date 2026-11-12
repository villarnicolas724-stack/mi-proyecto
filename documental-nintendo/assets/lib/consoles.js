// Modelos 3D simplificados de consolas (escala relativa aproximada: 1 unidad ≈ 10 cm).
// Son ilustraciones de volumen; sin logotipos ni marcas.
import * as THREE from "./three.module.min.js";
import { RoundedBoxGeometry } from "./RoundedBoxGeometry.js";

const mats = {};
function mat(color, rough = 0.5, metal = 0.0, extra = {}) {
  const k = color + "_" + rough + "_" + metal + JSON.stringify(extra);
  if (!mats[k]) mats[k] = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
  return mats[k];
}
function screenMat(color, glow = 0.35) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.0, emissive: color, emissiveIntensity: glow });
}
function rbox(w, h, d, r, m, x = 0, y = 0, z = 0) {
  const g = new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
  const o = new THREE.Mesh(g, m); o.position.set(x, y, z); return o;
}
function cyl(r, h, m, x = 0, y = 0, z = 0, seg = 32) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m); o.position.set(x, y, z); return o;
}
function dpad(g, x, y, z, s, m) {
  g.add(rbox(s, s * 0.32, 0.05, 0.02, m, x, y, z));
  g.add(rbox(s * 0.32, s, 0.05, 0.02, m, x, y, z));
}
function btnFace(g, x, y, z, r, m) { const b = cyl(r, 0.05, m, x, y, z); b.rotation.x = Math.PI / 2; g.add(b); return b; }

// ---------------------------------------------------------------- modelos
const B = {};
B.famicom = () => {
  const g = new THREE.Group();
  const cream = mat(0xe9e2d0, 0.55), maroon = mat(0x8a1c24, 0.5), gold = mat(0xc9a55a, 0.35, 0.4), dark = mat(0x2a2224, 0.6);
  g.add(rbox(2.2, 0.48, 1.5, 0.06, cream, 0, 0.24, 0));
  g.add(rbox(2.0, 0.08, 0.5, 0.03, maroon, 0, 0.5, 0.42));      // franja frontal
  g.add(rbox(0.9, 0.1, 0.18, 0.03, dark, 0, 0.52, -0.25));       // ranura de cartucho
  for (const sx of [-1, 1]) {                                     // mandos encajados en los laterales
    const c = new THREE.Group();
    c.add(rbox(0.55, 0.08, 1.25, 0.04, maroon, 0, 0, 0));
    c.add(rbox(0.45, 0.02, 1.05, 0.01, gold, 0, 0.05, 0));
    dpad(c, 0, 0.07, 0.3, 0.2, dark); c.children.slice(-2).forEach(o => o.rotation.x = -Math.PI / 2);
    for (const bz of [-0.25, -0.4]) { const b = cyl(0.06, 0.05, maroon, 0.08 * sx, 0.07, bz); c.add(b); }
    c.position.set(sx * 1.32, 0.18, 0); g.add(c);
  }
  return g;
};
B.nes = () => {
  const g = new THREE.Group();
  const light = mat(0xc4c4c2, 0.6), darkg = mat(0x48484c, 0.55), black = mat(0x1d1d20, 0.6), red = mat(0xd62828, 0.3, 0, { emissive: 0xd62828, emissiveIntensity: 0.6 });
  g.add(rbox(2.6, 0.55, 2.05, 0.04, light, 0, 0.275, 0));
  g.add(rbox(2.62, 0.3, 0.7, 0.03, darkg, 0, 0.15, 0.69));      // banda frontal oscura
  g.add(rbox(1.6, 0.04, 1.1, 0.01, darkg, 0.15, 0.56, -0.25));  // tapa superior
  for (let i = 0; i < 7; i++) g.add(rbox(0.9, 0.012, 0.03, 0.005, black, -0.6, 0.565, -0.6 + i * 0.12));
  g.add(rbox(1.3, 0.02, 0.32, 0.01, darkg, 0.2, 0.3, 1.04));    // portilla
  for (const x of [-0.95, -0.6]) g.add(rbox(0.22, 0.14, 0.03, 0.02, black, x, 0.14, 1.05));
  g.add(rbox(0.08, 0.04, 0.03, 0.01, red, -1.05, 0.36, 1.04));
  return g;
};
B.gameboy = () => {
  const g = new THREE.Group();
  const body = mat(0xc9c5bb, 0.6), bezel = mat(0x5d5c69, 0.45), black = mat(0x1e1e22, 0.5), mag = mat(0x9b2457, 0.4), gray = mat(0x8c8a90, 0.5);
  g.add(rbox(0.9, 1.48, 0.32, 0.06, body, 0, 0.74, 0));
  g.add(rbox(0.74, 0.62, 0.03, 0.04, bezel, 0, 1.05, 0.165));
  g.add(rbox(0.46, 0.42, 0.02, 0.005, screenMat(0x8bac0f, 0.25), 0.02, 1.05, 0.18));
  dpad(g, -0.22, 0.52, 0.17, 0.2, black);
  btnFace(g, 0.2, 0.5, 0.17, 0.065, mag); btnFace(g, 0.33, 0.58, 0.17, 0.065, mag);
  for (const x of [-0.08, 0.08]) { const p = rbox(0.11, 0.035, 0.03, 0.015, gray, x, 0.26, 0.17); p.rotation.z = 0.45; g.add(p); }
  for (let i = 0; i < 6; i++) { const s = rbox(0.025, 0.16, 0.02, 0.01, gray, 0.18 + i * 0.045, 0.12, 0.165); s.rotation.z = 0.45; g.add(s); }
  return g;
};
B.superfamicom = () => {
  const g = new THREE.Group();
  const light = mat(0xcfcdd2, 0.55), mid = mat(0xa9a7b0, 0.55), dark = mat(0x3f3e46, 0.5);
  g.add(rbox(2.0, 0.42, 1.95, 0.12, light, 0, 0.21, 0));
  g.add(rbox(1.75, 0.2, 1.4, 0.2, light, 0, 0.45, -0.05));
  g.add(rbox(0.9, 0.06, 0.22, 0.03, dark, 0, 0.56, -0.2));
  for (const x of [-0.55, 0.55]) g.add(rbox(0.22, 0.08, 0.14, 0.03, mid, x, 0.54, 0.45));
  // mando con botones de colores
  const c = new THREE.Group();
  c.add(rbox(1.15, 0.12, 0.5, 0.2, light, 0, 0, 0));
  dpad(c, -0.33, 0.07, 0, 0.17, dark); c.children.slice(-2).forEach(o => o.rotation.x = -Math.PI / 2);
  const cols = [[0xd23a3a, 0.42, 0], [0xf1c232, 0.33, 0.09], [0x3a63c9, 0.33, -0.09], [0x2f9e5a, 0.24, 0]];
  for (const [col, x, z] of cols) c.add(cyl(0.045, 0.05, mat(col, 0.35), x, 0.07, z));
  c.position.set(1.65, 0.06, 0.75); c.rotation.y = -0.4; g.add(c);
  return g;
};
B.n64 = () => {
  const g = new THREE.Group();
  const ch = mat(0x2b2b30, 0.45), dk = mat(0x1a1a1d, 0.5), gray = mat(0x8a8a92, 0.5), red = mat(0xd61f2b, 0.4), yel = mat(0xf2c12e, 0.4), grn = mat(0x2a9a4a, 0.4), blu = mat(0x2a5fc2, 0.4);
  g.add(rbox(2.6, 0.5, 1.9, 0.18, ch, 0, 0.25, 0));
  g.add(rbox(2.0, 0.34, 1.0, 0.16, ch, 0, 0.58, -0.25));
  g.add(rbox(0.95, 0.08, 0.26, 0.03, dk, 0, 0.77, -0.25));
  for (let i = 0; i < 4; i++) g.add(rbox(0.2, 0.12, 0.03, 0.03, dk, -0.6 + i * 0.4, 0.22, 0.96));
  // mando de tres brazos con stick analógico
  const c = new THREE.Group();
  c.add(rbox(1.25, 0.16, 0.45, 0.18, gray, 0, 0, 0));
  for (const x of [-0.42, 0, 0.42]) c.add(rbox(0.26, 0.15, 0.62, 0.12, gray, x, -0.02, 0.36));
  const stick = cyl(0.07, 0.18, dk, 0, 0.14, 0.18); c.add(stick); c.userData.stick = stick;
  c.add(cyl(0.11, 0.04, dk, 0, 0.23, 0.18));
  c.add(cyl(0.05, 0.05, blu, 0.36, 0.1, 0.06)); c.add(cyl(0.05, 0.05, grn, 0.26, 0.1, 0.12));
  for (const [x, z] of [[0.48, -0.05], [0.56, 0.04], [0.48, 0.13], [0.4, 0.04]]) c.add(cyl(0.035, 0.05, yel, x, 0.1, z));
  c.add(cyl(0.04, 0.05, red, 0, 0.1, -0.05));
  c.position.set(1.95, 0.16, 0.9); c.rotation.y = -0.5; g.add(c); g.userData.pad = c;
  return g;
};
B.gamecube = () => {
  const g = new THREE.Group();
  const ind = mat(0x5b4ea0, 0.4), dk = mat(0x2c2650, 0.45), gray = mat(0x9c9aa8, 0.5);
  g.add(rbox(1.5, 1.1, 1.5, 0.1, ind, 0, 0.55, 0));
  const lid = cyl(0.55, 0.04, dk, 0, 1.11, 0.0, 48); g.add(lid);
  g.add(rbox(1.3, 0.12, 0.16, 0.06, gray, 0, 1.18, -0.85)); // asa
  for (const x of [-0.6, 0.6]) g.add(rbox(0.12, 0.12, 0.4, 0.05, gray, x, 1.08, -0.68));
  for (let i = 0; i < 4; i++) g.add(rbox(0.22, 0.12, 0.03, 0.03, dk, -0.5 + i * 0.33, 0.25, 0.76));
  return g;
};
B.gba = () => {
  const g = new THREE.Group();
  const p = mat(0x5a4f9c, 0.45), dk = mat(0x1e1e26, 0.5), lp = mat(0x8c84c4, 0.45);
  g.add(rbox(1.45, 0.82, 0.25, 0.3, p, 0, 0.41, 0));
  g.add(rbox(0.72, 0.52, 0.03, 0.05, dk, 0, 0.45, 0.13));
  g.add(rbox(0.6, 0.4, 0.02, 0.005, screenMat(0x9fb6ff, 0.4), 0, 0.45, 0.145));
  dpad(g, -0.53, 0.47, 0.13, 0.16, dk);
  btnFace(g, 0.5, 0.52, 0.13, 0.05, lp); btnFace(g, 0.6, 0.42, 0.13, 0.05, lp);
  return g;
};
B.ds = () => {
  const g = new THREE.Group();
  const sil = mat(0xd5d6da, 0.35, 0.3), dk = mat(0x1d1e22, 0.45);
  const base = new THREE.Group();
  base.add(rbox(1.48, 0.12, 0.85, 0.05, sil, 0, 0.06, 0));
  base.add(rbox(0.62, 0.02, 0.46, 0.01, screenMat(0xbfe6ff, 0.45), 0, 0.125, 0.02));
  dpad(base, -0.52, 0.13, 0.05, 0.14, dk); base.children.slice(-2).forEach(o => o.rotation.x = -Math.PI / 2);
  for (const [x, z] of [[0.5, -0.06], [0.58, 0.02], [0.5, 0.1], [0.42, 0.02]]) base.add(cyl(0.035, 0.03, dk, x, 0.13, z));
  g.add(base);
  const lidPivot = new THREE.Group(); lidPivot.position.set(0, 0.12, -0.42);
  const lid = new THREE.Group();
  lid.add(rbox(1.48, 0.1, 0.85, 0.05, sil, 0, 0.05, 0.42));
  lid.add(rbox(0.66, 0.02, 0.48, 0.01, screenMat(0xffd9a0, 0.5), 0, -0.002, 0.42));
  lidPivot.add(lid); g.add(lidPivot); g.userData.lid = lidPivot;
  // lápiz
  const st = cyl(0.025, 0.9, mat(0x9a9aa2, 0.4, 0.3), 0.9, 0.2, 0.2, 12); st.rotation.z = 0.9; g.add(st); g.userData.stylus = st;
  return g;
};
B.wii = () => {
  const g = new THREE.Group();
  const w = mat(0xf4f5f7, 0.3), lg = mat(0xd9dce1, 0.35), blue = mat(0x4fc3ff, 0.3, 0, { emissive: 0x4fc3ff, emissiveIntensity: 0.9 });
  g.add(rbox(0.44, 1.6, 1.9, 0.06, w, 0, 0.8, 0));
  g.add(rbox(0.02, 0.06, 1.2, 0.01, blue, 0.225, 1.2, 0.1));
  g.add(rbox(0.6, 0.06, 1.4, 0.03, lg, 0, 0.03, 0));
  const r = new THREE.Group();                        // mando de movimiento
  r.add(rbox(0.36, 1.48, 0.3, 0.12, w, 0, 0, 0));
  r.add(cyl(0.07, 0.04, lg, 0, 0.45, 0.16)); r.children[1].rotation.x = Math.PI / 2;
  dpad(r, 0, 0.32 + 0.3, 0.16, 0.14, lg);
  r.position.set(1.0, 0.8, 0.6); r.rotation.set(0.2, -0.3, -0.25); g.add(r); g.userData.remote = r;
  return g;
};
B.wiiu = () => {
  const g = new THREE.Group();
  const w = mat(0xf2f3f5, 0.3), bk = mat(0x1b1b1f, 0.35), dk = mat(0x0f0f12, 0.5);
  g.add(rbox(0.5, 1.7, 2.6, 0.08, w, -1.5, 0.85, -0.6));
  const pad = new THREE.Group();
  pad.add(rbox(2.55, 1.32, 0.22, 0.25, bk, 0, 0, 0));
  pad.add(rbox(1.5, 0.9, 0.02, 0.01, screenMat(0x8fd3ff, 0.55), 0, 0.02, 0.115));
  for (const x of [-1.0, 1.0]) pad.add(cyl(0.12, 0.08, dk, x, 0.35, 0.13)), pad.children[pad.children.length - 1].rotation.x = Math.PI / 2;
  pad.position.set(0.6, 0.9, 0.3); pad.rotation.x = -0.25; g.add(pad); g.userData.pad = pad;
  return g;
};
function switchLike(scale, joyL, joyR, body, scr) {
  const g = new THREE.Group();
  const tab = new THREE.Group();
  tab.add(rbox(2.4 * scale, 1.02 * scale, 0.14, 0.05, mat(body, 0.35), 0, 0, 0));
  tab.add(rbox(2.0 * scale, 0.9 * scale, 0.02, 0.01, screenMat(scr, 0.6), 0, 0, 0.075));
  g.add(tab);
  const mk = (col, sx) => {
    const j = new THREE.Group();
    j.add(rbox(0.36 * scale, 1.02 * scale, 0.16, 0.16 * scale, mat(col, 0.35), 0, 0, 0));
    const st = cyl(0.07 * scale, 0.08, mat(0x1b1b1e, 0.5), 0, (sx < 0 ? 0.22 : -0.08) * scale, 0.1); st.rotation.x = Math.PI / 2; j.add(st);
    for (const [dx, dy] of [[0, 0.09], [0, -0.09], [0.09, 0], [-0.09, 0]]) {
      const b = cyl(0.035 * scale, 0.04, mat(0x1b1b1e, 0.5), dx * scale, ((sx < 0 ? -0.15 : 0.22) + dy) * scale, 0.09); b.rotation.x = Math.PI / 2; j.add(b);
    }
    j.position.set(sx * (1.2 * scale + 0.18 * scale), 0, 0); g.add(j); return j;
  };
  g.userData.jl = mk(joyL, -1); g.userData.jr = mk(joyR, 1); g.userData.tab = tab;
  return g;
}
B.switch = () => {
  const g = switchLike(1.0, 0x0ab9e6, 0xff3c28, 0x1c1c20, 0x2a3a52);
  const dock = rbox(2.3, 1.05, 0.55, 0.12, mat(0x232327, 0.5), 0, -0.25, -0.25); g.add(dock); g.userData.dock = dock;
  return g;
};
B.switch2 = () => {
  const g = switchLike(1.13, 0x1f1f24, 0x1f1f24, 0x18181c, 0x24304a);
  // acentos de color en el raíl interior
  const blue = mat(0x19b5ff, 0.3, 0, { emissive: 0x19b5ff, emissiveIntensity: 0.7 });
  const red = mat(0xff4a3d, 0.3, 0, { emissive: 0xff4a3d, emissiveIntensity: 0.7 });
  g.userData.jl.add(rbox(0.02, 0.9, 0.17, 0.01, blue, 0.19, 0, 0));
  g.userData.jr.add(rbox(0.02, 0.9, 0.17, 0.01, red, -0.19, 0, 0));
  return g;
};
B.card = () => { // carta hanafuda en relieve (para el alineamiento final)
  const g = new THREE.Group();
  g.add(rbox(0.6, 1.0, 0.03, 0.03, mat(0x1b1714, 0.6), 0, 0.5, 0));
  g.add(rbox(0.52, 0.92, 0.032, 0.02, mat(0xc23b22, 0.6), 0, 0.5, 0.001));
  return g;
};

export function buildConsole(name) {
  const g = B[name]();
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

// ---------------------------------------------------------------- escenario de estudio
export function createStage(canvas, { bg = null, fov = 30, floor = true, shadow = 0.45, key = 0xffe8cc, rim = 0x9fc7ff } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(canvas.width, canvas.height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); if (bg !== null) scene.background = new THREE.Color(bg);
  const camera = new THREE.PerspectiveCamera(fov, canvas.width / canvas.height, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3a44, 0.55));
  const k = new THREE.DirectionalLight(key, 2.2); k.position.set(-4, 7, 5); k.castShadow = true;
  k.shadow.mapSize.set(2048, 2048); Object.assign(k.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 30 }); k.shadow.radius = 6; k.shadow.bias = -0.0005;
  scene.add(k);
  const r = new THREE.DirectionalLight(rim, 1.4); r.position.set(5, 3, -6); scene.add(r);
  const f = new THREE.DirectionalLight(0xffffff, 0.35); f.position.set(0, 2, 8); scene.add(f);
  let ground = null;
  if (floor) {
    ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: shadow }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  }
  return { THREE, renderer, scene, camera, key: k, rim: r, ground, render: () => renderer.render(scene, camera) };
}
export { THREE };
