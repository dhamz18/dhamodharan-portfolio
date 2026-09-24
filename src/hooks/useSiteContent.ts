import { useEffect, useState } from 'react';
import { fetchSiteContent, SiteContent } from '../lib/supabase';
import {
  profile as fallbackProfile,
  skills as fallbackSkills,
  timeline as fallbackTimeline,
  projects as fallbackProjects,
  certifications as fallbackCertifications,
} from '../data/content';

const fallback: SiteContent = {
  profile: fallbackProfile,
  skills: fallbackSkills,
  timeline: fallbackTimeline as Array<{
    type: 'edu' | 'exp';
    year: string;
    title: string;
    place: string;
    meta: string;
  }>,
  projects: fallbackProjects,
  certifications: fallbackCertifications.map((c) => ({
    title: c.title,
    issuer: c.issuer,
    year: c.year,
  })),
};

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchSiteContent()
      .then((data) => {
        if (!mounted) return;
        if (data && Object.keys(data).length > 0) {
          setContent({
            profile: { ...fallback.profile!, ...(data.profile || {}) },
            skills: data.skills?.length ? data.skills : fallback.skills,
            timeline: data.timeline?.length
              ? (data.timeline as Array<{
                  type: 'edu' | 'exp';
                  year: string;
                  title: string;
                  place: string;
                  meta: string;
                }>)
              : fallback.timeline,
            projects: data.projects?.length ? data.projects : fallback.projects,
            certifications: data.certifications?.length
              ? data.certifications
              : fallback.certifications,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return { content, loading };
}