import { Resume, CoverLetter } from '@/types';
import { generateMarkdownFromResume, generateMarkdownFromCoverLetter } from './markdownGenerator';

export const downloadResume = (resume: Resume, filename: string = 'resume.txt') => {
  const content = formatResumeAsText(resume);
  downloadTextFile(content, filename);
};

export const downloadResumeAsMarkdown = (resume: Resume, filename: string = 'resume.md') => {
  const content = generateMarkdownFromResume(resume);
  downloadTextFile(content, filename);
};

export const downloadCoverLetter = (coverLetter: CoverLetter, filename: string = 'cover-letter.txt') => {
  const content = formatCoverLetterAsText(coverLetter);
  downloadTextFile(content, filename);
};

export const downloadCoverLetterAsMarkdown = (coverLetter: CoverLetter, filename: string = 'cover-letter.md') => {
  const content = generateMarkdownFromCoverLetter(coverLetter);
  downloadTextFile(content, filename);
};

const formatResumeAsText = (resume: Resume): string => {
  let text = '';

  // Contact Information
  text += `${resume.contact.name}\n`;
  text += `${resume.contact.email} | ${resume.contact.phone} | ${resume.contact.location}\n`;
  if (resume.contact.linkedin) text += `LinkedIn: ${resume.contact.linkedin}\n`;
  if (resume.contact.website) text += `Website: ${resume.contact.website}\n`;
  text += '\n';

  // Summary
  text += 'PROFESSIONAL SUMMARY\n';
  text += '='.repeat(50) + '\n';
  text += `${resume.summary}\n\n`;

  // Experience
  text += 'PROFESSIONAL EXPERIENCE\n';
  text += '='.repeat(50) + '\n';
  resume.experience.forEach(exp => {
    text += `${exp.position} | ${exp.company}\n`;
    text += `${exp.location} | ${exp.startDate} - ${exp.endDate}\n`;
    exp.description.forEach(desc => {
      text += `• ${desc}\n`;
    });
    text += '\n';
  });

  // Education
  text += 'EDUCATION\n';
  text += '='.repeat(50) + '\n';
  resume.education.forEach(edu => {
    text += `${edu.degree} in ${edu.field}\n`;
    text += `${edu.institution}, ${edu.location}\n`;
    text += `${edu.startDate} - ${edu.endDate}`;
    if (edu.gpa) text += ` | GPA: ${edu.gpa}`;
    text += '\n';
    if (edu.achievements && edu.achievements.length > 0) {
      edu.achievements.forEach(achievement => {
        text += `• ${achievement}\n`;
      });
    }
    text += '\n';
  });

  // Skills
  text += 'SKILLS\n';
  text += '='.repeat(50) + '\n';
  resume.skills.forEach(skillGroup => {
    text += `${skillGroup.category}: ${skillGroup.items.join(', ')}\n`;
  });

  return text;
};

const formatCoverLetterAsText = (coverLetter: CoverLetter): string => {
  let text = '';

  text += `${coverLetter.greeting}\n\n`;
  text += `${coverLetter.opening}\n\n`;

  coverLetter.body.forEach(paragraph => {
    text += `${paragraph}\n\n`;
  });

  text += `${coverLetter.closing}\n\n`;
  text += `${coverLetter.signature}\n`;

  return text;
};

const downloadTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
