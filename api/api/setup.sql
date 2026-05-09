CREATE TABLE IF NOT EXISTS licenses (
  id SERIAL PRIMARY KEY,
  key VARCHAR(20) UNIQUE NOT NULL,
  plan VARCHAR(20) DEFAULT 'basic',
  status VARCHAR(20) DEFAULT 'active',
  business_name VARCHAR(200),
  domain VARCHAR(200),
  expiry DATE,
  activated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cargá tus licencias acá:
INSERT INTO licenses (key, plan, expiry) VALUES
  ('ARIEL-1111-2222-3333', 'pro', '2026-12-31'),
  ('ARIEL-AAAA-BBBB-CCCC', 'basic', '2026-06-30'),
  ('ARIEL-LIFE-TIME-0001', 'lifetime', NULL);
