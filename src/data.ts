import { Project, SkillCategory, Experience, Education, Achievement } from './types';
import portraitImg from './assets/images/numan_portrait_1783150950872.png';

export const personalInfo = {
  name: "Muhammad Numan Asghar",
  title: "Computer Science Student | FAST-NUCES",
  location: "FAST-NUCES, Lahore, Pakistan",
  phone: "(+92) 326-1192066",
  email: "asgharnuman901@gmail.com",
  portraitUrl: portraitImg,
  linkedin: "https://www.linkedin.com/in/numan-a-79587628a",
  github: "https://github.com/NumanAsghar901",
  summary:
    "Final-year Computer Science student specializing in the MERN Stack, Data Science, Machine Learning, and AI Agent Development. Experienced in building ML pipelines (preprocessing, feature engineering, model evaluation) and AI-driven automation workflows using Python, n8n, and APIs. Proficient in full-stack web development with a focus on responsive and scalable applications. Passionate about combining intelligent systems with modern web technologies to solve real-world problems.",
};

export const skillsData: SkillCategory[] = [
  {
    title: "Programming",
    iconName: "Code2",
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript / TypeScript", level: 90 },
      { name: "C++", level: 85 },
      { name: "SQL", level: 88 },
    ],
  },
  {
    title: "Data Science & ML",
    iconName: "BrainCircuit",
    skills: [
      { name: "Pandas & NumPy", level: 92 },
      { name: "Scikit-learn", level: 88 },
      { name: "Data Preprocessing", level: 90 },
      { name: "Regression & Classification", level: 87 },
      { name: "Model Evaluation", level: 85 },
      { name: "Seaborn & Matplotlib", level: 84 },
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
      { name: "Data Structures & Algorithms", level: 92 },
      { name: "Object Oriented Programming", level: 90 },
      { name: "Database Systems", level: 88 },
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
    bullets: [
      "Designed an intuitive interface for TAs to manage assignments, record marks, and provide structured feedback.",
      "Actively used by FAST-NUCES TAs and students — optimized marking workflows and academic communications.",
    ],
    category: "web",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://fast-academic-hub-nu.vercel.app/",
  },
  {
    id: "student-marks-prediction",
    title: "Student Marks Prediction System",
    subtitle: "Data Science & Machine Learning",
    description:
      "Regression pipeline predicting student exam marks across three question types with an interactive Streamlit app.",
    bullets: [
      "Compared DummyMean, Linear Regression, and Polynomial Ridge models using Scikit-learn.",
      "Linear Regression achieved the best Test R² of 0.54 with detailed preprocessing and feature selection.",
      "Deployed an interactive Streamlit web app for real-time predictions.",
    ],
    category: "ml",
    tech: ["Python", "Scikit-learn", "Streamlit", "Pandas", "NumPy"],
    liveUrl: "https://student-marks-predictor.streamlit.app",
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "customer-churn-prediction",
    title: "Customer Churn Prediction",
    subtitle: "Machine Learning Pipeline",
    description:
      "Multi-model classification pipeline to predict customer churn in enterprise systems.",
    bullets: [
      "Compared Logistic Regression, Decision Tree, Random Forest, and XGBoost.",
      "Logistic Regression achieved 80.5% accuracy with an F1-score of 0.61.",
      "Evaluated models across accuracy, precision, recall, and F1-score for imbalanced data.",
    ],
    category: "ml",
    tech: ["Python", "Scikit-learn", "XGBoost", "Pandas", "Seaborn"],
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "ai-internship-hunter",
    title: "AI Automated Internship Hunting System",
    subtitle: "n8n + AI Orchestration",
    description:
      "AI-powered automation workflow using n8n to collect, filter, and match internship opportunities.",
    bullets: [
      "Leveraged APIs, web scraping, and LLM filtering to automatically source relevant positions.",
      "End-to-end pipeline with webhooks, HTTP requests, and automated notifications.",
    ],
    category: "ai",
    tech: ["n8n", "LLM Integration", "Webhooks", "APIs", "Automation"],
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "na-invoice-generator",
    title: "NA Invoice Generator",
    subtitle: "HTML, CSS, JavaScript Web App",
    description:
      "Web-based tool for creating and downloading professional invoices with dynamic calculations and PDF export.",
    bullets: [
      "Implemented dynamic calculations, responsive UI, and instant PDF export.",
      "Deployed on Vercel with dark mode support.",
    ],
    category: "web",
    tech: ["HTML5", "CSS3", "JavaScript", "jspdf", "Tailwind CSS"],
    liveUrl: "https://na-invoice-generator.vercel.app",
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "memory-matching-game",
    title: "Memory Matching Game",
    subtitle: "Interactive Client-Side Web App",
    description:
      "Browser-based matching card game with dynamic DOM updates, state handling, and match validation.",
    bullets: [
      "Move counter and timer to track player performance.",
      "Fluid CSS grid with responsive design and engaging animations.",
    ],
    category: "web",
    tech: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "https://numan-memory-game.vercel.app",
    githubUrl: "https://github.com/NumanAsghar901",
  },
  {
    id: "industrial-website",
    title: "Industrial Corporate Website",
    subtitle: "Responsive Multi-Page Web App",
    description:
      "Responsive multi-page corporate portal highlighting company services and capabilities.",
    bullets: [
      "Integrated multimedia assets with clean, fast navigation.",
      "Deployed on Vercel with layouts tailored for mobile, tablet, and desktop.",
    ],
    category: "web",
    tech: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
    liveUrl: "https://industrial-web.vercel.app",
    githubUrl: "https://github.com/NumanAsghar901",
  },
];

export const experienceData: Experience[] = [
  {
    role: "Teaching Assistant — Multivariable Calculus & Applied Calculus",
    company: "FAST-NUCES",
    period: "September 2024 – June 2026",
    bullets: [
      "Graded 90+ assignments weekly for a class of 90+ students with 98% on-time turnaround.",
      "Conducted weekly helper sessions for students.",
      "Built FAST Academic Hub — a deployed web portal now used by FAST-NUCES TAs and students for streamlined marking and grading.",
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
