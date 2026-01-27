-- Create admin user with proper password hash
-- Email: admin@lovemedix.com
-- Password: admin123

-- First, check if admin user exists and delete if present
DELETE FROM users WHERE email = 'admin@lovemedix.com';

-- Insert admin user with bcrypt hashed password for 'admin123'
-- Hash generated with bcrypt cost factor 10
INSERT INTO users (email, password_hash, full_name, phone, user_type) VALUES
('admin@lovemedix.com', '$2a$10$rXKe/8z.j1QJE7pVYwZjKe5vYQXJKJ8GhPZvqJ5Z4NqY5cZNqK5bS', 'Admin User', '+919999999999', 'admin');
