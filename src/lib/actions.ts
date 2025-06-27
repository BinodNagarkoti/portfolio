
'use server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import type { PersonalInfo, Project, SkillCategoryWithSkills, Skill, SkillCategory, Experience, Education, Post, ContactSubmission, Achievement, Certification } from './supabase-types';
import { z } from 'zod';
export async function login(formData: FormData) {
    const supabase = await createSupabaseServerClient()  // type-casting here for convenience  // in practice, you should validate your inputs  
    const data = { email: formData.get('email') as string, password: formData.get('password') as string, }
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
        redirect('/error')
    }
    revalidatePath('/', 'layout')
    redirect('/')
}
export async function getPersonalInfo(): Promise<PersonalInfo | null> {
    noStore();
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.from('personal_info').select('*').limit(1).single();

    if (error) {
        if (error.code === 'PGRST116') {
            console.log('No personal info found in database. This is expected if it has not been set yet.');
            return null;
        }
        console.error('Database Error: Failed to Fetch Personal Info.', error);
        return null;
    }

    return data;
}


// Schema for project form validation
const ProjectSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    long_description: z.string().optional(),
    technologies: z.string().optional(),
    cover_image_url: z.string().optional(),
    live_link: z.string().url().optional().or(z.literal('')),
    github_link: z.string().url().optional().or(z.literal('')),
    project_type: z.enum(['personal', 'professional_freelance', 'professional_employment']),
    category_tags: z.string().optional(),
});


export async function getProjects(): Promise<{ data: Project[] | null, error: string | null }> {
    noStore();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Database Error: Failed to Fetch Projects.', error);
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

export async function getProjectsForAdmin(): Promise<{ data: Project[] | null, error: string | null }> {
    noStore(); // Add noStore to prevent caching
    const supabase = await createSupabaseServerClient(true);
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Database Error: Failed to Fetch Projects for Admin.', error);
        return { data: null, error: error.message };
    }

    return { data, error: null };
}

export async function upsertProject(formData: FormData): Promise<{ data: Project | null, error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const personalInfo = await getPersonalInfo();

    if (!personalInfo) {
        return { data: null, error: 'Could not find personal info to associate project with.' };
    }

    const rawFormData = Object.fromEntries(formData.entries());

    const validatedFields = ProjectSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        console.error('Form validation error:', validatedFields.error.flatten().fieldErrors);
        return { data: null, error: 'Invalid form data.' };
    }

    let coverImageUrl = validatedFields.data.cover_image_url || null;
    const imageFile = formData.get('cover_image') as File | null;

    if (imageFile && imageFile.size > 0) {
        const fileName = `${personalInfo.id}/${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('projects') // Assuming 'projects' is your storage bucket name
            .upload(fileName, imageFile, { upsert: true });

        if (uploadError) {
            console.error('Storage Error:', uploadError);
            return { data: null, error: 'Failed to upload image.' };
        }

        const { data: urlData } = supabase.storage.from('projects').getPublicUrl(uploadData.path);
        coverImageUrl = urlData.publicUrl;
    }

    const stringToArray = (str: string | undefined) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];

    const dataToUpsert: Omit<Project, 'id' | 'created_at' | 'updated_at'> & { id?: string } = {
        ...validatedFields.data,
        personal_info_id: personalInfo.id,
        technologies: stringToArray(validatedFields.data.technologies),
        category_tags: stringToArray(validatedFields.data.category_tags),
        cover_image_url: coverImageUrl,
    };

    // If no ID, it's an insert. If ID exists, it's an update.
    if (!validatedFields.data.id) {
        delete dataToUpsert.id;
    }

    const { data, error } = await supabase
        .from('projects')
        .upsert(dataToUpsert)
        .select()
        .single();

    if (error) {
        console.error('Database Upsert Error:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/projects');

    return { data, error: null };
}

export async function deleteProject(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);

    // Also delete image from storage
    const { data: projectData, error: fetchError } = await supabase.from('projects').select('cover_image_url').eq('id', id).single();
    if (fetchError) {
        console.error('Could not fetch project to delete image:', fetchError);
    }
    if (projectData?.cover_image_url) {
        const path = new URL(projectData.cover_image_url).pathname.split('/projects/').pop();
        if (path) {
            await supabase.storage.from('projects').remove([path]);
        }
    }

    const { error } = await supabase.from('projects').delete().match({ id });

    if (error) {
        console.error('Database Delete Error:', error);
        return { error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/projects');

    return { error: null };
}

// SKILLS ACTIONS
export async function getSkillCategoriesWithSkills(): Promise<{ data: SkillCategoryWithSkills[] | null, error: string | null }> {
    noStore();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('skill_categories')
        .select('*, skills (*, skill_categories (name))')
        .order('name', { ascending: true });

    if (error) {
        console.error('Database Error: Failed to Fetch Skill Categories.', error);
        return { data: null, error: error.message };
    }

    return { data, error: null };
}


const SkillCategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Category name is required'),
});

export async function upsertSkillCategory(categoryData: { id?: string, name: string }): Promise<{ data: SkillCategory | null, error: string | null }> {
    const validatedFields = SkillCategorySchema.safeParse(categoryData);
    if (!validatedFields.success) {
        return { data: null, error: 'Invalid category data.' };
    }

    const supabase = await createSupabaseServerClient(true);
    const { data, error } = await supabase.from('skill_categories').upsert(validatedFields.data).select().single();

    if (error) return { data: null, error: error.message };
    revalidatePath('/admin/dashboard/skills');
    revalidatePath('/');
    return { data, error: null };
}

export async function deleteSkillCategory(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const { error } = await supabase.from('skill_categories').delete().match({ id });
    if (error) return { error: error.message };
    revalidatePath('/admin/dashboard/skills');
    revalidatePath('/');
    return { error: null };
}


const SkillSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Skill name is required'),
    level: z.string().nullable(),
    skill_category_id: z.string(),
});

export async function upsertSkill(skillData: { id?: string, name: string, level: string | null, skill_category_id: string }): Promise<{ data: Skill | null, error: string | null }> {
    const validatedFields = SkillSchema.safeParse(skillData);
    if (!validatedFields.success) {
        return { data: null, error: 'Invalid skill data.' };
    }

    const supabase = await createSupabaseServerClient(true);
    const { data, error } = await supabase.from('skills').upsert(validatedFields.data).select().single();

    if (error) return { data: null, error: error.message };
    revalidatePath('/admin/dashboard/skills');
    revalidatePath('/');
    return { data, error: null };
}

export async function deleteSkill(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const { error } = await supabase.from('skills').delete().match({ id });
    if (error) return { error: error.message };
    revalidatePath('/admin/dashboard/skills');
    revalidatePath('/');
    return { error: null };
}

// EXPERIENCE ACTIONS
export async function getExperience(): Promise<{ data: Experience[] | null, error: string | null }> {
    noStore();
    const personalInfo = await getPersonalInfo();
    if (!personalInfo) {
        return { data: [], error: null };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('experience')
        .select('*')
        .eq('personal_info_id', personalInfo.id)
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Database Error: Failed to Fetch Experience.', error);
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

const ExperienceSchema = z.object({
    id: z.string().optional(),
    job_title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    location: z.string().optional(),
    description: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().nullable().optional(),
});

export async function upsertExperience(formData: { id?: string, [key: string]: any }): Promise<{ data: Experience | null, error: string | null }> {
    const validatedFields = ExperienceSchema.safeParse(formData);

    if (!validatedFields.success) {
        console.error('Form validation error:', validatedFields.error.flatten().fieldErrors);
        return { data: null, error: 'Invalid form data.' };
    }

    const supabase = await createSupabaseServerClient(true);
    const { data: personalInfo } = await supabase.from('personal_info').select('id').single();

    if (!personalInfo) {
        return { data: null, error: 'Personal info not found.' };
    }

    const dataToUpsert = {
        ...validatedFields.data,
        personal_info_id: personalInfo.id,
    };

    const { data, error } = await supabase.from('experience').upsert(dataToUpsert).select().single();

    if (error) {
        console.error('Database Upsert Error:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/experience');

    return { data, error: null };
}

export async function deleteExperience(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const { error } = await supabase.from('experience').delete().match({ id });

    if (error) {
        console.error('Database Delete Error:', error);
        return { error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/experience');

    return { error: null };
}

// EDUCATION ACTIONS
export async function getEducation(): Promise<{ data: Education[] | null, error: string | null }> {
    noStore();
    const personalInfo = await getPersonalInfo();
    if (!personalInfo) {
        return { data: [], error: null };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('personal_info_id', personalInfo.id)
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Database Error: Failed to Fetch Education.', error);
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

const EducationSchema = z.object({
    id: z.string().optional(),
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    location: z.string().optional(),
    description: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().nullable().optional(),
});

export async function upsertEducation(formData: { id?: string, [key: string]: any }): Promise<{ data: Education | null, error: string | null }> {
    const validatedFields = EducationSchema.safeParse(formData);

    if (!validatedFields.success) {
        console.error('Form validation error:', validatedFields.error.flatten().fieldErrors);
        return { data: null, error: 'Invalid form data.' };
    }

    const supabase = await createSupabaseServerClient(true);
    const { data: personalInfo } = await supabase.from('personal_info').select('id').single();

    if (!personalInfo) {
        return { data: null, error: 'Personal info not found.' };
    }

    const dataToUpsert = {
        ...validatedFields.data,
        personal_info_id: personalInfo.id,
    };

    const { data, error } = await supabase.from('education').upsert(dataToUpsert).select().single();

    if (error) {
        console.error('Database Upsert Error:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/education');

    return { data, error: null };
}

export async function deleteEducation(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const { error } = await supabase.from('education').delete().match({ id });

    if (error) {
        console.error('Database Delete Error:', error);
        return { error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/education');

    return { error: null };
}

// POSTS (BLOG) ACTIONS
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export async function getPosts(options: { publishedOnly?: boolean; admin?: boolean } = {}): Promise<{ data: Post[] | null, error: string | null }> {
    const { publishedOnly = false, admin = false } = options;
    noStore();
    const supabase = await createSupabaseServerClient(admin);

    let query = supabase.from('posts').select('*');

    if (publishedOnly) {
        query = query.eq('published', true);
    }
    
    // In a multi-user CMS, you'd filter by personal_info_id here
    // For this single-user portfolio, admin sees all, public sees published.

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Database Error: Failed to Fetch Posts.', error.message);
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

export async function getPostBySlug(slug: string): Promise<{ data: Post | null, error: string | null }> {
    noStore();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
    
    if (error) {
        if (error.code !== 'PGRST116') { // Don't log "not found" as a server error
             console.error('Database Error: Failed to Fetch Post by Slug.', error.message);
        }
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.string().optional(),
  published_at: z.date().optional(),
});

export async function upsertPost(formData: { id?: string, [key: string]: any }): Promise<{ data: Post | null, error: string | null }> {
    const validatedFields = PostSchema.safeParse(formData);

    if (!validatedFields.success) {
        console.error('Form validation error:', validatedFields.error.flatten().fieldErrors);
        return { data: null, error: 'Invalid form data.' };
    }

    const supabase = await createSupabaseServerClient(true);
    const personalInfo = await getPersonalInfo();

    if (!personalInfo) {
        return { data: null, error: 'Personal info not found.' };
    }

    const stringToArray = (str: string | undefined) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];
    const snippet = validatedFields.data.content.substring(0, 150) + (validatedFields.data.content.length > 150 ? '...' : '');

    let slug = slugify(validatedFields.data.title);
    const { data: existingPost } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .not('id', 'eq', validatedFields.data.id || '00000000-0000-0000-0000-000000000000')
        .single();

    if (existingPost) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const dataToUpsert = {
        ...validatedFields.data,
        personal_info_id: personalInfo.id,
        slug: slug,
        tags: stringToArray(validatedFields.data.tags),
        snippet,
    };

    const { data, error } = await supabase.from('posts').upsert(dataToUpsert).select().single();

    if (error) {
        console.error('Database Upsert Error:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/blog'); // Revalidate the blog index
    revalidatePath(`/blog/${slug}`); // Revalidate the specific post page
    revalidatePath('/admin/dashboard/blog');

    return { data, error: null };
}

export async function deletePost(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const { error } = await supabase.from('posts').delete().match({ id });

    if (error) {
        console.error('Database Delete Error:', error);
        return { error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/blog');

    return { error: null };
}


// CONTACT SUBMISSION ACTIONS
const ContactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    message: z.string().min(1, 'Message is required'),
});

export async function submitContactForm(formData: { name: string, email: string, message: string }): Promise<{ data: ContactSubmission | null, error: string | null }> {
    const validatedFields = ContactFormSchema.safeParse(formData);
    if (!validatedFields.success) {
        return { data: null, error: 'Invalid form data.' };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('contact_submissions')
        .insert({ ...validatedFields.data })
        .select()
        .single();

    if (error) {
        console.error('Database Insert Error:', error);
        return { data: null, error: 'There was a problem submitting your message. Please try again.' };
    }

    revalidatePath('/admin/dashboard/contact-submissions');

    return { data, error: null };
}

export async function getContactSubmissions(): Promise<{ data: ContactSubmission[] | null, error: string | null }> {
    noStore();
    const supabase = await createSupabaseServerClient(true);
    const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

    if (error) {
        console.error('Database Error: Failed to Fetch Contact Submissions.', error.message);
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

export async function updateContactSubmissionReadStatus(id: string, is_read: boolean): Promise<{ data: ContactSubmission | null, error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const { data, error } = await supabase
        .from('contact_submissions')
        .update({ is_read })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Database Update Error:', error);
        return { data: null, error: error.message };
    }
    revalidatePath('/admin/dashboard/contact-submissions');
    return { data, error: null };
}

export async function deleteContactSubmission(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const { error } = await supabase.from('contact_submissions').delete().match({ id });

    if (error) {
        console.error('Database Delete Error:', error);
        return { error: error.message };
    }
    revalidatePath('/admin/dashboard/contact-submissions');
    return { error: null };
}

// ACHIEVEMENT ACTIONS
export async function getAchievements(): Promise<{ data: Achievement[] | null, error: string | null }> {
    noStore();
    const personalInfo = await getPersonalInfo();
    if (!personalInfo) {
        return { data: [], error: null };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('personal_info_id', personalInfo.id)
        .order('date_achieved', { ascending: false });

    if (error) {
        console.error('Database Error: Failed to Fetch Achievements.', error.message);
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

const AchievementSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    date_achieved: z.string().nullable().optional(),
});

export async function upsertAchievement(formData: { id?: string, [key: string]: any }): Promise<{ data: Achievement | null, error: string | null }> {
    const validatedFields = AchievementSchema.safeParse(formData);

    if (!validatedFields.success) {
        console.error('Form validation error:', validatedFields.error.flatten().fieldErrors);
        return { data: null, error: 'Invalid form data.' };
    }

    const supabase = await createSupabaseServerClient(true);
    const { data: personalInfo } = await supabase.from('personal_info').select('id').single();

    if (!personalInfo) {
        return { data: null, error: 'Personal info not found.' };
    }

    const dataToUpsert = {
        ...validatedFields.data,
        personal_info_id: personalInfo.id,
    };

    const { data, error } = await supabase.from('achievements').upsert(dataToUpsert).select().single();

    if (error) {
        console.error('Database Upsert Error:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/achievements');

    return { data, error: null };
}

export async function deleteAchievement(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const { error } = await supabase.from('achievements').delete().match({ id });

    if (error) {
        console.error('Database Delete Error:', error);
        return { error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/achievements');

    return { error: null };
}

// CERTIFICATION ACTIONS
export async function getCertifications(): Promise<{ data: Certification[] | null, error: string | null }> {
    noStore();
    const personalInfo = await getPersonalInfo();
    if (!personalInfo) {
        return { data: [], error: null };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('personal_info_id', personalInfo.id)
        .order('issue_date', { ascending: false });

    if (error) {
        console.error('Database Error: Failed to Fetch Certifications.', error.message);
        return { data: null, error: error.message };
    }
    return { data, error: null };
}

const CertificationSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    issuing_organization: z.string().min(1, 'Issuing organization is required'),
    issue_date: z.string().nullable().optional(),
    credential_id: z.string().optional(),
    credential_url: z.string().url().optional().or(z.literal('')),
    certificate_pdf_url: z.string().optional(),
});

export async function upsertCertification(formData: FormData): Promise<{ data: Certification | null, error: string | null }> {
    const supabase = await createSupabaseServerClient(true);
    const personalInfo = await getPersonalInfo();
    if (!personalInfo) {
        return { data: null, error: 'Could not find personal info to associate certification with.' };
    }

    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = CertificationSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        console.error('Form validation error:', validatedFields.error.flatten().fieldErrors);
        return { data: null, error: 'Invalid form data.' };
    }

    let pdfUrl = validatedFields.data.certificate_pdf_url || null;
    const pdfFile = formData.get('certificate_pdf') as File | null;

    if (pdfFile && pdfFile.size > 0) {
        const fileName = `certs/${personalInfo.id}/${Date.now()}_${pdfFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('certifications') // Bucket name
            .upload(fileName, pdfFile, { upsert: true });

        if (uploadError) {
            console.error('Storage Error:', uploadError);
            return { data: null, error: 'Failed to upload PDF.' };
        }

        const { data: urlData } = supabase.storage.from('certifications').getPublicUrl(uploadData.path);
        pdfUrl = urlData.publicUrl;
    }

    const dataToUpsert = {
        ...validatedFields.data,
        personal_info_id: personalInfo.id,
        certificate_pdf_url: pdfUrl,
    };
    if (!validatedFields.data.id) {
        delete (dataToUpsert as { id?: string }).id;
    }

    const { data, error } = await supabase.from('certifications').upsert(dataToUpsert).select().single();

    if (error) {
        console.error('Database Upsert Error:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/admin/dashboard/certifications');
    return { data, error: null };
}

export async function deleteCertification(id: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient(true);

    // Also delete PDF from storage
    const { data: certData, error: fetchError } = await supabase.from('certifications').select('certificate_pdf_url').eq('id', id).single();
    if (fetchError) {
        console.error('Could not fetch certification to delete PDF:', fetchError);
    }
    if (certData?.certificate_pdf_url) {
        const path = new URL(certData.certificate_pdf_url).pathname.split('/certifications/').pop();
        if (path) {
            await supabase.storage.from('certifications').remove([path]);
        }
    }

    const { error } = await supabase.from('certifications').delete().match({ id });

    if (error) {
        console.error('Database Delete Error:', error);
        return { error: error.message };
    }

    revalidatePath('/admin/dashboard/certifications');
    return { error: null };
}
