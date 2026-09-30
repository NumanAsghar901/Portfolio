import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  ProjectCategory,
  SkillCategory,
  Experience,
  Education,
  Achievement,
  Interest,
  PersonalInfo,
  CvMetadata,
  Skill,
} from '../types';
import {
  personalInfo as defaultPersonalInfo,
  skillsData as defaultSkillsData,
  projectsData as defaultProjectsData,
  defaultProjectCategories,
  experienceData as defaultExperienceData,
  educationData as defaultEducationData,
  achievementsData as defaultAchievementsData,
  interestsData as defaultInterestsData,
} from '../data';
import { saveCvFile, getCvFile, deleteCvFile } from '../utils/cvStorage';

const STORAGE_KEYS = {
  PERSONAL_INFO: 'portfolio_personal_info_v2',
  SKILLS: 'portfolio_skills_data_v2',
  PROJECTS: 'portfolio_projects_data_v2',
  PROJECT_CATEGORIES: 'portfolio_project_categories_v2',
  EXPERIENCE: 'portfolio_experience_data_v2',
  EDUCATION: 'portfolio_education_data_v2',
  ACHIEVEMENTS: 'portfolio_achievements_data_v2',
  INTERESTS: 'portfolio_interests_data_v2',
  CV_METADATA: 'portfolio_cv_metadata_v2',
};

// Initial extended PersonalInfo defaults
const initialPersonalInfo: PersonalInfo = {
  ...defaultPersonalInfo,
  brandName: 'Numan',
  aboutTitle: 'Engineering With Passion While Exploring AI & Web.',
  aboutSubtitle:
    "I'm Numan Asghar, a Full Stack Developer & AI Specialist based in Faisalabad. I have a passion for creating scalable web applications and intelligent automation workflows.",
  origin: 'Faisalabad, PK',
  availability: 'Open to Work',
  yearsExp: '02+',
  projectsCount: '10+',
  awardsCount: '03+',
  heroGreeting: "Hello, I'm Numan Asghar 👋",
  heroHeadline: 'I DESIGN & BUILD DIGITAL EXPERIENCES',
  heroHeadlinePrefix: 'I DESIGN & BUILD',
  heroHeadlineHighlight: 'DIGITAL EXPERIENCES',
};

interface PortfolioContextType {
  personalInfo: PersonalInfo;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  skillsData: SkillCategory[];
  addSkillCategory: (cat: SkillCategory) => void;
  updateSkillCategory: (index: number, cat: SkillCategory) => void;
  deleteSkillCategory: (index: number) => void;
  addSkill: (catIndex: number, skill: Skill) => void;
  updateSkill: (catIndex: number, skillIndex: number, skill: Skill) => void;
  deleteSkill: (catIndex: number, skillIndex: number) => void;
  projectsData: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Project) => void;
  deleteProject: (id: string) => void;
  projectCategories: ProjectCategory[];
  addProjectCategory: (category: ProjectCategory) => void;
  updateProjectCategory: (id: string, category: ProjectCategory) => void;
  deleteProjectCategory: (id: string) => void;
  experienceData: Experience[];
  addExperience: (exp: Experience) => void;
  updateExperience: (index: number, exp: Experience) => void;
  deleteExperience: (index: number) => void;
  educationData: Education[];
  addEducation: (edu: Education) => void;
  updateEducation: (index: number, edu: Education) => void;
  deleteEducation: (index: number) => void;
  achievementsData: Achievement[];
  addAchievement: (ach: Achievement) => void;
  updateAchievement: (index: number, ach: Achievement) => void;
  deleteAchievement: (index: number) => void;
  interestsData: Interest[];
  addInterest: (interest: Interest) => void;
  updateInterest: (index: number, interest: Interest) => void;
  deleteInterest: (index: number) => void;
  cvMetadata: CvMetadata | null;
  uploadCv: (file: File) => Promise<void>;
  deleteCv: () => Promise<void>;
  downloadCv: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

function safeSaveStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('portfolio_data_sync', { detail: { key } }));
    return true;
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
    return false;
  }
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
        return { ...defaultValue, ...parsed };
      }
      if (Array.isArray(defaultValue) && Array.isArray(parsed)) {
        return parsed.length > 0 ? (parsed as unknown as T) : defaultValue;
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
  }
  return defaultValue;
}

function normalizeProjects(projects: any[]): Project[] {
  if (!Array.isArray(projects)) return defaultProjectsData;
  return projects.map((p) => {
    let categories: string[] = [];
    if (Array.isArray(p.categories) && p.categories.length > 0) {
      categories = p.categories.filter((c: any) => typeof c === 'string' && c.trim().length > 0);
    } else if (typeof p.category === 'string' && p.category.trim().length > 0) {
      categories = [p.category.trim()];
    } else {
      categories = ['web'];
    }
    if (categories.length === 0) {
      categories = ['web'];
    }
    return {
      ...p,
      categories,
      category: categories[0] || 'web',
    };
  });
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfoState] = useState<PersonalInfo>(() =>
    loadFromStorage(STORAGE_KEYS.PERSONAL_INFO, initialPersonalInfo)
  );

  const [skillsData, setSkillsDataState] = useState<SkillCategory[]>(() =>
    loadFromStorage(STORAGE_KEYS.SKILLS, defaultSkillsData)
  );

  const [projectCategories, setProjectCategoriesState] = useState<ProjectCategory[]>(() =>
    loadFromStorage(STORAGE_KEYS.PROJECT_CATEGORIES, defaultProjectCategories)
  );

  const [projectsData, setProjectsDataState] = useState<Project[]>(() =>
    normalizeProjects(loadFromStorage(STORAGE_KEYS.PROJECTS, defaultProjectsData))
  );

  const [experienceData, setExperienceDataState] = useState<Experience[]>(() =>
    loadFromStorage(STORAGE_KEYS.EXPERIENCE, defaultExperienceData)
  );

  const [educationData, setEducationDataState] = useState<Education[]>(() =>
    loadFromStorage(STORAGE_KEYS.EDUCATION, defaultEducationData)
  );

  const [achievementsData, setAchievementsDataState] = useState<Achievement[]>(() =>
    loadFromStorage(STORAGE_KEYS.ACHIEVEMENTS, defaultAchievementsData)
  );

  const [interestsData, setInterestsDataState] = useState<Interest[]>(() =>
    loadFromStorage(STORAGE_KEYS.INTERESTS, defaultInterestsData as Interest[])
  );

  const [cvMetadata, setCvMetadataState] = useState<CvMetadata | null>(() =>
    loadFromStorage(STORAGE_KEYS.CV_METADATA, null)
  );

  // Synchronize across tabs and storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === STORAGE_KEYS.PERSONAL_INFO) {
          if (e.newValue) {
            setPersonalInfoState((prev) => ({ ...initialPersonalInfo, ...JSON.parse(e.newValue!) }));
          } else {
            setPersonalInfoState(initialPersonalInfo);
          }
        }
        if (e.key === STORAGE_KEYS.SKILLS) {
          if (e.newValue) setSkillsDataState(JSON.parse(e.newValue));
          else setSkillsDataState(defaultSkillsData);
        }
        if (e.key === STORAGE_KEYS.PROJECT_CATEGORIES) {
          if (e.newValue) setProjectCategoriesState(JSON.parse(e.newValue));
          else setProjectCategoriesState(defaultProjectCategories);
        }
        if (e.key === STORAGE_KEYS.PROJECTS) {
          if (e.newValue) setProjectsDataState(normalizeProjects(JSON.parse(e.newValue)));
          else setProjectsDataState(defaultProjectsData);
        }
        if (e.key === STORAGE_KEYS.EXPERIENCE) {
          if (e.newValue) setExperienceDataState(JSON.parse(e.newValue));
          else setExperienceDataState(defaultExperienceData);
        }
        if (e.key === STORAGE_KEYS.EDUCATION) {
          if (e.newValue) setEducationDataState(JSON.parse(e.newValue));
          else setEducationDataState(defaultEducationData);
        }
        if (e.key === STORAGE_KEYS.ACHIEVEMENTS) {
          if (e.newValue) setAchievementsDataState(JSON.parse(e.newValue));
          else setAchievementsDataState(defaultAchievementsData);
        }
        if (e.key === STORAGE_KEYS.INTERESTS) {
          if (e.newValue) setInterestsDataState(JSON.parse(e.newValue));
          else setInterestsDataState(defaultInterestsData as Interest[]);
        }
        if (e.key === STORAGE_KEYS.CV_METADATA) {
          if (e.newValue) setCvMetadataState(JSON.parse(e.newValue));
          else setCvMetadataState(null);
        }
      } catch (err) {
        console.error('Storage sync error:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync to localStorage
  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setPersonalInfoState((prev) => {
      const updated = { ...prev, ...info };
      safeSaveStorage(STORAGE_KEYS.PERSONAL_INFO, updated);
      return updated;
    });
  };

  // Skills
  const addSkillCategory = (cat: SkillCategory) => {
    setSkillsDataState((prev) => {
      const updated = [...prev, cat];
      safeSaveStorage(STORAGE_KEYS.SKILLS, updated);
      return updated;
    });
  };

  const updateSkillCategory = (index: number, cat: SkillCategory) => {
    setSkillsDataState((prev) => {
      const updated = [...prev];
      updated[index] = cat;
      safeSaveStorage(STORAGE_KEYS.SKILLS, updated);
      return updated;
    });
  };

  const deleteSkillCategory = (index: number) => {
    setSkillsDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      safeSaveStorage(STORAGE_KEYS.SKILLS, updated);
      return updated;
    });
  };

  const addSkill = (catIndex: number, skill: Skill) => {
    setSkillsDataState((prev) => {
      const updated = [...prev];
      const cat = { ...updated[catIndex] };
      cat.skills = [...cat.skills, skill];
      updated[catIndex] = cat;
      safeSaveStorage(STORAGE_KEYS.SKILLS, updated);
      return updated;
    });
  };

  const updateSkill = (catIndex: number, skillIndex: number, skill: Skill) => {
    setSkillsDataState((prev) => {
      const updated = [...prev];
      const cat = { ...updated[catIndex] };
      const skillsCopy = [...cat.skills];
      skillsCopy[skillIndex] = skill;
      cat.skills = skillsCopy;
      updated[catIndex] = cat;
      safeSaveStorage(STORAGE_KEYS.SKILLS, updated);
      return updated;
    });
  };

  const deleteSkill = (catIndex: number, skillIndex: number) => {
    setSkillsDataState((prev) => {
      const updated = [...prev];
      const cat = { ...updated[catIndex] };
      cat.skills = cat.skills.filter((_, i) => i !== skillIndex);
      updated[catIndex] = cat;
      safeSaveStorage(STORAGE_KEYS.SKILLS, updated);
      return updated;
    });
  };

  // Projects
  const addProject = (project: Project) => {
    const rawCats = Array.isArray(project.categories) && project.categories.length > 0
      ? project.categories
      : (project.category ? [project.category] : ['web']);
    const normalized: Project = {
      ...project,
      categories: rawCats,
      category: rawCats[0] || 'web',
    };
    setProjectsDataState((prev) => {
      const updated = [normalized, ...prev];
      safeSaveStorage(STORAGE_KEYS.PROJECTS, updated);
      return updated;
    });
  };

  const updateProject = (id: string, project: Project) => {
    const rawCats = Array.isArray(project.categories) && project.categories.length > 0
      ? project.categories
      : (project.category ? [project.category] : ['web']);
    const normalized: Project = {
      ...project,
      categories: rawCats,
      category: rawCats[0] || 'web',
    };
    setProjectsDataState((prev) => {
      const updated = prev.map((p) => (p.id === id ? normalized : p));
      safeSaveStorage(STORAGE_KEYS.PROJECTS, updated);
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setProjectsDataState((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      safeSaveStorage(STORAGE_KEYS.PROJECTS, updated);
      return updated;
    });
  };

  // Project Categories CRUD
  const addProjectCategory = (category: ProjectCategory) => {
    setProjectCategoriesState((prev) => {
      if (prev.some((c) => c.id === category.id)) {
        return prev;
      }
      const updated = [...prev, category];
      safeSaveStorage(STORAGE_KEYS.PROJECT_CATEGORIES, updated);
      return updated;
    });
  };

  const updateProjectCategory = (id: string, category: ProjectCategory) => {
    setProjectCategoriesState((prev) => {
      const updated = prev.map((c) => (c.id === id ? category : c));
      safeSaveStorage(STORAGE_KEYS.PROJECT_CATEGORIES, updated);
      return updated;
    });
    // If ID changed, migrate projects referencing old category ID
    if (id !== category.id) {
      setProjectsDataState((prev) => {
        const updatedProjects = prev.map((p) => {
          const currentCats = p.categories || [p.category || 'web'];
          const newCats = currentCats.map((cid) => (cid === id ? category.id : cid));
          return {
            ...p,
            categories: newCats,
            category: newCats[0] || 'web',
          };
        });
        safeSaveStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
        return updatedProjects;
      });
    }
  };

  const deleteProjectCategory = (id: string) => {
    setProjectCategoriesState((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      safeSaveStorage(STORAGE_KEYS.PROJECT_CATEGORIES, updated);
      return updated;
    });
    // Update any projects referencing the deleted category
    setProjectsDataState((prev) => {
      const updatedProjects = prev.map((p) => {
        const currentCats = p.categories || [p.category || 'web'];
        const remaining = currentCats.filter((cid) => cid !== id);
        const finalCats = remaining.length > 0 ? remaining : ['web'];
        return {
          ...p,
          categories: finalCats,
          category: finalCats[0] || 'web',
        };
      });
      safeSaveStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
      return updatedProjects;
    });
  };

  // Experience
  const addExperience = (exp: Experience) => {
    setExperienceDataState((prev) => {
      const updated = [exp, ...prev];
      safeSaveStorage(STORAGE_KEYS.EXPERIENCE, updated);
      return updated;
    });
  };

  const updateExperience = (index: number, exp: Experience) => {
    setExperienceDataState((prev) => {
      const updated = [...prev];
      updated[index] = exp;
      safeSaveStorage(STORAGE_KEYS.EXPERIENCE, updated);
      return updated;
    });
  };

  const deleteExperience = (index: number) => {
    setExperienceDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      safeSaveStorage(STORAGE_KEYS.EXPERIENCE, updated);
      return updated;
    });
  };

  // Education
  const addEducation = (edu: Education) => {
    setEducationDataState((prev) => {
      const updated = [edu, ...prev];
      safeSaveStorage(STORAGE_KEYS.EDUCATION, updated);
      return updated;
    });
  };

  const updateEducation = (index: number, edu: Education) => {
    setEducationDataState((prev) => {
      const updated = [...prev];
      updated[index] = edu;
      safeSaveStorage(STORAGE_KEYS.EDUCATION, updated);
      return updated;
    });
  };

  const deleteEducation = (index: number) => {
    setEducationDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      safeSaveStorage(STORAGE_KEYS.EDUCATION, updated);
      return updated;
    });
  };

  // Achievements
  const addAchievement = (ach: Achievement) => {
    setAchievementsDataState((prev) => {
      const updated = [ach, ...prev];
      safeSaveStorage(STORAGE_KEYS.ACHIEVEMENTS, updated);
      return updated;
    });
  };

  const updateAchievement = (index: number, ach: Achievement) => {
    setAchievementsDataState((prev) => {
      const updated = [...prev];
      updated[index] = ach;
      safeSaveStorage(STORAGE_KEYS.ACHIEVEMENTS, updated);
      return updated;
    });
  };

  const deleteAchievement = (index: number) => {
    setAchievementsDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      safeSaveStorage(STORAGE_KEYS.ACHIEVEMENTS, updated);
      return updated;
    });
  };

  // Interests
  const addInterest = (interest: Interest) => {
    setInterestsDataState((prev) => {
      const updated = [...prev, interest];
      safeSaveStorage(STORAGE_KEYS.INTERESTS, updated);
      return updated;
    });
  };

  const updateInterest = (index: number, interest: Interest) => {
    setInterestsDataState((prev) => {
      const updated = [...prev];
      updated[index] = interest;
      safeSaveStorage(STORAGE_KEYS.INTERESTS, updated);
      return updated;
    });
  };

  const deleteInterest = (index: number) => {
    setInterestsDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      safeSaveStorage(STORAGE_KEYS.INTERESTS, updated);
      return updated;
    });
  };

  // CV Handlers
  const uploadCv = async (file: File) => {
    const record = await saveCvFile(file);
    const meta: CvMetadata = {
      fileName: record.name,
      fileSize: record.size,
      updatedAt: record.updatedAt,
    };
    setCvMetadataState(meta);
    safeSaveStorage(STORAGE_KEYS.CV_METADATA, meta);
  };

  const deleteCv = async () => {
    await deleteCvFile();
    setCvMetadataState(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CV_METADATA);
      window.dispatchEvent(new CustomEvent('portfolio_data_sync', { detail: { key: STORAGE_KEYS.CV_METADATA } }));
    } catch (e) {
      console.error(e);
    }
  };

  const downloadCv = async () => {
    try {
      const stored = await getCvFile();

      if (stored && stored.blob) {
        // User uploaded custom CV
        const safeBlob = new Blob([stored.blob], { type: 'application/pdf' });
        const url = URL.createObjectURL(safeBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = stored.name || 'Muhammad_Numan_Asghar_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      } else {
        // Standard verified static PDF file served by web server
        const a = document.createElement('a');
        a.href = '/Numan_Asghar_CV.pdf';
        a.download = 'Muhammad_Numan_Asghar_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading CV:', err);
      // Fallback direct link
      window.open('/Numan_Asghar_CV.pdf', '_blank');
    }
  };

  const resetToDefaults = async () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PERSONAL_INFO);
      localStorage.removeItem(STORAGE_KEYS.SKILLS);
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.PROJECT_CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.EXPERIENCE);
      localStorage.removeItem(STORAGE_KEYS.EDUCATION);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      localStorage.removeItem(STORAGE_KEYS.INTERESTS);
      localStorage.removeItem(STORAGE_KEYS.CV_METADATA);
      window.dispatchEvent(new CustomEvent('portfolio_data_sync', { detail: { key: 'ALL_RESET' } }));
    } catch (e) {
      console.error(e);
    }
    await deleteCvFile();

    setPersonalInfoState(initialPersonalInfo);
    setSkillsDataState(defaultSkillsData);
    setProjectCategoriesState(defaultProjectCategories);
    setProjectsDataState(defaultProjectsData);
    setExperienceDataState(defaultExperienceData);
    setEducationDataState(defaultEducationData);
    setAchievementsDataState(defaultAchievementsData);
    setInterestsDataState(defaultInterestsData as Interest[]);
    setCvMetadataState(null);
  };

  const exportDataJson = () => {
    const data = {
      personalInfo,
      skillsData,
      projectCategories,
      projectsData,
      experienceData,
      educationData,
      achievementsData,
      interestsData,
      cvMetadata,
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.personalInfo) {
        const mergedPersonal = { ...initialPersonalInfo, ...data.personalInfo };
        setPersonalInfoState(mergedPersonal);
        safeSaveStorage(STORAGE_KEYS.PERSONAL_INFO, mergedPersonal);
      }
      if (data.skillsData && Array.isArray(data.skillsData)) {
        setSkillsDataState(data.skillsData);
        safeSaveStorage(STORAGE_KEYS.SKILLS, data.skillsData);
      }
      if (data.projectCategories && Array.isArray(data.projectCategories)) {
        setProjectCategoriesState(data.projectCategories);
        safeSaveStorage(STORAGE_KEYS.PROJECT_CATEGORIES, data.projectCategories);
      }
      if (data.projectsData && Array.isArray(data.projectsData)) {
        const normalized = normalizeProjects(data.projectsData);
        setProjectsDataState(normalized);
        safeSaveStorage(STORAGE_KEYS.PROJECTS, normalized);
      }
      if (data.experienceData && Array.isArray(data.experienceData)) {
        setExperienceDataState(data.experienceData);
        safeSaveStorage(STORAGE_KEYS.EXPERIENCE, data.experienceData);
      }
      if (data.educationData && Array.isArray(data.educationData)) {
        setEducationDataState(data.educationData);
        safeSaveStorage(STORAGE_KEYS.EDUCATION, data.educationData);
      }
      if (data.achievementsData && Array.isArray(data.achievementsData)) {
        setAchievementsDataState(data.achievementsData);
        safeSaveStorage(STORAGE_KEYS.ACHIEVEMENTS, data.achievementsData);
      }
      if (data.interestsData && Array.isArray(data.interestsData)) {
        setInterestsDataState(data.interestsData);
        safeSaveStorage(STORAGE_KEYS.INTERESTS, data.interestsData);
      }
      return true;
    } catch (e) {
      console.error('Invalid JSON import', e);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
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
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
