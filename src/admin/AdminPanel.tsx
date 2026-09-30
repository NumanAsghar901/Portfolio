import React, { useState, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
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
  Github,
  CheckCircle2,
  FolderOpen,
  Mail,
  Phone,
  MapPin,
  Tags,
  Tag,
  Search,
  Filter,
  Copy,
  Terminal,
  CheckCheck,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory, SkillCategory, Experience, Education, Achievement, Interest, Skill } from '../types';
import { compressImage } from '../utils/imageOptimizer';
import { saveToCodebaseApi, downloadDataTsFile, getCvBase64 } from '../utils/codebaseSync';

interface AdminPanelProps {
  onBackToPortfolio: (section?: string) => void;
  onLogout: () => void;
}

type TabType = 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'interests' | 'contact' | 'settings';

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
    projectCategories,
    addProjectCategory,
    updateProjectCategory,
    deleteProjectCategory,
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
    reloadFromCodebase,
    exportDataJson,
    importDataJson,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Codebase Synchronization State & Handlers
  const [isSavingCodebase, setIsSavingCodebase] = useState(false);
  const [codebaseSavedSuccess, setCodebaseSavedSuccess] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('portfolio_github_token') || '');
  const [tokenSaved, setTokenSaved] = useState(false);

  const handleSaveToCodebase = async () => {
    setIsSavingCodebase(true);
    try {
      const cvBase64 = await getCvBase64();
      const payload = {
        personalInfo,
        skillsData,
        projectCategories,
        projectsData,
        experienceData,
        educationData,
        achievementsData,
        interestsData,
        cvBase64,
        cvFileName: cvMetadata?.fileName,
      };

      const result = await saveToCodebaseApi(payload, githubToken);
      if (result.success) {
        setCodebaseSavedSuccess(true);
        setTimeout(() => setCodebaseSavedSuccess(false), 5000);
        showToast(result.message || '✓ Saved directly to codebase!');
      } else if (result.needsToken) {
        setActiveTab('settings');
        showToast('Please enter your GitHub Token below to enable automatic 1-click cloud sync on Vercel.');
      } else {
        downloadDataTsFile(payload);
        showToast('Downloaded data.ts file! Replace src/data.ts to commit changes.');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error saving to codebase: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSavingCodebase(false);
    }
  };

  const handleDownloadDataTs = async () => {
    try {
      const cvBase64 = await getCvBase64();
      const payload = {
        personalInfo,
        skillsData,
        projectCategories,
        projectsData,
        experienceData,
        educationData,
        achievementsData,
        interestsData,
        cvBase64,
        cvFileName: cvMetadata?.fileName,
      };
      downloadDataTsFile(payload);
      showToast('data.ts file generated and downloaded!');
    } catch (err: any) {
      console.error(err);
      showToast('Error downloading data.ts');
    }
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

  // Image Upload helper for project / portrait images with automatic optimization
  const handleImageUploadHelper = (callback: (dataUrl: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const compressed = await compressImage(file, 1200, 1200, 0.85);
          callback(compressed);
        } catch (err) {
          console.error('Image compression failed, using fallback:', err);
          const reader = new FileReader();
          reader.onload = (uploadEvent) => {
            const res = uploadEvent.target?.result as string;
            if (res) callback(res);
          };
          reader.readAsDataURL(file);
        }
      }
    };
    input.click();
  };

  // ==========================================
  // MODALS STATE
  // ==========================================
  // Helper to safely render category icon
  const getCategoryIconComponent = (iconName?: string, className = 'w-4 h-4') => {
    if (!iconName) return <Layers className={className} />;
    const Comp = (LucideIcons as any)[iconName];
    if (Comp) return <Comp className={className} />;
    return <Layers className={className} />;
  };

  // Admin Project Filtering & Search
  const [adminProjectCategoryFilter, setAdminProjectCategoryFilter] = useState('all');
  const [adminProjectSearch, setAdminProjectSearch] = useState('');

  // Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Project>({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    category: 'web',
    categories: ['web'],
    tech: [],
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
  });
  const [techInput, setTechInput] = useState('');
  const [showQuickAddCat, setShowQuickAddCat] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');

  // Project Category Management Modal
  const [manageCategoriesModalOpen, setManageCategoriesModalOpen] = useState(false);
  const [projCategoryModalOpen, setProjCategoryModalOpen] = useState(false);
  const [editingProjCategory, setEditingProjCategory] = useState<ProjectCategory | null>(null);
  const [projCategoryForm, setProjCategoryForm] = useState<ProjectCategory>({
    id: '',
    name: '',
    iconName: 'Code',
    description: '',
  });

  const openAddProjectModal = () => {
    setEditingProject(null);
    const defaultCatId = projectCategories[0]?.id || 'web';
    setProjectForm({
      id: 'proj-' + Date.now(),
      title: '',
      subtitle: '',
      description: '',
      category: defaultCatId,
      categories: [defaultCatId],
      tech: ['React', 'Node.js'],
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
    });
    setTechInput('React, Node.js');
    setShowQuickAddCat(false);
    setQuickCatName('');
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProject(proj);
    const initialCats = Array.isArray(proj.categories) && proj.categories.length > 0
      ? proj.categories
      : (proj.category ? [proj.category] : ['web']);
    setProjectForm({
      ...proj,
      categories: initialCats,
      category: initialCats[0] || 'web',
    });
    setTechInput(proj.tech.join(', '));
    setShowQuickAddCat(false);
    setQuickCatName('');
    setProjectModalOpen(true);
  };

  const toggleCategoryInForm = (catId: string) => {
    setProjectForm((prev) => {
      const current = prev.categories || (prev.category ? [prev.category] : []);
      const exists = current.includes(catId);
      let next: string[];
      if (exists) {
        next = current.filter((id) => id !== catId);
      } else {
        next = [...current, catId];
      }
      return {
        ...prev,
        categories: next,
        category: next[0] || '',
      };
    });
  };

  const handleQuickAddCategory = () => {
    const trimmed = quickCatName.trim();
    if (!trimmed) return;
    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const finalId = slug || 'cat-' + Date.now();

    if (!projectCategories.some((c) => c.id === finalId)) {
      addProjectCategory({
        id: finalId,
        name: trimmed,
        iconName: 'Code',
        description: '',
      });
      showToast(`Category "${trimmed}" created!`);
    }

    setProjectForm((prev) => {
      const current = prev.categories || [];
      if (!current.includes(finalId)) {
        const next = [...current, finalId];
        return {
          ...prev,
          categories: next,
          category: next[0] || finalId,
        };
      }
      return prev;
    });

    setQuickCatName('');
    setShowQuickAddCat(false);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.categories || projectForm.categories.length === 0) {
      alert('Please select at least one category for this project.');
      return;
    }

    const finalTech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectToSave: Project = {
      ...projectForm,
      categories: projectForm.categories,
      category: projectForm.categories[0] || 'web',
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

  // Category Management Handlers
  const openAddProjCategoryModal = () => {
    setEditingProjCategory(null);
    setProjCategoryForm({
      id: '',
      name: '',
      iconName: 'Code',
      description: '',
    });
    setProjCategoryModalOpen(true);
  };

  const openEditProjCategoryModal = (cat: ProjectCategory) => {
    setEditingProjCategory(cat);
    setProjCategoryForm({ ...cat });
    setProjCategoryModalOpen(true);
  };

  const handleSaveProjCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = projCategoryForm.name.trim();
    if (!trimmedName) {
      alert('Category name is required.');
      return;
    }

    let finalId = projCategoryForm.id.trim();
    if (!finalId) {
      finalId = trimmedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (!finalId) finalId = 'cat-' + Date.now();

    if (editingProjCategory) {
      updateProjectCategory(editingProjCategory.id, {
        ...projCategoryForm,
        id: finalId,
        name: trimmedName,
      });
      showToast('Category updated successfully!');
    } else {
      if (projectCategories.some((c) => c.id === finalId)) {
        alert(`A category with ID "${finalId}" already exists. Please choose a different ID or name.`);
        return;
      }
      addProjectCategory({
        ...projCategoryForm,
        id: finalId,
        name: trimmedName,
      });
      showToast('Category created successfully!');
    }
    setProjCategoryModalOpen(false);
  };

  const handleDeleteProjCategory = (catId: string, catName: string) => {
    const usageCount = projectsData.filter((p) => {
      const cats = p.categories || [p.category || 'web'];
      return cats.includes(catId);
    }).length;

    const confirmMsg = usageCount > 0
      ? `Category "${catName}" is assigned to ${usageCount} project(s). Deleting it will remove this category from those projects. Continue?`
      : `Delete category "${catName}"?`;

    if (confirm(confirmMsg)) {
      deleteProjectCategory(catId);
      showToast(`Category "${catName}" deleted.`);
    }
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
            type="button"
            onClick={handleSaveToCodebase}
            disabled={isSavingCodebase}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer ${
              codebaseSavedSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20 active:scale-95'
            }`}
            title="Write all changes directly into src/data.ts and public/ to make them permanent across all devices"
          >
            {isSavingCodebase ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : codebaseSavedSuccess ? (
              <Check size={14} className="text-emerald-300" />
            ) : (
              <Save size={14} />
            )}
            <span>
              {isSavingCodebase
                ? 'Saving to Codebase...'
                : codebaseSavedSuccess
                ? 'Saved to Codebase!'
                : 'Save to Codebase'}
            </span>
          </button>

          <button
            onClick={() => onBackToPortfolio('/')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="View Live Portfolio"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Live Portfolio</span>
          </button>

          <a
            href="/#home"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-medium transition-colors cursor-pointer"
            title="Open Live Website in a new browser tab"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Open in New Tab</span>
          </a>

          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-medium transition-colors cursor-pointer"
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
            { id: 'contact', name: 'Contact & Social Info', icon: Mail },
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
                  updatePersonalInfo(personalInfo);
                  showToast('Hero details updated successfully!');
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Brand / Logo Text (Header & Footer)
                    </label>
                    <input
                      type="text"
                      value={personalInfo.brandName || ''}
                      onChange={(e) => updatePersonalInfo({ brandName: e.target.value })}
                      placeholder="e.g. Numan (or leave blank to use first name)"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

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
                    onClick={() => onBackToPortfolio('/#home')}
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
                  updatePersonalInfo(personalInfo);
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
                    onClick={() => onBackToPortfolio('/#about')}
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
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onBackToPortfolio('/#skills')}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View on Website</span>
                  </button>
                  <button
                    type="button"
                    onClick={openAddCatModal}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer w-fit"
                  >
                    <Plus size={16} />
                    <span>Add Category</span>
                  </button>
                </div>
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
          {activeTab === 'projects' && (() => {
            const adminFilteredProjects = projectsData.filter((project) => {
              const projectCats = project.categories && project.categories.length > 0
                ? project.categories
                : [project.category || 'web'];
              const matchesCategory =
                adminProjectCategoryFilter === 'all' || projectCats.includes(adminProjectCategoryFilter);
              const query = adminProjectSearch.toLowerCase().trim();
              const matchesSearch =
                !query ||
                project.title.toLowerCase().includes(query) ||
                project.subtitle.toLowerCase().includes(query) ||
                project.tech.some((t) => t.toLowerCase().includes(query)) ||
                projectCats.some((cid) => {
                  const cObj = projectCategories.find((c) => c.id === cid);
                  return cObj?.name.toLowerCase().includes(query) || cid.toLowerCase().includes(query);
                });
              return matchesCategory && matchesSearch;
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                      <Layers className="text-yellow-400" size={22} />
                      <span>Featured Engineering Projects</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Manage projects, multiple category assignments, screenshots, and live demo / github links.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onBackToPortfolio('/#projects')}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>View on Website</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setManageCategoriesModalOpen(true)}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 text-xs font-medium rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all cursor-pointer"
                    >
                      <Tags size={14} />
                      <span>Manage Categories ({projectCategories.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={openAddProjectModal}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer w-fit"
                    >
                      <Plus size={16} />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-3.5 rounded-2xl bg-[#090d14] border border-zinc-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Search box */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={adminProjectSearch}
                        onChange={(e) => setAdminProjectSearch(e.target.value)}
                        placeholder="Search projects by title, subtitle, or tech..."
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-yellow-500 focus:outline-none"
                      />
                      {adminProjectSearch && (
                        <button
                          type="button"
                          onClick={() => setAdminProjectSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-zinc-400 font-mono self-center">
                      Showing <span className="text-yellow-400 font-bold">{adminFilteredProjects.length}</span> of {projectsData.length} projects
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setAdminProjectCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        adminProjectCategoryFilter === 'all'
                          ? 'bg-yellow-500 text-black border-yellow-500 font-semibold'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      All ({projectsData.length})
                    </button>
                    {projectCategories.map((cat) => {
                      const count = projectsData.filter((p) => {
                        const cats = p.categories && p.categories.length > 0 ? p.categories : [p.category || 'web'];
                        return cats.includes(cat.id);
                      }).length;
                      const isActive = adminProjectCategoryFilter === cat.id;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setAdminProjectCategoryFilter(cat.id)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-yellow-500 text-black border-yellow-500 font-semibold'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                          }`}
                        >
                          {getCategoryIconComponent(cat.iconName, 'w-3 h-3')}
                          <span>{cat.name}</span>
                          <span className={`text-[10px] font-mono px-1 rounded ${isActive ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Empty State */}
                {adminFilteredProjects.length === 0 && (
                  <div className="p-12 text-center rounded-2xl bg-[#090d14] border border-zinc-800/80">
                    <Layers className="w-12 h-12 mx-auto text-zinc-600 mb-3 opacity-60" />
                    <p className="text-sm font-semibold text-zinc-200">No projects match the current filter or search.</p>
                    <div className="flex justify-center gap-2 mt-4">
                      {adminProjectSearch && (
                        <button
                          onClick={() => setAdminProjectSearch('')}
                          className="px-3 py-1.5 text-xs rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          Clear Search
                        </button>
                      )}
                      {adminProjectCategoryFilter !== 'all' && (
                        <button
                          onClick={() => setAdminProjectCategoryFilter('all')}
                          className="px-3 py-1.5 text-xs rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
                        >
                          Show All Categories
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminFilteredProjects.map((project) => {
                    const projectCats = project.categories && project.categories.length > 0
                      ? project.categories
                      : [project.category || 'web'];

                    return (
                      <div
                        key={project.id}
                        className="p-4 rounded-2xl bg-[#090d14] border border-zinc-800/80 flex flex-col justify-between space-y-4 hover:border-yellow-500/30 transition-all"
                      >
                        <div>
                          {project.imageUrl ? (
                            <div className="w-full h-36 rounded-xl overflow-hidden bg-zinc-950 mb-3 border border-zinc-800 relative">
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover object-top"
                              />
                              <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[85%] z-10">
                                {projectCats.map((catId) => {
                                  const catObj = projectCategories.find((c) => c.id === catId);
                                  return (
                                    <span
                                      key={catId}
                                      className="text-[10px] font-mono font-bold uppercase bg-black/85 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30 shadow backdrop-blur-sm"
                                    >
                                      {catObj ? catObj.name : catId}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {projectCats.map((catId) => {
                                const catObj = projectCategories.find((c) => c.id === catId);
                                return (
                                  <span
                                    key={catId}
                                    className="text-[10px] font-mono font-bold uppercase bg-yellow-950/40 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30"
                                  >
                                    {catObj ? catObj.name : catId}
                                  </span>
                                );
                              })}
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
                              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs cursor-pointer"
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
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

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
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onBackToPortfolio('/#experience')}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>View on Website</span>
                    </button>
                    <button
                      type="button"
                      onClick={openAddExpModal}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Experience</span>
                    </button>
                  </div>
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
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onBackToPortfolio('/#interests')}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View on Website</span>
                  </button>
                  <button
                    type="button"
                    onClick={openAddInterestModal}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer w-fit"
                  >
                    <Plus size={16} />
                    <span>Add Interest</span>
                  </button>
                </div>
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
          {/* TAB 7: CONTACT & SOCIAL INFO */}
          {/* ======================================================== */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Mail className="text-yellow-400" size={22} />
                    <span>Contact Details & Social Profiles</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage the contact information, location, and profiles displayed on the website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onBackToPortfolio('/#contact')}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors cursor-pointer w-fit"
                >
                  <Eye size={14} />
                  <span>View on Website</span>
                </button>
              </div>

              {/* FormSubmit Info Notice */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs text-blue-300 leading-relaxed flex items-start space-x-3">
                <Mail className="shrink-0 mt-0.5 text-blue-400" size={16} />
                <div>
                  <span className="font-semibold text-blue-200">Integrated Form Inquiries: </span>
                  When visitors send a message via the public contact form, it is automatically routed directly to your active email: <span className="font-mono text-yellow-300 font-bold">{personalInfo.email}</span>.
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updatePersonalInfo(personalInfo);
                  showToast('Contact information saved successfully!');
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Primary Contact Email
                    </label>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-l-xl bg-zinc-900 border border-r-0 border-zinc-800 flex items-center justify-center text-zinc-400">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        required
                        value={personalInfo.email}
                        onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                        className="flex-1 px-4 py-2.5 rounded-r-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-l-xl bg-zinc-900 border border-r-0 border-zinc-800 flex items-center justify-center text-zinc-400">
                        <Phone size={16} />
                      </div>
                      <input
                        type="text"
                        value={personalInfo.phone}
                        onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                        className="flex-1 px-4 py-2.5 rounded-r-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Campus / Location
                    </label>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-l-xl bg-zinc-900 border border-r-0 border-zinc-800 flex items-center justify-center text-zinc-400">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        value={personalInfo.location}
                        onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                        placeholder="e.g. Faisalabad, Pakistan (FAST-NUCES)"
                        className="flex-1 px-4 py-2.5 rounded-r-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Origin / Home City
                    </label>
                    <input
                      type="text"
                      value={personalInfo.origin || 'Faisalabad, PK'}
                      onChange={(e) => updatePersonalInfo({ origin: e.target.value })}
                      placeholder="e.g. Faisalabad, PK"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={personalInfo.github}
                      onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                      placeholder="https://github.com/your-username"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Medium Profile URL
                    </label>
                    <input
                      type="url"
                      value={personalInfo.medium || ''}
                      onChange={(e) => updatePersonalInfo({ medium: e.target.value })}
                      placeholder="https://medium.com/@your-username"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => onBackToPortfolio('/#contact')}
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
                    <span>Save Contact Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: BACKUP & FACTORY RESET */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <RefreshCw className="text-yellow-400" size={22} />
                  <span>Data Backups & Factory Reset</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Export all your portfolio data to JSON, save permanently to codebase, or reset back to default initial values.
                </p>
              </div>

              {/* Codebase Synchronization & Multi-Device Deployment */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0e1422] to-[#0a0f1a] border border-yellow-500/30 shadow-xl space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 mb-2">
                      <Sparkles size={12} />
                      <span>Multi-Device Persistence</span>
                    </span>
                    <h3 className="font-bold text-base text-white">Save Changes to Codebase (Deploy Everywhere)</h3>
                    <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                      By default, changes made in this Admin Panel are saved inside your browser's <code className="text-yellow-400 bg-yellow-500/10 px-1 py-0.5 rounded font-mono text-[11px]">localStorage</code>, which only you can see on this device.
                      Click <strong>"Save Directly to src/data.ts"</strong> to write all your projects, skills, categories, bio, timeline, and uploaded assets directly to your project codebase files.
                      Once pushed to GitHub/Vercel, the whole world and all devices will see your updates!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveToCodebase}
                    disabled={isSavingCodebase}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                      codebaseSavedSuccess
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20 active:scale-95'
                    }`}
                  >
                    {isSavingCodebase ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : codebaseSavedSuccess ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>
                      {isSavingCodebase
                        ? 'Writing files...'
                        : codebaseSavedSuccess
                        ? 'Saved to Codebase!'
                        : 'Save to Codebase'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await reloadFromCodebase();
                      showToast('✓ Reloaded from codebase! Latest Git projects and bio loaded.');
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors cursor-pointer border border-zinc-700/60"
                    title="Reload all projects and data directly from src/data.ts to sync with latest Git commits"
                  >
                    <RefreshCw size={16} />
                    <span>Reload from Codebase</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadDataTs}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors cursor-pointer border border-zinc-700/60"
                  >
                    <Download size={16} />
                    <span>Download data.ts</span>
                  </button>
                </div>

                {/* GitHub Cloud Direct Sync (For Vercel / Phone Editing) */}
                <div className="bg-[#050810] border border-yellow-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Github size={16} className="text-yellow-400" />
                      <span className="text-xs font-bold text-white">GitHub 1-Click Cloud Sync (For Mobile & Vercel)</span>
                    </div>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+Admin+Sync"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-yellow-400 hover:text-yellow-300 underline flex items-center space-x-1"
                    >
                      <span>Generate Token</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Paste your GitHub Personal Access Token (classic with <code className="text-yellow-400">repo</code> scope) below.
                    Once saved, clicking <strong>"Save to Codebase"</strong> from any device (phone, laptop, Vercel) commits directly to your GitHub repository and automatically deploys your updates live without downloading files!
                  </p>

                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setGithubToken(val);
                        localStorage.setItem('portfolio_github_token', val);
                      }}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (GitHub PAT)"
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 font-mono focus:border-yellow-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem('portfolio_github_token', githubToken);
                        setTokenSaved(true);
                        setTimeout(() => setTokenSaved(false), 2500);
                        showToast(githubToken ? 'GitHub Token saved!' : 'GitHub Token cleared.');
                      }}
                      className="px-3.5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {tokenSaved ? 'Saved!' : 'Save Token'}
                    </button>
                  </div>
                </div>

                {/* Git Push Instructions */}
                <div className="bg-[#050810] border border-zinc-800/80 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
                      <Terminal size={14} className="text-yellow-400" />
                      <span>Deploy changes to GitHub / Vercel (Terminal):</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const cmd = 'git add src/data.ts public/\ngit commit -m "Update portfolio content via Admin Panel"\ngit push';
                        navigator.clipboard.writeText(cmd);
                        setCopiedGitCmd(true);
                        setTimeout(() => setCopiedGitCmd(false), 3000);
                        showToast('Git commands copied to clipboard!');
                      }}
                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      {copiedGitCmd ? (
                        <>
                          <CheckCheck size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Commands</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-zinc-400 bg-black/40 p-3 rounded-lg overflow-x-auto select-all">
                    <code>
                      git add src/data.ts public/<br />
                      git commit -m "Update portfolio content via Admin Panel"<br />
                      git push
                    </code>
                  </pre>
                  <p className="text-[11px] text-zinc-500">
                    💡 Once pushed to GitHub, Vercel/Netlify will automatically build and deploy your updated portfolio to all devices worldwide.
                  </p>
                </div>
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

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Subtitle / Role Summary
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

              {/* Multi-Category Selector */}
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Assigned Categories <span className="text-yellow-400 font-normal lowercase">(multiple allowed)</span>
                    </label>
                    <p className="text-[11px] text-zinc-500">Click categories to assign or remove</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      {(projectForm.categories || []).length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowQuickAddCat(!showQuickAddCat)}
                      className="text-[11px] font-semibold text-yellow-400 hover:text-yellow-300 flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Plus size={12} />
                      <span>New Category</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setManageCategoriesModalOpen(true)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                    >
                      Manage All
                    </button>
                  </div>
                </div>

                {/* Inline Quick Add Category */}
                {showQuickAddCat && (
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-yellow-500/40 flex items-center gap-2">
                    <input
                      type="text"
                      value={quickCatName}
                      onChange={(e) => setQuickCatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQuickAddCategory();
                        }
                      }}
                      placeholder="Category name (e.g. Mobile Apps, DevOps)..."
                      className="flex-1 px-2.5 py-1.5 rounded-md bg-zinc-950 border border-zinc-700 text-xs text-zinc-100 focus:border-yellow-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleQuickAddCategory}
                      className="px-3 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuickAddCat(false);
                        setQuickCatName('');
                      }}
                      className="px-2 py-1.5 rounded-md text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Category Selection Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {projectCategories.map((cat) => {
                    const isSelected = (projectForm.categories || []).includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategoryInForm(cat.id)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-yellow-500 text-black border-yellow-500 shadow-md shadow-yellow-500/20 font-bold'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-700/60 hover:border-zinc-500 hover:bg-zinc-800'
                        }`}
                      >
                        {getCategoryIconComponent(cat.iconName, 'w-3.5 h-3.5')}
                        <span>{cat.name}</span>
                        {isSelected && <Check size={13} className="stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {(!projectForm.categories || projectForm.categories.length === 0) && (
                  <p className="text-[11px] text-rose-400 flex items-center space-x-1 pt-1">
                    <span>⚠️ Please select at least one category for this project.</span>
                  </p>
                )}
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
      {/* MODAL: MANAGE PROJECT CATEGORIES */}
      {/* ======================================================== */}
      {manageCategoriesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                  <Tags className="text-yellow-400" size={20} />
                  <span>Manage Project Categories</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Create, customize, or delete categories for your engineering projects showcase.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManageCategoriesModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-zinc-400 font-mono">
                {projectCategories.length} {projectCategories.length === 1 ? 'category' : 'categories'} configured
              </span>
              <button
                type="button"
                onClick={openAddProjCategoryModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>

            {/* Categories List */}
            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {projectCategories.map((cat) => {
                const assignedProjects = projectsData.filter((p) => {
                  const cats = p.categories && p.categories.length > 0 ? p.categories : [p.category || 'web'];
                  return cats.includes(cat.id);
                });

                return (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">
                        {getCategoryIconComponent(cat.iconName, 'w-4 h-4')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-sm text-zinc-100 truncate">{cat.name}</h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                            {cat.id}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-zinc-400 mt-0.5 truncate">{cat.description}</p>
                        )}
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          {assignedProjects.length} {assignedProjects.length === 1 ? 'project' : 'projects'} assigned
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditProjCategoryModal(cat)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProjCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-5 border-t border-zinc-800 mt-5">
              <button
                type="button"
                onClick={() => setManageCategoriesModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PROJECT CATEGORY */}
      {/* ======================================================== */}
      {projCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <Tag className="text-yellow-400" size={18} />
                <span>{editingProjCategory ? 'Edit Project Category' : 'Add New Category'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setProjCategoryModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProjCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={projCategoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    if (!editingProjCategory && (!projCategoryForm.id || projCategoryForm.id === projCategoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))) {
                      const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setProjCategoryForm({ ...projCategoryForm, name, id: autoSlug });
                    } else {
                      setProjCategoryForm({ ...projCategoryForm, name });
                    }
                  }}
                  placeholder="e.g. Mobile Apps, Cloud & DevOps"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Category ID / Slug
                </label>
                <input
                  type="text"
                  required
                  value={projCategoryForm.id}
                  onChange={(e) =>
                    setProjCategoryForm({
                      ...projCategoryForm,
                      id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
                    })
                  }
                  placeholder="e.g. mobile, cloud-devops"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-mono text-yellow-400 focus:border-yellow-500 focus:outline-none"
                />
                <p className="text-[11px] text-zinc-500 mt-1">Unique slug used for URL filters & project grouping</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Icon Identifier
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-yellow-400">
                    {getCategoryIconComponent(projCategoryForm.iconName, 'w-5 h-5')}
                  </div>
                  <select
                    value={projCategoryForm.iconName || 'Code'}
                    onChange={(e) => setProjCategoryForm({ ...projCategoryForm, iconName: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="Code">Code (MERN / Web)</option>
                    <option value="BrainCircuit">BrainCircuit (Data Science & ML)</option>
                    <option value="Cpu">Cpu (AI & Automation)</option>
                    <option value="Layers">Layers (Full Stack)</option>
                    <option value="Smartphone">Smartphone (Mobile Apps)</option>
                    <option value="Globe">Globe (Web & Cloud)</option>
                    <option value="Database">Database (Data & Backend)</option>
                    <option value="Cloud">Cloud (Cloud Computing)</option>
                    <option value="Terminal">Terminal (CLI & Systems)</option>
                    <option value="Sparkles">Sparkles (Creative / AI)</option>
                    <option value="ShieldCheck">ShieldCheck (Security / QA)</option>
                    <option value="Box">Box (Tools / Libraries)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={projCategoryForm.description || ''}
                  onChange={(e) => setProjCategoryForm({ ...projCategoryForm, description: e.target.value })}
                  placeholder="Short summary for this category..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setProjCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold cursor-pointer"
                >
                  Save Category
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
