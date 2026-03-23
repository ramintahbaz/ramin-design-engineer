/**
 * Replace local /videos/... and /images/... URLs with Vercel Blob URLs using scripts/video-blob-urls.json.
 * Only keys under videos/ or images/ are applied (paths starting with those prefixes).
 *
 * Usage: npx tsx scripts/update-video-paths.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const MAP_PATH = resolve(process.cwd(), 'scripts', 'video-blob-urls.json');

const TARGET_FILES = [
  'lib/work-items.ts',
  'components/NeuralPortfolio.tsx',
  'components/MobileVideoPreloader.tsx',
  'components/ai-document-verification-demos/AIDocVerificationEmbed.tsx',
  'components/visual-system-hover-demos/VisualSystemHoverEmbed.tsx',
  'app/craft/page.tsx',
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Public URL path: / + encodeURIComponent each segment. */
function encodedPublicPath(relFromPublic: string): string {
  const rel = relFromPublic.replace(/^\/+/, '');
  return '/' + rel.split('/').map((seg) => encodeURIComponent(seg)).join('/');
}

function main() {
  const raw = readFileSync(MAP_PATH, 'utf8');
  const map: Record<string, string> = JSON.parse(raw);

  const byUrl = new Map<string, Set<string>>();
  for (const [k, url] of Object.entries(map)) {
    if (!k.startsWith('videos/') && !k.startsWith('images/')) continue;
    if (!byUrl.has(url)) byUrl.set(url, new Set());
    byUrl.get(url)!.add(k);
  }

  type Row = { path: string; url: string };
  const rows: Row[] = [];
  for (const [url, keys] of byUrl) {
    for (const relKey of keys) {
      const path = encodedPublicPath(relKey);
      if (!path.startsWith('/videos/') && !path.startsWith('/images/')) continue;
      rows.push({ path, url });
    }
  }
  rows.sort((a, b) => b.path.length - a.path.length);

  /**
   * Only replace local public paths (/videos/..., /images/...), never a path segment that
   * already belongs to a full http(s) URL. Otherwise `https://host/videos/x` would match
   * `/videos/x` again and prepend a second blob URL.
   */
  const localPathOnlyPrefix = '(?<!https?:\\/\\/[^\\/]+)';

  const patterns = rows.map(({ path, url }) => ({
    re: new RegExp(
      localPathOnlyPrefix + escapeRegex(path) + '(?:\\?v=\\d+)?',
      'g',
    ),
    url,
  }));

  for (const rel of TARGET_FILES) {
    const filePath = resolve(process.cwd(), rel);
    let text = readFileSync(filePath, 'utf8');
    const before = text;
    for (const { re, url } of patterns) {
      text = text.replace(re, url);
    }
    writeFileSync(filePath, text, 'utf8');
    console.log(rel, before === text ? '(no changes)' : '(updated)');
  }
}

main();
