// 09 Padlock, cutaway: a laminated padlock with a window milled into its face
// down to the plug axis, showing the pin-tumbler cylinder. Press: the key
// slides in, every key pin rises until its top sits on the shear line, and
// the shackle springs up. Press again: shackle drops, key out, pins fall.
import { k, G, S, L, D, face, screwTop, camOf, writeArt, EL } from "./common.mjs";
import { tubePieces, tubeSvg } from "./kit/tube.mjs";

const W = 320;
const H = 236;
const AZ = 0;

const BODY = { x: -14, y: -34, w: 28, d: 68, r: 4 };
const BODY_Z = 4;
const BODY_TOP = 74;
const SEC_X = 2; // section plane through the plug axis
const WIN = { y0: -27, y1: 25, z0: 14, z1: 54 };
const PLUG = { z0: 16, z1: 34, y0: -25 };
const SHEAR = 34;
const KEYWAY = { z0: 17, z1: 23 };
const PINS_Y = [-18, -9, 0, 9, 18];
const KEY_TOP = [21, 23, 20, 22, 24]; // bitting: key top under each pin
const PIN_LEN = KEY_TOP.map((z) => SHEAR - z);
const DRIVER = 8;
const BORE_TOP = 51;
const BORE_W = 4.6;
const SHACKLE = { r: 5, legY: 22, arcZ: BODY_TOP + 22, rise: 18 };

const BASE = { x: -30, y: -52, w: 60, d: 116, r: 5 };

const P = k.fitProjection(
  [...k.boxCorners(BASE, -8, 0), [0, -SHACKLE.legY - SHACKLE.r, SHACKLE.arcZ + SHACKLE.legY + SHACKLE.r + SHACKLE.rise], [0, SHACKLE.legY + SHACKLE.r, SHACKLE.arcZ + SHACKLE.legY + SHACKLE.rise], [2, BODY.y + BODY.d + 22 + 58 + 10, 18]],
  W,
  H,
  { pad: 10, azimuth: AZ, elevation: EL },
);
const at = (p) => k.iso(p, P);
const sec = (y, z, dx = 0) => [SEC_X + dx, y, z];

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -8, 8, P)}"/>`];
  for (const [x, y] of k.corners(BASE, 9).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))) {
    out.push(S(k.cylinder(x, y, 4.4, -8, 3, P, 20), { tone: "mid" }));
  }
  out.push(S(k.slabOf(BASE, -5, 5, P, 6, 1), { tone: "mid" }));
  for (const [x, y] of k.corners(BASE, 5)) out.push(screwTop(x, y, 0, P, 1.4));
  // seat the lock stands in
  out.push(S(k.slabOf(k.insetPlan(BODY, -3), 0, BODY_Z, P, 4, 0.5), { tone: "mid" }));
  // ruler strip on the near long edge, ticks hang from its edge
  const strip = { x: BASE.x + BASE.w - 8, y: BASE.y + 8, w: 5, d: BASE.d - 16, r: 0.6 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 2), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.y + 2, strip.y + strip.d - 2, 4, 5, strip.x, 0.6, [1.6, 3], P, "y");
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  return out.join("");
}

function body() {
  const out = [];
  const seams = [];
  for (let z = BODY_Z + 6; z < BODY_TOP - 2; z += 6) seams.push(L(k.sideSeam(BODY, z, P, 4), { tone: "faint" }));
  out.push(S(k.slabOf(BODY, BODY_Z, BODY_TOP - BODY_Z, P, 4, 0.8), { tone: "mid", inner: seams.join("") }));
  // shackle holes in the top
  for (const y of [-SHACKLE.legY, SHACKLE.legY]) {
    out.push(`<path class="anat-void" d="${k.ring(0, y, SHACKLE.r + 0.6, BODY_TOP, P, 28)}"/>`);
    out.push(L(k.ring(0, y, SHACKLE.r + 1.6, BODY_TOP, P, 28), { tone: "lo" }));
  }
  // rivets through the laminations
  for (const [y, z] of [[-29, 9], [29, 9], [-29, 68], [29, 68], [-29, 38], [29, 38]]) {
    const F = G.frameAlong([BODY.x + BODY.w, y, z], [1, 0, 0]);
    out.push(S(G.disc(0, 0.8, 1.9, F, P, { steps: 16 }), { tone: "hi" }));
  }
  // keyway on the +y end face
  const kw = [[SEC_X - 1.4, BODY.y + BODY.d + 0.05, KEYWAY.z0], [SEC_X + 1.4, BODY.y + BODY.d + 0.05, KEYWAY.z0], [SEC_X + 1.4, BODY.y + BODY.d + 0.05, KEYWAY.z1 + 2], [SEC_X - 1.4, BODY.y + BODY.d + 0.05, KEYWAY.z1 + 2]];
  const F = G.frameAlong([SEC_X, BODY.y + BODY.d, (PLUG.z0 + PLUG.z1) / 2], [0, 1, 0]);
  out.push(S(G.disc(0, 1.2, 10.5, F, P), { tone: "hi" }));
  out.push(`<path class="anat-void" d="${k.pathOf(kw.map((p) => at([p[0], p[1] + 1.25, p[2]])), true)}"/>`);
  return out.join("");
}

function windowCut() {
  const out = [];
  const FX = BODY.x + BODY.w;
  // recess walls: floor of the cut (faces up) and the far end wall (faces +y)
  out.push(face([[SEC_X, WIN.y0, WIN.z0], [FX, WIN.y0, WIN.z0], [FX, WIN.y1, WIN.z0], [SEC_X, WIN.y1, WIN.z0]], P, { tone: "mid" }));
  out.push(face([[SEC_X, WIN.y0, WIN.z0], [SEC_X, WIN.y0, WIN.z1], [FX, WIN.y0, WIN.z1], [FX, WIN.y0, WIN.z0]], P, { tone: "mid" }));
  // section: shell, plug, keyway, bores
  out.push(face([sec(WIN.y0, WIN.z0), sec(WIN.y1, WIN.z0), sec(WIN.y1, WIN.z1), sec(WIN.y0, WIN.z1)], P, { tone: "mid", cls: "anat-section" }));
  out.push(face([sec(PLUG.y0, PLUG.z0, 0.02), sec(WIN.y1, PLUG.z0, 0.02), sec(WIN.y1, PLUG.z1, 0.02), sec(PLUG.y0, PLUG.z1, 0.02)], P, { tone: "hi", cls: "anat-plug" }));
  out.push(`<path class="anat-void" d="${k.pathOf([sec(PLUG.y0 + 2, KEYWAY.z0, 0.04), sec(WIN.y1, KEYWAY.z0, 0.04), sec(WIN.y1, KEYWAY.z1, 0.04), sec(PLUG.y0 + 2, KEYWAY.z1, 0.04)].map(at), true)}"/>`);
  for (const y of PINS_Y) {
    out.push(`<path class="anat-void" d="${k.pathOf([sec(y - BORE_W / 2, KEYWAY.z1, 0.04), sec(y + BORE_W / 2, KEYWAY.z1, 0.04), sec(y + BORE_W / 2, BORE_TOP, 0.04), sec(y - BORE_W / 2, BORE_TOP, 0.04)].map(at), true)}"/>`);
  }
  // shear line: plug meets shell, wall to wall
  out.push(L(k.pathOf([at(sec(WIN.y0, SHEAR, 0.05)), at(sec(WIN.y1, SHEAR, 0.05))]), { tone: "hi" }));
  // plug retaining cam at the far end
  out.push(face([sec(PLUG.y0 - 1.6, PLUG.z0 - 1, 0.03), sec(PLUG.y0, PLUG.z0 - 1, 0.03), sec(PLUG.y0, PLUG.z1 + 1, 0.03), sec(PLUG.y0 - 1.6, PLUG.z1 + 1, 0.03)], P, { tone: "hi" }));
  return out.join("");
}

// the key, built inserted (tip at y = PLUG.y0 + 3) and moved along +y to pull it out
const KEY_X0 = SEC_X - 1.3;
const KEY_X1 = SEC_X + 1.3;
function key() {
  const out = [];
  const F = G.frameOf([0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const tip = PLUG.y0 + 3;
  const ac = { tone: "lit", className: "anat-accent" };
  out.push(S(G.prismOf(F, [[tip, KEYWAY.z0 + 0.4], [BODY.y + BODY.d + 14, KEYWAY.z0 + 0.4], [BODY.y + BODY.d + 14, KEYWAY.z1 - 1], [tip + 2, KEYWAY.z1 - 1]], KEY_X0, KEY_X1, P), ac));
  PINS_Y.forEach((y, i) => {
    out.push(S(G.prismOf(F, [[y - 3.4, KEYWAY.z1 - 1.2], [y + 3.4, KEYWAY.z1 - 1.2], [y + 0.9, KEY_TOP[i]], [y - 0.9, KEY_TOP[i]]], KEY_X0, KEY_X1, P), ac));
  });
  // shoulder and bow
  out.push(S(G.prismOf(F, [[BODY.y + BODY.d + 6, KEYWAY.z0 - 3], [BODY.y + BODY.d + 14, KEYWAY.z0 - 3], [BODY.y + BODY.d + 14, KEYWAY.z1 + 3], [BODY.y + BODY.d + 6, KEYWAY.z1 + 3]], KEY_X0 - 0.4, KEY_X1 + 0.4, P), ac));
  const bow = G.frameAlong([SEC_X - 1.7, BODY.y + BODY.d + 22, (KEYWAY.z0 + KEYWAY.z1) / 2], [1, 0, 0]);
  out.push(S(G.disc(0, 3.4, 9.5, bow, P, { steps: 40 }), ac));
  out.push(`<path class="anat-void" d="${G.circleOf(bow, 3.45, 2.6, P, 20)}"/>`);
  out.push(L(G.circleOf(bow, 3.45, 6.8, P, 40), { tone: "lit", className: "anat-accent-line" }));
  return out.join("");
}

function shacklePose(rise) {
  const Y = SHACKLE.legY;
  const top = SHACKLE.arcZ + rise;
  const longBottom = BODY_TOP;
  const shortBottom = Math.max(BODY_TOP, BODY_TOP - 8 + rise);
  const pts = [[0, Y, shortBottom]];
  pts.push([0, Y, top]);
  for (let i = 1; i < 24; i++) {
    const a = (i / 24) * Math.PI;
    pts.push([0, Math.cos(a) * Y, top + Math.sin(a) * Y]);
  }
  pts.push([0, -Y, top]);
  pts.push([0, -Y, longBottom]);
  const pieces = tubePieces(pts, SHACKLE.r, P, { maxLength: 14, caps: [shortBottom > BODY_TOP, false] });
  pieces.sort((a, b) => k.depthOf(a.mid, P) - k.depthOf(b.mid, P));
  let svg = pieces.map((p) => tubeSvg(p, { tone: "hi" })).join("");
  // locking notch on the short leg, once it is out of the body
  if (rise > 9) {
    const z = BODY_TOP - 8 + rise + 4;
    const F = G.frameAlong([0, Y, z], [0, 0, 1]);
    svg += L(G.arcOf(F, 0, SHACKLE.r, P), { tone: "lo" }) + L(G.arcOf(F, 2.2, SHACKLE.r, P), { tone: "lo" });
  }
  return svg;
}

export function buildPadlock(outFile) {
  const winPoly = [sec(WIN.y0, WIN.z0), sec(WIN.y1, WIN.z0), [BODY.x + BODY.w, WIN.y1, WIN.z0], [BODY.x + BODY.w, WIN.y1, WIN.z1], [BODY.x + BODY.w, WIN.y0, WIN.z1], sec(WIN.y0, WIN.z1)];
  const winHull = G.hullOf(winPoly.map(at));
  writeArt(outFile, "padlock", {
    W,
    H,
    CAM: camOf(P),
    BACK: base() + body() + windowCut(),
    KEY: key(),
    SHACKLE: Array.from({ length: 10 }, (_, i) => shacklePose((SHACKLE.rise * i) / 9)),
    GEO: {
      secX: SEC_X + 0.06,
      pinsY: PINS_Y,
      pinLen: PIN_LEN,
      keyTop: KEY_TOP,
      driver: DRIVER,
      boreTop: BORE_TOP,
      boreW: BORE_W - 0.8,
      keywayFloor: KEYWAY.z0,
      shear: SHEAR,
      keyOut: 58,
      winClip: k.pathOf(winHull, true),
      faceClipX: at([SEC_X, BODY.y + BODY.d, 0])[0],
      rise: SHACKLE.rise,
    },
  });
}
