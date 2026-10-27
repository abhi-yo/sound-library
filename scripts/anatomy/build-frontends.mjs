// Builds the static geometry for the /browse anatomy figures (06–09).
// Run: node scripts/anatomy/build-frontends.mjs [coin|lens|typewriter|padlock]
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCoin } from "./coin.mjs";
import { buildLens } from "./lens.mjs";
import { buildTypewriter } from "./typewriter.mjs";
import { buildPadlock } from "./padlock.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../../components/frontends/browse/anatomy");
const only = process.argv[2];
if (!only || only === "coin") buildCoin(join(OUT, "coin.art.ts"));
if (!only || only === "lens") buildLens(join(OUT, "lens.art.ts"));
if (!only || only === "typewriter") buildTypewriter(join(OUT, "typewriter.art.ts"));
if (!only || only === "padlock") buildPadlock(join(OUT, "padlock.art.ts"));
