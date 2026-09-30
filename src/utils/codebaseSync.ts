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

  // 2. Codebase Data Version for cache synchronization
  code += `export const CODEBASE_DATA_VERSION = '${Date.now()}';\n\n`;

  // 3. Personal Info
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

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function saveDirectlyToGitHub(
  payload: CodebasePayload,
  token: string,
  repo: string = 'NumanAsghar901/Portfolio',
  branch: string = 'main'
): Promise<{ success: boolean; message: string }> {
  try {
    const dataTsContent = generateDataTsContent(payload);
    const base64Data = utf8ToBase64(dataTsContent);

    // 1. Get SHA of src/data.ts
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/src/data.ts?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    let currentSha: string | undefined;
    if (getRes.ok) {
      const getJson: any = await getRes.json();
      currentSha = getJson.sha;
    } else if (getRes.status === 401 || getRes.status === 403) {
      return {
        success: false,
        message: 'Invalid GitHub Token. Please check that your token has repo access permissions.',
      };
    }

    // 2. Commit updated src/data.ts
    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/src/data.ts`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update portfolio content via Admin Panel [auto-deploy]',
        content: base64Data,
        sha: currentSha,
        branch,
      }),
    });

    if (!putRes.ok) {
      const errJson: any = await putRes.json().catch(() => ({}));
      return {
        success: false,
        message: errJson.message || `Failed to commit to GitHub (${putRes.status})`,
      };
    }

    // 3. Commit CV if present
    if (payload.cvBase64) {
      try {
        const rawBase64 = payload.cvBase64.includes('base64,')
          ? payload.cvBase64.split('base64,')[1]
          : payload.cvBase64;

        for (const pdfPath of ['public/Numan_Asghar_CV.pdf', 'public/cv.pdf']) {
          const cvGet = await fetch(`https://api.github.com/repos/${repo}/contents/${pdfPath}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token.trim()}`,
              Accept: 'application/vnd.github.v3+json',
            },
          });
          let cvSha: string | undefined;
          if (cvGet.ok) {
            const cvJson: any = await cvGet.json();
            cvSha = cvJson.sha;
          }

          await fetch(`https://api.github.com/repos/${repo}/contents/${pdfPath}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token.trim()}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: 'Update portfolio CV via Admin Panel',
              content: rawBase64,
              sha: cvSha,
              branch,
            }),
          });
        }
      } catch (cvErr) {
        console.warn('Note: CV file commit had a minor issue:', cvErr);
      }
    }

    return {
      success: true,
      message: '✓ Changes committed directly to GitHub repository! Vercel is now deploying your updates live (~30s).',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error while connecting to GitHub API.',
    };
  }
}

export async function saveToCodebaseApi(
  payload: CodebasePayload,
  token?: string
): Promise<{
  success: boolean;
  message: string;
  isApi: boolean;
  needsToken?: boolean;
}> {
  const activeToken = token || localStorage.getItem('portfolio_github_token') || undefined;

  // 1. Try local dev server or Vercel serverless function endpoint
  try {
    const response = await fetch('/api/save-codebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(activeToken ? { 'x-github-token': activeToken } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Changes saved directly to codebase!',
        isApi: true,
      };
    }

    const errData = await response.json().catch(() => ({}));
    if (errData.needsToken && activeToken) {
      // Server needs token and we have one -> Fall through to client GitHub API
    } else if (response.status !== 404 && !errData.needsToken) {
      return {
        success: false,
        message: errData.error || errData.message || `Server returned error (${response.status})`,
        isApi: true,
      };
    }
  } catch {
    // Local /api/save-codebase endpoint not reached (or purely static)
  }

  // 2. If token is present, commit directly via GitHub REST API from client!
  if (activeToken) {
    const gitHubResult = await saveDirectlyToGitHub(payload, activeToken);
    return {
      success: gitHubResult.success,
      message: gitHubResult.message,
      isApi: true,
      needsToken: !gitHubResult.success,
    };
  }

  // 3. No token and not on local dev server
  return {
    success: false,
    message: 'On Vercel, please enter your GitHub Personal Access Token once in Admin Settings to enable 1-click cloud sync.',
    isApi: false,
    needsToken: true,
  };
}
