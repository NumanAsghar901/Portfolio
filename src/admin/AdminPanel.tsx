import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  User,
  Briefcase,
  Layers,
  GraduationCap,
  Heart,
  Code2,
  Upload,
  Download,
  Trash2,
  Edit,
  Plus,
  Check,
  X,
  ArrowLeft,
  FileText,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Eye,
  LogOut,
  Save,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, SkillCategory, Experience, Education, Achievement, Interest, Skill } from '../types';

interface AdminPanelProps {
  onBackToPortfolio: () => void;
  onLogout: () => void;
}

type TabType = 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'interests' | 'settings';

export default function AdminPanel({ onBackToPortfolio, onLogout }: AdminPanelProps) {
  const {
    personalInfo,
    updatePersonalInfo,
    skillsData,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    addSkill,
    updateSkill,
    deleteSkill,
    projectsData,
    addProject,
    updateProject,
    deleteProject,
    experienceData,
    addExperience,
    updateExperience,
    deleteExperience,
    educationData,
    addEducation,
    updateEducation,
    deleteEducation,
    achievementsData,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    interestsData,
    addInterest,
    updateInterest,
    deleteInterest,
    cvMetadata,
    uploadCv,
    deleteCv,
    downloadCv,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // CV Upload state
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  const handleCvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    try {
      setIsUploadingCv(true);
      await uploadCv(file);
      showToast(`CV "${file.name}" uploaded successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to save CV.');
    } finally {
      setIsUploadingCv(false);
      if (cvInputRef.current) cvInputRef.current.value = '';
    }
  };

  // Image Upload helper for project / portrait images
  const handleImageUploadHelper = (callback: (dataUrl: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const res = uploadEvent.target?.result as string;
          if (res) callback(res);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // ==========================================
  // MODALS STATE
  // ==========================================
  // Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Project>({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    category: 'web',
    tech: [],
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
  });
  const [techInput, setTechInput] = useState('');

  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      id: 'proj-' + Date.now(),
      title: '',
      subtitle: '',
      description: '',
      category: 'web',
      tech: ['React', 'Node.js'],
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
    });
    setTechInput('React, Node.js');
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm({ ...proj });
    setTechInput(proj.tech.join(', '));
    setProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectToSave: Project = {
      ...projectForm,
      tech: finalTech,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectToSave);
      showToast('Project updated successfully!');
    } else {
      addProject(projectToSave);
      showToast('New project created successfully!');
    }
    setProjectModalOpen(false);
  };

  // Skill Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [catForm, setCatForm] = useState<{ title: string; iconName: string }>({
    title: '',
    iconName: 'Code2',
  });

  const openAddCatModal = () => {
    setEditingCatIndex(null);
    setCatForm({ title: '', iconName: 'Code2' });
    setCatModalOpen(true);
  };

  const openEditCatModal = (index: number, cat: SkillCategory) => {
    setEditingCatIndex(index);
    setCatForm({ title: cat.title, iconName: cat.iconName });
    setCatModalOpen(true);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCatIndex !== null) {
      const existing = skillsData[editingCatIndex];
      updateSkillCategory(editingCatIndex, {
        ...existing,
        title: catForm.title,
        iconName: catForm.iconName,
      });
      showToast('Category updated!');
    } else {
      addSkillCategory({
        title: catForm.title,
        iconName: catForm.iconName,
        skills: [{ name: 'Sample Skill', level: 90 }],
      });
      showToast('New category added!');
    }
    setCatModalOpen(false);
  };

  // Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [targetCatIndex, setTargetCatIndex] = useState<number>(0);
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState<Skill>({ name: '', level: 90 });

  const openAddSkillModal = (catIdx: number) => {
    setTargetCatIndex(catIdx);
    setEditingSkillIndex(null);
    setSkillForm({ name: '', level: 90 });
    setSkillModalOpen(true);
  };

  const openEditSkillModal = (catIdx: number, skillIdx: number, s: Skill | string) => {
    setTargetCatIndex(catIdx);
    setEditingSkillIndex(skillIdx);
    const skillObj: Skill = typeof s === 'string' ? { name: s, level: 85 } : s;
    setSkillForm({ ...skillObj });
    setSkillModalOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkillIndex !== null) {
      updateSkill(targetCatIndex, editingSkillIndex, skillForm);
      showToast('Skill updated!');
    } else {
      addSkill(targetCatIndex, skillForm);
      showToast('Skill added!');
    }
    setSkillModalOpen(false);
  };

  // Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [expForm, setExpForm] = useState<Experience>({
    role: '',
    company: '',
    companyUrl: '',
    period: '',
    bullets: [''],
  });

  const openAddExpModal = () => {
    setEditingExpIndex(null);
    setExpForm({
      role: '',
      company: '',
      companyUrl: '',
      period: '2024 – Present',
      bullets: ['Responsible for feature engineering and team deliverables.'],
    });
    setExpModalOpen(true);
  };

  const openEditExpModal = (idx: number, item: Experience) => {
    setEditingExpIndex(idx);
    setExpForm({ ...item, bullets: [...item.bullets] });
    setExpModalOpen(true);
  };

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedBullets = expForm.bullets.map((b) => b.trim()).filter(Boolean);
    const toSave: Experience = { ...expForm, bullets: cleanedBullets };
    if (editingExpIndex !== null) {
      updateExperience(editingExpIndex, toSave);
      showToast('Experience updated!');
    } else {
      addExperience(toSave);
      showToast('Experience added!');
    }
    setExpModalOpen(false);
  };

  // Education Modal
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState<Education>({
    degree: '',
    institution: '',
    period: '',
    gpa: '',
  });

  const openAddEduModal = () => {
    setEditingEduIndex(null);
    setEduForm({ degree: '', institution: '', period: '', gpa: '' });
    setEduModalOpen(true);
  };

  const openEditEduModal = (idx: number, item: Education) => {
    setEditingEduIndex(idx);
    setEduForm({ ...item });
    setEduModalOpen(true);
  };

  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEduIndex !== null) {
      updateEducation(editingEduIndex, eduForm);
      showToast('Education updated!');
    } else {
      addEducation(eduForm);
      showToast('Education added!');
    }
    setEduModalOpen(false);
  };

  // Achievement Modal
  const [achModalOpen, setAchModalOpen] = useState(false);
  const [editingAchIndex, setEditingAchIndex] = useState<number | null>(null);
  const [achForm, setAchForm] = useState<Achievement>({ title: '', description: '' });

  const openAddAchModal = () => {
    setEditingAchIndex(null);
    setAchForm({ title: '', description: '' });
    setAchModalOpen(true);
  };

  const openEditAchModal = (idx: number, item: Achievement) => {
    setEditingAchIndex(idx);
    setAchForm({ ...item });
    setAchModalOpen(true);
  };

  const handleSaveAch = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAchIndex !== null) {
      updateAchievement(editingAchIndex, achForm);
      showToast('Award/Honors updated!');
    } else {
      addAchievement(achForm);
      showToast('Award/Honors added!');
    }
    setAchModalOpen(false);
  };

  // Interest Modal
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [editingInterestIndex, setEditingInterestIndex] = useState<number | null>(null);
  const [interestForm, setInterestForm] = useState<Interest>({
    title: '',
    description: '',
    iconName: 'Zap',
  });

  const openAddInterestModal = () => {
    setEditingInterestIndex(null);
    setInterestForm({ title: '', description: '', iconName: 'Zap' });
    setInterestModalOpen(true);
  };

  const openEditInterestModal = (idx: number, item: Interest) => {
    setEditingInterestIndex(idx);
    setInterestForm({ ...item });
    setInterestModalOpen(true);
  };

  const handleSaveInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInterestIndex !== null) {
      updateInterest(editingInterestIndex, interestForm);
      showToast('Interest area updated!');
    } else {
      addInterest(interestForm);
      showToast('Interest area added!');
    }
    setInterestModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-zinc-100 flex flex-col font-sans selection:bg-yellow-500 selection:text-black">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-yellow-500 text-black px-4 py-3 rounded-xl shadow-2xl font-semibold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0e131d]/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm sm:text-base text-white tracking-wide">
                Numan's Portfolio Admin
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-yellow-950/60 text-yellow-400 border border-yellow-800/40">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">numanasghar901@gmail.com</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onBackToPortfolio}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            title="View Live Portfolio"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Live Portfolio</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-medium transition-colors"
            title="Sign out of admin"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 space-y-1.5">
          {[
            { id: 'hero', name: 'Hero & CV Upload', icon: User },
            { id: 'about', name: 'About Me & Stats', icon: Sparkles },
            { id: 'skills', name: 'Tech Stack & Expertise', icon: Code2 },
            { id: 'projects', name: 'Featured Projects', icon: Layers },
            { id: 'experience', name: 'Experience & Education', icon: Briefcase },
            { id: 'interests', name: 'Areas of Interest', icon: Heart },
            { id: 'settings', name: 'Backup & Factory Reset', icon: RefreshCw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/15'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-black' : 'text-zinc-500'} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-[#111622] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* ======================================================== */}
          {/* TAB 1: HERO & CV UPLOAD */}
          {/* ======================================================== */}
          {activeTab === 'hero' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <User className="text-yellow-400" size={22} />
                  <span>Hero Section & Curriculum Vitae (CV)</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage headline, personal contact info, portrait image, and upload your real PDF CV.
                </p>
              </div>

              {/* CV Upload Box */}
              <div className="p-6 rounded-2xl bg-[#090d14] border border-yellow-500/30 shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-zinc-100 flex items-center space-x-2">
                        <span>Curriculum Vitae (PDF)</span>
                        {cvMetadata && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded-full font-mono">
                            ACTIVE
                          </span>
                        )}
                      </h3>
                      {cvMetadata ? (
                        <p className="text-xs text-zinc-400 mt-1">
                          File: <span className="text-yellow-400 font-mono">{cvMetadata.fileName}</span> (
                          {(cvMetadata.fileSize / 1024).toFixed(1)} KB) — Uploaded on{' '}
                          {new Date(cvMetadata.updatedAt).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-400 mt-1">
                          No custom PDF uploaded yet. (A valid default profile summary PDF will be served).
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={cvInputRef}
                      onChange={handleCvFileChange}
                      accept=".pdf,application/pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      disabled={isUploadingCv}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>{isUploadingCv ? 'Uploading...' : 'Upload PDF CV'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadCv()}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                      title="Test Download CV"
                    >
                      <Download size={14} />
                      <span>Test Download</span>
                    </button>

                    {cvMetadata && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm('Delete uploaded CV and restore default?')) {
                            await deleteCv();
                            showToast('CV deleted.');
                          }
                        }}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-colors"
                        title="Delete CV"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Details Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Hero details updated successfully!');
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Hero Greeting / Badge Text
                    </label>
                    <input
                      type="text"
                      value={personalInfo.heroGreeting || ''}
                      onChange={(e) => updatePersonalInfo({ heroGreeting: e.target.value })}
                      placeholder="e.g. Hello, I'm Numan Asghar 👋"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Headline Line 1 (White)
                    </label>
                    <input
                      type="text"
                      value={personalInfo.heroHeadlinePrefix || 'I DESIGN & BUILD'}
                      onChange={(e) => updatePersonalInfo({ heroHeadlinePrefix: e.target.value })}
                      placeholder="e.g. I DESIGN & BUILD"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Headline Line 2 (Yellow Color)
                    </label>
                    <input
                      type="text"
                      value={personalInfo.heroHeadlineHighlight || 'DIGITAL EXPERIENCES'}
                      onChange={(e) => updatePersonalInfo({ heroHeadlineHighlight: e.target.value })}
                      placeholder="e.g. DIGITAL EXPERIENCES"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={personalInfo.name}
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Professional Role / Title (Displayed in Hero)
                    </label>
                    <input
                      type="text"
                      value={personalInfo.title}
                      onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                      placeholder="e.g. Computer Science Student | FAST-NUCES"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={personalInfo.phone}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Location / Institution
                    </label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      GitHub Profile URL
                    </label>
                    <input
                      type="text"
                      value={personalInfo.github}
                      onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="text"
                      value={personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Portrait Image
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={personalInfo.portraitUrl}
                        onChange={(e) => updatePersonalInfo({ portraitUrl: e.target.value })}
                        placeholder="Image URL or upload"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleImageUploadHelper((dataUrl) => {
                            updatePersonalInfo({ portraitUrl: dataUrl });
                            showToast('Portrait image updated!');
                          })
                        }
                        className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200"
                        title="Upload from computer"
                      >
                        <Upload size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Hero Professional Summary
                  </label>
                  <textarea
                    rows={4}
                    value={personalInfo.summary}
                    onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onBackToPortfolio}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye size={15} />
                    <span>View Live Website</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-yellow-500/20"
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ABOUT ME & STATS */}
          {/* ======================================================== */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Sparkles className="text-yellow-400" size={22} />
                  <span>About Me Section & Metrics</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Edit the biography, headline, availability, and key counters (note: "90+ Students" has been removed).
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('About Me details saved!');
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={personalInfo.aboutTitle || ''}
                    onChange={(e) => updatePersonalInfo({ aboutTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    About Bio Text
                  </label>
                  <textarea
                    rows={3}
                    value={personalInfo.aboutSubtitle || ''}
                    onChange={(e) => updatePersonalInfo({ aboutSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Origin / From
                    </label>
                    <input
                      type="text"
                      value={personalInfo.origin || 'Faisalabad, PK'}
                      onChange={(e) => updatePersonalInfo({ origin: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Availability Status
                    </label>
                    <input
                      type="text"
                      value={personalInfo.availability || 'Open to Work'}
                      onChange={(e) => updatePersonalInfo({ availability: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Stats Counters */}
                <div className="p-5 rounded-2xl bg-[#0a0e16] border border-zinc-800/80">
                  <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-4">
                    Key Stats Counters (Displayed on About Me)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Years Experience Counter</label>
                      <input
                        type="text"
                        value={personalInfo.yearsExp || '02+'}
                        onChange={(e) => updatePersonalInfo({ yearsExp: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Projects Counter</label>
                      <input
                        type="text"
                        value={personalInfo.projectsCount || '10+'}
                        onChange={(e) => updatePersonalInfo({ projectsCount: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Awards / Honors Counter</label>
                      <input
                        type="text"
                        value={personalInfo.awardsCount || '03+'}
                        onChange={(e) => updatePersonalInfo({ awardsCount: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onBackToPortfolio}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye size={15} />
                    <span>View Live Website</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-yellow-500/20"
                  >
                    <Save size={16} />
                    <span>Save About Me</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: TECH STACK & EXPERTISE */}
          {/* ======================================================== */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Code2 className="text-yellow-400" size={22} />
                    <span>Technical Stack & Expertise</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add, edit, or delete skill categories and individual proficiency meters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddCatModal}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer w-fit"
                >
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="space-y-5">
                {skillsData.map((category, catIdx) => (
                  <div
                    key={catIdx}
                    className="p-5 rounded-2xl bg-[#090d14] border border-zinc-800/80 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/70 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-bold text-base text-zinc-100">{category.title}</span>
                        <span className="font-mono text-[10px] text-yellow-400 bg-yellow-950/40 border border-yellow-800/30 px-2 py-0.5 rounded-md">
                          icon: {category.iconName}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openAddSkillModal(catIdx)}
                          className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 rounded-lg text-xs font-medium"
                          title="Add skill to this category"
                        >
                          <Plus size={13} />
                          <span>Add Skill</span>
                        </button>
                        <button
                          onClick={() => openEditCatModal(catIdx, category)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs"
                          title="Edit Category Name & Icon"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete category "${category.title}"?`)) {
                              deleteSkillCategory(catIdx);
                              showToast('Category deleted.');
                            }
                          }}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Skill items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {category.skills.map((skill, sIdx) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        const skillLevel = typeof skill === 'string' ? 85 : skill.level;
                        return (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 group"
                          >
                            <div className="flex-1 mr-3">
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="font-medium text-zinc-200">{skillName}</span>
                                <span className="text-yellow-400 font-mono">{skillLevel}%</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-500 rounded-full"
                                  style={{ width: `${skillLevel}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditSkillModal(catIdx, sIdx, skill)}
                                className="p-1 text-zinc-400 hover:text-white"
                                title="Edit Skill"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  deleteSkill(catIdx, sIdx);
                                  showToast('Skill deleted.');
                                }}
                                className="p-1 text-rose-400 hover:text-rose-300"
                                title="Delete Skill"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: FEATURED PROJECTS */}
          {/* ======================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Layers className="text-yellow-400" size={22} />
                    <span>Featured Engineering Projects</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage projects, categories, screenshots, and live demo / github links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddProjectModal}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer w-fit"
                >
                  <Plus size={16} />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsData.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-2xl bg-[#090d14] border border-zinc-800/80 flex flex-col justify-between space-y-4 hover:border-yellow-500/30 transition-all"
                  >
                    <div>
                      {project.imageUrl && (
                        <div className="w-full h-36 rounded-xl overflow-hidden bg-zinc-950 mb-3 border border-zinc-800 relative">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover object-top"
                          />
                          <span className="absolute top-2 left-2 text-[10px] font-mono font-bold uppercase bg-black/80 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30">
                            {project.category}
                          </span>
                        </div>
                      )}

                      <h3 className="font-bold text-base text-zinc-100">{project.title}</h3>
                      <p className="text-xs text-yellow-500/90 font-mono mt-0.5">{project.subtitle}</p>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/40"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-white flex items-center space-x-1"
                          >
                            <span>Live</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-white flex items-center space-x-1"
                          >
                            <span>GitHub</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openEditProjectModal(project)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                          title="Edit Project"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${project.title}"?`)) {
                              deleteProject(project.id);
                              showToast('Project deleted.');
                            }
                          }}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: EXPERIENCE & EDUCATION */}
          {/* ======================================================== */}
          {activeTab === 'experience' && (
            <div className="space-y-8">
              {/* Professional Experience */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Briefcase className="text-yellow-400" size={20} />
                    <span>Professional Work Experience</span>
                  </h2>
                  <button
                    type="button"
                    onClick={openAddExpModal}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {experienceData.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#090d14] border border-zinc-800 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-zinc-100">{exp.role}</h4>
                          <span className="font-mono text-[10px] text-yellow-400 bg-yellow-950/40 px-2 py-0.5 rounded">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium">{exp.company}</p>
                        <p className="text-xs text-zinc-500">{exp.bullets.length} bullet points</p>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openEditExpModal(idx, exp)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete experience "${exp.role}"?`)) {
                              deleteExperience(idx);
                              showToast('Experience deleted.');
                            }
                          }}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4 pt-6 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <GraduationCap className="text-emerald-400" size={20} />
                    <span>Formal Education</span>
                  </h2>
                  <button
                    type="button"
                    onClick={openAddEduModal}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Education</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {educationData.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#090d14] border border-zinc-800 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-zinc-100">{edu.degree}</h4>
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                            {edu.period}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{edu.institution}</p>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openEditEduModal(idx, edu)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete education "${edu.degree}"?`)) {
                              deleteEducation(idx);
                              showToast('Education deleted.');
                            }
                          }}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements & Recognition */}
              <div className="space-y-4 pt-6 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Sparkles className="text-yellow-400" size={20} />
                    <span>Honors & Achievements</span>
                  </h2>
                  <button
                    type="button"
                    onClick={openAddAchModal}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Award</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {achievementsData.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#090d14] border border-zinc-800 flex items-start justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-zinc-100">{ach.title}</h4>
                        <p className="text-xs text-zinc-400 mt-1">{ach.description}</p>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openEditAchModal(idx, ach)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${ach.title}"?`)) {
                              deleteAchievement(idx);
                              showToast('Award deleted.');
                            }
                          }}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: AREAS OF INTEREST */}
          {/* ======================================================== */}
          {activeTab === 'interests' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Heart className="text-yellow-400" size={22} />
                    <span>Areas of Interest</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage passion domains, titles, descriptions, and icon representations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddInterestModal}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer w-fit"
                >
                  <Plus size={16} />
                  <span>Add Interest</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {interestsData.map((interest, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#090d14] border border-zinc-800/80 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base text-zinc-100">{interest.title}</span>
                        <span className="font-mono text-[10px] text-yellow-400 bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-800/30">
                          {interest.iconName}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{interest.description}</p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex justify-end space-x-1.5">
                      <button
                        onClick={() => openEditInterestModal(idx, interest)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${interest.title}"?`)) {
                            deleteInterest(idx);
                            showToast('Interest deleted.');
                          }
                        }}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: BACKUP & FACTORY RESET */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <RefreshCw className="text-yellow-400" size={22} />
                  <span>Data Backups & Factory Reset</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Export all your portfolio data to JSON, import a backup, or reset back to default initial values.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#090d14] border border-zinc-800 space-y-4">
                <h3 className="font-bold text-sm text-zinc-200">Export & Import Portfolio Configuration</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Download a JSON copy of all your custom projects, skills, biography, and timeline to save offline.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const json = exportDataJson();
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('Backup JSON downloaded!');
                    }}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Download size={15} />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json,application/json';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const content = event.target?.result as string;
                            if (content && importDataJson(content)) {
                              showToast('Backup restored successfully!');
                            } else {
                              alert('Invalid JSON file format.');
                            }
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Upload size={15} />
                    <span>Restore from JSON</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-4">
                <h3 className="font-bold text-sm text-rose-300">Danger Zone: Factory Reset</h3>
                <p className="text-xs text-rose-300/80 leading-relaxed">
                  Resetting will wipe all your custom changes in localStorage and restore all initial portfolio data
                  and original projects.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      confirm(
                        'Are you completely sure you want to reset everything back to initial defaults? All custom changes will be removed.'
                      )
                    ) {
                      await resetToDefaults();
                      showToast('Portfolio reset to default state.');
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw size={15} />
                  <span>Reset All to Defaults</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ======================================================== */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <h3 className="font-bold text-lg text-white">
                {editingProject ? 'Edit Engineering Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. FAST Academic Hub"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Subtitle / Tech Category
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.subtitle}
                    onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                    placeholder="e.g. TA & Student Marking Portal (MERN Stack)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Filter Category
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value as 'web' | 'ml' | 'ai' | 'all',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="web">MERN & Web Dev (web)</option>
                    <option value="ml">Machine Learning (ml)</option>
                    <option value="ai">AI & Automation (ai)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Comprehensive description of the application..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Project Preview Image (Top Half of Card)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={projectForm.imageUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    placeholder="Paste Image URL or click Upload"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleImageUploadHelper((dataUrl) => {
                        setProjectForm({ ...projectForm, imageUrl: dataUrl });
                      })
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-semibold flex items-center space-x-1"
                  >
                    <Upload size={14} />
                    <span>Upload</span>
                  </button>
                </div>
                {projectForm.imageUrl && (
                  <div className="mt-2 w-full h-24 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
                    <img src={projectForm.imageUrl} alt="preview" className="w-full h-full object-cover object-top" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="text"
                    value={projectForm.liveUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="text"
                    value={projectForm.githubUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SKILL CATEGORY */}
      {/* ======================================================== */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">
              {editingCatIndex !== null ? 'Edit Skill Category' : 'Add Skill Category'}
            </h3>
            <form onSubmit={handleSaveCat} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={catForm.title}
                  onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                  placeholder="e.g. Cloud & DevOps"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Icon Name (Lucide)</label>
                <select
                  value={catForm.iconName}
                  onChange={(e) => setCatForm({ ...catForm, iconName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="Code2">Code2</option>
                  <option value="BrainCircuit">BrainCircuit</option>
                  <option value="Bot">Bot</option>
                  <option value="Wrench">Wrench</option>
                  <option value="GraduationCap">GraduationCap</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Server">Server</option>
                  <option value="Globe">Globe</option>
                  <option value="Database">Database</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SKILL */}
      {/* ======================================================== */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">
              {editingSkillIndex !== null ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. Next.js, PyTorch"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">
                  Proficiency Meter: {skillForm.level}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                  className="w-full accent-yellow-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT WORK EXPERIENCE */}
      {/* ======================================================== */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <h3 className="font-bold text-lg text-white mb-4">
              {editingExpIndex !== null ? 'Edit Work Experience' : 'Add Work Experience'}
            </h3>
            <form onSubmit={handleSaveExp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 uppercase mb-1">Job Role</label>
                  <input
                    type="text"
                    required
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 uppercase mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    placeholder="e.g. Prop Firm Studios"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 uppercase mb-1">Company Website URL</label>
                  <input
                    type="text"
                    value={expForm.companyUrl || ''}
                    onChange={(e) => setExpForm({ ...expForm, companyUrl: e.target.value })}
                    placeholder="https://propfirmstudios.com"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 uppercase mb-1">Period</label>
                  <input
                    type="text"
                    required
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    placeholder="e.g. Oct 2026 – Present"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1.5 flex items-center justify-between">
                  <span>Bullet Points / Accomplishments</span>
                  <button
                    type="button"
                    onClick={() => setExpForm({ ...expForm, bullets: [...expForm.bullets, ''] })}
                    className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold flex items-center space-x-1"
                  >
                    <Plus size={13} />
                    <span>Add Bullet</span>
                  </button>
                </label>
                <div className="space-y-2">
                  {expForm.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const updated = [...expForm.bullets];
                          updated[bIdx] = e.target.value;
                          setExpForm({ ...expForm, bullets: updated });
                        }}
                        placeholder={`Bullet ${bIdx + 1}`}
                        className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      />
                      {expForm.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = expForm.bullets.filter((_, i) => i !== bIdx);
                            setExpForm({ ...expForm, bullets: updated });
                          }}
                          className="p-2 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold">
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT EDUCATION */}
      {/* ======================================================== */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">
              {editingEduIndex !== null ? 'Edit Education' : 'Add Education'}
            </h3>
            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Degree Title</label>
                <input
                  type="text"
                  required
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Institution</label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="e.g. FAST-NUCES"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Period</label>
                <input
                  type="text"
                  required
                  value={eduForm.period}
                  onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                  placeholder="e.g. August 2023 – Present"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold">
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT ACHIEVEMENT */}
      {/* ======================================================== */}
      {achModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">
              {editingAchIndex !== null ? 'Edit Award' : 'Add Award'}
            </h3>
            <form onSubmit={handleSaveAch} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Award Title</label>
                <input
                  type="text"
                  required
                  value={achForm.title}
                  onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                  placeholder="e.g. Teaching Assistant Certificate"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={achForm.description}
                  onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                  placeholder="Describe this honor or milestone..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold">
                  Save Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT INTEREST */}
      {/* ======================================================== */}
      {interestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">
              {editingInterestIndex !== null ? 'Edit Area of Interest' : 'Add Area of Interest'}
            </h3>
            <form onSubmit={handleSaveInterest} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={interestForm.title}
                  onChange={(e) => setInterestForm({ ...interestForm, title: e.target.value })}
                  placeholder="e.g. Autonomous Agents"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={interestForm.description}
                  onChange={(e) => setInterestForm({ ...interestForm, description: e.target.value })}
                  placeholder="Details of research or exploration..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase mb-1">Icon Name (Lucide)</label>
                <select
                  value={interestForm.iconName}
                  onChange={(e) => setInterestForm({ ...interestForm, iconName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="Zap">Zap</option>
                  <option value="Eye">Eye</option>
                  <option value="Server">Server</option>
                  <option value="BrainCircuit">BrainCircuit</option>
                  <option value="Heart">Heart</option>
                  <option value="Code2">Code2</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Globe">Globe</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setInterestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold">
                  Save Interest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
