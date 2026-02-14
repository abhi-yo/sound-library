#!/usr/bin/env node

/**
 * sonix CLI — add sounds to your project
 *
 * Usage:
 *   npx sonix add <sound-name>       Add a single sound
 *   npx sonix add <s1> <s2> ...      Add multiple sounds
 *   npx sonix list                   List all available sounds
 *
 * Sounds are fetched from the public registry and written
 * to your project as standalone files — no runtime dependency.
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const REGISTRY_URL =
  process.env.SONIX_REGISTRY ||
  "https://abhi-yo.github.io/sound-library/registry";

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
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

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function listSounds() {
  try {
    const registry = await fetchJSON(`${REGISTRY_URL}/index.json`);
    log("");
    log(`${COLORS.bold}Available sounds (${registry.sounds.length}):${COLORS.reset}`);
    log("");

    const categories = {};
    for (const s of registry.sounds) {
      const cat = s.category || "other";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(s);
    }

    for (const [cat, sounds] of Object.entries(categories)) {
      log(`  ${COLORS.cyan}${cat}${COLORS.reset}`);
      for (const s of sounds) {
        const badge = s.type === "mp3" ? `${COLORS.yellow}mp3${COLORS.reset}` : `${COLORS.dim}web audio${COLORS.reset}`;
        log(`    ${s.name.padEnd(24)} ${badge}  ${COLORS.dim}${s.description}${COLORS.reset}`);
      }
      log("");
    }
  } catch (err) {
    error(`Could not fetch registry: ${err.message}`);
    process.exit(1);
  }
}

async function addSounds(names) {
  const outDir = join(process.cwd(), "lib", "sounds");

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
    success(`Created ${COLORS.cyan}lib/sounds/${COLORS.reset}`);
  }

  for (const name of names) {
    try {
      const sound = await fetchJSON(`${REGISTRY_URL}/sounds/${name}.json`);

      for (const file of sound.files) {
        const filePath = join(outDir, file.name);
        writeFileSync(filePath, file.content + "\n");
        success(`Added ${COLORS.cyan}lib/sounds/${file.name}${COLORS.reset}`);
      }

      if (sound.assets?.length) {
        warn(
          `${name} requires asset files: ${sound.assets.join(", ")} — download them from the website and put in your public/ folder.`
        );
      }
    } catch (err) {
      error(`Could not add "${name}": ${err.message}`);
    }
  }

  log("");
  log(`${COLORS.dim}Import and use:${COLORS.reset}`);
  log(`${COLORS.dim}  import { play${toPascal(names[0])} } from './lib/sounds/${names[0]}';${COLORS.reset}`);
  log("");
}

function toPascal(str) {
  return str
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

// --- Main ---

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "help" || command === "--help") {
  log("");
  log(`${COLORS.bold}sonix${COLORS.reset} — UI sound effects for your app`);
  log("");
  log(`  ${COLORS.cyan}npx sonix list${COLORS.reset}              List all sounds`);
  log(`  ${COLORS.cyan}npx sonix add <name>${COLORS.reset}        Add a sound to your project`);
  log(`  ${COLORS.cyan}npx sonix add pop swoosh${COLORS.reset}    Add multiple sounds`);
  log("");
  process.exit(0);
}

if (command === "list") {
  await listSounds();
} else if (command === "add") {
  const names = args.slice(1);
  if (names.length === 0) {
    error("Specify at least one sound name. Run `npx sonix list` to see options.");
    process.exit(1);
  }
  await addSounds(names);
} else {
  error(`Unknown command: ${command}. Run \`npx sonix --help\`.`);
  process.exit(1);
}
