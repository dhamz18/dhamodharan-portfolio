import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Plus, Trash2, Save, Upload } from 'lucide-react';
import { supabase, fetchSiteContent, saveSiteContent, uploadImage, SiteContent } from '../lib/supabase';
import {
  profile as fallbackProfile,
  skills as fallbackSkills,
  timeline as fallbackTimeline,
  projects as fallbackProjects,
  certifications as fallbackCertifications,
} from '../data/content';
import type { Session } from '@supabase/supabase-js';

const defaultContent: SiteContent = {
  profile: fallbackProfile,
  skills: fallbackSkills,
  timeline: fallbackTimeline,
  projects: fallbackProjects,
  certifications: fallbackCertifications,
};

const TABS = ['Profile', 'Skills', 'Timeline', 'Projects', 'Certifications'] as const;
type Tab = (typeof TABS)[number];

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [tab, setTab] = useState<Tab>('Profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load content
  useEffect(() => {
    if (!session) return;
    fetchSiteContent().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setContent({
          profile: { ...defaultContent.profile!, ...(data.profile || {}) },
          skills: data.skills?.length ? data.skills : defaultContent.skills,
          timeline: data.timeline?.length ? data.timeline : defaultContent.timeline,
          projects: data.projects?.length ? data.projects : defaultContent.projects,
          certifications: data.certifications?.length
            ? data.certifications
            : defaultContent.certifications,
        });
      }
    });
  }, [session]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteContent(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
    setSaving(false);
  };

  const handleUpload = async (file: File, cb: (url: string) => void) => {
    try {
      const url = await uploadImage(file);
      cb(url);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    }
  };

  // ---------- LOGIN SCREEN ----------
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-black">
        <motion.form
          onSubmit={login}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="royal-card p-8 w-full max-w-md space-y-5"
        >
          <h1 className="font-royal text-3xl gradient-text text-center mb-2">
            Admin Login
          </h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-3 text-white focus:border-yellow-500/60 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-3 text-white focus:border-yellow-500/60 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-red-700 to-red-600 text-white font-medium"
          >
            Login
          </button>
        </motion.form>
      </div>
    );
  }

  // ---------- ADMIN DASHBOARD ----------
  return (
    <div className="min-h-screen bg-black p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-royal text-3xl gradient-text">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-700 to-red-600 text-white text-sm disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                tab === t
                  ? 'bg-red-700 text-white'
                  : 'border border-red-900/50 text-white/60 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="royal-card p-6 space-y-4">
          {/* -------- PROFILE -------- */}
          {tab === 'Profile' && content.profile && (
            <>
              <h2 className="font-royal text-xl text-yellow-400 mb-4">Profile & Contact</h2>
              {(
                [
                  ['name', 'Name'],
                  ['role', 'Role'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['location', 'Location'],
                  ['linkedin', 'LinkedIn URL'],
                  ['github', 'GitHub URL'],
                  ['resumeUrl', 'Resume URL (e.g. /resume.pdf)'],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-1 block">
                    {label}
                  </label>
                  <input
                    value={(content.profile as any)[key] || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile!, [key]: e.target.value },
                      })
                    }
                    className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              ))}

              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest mb-1 block">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={content.profile.bio}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      profile: { ...content.profile!, bio: e.target.value },
                    })
                  }
                  className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest mb-1 block">
                  Profile Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    value={content.profile.profileImage}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile!, profileImage: e.target.value },
                      })
                    }
                    className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                  />
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm">
                    <Upload size={14} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files &&
                        handleUpload(e.target.files[0], (url) =>
                          setContent({
                            ...content,
                            profile: { ...content.profile!, profileImage: url },
                          })
                        )
                      }
                    />
                  </label>
                </div>
                {content.profile.profileImage && (
                  <img
                    src={content.profile.profileImage}
                    alt="preview"
                    className="mt-3 w-24 h-24 object-cover rounded-lg border border-red-900/50"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                )}
              </div>
            </>
          )}

          {/* -------- SKILLS -------- */}
          {tab === 'Skills' && content.skills && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-royal text-xl text-yellow-400">Skills</h2>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      skills: [
                        ...(content.skills || []),
                        { icon: 'Code2', title: 'New Category', skills: ['Skill 1'] },
                      ],
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              {content.skills.map((cat, i) => (
                <div key={i} className="border border-red-900/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <select
                      value={cat.icon}
                      onChange={(e) => {
                        const next = [...content.skills!];
                        next[i] = { ...cat, icon: e.target.value };
                        setContent({ ...content, skills: next });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-3 py-2 text-white"
                    >
                      {['Code2', 'Database', 'Brain', 'Wrench'].map((ic) => (
                        <option key={ic}>{ic}</option>
                      ))}
                    </select>
                    <input
                      value={cat.title}
                      onChange={(e) => {
                        const next = [...content.skills!];
                        next[i] = { ...cat, title: e.target.value };
                        setContent({ ...content, skills: next });
                      }}
                      className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <button
                      onClick={() => {
                        const next = content.skills!.filter((_, idx) => idx !== i);
                        setContent({ ...content, skills: next });
                      }}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <input
                    value={cat.skills.join(', ')}
                    onChange={(e) => {
                      const next = [...content.skills!];
                      next[i] = {
                        ...cat,
                        skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      };
                      setContent({ ...content, skills: next });
                    }}
                    placeholder="Skill1, Skill2, Skill3"
                    className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              ))}
            </>
          )}

          {/* -------- TIMELINE -------- */}
          {tab === 'Timeline' && content.timeline && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-royal text-xl text-yellow-400">
                  Education & Experience
                </h2>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      timeline: [
                        ...(content.timeline || []),
                        { type: 'edu', year: '2025', title: 'New Item', place: '', meta: '' },
                      ],
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>

              {content.timeline.map((item, i) => (
                <div key={i} className="border border-red-900/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <select
                      value={item.type}
                      onChange={(e) => {
                        const next = [...content.timeline!];
                        next[i] = { ...item, type: e.target.value as 'edu' | 'exp' };
                        setContent({ ...content, timeline: next });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="edu">Education</option>
                      <option value="exp">Experience</option>
                    </select>
                    <input
                      value={item.year}
                      onChange={(e) => {
                        const next = [...content.timeline!];
                        next[i] = { ...item, year: e.target.value };
                        setContent({ ...content, timeline: next });
                      }}
                      placeholder="Year"
                      className="w-32 bg-black/60 border border-red-900/50 rounded-lg px-3 py-2 text-white"
                    />
                    <button
                      onClick={() =>
                        setContent({
                          ...content,
                          timeline: content.timeline!.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-red-500 hover:text-red-400 ml-auto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {(['title', 'place', 'meta'] as const).map((k) => (
                    <input
                      key={k}
                      placeholder={k}
                      value={item[k]}
                      onChange={(e) => {
                        const next = [...content.timeline!];
                        next[i] = { ...item, [k]: e.target.value };
                        setContent({ ...content, timeline: next });
                      }}
                      className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                  ))}
                </div>
              ))}
            </>
          )}

          {/* -------- PROJECTS -------- */}
          {tab === 'Projects' && content.projects && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-royal text-xl text-yellow-400">Projects</h2>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      projects: [
                        ...(content.projects || []),
                        {
                          title: 'New Project',
                          date: '2025',
                          desc: '',
                          tech: [],
                          image: '',
                          github: '',
                          live: '',
                        },
                      ],
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              {content.projects.map((p, i) => (
                <div key={i} className="border border-red-900/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      value={p.title}
                      onChange={(e) => {
                        const next = [...content.projects!];
                        next[i] = { ...p, title: e.target.value };
                        setContent({ ...content, projects: next });
                      }}
                      placeholder="Title"
                      className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      value={p.date}
                      onChange={(e) => {
                        const next = [...content.projects!];
                        next[i] = { ...p, date: e.target.value };
                        setContent({ ...content, projects: next });
                      }}
                      placeholder="Date"
                      className="w-32 bg-black/60 border border-red-900/50 rounded-lg px-3 py-2 text-white"
                    />
                    <button
                      onClick={() =>
                        setContent({
                          ...content,
                          projects: content.projects!.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <textarea
                    placeholder="Description"
                    rows={2}
                    value={p.desc}
                    onChange={(e) => {
                      const next = [...content.projects!];
                      next[i] = { ...p, desc: e.target.value };
                      setContent({ ...content, projects: next });
                    }}
                    className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white resize-none"
                  />

                  <input
                    placeholder="Tech stack (comma separated)"
                    value={p.tech.join(', ')}
                    onChange={(e) => {
                      const next = [...content.projects!];
                      next[i] = {
                        ...p,
                        tech: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      };
                      setContent({ ...content, projects: next });
                    }}
                    className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="GitHub URL"
                      value={p.github}
                      onChange={(e) => {
                        const next = [...content.projects!];
                        next[i] = { ...p, github: e.target.value };
                        setContent({ ...content, projects: next });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      placeholder="Live URL"
                      value={p.live}
                      onChange={(e) => {
                        const next = [...content.projects!];
                        next[i] = { ...p, live: e.target.value };
                        setContent({ ...content, projects: next });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      placeholder="Image URL"
                      value={p.image}
                      onChange={(e) => {
                        const next = [...content.projects!];
                        next[i] = { ...p, image: e.target.value };
                        setContent({ ...content, projects: next });
                      }}
                      className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm">
                      <Upload size={14} /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files &&
                          handleUpload(e.target.files[0], (url) => {
                            const next = [...content.projects!];
                            next[i] = { ...p, image: url };
                            setContent({ ...content, projects: next });
                          })
                        }
                      />
                    </label>
                  </div>

                  {p.image && (
                    <img
                      src={p.image}
                      alt="preview"
                      className="w-full max-w-xs aspect-video object-cover rounded-lg border border-red-900/50"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {/* -------- CERTIFICATIONS -------- */}
          {tab === 'Certifications' && content.certifications && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-royal text-xl text-yellow-400">Certifications</h2>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      certifications: [
                        ...(content.certifications || []),
                        { title: 'New Cert', issuer: '', year: '2025' },
                      ],
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm"
                >
                  <Plus size={14} /> Add Certification
                </button>
              </div>

              {content.certifications.map((c, i) => (
                <div key={i} className="border border-red-900/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      value={c.title}
                      onChange={(e) => {
                        const next = [...content.certifications!];
                        next[i] = { ...c, title: e.target.value };
                        setContent({ ...content, certifications: next });
                      }}
                      placeholder="Title"
                      className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <button
                      onClick={() =>
                        setContent({
                          ...content,
                          certifications: content.certifications!.filter(
                            (_, idx) => idx !== i
                          ),
                        })
                      }
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Issuer"
                      value={c.issuer}
                      onChange={(e) => {
                        const next = [...content.certifications!];
                        next[i] = { ...c, issuer: e.target.value };
                        setContent({ ...content, certifications: next });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      placeholder="Year / Score"
                      value={c.year}
                      onChange={(e) => {
                        const next = [...content.certifications!];
                        next[i] = { ...c, year: e.target.value };
                        setContent({ ...content, certifications: next });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      placeholder="Certificate image URL"
                      value={c.image_url || ''}
                      onChange={(e) => {
                        const next = [...content.certifications!];
                        next[i] = { ...c, image_url: e.target.value };
                        setContent({ ...content, certifications: next });
                      }}
                      className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm">
                      <Upload size={14} /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files &&
                          handleUpload(e.target.files[0], (url) => {
                            const next = [...content.certifications!];
                            next[i] = { ...c, image_url: url };
                            setContent({ ...content, certifications: next });
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <p className="text-white/40 text-xs mt-6 text-center">
          Click <strong className="text-red-400">Save Changes</strong> at the top to publish your
          updates to the live site.
        </p>
      </div>
    </div>
  );
}