import { createClient } from '@supabase/supabase-js';
import type { PersonalInfo, Post } from '@/lib/supabase-types';

/** Cookie-less Supabase client for cacheable public reads (sitemap, metadata). */
function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function fetchPublicPersonalInfo(): Promise<PersonalInfo | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('SEO: failed to fetch personal info.', error.message);
    }
    return null;
  }

  return data;
}

export async function fetchPublicPosts(): Promise<Post[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Sitemap: failed to fetch public posts.', error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchPublicPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('SEO: failed to fetch post by slug.', error.message);
    }
    return null;
  }

  return data;
}
