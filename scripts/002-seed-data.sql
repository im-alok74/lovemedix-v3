-- Insert sample medicines
INSERT INTO medicines (name, generic_name, manufacturer, category, form, strength, pack_size, description, requires_prescription, mrp, image_url) VALUES
('Paracetamol 500mg', 'Paracetamol', 'Generic Pharma', 'Pain Relief', 'tablet', '500mg', '10 tablets', 'Used for pain relief and fever reduction', false, 25.00, '/placeholder.svg?height=100&width=100'),
('Amoxicillin 500mg', 'Amoxicillin', 'Beta Antibiotics', 'Antibiotic', 'capsule', '500mg', '10 capsules', 'Antibiotic for bacterial infections', true, 85.00, '/placeholder.svg?height=100&width=100'),
('Cetirizine 10mg', 'Cetirizine', 'AllerCure', 'Allergy', 'tablet', '10mg', '10 tablets', 'Antihistamine for allergies', false, 45.00, '/placeholder.svg?height=100&width=100'),
('Omeprazole 20mg', 'Omeprazole', 'DigestCare', 'Digestive', 'capsule', '20mg', '15 capsules', 'Reduces stomach acid', false, 95.00, '/placeholder.svg?height=100&width=100'),
('Metformin 500mg', 'Metformin', 'DiaboCure', 'Diabetes', 'tablet', '500mg', '30 tablets', 'Controls blood sugar in type 2 diabetes', true, 120.00, '/placeholder.svg?height=100&width=100'),
('Aspirin 75mg', 'Aspirin', 'CardioHealth', 'Cardiovascular', 'tablet', '75mg', '30 tablets', 'Blood thinner for heart health', false, 55.00, '/placeholder.svg?height=100&width=100'),
('Vitamin D3 60000 IU', 'Cholecalciferol', 'NutriVita', 'Vitamin', 'capsule', '60000 IU', '4 capsules', 'Vitamin D supplement', false, 180.00, '/placeholder.svg?height=100&width=100'),
('Cough Syrup', 'Dextromethorphan', 'ReliefMed', 'Respiratory', 'syrup', '100ml', '100ml bottle', 'Relief from dry cough', false, 125.00, '/placeholder.svg?height=100&width=100'),
('Insulin Glargine', 'Insulin Glargine', 'DiaboCure', 'Diabetes', 'injection', '100 IU/ml', '3ml cartridge', 'Long-acting insulin', true, 1250.00, '/placeholder.svg?height=100&width=100'),
('Salbutamol Inhaler', 'Salbutamol', 'BreathEasy', 'Respiratory', 'inhaler', '100mcg', '200 doses', 'Relief for asthma and breathing problems', true, 295.00, '/placeholder.svg?height=100&width=100');

-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, phone, user_type) VALUES
('admin@lovemedix.com', '$2a$10$YourHashedPasswordHere', 'Admin User', '+919999999999', 'admin');
