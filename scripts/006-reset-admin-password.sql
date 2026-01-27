-- Delete existing admin user and recreate with proper password hash
DELETE FROM users WHERE email = 'admin@lovemedix.com';

-- Insert admin user with password: Admin@123
-- This is a proper bcrypt hash for "Admin@123"
INSERT INTO users (email, password_hash, user_type, created_at)
VALUES (
  'admin@lovemedix.com',
  '$2a$10$CwTycUXWue0Thq9StjUM0uBP8xnJZZ.vvFZVLJfkXJ3Lqz7Y8Y8qO',
  'admin',
  NOW()
);
