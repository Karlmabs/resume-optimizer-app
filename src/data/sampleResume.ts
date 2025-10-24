import { Resume } from '@/types';

export const sampleResume: Resume = {
  contact: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    website: "alexjohnson.dev"
  },
  summary: "Software engineer with 5 years of experience building web applications. Proficient in JavaScript and React. Looking for new opportunities to grow my skills.",
  experience: [
    {
      id: "exp1",
      company: "Tech Corp",
      position: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: [
        "Developed web applications using React and Node.js",
        "Worked with a team to build features",
        "Fixed bugs and improved performance",
        "Participated in code reviews"
      ]
    },
    {
      id: "exp2",
      company: "StartUp Inc",
      position: "Junior Developer",
      location: "San Francisco, CA",
      startDate: "Jun 2019",
      endDate: "Dec 2020",
      description: [
        "Built frontend components with React",
        "Worked on API integration",
        "Helped maintain the codebase"
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
      gpa: "3.5"
    }
  ],
  skills: [
    {
      category: "Languages",
      items: ["JavaScript", "TypeScript", "Python", "HTML", "CSS"]
    },
    {
      category: "Frameworks",
      items: ["React", "Node.js", "Express"]
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "AWS"]
    }
  ]
};
