#!/usr/bin/env node

/**
 * Sound Library CLI (sound bits)
 *
 * Add zero-dependency procedural sounds directly to your project:
 *   npx sound-library add <sound-name>
 *   npx sound-library add tap chime pop
 *   npx sound-library add all
 *   npx sound-library list
 *   npx sound-library init
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { SOUNDS_DATA } from "./sounds-data.mjs";

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  orange: "\x1b[38;2;255;55;0m",
};

function log(msg) {
  console.log(msg);
}

function success(msg) {
  log(`${COLORS.green}✓${COLORS.reset} ${msg}`);
}

function warn(msg) {
  log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`);
}

function error(msg) {
  log(`${COLORS.red}✗${COLORS.reset} ${msg}`);
}

function toPascal(str) {
  return str
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

function listSounds() {
  log("");
  log(`${COLORS.bold}${COLORS.orange}Sound Bits${COLORS.reset} — Available procedural sounds (${SOUNDS_DATA.length}):`);
  log("");

  const categories = {};
  for (const s of SOUNDS_DATA) {
    const cat = s.category || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(s);
  }

  for (const [cat, sounds] of Object.entries(categories)) {
    log(`  ${COLORS.orange}${COLORS.bold}${cat}${COLORS.reset}`);
    for (const s of sounds) {
      log(`    ${COLORS.cyan}${s.name.padEnd(20)}${COLORS.reset} ${COLORS.dim}${s.title || ""}${COLORS.reset}`);
    }
    log("");
  }
}

function initSoundsManager(outDir) {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const managerCode = `// Procedural Web Audio API sound manager
// Zero runtime dependencies.

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}
`;

  const targetFile = join(outDir, "index.ts");
  writeFileSync(targetFile, managerCode);
  success(`Created central audio manager at ${COLORS.cyan}lib/sounds/index.ts${COLORS.reset}`);
}

function addSounds(names) {
  const outDir = join(process.cwd(), "lib", "sounds");

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
    success(`Created ${COLORS.cyan}lib/sounds/${COLORS.reset}`);
  }

  const soundsToAdd = names.includes("all")
    ? SOUNDS_DATA.map((s) => s.name)
    : names;

  const added = [];

  for (const name of soundsToAdd) {
    const found = SOUNDS_DATA.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );

    if (!found) {
      warn(`Sound "${name}" not found in library catalog. Run \`npx sound-library list\` to view all.`);
      continue;
    }

    const filePath = join(outDir, `${found.name}.ts`);
    const fileContent = `// Procedural sound: ${found.title} (${found.name})
// Category: ${found.category}
// Zero external dependencies. Uses native Web Audio API.

${found.code}
`;

    writeFileSync(filePath, fileContent);
    success(`Added ${COLORS.cyan}lib/sounds/${found.name}.ts${COLORS.reset}`);
    added.push(found.name);
  }

  if (added.length > 0) {
    log("");
    log(`${COLORS.bold}Import and trigger in any component:${COLORS.reset}`);
    log(
      `${COLORS.dim}  import { play${toPascal(added[0])} } from './lib/sounds/${added[0]}';${COLORS.reset}`
    );
    log(`${COLORS.dim}  <button onClick={play${toPascal(added[0])}}>Click Me</button>${COLORS.reset}`);
    log("");
  }
}

// --- CLI Entrypoint ---

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "help" || command === "--help" || command === "-h") {
  log("");
  log(`${COLORS.bold}${COLORS.orange}sound-library${COLORS.reset} — Procedural micro-UX audio for your app`);
  log("");
  log(`  ${COLORS.cyan}npx sound-library add <name>${COLORS.reset}         Add a single sound (e.g. tap, chime, pop)`);
  log(`  ${COLORS.cyan}npx sound-library add tap pop bell${COLORS.reset}   Add multiple sounds`);
  log(`  ${COLORS.cyan}npx sound-library add all${COLORS.reset}            Add all 45+ sounds`);
  log(`  ${COLORS.cyan}npx sound-library list${COLORS.reset}               List all available sounds`);
  log(`  ${COLORS.cyan}npx sound-library init${COLORS.reset}               Initialize audio manager at lib/sounds/index.ts`);
  log("");
  process.exit(0);
}

if (command === "list") {
  listSounds();
} else if (command === "init") {
  const outDir = join(process.cwd(), "lib", "sounds");
  initSoundsManager(outDir);
} else if (command === "add") {
  const names = args.slice(1);
  if (names.length === 0) {
    error("Specify at least one sound name. Run `npx sound-library list` to see all options.");
    process.exit(1);
  }
  addSounds(names);
} else {
  error(`Unknown command "${command}". Run \`npx sound-library --help\` for usage.`);
  process.exit(1);
}
