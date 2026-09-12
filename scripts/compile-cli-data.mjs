import fs from 'node:fs';
import path from 'node:path';

const dir = 'content/docs/sounds';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') && f !== 'index.mdx');

const sounds = [];
for (const file of files) {
  const category = file.replace('.mdx', '');
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const sections = content.split(/### /);
  for (const sec of sections.slice(1)) {
    const headerMatch = sec.match(/^([^\(]+)\(`([^`]+)`\)/);
    if (!headerMatch) continue;
    const title = headerMatch[1].trim();
    const name = headerMatch[2].trim();
    const codeMatch = sec.match(/```ts[^\n]*\n([\s\S]*?)```/);
    if (codeMatch) {
      sounds.push({
        name,
        title,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        code: codeMatch[1].trim(),
      });
    }
  }
}

console.log(`Found ${sounds.length} sounds in docs MDX.`);

const output = `// Auto-generated sound entries for Sound Library CLI
export const SOUNDS_DATA = ${JSON.stringify(sounds, null, 2)};
`;

fs.writeFileSync('cli/sounds-data.mjs', output);
console.log('Wrote cli/sounds-data.mjs successfully!');
