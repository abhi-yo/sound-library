// 08 Typewriter mechanism: an open-frame typewriter. A key press swings its
// typebar up out of the segment to strike the platen through the ribbon,
// and the carriage (platen, paper, knobs, scale) steps one character left.
import { k, G, S, L, D, face, screwTop, camOf, writeArt, EL } from "./common.mjs";

const W = 320;
const H = 236;
const AZ = 90;

const PP = [0, -20.5, 60]; // print point, front of the platen
const C = [0, -20.5, 28]; // segment centre, under the print point
const RP = 20; // pivot radius
const PHI = [-50, -25, 0, 25, 50].map((d) => (d * Math.PI) / 180);
const KEYS = ["S", "O", "U", "N", "D"];
const KEY_X = [-30, -15, 0, 15, 30];
const KEY_Y = 52;
const KEY_Z = 30;
// paper: 60 wide, 6 margins, 12 columns at 4 -> the line spans the whole sheet
const PAPER = { x0: -30, x1: 30 };
const MARGIN = 6;
const COLS = 12;
const PITCH = (PAPER.x1 - PAPER.x0 - 2 * MARGIN) / COLS;
const TRAVEL = PAPER.x1 - MARGIN; // carriage shift at column 0 (and -TRAVEL at the end)

const CHASSIS = { x: -64, y: -46, w: 128, d: 110, r: 6 };
const CH_H = 10;

const P = k.fitProjection(
  [...k.boxCorners(CHASSIS, -4, CH_H), [-62 - TRAVEL, -40, 108], [62 + TRAVEL, -40, 108], [-58 - TRAVEL, -20, 84], [62 + TRAVEL, -12, 76], [KEY_X[4] + 6, KEY_Y + 6, KEY_Z + 2]],
  W,
  H,
  { pad: 8, azimuth: AZ, elevation: EL },
);
const at = (p) => k.iso(p, P);
const polar = (r, a, z) => [C[0] + Math.sin(a) * r, C[1] + Math.cos(a) * r, z];

function chassis() {
  const out = [`<path class="iso-halo" d="${k.haloOf(CHASSIS, -4, CH_H, P)}"/>`];
  const feet = k.corners(CHASSIS, 10).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P));
  for (const [x, y] of feet) out.push(S(k.cylinder(x, y, 5, -4, 4, P, 22), { tone: "mid" }));
  out.push(S(k.slabOf(CHASSIS, 0, CH_H, P, 8, 1), { tone: "mid", inner: L(k.sideSeam(CHASSIS, 4, P, 8), { tone: "faint" }) }));
  for (const [x, y] of k.corners(CHASSIS, 6)) out.push(screwTop(x, y, CH_H, P, 1.6));
  // name plate on the front apron: the one engraved label
  const plate = { x: -22, y: CHASSIS.y + CHASSIS.d, w: 44, d: 0.8, r: 0.4 };
  out.push(S(k.slabOf(plate, 2.2, 5.6, P, 2), { tone: "lo", crease: "none" }));
  out.push(D([at([plate.x + 2, plate.y + 0.8, 5]), at([plate.x + plate.w - 2, plate.y + 0.8, 5])], { size: 0.5, tone: "mid" }));
  // side frames under the carriage rail
  for (const x of [-62, 58]) {
    out.push(S(k.slabOf({ x, y: -44, w: 4, d: 30, r: 1 }, CH_H, 38, P, 3, 0.4), { tone: "mid" }));
    out.push(D([at([x + 4, -40, CH_H + 6]), at([x + 4, -18, CH_H + 6]), at([x + 4, -40, CH_H + 32]), at([x + 4, -18, CH_H + 32])], { size: 0.5, tone: "mid" }));
  }
  // carriage rail across the frames
  out.push(S(k.slabOf({ x: -66, y: -42, w: 132, d: 6, r: 1 }, 48, 4, P, 3, 0.4), { tone: "hi" }));
  out.push(L(k.lineOnTop([-66, -39], [66, -39], 52, P), { tone: "lo" }));
  return out.join("");
}

function ribbon() {
  const out = [];
  for (const x of [-40, 40]) {
    out.push(S(k.cylinder(x, -15, 1.4, CH_H, 36, P, 14), { tone: "mid", crease: "none" }));
    out.push(S(k.cylinder(x, -15, 8, 46, 1, P, 32), { tone: "mid" }));
    out.push(S(k.cylinder(x, -15, 5.5, 47, 4, P, 32), { tone: "lit", className: "anat-accent" }));
    out.push(S(k.cylinder(x, -15, 8, 51, 1, P, 32), { tone: "mid" }));
    out.push(L(k.ring(x, -15, 2.2, 52, P, 16), { tone: "lo" }));
  }
  // ribbon guide (vibrator) at the print point, on a thin post
  out.push(S(k.cylinder(0, -17, 0.9, CH_H, 44, P, 10), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: -5, y: -18.6, w: 10, d: 1.6, r: 0.4 }, 54, 7, P, 2), { tone: "mid" }));
  // the ribbon: from each spool to the guide
  out.push(`<path class="iso-line anat-accent-line" style="stroke-width:1.3px" d="${k.pathOf([at([-40 + 5.5, -15 - 0.5, 49]), at([-5, -18, 57.5]), at([5, -18, 57.5]), at([40 - 5.5, -15 - 0.5, 49])])}"/>`);
  return out.join("");
}

const PAPER_PTS = [[PAPER.x0, -33, 64], [PAPER.x1, -33, 64], [PAPER.x1, -40, 106], [PAPER.x0, -40, 106]];

function carriage() {
  const out = [];
  const plat = G.frameAlong([0, -28.5, 60], [1, 0, 0]);
  // end plates riding the rail
  out.push(S(k.slabOf({ x: -52, y: -40, w: 3, d: 18, r: 1 }, 52, 18, P, 3, 0.4), { tone: "mid" }));
  // paper behind the platen, rising back
  out.push(face(PAPER_PTS, P, { tone: "mid", cls: "anat-paper" }));
  // platen and knobs
  out.push(S(G.disc(-49, 49, 8, plat, P), { tone: "mid", inner: L(G.arcOf(plat, -30, 8, P), { tone: "faint" }) + L(G.arcOf(plat, 30, 8, P), { tone: "faint" }) }));
  for (const [s0, s1] of [[-57, -49], [49, 57]]) {
    out.push(S(G.disc(s0, s1, 10, plat, P), { tone: "hi" }));
    out.push(k.fadedSvg(G.ribsOf(plat, s0, s1, 10, 40, P, { fade: [0.05, 0.5] }), { tone: "lo" }));
  }
  out.push(L(G.circleOf(plat, 57, 4, P, 24), { tone: "lo" }));
  out.push(S(k.slabOf({ x: 49, y: -40, w: 3, d: 18, r: 1 }, 52, 18, P, 3, 0.4), { tone: "mid" }));
  // paper bail with two rollers
  const bail = G.frameAlong([0, -19.5, 69], [1, 0, 0]);
  out.push(S(G.disc(-44, 44, 1, bail, P), { tone: "hi", crease: "none" }));
  for (const s of [-16, 16]) out.push(S(G.disc(s - 2, s + 2, 2.6, bail, P), { tone: "mid" }));
  // carriage scale in front of the bail: ticks hang from its front edge
  const strip = { x: -38, y: -18, w: 76, d: 3, r: 0.5 };
  out.push(S(k.slabOf(strip, 71, 0.8, P, 2), { tone: "lo", crease: "none" }));
  const t = k.topTicks(-36, 36, PITCH, 5, strip.y + strip.d, 71.8, [-1.2, -2.2], P, "x");
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  // carriage-return lever on the left end plate
  const lv = G.frameOf([-52, -24, 66], G.unit3([-0.6, 0.55, 0.58]), [0, 0, 1], G.unit3(G.cross3([-0.6, 0.55, 0.58], [0, 0, 1])));
  out.push(S(G.prismOf(lv, [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]], 0, 20, P), { tone: "hi" }));
  out.push(S(G.disc(20, 24, 2.2, lv, P), { tone: "hi" }));
  return out.join("");
}

function segment() {
  const out = [];
  const ring = (r0, r1, a0, a1, n = 24) => [
    ...Array.from({ length: n + 1 }, (_, i) => polar(r1, a0 + ((a1 - a0) * i) / n, 0).slice(0, 2)),
    ...Array.from({ length: n + 1 }, (_, i) => polar(r0, a1 - ((a1 - a0) * i) / n, 0).slice(0, 2)),
  ];
  // segment on two posts
  for (const a of [-1, 1]) {
    const [x, y] = polar(RP, a, 0);
    out.push(S(k.cylinder(x, y, 1.6, CH_H, 15, P, 14), { tone: "mid", crease: "none" }));
  }
  out.push(S(k.extrude(ring(16, 24, -1.15, 1.15), 25, 3, P, { convex: false }), { tone: "hi" }));
  // slots for each bar, cut radially across the top
  for (const a of PHI) out.push(L(k.pathOf([at(polar(16, a, 28)), at(polar(24, a, 28))]), { tone: "lo" }));
  out.push(L(k.pathOf(Array.from({ length: 25 }, (_, i) => at(polar(RP, -1.15 + (2.3 * i) / 24, 28)))), { tone: "faint" }));
  // felt rest the bars lie on
  out.push(S(k.extrude(ring(54, 59, -1.0, 1.0), 19, 3.5, P, { convex: false }), { tone: "lo" }));
  for (const a of [-0.95, 0.95]) {
    const [x, y] = polar(56.5, a, 0);
    out.push(S(k.cylinder(x, y, 1.4, CH_H, 9, P, 12), { tone: "mid", crease: "none" }));
  }
  return out.join("");
}

function keyboard() {
  const out = [];
  // key levers from the deck back to each bar's heel
  KEY_X.forEach((x, i) => {
    const heel = polar(RP + 2, PHI[i], 24);
    out.push(L(k.pathOf([at([x, KEY_Y - 8, 17]), at([heel[0], heel[1] + 4, 20]), at(heel)]), { tone: "lo" }));
  });
  const deck = { x: -40, y: KEY_Y - 8, w: 80, d: 18, r: 3 };
  out.push(S(k.slabOf(deck, CH_H, 8, P, 4, 0.6), { tone: "mid" }));
  for (const [x, y] of k.corners(deck, 3.5)) out.push(screwTop(x, y, CH_H + 8, P, 1.2));
  return out.join("");
}

function keyArt(i) {
  const x = KEY_X[i];
  const out = [];
  out.push(S(k.cylinder(x, KEY_Y, 1.1, CH_H + 8, KEY_Z - CH_H - 8, P, 12), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(x, KEY_Y, 5.6, KEY_Z, 1.2, P, 32), { tone: "hi" })); // chrome rim
  out.push(S(k.cylinder(x, KEY_Y, 4.6, KEY_Z + 1.2, 0.8, P, 32), { tone: "lo" }));
  out.push(k.faceTextSvg(k.topMatrix([x - 1.4, KEY_Y + 1.6], KEY_Z + 2, P, "x"), KEYS[i], { size: 4.4, tone: "hi" }));
  return out.join("");
}

function bell() {
  const F = G.frameAlong([62, -8, CH_H], [0, 0, 1]);
  const out = [];
  out.push(S(k.cylinder(62, -8, 1.3, CH_H, 52, P, 12), { tone: "mid", crease: "none" }));
  out.push(S(G.solidOf([[52, 7], [53.5, 7], [56, 6, 1], [58.5, 4, 1], [60, 1.6, 1], [60.4, 0]], F, P), { tone: "hi" }));
  out.push(S(k.cylinder(62, -8, 1, 60.4, 1.6, P, 10), { tone: "hi" }));
  return out.join("");
}

// paper text plane: x along the platen, "down" runs down the paper
const paperAt = (x, along) => [x, -33 - 7 * along, 64 + 42 * along];
function paperMatrix(along) {
  const o = at(paperAt(0, along));
  const ex = at(paperAt(1, along));
  const dn = at(paperAt(0, along - 1 / 42));
  return `matrix(${(ex[0] - o[0]).toFixed(3)} ${(ex[1] - o[1]).toFixed(3)} ${(dn[0] - o[0]).toFixed(3)} ${(dn[1] - o[1]).toFixed(3)} ${o[0].toFixed(2)} ${o[1].toFixed(2)})`;
}

export function buildTypewriter(outFile) {
  writeArt(outFile, "typewriter", {
    W,
    H,
    CAM: camOf(P),
    BACK: chassis(),
    CARRIAGE: carriage(),
    MIDDLE: ribbon() + segment(),
    KEYBOARD: keyboard(),
    KEYS: KEYS.map((_, i) => keyArt(i)),
    BELL: bell(),
    GEO: {
      pp: PP,
      c: C,
      rp: RP,
      phi: PHI,
      pitch: PITCH,
      cols: COLS,
      col0: PAPER.x0 + MARGIN + PITCH / 2,
      travel: TRAVEL,
      paperClip: k.pathOf(PAPER_PTS.map(at), true),
      keys: KEYS,
      lineMatrices: [0.14, 0.27, 0.4].map(paperMatrix),
      textSize: 5.3,
    },
  });
}
