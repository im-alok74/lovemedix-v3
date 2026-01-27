-- Migration 1: Add HSN Code to medicines table
ALTER TABLE medicines
ADD COLUMN hsn_code VARCHAR(20) DEFAULT 'N/A';
