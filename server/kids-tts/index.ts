// Voice for the Genius Kids Academy app (https://waeil55.github.io/MerolaApp/).
// Same speech as the AI Listen function (OpenAI tts-1, OPENAI_API_KEY secret), but the kids app has no sign-in,
// so instead of a user check it only answers the kids site, caps text length and limits requests per address.
// Deploy: supabase functions deploy kids-tts --no-verify-jwt

const ALLOWED_ORIGINS = [/^https:\/\/waeil55\.github\.io$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/]
const VALID_VOICES = ['alloy', 'ash', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer']
const MAX_CHARS = 600
const RATE_LIMIT = 400 // clips per address per hour (the app saves every clip, so repeats never come back here)
const WINDOW_MS = 60 * 60 * 1000

const hits = new Map<string, number[]>()

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, authorization, apikey, x-client-info',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}

function limited(ip: string) {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (list.length >= RATE_LIMIT) {
    hits.set(ip, list)
    return true
  }
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return false
}

async function speech(apiKey: string, voice: string, input: string) {
  return fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'tts-1', voice, input, response_format: 'mp3', speed: 1 }),
  })
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || ''
  if (!ALLOWED_ORIGINS.some((re) => re.test(origin))) return new Response('Forbidden', { status: 403 })
  const cors = corsHeaders(origin)

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const apiKey = Deno.env.get('OPENAI_API_KEY')
  // A quick check the app makes when it opens, so it knows this voice is ready.
  if (req.method === 'GET') return json({ ok: !!apiKey, model: 'tts-1' }, apiKey ? 200 : 503, cors)
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors)
  if (!apiKey) return json({ error: 'Voice is not set up on the server' }, 503, cors)

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (limited(ip)) return json({ error: 'Too many voice requests. Please try again later.' }, 429, cors)

  let body: { text?: unknown; voice?: unknown }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, cors)
  }
  const text = typeof body.text === 'string' ? body.text.replace(/\s+/g, ' ').trim() : ''
  if (!text) return json({ error: 'Missing text' }, 400, cors)
  if (text.length > MAX_CHARS) return json({ error: `Text is longer than ${MAX_CHARS} characters` }, 400, cors)
  const voice = typeof body.voice === 'string' && VALID_VOICES.includes(body.voice) ? body.voice : 'nova'

  try {
    let res = await speech(apiKey, voice, text)
    // Older voices only on some accounts: fall back to Nova rather than fail.
    if (res.status === 400 && voice !== 'nova') res = await speech(apiKey, 'nova', text)
    if (!res.ok) {
      console.error('OpenAI TTS error:', res.status, await res.text())
      return json({ error: `Voice service error (${res.status})` }, 502, cors)
    }
    return new Response(res.body, {
      headers: { ...cors, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
    })
  } catch (err) {
    console.error('kids-tts failed:', err)
    return json({ error: 'Voice service unavailable' }, 502, cors)
  }
})
