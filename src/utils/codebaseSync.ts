import {
  PersonalInfo,
  SkillCategory,
  ProjectCategory,
  Project,
  Experience,
  Education,
  Achievement,
  Interest,
} from '../types';
import { getCvFile } from './cvStorage';

export async function getCvBase64(): Promise<string | undefined> {
  try {
    const cvRecord = await getCvFile();
    if (cvRecord && cvRecord.blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(cvRecord.blob);
      });
    }
  } catch (e) {
    console.error('Error reading CV file for codebase sync:', e);
  }
  return undefined;
}

export interface CodebasePayload {
  personalInfo: PersonalInfo;
  skillsData: SkillCategory[];
  projectCategories: ProjectCategory[];
  projectsData: Project[];
  experienceData: Experience[];
  educationData: Education[];
  achievementsData: Achievement[];
  interestsData: Interest[];
  cvBase64?: string;
  cvFileName?: string;
}

export function generateDataTsContent(payload: CodebasePayload): string {
  // 1. Imports
  let code = `import { Project, ProjectCategory, SkillCategory, Experience, Education, Achievement } from './types';
import portraitImg from './assets/images/im.png';
import fastHubImg from './assets/images/fast-academic-hub.png';
import studentMarksImg from './assets/images/student-marks-prediction.png';
import churnPredImg from './assets/images/customer-churn-prediction.jpg';
import aiHunterImg from './assets/images/ai-internship-hunter.jpg';
import invoiceGenImg from './assets/images/na-invoice-generator.png';
import memoryGameImg from './assets/images/memory-matching-game.png';
import industrialWebImg from './assets/images/industrial-website.png';\n\n`;

  // 2. Personal Info
  let personalInfoStr = JSON.stringify(payload.personalInfo, null, 2);
  // Preserve portraitImg variable if default portrait image is used
  personalInfoStr = personalInfoStr.replace(
    /"portraitUrl":\s*"[^"]*(?:im\.(?:png|jpg)|portraitImg)[^"]*"/,
    '"portraitUrl": portraitImg'
  );
  code += `export const personalInfo = ${personalInfoStr};\n\n`;

  // 3. Skills Data
  code += `export const skillsData: SkillCategory[] = ${JSON.stringify(payload.skillsData, null, 2)};\n\n`;

  // 4. Default Project Categories
  code += `export const defaultProjectCategories: ProjectCategory[] = ${JSON.stringify(
    payload.projectCategories,
    null,
    2
  )};\n\n`;

  // 5. Projects Data (map default assets back to variable identifiers)
  const imageMap: Record<string, string> = {
    'fast-academic-hub': 'fastHubImg',
    'student-marks-prediction': 'studentMarksImg',
    'customer-churn-prediction': 'churnPredImg',
    'ai-internship-hunter': 'aiHunterImg',
    'na-invoice-generator': 'invoiceGenImg',
    'memory-matching-game': 'memoryGameImg',
    'industrial-website': 'industrialWebImg',
  };

  let projectsStr = JSON.stringify(payload.projectsData, null, 2);
  for (const [key, varName] of Object.entries(imageMap)) {
    const regex = new RegExp(`"imageUrl":\\s*"[^"]*${key}[^"]*"`, 'g');
    projectsStr = projectsStr.replace(regex, `"imageUrl": ${varName}`);
  }
  code += `export const projectsData: Project[] = ${projectsStr};\n\n`;

  // 6. Experience Data
  code += `export const experienceData: Experience[] = ${JSON.stringify(payload.experienceData, null, 2)};\n\n`;

  // 7. Education Data
  code += `export const educationData: Education[] = ${JSON.stringify(payload.educationData, null, 2)};\n\n`;

  // 8. Achievements Data
  code += `export const achievementsData: Achievement[] = ${JSON.stringify(payload.achievementsData, null, 2)};\n\n`;

  // 9. Interests Data
  code += `export const interestsData = ${JSON.stringify(payload.interestsData, null, 2)};\n`;

  return code;
}

export function downloadDataTsFile(payload: CodebasePayload) {
  const content = generateDataTsContent(payload);
  const blob = new Blob([content], { type: 'text/typescript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.ts';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function saveToCodebaseApi(payload: CodebasePayload): Promise<{
  success: boolean;
  message: string;
  isApi: boolean;
}> {
  try {
    const response = await fetch('/api/save-codebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Changes saved directly to src/data.ts!',
        isApi: true,
      };
    } else {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errData.error || `Server returned error (${response.status})`,
        isApi: true,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Local save API endpoint is only active when running Vite locally.',
      isApi: false,
    };
  }
}
