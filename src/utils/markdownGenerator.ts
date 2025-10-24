import { Resume, CoverLetter } from '@/types';

/**
 * Converts a Resume JSON object to Markdown format
 */
export function generateMarkdownFromResume(resume: Resume): string {
  let markdown = '';

  // Name (H1)
  markdown += `# ${resume.contact.name}\n\n`;

  // Contact Info
  const contactParts: string[] = [];
  if (resume.contact.email) contactParts.push(resume.contact.email);
  if (resume.contact.phone) contactParts.push(resume.contact.phone);
  if (resume.contact.location) contactParts.push(resume.contact.location);
  if (contactParts.length > 0) {
    markdown += `${contactParts.join(' | ')}\n`;
  }
  if (resume.contact.linkedin) markdown += `LinkedIn: ${resume.contact.linkedin}\n`;
  if (resume.contact.website) markdown += `Website: ${resume.contact.website}\n`;
  markdown += '\n';

  // Summary
  if (resume.summary) {
    markdown += '## Professional Summary\n\n';
    markdown += `${resume.summary}\n\n`;
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    markdown += '## Professional Experience\n\n';

    resume.experience.forEach((exp) => {
      markdown += `### ${exp.position} - ${exp.company}\n\n`;
      markdown += `${exp.location} | ${exp.startDate} - ${exp.endDate}\n\n`;

      if (exp.description && exp.description.length > 0) {
        exp.description.forEach((desc) => {
          markdown += `- ${desc}\n`;
        });
        markdown += '\n';
      }

      if (exp.highlights && exp.highlights.length > 0) {
        markdown += '**Key Highlights:**\n';
        exp.highlights.forEach((highlight) => {
          markdown += `- ${highlight}\n`;
        });
        markdown += '\n';
      }
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    markdown += '## Education\n\n';

    resume.education.forEach((edu) => {
      markdown += `### ${edu.degree} in ${edu.field}\n\n`;
      markdown += `${edu.institution}\n\n`;
      markdown += `${edu.location} | ${edu.startDate} - ${edu.endDate}`;
      if (edu.gpa) markdown += ` | GPA: ${edu.gpa}`;
      markdown += '\n\n';

      if (edu.achievements && edu.achievements.length > 0) {
        edu.achievements.forEach((achievement) => {
          markdown += `- ${achievement}\n`;
        });
        markdown += '\n';
      }
    });
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    markdown += '## Skills\n\n';

    resume.skills.forEach((skillGroup) => {
      markdown += `### ${skillGroup.category}\n\n`;
      markdown += `${skillGroup.items.join(', ')}\n\n`;
    });
  }

  return markdown.trim();
}

/**
 * Converts a CoverLetter JSON object to Markdown format
 */
export function generateMarkdownFromCoverLetter(coverLetter: CoverLetter): string {
  let markdown = '';

  markdown += '# Cover Letter\n\n';
  markdown += `${coverLetter.greeting}\n\n`;
  markdown += `${coverLetter.opening}\n\n`;

  coverLetter.body.forEach((paragraph) => {
    markdown += `${paragraph}\n\n`;
  });

  markdown += `${coverLetter.closing}\n\n`;
  markdown += `${coverLetter.signature}\n`;

  return markdown.trim();
}
