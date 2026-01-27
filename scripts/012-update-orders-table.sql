-- Migration 3: Update orders table to properly reference the new addresses table
-- Note: If you have existing data in `delivery_address_id` that you want to migrate,
-- you would need to perform a data migration step here before dropping the column.
-- For now, I'm assuming it's safe to drop or it's currently NULL.

-- Drop the existing delivery_address_id column
ALTER TABLE orders
DROP COLUMN delivery_address_id;

-- Add new delivery_address_id as a foreign key referencing the addresses table
ALTER TABLE orders
ADD COLUMN delivery_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL;

-- Add billing_address_id as an optional foreign key
ALTER TABLE orders
ADD COLUMN billing_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL;
