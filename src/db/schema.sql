-- SQL schema for Binodfolio CMS

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Personal Information Table
CREATE TABLE IF NOT EXISTS personal_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT, -- e.g., "Frontend & Full Stack Developer"
    subtitle TEXT, -- AI Generated or Manual
    bio TEXT, -- AI Generated or Manual
    "position" TEXT, -- e.g., "Lead Developer" (use quotes for reserved keywords)
    location TEXT, -- e.g., "Kathmandu, Nepal"
    cv_url TEXT, -- URL to the CV PDF in Supabase Storage
    contact_email TEXT NOT NULL,
    phone TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education Table (Multiple entries per person)
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    personal_info_id UUID REFERENCES personal_info(id) ON DELETE CASCADE,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    start_year INTEGER,
    end_year INTEGER,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience Table (Multiple entries per person)
CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    personal_info_id UUID REFERENCES personal_info(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date DATE,
    end_date DATE, -- Nullable if current job
    description TEXT,
    responsibilities TEXT[], -- Array of text
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    personal_info_id UUID REFERENCES personal_info(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date_achieved DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    personal_info_id UUID REFERENCES personal_info(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date DATE,
    expiration_date DATE, -- Nullable
    credential_id TEXT,
    credential_url TEXT,
    certificate_pdf_url TEXT, -- URL to PDF in Supabase Storage
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Categories Table
CREATE TABLE IF NOT EXISTS skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0, -- For ordering categories in the UI
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills Table (Multiple skills per category)
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT, -- e.g., "Expert", "Intermediate", "Basic"
    sort_order INTEGER DEFAULT 0, -- For ordering skills within a category
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (skill_category_id, name)
);

-- Project Type Enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_type_enum') THEN
        CREATE TYPE project_type_enum AS ENUM ('personal', 'professional_freelance', 'professional_employment');
    END IF;
END$$;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    personal_info_id UUID REFERENCES personal_info(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    technologies TEXT[], -- Array of text
    cover_image_url TEXT, -- URL to image in Supabase Storage
    live_link TEXT,
    github_link TEXT,
    project_type project_type_enum DEFAULT 'personal',
    category_tags TEXT[], -- Array of text, e.g., ["FinTech", "E-commerce"]
    sort_order INTEGER DEFAULT 0, -- For ordering projects
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

-- Trigger function to update "updated_at" columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
DO $$
DECLARE
  t_name TEXT;
BEGIN
  FOR t_name IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'updated_at' 
    AND table_schema = 'public' -- or your specific schema
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'trigger_update_updated_at' AND tgrelid = t_name::regclass
    ) THEN
      EXECUTE format('CREATE TRIGGER trigger_update_updated_at
                      BEFORE UPDATE ON %I
                      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', t_name);
    END IF;
  END LOOP;
END$$;

-- RLS Policies (Basic examples - adjust as needed)
-- Make sure to enable RLS on each table in Supabase UI after creation.

-- Example: Public read for personal_info (adjust for other tables)
-- ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public personal_info are viewable by everyone."
--   ON personal_info FOR SELECT
--   USING ( true );

-- Example: Users can insert their own contact submissions
-- ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can insert their own contact submissions."
--   ON contact_submissions FOR INSERT
--   WITH CHECK (true); -- Or add auth.uid() = user_id if you have user tracking

-- Add other policies as needed for admin access (e.g., based on user roles)
-- CREATE POLICY "Admins can manage all data."
--   ON your_table_name FOR ALL
--   USING (is_admin_user()) -- Requires a custom is_admin_user() function
--   WITH CHECK (is_admin_user());

COMMENT ON COLUMN personal_info.cv_url IS 'URL to the CV PDF in Supabase Storage. Actual upload handled by application.';
COMMENT ON COLUMN certifications.certificate_pdf_url IS 'URL to certificate PDF in Supabase Storage. Actual upload handled by application.';
COMMENT ON COLUMN projects.cover_image_url IS 'URL to project cover image in Supabase Storage. Actual upload handled by application.';

