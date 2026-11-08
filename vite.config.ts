import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function portfolioCodebaseSyncPlugin(): Plugin {
  return {
    name: 'portfolio-codebase-sync',
    configureServer(server) {
      const handleApiRequest = async (req: any, res: any) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-github-token, x-admin-key');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        // GET: Return current dynamic portfolio JSON
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

          const jsonPath = path.resolve(__dirname, 'src/portfolio-data.json');
          const backupPath = path.resolve(__dirname, 'src/data.backup.json');

          if (fs.existsSync(jsonPath)) {
            const data = fs.readFileSync(jsonPath, 'utf-8');
            res.statusCode = 200;
            res.end(data);
            return;
          } else if (fs.existsSync(backupPath)) {
            const data = fs.readFileSync(backupPath, 'utf-8');
            res.statusCode = 200;
            res.end(data);
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Data not found' }));
          return;
        }

        // POST: Save updated data
        if (req.method === 'POST') {
          if (req.url && req.url.includes('test=true')) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: '✓ Connected to local dev server API!' }));
            return;
          }

          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });

          req.on('end', () => {
            try {
              const payload = JSON.parse(body);

              // 1. Process CV upload if provided
              if (payload.cvBase64 && typeof payload.cvBase64 === 'string') {
                const base64Data = payload.cvBase64.replace(/^data:[^;]+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const publicDir = path.resolve(__dirname, 'public');
                fs.writeFileSync(path.join(publicDir, 'Numan_Asghar_CV.pdf'), buffer);
                fs.writeFileSync(path.join(publicDir, 'cv.pdf'), buffer);
              }

              // 2. Process data:image/ uploads in projects
              const uploadsDir = path.resolve(__dirname, 'public/uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              if (Array.isArray(payload.projectsData)) {
                payload.projectsData = payload.projectsData.map((project: any) => {
                  if (
                    project.imageUrl &&
                    typeof project.imageUrl === 'string' &&
                    project.imageUrl.startsWith('data:image/')
                  ) {
                    const match = project.imageUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
                    const ext = match ? match[1].replace('jpeg', 'jpg') : 'png';
                    const base64Data = project.imageUrl.replace(/^data:image\/[^;]+;base64,/, '');
                    const imgBuffer = Buffer.from(base64Data, 'base64');
                    const filename = `project-${project.id.replace(/[^a-zA-Z0-9-_]/g, '')}-${Date.now()}.${ext}`;
                    fs.writeFileSync(path.join(uploadsDir, filename), imgBuffer);
                    return {
                      ...project,
                      imageUrl: `/uploads/${filename}`,
                    };
                  }
                  return project;
                });
              }

              // 3. Process custom portrait upload if provided
              if (
                payload.personalInfo?.portraitUrl &&
                typeof payload.personalInfo.portraitUrl === 'string' &&
                payload.personalInfo.portraitUrl.startsWith('data:image/')
              ) {
                const match = payload.personalInfo.portraitUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
                const ext = match ? match[1].replace('jpeg', 'jpg') : 'png';
                const base64Data = payload.personalInfo.portraitUrl.replace(/^data:image\/[^;]+;base64,/, '');
                const imgBuffer = Buffer.from(base64Data, 'base64');
                const filename = `portrait-${Date.now()}.${ext}`;
                fs.writeFileSync(path.join(uploadsDir, filename), imgBuffer);
                payload.personalInfo.portraitUrl = `/uploads/${filename}`;
              }

              // 4. Generate TypeScript code for src/data.ts
              const imageMap: Record<string, string> = {
                'fast-academic-hub': 'fastHubImg',
                'student-marks-prediction': 'studentMarksImg',
                'customer-churn-prediction': 'churnPredImg',
                'ai-internship-hunter': 'aiHunterImg',
                'na-invoice-generator': 'invoiceGenImg',
                'memory-matching-game': 'memoryGameImg',
                'industrial-website': 'industrialWebImg',
              };

              let personalInfoStr = JSON.stringify(payload.personalInfo, null, 2);
              personalInfoStr = personalInfoStr.replace(
                /"portraitUrl":\s*"[^"]*(?:im\.(?:png|jpg)|portraitImg)[^"]*"/,
                '"portraitUrl": portraitImg'
              );

              let projectsStr = JSON.stringify(payload.projectsData, null, 2);
              for (const [key, varName] of Object.entries(imageMap)) {
                const regex = new RegExp(`"imageUrl":\\s*"[^"]*${key}[^"]*"`, 'g');
                projectsStr = projectsStr.replace(regex, `"imageUrl": ${varName}`);
              }

              const tsCode = `import { Project, ProjectCategory, SkillCategory, Experience, Education, Achievement } from './types';
import portraitImg from './assets/images/im.png';
import fastHubImg from './assets/images/fast-academic-hub.png';
import studentMarksImg from './assets/images/student-marks-prediction.png';
import churnPredImg from './assets/images/customer-churn-prediction.jpg';
import aiHunterImg from './assets/images/ai-internship-hunter.jpg';
import invoiceGenImg from './assets/images/na-invoice-generator.png';
import memoryGameImg from './assets/images/memory-matching-game.png';
import industrialWebImg from './assets/images/industrial-website.png';

export const CODEBASE_DATA_VERSION = '${Date.now()}';

export const personalInfo = ${personalInfoStr};

export const skillsData: SkillCategory[] = ${JSON.stringify(payload.skillsData, null, 2)};

export const defaultProjectCategories: ProjectCategory[] = ${JSON.stringify(payload.projectCategories, null, 2)};

export const projectsData: Project[] = ${projectsStr};

export const experienceData: Experience[] = ${JSON.stringify(payload.experienceData, null, 2)};

export const educationData: Education[] = ${JSON.stringify(payload.educationData, null, 2)};

export const achievementsData: Achievement[] = ${JSON.stringify(payload.achievementsData, null, 2)};

export const interestsData = ${JSON.stringify(payload.interestsData, null, 2)};
`;

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
                updatedAt: new Date().toISOString(),
              };

              const dataTsPath = path.resolve(__dirname, 'src/data.ts');
              const jsonPath = path.resolve(__dirname, 'src/portfolio-data.json');
              const backupPath = path.resolve(__dirname, 'src/data.backup.json');

              // Save json and ts files
              fs.writeFileSync(jsonPath, JSON.stringify(cleanPayload, null, 2), 'utf-8');
              fs.writeFileSync(backupPath, JSON.stringify(cleanPayload, null, 2), 'utf-8');
              fs.writeFileSync(dataTsPath, tsCode, 'utf-8');

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  message: '✓ Codebase updated! Changes saved into src/portfolio-data.json and src/data.ts',
                  updatedAt: cleanPayload.updatedAt,
                })
              );
            } catch (err: any) {
              console.error('Error saving codebase:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Failed to save to codebase' }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      };

      server.middlewares.use('/api/portfolio', handleApiRequest);
      server.middlewares.use('/api/save-codebase', handleApiRequest);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), portfolioCodebaseSyncPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
