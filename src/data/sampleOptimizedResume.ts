import { OptimizedResume } from '@/types';

export const sampleOptimizedResume: OptimizedResume = {
  contact: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    website: "alexjohnson.dev"
  },
  summary: "Senior Software Engineer with 5+ years of experience architecting and developing scalable, high-performance web applications using React, TypeScript, and modern JavaScript. Proven track record in performance optimization, implementing responsive design principles, and mentoring junior developers. Expertise in building accessible user interfaces and leveraging state management solutions to deliver exceptional user experiences in agile environments.",
  experience: [
    {
      id: "exp1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: [
        "Architected and developed 15+ scalable web applications using React, TypeScript, and Next.js, serving 500K+ monthly active users",
        "Led performance optimization initiatives, reducing page load times by 45% and improving Core Web Vitals scores by 60%",
        "Implemented comprehensive accessibility standards (WCAG 2.1 AA), ensuring inclusive user experiences across all products",
        "Mentored team of 4 junior developers, conducting code reviews and establishing best practices for React component architecture",
        "Engineered robust state management solutions using Redux and Context API, improving application maintainability and scalability",
        "Integrated RESTful APIs and GraphQL endpoints, optimizing data fetching patterns and reducing API calls by 30%",
        "Established CI/CD pipelines using GitHub Actions, automating testing and deployment processes",
        "Collaborated with cross-functional teams in agile sprints to deliver features aligned with business objectives"
      ],
      highlights: [
        "Led migration from JavaScript to TypeScript",
        "Reduced bundle size by 40%",
        "Implemented comprehensive testing with Jest (85% coverage)"
      ]
    },
    {
      id: "exp2",
      company: "StartUp Inc",
      position: "Frontend Developer",
      location: "San Francisco, CA",
      startDate: "Jun 2019",
      endDate: "Dec 2020",
      description: [
        "Developed responsive, mobile-first React components following atomic design principles",
        "Implemented comprehensive unit and integration tests using Jest and React Testing Library, achieving 80% code coverage",
        "Built and optimized RESTful API integrations, improving data synchronization reliability",
        "Collaborated with UX designers to implement pixel-perfect, accessible user interfaces",
        "Participated in agile ceremonies and contributed to sprint planning and retrospectives"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "California",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.5",
      achievements: [
        "Dean's List (6 semesters)",
        "Computer Science Department Award for Outstanding Achievement"
      ]
    }
  ],
  skills: [
    {
      category: "Frontend Technologies",
      items: ["React", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS"]
    },
    {
      category: "State Management & APIs",
      items: ["Redux", "Context API", "GraphQL", "REST API", "React Query"]
    },
    {
      category: "Testing & Quality",
      items: ["Jest", "React Testing Library", "Cypress", "Accessibility Testing"]
    },
    {
      category: "Tools & DevOps",
      items: ["Git", "GitHub Actions", "Docker", "Webpack", "Vite", "CI/CD"]
    },
    {
      category: "Backend & Databases",
      items: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"]
    },
    {
      category: "Other",
      items: ["Agile/Scrum", "Responsive Design", "Performance Optimization", "Team Leadership"]
    }
  ],
  changes: [
    {
      section: "Summary",
      type: "modified",
      description: "Enhanced with keywords: Senior, TypeScript, scalable, performance optimization, mentoring, accessibility, state management, agile"
    },
    {
      section: "Experience - Tech Corp",
      type: "modified",
      description: "Updated position to 'Senior Software Engineer' and added quantifiable achievements, performance metrics, and relevant keywords"
    },
    {
      section: "Experience - Tech Corp",
      type: "added",
      description: "Added specific accomplishments: accessibility standards, mentoring, CI/CD pipelines, cross-functional collaboration"
    },
    {
      section: "Experience - StartUp Inc",
      type: "modified",
      description: "Enhanced descriptions with testing frameworks, responsive design, and agile methodology keywords"
    },
    {
      section: "Skills",
      type: "modified",
      description: "Reorganized skills into relevant categories and added Next.js, GraphQL, Jest, and CI/CD tools"
    },
    {
      section: "Education",
      type: "added",
      description: "Added academic achievements to strengthen credentials"
    }
  ],
  matchScore: 92,
  matchedKeywords: [
    "React",
    "TypeScript",
    "JavaScript",
    "Frontend",
    "Responsive Design",
    "Accessibility",
    "State Management",
    "Redux",
    "GraphQL",
    "REST API",
    "Performance Optimization",
    "Testing",
    "Jest",
    "CI/CD",
    "Mentoring",
    "Agile",
    "Next.js",
    "Scalability"
  ]
};
