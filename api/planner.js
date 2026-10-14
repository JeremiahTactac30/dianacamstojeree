// Vercel serverless function: saves and loads the planner data.
// Needs three environment variables in Vercel:
//   PLANNER_PASSCODE            the passcode you choose
//   KV_REST_API_URL / KV_REST_API_TOKEN   (added for you when you connect Upstash Redis)
//   (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are also accepted)
const crypto = require('crypto');

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const HASH_KEY = 'wedding-planner:sections';
const SECTIONS = ['meta', 'mood', 'venues', 'vendors', 'budget', 'guests', 'tables', 'tasks',
  'events', 'emergency', 'outfits', 'timeline', 'playlist', 'photo'];

async function redis(command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || 'redis error');
  return j.result;
}

function samePasscode(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const passcode = process.env.PLANNER_PASSCODE;
  if (!passcode || !REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ error: 'not_configured' });
  }
  if (!samePasscode(req.headers['x-passcode'] || '', passcode)) {
    return res.status(401).json({ error: 'bad_passcode' });
  }
  try {
    if (req.method === 'GET') {
      const flat = (await redis(['HGETALL', HASH_KEY])) || [];
      const sections = {};
      for (let i = 0; i < flat.length; i += 2) {
        try { sections[flat[i]] = JSON.parse(flat[i + 1]); } catch (e) { /* skip bad entry */ }
      }
      return res.status(200).json({ sections });
    }
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const incoming = body.sections || {};
      const t = Date.now();
      for (const name of Object.keys(incoming)) {
        if (SECTIONS.indexOf(name) < 0) continue;
        const value = JSON.stringify({ v: incoming[name], t: t });
        if (value.length > 900000) continue;
        await redis(['HSET', HASH_KEY, name, value]);
      }
      return res.status(200).json({ t: t });
    }
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'server_error' });
  }
};
