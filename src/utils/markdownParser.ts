import { Resume, Experience, Education, Skill } from '@/types';

/**
 * Parses a Markdown resume into JSON Resume format
 */
export function parseMarkdownToResume(markdown: string): Resume {
  const lines = markdown.split('\n').map(line => line.trim());

  const resume: Resume = {
    contact: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  };

  let currentSection = '';
  let currentExperience: Partial<Experience> | null = null;
  let currentEducation: Partial<Education> | null = null;
  let currentSkillCategory = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines
    if (!line) {
      continue;
    }

    // H1 - Name
    if (line.startsWith('# ')) {
      resume.contact.name = line.substring(2).trim();
      continue;
    }

    // Contact info line (email | phone | location)
    if (line.includes('|') && !currentSection) {
      const parts = line.split('|').map(p => p.trim());
      parts.forEach(part => {
        if (part.includes('@')) {
          resume.contact.email = part;
        } else if (part.match(/\(\d{3}\)/)) {
          resume.contact.phone = part;
        } else if (!part.startsWith('http')) {
          if (!resume.contact.location) {
            resume.contact.location = part;
          }
        }
      });

      // Check for linkedin/website
      if (line.includes('linkedin.com')) {
        const linkedinMatch = line.match(/linkedin\.com\/[\w-]+/);
        if (linkedinMatch) resume.contact.linkedin = linkedinMatch[0];
      }
      if (line.includes('http') && !line.includes('linkedin')) {
        const urlMatch = line.match(/https?:\/\/[^\s|]+/);
        if (urlMatch) resume.contact.website = urlMatch[0];
      }
      continue;
    }

    // H2 - Sections
    if (line.startsWith('## ')) {
      const sectionName = line.substring(3).trim().toLowerCase();

      // Save previous items
      if (currentExperience && currentExperience.company) {
        resume.experience.push(currentExperience as Experience);
        currentExperience = null;
      }
      if (currentEducation && currentEducation.institution) {
        resume.education.push(currentEducation as Education);
        currentEducation = null;
      }

      if (sectionName.includes('experience') || sectionName.includes('work')) {
        currentSection = 'experience';
      } else if (sectionName.includes('education')) {
        currentSection = 'education';
      } else if (sectionName.includes('skill')) {
        currentSection = 'skills';
      } else if (sectionName.includes('summary') || sectionName.includes('about')) {
        currentSection = 'summary';
      }
      continue;
    }

    // Content based on current section
    if (currentSection === 'summary') {
      if (!line.startsWith('#')) {
        resume.summary += (resume.summary ? ' ' : '') + line;
      }
    }

    else if (currentSection === 'experience') {
      // H3 or bold - Position/Company
      if (line.startsWith('### ') || line.startsWith('**')) {
        // Save previous experience
        if (currentExperience && currentExperience.company) {
          resume.experience.push(currentExperience as Experience);
        }

        // Start new experience
        currentExperience = {
          id: `exp${resume.experience.length + 1}`,
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          description: [],
        };

        // Parse position and company
        let text = line.replace(/^###\s*/, '').replace(/\*\*/g, '').trim();

        // Format: **Position** - Company or ### Position - Company
        if (text.includes(' - ')) {
          const parts = text.split(' - ');
          currentExperience.position = parts[0].trim();
          currentExperience.company = parts[1].trim();
        } else {
          currentExperience.position = text;
        }
      }
      // Company/Position on next line
      else if (currentExperience && !currentExperience.company && !line.startsWith('-') && !line.startsWith('•')) {
        currentExperience.company = line.replace(/\*\*/g, '').trim();
      }
      // Location and dates
      else if (currentExperience && line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        currentExperience.location = parts[0];
        if (parts[1]) {
          const dates = parts[1].split(' - ').map(d => d.trim());
          currentExperience.startDate = dates[0] || '';
          currentExperience.endDate = dates[1] || '';
        }
      }
      // Bullet points
      else if (currentExperience && (line.startsWith('- ') || line.startsWith('• '))) {
        const description = line.replace(/^[-•]\s*/, '').trim();
        if (!currentExperience.description) currentExperience.description = [];
        currentExperience.description.push(description);
      }
    }

    else if (currentSection === 'education') {
      // H3 or bold - Degree
      if (line.startsWith('### ') || line.startsWith('**')) {
        // Save previous education
        if (currentEducation && currentEducation.institution) {
          resume.education.push(currentEducation as Education);
        }

        // Start new education
        currentEducation = {
          id: `edu${resume.education.length + 1}`,
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
        };

        let text = line.replace(/^###\s*/, '').replace(/\*\*/g, '').trim();

        // Format: Degree in Field
        if (text.includes(' in ')) {
          const parts = text.split(' in ');
          currentEducation.degree = parts[0].trim();
          currentEducation.field = parts[1].trim();
        } else {
          currentEducation.degree = text;
        }
      }
      // Institution
      else if (currentEducation && !currentEducation.institution && !line.includes('|') && !line.startsWith('-')) {
        currentEducation.institution = line.replace(/\*\*/g, '').trim();
      }
      // Location and dates
      else if (currentEducation && line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          currentEducation.location = parts[0];
          const dates = parts[1].split(' - ').map(d => d.trim());
          currentEducation.startDate = dates[0] || '';
          currentEducation.endDate = dates[1] || '';

          // GPA if present
          if (parts[2] && parts[2].includes('GPA')) {
            currentEducation.gpa = parts[2].replace('GPA:', '').trim();
          }
        }
      }
      // Achievements
      else if (currentEducation && (line.startsWith('- ') || line.startsWith('• '))) {
        const achievement = line.replace(/^[-•]\s*/, '').trim();
        if (!currentEducation.achievements) currentEducation.achievements = [];
        currentEducation.achievements.push(achievement);
      }
    }

    else if (currentSection === 'skills') {
      // H3 or bold - Skill category
      if (line.startsWith('### ') || line.startsWith('**')) {
        currentSkillCategory = line.replace(/^###\s*/, '').replace(/\*\*/g, '').replace(':', '').trim();
      }
      // Skill items (comma-separated or bullet)
      else if (currentSkillCategory) {
        let items: string[] = [];

        if (line.includes(',')) {
          // Comma-separated
          items = line.split(',').map(s => s.trim()).filter(s => s);
        } else if (line.startsWith('- ') || line.startsWith('• ')) {
          // Bullet point
          items = [line.replace(/^[-•]\s*/, '').trim()];
        } else if (line && !line.startsWith('#')) {
          // Plain list
          items = [line];
        }

        if (items.length > 0) {
          const existingCategory = resume.skills.find(s => s.category === currentSkillCategory);
          if (existingCategory) {
            existingCategory.items.push(...items);
          } else {
            resume.skills.push({
              category: currentSkillCategory,
              items: items,
            });
          }
        }
      }
    }
  }

  // Save any remaining items
  if (currentExperience && currentExperience.company) {
    resume.experience.push(currentExperience as Experience);
  }
  if (currentEducation && currentEducation.institution) {
    resume.education.push(currentEducation as Education);
  }

  return resume;
}
