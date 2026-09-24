import { Project, SkillCategory, Experience, Education, Achievement } from './types';
import portraitImg from './assets/images/im.png';
import fastHubImg from './assets/images/fast-academic-hub.png';
import studentMarksImg from './assets/images/student-marks-prediction.png';
import churnPredImg from './assets/images/customer-churn-prediction.jpg';
import aiHunterImg from './assets/images/ai-internship-hunter.jpg';
import invoiceGenImg from './assets/images/na-invoice-generator.png';
import memoryGameImg from './assets/images/memory-matching-game.png';
import industrialWebImg from './assets/images/industrial-website.png';

export const personalInfo = {
  name: "Muhammad Numan Asghar",
  title: "Computer Science Student | FAST-NUCES",
  location: "FAST-NUCES, Faisalabad, Pakistan",
  phone: "(+92) 326-1192066",
  email: "numanasghar901@gmail.com",
  portraitUrl: portraitImg,
  linkedin: "https://www.linkedin.com/in/numan-a-79587628a",
  github: "https://github.com/NumanAsghar901",
  summary:
    "Final-year Computer Science student specializing in the MERN Stack, Data Science, Machine Learning, and AI Agent Development. Experienced in building ML pipelines and AI-driven automation workflows using Python, n8n, and APIs. Proficient in full-stack web development with a focus on responsive and scalable applications. Passionate about combining intelligent systems with modern web technologies to solve real-world problems.",
};

export const skillsData: SkillCategory[] = [
  {
    title: "Programming",
    iconName: "Code2",
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript / TypeScript", level: 90 },
      { name: "C++", level: 95 },
      { name: "SQL", level: 88 },
    ],
  },
  {
    title: "Data Science & ML",
    iconName: "BrainCircuit",
    skills: [
      { name: "Pandas & NumPy", level: 98 },
      { name: "Scikit-learn", level: 88 },
      { name: "Data Preprocessing", level: 90 },
      { name: "Regression & Classification", level: 87 },
      { name: "Model Evaluation", level: 92 },
      { name: "Seaborn & Matplotlib", level: 85 },
    ],
  },
  {
    title: "LLMs & AI Automation",
    iconName: "Bot",
    skills: [
      { name: "n8n Workflows", level: 95 },
      { name: "REST APIs & Webhooks", level: 92 },
      { name: "LLM Workflows & Integration", level: 90 },
      { name: "Prompt Engineering", level: 93 },
      { name: "Tokens & Context Windows", level: 88 },
    ],
  },
  {
    title: "Tools & Technologies",
    iconName: "Wrench",
    skills: [
      { name: "MongoDB, Express, React, Node.js", level: 90 },
      { name: "Git & GitHub", level: 92 },
      { name: "Streamlit", level: 88 },
      { name: "Docker", level: 80 },
      { name: "Jupyter Notebook", level: 90 },
    ],
  },
  {
    title: "Relevant Coursework",
    iconName: "GraduationCap",
    skills: [
      { name: "Data Structures & Algorithms", level: 95 },
      { name: "Object Oriented Programming", level: 95 },
      { name: "Database Systems", level: 90 },
      { name: "Operating Systems", level: 85 },
      { name: "Machine Learning", level: 88 },
    ],
  },
];

export const projectsData: Project[] = [
  {
    id: "fast-academic-hub",
    title: "FAST Academic Hub",
    subtitle: "TA & Student Marking Portal (MERN Stack)",
    description:
      "A full-featured academic web portal for streamlining marking, grading, and feedback workflows at FAST-NUCES.",
    category: "web",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    imageUrl: fastHubImg,
    liveUrl: "https://fast-academic-hub-nu.vercel.app/",
  },
  {
    id: "student-marks-prediction",
    title: "Student Marks Prediction System",
    subtitle: "Data Science & Machine Learning",
    description:
      "Regression pipeline predicting student exam marks across three question types with an interactive Streamlit app.",
    category: "ml",
    tech: ["Python", "Scikit-learn", "Streamlit", "Pandas", "NumPy"],
    imageUrl: studentMarksImg,
    liveUrl: "https://ds-marks-prediction.streamlit.app/",
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "customer-churn-prediction",
    title: "Customer Churn Prediction",
    subtitle: "Machine Learning Pipeline",
    description:
      "Multi-model classification pipeline to predict customer churn in enterprise systems with comprehensive evaluation.",
    category: "ml",
    tech: ["Python", "Scikit-learn", "XGBoost", "Pandas", "Seaborn"],
    imageUrl: churnPredImg,
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "ai-internship-hunter",
    title: "AI Automated Internship Hunting System",
    subtitle: "n8n + AI Orchestration",
    description:
      "AI-powered automation workflow using n8n to collect, filter, and match relevant internship opportunities.",
    category: "ai",
    tech: ["n8n", "LLM Integration", "Webhooks", "APIs", "Automation"],
    imageUrl: aiHunterImg,
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "na-invoice-generator",
    title: "NA Invoice Generator",
    subtitle: "HTML, CSS, JavaScript Web App",
    description:
      "Web-based tool for creating and downloading professional invoices with dynamic calculations and PDF export.",
    category: "web",
    tech: ["HTML5", "CSS3", "JavaScript", "jspdf", "Tailwind CSS"],
    imageUrl: invoiceGenImg,
    liveUrl: "https://na-invoice-generator.vercel.app",
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "memory-matching-game",
    title: "Memory Matching Game",
    subtitle: "Interactive Client-Side Web App",
    description:
      "Browser-based matching card game with dynamic DOM updates, state handling, move counter, and timer.",
    category: "web",
    tech: ["HTML5", "CSS3", "JavaScript"],
    imageUrl: memoryGameImg,
    liveUrl: "https://memory-matching-game-beta.vercel.app/",
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "industrial-website",
    title: "Industrial Corporate Website",
    subtitle: "Responsive Multi-Page Web App",
    description:
      "Responsive multi-page corporate portal highlighting company services, capabilities, and multimedia assets.",
    category: "web",
    tech: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
    imageUrl: industrialWebImg,
    liveUrl: "https://industral-website.vercel.app/",
    githubUrl: "https://github.com/NumanAsghar901",
  },
];

export const experienceData: Experience[] = [
  {
    role: "Software Engineer",
    company: "Prop Firm Studios",
    companyUrl: "https://propfirmstudios.com",
    period: "2024 – Present",
    bullets: [
      "Engineered and scaled core platform features for proprietary trading firm operations, trader assessments, and account lifecycle management.",
      "Developed high-performance, responsive full-stack dashboards using React, TypeScript, Node.js, and modern RESTful/WebSocket APIs.",
      "Implemented automated trader evaluation logic, real-time risk parameter monitoring, and secure payment and verification workflows.",
      "Optimized database architectures and caching layers to guarantee ultra-low latency execution and seamless user experiences.",
    ],
  },
  {
    role: "Full Stack & AI Automation Freelancer",
    company: "Freelance / Self-Employed",
    period: "2023 – Present",
    bullets: [
      "Designed and delivered bespoke full-stack web applications, SaaS prototypes, and custom client portals for global clients.",
      "Architected autonomous AI workflows and intelligent integrations utilizing n8n, OpenAI/Anthropic APIs, webhooks, and Python scripts.",
      "Built modern, accessible, and SEO-optimized web interfaces using React, Next.js, and Tailwind CSS, maintaining a 100% on-time delivery rate.",
    ],
  },
  {
    role: "Full Stack Engineer",
    company: "Nexsoft Solutions",
    period: "Jun 2026 – Sep 2026",
    bullets: [
      "Promoted to Full Stack Engineer following high-impact contributions as a Full Stack Developer Intern.",
      "Developed and maintained scalable web applications, integrating modular React frontends with secure backend microservices.",
      "Engineered RESTful APIs, optimized database schemas, and implemented role-based authentication and authorization.",
      "Collaborated in Agile sprints with cross-functional teams to deliver end-to-end features, database integration, and production deployments.",
    ],
  },
  {
    role: "AI / ML Intern",
    company: "QuantumLogics",
    period: "Jul 2026 – Aug 2026",
    bullets: [
      "Assisted in developing end-to-end AI/ML solutions by preprocessing diverse real-world datasets and conducting exploratory data analysis.",
      "Trained, benchmarked, and evaluated machine learning models for predictive classification and regression using Scikit-learn, Pandas, and NumPy.",
      "Assisted in building API inference endpoints and data pipelines to integrate machine learning models into client-facing web services.",
    ],
  },
  {
    role: "Teaching Assistant — Multivariable Calculus & Applied Calculus",
    company: "FAST-NUCES",
    period: "Sep 2024 – Jun 2026",
    bullets: [
      "Graded 90+ assignments and assessments weekly for a cohort of 90+ undergraduate students with 98% on-time turnaround.",
      "Conducted weekly helper clinics, tutorial sessions, and exam preparatory reviews for applied multivariable mathematics.",
      "Engineered FAST Academic Hub — a deployed web portal actively used by FAST-NUCES TAs and students for grading and performance tracking.",
    ],
  },
];

export const educationData: Education[] = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "National University of Computer and Emerging Sciences (FAST-NUCES)",
    period: "August 2023 – Present",
  },
];

export const achievementsData: Achievement[] = [
  {
    title: "Daira Organizing Award",
    description:
      "Actively participated in organizing a prestigious 3-day inter-university event with seniors and teachers.",
  },
  {
    title: "Teaching Assistant Certificate",
    description:
      "Recognized for exceptional contributions as a Teaching Assistant by Assistant Professor Dr. Arfan Shahzad.",
  },
  {
    title: "Programming Competition Finalist",
    description:
      "Secured a position as a finalist in an inter-university programming competition.",
  },
];

export const interestsData = [
  {
    title: "Computer Vision & LLMs",
    description: "Image-based AI applications and large language model workflows.",
    iconName: "Eye",
  },
  {
    title: "Intelligent Automation",
    description: "Building intelligent systems and AI-driven automation pipelines.",
    iconName: "Zap",
  },
  {
    title: "DevOps & MLOps",
    description: "Deployment pipelines, containerization, and production ML systems.",
    iconName: "Server",
  },
];
