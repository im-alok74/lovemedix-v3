-- Add 90 more medicines to reach 100 total
INSERT INTO medicines (name, generic_name, manufacturer, category, form, strength, pack_size, description, requires_prescription, mrp, image_url) VALUES
-- Pain Relief & Fever
('Ibuprofen 400mg', 'Ibuprofen', 'PainCare', 'Pain Relief', 'tablet', '400mg', '10 tablets', 'Anti-inflammatory pain reliever', false, 35.00, '/placeholder.svg?height=100&width=100'),
('Diclofenac 50mg', 'Diclofenac', 'Generic Pharma', 'Pain Relief', 'tablet', '50mg', '10 tablets', 'NSAID for pain and inflammation', true, 45.00, '/placeholder.svg?height=100&width=100'),
('Tramadol 50mg', 'Tramadol', 'PainRelief', 'Pain Relief', 'capsule', '50mg', '10 capsules', 'Opioid pain medication', true, 65.00, '/placeholder.svg?height=100&width=100'),
('Naproxen 250mg', 'Naproxen', 'PainCare', 'Pain Relief', 'tablet', '250mg', '10 tablets', 'Long-lasting pain relief', false, 55.00, '/placeholder.svg?height=100&width=100'),

-- Antibiotics
('Azithromycin 500mg', 'Azithromycin', 'Beta Antibiotics', 'Antibiotic', 'tablet', '500mg', '3 tablets', 'Macrolide antibiotic', true, 125.00, '/placeholder.svg?height=100&width=100'),
('Ciprofloxacin 500mg', 'Ciprofloxacin', 'Beta Antibiotics', 'Antibiotic', 'tablet', '500mg', '10 tablets', 'Fluoroquinolone antibiotic', true, 95.00, '/placeholder.svg?height=100&width=100'),
('Doxycycline 100mg', 'Doxycycline', 'Beta Antibiotics', 'Antibiotic', 'capsule', '100mg', '10 capsules', 'Tetracycline antibiotic', true, 85.00, '/placeholder.svg?height=100&width=100'),
('Cefixime 200mg', 'Cefixime', 'Beta Antibiotics', 'Antibiotic', 'tablet', '200mg', '10 tablets', 'Cephalosporin antibiotic', true, 115.00, '/placeholder.svg?height=100&width=100'),

-- Allergy & Antihistamines
('Loratadine 10mg', 'Loratadine', 'AllerCure', 'Allergy', 'tablet', '10mg', '10 tablets', 'Non-drowsy antihistamine', false, 50.00, '/placeholder.svg?height=100&width=100'),
('Fexofenadine 120mg', 'Fexofenadine', 'AllerCure', 'Allergy', 'tablet', '120mg', '10 tablets', 'Antihistamine for hay fever', false, 85.00, '/placeholder.svg?height=100&width=100'),
('Montelukast 10mg', 'Montelukast', 'AllerCure', 'Allergy', 'tablet', '10mg', '10 tablets', 'Leukotriene receptor antagonist', true, 125.00, '/placeholder.svg?height=100&width=100'),
('Chlorpheniramine 4mg', 'Chlorpheniramine', 'AllerCure', 'Allergy', 'tablet', '4mg', '10 tablets', 'Antihistamine for allergies', false, 30.00, '/placeholder.svg?height=100&width=100'),

-- Digestive Health
('Pantoprazole 40mg', 'Pantoprazole', 'DigestCare', 'Digestive', 'tablet', '40mg', '15 tablets', 'Proton pump inhibitor', false, 105.00, '/placeholder.svg?height=100&width=100'),
('Ranitidine 150mg', 'Ranitidine', 'DigestCare', 'Digestive', 'tablet', '150mg', '10 tablets', 'H2 blocker for acid reflux', false, 55.00, '/placeholder.svg?height=100&width=100'),
('Domperidone 10mg', 'Domperidone', 'DigestCare', 'Digestive', 'tablet', '10mg', '10 tablets', 'Anti-nausea medication', false, 45.00, '/placeholder.svg?height=100&width=100'),
('Loperamide 2mg', 'Loperamide', 'DigestCare', 'Digestive', 'capsule', '2mg', '6 capsules', 'Anti-diarrheal medication', false, 35.00, '/placeholder.svg?height=100&width=100'),

-- Diabetes
('Glimepiride 2mg', 'Glimepiride', 'DiaboCure', 'Diabetes', 'tablet', '2mg', '15 tablets', 'Sulfonylurea for diabetes', true, 85.00, '/placeholder.svg?height=100&width=100'),
('Sitagliptin 100mg', 'Sitagliptin', 'DiaboCure', 'Diabetes', 'tablet', '100mg', '10 tablets', 'DPP-4 inhibitor', true, 425.00, '/placeholder.svg?height=100&width=100'),
('Gliclazide 80mg', 'Gliclazide', 'DiaboCure', 'Diabetes', 'tablet', '80mg', '30 tablets', 'Controls blood sugar', true, 95.00, '/placeholder.svg?height=100&width=100'),
('Empagliflozin 10mg', 'Empagliflozin', 'DiaboCure', 'Diabetes', 'tablet', '10mg', '10 tablets', 'SGLT2 inhibitor', true, 550.00, '/placeholder.svg?height=100&width=100'),

-- Cardiovascular
('Atorvastatin 10mg', 'Atorvastatin', 'CardioHealth', 'Cardiovascular', 'tablet', '10mg', '10 tablets', 'Cholesterol medication', true, 75.00, '/placeholder.svg?height=100&width=100'),
('Metoprolol 50mg', 'Metoprolol', 'CardioHealth', 'Cardiovascular', 'tablet', '50mg', '30 tablets', 'Beta blocker for blood pressure', true, 95.00, '/placeholder.svg?height=100&width=100'),
('Amlodipine 5mg', 'Amlodipine', 'CardioHealth', 'Cardiovascular', 'tablet', '5mg', '10 tablets', 'Calcium channel blocker', true, 65.00, '/placeholder.svg?height=100&width=100'),
('Losartan 50mg', 'Losartan', 'CardioHealth', 'Cardiovascular', 'tablet', '50mg', '10 tablets', 'ARB for blood pressure', true, 85.00, '/placeholder.svg?height=100&width=100'),
('Clopidogrel 75mg', 'Clopidogrel', 'CardioHealth', 'Cardiovascular', 'tablet', '75mg', '10 tablets', 'Antiplatelet medication', true, 125.00, '/placeholder.svg?height=100&width=100'),

-- Vitamins & Supplements
('Vitamin C 500mg', 'Ascorbic Acid', 'NutriVita', 'Vitamin', 'tablet', '500mg', '30 tablets', 'Immune support vitamin', false, 145.00, '/placeholder.svg?height=100&width=100'),
('Vitamin B Complex', 'B Vitamins', 'NutriVita', 'Vitamin', 'capsule', 'Multi', '30 capsules', 'Complete B vitamin complex', false, 195.00, '/placeholder.svg?height=100&width=100'),
('Calcium Carbonate 500mg', 'Calcium Carbonate', 'NutriVita', 'Vitamin', 'tablet', '500mg', '30 tablets', 'Calcium supplement', false, 125.00, '/placeholder.svg?height=100&width=100'),
('Iron Supplement', 'Ferrous Sulfate', 'NutriVita', 'Vitamin', 'tablet', '65mg', '30 tablets', 'Iron for anemia', false, 85.00, '/placeholder.svg?height=100&width=100'),
('Omega-3 Fish Oil', 'EPA/DHA', 'NutriVita', 'Vitamin', 'capsule', '1000mg', '30 capsules', 'Heart health supplement', false, 425.00, '/placeholder.svg?height=100&width=100'),
('Multivitamin', 'Multivitamin', 'NutriVita', 'Vitamin', 'tablet', 'Multi', '30 tablets', 'Daily multivitamin', false, 225.00, '/placeholder.svg?height=100&width=100'),

-- Respiratory
('Ambroxol Syrup', 'Ambroxol', 'ReliefMed', 'Respiratory', 'syrup', '30mg/5ml', '100ml bottle', 'Expectorant for cough', false, 95.00, '/placeholder.svg?height=100&width=100'),
('Montelukast 4mg', 'Montelukast', 'BreathEasy', 'Respiratory', 'tablet', '4mg', '10 tablets', 'For asthma prevention', true, 95.00, '/placeholder.svg?height=100&width=100'),
('Budesonide Inhaler', 'Budesonide', 'BreathEasy', 'Respiratory', 'inhaler', '200mcg', '120 doses', 'Corticosteroid inhaler', true, 525.00, '/placeholder.svg?height=100&width=100'),
('Theophylline 200mg', 'Theophylline', 'BreathEasy', 'Respiratory', 'tablet', '200mg', '10 tablets', 'Bronchodilator', true, 65.00, '/placeholder.svg?height=100&width=100'),

-- Antacids & Digestive
('Antacid Syrup', 'Aluminum Hydroxide', 'DigestCare', 'Digestive', 'syrup', '200ml', '200ml bottle', 'Quick acid relief', false, 85.00, '/placeholder.svg?height=100&width=100'),
('Digestive Enzyme', 'Pancreatin', 'DigestCare', 'Digestive', 'tablet', '300mg', '10 tablets', 'Aids digestion', false, 125.00, '/placeholder.svg?height=100&width=100'),
('Lactobacillus', 'Probiotics', 'DigestCare', 'Digestive', 'capsule', '5 billion', '10 capsules', 'Probiotic supplement', false, 225.00, '/placeholder.svg?height=100&width=100'),
('Isabgol Husk', 'Psyllium', 'DigestCare', 'Digestive', 'powder', '100g', '100g pack', 'Natural fiber supplement', false, 145.00, '/placeholder.svg?height=100&width=100'),

-- Skin Care
('Hydrocortisone Cream', 'Hydrocortisone', 'DermaCare', 'Skin Care', 'cream', '1%', '15g tube', 'Anti-itch cream', false, 85.00, '/placeholder.svg?height=100&width=100'),
('Clotrimazole Cream', 'Clotrimazole', 'DermaCare', 'Skin Care', 'cream', '1%', '20g tube', 'Antifungal cream', false, 65.00, '/placeholder.svg?height=100&width=100'),
('Betamethasone Cream', 'Betamethasone', 'DermaCare', 'Skin Care', 'cream', '0.1%', '15g tube', 'Corticosteroid cream', true, 95.00, '/placeholder.svg?height=100&width=100'),
('Mupirocin Ointment', 'Mupirocin', 'DermaCare', 'Skin Care', 'ointment', '2%', '5g tube', 'Antibiotic ointment', true, 125.00, '/placeholder.svg?height=100&width=100'),
('Calamine Lotion', 'Calamine', 'DermaCare', 'Skin Care', 'lotion', '100ml', '100ml bottle', 'Soothing skin lotion', false, 55.00, '/placeholder.svg?height=100&width=100'),

-- Eye Care
('Artificial Tears', 'Carboxymethylcellulose', 'VisionCare', 'Eye Care', 'drops', '0.5%', '10ml bottle', 'Lubricating eye drops', false, 95.00, '/placeholder.svg?height=100&width=100'),
('Timolol Eye Drops', 'Timolol', 'VisionCare', 'Eye Care', 'drops', '0.5%', '5ml bottle', 'For glaucoma', true, 185.00, '/placeholder.svg?height=100&width=100'),
('Ciprofloxacin Eye Drops', 'Ciprofloxacin', 'VisionCare', 'Eye Care', 'drops', '0.3%', '5ml bottle', 'Antibiotic eye drops', true, 75.00, '/placeholder.svg?height=100&width=100'),

-- Mental Health
('Sertraline 50mg', 'Sertraline', 'MindCare', 'Mental Health', 'tablet', '50mg', '10 tablets', 'Antidepressant SSRI', true, 145.00, '/placeholder.svg?height=100&width=100'),
('Escitalopram 10mg', 'Escitalopram', 'MindCare', 'Mental Health', 'tablet', '10mg', '10 tablets', 'For anxiety and depression', true, 125.00, '/placeholder.svg?height=100&width=100'),
('Alprazolam 0.5mg', 'Alprazolam', 'MindCare', 'Mental Health', 'tablet', '0.5mg', '10 tablets', 'Anti-anxiety medication', true, 95.00, '/placeholder.svg?height=100&width=100'),
('Clonazepam 0.5mg', 'Clonazepam', 'MindCare', 'Mental Health', 'tablet', '0.5mg', '10 tablets', 'For anxiety and seizures', true, 85.00, '/placeholder.svg?height=100&width=100'),

-- Women's Health
('Folic Acid 5mg', 'Folic Acid', 'WomenCare', 'Vitamin', 'tablet', '5mg', '30 tablets', 'For pregnancy support', false, 55.00, '/placeholder.svg?height=100&width=100'),
('Iron + Folic Acid', 'Ferrous Ascorbate', 'WomenCare', 'Vitamin', 'tablet', '100mg', '30 tablets', 'For anemia in pregnancy', false, 95.00, '/placeholder.svg?height=100&width=100'),
('Prenatal Multivitamin', 'Multivitamin', 'WomenCare', 'Vitamin', 'tablet', 'Multi', '30 tablets', 'Complete prenatal nutrition', false, 325.00, '/placeholder.svg?height=100&width=100'),

-- Men's Health
('Finasteride 1mg', 'Finasteride', 'MenCare', 'Men Health', 'tablet', '1mg', '10 tablets', 'For hair loss', true, 185.00, '/placeholder.svg?height=100&width=100'),
('Tadalafil 5mg', 'Tadalafil', 'MenCare', 'Men Health', 'tablet', '5mg', '4 tablets', 'For erectile dysfunction', true, 425.00, '/placeholder.svg?height=100&width=100'),
('Sildenafil 50mg', 'Sildenafil', 'MenCare', 'Men Health', 'tablet', '50mg', '4 tablets', 'For erectile dysfunction', true, 385.00, '/placeholder.svg?height=100&width=100'),

-- Children's Health
('Paracetamol Syrup', 'Paracetamol', 'KidsCare', 'Pain Relief', 'syrup', '120mg/5ml', '60ml bottle', 'Fever and pain relief for kids', false, 45.00, '/placeholder.svg?height=100&width=100'),
('Ibuprofen Syrup', 'Ibuprofen', 'KidsCare', 'Pain Relief', 'syrup', '100mg/5ml', '100ml bottle', 'Pediatric pain reliever', false, 65.00, '/placeholder.svg?height=100&width=100'),
('Amoxicillin Syrup', 'Amoxicillin', 'KidsCare', 'Antibiotic', 'syrup', '125mg/5ml', '60ml bottle', 'Antibiotic for children', true, 85.00, '/placeholder.svg?height=100&width=100'),
('Multivitamin Drops', 'Multivitamin', 'KidsCare', 'Vitamin', 'drops', '30ml', '30ml bottle', 'Daily vitamins for kids', false, 195.00, '/placeholder.svg?height=100&width=100'),

-- Cold & Flu
('Cold & Flu Tablet', 'Phenylephrine', 'ReliefMed', 'Respiratory', 'tablet', '10mg', '10 tablets', 'Multi-symptom cold relief', false, 55.00, '/placeholder.svg?height=100&width=100'),
('Decongestant Spray', 'Oxymetazoline', 'ReliefMed', 'Respiratory', 'spray', '0.05%', '15ml bottle', 'Nasal decongestant', false, 95.00, '/placeholder.svg?height=100&width=100'),
('Throat Lozenges', 'Benzocaine', 'ReliefMed', 'Respiratory', 'lozenge', '6mg', '12 lozenges', 'Sore throat relief', false, 65.00, '/placeholder.svg?height=100&width=100'),

-- Pain Relief Topical
('Diclofenac Gel', 'Diclofenac', 'PainCare', 'Pain Relief', 'gel', '1%', '30g tube', 'Topical pain relief', false, 125.00, '/placeholder.svg?height=100&width=100'),
('Muscle Pain Relief Spray', 'Menthol', 'PainCare', 'Pain Relief', 'spray', '100ml', '100ml bottle', 'Instant muscle pain relief', false, 145.00, '/placeholder.svg?height=100&width=100'),
('Pain Relief Patch', 'Lidocaine', 'PainCare', 'Pain Relief', 'patch', '5%', '5 patches', 'Long-lasting pain relief', false, 225.00, '/placeholder.svg?height=100&width=100'),

-- Oral Care
('Chlorhexidine Mouthwash', 'Chlorhexidine', 'OralCare', 'Oral Health', 'solution', '0.2%', '150ml bottle', 'Antibacterial mouthwash', false, 125.00, '/placeholder.svg?height=100&width=100'),
('Fluoride Gel', 'Sodium Fluoride', 'OralCare', 'Oral Health', 'gel', '1.1%', '50g tube', 'Strengthens tooth enamel', false, 165.00, '/placeholder.svg?height=100&width=100'),

-- First Aid
('Antiseptic Solution', 'Povidone-Iodine', 'FirstAid', 'First Aid', 'solution', '10%', '100ml bottle', 'Wound disinfectant', false, 85.00, '/placeholder.svg?height=100&width=100'),
('Bandage Roll', 'Cotton Bandage', 'FirstAid', 'First Aid', 'bandage', '10cm x 4m', '1 roll', 'Medical bandage', false, 45.00, '/placeholder.svg?height=100&width=100'),
('Adhesive Bandages', 'Band-Aid', 'FirstAid', 'First Aid', 'bandage', 'Assorted', '20 pieces', 'Adhesive plasters', false, 65.00, '/placeholder.svg?height=100&width=100'),
('Gauze Pads', 'Sterile Gauze', 'FirstAid', 'First Aid', 'gauze', '10cm x 10cm', '10 pieces', 'Sterile wound dressing', false, 55.00, '/placeholder.svg?height=100&width=100'),

-- Hormones
('Levothyroxine 50mcg', 'Levothyroxine', 'HormoCare', 'Hormone', 'tablet', '50mcg', '30 tablets', 'Thyroid hormone replacement', true, 85.00, '/placeholder.svg?height=100&width=100'),
('Levothyroxine 100mcg', 'Levothyroxine', 'HormoCare', 'Hormone', 'tablet', '100mcg', '30 tablets', 'Thyroid hormone replacement', true, 95.00, '/placeholder.svg?height=100&width=100'),

-- Anti-inflammatory
('Prednisolone 5mg', 'Prednisolone', 'InflamCare', 'Anti-inflammatory', 'tablet', '5mg', '10 tablets', 'Corticosteroid', true, 45.00, '/placeholder.svg?height=100&width=100'),
('Dexamethasone 0.5mg', 'Dexamethasone', 'InflamCare', 'Anti-inflammatory', 'tablet', '0.5mg', '10 tablets', 'Potent corticosteroid', true, 35.00, '/placeholder.svg?height=100&width=100'),

-- Antiemetic
('Ondansetron 4mg', 'Ondansetron', 'DigestCare', 'Digestive', 'tablet', '4mg', '10 tablets', 'Prevents nausea and vomiting', true, 125.00, '/placeholder.svg?height=100&width=100'),
('Metoclopramide 10mg', 'Metoclopramide', 'DigestCare', 'Digestive', 'tablet', '10mg', '10 tablets', 'For nausea and gastroparesis', true, 55.00, '/placeholder.svg?height=100&width=100');
