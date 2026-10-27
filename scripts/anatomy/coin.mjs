// 06 Coin mech: a vending coin acceptor on a bench plate, side cover off.
// What moves: a quarter goes into the slot, drops inside the housing, rolls
// out down the chute, trips the coin-switch lever (which drives the counter
// wheels on the front plate) and falls onto the stack in the cash box.
import { k, G, S, L, D, face, hole, roundRect3, screwTop, screwSide, camOf, writeArt, EL } from "./common.mjs";

const W = 320;
const H = 236;

const BASE = { x: -44, y: -72, w: 78, d: 154, r: 6 };
const BASE_H = 6;
const FOOT_H = 4;
const BODY = { x: -30, y: -62, w: 40, d: 62, r: 2 };
const BODY_H = 88;
const PANEL = { x: 10, y: -64, w: 7, d: 66, r: 1.5 };
const PANEL_H = 96;
const FX = PANEL.x + PANEL.w; // panel front face (x)
const SLOT = { y: -31, x: 13.5, l: 22, w: 3 }; // slot cut in the top bezel
const BEZEL = { x: 8, y: SLOT.y - 14, w: 11, d: 28, r: 1.5 };
const BEZEL_TOP = PANEL_H + 5;
const RETURN = [FX, -31, 18];
const COUNTER = { y: -31, z: 38, w: 30, h: 11 };

const CH_O = [-10, 0, 72];
const CH_END = [-10, 50, 37];
const CH_A = G.unit3(G.sub3(CH_END, CH_O));
const CH_U = [1, 0, 0];
const CH_V = G.unit3(G.cross3(CH_U, CH_A)); // up-ish, perpendicular to the chute
const CH_LEN = G.len3(G.sub3(CH_END, CH_O));
const COIN_R = 8;
const COIN_T = 1.6;

const BOX = { x: -22, y: 46, w: 40, d: 30, r: 1.5 };
const BOX_H = 15;
const LIP_H = 5; // low front lip: the stack shows over it
const STACK = [-2, 61];
const STACK_MAX = 8;

const P = k.fitProjection(
  [...k.boxCorners(BASE, -BASE_H - FOOT_H, 0), [BODY.x, BODY.y, BODY_H], [FX, PANEL.y, PANEL_H], [SLOT.x, SLOT.y, BEZEL_TOP + COIN_R * 1.45 + 2], [BOX.x, BOX.y + BOX.d, BOX_H]],
  W,
  H,
  { pad: 8, azimuth: 0, elevation: EL },
);
const at = (p) => k.iso(p, P);

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`];
  const feet = k.corners(BASE, 12).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P));
  for (const [x, y] of feet) {
    out.push(S(k.cylinder(x, y, 5.5, -BASE_H - FOOT_H, FOOT_H, P, 24), { tone: "mid" }));
  }
  out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.2), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 4), 0, P), { tone: "faint" }));
  for (const [x, y] of k.corners(BASE, 8)) out.push(screwTop(x, y, 0, P));
  // ruler strip along the near long edge
  const strip = { x: BASE.x + BASE.w - 9, y: BASE.y + 14, w: 6, d: BASE.d - 28, r: 0.8 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.y + 3, strip.y + strip.d - 3, 4, 5, strip.x + strip.w, 0.6, [-1.8, -3.4], P, "y");
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  return out.join("");
}

function body() {
  const out = [];
  out.push(S(k.slabOf(BODY, 0, BODY_H, P, 4, 0.8), {
    tone: "mid",
    inner: [16, 60, 80].map((z) => L(k.sideSeam(BODY, z, P, 4), { tone: "faint" })).join(""),
  }));
  // top: screws and a cover plate
  const cover = k.insetPlan(BODY, 5);
  out.push(S(k.slabOf(cover, BODY_H, 1.2, P, 3, 0.4), { tone: "mid" }));
  for (const [x, y] of k.corners(cover, 3)) out.push(screwTop(x, y, BODY_H + 1.2, P, 1.4));
  // exit port on the +y face, where the coin comes out
  out.push(hole(roundRect3([CH_O[0], 0.05, CH_O[2] + 8], 14, 21, 3, "x"), P, { tone: "mid" }));
  // vent slots on the +y face
  for (let i = 0; i < 4; i++) {
    const z = 22 + i * 7;
    out.push(hole(roundRect3([-10, 0.05, z], 22, 2.6, 1.3, "x", 3), P));
  }
  // chute lip around the port
  out.push(face([[-17, 0, 70.5], [-3, 0, 70.5], [-3, 3, 70.5], [-17, 3, 70.5]], P, { tone: "mid" }));
  return out.join("");
}

function panel() {
  const out = [];
  out.push(S(k.slabOf(PANEL, 0, PANEL_H, P, 3, 0.6), { tone: "mid" }));
  const f = (y, z) => [FX + 0.05, y, z];
  // coin entry: a raised bezel on top of the front plate, slot cut through it
  out.push(S(k.slabOf(BEZEL, PANEL_H, BEZEL_TOP - PANEL_H, P, 3, 0.5), { tone: "hi" }));
  out.push(hole([[SLOT.x - SLOT.w / 2, SLOT.y - SLOT.l / 2, BEZEL_TOP + 0.05], [SLOT.x + SLOT.w / 2, SLOT.y - SLOT.l / 2, BEZEL_TOP + 0.05], [SLOT.x + SLOT.w / 2, SLOT.y + SLOT.l / 2, BEZEL_TOP + 0.05], [SLOT.x - SLOT.w / 2, SLOT.y + SLOT.l / 2, BEZEL_TOP + 0.05]], P, { tone: "mid" }));
  // vent louvres across the upper plate
  for (let i = 0; i < 4; i++) out.push(hole(roundRect3([FX + 0.05, SLOT.y, 64 + i * 6], 30, 2.4, 1.2, "y", 3), P));
  // counter housing with window
  out.push(S(k.slabOf({ x: FX, y: COUNTER.y - COUNTER.w / 2 - 2, w: 2.4, d: COUNTER.w + 4, r: 1 }, COUNTER.z - COUNTER.h / 2 - 2, COUNTER.h + 4, P, 3, 0.4), { tone: "hi" }));
  out.push(hole(roundRect3([FX + 2.45, COUNTER.y, COUNTER.z], COUNTER.w, COUNTER.h, 1, "y", 2), P, { tone: "mid" }));
  // wheel separators
  for (let i = 1; i < 3; i++) {
    const y = COUNTER.y - COUNTER.w / 2 + (COUNTER.w / 3) * i;
    out.push(L(k.pathOf([at([FX + 2.5, y, COUNTER.z - COUNTER.h / 2]), at([FX + 2.5, y, COUNTER.z + COUNTER.h / 2])]), { tone: "lo" }));
  }
  // return button cup
  const F = G.frameAlong([FX, RETURN[1], RETURN[2]], [1, 0, 0]);
  out.push(S(G.disc(0, 1.2, 7, F, P), { tone: "mid" }));
  // corner screws
  for (const [y, z] of [[PANEL.y + 5, 6], [PANEL.y + PANEL.d - 5, 6], [PANEL.y + 5, PANEL_H - 6], [PANEL.y + PANEL.d - 5, PANEL_H - 6]]) {
    out.push(screwSide([FX + 0.05, y, z], P, [1, 0, 0]));
  }
  return out.join("");
}

function returnButton() {
  const F = G.frameAlong([FX + 1.2, RETURN[1], RETURN[2]], [1, 0, 0]);
  return S(G.disc(0, 3.2, 4.6, F, P), { tone: "hi" }) + L(G.circleOf(F, 3.2, 2.6, P, 20), { tone: "lo" });
}

const chutePoint = (s, lift = 0) => G.add3(G.add3(CH_O, G.mul3(CH_A, s)), G.mul3(CH_V, lift));

function chuteBack() {
  const F = G.frameOf(CH_O, CH_A, CH_U, CH_V);
  const out = [];
  // support post + bracket under the lower end
  const post = [2, 40];
  out.push(S(k.cylinder(post[0], post[1], 3.4, 0, 1.2, P, 18), { tone: "mid" }));
  out.push(S(k.cylinder(post[0], post[1], 2, 1.2, 40.5, P, 18), { tone: "mid", crease: "none" }));
  out.push(S(G.prismOf(F, [[-5, -1.4], [5, -1.4], [5, 0], [-5, 0]], 0, CH_LEN, P), { tone: "mid" }));
  out.push(S(G.prismOf(F, [[-6.6, -1.4], [-5, -1.4], [-5, 6.5], [-6.6, 6.5]], 0, CH_LEN, P), { tone: "mid" }));
  return out.join("");
}

function chuteFront() {
  const F = G.frameOf(CH_O, CH_A, CH_U, CH_V);
  const out = [];
  out.push(S(G.prismOf(F, [[5, -1.4], [6.6, -1.4], [6.6, 6.5], [5, 6.5]], 0, CH_LEN, P), { tone: "mid" }));
  // rivets along the near rail
  const rivets = [8, 20, 32, 44, 54].map((s) => at(G.add3(chutePoint(s, 3.5), [6.65, 0, 0])));
  out.push(D(rivets, { size: 0.5, tone: "mid" }));
  // bracket from post to rail
  out.push(S(k.slabOf({ x: -3.4, y: 38, w: 7.4, d: 4, r: 0.6 }, 40.5, 2, P, 2), { tone: "mid" }));
  return out.join("");
}

// coin-switch on the near rail, with its lever reaching into the channel
const SW = { x: -3.4, y: 24, w: 6, d: 9, r: 1 };
const SW_S = 26 / CH_A[1];
const SW_TOP = chutePoint(SW_S)[2] - 4;
const PIVOT = [SW.x + 3, SW.y + 4.5, SW_TOP + 1.2];
function switchBody() {
  const out = [];
  out.push(S(k.slabOf(SW, SW_TOP - 9, 9, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: SW.x + 1.5, y: SW.y + 2.5, w: 3, d: 4, r: 0.6 }, SW_TOP, 1.2, P, 2), { tone: "hi" }));
  out.push(D([at([SW.x + SW.w, SW.y + 2, SW_TOP - 2.5]), at([SW.x + SW.w, SW.y + SW.d - 2, SW_TOP - 6.5])], { size: 0.45, tone: "mid" }));
  return out.join("");
}

// wire from the switch down the post side, across the base, up into the counter
function wire() {
  const pts = [
    [SW.x + SW.w, SW.y + SW.d - 2, SW_TOP - 6],
    [SW.x + SW.w + 3, SW.y + SW.d - 2, SW_TOP - 6],
    [SW.x + SW.w + 3, SW.y + SW.d - 2, 0.6],
    [FX + 6, SW.y + SW.d - 2, 0.6],
    [FX + 6, COUNTER.y + COUNTER.w / 2 + 4, 0.6],
    [FX + 1.2, COUNTER.y + COUNTER.w / 2 + 4, 0.6],
  ].map(at);
  return L(k.pathOf(pts), { tone: "mid" }) + `<path class="iso-line" data-tone="mid" d="${k.pathOf([at([FX + 1.2, COUNTER.y + COUNTER.w / 2 + 4, 0.6]), at([FX + 0.1, COUNTER.y + COUNTER.w / 2 + 4, COUNTER.z - COUNTER.h / 2 - 2])])}"/>` + D([pts[0], at([FX + 0.1, COUNTER.y + COUNTER.w / 2 + 4, COUNTER.z - COUNTER.h / 2 - 2])], { size: 0.9, tone: "hi" });
}

function boxBack() {
  const out = [];
  out.push(S(k.slabOf(BOX, 0, 1.4, P, 3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: BOX.x, y: BOX.y, w: 1.5, d: BOX.d, r: 0.5 }, 1.4, BOX_H - 1.4, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: BOX.x, y: BOX.y, w: BOX.w, d: 1.5, r: 0.5 }, 1.4, BOX_H - 1.4, P, 2), { tone: "mid" }));
  return out.join("");
}
function boxFront() {
  const out = [];
  out.push(S(k.slabOf({ x: BOX.x, y: BOX.y + BOX.d - 1.5, w: BOX.w, d: 1.5, r: 0.5 }, 1.4, BOX_H - 1.4, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: BOX.x + BOX.w - 1.5, y: BOX.y, w: 1.5, d: BOX.d, r: 0.5 }, 1.4, LIP_H, P, 2), { tone: "mid" }));
  // pull handle on the near end
  out.push(S(k.slabOf({ x: BOX.x + BOX.w, y: BOX.y + BOX.d / 2 - 6, w: 2.2, d: 12, r: 0.8 }, 2.6, 2.4, P, 2, 0.3), { tone: "hi" }));
  out.push(D([at([BOX.x + BOX.w, BOX.y + 3, LIP_H - 1]), at([BOX.x + BOX.w, BOX.y + BOX.d - 3, LIP_H - 1])], { size: 0.45, tone: "mid" }));
  return out.join("");
}

function stackCoin(i) {
  const z = 1.4 + i * 1.7;
  const F = G.frameAlong([STACK[0] + ((i * 37) % 5) * 0.25 - 0.5, STACK[1] + ((i * 23) % 5) * 0.25 - 0.5, z], [0, 0, 1]);
  return S(G.disc(0, 1.7, COIN_R, F, P, { steps: 40 }), { tone: "hi" }) + L(G.circleOf(F, 1.7, COIN_R - 1.6, P, 32), { tone: "faint" });
}

// moving coins, built at the origin and moved with translate
function coinAt(axis) {
  const F = G.frameAlong([0, 0, 0], axis);
  const ridges = G.ribsOf(F, -COIN_T / 2, COIN_T / 2, COIN_R, 48, P, { fade: [0.05, 0.5] });
  return `<g class="iso-solid anat-accent">${S(G.disc(-COIN_T / 2, COIN_T / 2, COIN_R, F, P, { steps: 48 }), { tone: "lit", className: "anat-accent" })}</g>` + k.fadedSvg(ridges, { tone: "lo" }) + L(G.circleOf(F, COIN_T / 2, COIN_R - 1.7, P, 40), { tone: "lit", className: "anat-accent-line" });
}

const cam = camOf(P);
const slotClipY = at([SLOT.x, SLOT.y, BEZEL_TOP])[1];
const portClipX = at([CH_O[0], PANEL.y + PANEL.d, 0])[0];
const btn = at([FX + 3, RETURN[1], RETURN[2]]);
const digitMatrices = [0, 1, 2].map((i) => k.sideMatrix([FX + 2.5, COUNTER.y + COUNTER.w / 2 - (COUNTER.w / 3) * (i + 0.5)], COUNTER.z - 2.8, P, "right"));

export function buildCoin(outFile) {
  writeArt(outFile, "coin mech", {
    W,
    H,
    CAM: cam,
    BACK: base() + body() + panel(),
    RETURN_BTN: returnButton(),
    CHUTE_BACK: chuteBack(),
    CHUTE_FRONT: chuteFront(),
    SWITCH: switchBody(),
    WIRE: wire(),
    BOX_BACK: boxBack(),
    BOX_FRONT: boxFront(),
    STACK: Array.from({ length: STACK_MAX }, (_, i) => stackCoin(i)),
    COIN_SLOT: coinAt([1, 0, 0]),
    COIN_ROLL: coinAt([1, 0, 0]),
    GEO: {
      slotY: SLOT.y,
      slotX: SLOT.x,
      slotTop: BEZEL_TOP,
      fx: FX,
      chO: CH_O,
      chA: CH_A,
      chV: CH_V,
      chLen: CH_LEN,
      coinR: COIN_R,
      stack: STACK,
      stackMax: STACK_MAX,
      pivot: PIVOT,
      switchS: SW_S,
      slotClipY,
      portClipX,
      btn: [btn[0] / W, btn[1] / H],
      digitMatrices,
      digitSize: 6.4,
    },
  });
}
