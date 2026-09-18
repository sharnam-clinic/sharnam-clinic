-- ==============================================================================
-- SHARNAM CLINIC - SUPABASE POSTGRESQL SCHEMA MIGRATION & SEED SCRIPT
-- Run this entire script in your Supabase SQL Editor:
-- Supabase Dashboard -> Project -> SQL Editor -> New query -> Paste & Click Run
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER TYPES (ROLES) TABLE
CREATE TABLE IF NOT EXISTS public.user_types (
    id BIGSERIAL PRIMARY KEY,
    user_type VARCHAR(100) NOT NULL UNIQUE,
    is_status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. MENUS / MODULES TABLE
CREATE TABLE IF NOT EXISTS public.menus (
    id BIGSERIAL PRIMARY KEY,
    menu_name VARCHAR(150) NOT NULL,
    list_page_route VARCHAR(255) NOT NULL,
    form_page_route VARCHAR(255),
    icon VARCHAR(60),
    sort_order INT NOT NULL DEFAULT 0,
    is_status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ROLE PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id BIGSERIAL PRIMARY KEY,
    user_type_id BIGINT NOT NULL REFERENCES public.user_types(id) ON DELETE CASCADE,
    menu_id BIGINT NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    is_read SMALLINT NOT NULL DEFAULT 1,
    is_write SMALLINT NOT NULL DEFAULT 1,
    is_edit SMALLINT NOT NULL DEFAULT 1,
    is_delete SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_type_menu UNIQUE (user_type_id, menu_id)
);

-- 4. USERS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    user_type_id BIGINT REFERENCES public.user_types(id) ON DELETE SET NULL,
    is_status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. SERVICES TABLE (HOMEOPATHIC TREATMENTS)
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    description TEXT,
    whats_included JSONB NOT NULL DEFAULT '[]'::jsonb,
    approach TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. HEALTH CONDITIONS DIRECTORY TABLE
CREATE TABLE IF NOT EXISTS public.health_conditions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    short_summary TEXT,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    causes JSONB NOT NULL DEFAULT '[]'::jsonb,
    prevention JSONB NOT NULL DEFAULT '[]'::jsonb,
    when_to_see_doctor TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. CLINIC PHOTOS (FACILITY SHOWCASE) TABLE
CREATE TABLE IF NOT EXISTS public.clinic_photos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. CATEGORIES MASTER TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. INQUIRIES / PATIENT CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    subject VARCHAR(255) NOT NULL DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    is_read SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enabling RLS with open read and authenticated/anon write for seamless admin usage
-- ==============================================================================

ALTER TABLE public.user_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read and full operations with anon key for this clinic management app
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public all for user_types" ON public.user_types;
    CREATE POLICY "Allow public all for user_types" ON public.user_types FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all for menus" ON public.menus;
    CREATE POLICY "Allow public all for menus" ON public.menus FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all for role_permissions" ON public.role_permissions;
    CREATE POLICY "Allow public all for role_permissions" ON public.role_permissions FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all for users" ON public.users;
    CREATE POLICY "Allow public all for users" ON public.users FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all for services" ON public.services;
    CREATE POLICY "Allow public all for services" ON public.services FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all for health_conditions" ON public.health_conditions;
    CREATE POLICY "Allow public all for health_conditions" ON public.health_conditions FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all for clinic_photos" ON public.clinic_photos;
    CREATE POLICY "Allow public all for clinic_photos" ON public.clinic_photos FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all for categories" ON public.categories;
    CREATE POLICY "Allow public all for categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public all for inquiries" ON public.inquiries;
    CREATE POLICY "Allow public all for inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ==============================================================================
-- DEFAULT SEED DATA
-- ==============================================================================

-- 1. Seed User Types (Roles)
INSERT INTO public.user_types (id, user_type, is_status) VALUES
    (1, 'Super Admin', 1),
    (2, 'Clinic Staff', 1),
    (3, 'Doctor', 1)
ON CONFLICT (id) DO UPDATE SET user_type = EXCLUDED.user_type;

-- Ensure sequence matches highest id
SELECT setval('public.user_types_id_seq', (SELECT GREATEST(MAX(id), 1) FROM public.user_types));

-- 2. Seed Admin Navigation Menus
INSERT INTO public.menus (id, menu_name, list_page_route, form_page_route, icon, sort_order, is_status) VALUES
    (1, 'Dashboard', '/admin', NULL, 'LayoutDashboard', 99, 0),
    (8, 'Categories', '/admin/categories', '/admin/categories/new', 'Tags', 1, 1),
    (2, 'Clinic Photos', '/admin/clinic-photos', '/admin/clinic-photos/new', 'Image', 2, 1),
    (3, 'Services', '/admin/services', '/admin/services/new', 'Activity', 3, 1),
    (4, 'Health Conditions', '/admin/health-conditions', '/admin/health-conditions/new', 'Stethoscope', 4, 1),
    (9, 'Patient Inquiries', '/admin/inquiries', NULL, 'Inbox', 5, 1),
    (5, 'Users Master', '/admin/users', '/admin/users/new', 'Users', 6, 1),
    (6, 'User Types', '/admin/user-types', '/admin/user-types/new', 'Shield', 7, 1),
    (7, 'Role Permissions', '/admin/role-permission', NULL, 'Key', 8, 1)
ON CONFLICT (id) DO UPDATE SET 
    menu_name = EXCLUDED.menu_name,
    list_page_route = EXCLUDED.list_page_route,
    form_page_route = EXCLUDED.form_page_route,
    icon = EXCLUDED.icon,
    sort_order = EXCLUDED.sort_order,
    is_status = EXCLUDED.is_status;

SELECT setval('public.menus_id_seq', (SELECT GREATEST(MAX(id), 1) FROM public.menus));

-- 3. Seed Default Permissions for Super Admin (Full access to all active menus)
INSERT INTO public.role_permissions (user_type_id, menu_id, is_read, is_write, is_edit, is_delete)
SELECT 1, m.id, 1, 1, 1, 1 FROM public.menus m WHERE m.is_status = 1
ON CONFLICT (user_type_id, menu_id) DO UPDATE SET
    is_read = 1, is_write = 1, is_edit = 1, is_delete = 1;

-- 4. Seed Default Admin User
INSERT INTO public.users (id, name, email, phone, password, user_type_id, is_status) VALUES
    (1, 'Clinic Administrator', 'admin@gmail.com', '+91 98765 43210', '123456', 1, 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    user_type_id = EXCLUDED.user_type_id;

SELECT setval('public.users_id_seq', (SELECT GREATEST(MAX(id), 1) FROM public.users));

-- 5. Seed Services
INSERT INTO public.services (id, name, category, icon, description, whats_included, approach, sort_order, is_status) VALUES
    (1, 'Skin & Hair Care Therapy', 'skin', 'dermatology', 
     'Comprehensive homeopathic treatment for chronic skin conditions, scalp ailments, and allergic dermatitis without steroid creams.',
     '["Adult & Teenage Acne Treatment", "Eczema & Atopic Dermatitis Relief", "Psoriasis & Scalp Flaking Management", "Urticaria & Skin Allergy Care", "Hair Loss & Alopecia Control"]'::jsonb,
     'Addresses internal hormonal imbalance and immune sensitivity to achieve long-lasting clear skin.', 1, 1),
    
    (2, 'Respiratory & ENT Care', 'respiratory', 'air',
     'Strengthening natural lung immunity and nasal defense to prevent recurring seasonal allergies, sinus pressure, and wheezing.',
     '["Chronic Allergic Rhinitis & Frequent Sneezing", "Sinusitis & Nasal Blockage Relief", "Bronchial Asthma Management", "Recurrent Tonsillitis Care", "Dust & Pollen Allergy Immunomodulation"]'::jsonb,
     'Desensitizes the respiratory system naturally so seasonal changes no longer trigger severe flare-ups.', 2, 1),

    (3, 'Digestive & Gastric Wellness', 'digestive', 'stomach',
     'Gentle, natural solutions for chronic acidity, reflux, IBS, and sluggish digestion to restore gut health and gut microbiome balance.',
     '["GERD, Heartburn & Chronic Acidity", "Irritable Bowel Syndrome (IBS)", "Chronic Constipation & Bloating", "Gastritis & Stomach Ulcer Recovery", "Indigestion & Food Intolerance Care"]'::jsonb,
     'Normalizes stomach acid production and gut motility while reducing stress-induced gastric distress.', 3, 1),

    (4, 'Women’s & Hormonal Health', 'women', 'female',
     'Holistic care for female endocrine health, menstrual irregularities, PCOS, and menopausal transitions.',
     '["PCOS / PCOD & Ovarian Cysts", "Irregular & Painful Menstrual Cycles", "Menopausal Hot Flashes & Mood Swings", "Hormonal Acne & Weight Gain", "Fibroids & Premenstrual Syndrome (PMS)"]'::jsonb,
     'Restores natural endocrine rhythm without synthetic hormone replacement therapy.', 4, 1),

    (5, 'Joint & Chronic Pain Management', 'chronic', 'joint',
     'Natural pain relief and anti-inflammatory homeopathic care for joint stiffness, arthritis, and backache.',
     '["Rheumatoid & Osteoarthritis Relief", "Cervical & Lumbar Spondylosis", "Gout & Uric Acid Management", "Sciatica & Lower Back Pain", "Fibromyalgia & Muscle Stiffness"]'::jsonb,
     'Reduces joint swelling and morning stiffness while promoting cartilage health and mobility.', 5, 1),

    (6, 'Pediatric & Child Health', 'pediatric', 'child_care',
     'Ultra-gentle, sweet homeopathic pills designed for babies, toddlers, and young children to boost natural immunity.',
     '["Recurrent Cold, Cough & Fever in Children", "Childhood Asthma & Allergic Cough", "Poor Appetite & Digestive Troubles", "Teething Complaints & Bedwetting", "Immunity Enhancement"]'::jsonb,
     'Zero chemical burden, safe for infants, and highly effective for developing immune systems.', 6, 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.services_id_seq', (SELECT GREATEST(MAX(id), 1) FROM public.services));

-- 6. Seed Health Conditions
INSERT INTO public.health_conditions (id, title, category, icon, short_summary, symptoms, causes, prevention, when_to_see_doctor, sort_order, is_status) VALUES
    (1, 'Atopic Dermatitis & Eczema', 'skin', 'dermatology',
     'A chronic inflammatory skin condition causing itchy, swollen, and cracked skin flare-ups triggered by immune overreactions.',
     '["Intense itching especially at night", "Red to brownish-gray patches", "Small raised bumps that leak fluid when scratched", "Thickened, cracked, dry skin"]'::jsonb,
     '["Genetic predisposition and family history", "Immune system dysregulation", "Environmental allergens like dust and harsh soaps", "Cold dry weather or excessive sweat"]'::jsonb,
     '["Moisturize skin at least twice a day", "Take shorter baths with lukewarm water", "Use gentle soap-free cleansers", "Avoid sudden temperature changes"]'::jsonb,
     'Consult immediately if itching disturbs sleep, skin looks infected with yellow crusts, or home remedies fail to calm flare-ups.', 1, 1),

    (2, 'Bronchial Asthma & Allergic Bronchitis', 'respiratory', 'air',
     'A condition where airways narrow, swell, and produce extra mucus, causing difficulty breathing and wheezing.',
     '["Shortness of breath and chest tightness", "Wheezing sound when exhaling", "Trouble sleeping caused by coughing", "Coughing attacks worsened by respiratory viruses"]'::jsonb,
     '["Airborne allergens like pollen, dust mites, pet dander", "Cold air and temperature fluctuations", "Physical exertion and exercise", "Air pollutants and smoke"]'::jsonb,
     '["Identify and avoid asthma triggers", "Wear a mask in heavy dust or pollution", "Keep indoor humidity regulated", "Stay physically active with gentle warmup"]'::jsonb,
     'Seek immediate care during severe wheezing, inability to speak full sentences, or blue tint on lips/fingers.', 2, 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.health_conditions_id_seq', (SELECT GREATEST(MAX(id), 1) FROM public.health_conditions));

-- 7. Seed Clinic Photos
INSERT INTO public.clinic_photos (id, title, description, image_url, sort_order, is_status) VALUES
    (1, 'Doctor Consultation Chamber', 'Private, tranquil consultation room equipped for comprehensive case taking and patient examination.', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80', 1, 1),
    (2, 'Dispensing Pharmacy & Remedies', 'In-house dispensary carrying genuine German and standardized homeopathic potencies and dilutions.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80', 2, 1),
    (3, 'Patient Reception & Lounge', 'Comfortable, sanitized waiting lounge with peaceful ambiance for patients and visiting families.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', 3, 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.clinic_photos_id_seq', (SELECT GREATEST(MAX(id), 1) FROM public.clinic_photos));

-- 8. Seed Categories Master
INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_status) VALUES
    (1, 'Chronic Care', 'chronic', 'joint', 'Long-term constitutional management for arthritis, pain, and metabolic concerns.', 1, 1),
    (2, 'Acute Illnesses', 'acute', 'healing', 'Rapid relief for sudden fevers, viral infections, and acute seasonal allergies.', 2, 1),
    (3, 'Pediatric Health', 'pediatric', 'child_care', 'Gentle, natural immune support and wellness for infants and children.', 3, 1),
    (4, 'Women''s Health', 'women', 'female', 'Holistic hormonal balance, PCOS care, and cycle regulation.', 4, 1),
    (5, 'Skin & Hair', 'skin', 'dermatology', 'Acne, eczema, psoriasis, hair thinning, and allergy care without steroids.', 5, 1),
    (6, 'Respiratory Health', 'respiratory', 'air', 'Asthma, bronchitis, sinusitis, and dust/pollen allergy care.', 6, 1),
    (7, 'Digestive Disorders', 'digestive', 'stomach', 'GERD, acidity, IBS, sluggish digestion, and gut microbiome balance.', 7, 1),
    (8, 'Mental & Emotional Wellness', 'mental', 'psychology', 'Natural stress management, anxiety, insomnia, and mood support.', 8, 1)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_status = EXCLUDED.is_status;

SELECT setval('public.categories_id_seq', (SELECT GREATEST(MAX(id), 1) FROM public.categories));
