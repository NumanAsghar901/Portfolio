import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
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
  EXPERIENCE: 'portfolio_experience_data_v2',
  EDUCATION: 'portfolio_education_data_v2',
  ACHIEVEMENTS: 'portfolio_achievements_data_v2',
  INTERESTS: 'portfolio_interests_data_v2',
  CV_METADATA: 'portfolio_cv_metadata_v2',
};

// Initial extended PersonalInfo defaults
const initialPersonalInfo: PersonalInfo = {
  ...defaultPersonalInfo,
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

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
  }
  return defaultValue;
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfoState] = useState<PersonalInfo>(() =>
    loadFromStorage(STORAGE_KEYS.PERSONAL_INFO, initialPersonalInfo)
  );

  const [skillsData, setSkillsDataState] = useState<SkillCategory[]>(() =>
    loadFromStorage(STORAGE_KEYS.SKILLS, defaultSkillsData)
  );

  const [projectsData, setProjectsDataState] = useState<Project[]>(() =>
    loadFromStorage(STORAGE_KEYS.PROJECTS, defaultProjectsData)
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
        if (e.key === STORAGE_KEYS.PERSONAL_INFO && e.newValue) {
          setPersonalInfoState(JSON.parse(e.newValue));
        }
        if (e.key === STORAGE_KEYS.SKILLS && e.newValue) {
          setSkillsDataState(JSON.parse(e.newValue));
        }
        if (e.key === STORAGE_KEYS.PROJECTS && e.newValue) {
          setProjectsDataState(JSON.parse(e.newValue));
        }
        if (e.key === STORAGE_KEYS.EXPERIENCE && e.newValue) {
          setExperienceDataState(JSON.parse(e.newValue));
        }
        if (e.key === STORAGE_KEYS.EDUCATION && e.newValue) {
          setEducationDataState(JSON.parse(e.newValue));
        }
        if (e.key === STORAGE_KEYS.ACHIEVEMENTS && e.newValue) {
          setAchievementsDataState(JSON.parse(e.newValue));
        }
        if (e.key === STORAGE_KEYS.INTERESTS && e.newValue) {
          setInterestsDataState(JSON.parse(e.newValue));
        }
        if (e.key === STORAGE_KEYS.CV_METADATA && e.newValue) {
          setCvMetadataState(JSON.parse(e.newValue));
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
      localStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(updated));
      return updated;
    });
  };

  // Skills
  const addSkillCategory = (cat: SkillCategory) => {
    setSkillsDataState((prev) => {
      const updated = [...prev, cat];
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSkillCategory = (index: number, cat: SkillCategory) => {
    setSkillsDataState((prev) => {
      const updated = [...prev];
      updated[index] = cat;
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSkillCategory = (index: number) => {
    setSkillsDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
      return updated;
    });
  };

  const addSkill = (catIndex: number, skill: Skill) => {
    setSkillsDataState((prev) => {
      const updated = [...prev];
      const cat = { ...updated[catIndex] };
      cat.skills = [...cat.skills, skill];
      updated[catIndex] = cat;
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
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
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSkill = (catIndex: number, skillIndex: number) => {
    setSkillsDataState((prev) => {
      const updated = [...prev];
      const cat = { ...updated[catIndex] };
      cat.skills = cat.skills.filter((_, i) => i !== skillIndex);
      updated[catIndex] = cat;
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
      return updated;
    });
  };

  // Projects
  const addProject = (project: Project) => {
    setProjectsDataState((prev) => {
      const updated = [project, ...prev];
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateProject = (id: string, project: Project) => {
    setProjectsDataState((prev) => {
      const updated = prev.map((p) => (p.id === id ? project : p));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setProjectsDataState((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      return updated;
    });
  };

  // Experience
  const addExperience = (exp: Experience) => {
    setExperienceDataState((prev) => {
      const updated = [exp, ...prev];
      localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(updated));
      return updated;
    });
  };

  const updateExperience = (index: number, exp: Experience) => {
    setExperienceDataState((prev) => {
      const updated = [...prev];
      updated[index] = exp;
      localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteExperience = (index: number) => {
    setExperienceDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(updated));
      return updated;
    });
  };

  // Education
  const addEducation = (edu: Education) => {
    setEducationDataState((prev) => {
      const updated = [edu, ...prev];
      localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(updated));
      return updated;
    });
  };

  const updateEducation = (index: number, edu: Education) => {
    setEducationDataState((prev) => {
      const updated = [...prev];
      updated[index] = edu;
      localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteEducation = (index: number) => {
    setEducationDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(updated));
      return updated;
    });
  };

  // Achievements
  const addAchievement = (ach: Achievement) => {
    setAchievementsDataState((prev) => {
      const updated = [ach, ...prev];
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateAchievement = (index: number, ach: Achievement) => {
    setAchievementsDataState((prev) => {
      const updated = [...prev];
      updated[index] = ach;
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAchievement = (index: number) => {
    setAchievementsDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));
      return updated;
    });
  };

  // Interests
  const addInterest = (interest: Interest) => {
    setInterestsDataState((prev) => {
      const updated = [...prev, interest];
      localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateInterest = (index: number, interest: Interest) => {
    setInterestsDataState((prev) => {
      const updated = [...prev];
      updated[index] = interest;
      localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteInterest = (index: number) => {
    setInterestsDataState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(updated));
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
    localStorage.setItem(STORAGE_KEYS.CV_METADATA, JSON.stringify(meta));
  };

  const deleteCv = async () => {
    await deleteCvFile();
    setCvMetadataState(null);
    localStorage.removeItem(STORAGE_KEYS.CV_METADATA);
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
        // Standard verified static PDF file served by web server (no Chrome warnings)
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
    localStorage.removeItem(STORAGE_KEYS.PERSONAL_INFO);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.EXPERIENCE);
    localStorage.removeItem(STORAGE_KEYS.EDUCATION);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.INTERESTS);
    localStorage.removeItem(STORAGE_KEYS.CV_METADATA);
    await deleteCvFile();

    setPersonalInfoState(initialPersonalInfo);
    setSkillsDataState(defaultSkillsData);
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
        setPersonalInfoState(data.personalInfo);
        localStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(data.personalInfo));
      }
      if (data.skillsData) {
        setSkillsDataState(data.skillsData);
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(data.skillsData));
      }
      if (data.projectsData) {
        setProjectsDataState(data.projectsData);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projectsData));
      }
      if (data.experienceData) {
        setExperienceDataState(data.experienceData);
        localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(data.experienceData));
      }
      if (data.educationData) {
        setEducationDataState(data.educationData);
        localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(data.educationData));
      }
      if (data.achievementsData) {
        setAchievementsDataState(data.achievementsData);
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievementsData));
      }
      if (data.interestsData) {
        setInterestsDataState(data.interestsData);
        localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(data.interestsData));
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
