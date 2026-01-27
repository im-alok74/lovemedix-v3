-- Delete the admin user with incorrect password hash
DELETE FROM users WHERE email = 'admin@lovemedix.com';
