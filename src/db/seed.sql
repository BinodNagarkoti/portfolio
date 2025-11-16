-- Sample Seed Data for Binodfolio CMS
-- Ensure you have a personal_info record ID to link other records to.
-- You might need to run this in sections or adjust UUIDs if you run it multiple times.

-- 1. Personal Info (Create one main record)
-- Replace with your actual UUID if you have one, or let it auto-generate.
-- This will try to insert, or do nothing if a record with this specific email already exists (to avoid duplicates on re-runs)
DO $$
DECLARE
    binod_id UUID;
BEGIN
    -- Try to find an existing personal_info record for this email
    SELECT id INTO binod_id FROM personal_info WHERE contact_email = 'binod1365@gmail.com' LIMIT 1;

    -- If not found, insert a new one and get its ID
    IF binod_id IS NULL THEN
        INSERT INTO personal_info (name, title, subtitle, bio, "position", location, cv_url, contact_email, phone, github_url, linkedin_url)
        VALUES (
            'Binod Nagarkoti',
            'Frontend & Full Stack Developer',
            'Passionate developer creating modern web apps with JavaScript, MERN, and Next.js.',
            'BIT graduate from CITE, Purvanchal University. Deep passion for web app development, specializing in JavaScript MERN stack and TypeScript. Experience in algorithmic trading, e-commerce, and CMS development.',
            'Lead Developer / Consultant',
            'Kathmandu, Nepal',
            '/binod_nagarkoti.pdf', -- Assuming CV is in public folder, will be replaced by Supabase Storage URL
            'binod1365@gmail.com',
            '+9779803135946',
            'https://github.com/yourusername', -- Replace with actual
            'https://linkedin.com/in/yourusername' -- Replace with actual
        ) RETURNING id INTO binod_id;
    END IF;

    -- 2. Skill Categories (if they don't exist)
    INSERT INTO skill_categories (name, sort_order) VALUES
        ('Frontend Development', 1),
        ('Backend Development', 2),
        ('Databases & BaaS', 3),
        ('Programming Languages', 4),
        ('Tools & Platforms', 5)
    ON CONFLICT (name) DO NOTHING;

    -- 3. Skills (Link to categories by name for simplicity in seeding)
    -- Frontend
    INSERT INTO skills (skill_category_id, name, level, sort_order) VALUES
        ((SELECT id from skill_categories WHERE name = 'Frontend Development'), 'HTML5', 'Expert', 1),
        ((SELECT id from skill_categories WHERE name = 'Frontend Development'), 'CSS3', 'Expert', 2),
        ((SELECT id from skill_categories WHERE name = 'Frontend Development'), 'JavaScript (ES6+)', 'Expert', 3),
        ((SELECT id from skill_categories WHERE name = 'Frontend Development'), 'TypeScript', 'Expert', 4),
        ((SELECT id from skill_categories WHERE name = 'Frontend Development'), 'ReactJS', 'Expert', 5),
        ((SELECT id from skill_categories WHERE name = 'Frontend Development'), 'NextJS', 'Expert', 6),
        ((SELECT id from skill_categories WHERE name = 'Frontend Development'), 'Tailwind CSS', 'Expert', 7),
        ((SELECT id from skill_categories WHERE name = 'Frontend Development'), 'Material UI', 'Intermediate', 8)
    ON CONFLICT (skill_category_id, name) DO NOTHING;

    -- Backend
    INSERT INTO skills (skill_category_id, name, level, sort_order) VALUES
        ((SELECT id from skill_categories WHERE name = 'Backend Development'), 'Node.js', 'Expert', 1),
        ((SELECT id from skill_categories WHERE name = 'Backend Development'), 'Express.js', 'Expert', 2),
        ((SELECT id from skill_categories WHERE name = 'Backend Development'), 'ASP.NET 8 MVC', 'Intermediate', 3)
    ON CONFLICT (skill_category_id, name) DO NOTHING;

    -- Databases & BaaS
    INSERT INTO skills (skill_category_id, name, level, sort_order) VALUES
        ((SELECT id from skill_categories WHERE name = 'Databases & BaaS'), 'MongoDB', 'Expert', 1),
        ((SELECT id from skill_categories WHERE name = 'Databases & BaaS'), 'PostgreSQL', 'Expert', 2),
        ((SELECT id from skill_categories WHERE name = 'Databases & BaaS'), 'MySQL', 'Expert', 3),
        ((SELECT id from skill_categories WHERE name = 'Databases & BaaS'), 'Microsoft SQL', 'Intermediate', 4),
        ((SELECT id from skill_categories WHERE name = 'Databases & BaaS'), 'Supabase', 'Intermediate', 5),
        ((SELECT id from skill_categories WHERE name = 'Databases & BaaS'), 'Firebase', 'Intermediate', 6),
        ((SELECT id from skill_categories WHERE name = 'Databases & BaaS'), 'Redis', 'Basic', 7)
    ON CONFLICT (skill_category_id, name) DO NOTHING;

    -- Programming Languages
    INSERT INTO skills (skill_category_id, name, level, sort_order) VALUES
        ((SELECT id from skill_categories WHERE name = 'Programming Languages'), 'Python', 'Basic', 1),
        ((SELECT id from skill_categories WHERE name = 'Programming Languages'), 'C#', 'Intermediate', 2),
        ((SELECT id from skill_categories WHERE name = 'Programming Languages'), 'PHP', 'Basic', 3)
    ON CONFLICT (skill_category_id, name) DO NOTHING;

    -- Tools & Platforms
    INSERT INTO skills (skill_category_id, name, level, sort_order) VALUES
        ((SELECT id from skill_categories WHERE name = 'Tools & Platforms'), 'Git & GitHub', 'Expert', 1),
        ((SELECT id from skill_categories WHERE name = 'Tools & Platforms'), 'Docker', 'Intermediate', 2),
        ((SELECT id from skill_categories WHERE name = 'Tools & Platforms'), 'AWS (EC2, S3)', 'Intermediate', 3),
        ((SELECT id from skill_categories WHERE name = 'Tools & Platforms'), 'WordPress', 'Intermediate', 4),
        ((SELECT id from skill_categories WHERE name = 'Tools & Platforms'), 'C-Panel', 'Intermediate', 5),
        ((SELECT id from skill_categories WHERE name = 'Tools & Platforms'), 'Google OAuth', 'Intermediate', 6)
    ON CONFLICT (skill_category_id, name) DO NOTHING;

    -- 4. Education
    IF binod_id IS NOT NULL THEN
        INSERT INTO education (personal_info_id, degree, institution, start_year, end_year, description)
        VALUES (
            binod_id,
            'Bachelor of Information Technology (BIT)',
            'Purvanchal University, CITE, Nepal',
            2014,
            2018,
            'Graduated with a focus on software development and information systems.'
        ) ON CONFLICT DO NOTHING; -- Add a unique constraint if needed to use ON CONFLICT
    END IF;

    -- 5. Experience
    IF binod_id IS NOT NULL THEN
        INSERT INTO experience (personal_info_id, job_title, company, start_date, end_date, description, responsibilities)
        VALUES (
            binod_id,
            'Frontend Engineer',
            'Investfly',
            '2022-01-15', -- YYYY-MM-DD
            NULL, -- Current job
            'Developed and maintained frontend components for an algorithmic trading platform.',
            ARRAY['ReactJS development', 'REST API integration', 'UI/UX improvements']
        ),
        (
            binod_id,
            'Full Stack Developer',
            'Omistics Technology',
            '2019-06-01',
            '2021-12-31',
            'Worked on various projects involving MERN stack and Next.js.',
            ARRAY['Full stack development with MERN', 'Next.js for SSR applications', 'Database design and management']
        ) ON CONFLICT DO NOTHING; -- Add a unique constraint if needed
    END IF;

    -- 6. Projects
    IF binod_id IS NOT NULL THEN
        INSERT INTO projects (personal_info_id, title, description, technologies, cover_image_url, live_link, github_link, project_type, category_tags, sort_order)
        VALUES
        (
            binod_id,
            'Investfly',
            'Algorithmic trading platform for stocks, options, and futures with a stock market game.',
            ARRAY['ReactJS', 'REST API', 'JavaScript'],
            'https://www.investfly.com/images/logos/logo-white.png',
            '#', -- Placeholder, update with actual link
            '#', -- Placeholder
            'professional_employment',
            ARRAY['FinTech', 'Trading Platform', 'Frontend'],
            1
        ),
        (
            binod_id,
            'nbimf.com',
            'Platform for civil engineering students: blogs, BIM resources.',
            ARRAY['NextJS', 'ReactJS', 'NodeJS', 'ExpressJS', 'MongoDB', 'JavaScript'],
            'https://nbimf.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FNBIMF-logo.bbba72d3.png&w=128&q=75',
            'https://nbimf.com',
            '#', -- Placeholder
            'professional_freelance',
            ARRAY['Civil Engineering', 'BIM', 'Full Stack', 'Content Platform'],
            2
        ),
        (
            binod_id,
            'forefronteng.com',
            'Portfolio with blogs, project showcases, e-commerce for civil software, and training booking.',
            ARRAY['NextJS', 'ReactJS', 'NodeJS', 'ExpressJS', 'MySQL', 'JavaScript', 'E-commerce'],
            'https://forefronteng.com/_next/image?url=%2Fimg%2Flogo.png&w=256&q=75',
            '#', -- Placeholder
            '#', -- Placeholder
            'professional_freelance',
            ARRAY['Portfolio', 'E-commerce', 'Full Stack', 'Civil Engineering Software'],
            3
        ),
        (
            binod_id,
            'AI Movie Suggester',
            'Get personalized movie recommendations based on your mood and preferences, powered by AI.',
            ARRAY['NextJS', 'Supabase', 'TailwindCSS', 'Genkit AI'],
            'https://placehold.co/600x400.png', -- Placeholder for image
            '#',
            '#',
            'personal',
            ARRAY['AI', 'Entertainment', 'Next.js', 'Supabase'],
            10
        ) ON CONFLICT (title) DO NOTHING; -- Assuming title should be unique per user for projects
    END IF;

    -- 7. Contact Submissions (Sample)
    INSERT INTO contact_submissions (name, email, message) VALUES
        ('John Doe', 'john.doe@example.com', 'Interested in your services!'),
        ('Jane Smith', 'jane.smith@example.com', 'Great portfolio, Binod!')
    ON CONFLICT DO NOTHING; -- Needs a unique constraint to use ON CONFLICT meaningfully

    RAISE NOTICE 'Seed data script completed.';
END $$;
