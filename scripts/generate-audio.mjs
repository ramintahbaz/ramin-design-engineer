import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
dotenv.config({ path: path.join(rootDir, '.env.local') })

const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'

const text = `In 1961, IBM installed one of its first commercial computers inside an American office. For the people who worked there, it was not introduced as a helpful tool. It arrived as a signal. A machine that could calculate faster than any human raised immediate questions about replacement, relevance, and control. Entire job categories were suddenly uncertain. And in many cases, they disappeared.

Every major technological shift begins the same way: with excitement from the people building it, and anxiety from the people living alongside it.

To the workers of 1961, this moment felt unprecedented. Computers were genuinely new. There was no playbook, no established pattern for how to integrate machines that could perform cognitive work. The complexity was real, both technical and social. The fear was rational.

And yet, looking back, we can see it wasn't the first time. The industrial revolution introduced machines that replaced physical labor. The telegraph compressed time and distance in ways that felt destabilizing. Each wave of automation sparked the same questions: What happens to human work? What gets lost? Who controls these new systems?

The pattern repeats because the pattern is structural.

New forms of compute arrive. They perform tasks that were previously human. They operate at speeds and scales that feel overwhelming. The people building them see possibility. The people living alongside them see uncertainty. And for a period, sometimes brief, sometimes generational, there is friction.

Eventually, the technology becomes normalized. Not because the anxiety was irrational, but because society adapts. New roles emerge. Systems become more predictable. The thing that once felt incomprehensible becomes mundane.

Today, we are at the beginning of another cycle. Artificial intelligence and robotics are no longer confined to labs or industrial settings. They are moving into homes, workplaces, and public spaces. And once again, the dominant conversation is about displacement. Will machines replace workers? Will they remove agency? Will they make human roles obsolete?

These questions echo almost perfectly those asked sixty years ago.

To anyone living through this moment, it feels uniquely complex. And it is. AI operates differently than previous forms of compute. It learns, adapts, and makes decisions in ways that are less predictable than deterministic code. The opacity is real. The uncertainty is real.

But the shape of the moment is familiar. What we're experiencing is not a rupture. It's a repetition. The technology is new. The human response is not.

History suggests that this friction is temporary, not because the concerns are unfounded, but because they always resolve, one way or another. Society adjusts. Systems evolve. The boundaries between human work and machine work shift, as they always have.

We've Been Here Before.`

/**
 * Derive word-level timings from character-level alignment.
 * Uses the same word boundaries as the UI: split on whitespace, non-empty tokens = words.
 */
function wordsFromCharacterAlignment(alignment) {
  if (!alignment?.characters?.length || !alignment.character_start_times_seconds?.length || !alignment.character_end_times_seconds?.length) {
    return []
  }
  const chars = alignment.characters
  const starts = alignment.character_start_times_seconds
  const ends = alignment.character_end_times_seconds
  const text = chars.join('')
  const words = text.split(/(\s+)/).filter((part) => /\S/.test(part))
  const result = []
  let charIdx = 0
  for (const word of words) {
    while (charIdx < text.length && /\s/.test(text[charIdx])) charIdx++
    if (charIdx >= text.length) break
    const startIdx = charIdx
    charIdx += word.length
    const endIdx = Math.min(charIdx - 1, ends.length - 1)
    result.push({
      word,
      startTime: starts[startIdx] ?? 0,
      endTime: ends[endIdx] ?? 0,
    })
  }
  return result
}

console.log('Generating audio for essay-01 (all-in-one with-timestamps)...')

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
  },
  body: JSON.stringify({
    text,
    model_id: 'eleven_multilingual_v2',
    output_format: 'mp3_44100_128',
  }),
})

if (!res.ok) {
  const err = await res.json().catch(() => ({ detail: res.statusText }))
  console.error('ElevenLabs with-timestamps failed:', err.detail || err)
  process.exit(1)
}

const data = await res.json()
const audioBase64 = data.audio_base64
const alignment = data.alignment ?? data.normalized_alignment

if (!audioBase64) {
  console.error('No audio_base64 in response')
  process.exit(1)
}

const buffer = Buffer.from(audioBase64, 'base64')
fs.mkdirSync(path.join(rootDir, 'public/audio'), { recursive: true })
fs.writeFileSync(path.join(rootDir, 'public/audio/essay-01.mp3'), buffer)
console.log('✓ essay-01.mp3 saved')

let wordTimings
if (alignment) {
  wordTimings = wordsFromCharacterAlignment(alignment)
  fs.writeFileSync(
    path.join(rootDir, 'public/audio/essay-01.json'),
    JSON.stringify({ words: wordTimings }, null, 2)
  )
  console.log(`✓ essay-01.json saved (${wordTimings.length} words from character alignment)`)
} else {
  console.warn('No alignment in response — skipping JSON. Re-run with forced alignment fallback if needed.')
}
