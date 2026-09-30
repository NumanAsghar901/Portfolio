import { Project, ProjectCategory, SkillCategory, Experience, Education, Achievement } from './types';
import portraitImg from './assets/images/im.png';
import fastHubImg from './assets/images/fast-academic-hub.png';
import studentMarksImg from './assets/images/student-marks-prediction.png';
import churnPredImg from './assets/images/customer-churn-prediction.jpg';
import aiHunterImg from './assets/images/ai-internship-hunter.jpg';
import invoiceGenImg from './assets/images/na-invoice-generator.png';
import memoryGameImg from './assets/images/memory-matching-game.png';
import industrialWebImg from './assets/images/industrial-website.png';

export const personalInfo = {
  "name": "Muhammad Numan Asghar",
  "title": "Computer Science Student | FAST-NUCES",
  "location": "FAST-NUCES, Faisalabad, Pakistan",
  "phone": "(+92) 326-1192066",
  "email": "numanasghar901@gmail.com",
  "portraitUrl": portraitImg,
  "linkedin": "https://www.linkedin.com/in/numan-a-79587628a",
  "github": "https://github.com/NumanAsghar901",
  "summary": "Final-year Computer Science student specializing in the MERN Stack, Data Science, Machine Learning, and AI Agent Development. Experienced in building ML pipelines and AI-driven automation workflows using Python, n8n, and APIs. Proficient in full-stack web development with a focus on responsive and scalable applications. Passionate about combining intelligent systems with modern web technologies to solve real-world problems.",
  "brandName": "Numan",
  "aboutTitle": "Engineering With Passion While Exploring AI & Web.",
  "aboutSubtitle": "I'm Numan Asghar, a Full Stack Developer & AI Specialist based in Faisalabad. I have a passion for creating scalable web applications and intelligent automation workflows.",
  "origin": "Faisalabad, PK",
  "availability": "Open to Work",
  "yearsExp": "02+",
  "projectsCount": "10+",
  "awardsCount": "03+",
  "heroGreeting": "Hello, I'm Numan Asghar 👋",
  "heroHeadline": "I DESIGN & BUILD DIGITAL EXPERIENCES",
  "heroHeadlinePrefix": "I DESIGN & BUILD",
  "heroHeadlineHighlight": "DIGITAL EXPERIENCES"
};

export const skillsData: SkillCategory[] = [
  {
    "title": "Data Science & ML",
    "iconName": "BrainCircuit",
    "skills": [
      {
        "name": "Pandas & NumPy",
        "level": 98
      },
      {
        "name": "Scikit-learn",
        "level": 88
      },
      {
        "name": "Data Preprocessing",
        "level": 90
      },
      {
        "name": "Regression & Classification",
        "level": 87
      },
      {
        "name": "Model Evaluation",
        "level": 92
      },
      {
        "name": "Seaborn & Matplotlib",
        "level": 85
      }
    ]
  },
  {
    "title": "LLMs & AI Automation",
    "iconName": "Bot",
    "skills": [
      {
        "name": "n8n Workflows",
        "level": 95
      },
      {
        "name": "REST APIs & Webhooks",
        "level": 92
      },
      {
        "name": "LLM Workflows & Integration",
        "level": 90
      },
      {
        "name": "Prompt Engineering",
        "level": 93
      },
      {
        "name": "Tokens & Context Windows",
        "level": 88
      }
    ]
  },
  {
    "title": "Tools & Technologies",
    "iconName": "Wrench",
    "skills": [
      {
        "name": "VS Code, AntiGravity, Cursor, Claude Code",
        "level": 100
      },
      {
        "name": "Git & GitHub",
        "level": 96
      },
      {
        "name": "Streamlit, Vercel, Render, Netlify",
        "level": 100
      },
      {
        "name": "Docker",
        "level": 80
      },
      {
        "name": "Jupyter Notebook, Hostinger",
        "level": 98
      }
    ]
  },
  {
    "title": "Full-Stack Development",
    "iconName": "Code2",
    "skills": [
      {
        "name": "HTML5, CSS3, JavaScript, Tailwind CSS",
        "level": 96
      },
      {
        "name": "React.js, Next.js",
        "level": 98
      },
      {
        "name": "Node.js, Express.js",
        "level": 96
      },
      {
        "name": "FAST APIs, REST APIs, Webhooks",
        "level": 94
      },
      {
        "name": "MongoDB, PostgreSQL, MySQL, Redis, Firebase",
        "level": 98
      }
    ]
  }
];

export const defaultProjectCategories: ProjectCategory[] = [
  {
    "id": "web",
    "name": "Web Development",
    "iconName": "Code",
    "description": "Full-stack web applications & MERN development"
  },
  {
    "id": "ml",
    "name": "ML & Data Science",
    "iconName": "BrainCircuit",
    "description": "Machine learning models, analytics & data science"
  },
  {
    "id": "ai",
    "name": "AI & Automation",
    "iconName": "Cpu",
    "description": "AI agents, LLM integrations & workflow automation"
  },
  {
    "id": "freelance-projects",
    "name": "Freelance Projects",
    "iconName": "Code",
    "description": ""
  }
];

export const projectsData: Project[] = [
  {
    "id": "proj-1790786534343",
    "title": "Lvlup Futures",
    "subtitle": "Futures Trading Brand Platform",
    "description": "A professional trading-focused website created for a futures trading brand, presenting its services, platform information, programs, and market-focused content through a modern responsive interface.",
    "category": "web",
    "categories": [
      "web",
      "freelance-projects"
    ],
    "tech": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS"
    ],
    "imageUrl": "/uploads/project-proj-1790786534343-1790788189732.jpg",
    "liveUrl": "https://lvlupfutures.com/",
    "githubUrl": ""
  },
  {
    "id": "proj-1790786303431",
    "title": "Cosmevo Cosmeceuticals",
    "subtitle": "Beauty & Skincare Ecommerce Website",
    "description": "A responsive cosmetics ecommerce website featuring product discovery, category browsing, animated page sections, cart management, and a polished shopping experience.",
    "category": "web",
    "categories": [
      "web",
      "freelance-projects"
    ],
    "tech": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Nodemailer"
    ],
    "imageUrl": "/uploads/project-proj-1790786303431-1790788189733.jpg",
    "liveUrl": "https://www.cosmevo.pk/",
    "githubUrl": ""
  },
  {
    "id": "proj-1790786102344",
    "title": "Feel of Luxe ",
    "subtitle": "Luxury Jewellery Ecommerce Website",
    "description": "A premium jewellery ecommerce platform designed to showcase luxury jewellery collections with product browsing, detailed product pages, responsive layouts, cart functionality, and a refined visual experience.",
    "category": "web",
    "categories": [
      "web",
      "freelance-projects"
    ],
    "tech": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion"
    ],
    "imageUrl": "/uploads/project-proj-1790786102344-1790788189733.jpg",
    "liveUrl": "https://www.feelofluxe.com/",
    "githubUrl": ""
  },
  {
    "id": "proj-1790785762993",
    "title": "Comfort Studio",
    "subtitle": "Modern Furniture Ecommerce Website",
    "description": "A modern furniture ecommerce platform for browsing sofas, exploring product variants such as fabric, color, and size, adding items to a cart, and completing online purchases.",
    "category": "web",
    "categories": [
      "web",
      "freelance-projects"
    ],
    "tech": [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js"
    ],
    "imageUrl": "/uploads/project-proj-1790785762993-1790788189733.jpg",
    "liveUrl": "https://comfortstudio.co.uk/",
    "githubUrl": ""
  },
  {
    "id": "fast-academic-hub",
    "title": "FAST Academic Hub",
    "subtitle": "TA & Student Marking Portal (MERN Stack)",
    "description": "A full-featured academic web portal for streamlining marking, grading, and feedback workflows at FAST-NUCES.",
    "category": "web",
    "tech": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS"
    ],
    "imageUrl": fastHubImg,
    "liveUrl": "https://fast-academic-hub-nu.vercel.app/",
    "categories": [
      "web"
    ]
  },
  {
    "id": "student-marks-prediction",
    "title": "Student Marks Prediction System",
    "subtitle": "Data Science & Machine Learning",
    "description": "Regression pipeline predicting student exam marks across three question types with an interactive Streamlit app.",
    "category": "ml",
    "tech": [
      "Python",
      "Scikit-learn",
      "Streamlit",
      "Pandas",
      "NumPy"
    ],
    "imageUrl": studentMarksImg,
    "liveUrl": "https://ds-marks-prediction.streamlit.app/",
    "githubUrl": "https://github.com/NumanAsghar901",
    "categories": [
      "ml"
    ]
  },
  {
    "id": "customer-churn-prediction",
    "title": "Customer Churn Prediction",
    "subtitle": "Machine Learning Pipeline",
    "description": "Multi-model classification pipeline to predict customer churn in enterprise systems with comprehensive evaluation.",
    "category": "ml",
    "tech": [
      "Python",
      "Scikit-learn",
      "XGBoost",
      "Pandas",
      "Seaborn"
    ],
    "imageUrl": churnPredImg,
    "githubUrl": "https://github.com/NumanAsghar901",
    "categories": [
      "ml"
    ]
  },
  {
    "id": "ai-internship-hunter",
    "title": "AI Automated Internship Hunting System",
    "subtitle": "n8n + AI Orchestration",
    "description": "AI-powered automation workflow using n8n to collect, filter, and match relevant internship opportunities.",
    "category": "ai",
    "tech": [
      "n8n",
      "LLM Integration",
      "Webhooks",
      "APIs",
      "Automation"
    ],
    "imageUrl": aiHunterImg,
    "githubUrl": "https://github.com/NumanAsghar901",
    "categories": [
      "ai"
    ]
  },
  {
    "id": "na-invoice-generator",
    "title": "NA Invoice Generator",
    "subtitle": "HTML, CSS, JavaScript Web App",
    "description": "Web-based tool for creating and downloading professional invoices with dynamic calculations and PDF export.",
    "category": "web",
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "jspdf",
      "Tailwind CSS"
    ],
    "imageUrl": invoiceGenImg,
    "liveUrl": "https://na-invoice-generator.vercel.app",
    "githubUrl": "https://github.com/NumanAsghar901",
    "categories": [
      "web"
    ]
  },
  {
    "id": "industrial-website",
    "title": "Industrial Corporate Website",
    "subtitle": "Responsive Multi-Page Web App",
    "description": "Responsive multi-page corporate portal highlighting company services, capabilities, and multimedia assets.",
    "category": "web",
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Tailwind CSS"
    ],
    "imageUrl": industrialWebImg,
    "liveUrl": "https://industral-website.vercel.app/",
    "githubUrl": "https://github.com/NumanAsghar901",
    "categories": [
      "web"
    ]
  }
];

export const experienceData: Experience[] = [
  {
    "role": "Technical Advisor - Security & Platform Maintenance",
    "company": "Monetro Prop Firm",
    "companyUrl": "https://monetro.com/",
    "period": "2026 – Present",
    "bullets": [
      "Directing platform health monitoring, uptime reliability, and long-term maintenance for web and mobile trading apps handling high-frequency trader operations.",
      "Enforcing rigorous code review standards, secure deployment lifecycles, and risk-management safeguards to guarantee low-latency execution and transactional integrity."
    ]
  },
  {
    "role": "Software Engineer",
    "company": "Prop Firm Studios",
    "companyUrl": "https://propfirmstudios.com",
    "period": "2026 – Present",
    "bullets": [
      "Engineering and scaling core platform features for proprietary trading firm operations, trader assessments, and account lifecycle management.",
      "Developing high-performance, responsive full-stack dashboards using React, TypeScript, Node.js, and modern RESTful/WebSocket APIs.",
      "Implementing automated trader evaluation logic, real-time risk parameter monitoring, and secure payment and verification workflows."
    ]
  },
  {
    "role": "Web & App Freelancer",
    "company": "Freelance / Self-Employed",
    "period": "2025 – Present",
    "bullets": [
      "Designed and delivered bespoke full-stack web applications, SaaS prototypes, and custom client portals for global clients.",
      "Architected autonomous AI workflows and intelligent integrations utilizing n8n, OpenAI/Anthropic APIs, webhooks, and Python scripts.",
      "Built modern, accessible, and SEO-optimized web interfaces using React, Next.js, and Tailwind CSS, maintaining a 100% on-time delivery rate."
    ]
  },
  {
    "role": "Full Stack Developer Intern",
    "company": "Nexsoft Solutions",
    "period": "Jun 2026 – Sep 2026",
    "bullets": [
      "Developed and maintained scalable web applications, integrating modular React frontends with secure backend microservices.",
      "Engineered RESTful APIs, optimized database schemas, and implemented role-based authentication and authorization.",
      "Collaborated in Agile sprints with cross-functional teams to deliver end-to-end features, database integration, and production deployments."
    ]
  },
  {
    "role": "AI / ML Intern",
    "company": "QuantumLogics",
    "period": "Jul 2026 – Aug 2026",
    "bullets": [
      "Assisted in developing end-to-end AI/ML solutions by preprocessing diverse real-world datasets and conducting exploratory data analysis.",
      "Trained, benchmarked, and evaluated machine learning models for predictive classification and regression using Scikit-learn, Pandas, and NumPy.",
      "Assisted in building API inference endpoints and data pipelines to integrate machine learning models into client-facing web services."
    ]
  },
  {
    "role": "Teaching Assistant - Multivariable Calculus & Applied Calculus",
    "company": "FAST-NUCES",
    "period": "Sep 2024 – Jun 2026",
    "bullets": [
      "Graded 100+ assignments and assessments weekly for a cohort of 90+ undergraduate students with 98% on-time turnaround.",
      "Conducted weekly helper clinics, tutorial sessions, and exam preparatory reviews for applied multivariable mathematics.",
      "Engineered FAST Academic Hub — a deployed web portal actively used by FAST-NUCES TAs and students for grading and performance tracking."
    ]
  }
];

export const educationData: Education[] = [
  {
    "degree": "Bachelor of Science in Computer Science",
    "institution": "National University of Computer and Emerging Sciences (FAST-NUCES)",
    "period": "August 2023 – Present"
  }
];

export const achievementsData: Achievement[] = [
  {
    "title": "Daira Organizing Award",
    "description": "Actively participated in organizing a prestigious 3-day inter-university event with seniors and teachers."
  },
  {
    "title": "Teaching Assistant Certificate",
    "description": "Recognized for exceptional contributions as a Teaching Assistant by Assistant Professor Dr. Arfan Shahzad."
  },
  {
    "title": "Programming Competition Finalist",
    "description": "Secured a position as a finalist in an inter-university programming competition."
  }
];

export const interestsData = [
  {
    "title": "Computer Vision & LLMs",
    "description": "Image-based AI applications and large language model workflows.",
    "iconName": "Eye"
  },
  {
    "title": "Intelligent Automation",
    "description": "Building intelligent systems and AI-driven automation pipelines.",
    "iconName": "Zap"
  },
  {
    "title": "DevOps & MLOps",
    "description": "Deployment pipelines, containerization, and production ML systems.",
    "iconName": "Server"
  }
];
