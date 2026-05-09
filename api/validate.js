const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Método no permitido' });

  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ ok: false, error: 'Clave requerida' });

    const sql = neon(process.env.DATABASE_URL);

    const rows = await sql`
      SELECT * FROM licenses WHERE key = ${key.toUpperCase().trim()}
    `;

    if (rows.length === 0)
      return res.status(404).json({ ok: false, error: 'Licencia no encontrada.' });

    const lic = rows[0];

    if (lic.status === 'revoked')
      return res.status(403).json({ ok: false, error: 'Esta licencia fue revocada.' });

    if (lic.expiry && new Date(lic.expiry) < new Date())
      return res.status(403).json({ ok: false, error: 'Licencia vencida.' });

    const expiry = lic.expiry ? lic.expiry.toISOString().slice(0, 10) : null;
    const daysLeft = expiry
      ? Math.max(0, Math.ceil((new Date(expiry) - new Date()) / 86400000))
      : 9999;

    return res.status(200).json({
      ok: true,
      plan: lic.plan,
      expiry,
      daysLeft,
      businessName: lic.business_name || '',
      valid: true
    });
  } catch(e) {
    return res.status(500).json({ ok: false, error: 'Error interno: ' + e.message });
  }
}
