// Vercel serverless function: saves and loads the planner data.
//
// Owner (sends the passcode): can read everything and save changes.
// Visitor (sends no passcode): can only read the sections listed in PUBLIC_SECTIONS.
//
// Environment variables in Vercel:
//   PLANNER_PASSCODE     required. The owner's passcode.
//   KV_REST_API_URL, KV_REST_API_TOKEN   added for you when you connect Upstash Redis
//   PUBLIC_SECTIONS      optional. Comma list of sections visitors may see.
//                        Default: meta,mood,events,outfits,timeline,playlist,photo,guests,tables
//                        Use "none" to turn view-only off completely.
const crypto = require('crypto');

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const HASH_KEY = 'wedding-planner:sections';
const SECTIONS = ['meta', 'mood', 'venues', 'vendors', 'budget', 'guests', 'tables', 'tasks',
  'events', 'emergency', 'outfits', 'timeline', 'playlist', 'photo'];
const DEFAULT_PUBLIC = 'meta,mood,events,outfits,timeline,playlist,photo,guests,tables';

function publicSections() {
  const raw = (process.env.PUBLIC_SECTIONS === undefined ? DEFAULT_PUBLIC : process.env.PUBLIC_SECTIONS)
    .trim().toLowerCase();
  if (!raw || raw === 'none') return [];
  const list = raw.split(',').map(s => s.trim()).filter(s => SECTIONS.indexOf(s) >= 0);
  if (list.length && list.indexOf('meta') < 0) list.unshift('meta');
  return list;
}

// Removes private details before a visitor sees a section.
function redact(name, value) {
  if (name === 'meta' && value && typeof value === 'object') {
    return { a: value.a, b: value.b, date: value.date, rsvp: value.rsvp };
  }
  if (name === 'outfits' && Array.isArray(value)) {
    return value.map(o => { const c = Object.assign({}, o); delete c.cost; return c; });
  }
  return value;
}

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

async function readAll() {
  const flat = (await redis(['HGETALL', HASH_KEY])) || [];
  const sections = {};
  for (let i = 0; i < flat.length; i += 2) {
    try { sections[flat[i]] = JSON.parse(flat[i + 1]); } catch (e) { /* skip bad entry */ }
  }
  return sections;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const passcode = process.env.PLANNER_PASSCODE;
  if (!passcode || !REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ error: 'not_configured' });
  }
  const given = req.headers['x-passcode'] || '';
  const isOwner = given !== '' && samePasscode(given, passcode);
  if (given !== '' && !isOwner) return res.status(401).json({ error: 'bad_passcode' });

  try {
    if (!isOwner) {
      // Visitor: read-only, only the allowed sections.
      const allowed = publicSections();
      if (req.method !== 'GET' || !allowed.length) {
        return res.status(401).json({ error: 'bad_passcode' });
      }
      const all = await readAll();
      const sections = {};
      allowed.forEach(name => {
        if (all[name] && all[name].v != null) {
          sections[name] = { v: redact(name, all[name].v), t: all[name].t };
        }
      });
      return res.status(200).json({ readOnly: true, allowed: allowed, sections: sections });
    }

    if (req.method === 'GET') {
      return res.status(200).json({ sections: await readAll() });
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
