-- Site-wide switches the client can flip from the admin dashboard.
-- Key/value so future toggles do not each need a migration.
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Master switch for CSA share sales. '1' = selling, '0' = closed.
-- Closing hides every package and puts the waitlist form in their place.
INSERT OR IGNORE INTO settings (key, value) VALUES ('csa_sales_enabled', '1');
