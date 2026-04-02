import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const cliDate = process.argv[2];
const isoDate = cliDate && /^\d{4}-\d{2}-\d{2}$/.test(cliDate)
  ? cliDate
  : new Date().toISOString().slice(0, 10);

const parsedDate = new Date(`${isoDate}T00:00:00`);
if (Number.isNaN(parsedDate.getTime())) {
  console.error('Invalid date. Use YYYY-MM-DD');
  process.exit(1);
}

const thaiDate = new Intl.DateTimeFormat('th-TH-u-ca-gregory', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(parsedDate);

const targets = [
  path.join(projectRoot, 'index.html'),
  path.join(projectRoot, 'sitemap.xml'),
  path.join(projectRoot, 'llms.txt'),
  path.join(projectRoot, 'llms-full.txt'),
  path.join(projectRoot, 'data/admission.json'),
  path.join(projectRoot, 'data/program-overview.json'),
];

for (const targetPath of targets) {
  if (!fs.existsSync(targetPath)) {
    console.warn(`Skip missing file: ${path.relative(projectRoot, targetPath)}`);
    continue;
  }

  const original = fs.readFileSync(targetPath, 'utf8');
  let updated = original;

  if (targetPath.endsWith('index.html')) {
    updated = updated
      .replace(/"dateModified": "\d{4}-\d{2}-\d{2}"/g, `"dateModified": "${isoDate}"`)
      .replace(/dateModified: '\d{4}-\d{2}-\d{2}'/g, `dateModified: '${isoDate}'`)
      .replace(/<time datetime="\d{4}-\d{2}-\d{2}">[^<]+<\/time>/, `<time datetime="${isoDate}">${thaiDate}</time>`);
  }

  if (targetPath.endsWith('sitemap.xml')) {
    updated = updated.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/, `<lastmod>${isoDate}</lastmod>`);
  }

  if (targetPath.endsWith('llms.txt') || targetPath.endsWith('llms-full.txt')) {
    updated = updated.replace(/Last reviewed: \d{4}-\d{2}-\d{2}/g, `Last reviewed: ${isoDate}`);
  }

  if (targetPath.endsWith('data/admission.json') || targetPath.endsWith('data/program-overview.json')) {
    updated = updated.replace(/"lastUpdated": "\d{4}-\d{2}-\d{2}"/, `"lastUpdated": "${isoDate}"`);
  }

  if (updated !== original) {
    fs.writeFileSync(targetPath, updated, 'utf8');
    console.log(`Updated: ${path.relative(projectRoot, targetPath)}`);
  } else {
    console.log(`No changes: ${path.relative(projectRoot, targetPath)}`);
  }
}

console.log(`Done. Synced SEO/GEO freshness to ${isoDate}`);
