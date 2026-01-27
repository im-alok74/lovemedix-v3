-- Add 20 more medicines to reach 120 total
INSERT INTO medicines (name, generic_name, manufacturer, category, form, strength, pack_size, description, requires_prescription, mrp, image_url) VALUES
-- More Antibiotics
('Levofloxacin 500mg', 'Levofloxacin', 'Beta Antibiotics', 'Antibiotic', 'tablet', '500mg', '5 tablets', 'Fluoroquinolone for respiratory infections', true, 145.00, '/placeholder.svg?height=100&width=100'),
('Clarithromycin 500mg', 'Clarithromycin', 'Beta Antibiotics', 'Antibiotic', 'tablet', '500mg', '6 tablets', 'Macrolide antibiotic', true, 195.00, '/placeholder.svg?height=100&width=100'),
('Metronidazole 400mg', 'Metronidazole', 'Beta Antibiotics', 'Antibiotic', 'tablet', '400mg', '10 tablets', 'Antibiotic and antiprotozoal', true, 65.00, '/placeholder.svg?height=100&width=100'),

-- More Cardiovascular
('Ramipril 5mg', 'Ramipril', 'CardioHealth', 'Cardiovascular', 'capsule', '5mg', '10 capsules', 'ACE inhibitor for hypertension', true, 75.00, '/placeholder.svg?height=100&width=100'),
('Bisoprolol 5mg', 'Bisoprolol', 'CardioHealth', 'Cardiovascular', 'tablet', '5mg', '10 tablets', 'Selective beta blocker', true, 85.00, '/placeholder.svg?height=100&width=100'),
('Rosuvastatin 10mg', 'Rosuvastatin', 'CardioHealth', 'Cardiovascular', 'tablet', '10mg', '10 tablets', 'Potent statin for cholesterol', true, 125.00, '/placeholder.svg?height=100&width=100'),
('Carvedilol 6.25mg', 'Carvedilol', 'CardioHealth', 'Cardiovascular', 'tablet', '6.25mg', '10 tablets', 'Beta blocker for heart failure', true, 95.00, '/placeholder.svg?height=100&width=100'),

-- More Pain Relief
('Aceclofenac 100mg', 'Aceclofenac', 'PainCare', 'Pain Relief', 'tablet', '100mg', '10 tablets', 'NSAID for pain and inflammation', false, 65.00, '/placeholder.svg?height=100&width=100'),
('Etoricoxib 90mg', 'Etoricoxib', 'PainCare', 'Pain Relief', 'tablet', '90mg', '10 tablets', 'COX-2 inhibitor for arthritis', true, 145.00, '/placeholder.svg?height=100&width=100'),
('Ketorolac 10mg', 'Ketorolac', 'PainCare', 'Pain Relief', 'tablet', '10mg', '10 tablets', 'Strong NSAID pain reliever', true, 85.00, '/placeholder.svg?height=100&width=100'),

-- More Digestive
('Esomeprazole 40mg', 'Esomeprazole', 'DigestCare', 'Digestive', 'capsule', '40mg', '15 capsules', 'PPI for acid reflux', false, 125.00, '/placeholder.svg?height=100&width=100'),
('Famotidine 20mg', 'Famotidine', 'DigestCare', 'Digestive', 'tablet', '20mg', '10 tablets', 'H2 blocker for ulcers', false, 65.00, '/placeholder.svg?height=100&width=100'),
('Sucralfate 1g', 'Sucralfate', 'DigestCare', 'Digestive', 'tablet', '1g', '10 tablets', 'Protects stomach lining', false, 95.00, '/placeholder.svg?height=100&width=100'),

-- More Respiratory
('Formoterol Inhaler', 'Formoterol', 'BreathEasy', 'Respiratory', 'inhaler', '6mcg', '120 doses', 'Long-acting bronchodilator', true, 425.00, '/placeholder.svg?height=100&width=100'),
('Ipratropium Inhaler', 'Ipratropium', 'BreathEasy', 'Respiratory', 'inhaler', '20mcg', '200 doses', 'Anticholinergic bronchodilator', true, 325.00, '/placeholder.svg?height=100&width=100'),

-- More Allergy
('Desloratadine 5mg', 'Desloratadine', 'AllerCure', 'Allergy', 'tablet', '5mg', '10 tablets', 'Long-acting antihistamine', false, 95.00, '/placeholder.svg?height=100&width=100'),
('Hydroxyzine 25mg', 'Hydroxyzine', 'AllerCure', 'Allergy', 'tablet', '25mg', '10 tablets', 'Antihistamine for itching', true, 75.00, '/placeholder.svg?height=100&width=100'),

-- More Diabetes
('Dapagliflozin 10mg', 'Dapagliflozin', 'DiaboCure', 'Diabetes', 'tablet', '10mg', '10 tablets', 'SGLT2 inhibitor for diabetes', true, 625.00, '/placeholder.svg?height=100&width=100'),
('Vildagliptin 50mg', 'Vildagliptin', 'DiaboCure', 'Diabetes', 'tablet', '50mg', '15 tablets', 'DPP-4 inhibitor', true, 385.00, '/placeholder.svg?height=100&width=100'),

-- Specialty Medicines
('Gabapentin 300mg', 'Gabapentin', 'NeuroCare', 'Neurological', 'capsule', '300mg', '10 capsules', 'For nerve pain and epilepsy', true, 125.00, '/placeholder.svg?height=100&width=100'),
('Pregabalin 75mg', 'Pregabalin', 'NeuroCare', 'Neurological', 'capsule', '75mg', '10 capsules', 'For neuropathic pain', true, 185.00, '/placeholder.svg?height=100&width=100');
