
--
-- Create custom types
--
CREATE TYPE public.project_type_enum AS ENUM ('personal', 'professional_freelance', 'professional_employment');

--
-- Create Tables
--

-- Personal Info Table (Single row for the portfolio owner)
CREATE TABLE IF NOT EXISTS public.personal_info (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    title text NOT NULL,
    subtitle text,
    bio text,
    position text,
    location text,
    cv_url text,
    contact_email text NOT NULL,
    phone text,
    github_url text,
    linkedin_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.personal_info IS 'Stores the core personal information for the portfolio owner.';

-- Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info_id uuid NOT NULL REFERENCES public.personal_info(id) ON DELETE CASCADE,
    job_title text NOT NULL,
    company text NOT NULL,
    location text,
    start_date date,
    end_date date,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.experience IS 'Stores professional work experience entries.';

-- Education Table
CREATE TABLE IF NOT EXISTS public.education (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info_id uuid NOT NULL REFERENCES public.personal_info(id) ON DELETE CASCADE,
    degree text NOT NULL,
    institution text NOT NULL,
    location text,
    start_date date,
    end_date date,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.education IS 'Stores educational history.';

-- Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info_id uuid NOT NULL REFERENCES public.personal_info(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    date_achieved date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.achievements IS 'Stores notable achievements and awards.';

-- Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info_id uuid NOT NULL REFERENCES public.personal_info(id) ON DELETE CASCADE,
    name text NOT NULL,
    issuing_organization text NOT NULL,
    issue_date date,
    expiration_date date,
    credential_id text,
    credential_url text,
    certificate_pdf_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.certifications IS 'Stores professional certifications.';

-- Skill Categories Table
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.skill_categories IS 'Categories to group skills, e.g., Frontend, Backend.';

-- Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_category_id uuid NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
    name text NOT NULL,
    level text CHECK (level IN ('Basic', 'Intermediate', 'Expert')),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.skills IS 'Individual skills and their proficiency levels.';

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info_id uuid NOT NULL REFERENCES public.personal_info(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    long_description text,
    technologies text[],
    cover_image_url text,
    live_link text,
    github_link text,
    project_type public.project_type_enum NOT NULL,
    category_tags text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.projects IS 'Portfolio projects.';

-- Posts Table (for Blog)
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info_id uuid NOT NULL REFERENCES public.personal_info(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    snippet text,
    tags text[],
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.posts IS 'Blog posts.';

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.contact_submissions IS 'Messages sent from the public contact form.';


--
-- Enable Row Level Security (RLS)
--
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

--
-- RLS Policies
--

-- Policies for personal_info
CREATE POLICY "Public can read personal info" ON public.personal_info FOR SELECT USING (true);
CREATE POLICY "Owner can manage their personal info" ON public.personal_info FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for experience
CREATE POLICY "Public can read experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Owner can manage their experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for education
CREATE POLICY "Public can read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Owner can manage their education" ON public.education FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for achievements
CREATE POLICY "Public can read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Owner can manage their achievements" ON public.achievements FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for certifications
CREATE POLICY "Public can read certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Owner can manage their certifications" ON public.certifications FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for skill_categories
CREATE POLICY "Public can read skill categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Owner can manage skill categories" ON public.skill_categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for skills
CREATE POLICY "Public can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Owner can manage skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for projects
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Owner can manage projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for posts
CREATE POLICY "Public can read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Owner can manage posts" ON public.posts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for contact_submissions (PRIVATE)
CREATE POLICY "Owner can read and manage contact submissions" ON public.contact_submissions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


--
-- Create Storage Buckets
--

-- Bucket for project cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('projects', 'projects', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read project images" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Owner can manage project images" ON storage.objects FOR ALL USING (bucket_id = 'projects' AND auth.role() = 'authenticated') WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- Bucket for certification PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('certifications', 'certifications', true, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read certification PDFs" ON storage.objects FOR SELECT USING (bucket_id = 'certifications');
CREATE POLICY "Owner can manage certification PDFs" ON storage.objects FOR ALL USING (bucket_id = 'certifications' AND auth.role() = 'authenticated') WITH CHECK (bucket_id = 'certifications' AND auth.role() = 'authenticated');


--
-- Seed Initial Data
--

DO $$
DECLARE
    binod_user_id uuid := '8f8d9a6a-2b3c-4d5e-8f9a-0b1c2d3e4f5a';
    frontend_cat_id uuid;
    backend_cat_id uuid;
    database_cat_id uuid;
    tools_cat_id uuid;
BEGIN
    -- Seed Personal Info (ONLY IF THE TABLE IS EMPTY)
    IF NOT EXISTS (SELECT 1 FROM public.personal_info) THEN
        INSERT INTO public.personal_info (id, name, title, contact_email, phone, location, github_url, linkedin_url, cv_url, subtitle, bio, position)
        VALUES (
            binod_user_id,
            'Binod Nagarkoti',
            'Frontend & Full Stack Developer',
            'binod1365@gmail.com',
            '+9779803135946',
            'Kathmandu, Nepal',
            'https://github.com/BinodNagarkoti',
            'https://linkedin.com/in/binod-nagarkoti-496245128',
            '/binod_nagarkoti.pdf',
            'Passionate about building modern web experiences.',
            'A passionate developer specializing in creating modern and performant web applications with a focus on user experience and clean code.',
            'Full Stack Developer'
        );
    ELSE
        -- If data exists, just get the ID for foreign key relations
        SELECT id INTO binod_user_id FROM public.personal_info LIMIT 1;
    END IF;

    -- Seed Skill Categories and Skills (ONLY IF EMPTY)
    IF NOT EXISTS (SELECT 1 FROM public.skill_categories) THEN
        INSERT INTO public.skill_categories (name) VALUES ('Frontend Development') RETURNING id INTO frontend_cat_id;
        INSERT INTO public.skill_categories (name) VALUES ('Backend Development') RETURNING id INTO backend_cat_id;
        INSERT INTO public.skill_categories (name) VALUES ('Databases') RETURNING id INTO database_cat_id;
        INSERT INTO public.skill_categories (name) VALUES ('Tools & Platforms') RETURNING id INTO tools_cat_id;
        
        -- Frontend Skills
        INSERT INTO public.skills (skill_category_id, name, level) VALUES
            (frontend_cat_id, 'React', 'Expert'),
            (frontend_cat_id, 'Next.js', 'Expert'),
            (frontend_cat_id, 'TypeScript', 'Intermediate'),
            (frontend_cat_id, 'Tailwind CSS', 'Expert'),
            (frontend_cat_id, 'Vite', 'Intermediate'),
            (frontend_cat_id, 'JavaScript (ES6+)', 'Expert');

        -- Backend Skills
        INSERT INTO public.skills (skill_category_id, name, level) VALUES
            (backend_cat_id, 'Node.js', 'Intermediate'),
            (backend_cat_id, 'Express.js', 'Intermediate'),
            (backend_cat_id, 'Genkit AI', 'Basic');

        -- Database Skills
        INSERT INTO public.skills (skill_category_id, name, level) VALUES
            (database_cat_id, 'PostgreSQL', 'Intermediate'),
            (database_cat_id, 'MongoDB', 'Basic'),
            (database_cat_id, 'Supabase', 'Intermediate');

        -- Tools & Platforms Skills
        INSERT INTO public.skills (skill_category_id, name, level) VALUES
            (tools_cat_id, 'Git & GitHub', 'Expert'),
            (tools_cat_id, 'Docker', 'Basic'),
            (tools_cat_id, 'Vercel', 'Intermediate');
    END IF;
    
    -- Seed Experience (ONLY IF EMPTY)
    IF NOT EXISTS (SELECT 1 FROM public.experience) THEN
        INSERT INTO public.experience (personal_info_id, job_title, company, location, start_date, end_date, description)
        VALUES
            (binod_user_id, 'Full Stack Developer', 'Tech Solutions Inc.', 'Remote', '2022-01-15', NULL, 'Developed and maintained full-stack web applications using React, Node.js, and PostgreSQL. Collaborated with a team of 5 developers to deliver high-quality software solutions.'),
            (binod_user_id, 'Frontend Developer', 'WebCrafters LLC', 'Kathmandu, NP', '2020-06-01', '2021-12-31', 'Built responsive and interactive user interfaces for client websites using HTML, CSS, and JavaScript. Specialized in creating pixel-perfect designs from Figma mockups.');
    END IF;

    -- Seed Education (ONLY IF EMPTY)
    IF NOT EXISTS (SELECT 1 FROM public.education) THEN
        INSERT INTO public.education (personal_info_id, degree, institution, location, start_date, end_date, description)
        VALUES
            (binod_user_id, 'B.Sc. in Computer Science', 'Tribhuvan University', 'Kathmandu, NP', '2016-09-01', '2020-07-15', 'Focused on software engineering principles, data structures, and algorithms. Completed a final year project on a real-time chat application.');
    END IF;

    -- Seed Projects (ONLY IF EMPTY)
    IF NOT EXISTS (SELECT 1 FROM public.projects) THEN
        INSERT INTO public.projects (personal_info_id, title, description, technologies, project_type, category_tags, live_link, github_link)
        VALUES
            (binod_user_id, 'E-commerce Platform', 'A full-featured online store with Stripe integration and an admin dashboard.', ARRAY['Next.js', 'Stripe', 'Supabase', 'Tailwind CSS'], 'personal', ARRAY['E-commerce', 'FinTech'], 'https://example.com', 'https://github.com/BinodNagarkoti/example-repo'),
            (binod_user_id, 'Binod Portfolio', 'A personal portfolio website built with Next.js and managed via a custom CMS.', ARRAY['Next.js', 'Genkit', 'Supabase', 'ShadCN UI'], 'personal', ARRAY['Web Development', 'CMS'], 'https://example.com', 'https://github.com/BinodNagarkoti/example-repo');
    END IF;

    -- Seed Blog Post (ONLY IF EMPTY)
    IF NOT EXISTS (SELECT 1 FROM public.posts) THEN
        INSERT INTO public.posts (personal_info_id, title, content, snippet, tags, published_at)
        VALUES
            (binod_user_id, 'First Impressions of Next.js 15', 'Next.js 15 brings a lot of new features to the table. In this post, we will explore some of the most exciting updates...', 'Next.js 15 brings a lot of new features...', ARRAY['Next.js', 'React', 'Web Dev'], NOW());
    END IF;

END $$;
