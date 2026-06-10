const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const htmlFiles = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      walk(fullPath);
    } else if (item.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

walk(root);

const missing = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const regex = /(?:href|src|window\.location\.href)=['"]([^'"]+)['"]/g;
  let match;

  while ((match = regex.exec(html))) {
    const rawTarget = match[1];
    const target = rawTarget.split('?')[0].split('#')[0];

    if (!target || /^(https?:|mailto:|javascript:|#)/.test(target)) continue;
    if (target.startsWith('{{')) continue;

    const resolved = path.resolve(path.dirname(file), target);
    const candidates = [
      resolved,
      `${resolved}.html`,
      path.join(resolved, 'index.html')
    ];

    if (!candidates.some(fs.existsSync)) {
      missing.push(`${path.relative(root, file)} -> ${rawTarget}`);
    }
  }
}

assert.deepEqual(missing, [], 'all local href/src/window.location.href targets must resolve');
console.log('local link target test passed');
