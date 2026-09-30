// Vercel Serverless Function to automatically commit portfolio changes to GitHub
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-github-token'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const token =
    process.env.GITHUB_TOKEN ||
    (req.headers['x-github-token'] as string | undefined);

  if (!token) {
    return res.status(400).json({
      success: false,
      needsToken: true,
      message:
        'GitHub Token not found. Add GITHUB_TOKEN to your Vercel Project Settings (Environment Variables) or enter your token in Admin Settings.',
    });
  }

  const repo = process.env.GITHUB_REPO || 'NumanAsghar901/Portfolio';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const payload = req.body;

  if (!payload || !payload.personalInfo) {
    return res.status(400).json({ success: false, message: 'Invalid payload structure.' });
  }

  try {
    // Generate data.ts content
    let code = `import { Project, ProjectCategory, SkillCategory, Experience, Education, Achievement } from './types';
import portraitImg from './assets/images/im.png';
import fastHubImg from './assets/images/fast-academic-hub.png';
import studentMarksImg from './assets/images/student-marks-prediction.png';
import churnPredImg from './assets/images/customer-churn-prediction.jpg';
import aiHunterImg from './assets/images/ai-internship-hunter.jpg';
import invoiceGenImg from './assets/images/na-invoice-generator.png';
import memoryGameImg from './assets/images/memory-matching-game.png';
import industrialWebImg from './assets/images/industrial-website.png';\n\n`;

    let personalInfoStr = JSON.stringify(payload.personalInfo, null, 2);
    personalInfoStr = personalInfoStr.replace(
      /"portraitUrl":\s*"[^"]*(?:im\.(?:png|jpg)|portraitImg)[^"]*"/,
      '"portraitUrl": portraitImg'
    );
    code += `export const CODEBASE_DATA_VERSION = '${Date.now()}';\n\n`;
    code += `export const personalInfo = ${personalInfoStr};\n\n`;
    code += `export const skillsData: SkillCategory[] = ${JSON.stringify(payload.skillsData, null, 2)};\n\n`;
    code += `export const defaultProjectCategories: ProjectCategory[] = ${JSON.stringify(
      payload.projectCategories,
      null,
      2
    )};\n\n`;

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
    code += `export const experienceData: Experience[] = ${JSON.stringify(payload.experienceData, null, 2)};\n\n`;
    code += `export const educationData: Education[] = ${JSON.stringify(payload.educationData, null, 2)};\n\n`;
    code += `export const achievementsData: Achievement[] = ${JSON.stringify(payload.achievementsData, null, 2)};\n\n`;
    code += `export const interestsData = ${JSON.stringify(payload.interestsData, null, 2)};\n`;

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
    }

    const base64Data = Buffer.from(code, 'utf-8').toString('base64');

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
      return res.status(putRes.status).json({
        success: false,
        message: errJson.message || `Failed to commit to GitHub (${putRes.status})`,
      });
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
        console.warn('Note: CV commit issue:', cvErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: '✓ Changes pushed directly to GitHub repository! Vercel is now deploying your live site (~30s).',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server error while committing to GitHub.',
    });
  }
}
