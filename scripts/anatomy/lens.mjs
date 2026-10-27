// 07 Leaf shutter on a lens board: a Copal-style shutter, front cell removed
// so the six iris blades are visible. Press the release: the blades swing
// shut on their pins and open again, one exposure.
import { k, G, S, L, D, screwTop, camOf, writeArt, EL } from "./common.mjs";

const W = 320;
const H = 236;
const AZ = 0;
const P0 = { origin: [0, 0], scale: 1, azimuth: AZ };
// lens axis turned 34° off the line of sight, so the housing shows its depth (a 3/4 view)
const TURN = (AZ * Math.PI) / 180; // lens axis straight at the viewer
const view = [Math.cos(TURN), Math.sin(TURN)];
void P0;
const A3 = [view[0], view[1], 0];
const U3 = [view[1], -view[0], 0]; // board's horizontal (screen-right)
const Z3 = [0, 0, 1];
// lens-frame coordinates (u across, s toward viewer, z up) -> world
const wp = (u, s, z) => [U3[0] * u + A3[0] * s, U3[1] * u + A3[1] * s, z];

const LENS_Z = 50;
const BOARD = { u: 38, z0: 10, z1: 88, s0: -2, s1: 2 };
const HOUSING = { s0: 2, s1: 10, r: 29 };
const RING = { s0: 10, s1: 12.5, rIn: 21.5, rOut: 29 };
const IRIS_S = 11.2;
const IRIS_R = 21;

const fitPts = [wp(-58, -34, -10), wp(58, -34, -10), wp(-58, 34, -10), wp(58, 34, -10), wp(-40, 0, BOARD.z1), wp(40, 0, BOARD.z1), wp(0, 14, LENS_Z + 40)];
const P = k.fitProjection(fitPts, W, H, { pad: 10, azimuth: AZ, elevation: EL });
const at = (p) => k.iso(p, P);

const zFrame = (z) => G.frameOf([0, 0, z], [0, 0, 1], U3, A3); // prisms standing up, polygon in (u, s)
const sFrame = (s0 = 0) => G.frameOf(wp(0, s0, LENS_Z), A3, U3, Z3); // round parts on the lens axis
const LF = sFrame();
const onFace = (s, r, ang) => G.pointOf(LF, s, r, ang);

function base() {
  const out = [];
  const plate = [[-56, -32], [56, -32], [56, 32], [-56, 32]];
  out.push(`<path class="iso-halo" d="${G.prismOf(zFrame(-10), plate, 0, 6, P).fill}"/>`);
  const feet = [[-48, -24], [48, -24], [-48, 24], [48, 24]].map(([u, s]) => wp(u, s, 0)).sort((a, b) => k.depthOf(a, P) - k.depthOf(b, P));
  for (const [x, y] of feet) out.push(S(k.cylinder(x, y, 5, -10, 4, P, 22), { tone: "mid" }));
  out.push(S(G.prismOf(zFrame(-6), plate, 0, 6, P), { tone: "mid" }));
  for (const [u, s] of [[-50, -26], [50, -26], [-50, 26], [50, 26]]) {
    const [x, y] = wp(u, s, 0);
    out.push(screwTop(x, y, 0, P));
  }
  // ruler strip along the near edge, ticks hanging from its edge
  out.push(S(G.prismOf(zFrame(0), [[-44, 22], [44, 22], [44, 28], [-44, 28]], 0, 0.6, P), { tone: "lo", crease: "none" }));
  const ticks = [];
  for (let i = 0; i <= 22; i++) {
    const u = -42 + i * 4;
    const len = i % 5 === 0 ? 3.6 : 2;
    ticks.push(k.pathOf([at(wp(u, 22, 0.6)), at(wp(u, 22 + len, 0.6))]));
  }
  out.push(L(ticks.join(""), { tone: "mid" }));
  return out.join("");
}

function stand() {
  const out = [];
  // clamp rail the board stands in
  out.push(S(G.prismOf(zFrame(0), [[-44, -9], [44, -9], [44, 7], [-44, 7]], 0, BOARD.z0, P), {
    tone: "mid",
  }));
  out.push(L(k.pathOf([at(wp(-44, 7, BOARD.z0 - 3)), at(wp(44, 7, BOARD.z0 - 3))]), { tone: "faint" }));
  // two thumb screws on the near face of the rail
  for (const u of [-32, 32]) {
    const F = G.frameOf(wp(u, 7, 5), A3, U3, Z3);
    out.push(S(G.disc(0, 1.2, 3.4, F, P), { tone: "mid" }));
    out.push(S(G.disc(1.2, 5, 4.6, F, P), { tone: "hi" }));
    out.push(k.fadedSvg(G.ribsOf(F, 1.2, 5, 4.6, 28, P, { fade: [0.05, 0.5] }), { tone: "lo" }));
  }
  // lens board
  out.push(S(G.prismOf(zFrame(BOARD.z0), [[-BOARD.u, BOARD.s0], [BOARD.u, BOARD.s0], [BOARD.u, BOARD.s1], [-BOARD.u, BOARD.s1]], 0, BOARD.z1 - BOARD.z0, P), { tone: "mid" }));
  // board face: inset groove, corner screws, label plate
  const g = (u, z) => at(wp(u, BOARD.s1 + 0.05, z));
  out.push(L(k.pathOf([g(-34, BOARD.z0 + 4), g(34, BOARD.z0 + 4), g(34, BOARD.z1 - 4), g(-34, BOARD.z1 - 4)], true), { tone: "faint" }));
  for (const [u, z] of [[-31, BOARD.z0 + 7], [31, BOARD.z0 + 7], [-31, BOARD.z1 - 7], [31, BOARD.z1 - 7]]) {
    const F = G.frameOf(wp(u, BOARD.s1, z), A3, U3, Z3);
    out.push(`<path class="anat-screw" d="${G.circleOf(F, 0.05, 1.7, P, 16)}"/>`);
    out.push(L(k.pathOf([at(G.pointOf(F, 0.06, 1.2, 0.7)), at(G.pointOf(F, 0.06, 1.2, 0.7 + Math.PI))]), { tone: "lo" }));
  }
  return out.join("");
}

function shutter() {
  const out = [];
  out.push(S(G.disc(BOARD.s1, BOARD.s1 + 2, HOUSING.r + 3, LF, P), { tone: "mid" })); // retaining ring
  out.push(S(G.disc(HOUSING.s0 + 2, HOUSING.s1, HOUSING.r, LF, P), { tone: "mid", inner: L(G.arcOf(LF, 7, HOUSING.r, P), { tone: "faint" }) }));
  // cocking lever (top right) and sync post (bottom)
  const lever = G.frameOf(onFace(6, HOUSING.r - 1, -0.55), G.radialOf(LF, -0.55), A3, G.tangentOf(LF, -0.55));
  out.push(S(G.prismOf(lever, [[-1.4, -1.6], [1.4, -1.6], [1.4, 1.6], [-1.4, 1.6]], 0, 9, P), { tone: "hi" }));
  out.push(S(G.disc(0, 2.4, 2.2, G.frameOf(onFace(6, HOUSING.r + 8, -0.55), A3, U3, Z3), P), { tone: "hi" }));
  const sync = G.frameOf(onFace(HOUSING.s1, HOUSING.r - 4, -Math.PI / 2 - 0.5), A3, U3, Z3);
  out.push(S(G.disc(0, 4, 1.8, sync, P), { tone: "mid" }));
  // speed ring with ticks; a scale is printed text, so its ticks start on the ring rim
  out.push(S(G.ringBand(RING.s0, RING.s1, RING.rIn, RING.rOut, LF, P), { tone: "hi" }));
  const ticks = [];
  for (let i = 0; i <= 18; i++) {
    const ang = Math.PI * (0.15 + i * 0.04);
    const major = i % 3 === 0;
    ticks.push(k.pathOf([at(onFace(RING.s1 + 0.05, RING.rOut - 0.6, ang)), at(onFace(RING.s1 + 0.05, RING.rOut - (major ? 4.2 : 2.6), ang))]));
  }
  out.push(L(ticks.join(""), { tone: "mid" }));
  out.push(L(G.circleOf(LF, RING.s1 + 0.05, RING.rIn + 1.4, P, 64), { tone: "lo" }));
  // aperture scale + pointer on the lower rim
  for (let i = 0; i < 7; i++) {
    const ang = -Math.PI * (0.3 + i * 0.065);
    out.push(L(k.pathOf([at(onFace(RING.s1 + 0.05, RING.rOut - 0.6, ang)), at(onFace(RING.s1 + 0.05, RING.rOut - 2.2, ang))]), { tone: "lo" }));
  }
  out.push(D([at(onFace(RING.s1 + 0.05, RING.rOut - 5.6, -Math.PI * 0.43))], { size: 0.8, tone: "hi" }));
  // aperture well behind the blades (rear cell glass)
  out.push(`<path class="anat-glass" d="${G.circleOf(LF, IRIS_S - 0.6, RING.rIn, P, 64)}"/>`);
  out.push(L(G.circleOf(LF, IRIS_S - 1.2, 12, P, 48), { tone: "faint" }));
  out.push(`<path class="iso-line" data-tone="mid" style="opacity:.55" d="${k.pathOf(Array.from({ length: 12 }, (_, i) => at(onFace(IRIS_S - 1, 8.5, 2.1 + i * 0.07))))}"/>`);
  return out.join("");
}

function releasePost() {
  // cable-release socket on top of the housing; the plunger is the lit part
  const top = onFace(6, HOUSING.r, Math.PI / 2);
  const out = [];
  out.push(S(k.cylinder(top[0], top[1], 3.8, top[2] - 2, 4, P, 24), { tone: "mid" }));
  out.push(L(k.knurl(top[0], top[1], 3.8, top[2] - 1.5, top[2] + 1.6, 20, P), { tone: "lo" }));
  return out.join("");
}
function plunger() {
  const top = onFace(6, HOUSING.r, Math.PI / 2);
  return `<g class="anat-accent-wrap">${S(k.cylinder(top[0], top[1], 1.6, top[2] + 2, 4, P, 18), { tone: "lit", className: "anat-accent", crease: "none" })}${S(k.cylinder(top[0], top[1], 2.8, top[2] + 6, 1.6, P, 20), { tone: "lit", className: "anat-accent" })}</g>`;
}

export function buildLens(outFile) {
  writeArt(outFile, "lens shutter", {
    W,
    H,
    CAM: camOf(P),
    BACK: base() + stand() + shutter(),
    RELEASE: releasePost(),
    PLUNGER: plunger(),
    GEO: { o: LF.o, a: LF.a, u: LF.u, v: LF.v, irisS: IRIS_S, irisR: IRIS_R, ringIn: RING.rIn },
  });
}
