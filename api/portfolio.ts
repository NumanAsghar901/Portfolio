// Vercel Serverless Function for Dynamic Portfolio Data Fetching & Sync
import fs from 'fs';
import path from 'path';

// Helper to commit or update a file in a GitHub repository
async function commitFileToGitHub(
  repo: string,
  branch: string,
  filePath: string,
  base64Content: string,
  commitMessage: string,
  token: string
) {
  let currentSha: string | undefined;

  // 1. Get SHA if file already exists
  try {
    const getRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App',
        },
      }
    );
    if (getRes.ok) {
      const getJson: any = await getRes.json();
      currentSha = getJson.sha;
    }
  } catch (err) {
    console.warn(`Could not check SHA for ${filePath}:`, err);
  }

  // 2. Put file contents
  const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Portfolio-App',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: base64Content,
      sha: currentSha,
      branch,
    }),
  });

  return putRes;
}

// Generate valid TypeScript data.ts code string
function generateDataTsCode(payload: any): string {
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

  return code;
}

export default async function handler(req: any, res: any) {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-github-token, x-admin-key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const repo = process.env.GITHUB_REPO || 'NumanAsghar901/Portfolio';
  const branch = process.env.GITHUB_BRANCH || 'main';

  // ==========================================
  // GET: Return latest dynamic portfolio data
  // ==========================================
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 1. Try Vercel KV / Upstash Redis if configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const kvRes = await fetch(`${process.env.KV_REST_API_URL}/get/portfolio_data`, {
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
        });
        if (kvRes.ok) {
          const kvJson = await kvRes.json();
          if (kvJson.result) {
            const parsed = typeof kvJson.result === 'string' ? JSON.parse(kvJson.result) : kvJson.result;
            return res.status(200).json(parsed);
          }
        }
      } catch (err) {
        console.warn('KV read skipped or error:', err);
      }
    }

    // 2. Try fetching latest portfolio-data.json directly from GitHub repository
    try {
      const token = process.env.GITHUB_TOKEN;
      const ghHeaders: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App',
      };
      if (token) {
        ghHeaders['Authorization'] = `Bearer ${token.trim()}`;
      }

      // Fetch from GitHub REST API
      const ghRes = await fetch(
        `https://api.github.com/repos/${repo}/contents/src/portfolio-data.json?ref=${branch}&_t=${Date.now()}`,
        { headers: ghHeaders }
      );

      if (ghRes.ok) {
        const ghJson: any = await ghRes.json();
        if (ghJson.content) {
          const fileStr = Buffer.from(ghJson.content, 'base64').toString('utf-8');
          const data = JSON.parse(fileStr);
          return res.status(200).json(data);
        }
      } else {
        // Fallback to raw GitHub content URL
        const rawRes = await fetch(
          `https://raw.githubusercontent.com/${repo}/${branch}/src/portfolio-data.json?_t=${Date.now()}`
        );
        if (rawRes.ok) {
          const rawData = await rawRes.json();
          return res.status(200).json(rawData);
        }
      }
    } catch (ghErr) {
      console.warn('GitHub remote fetch fallback:', ghErr);
    }

    // 3. Fallback to local portfolio-data.json if available
    try {
      const localPath = path.resolve(process.cwd(), 'src/portfolio-data.json');
      if (fs.existsSync(localPath)) {
        const fileContent = fs.readFileSync(localPath, 'utf-8');
        return res.status(200).json(JSON.parse(fileContent));
      }
    } catch (fsErr) {
      console.warn('Local file fallback:', fsErr);
    }

    return res.status(404).json({
      success: false,
      message: 'No portfolio dynamic data found. Please publish from Admin Panel.',
    });
  }

  // ==========================================
  // POST: Update & publish portfolio dynamic data
  // ==========================================
  if (req.method === 'POST') {
    const token =
      process.env.GITHUB_TOKEN ||
      (req.headers['x-github-token'] as string | undefined) ||
      req.body?.githubToken;

    // Test connection mode
    if (req.query?.test === 'true') {
      if (!token) {
        return res.status(400).json({
          success: false,
          needsToken: true,
          message: 'GitHub Token not provided. Please enter a valid token.',
        });
      }
      try {
        const testRes = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App',
          },
        });
        if (testRes.ok) {
          const testData: any = await testRes.json();
          return res.status(200).json({
            success: true,
            message: `✓ Successfully verified connection to GitHub repository: ${testData.full_name} (${branch} branch)`,
            permissions: testData.permissions,
          });
        }
        const errJson: any = await testRes.json().catch(() => ({}));
        return res.status(testRes.status).json({
          success: false,
          message: errJson.message || `GitHub returned status ${testRes.status}. Check token permissions.`,
        });
      } catch (err: any) {
        return res.status(500).json({
          success: false,
          message: err?.message || 'Failed to connect to GitHub API.',
        });
      }
    }

    // Payload validation
    const payload = req.body;
    if (!payload || !payload.personalInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload structure. personalInfo is required.',
      });
    }

    // Check if token exists
    if (!token && !process.env.KV_REST_API_URL) {
      return res.status(400).json({
        success: false,
        needsToken: true,
        message:
          'GitHub Token not found. Add GITHUB_TOKEN to your Vercel Project Settings (Environment Variables) or enter your token in Admin Settings.',
      });
    }

    try {
      const now = new Date().toISOString();

      // 1. Process project image uploads (data:image/ -> commit to public/uploads/ on GitHub)
      if (token && Array.isArray(payload.projectsData)) {
        for (let i = 0; i < payload.projectsData.length; i++) {
          const proj = payload.projectsData[i];
          if (proj.imageUrl && typeof proj.imageUrl === 'string' && proj.imageUrl.startsWith('data:image/')) {
            const match = proj.imageUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
            const ext = match ? match[1].replace('jpeg', 'jpg') : 'png';
            const base64Data = proj.imageUrl.replace(/^data:image\/[^;]+;base64,/, '');
            const cleanId = (proj.id || `proj-${i}`).replace(/[^a-zA-Z0-9-_]/g, '');
            const filename = `project-${cleanId}-${Date.now()}.${ext}`;
            const uploadPath = `public/uploads/${filename}`;

            await commitFileToGitHub(
              repo,
              branch,
              uploadPath,
              base64Data,
              `Upload project asset: ${proj.title || cleanId}`,
              token
            );

            // Replace data URL with clean path
            payload.projectsData[i] = {
              ...proj,
              imageUrl: `/uploads/${filename}`,
            };
          }
        }
      }

      // 2. Process custom portrait upload if present
      if (
        token &&
        payload.personalInfo?.portraitUrl &&
        typeof payload.personalInfo.portraitUrl === 'string' &&
        payload.personalInfo.portraitUrl.startsWith('data:image/')
      ) {
        const match = payload.personalInfo.portraitUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
        const ext = match ? match[1].replace('jpeg', 'jpg') : 'png';
        const base64Data = payload.personalInfo.portraitUrl.replace(/^data:image\/[^;]+;base64,/, '');
        const filename = `portrait-${Date.now()}.${ext}`;
        const uploadPath = `public/uploads/${filename}`;

        await commitFileToGitHub(
          repo,
          branch,
          uploadPath,
          base64Data,
          'Upload custom portrait image',
          token
        );

        payload.personalInfo.portraitUrl = `/uploads/${filename}`;
      }

      // 3. Prepare JSON content
      const cleanPayload = {
        personalInfo: payload.personalInfo,
        skillsData: payload.skillsData || [],
        projectCategories: payload.projectCategories || [],
        projectsData: payload.projectsData || [],
        experienceData: payload.experienceData || [],
        educationData: payload.educationData || [],
        achievementsData: payload.achievementsData || [],
        interestsData: payload.interestsData || [],
        cvMetadata: payload.cvMetadata || null,
        updatedAt: now,
      };

      const jsonStr = JSON.stringify(cleanPayload, null, 2);
      const jsonBase64 = Buffer.from(jsonStr, 'utf-8').toString('base64');

      // 4. Save to GitHub repository
      if (token) {
        // 4a. Commit src/portfolio-data.json (dynamic data file)
        const putJsonRes = await commitFileToGitHub(
          repo,
          branch,
          'src/portfolio-data.json',
          jsonBase64,
          'Update portfolio dynamic data via Admin Panel [auto-sync]',
          token
        );

        if (!putJsonRes.ok) {
          const errData: any = await putJsonRes.json().catch(() => ({}));
          return res.status(putJsonRes.status).json({
            success: false,
            message: errData.message || `Failed to commit to GitHub repository (${putJsonRes.status}).`,
          });
        }

        // 4b. Also update src/data.ts for static build resilience
        try {
          const dataTsCode = generateDataTsCode(cleanPayload);
          const dataTsBase64 = Buffer.from(dataTsCode, 'utf-8').toString('base64');
          await commitFileToGitHub(
            repo,
            branch,
            'src/data.ts',
            dataTsBase64,
            'Update src/data.ts via Admin Panel [auto-deploy]',
            token
          );
        } catch (dataTsErr) {
          console.warn('Note: src/data.ts commit error (non-fatal):', dataTsErr);
        }

        // 4c. Commit CV if present
        if (payload.cvBase64) {
          try {
            const rawCvBase64 = payload.cvBase64.includes('base64,')
              ? payload.cvBase64.split('base64,')[1]
              : payload.cvBase64;

            for (const pdfPath of ['public/Numan_Asghar_CV.pdf', 'public/cv.pdf']) {
              await commitFileToGitHub(
                repo,
                branch,
                pdfPath,
                rawCvBase64,
                'Update portfolio CV via Admin Panel',
                token
              );
            }
          } catch (cvErr) {
            console.warn('Note: CV commit error (non-fatal):', cvErr);
          }
        }
      }

      // 5. Save to Vercel KV / Upstash Redis if configured
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
          await fetch(`${process.env.KV_REST_API_URL}/set/portfolio_data`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleanPayload),
          });
        } catch (kvErr) {
          console.warn('KV write error (non-fatal):', kvErr);
        }
      }

      return res.status(200).json({
        success: true,
        message: '✓ Changes published live! Your Vercel deploy is updated dynamically.',
        data: cleanPayload,
        updatedAt: now,
      });
    } catch (error: any) {
      console.error('Error in /api/portfolio handler:', error);
      return res.status(500).json({
        success: false,
        message: error?.message || 'Server error while saving portfolio data.',
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}

