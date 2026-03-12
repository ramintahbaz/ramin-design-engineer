'use client';

import { useEffect, useState } from 'react';

const GITHUB_USERNAME = 'ramintahbaz23';
const GITHUB_REPO = 'ramin-design-engineer';
const REPO_URL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}`;
const COMMITS_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/commits?per_page=1`;

type CommitInfo = {
  sha: string;
  date: string;
  additions: number;
  deletions: number;
};

function formatTimeAgo(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return 'Last commit just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `Last commit ${min} minute${min === 1 ? '' : 's'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `Last commit ${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  return `Last commit ${day} day${day === 1 ? '' : 's'} ago`;
}

function formatWithCommas(n: number): string {
  return n.toLocaleString();
}

export default function GitHubCommitBadge() {
  const [info, setInfo] = useState<CommitInfo | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCommit() {
      try {
        const listRes = await fetch(COMMITS_URL);
        if (!listRes.ok) return;
        const list = await listRes.json();
        const first = Array.isArray(list) && list[0];
        if (!first) return;
        const sha = (first.sha as string).slice(0, 7);
        const date = (first.commit?.author?.date as string) || '';

        const commitRes = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/commits/${first.sha}`
        );
        if (!commitRes.ok) return;
        const commitData = await commitRes.json();
        const stats = commitData.stats ?? {};
        const additions = typeof stats.additions === 'number' ? stats.additions : 0;
        const deletions = typeof stats.deletions === 'number' ? stats.deletions : 0;

        if (!cancelled) {
          setInfo({ sha, date, additions, deletions });
        }
      } catch {
        if (!cancelled) setInfo(null);
      }
    }

    fetchCommit();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!info) return null;

  const timeAgo = formatTimeAgo(info.date);
  const delStr = formatWithCommas(info.deletions);
  const addStr = formatWithCommas(info.additions);

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        padding: 0,
        fontFamily: 'var(--font-geist-mono), monospace',
        fontSize: 11,
        color: 'rgba(255,255,255,0.75)',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: 'inherit' }}>{info.sha}</span>
      <span style={{ margin: '0 6px', opacity: 0.6 }}>·</span>
      <span style={{ color: 'rgba(248,113,113,0.95)' }}>-{delStr}</span>
      <span style={{ margin: '0 2px', opacity: 0.6 }}> </span>
      <span style={{ color: 'rgba(134,239,172,0.95)' }}>+{addStr}</span>
      <span style={{ margin: '0 6px', opacity: 0.6 }}>·</span>
      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{timeAgo}</span>
    </a>
  );
}
