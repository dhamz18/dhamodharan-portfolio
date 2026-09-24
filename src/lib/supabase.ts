import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type SiteContent = {
  profile?: {
    name: string;
    role: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    resumeUrl: string;
    profileImage: string;
  };
  skills?: Array<{ icon: string; title: string; skills: string[] }>;
  timeline?: Array<{
    type: 'edu' | 'exp';
    year: string;
    title: string;
    place: string;
    meta: string;
  }>;
  projects?: Array<{
    title: string;
    date: string;
    desc: string;
    tech: string[];
    image: string;
    github: string;
    live: string;
    disclaimer?: string;
  }>;
  certifications?: Array<{
    title: string;
    issuer: string;
    year: string;
    image_url?: string;
  }>;
};

export async function fetchSiteContent(): Promise<SiteContent | null> {
  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 1)
    .single();
  if (error || !data) return null;
  return data.data as SiteContent;
}

export async function saveSiteContent(content: SiteContent) {
  const { error } = await supabase
    .from('site_content')
    .update({ data: content, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw error;
}

// Upload any file (image OR PDF) and return public URL
export async function uploadFile(file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from('images')
    .upload(path, file, { upsert: true, cacheControl: '3600' });
  if (error) throw error;
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}

// Legacy alias
export const uploadImage = uploadFile;