-- Create Demo Pharmacy User if not exists
INSERT INTO users (full_name, email, phone, password_hash, user_type, created_at)
VALUES (
  'LoveMedix Demo Pharmacy',
  'demo.pharmacy@lovemedix.com',
  '+91 9508178521',
  'demo_password_hash',
  'pharmacy',
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Get the user ID for demo pharmacy
WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo.pharmacy@lovemedix.com'
)
INSERT INTO pharmacy_profiles (
  user_id,
  pharmacy_name,
  license_number,
  gst_number,
  address,
  city,
  state,
  pincode,
  phone,
  verification_status,
  created_at
)
SELECT
  du.id,
  'LoveMedix Pharmacy',
  'L-2024-00001',
  '27AABCT1234K1Z0',
  'Silao',
  'Nalanda',
  'Bihar',
  '803110',
  '+91 9508178521',
  'verified',
  CURRENT_TIMESTAMP
FROM demo_user du
ON CONFLICT (user_id) DO UPDATE SET 
  verification_status = 'verified',
  license_number = 'L-2024-00001',
  gst_number = '27AABCT1234K1Z0';

-- Get pharmacy ID
WITH demo_pharmacy AS (
  SELECT pp.id FROM pharmacy_profiles pp
  JOIN users u ON pp.user_id = u.id
  WHERE u.email = 'demo.pharmacy@lovemedix.com'
)
-- Map all medicines to demo pharmacy with standard pricing (90% of MRP)
INSERT INTO pharmacy_inventory (
  pharmacy_id,
  medicine_id,
  stock_quantity,
  selling_price,
  discount_percentage,
  batch_number,
  expiry_date,
  created_at
)
SELECT
  dp.id,
  m.id,
  1000,  -- Default stock 1000 units
  CAST(CAST(m.mrp AS DECIMAL) * 0.90 AS VARCHAR),  -- 90% of MRP
  10,  -- 10% discount
  'BATCH-2024',
  DATE_ADD(CURRENT_DATE, INTERVAL 2 YEAR),  -- 2 year expiry
  CURRENT_TIMESTAMP
FROM demo_pharmacy dp
CROSS JOIN medicines m
ON CONFLICT (pharmacy_id, medicine_id, batch_number) DO UPDATE SET
  stock_quantity = 1000,
  selling_price = EXCLUDED.selling_price,
  discount_percentage = 10,
  last_updated = CURRENT_TIMESTAMP;

-- Verify the setup
SELECT 
  (SELECT COUNT(*) FROM pharmacy_profiles WHERE verification_status = 'verified') as verified_pharmacies,
  (SELECT COUNT(*) FROM pharmacy_inventory WHERE pharmacy_id IN (
    SELECT pp.id FROM pharmacy_profiles pp
    JOIN users u ON pp.user_id = u.id
    WHERE u.email = 'demo.pharmacy@lovemedix.com'
  )) as medicines_mapped;
