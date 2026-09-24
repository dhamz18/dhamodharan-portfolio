import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Plus, Trash2, Save, Upload, FileText,
  CheckCircle2, AlertCircle, RotateCcw, Eye, EyeOff
} from 'lucide-react';
import {
  supabase, fetchSiteContent, saveSiteContent, uploadFile, SiteContent
} from '../lib/supabase';
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

type Toast = { type: 'success' | 'error'; message: string } | null;

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [savedContent, setSavedContent] = useState<SiteContent>(defaultContent);
  const [tab, setTab] = useState<Tab>('Profile');

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const isDirty = JSON.stringify(content) !== JSON.stringify(savedContent);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load
  useEffect(() => {
    if (!session) return;
    fetchSiteContent().then((data) => {
      let merged: SiteContent = defaultContent;
      if (data && Object.keys(data).length > 0) {
        merged = {
          profile: { ...defaultContent.profile!, ...(data.profile || {}) },
          skills: data.skills?.length ? data.skills : defaultContent.skills,
          timeline: data.timeline?.length ? data.timeline : defaultContent.timeline,
          projects: data.projects?.length ? data.projects : defaultContent.projects,
          certifications: data.certifications?.length
            ? data.certifications
            : defaultContent.certifications,
        };
      }
      setContent(merged);
      setSavedContent(merged);
    });
  }, [session]);

  const handleSave = useCallback(async () => {
    if (!isDirty) {
      showToast('success', 'No changes to save');
      return;
    }
    setSaving(true);
    try {
      await saveSiteContent(content);
      setSavedContent(content);
      showToast('success', 'Changes saved & published!');
    } catch (err: any) {
      showToast('error', 'Save failed: ' + err.message);
    }
    setSaving(false);
  }, [content, isDirty]);

  const handleReset = () => {
    if (!confirm('Discard unsaved changes?')) return;
    setContent(savedContent);
    showToast('success', 'Reverted to last saved version');
  };

  // Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave]);

  // Warn on unsaved
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showToast('error', error.message);
  };

  const logout = async () => {
    if (isDirty && !confirm('Unsaved changes. Logout anyway?')) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleUpload = async (
    file: File,
    label: string,
    cb: (url: string) => void
  ) => {
    setUploading(label);
    try {
      const url = await uploadFile(file);
      cb(url);
      showToast('success', `${label} uploaded!`);
    } catch (err: any) {
      showToast('error', `Upload failed: ${err.message}`);
    }
    setUploading(null);
  };

  // ============ LOGIN ============
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
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-3 pr-12 text-white focus:border-yellow-500/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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

  // ============ DASHBOARD ============
  return (
    <div className="min-h-screen bg-black p-6 md:p-10">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-green-950/80 border-green-500/50 text-green-200'
                : 'bg-red-950/80 border-red-500/50 text-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-royal text-3xl gradient-text">Admin Dashboard</h1>
          <div className="flex gap-3 items-center flex-wrap">
            {isDirty && (
              <span className="text-xs text-yellow-400 flex items-center gap-1">
                <AlertCircle size={12} /> Unsaved
              </span>
            )}
            {isDirty && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/50 text-yellow-400 text-sm hover:bg-yellow-500/10"
              >
                <RotateCcw size={14} /> Undo
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-700 to-red-600 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <p className="text-white/30 text-xs mb-4">
          Tip: Press <kbd className="px-2 py-0.5 rounded bg-white/10 text-white/60">Ctrl + S</kbd> to save
        </p>

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

        <div className="royal-card p-6 space-y-4">
          {/* ============ PROFILE ============ */}
          {tab === 'Profile' && content.profile && (
            <>
              <h2 className="font-royal text-xl text-yellow-400 mb-4">
                Profile & Contact
              </h2>

              {/* Profile Photo */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-red-900/50 flex-shrink-0 bg-black/60">
                    {content.profile.profileImage ? (
                      <img
                        src={content.profile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).style.display = 'none')
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm hover:bg-red-600">
                    <Upload size={14} />
                    {uploading === 'Profile photo' ? 'Uploading...' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files &&
                        handleUpload(e.target.files[0], 'Profile photo', (url) =>
                          setContent({
                            ...content,
                            profile: { ...content.profile!, profileImage: url },
                          })
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Resume PDF */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">
                  Resume PDF
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <FileText className="text-red-500" size={20} />
                  <span className="text-white/60 text-sm truncate flex-1 min-w-[200px]">
                    {content.profile.resumeUrl || 'No resume uploaded'}
                  </span>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm hover:bg-red-600">
                    <Upload size={14} />
                    {uploading === 'Resume' ? 'Uploading...' : 'Upload Resume'}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files &&
                        handleUpload(e.target.files[0], 'Resume', (url) =>
                          setContent({
                            ...content,
                            profile: { ...content.profile!, resumeUrl: url },
                          })
                        )
                      }
                    />
                  </label>
                  {content.profile.resumeUrl && (
                    <a
                      href={content.profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-yellow-400 text-sm hover:underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>

              {/* Fields */}
              {(
                [
                  ['name', 'Name'],
                  ['role', 'Role'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['location', 'Location'],
                  ['linkedin', 'LinkedIn URL'],
                  ['github', 'GitHub URL'],
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
                    className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white focus:border-yellow-500/60 focus:outline-none"
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
                  className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white resize-none focus:border-yellow-500/60 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* ============ SKILLS ============ */}
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
                        const n = [...content.skills!];
                        n[i] = { ...cat, icon: e.target.value };
                        setContent({ ...content, skills: n });
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
                        const n = [...content.skills!];
                        n[i] = { ...cat, title: e.target.value };
                        setContent({ ...content, skills: n });
                      }}
                      className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <button
                      onClick={() =>
                        setContent({
                          ...content,
                          skills: content.skills!.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <input
                    value={cat.skills.join(', ')}
                    onChange={(e) => {
                      const n = [...content.skills!];
                      n[i] = {
                        ...cat,
                        skills: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      };
                      setContent({ ...content, skills: n });
                    }}
                    placeholder="Skill1, Skill2, Skill3"
                    className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              ))}
            </>
          )}

          {/* ============ TIMELINE ============ */}
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
                        const n = [...content.timeline!];
                        n[i] = { ...item, type: e.target.value as 'edu' | 'exp' };
                        setContent({ ...content, timeline: n });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="edu">Education</option>
                      <option value="exp">Experience</option>
                    </select>
                    <input
                      value={item.year}
                      onChange={(e) => {
                        const n = [...content.timeline!];
                        n[i] = { ...item, year: e.target.value };
                        setContent({ ...content, timeline: n });
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
                        const n = [...content.timeline!];
                        n[i] = { ...item, [k]: e.target.value };
                        setContent({ ...content, timeline: n });
                      }}
                      className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                  ))}
                </div>
              ))}
            </>
          )}

          {/* ============ PROJECTS ============ */}
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
                        { title: 'New Project', date: '2025', desc: '', tech: [], image: '', github: '', live: '' },
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
                        const n = [...content.projects!];
                        n[i] = { ...p, title: e.target.value };
                        setContent({ ...content, projects: n });
                      }}
                      placeholder="Title"
                      className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      value={p.date}
                      onChange={(e) => {
                        const n = [...content.projects!];
                        n[i] = { ...p, date: e.target.value };
                        setContent({ ...content, projects: n });
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
                      const n = [...content.projects!];
                      n[i] = { ...p, desc: e.target.value };
                      setContent({ ...content, projects: n });
                    }}
                    className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white resize-none"
                  />
                  <input
                    placeholder="Tech stack (comma separated)"
                    value={p.tech.join(', ')}
                    onChange={(e) => {
                      const n = [...content.projects!];
                      n[i] = {
                        ...p,
                        tech: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      };
                      setContent({ ...content, projects: n });
                    }}
                    className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="GitHub URL"
                      value={p.github}
                      onChange={(e) => {
                        const n = [...content.projects!];
                        n[i] = { ...p, github: e.target.value };
                        setContent({ ...content, projects: n });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      placeholder="Live URL"
                      value={p.live}
                      onChange={(e) => {
                        const n = [...content.projects!];
                        n[i] = { ...p, live: e.target.value };
                        setContent({ ...content, projects: n });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  {/* Project Image Upload */}
                  <div className="flex items-center gap-3">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-20 h-20 object-cover rounded-lg border border-red-900/50"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                      />
                    )}
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm hover:bg-red-600">
                      <Upload size={14} />
                      {uploading === `Project ${i + 1}` ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files &&
                          handleUpload(e.target.files[0], `Project ${i + 1}`, (url) => {
                            const n = [...content.projects!];
                            n[i] = { ...p, image: url };
                            setContent({ ...content, projects: n });
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ============ CERTIFICATIONS ============ */}
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
                        const n = [...content.certifications!];
                        n[i] = { ...c, title: e.target.value };
                        setContent({ ...content, certifications: n });
                      }}
                      placeholder="Title"
                      className="flex-1 bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <button
                      onClick={() =>
                        setContent({
                          ...content,
                          certifications: content.certifications!.filter((_, idx) => idx !== i),
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
                        const n = [...content.certifications!];
                        n[i] = { ...c, issuer: e.target.value };
                        setContent({ ...content, certifications: n });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      placeholder="Year / Score"
                      value={c.year}
                      onChange={(e) => {
                        const n = [...content.certifications!];
                        n[i] = { ...c, year: e.target.value };
                        setContent({ ...content, certifications: n });
                      }}
                      className="bg-black/60 border border-red-900/50 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  {/* Cert Image Upload */}
                  <div className="flex items-center gap-3">
                    {c.image_url && (
                      <img
                        src={c.image_url}
                        alt={c.title}
                        className="w-20 h-20 object-cover rounded-lg border border-red-900/50"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                      />
                    )}
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm hover:bg-red-600">
                      <Upload size={14} />
                      {uploading === `Cert ${i + 1}` ? 'Uploading...' : 'Upload Certificate'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files &&
                          handleUpload(e.target.files[0], `Cert ${i + 1}`, (url) => {
                            const n = [...content.certifications!];
                            n[i] = { ...c, image_url: url };
                            setContent({ ...content, certifications: n });
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
          Click <strong className="text-red-400">Save Changes</strong> (or Ctrl+S) to publish.
        </p>
      </div>
    </div>
  );
}