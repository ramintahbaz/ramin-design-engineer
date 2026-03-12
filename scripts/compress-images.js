#!/usr/bin/env node

/**
 * Image Compression Script
 * Compresses JPG/PNG under public/images that are over MAX_SIZE_KB for web.
 *
 * Usage: node scripts/compress-images.js
 * Requires: npm install --save-dev sharp
 */

const fs = require('fs');
const path = require('path');

const MAX_SIZE_KB = 500;
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

function getAllImages(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) getAllImages(full, list);
    else if (/\.(jpg|jpeg|png)$/i.test(e.name)) list.push(full);
  }
  return list;
}

function getSizeKB(filePath) {
  return fs.statSync(filePath).size / 1024;
}

async function compressWithSharp(sharp, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const sizeKB = getSizeKB(filePath);
  if (sizeKB <= MAX_SIZE_KB) return { filePath, skipped: true, sizeKB };

  const buffer = fs.readFileSync(filePath);
  let pipeline = sharp(buffer);
  const meta = await pipeline.metadata();
  const width = meta.width || 1920;
  const maxWidth = width > 1600 ? 1600 : width;

  if (ext === '.png') {
    pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 });
  } else {
    pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true });
  }

  const out = await pipeline.toBuffer();
  const newSizeKB = out.length / 1024;
  if (newSizeKB >= sizeKB) return { filePath, skipped: true, sizeKB };
  fs.writeFileSync(filePath, out);
  return { filePath, sizeKBBefore: sizeKB, sizeKBAfter: newSizeKB };
}

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('Run: npm install --save-dev sharp');
    process.exit(1);
  }

  const files = getAllImages(IMAGES_DIR);
  const over = files
    .map((f) => ({ path: f, sizeKB: getSizeKB(f) }))
    .filter(({ sizeKB }) => sizeKB > MAX_SIZE_KB)
    .sort((a, b) => b.sizeKB - a.sizeKB);

  if (over.length === 0) {
    console.log('No images over %d KB in public/images.', MAX_SIZE_KB);
    return;
  }

  console.log('Compressing %d images over %d KB:\n', over.length, MAX_SIZE_KB);
  for (const { path: filePath, sizeKB } of over) {
    try {
      const rel = path.relative(process.cwd(), filePath);
      const result = await compressWithSharp(sharp, filePath);
      if (result.skipped) {
        console.log('  (unchanged) %s  %.0f KB', rel, sizeKB);
      } else {
        console.log('  %s  %s KB → %s KB', rel, Math.round(result.sizeKBBefore), Math.round(result.sizeKBAfter));
      }
    } catch (err) {
      console.error('  ERROR %s:', filePath, err.message);
    }
  }
}

main();
