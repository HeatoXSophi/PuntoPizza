-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_fee numeric(10,2) NOT NULL DEFAULT 2.00,
    box_fee numeric(10,2) NOT NULL DEFAULT 1.00,
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for store_settings" ON store_settings
    FOR SELECT USING (true);

-- Admin write access (Assuming admins use the authenticated role or similar, adjust if necessary)
-- For simplicity, allowing update by authenticated users, but you can restrict it to a specific admin email or role if you have one.
CREATE POLICY "Admin update access for store_settings" ON store_settings
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert access for store_settings" ON store_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default row if table is empty
INSERT INTO store_settings (delivery_fee, box_fee)
SELECT 2.00, 1.00
WHERE NOT EXISTS (SELECT 1 FROM store_settings);
