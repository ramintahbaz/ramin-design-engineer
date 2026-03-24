/**
 * Upload all .mp4 / .MP4 under public/ to Cloudflare R2 (S3-compatible API).
 *
 * Requires in .env.local (or .env):
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *
 * Objects are written to bucket `ramin-portfolio-videos`. The S3 API endpoint is
 * `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`. Public URLs in the output
 * JSON use the public CDN base URL (cdn.ramintahbaz.com).
 *
 * Usage: npx tsx scripts/upload-videos.ts
 */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { createReadStream, readdirSync, existsSync, writeFileSync } from 'fs';
import { resolve, join, relative } from 'path';
import { pathToFileURL } from 'url';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const PUBLIC_DIR = resolve(process.cwd(), 'public');
const OUT_JSON = resolve(process.cwd(), 'scripts', 'video-blob-urls.json');

const R2_BUCKET = 'ramin-portfolio-videos';
/** Public base URL for objects (matches site asset URLs). */
const R2_PUBLIC_BASE = 'https://cdn.ramintahbaz.com';

/** Blob key: path relative to public/; spaces/special chars → underscores per segment. */
export function normalizeBlobKey(relPath: string): string {
  const rel = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
  return rel
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_'))
    .join('/');
}

function publicObjectUrl(key: string): string {
  const base = R2_PUBLIC_BASE.replace(/\/$/, '');
  return `${base}/${key.split('/').map(encodeURIComponent).join('/')}`;
}

function* walkMp4(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) yield* walkMp4(full);
    else if (/\.mp4$/i.test(name.name)) yield full;
  }
}

async function main() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error(
      'Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in .env.local'
    );
    process.exit(1);
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const flatMap: Record<string, string> = {};

  for (const abs of walkMp4(PUBLIC_DIR)) {
    const relFromPublic = relative(PUBLIC_DIR, abs).replace(/\\/g, '/');
    const normalizedKey = normalizeBlobKey(relFromPublic);
    const body = createReadStream(abs);

    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: normalizedKey,
        Body: body,
        ContentType: 'video/mp4',
      })
    );

    const url = publicObjectUrl(normalizedKey);
    flatMap[relFromPublic] = url;
    flatMap[normalizedKey] = url;
    console.error(relFromPublic, '→', normalizedKey, '→', url);
  }

  writeFileSync(OUT_JSON, JSON.stringify(flatMap, null, 2), 'utf8');
  console.log('Wrote', OUT_JSON, `(${Object.keys(flatMap).length} keys)`);
}

const isMain =
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
