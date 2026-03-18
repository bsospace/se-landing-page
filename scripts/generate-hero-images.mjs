import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const imagesDir = path.join(projectRoot, 'images');
const outputFile = path.join(projectRoot, 'data', 'hero-images.json');

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);

async function walkImages(directory, collected = []) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await walkImages(absolutePath, collected);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!imageExtensions.has(extension)) {
      continue;
    }

    const relativePath = path.relative(projectRoot, absolutePath).split(path.sep).join('/');
    collected.push(relativePath);
  }

  return collected;
}

async function main() {
  try {
    await fs.access(imagesDir);
  } catch {
    throw new Error('Directory not found: images/');
  }

  const images = await walkImages(imagesDir);
  images.sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

  await fs.writeFile(outputFile, `${JSON.stringify(images, null, 2)}\n`, 'utf8');

  console.log(`Generated ${images.length} hero image(s) into data/hero-images.json`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
