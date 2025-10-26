import { Resume, CoverLetter } from '@/types';

/**
 * Converts a Resume JSON object to Markdown format matching professional resume style
 */
export function generateMarkdownFromResume(resume: Resume): string {
  let markdown = '';

  // Name (Bold, no hashtag)
  markdown += `**${resume.contact.name.toUpperCase()}**\n\n`;

  // Extract title/role from summary's first sentence if possible, or use a default
  const summaryFirstLine = resume.summary?.split('.')[0] || 'Professional';
  const role = extractRole(summaryFirstLine);
  if (role) {
    markdown += `${role}\n\n`;
  }

  // Contact Info (Single line with separators)
  const contactParts: string[] = [];
  if (resume.contact.linkedin) contactParts.push(`[LinkedIn](${resume.contact.linkedin})`);
  if (resume.contact.phone) contactParts.push(resume.contact.phone);
  if (resume.contact.email) contactParts.push(resume.contact.email);
  if (resume.contact.github) contactParts.push(`[GitHub](${resume.contact.github})`);
  if (resume.contact.website) contactParts.push(`[Portfolio](${resume.contact.website})`);

  if (contactParts.length > 0) {
    markdown += `${contactParts.join('  |  ')}\n\n`;
  }

  // Professional Summary
  if (resume.summary) {
    markdown += '# **PROFESSIONAL SUMMARY**\n\n';
    markdown += `${resume.summary}\n\n`;
  }

  // Technical Skills
  if (resume.skills && resume.skills.length > 0) {
    markdown += '# **TECHNICAL SKILLS**\n\n';

    resume.skills.forEach((skillGroup) => {
      markdown += `* **${skillGroup.category}:** ${skillGroup.items.join(', ')}  \n`;
    });
    markdown += '\n';
  }

  // Professional Experience
  if (resume.experience && resume.experience.length > 0) {
    markdown += '# **PROFESSIONAL EXPERIENCE**\n\n';

    resume.experience.forEach((exp, index) => {
      markdown += `**${exp.position}** | ${exp.company}\n\n`;
      markdown += `${exp.location} • ${exp.startDate} – ${exp.endDate}\n\n`;

      if (exp.description && exp.description.length > 0) {
        exp.description.forEach((desc) => {
          markdown += `* ${desc}  \n`;
        });
      }

      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach((highlight) => {
          markdown += `* ${highlight}  \n`;
        });
      }

      // Add spacing between experience entries (except after the last one)
      if (index < resume.experience.length - 1) {
        markdown += '\n';
      }
    });
    markdown += '\n';
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    markdown += '# **EDUCATION**\n\n';

    resume.education.forEach((edu) => {
      markdown += `**${edu.degree}`;
      if (edu.field) markdown += ` – ${edu.field}`;
      markdown += '**\n\n';

      markdown += `*${edu.institution}`;
      if (edu.location) markdown += `, ${edu.location}`;
      markdown += `* • ${edu.startDate} – ${edu.endDate}`;
      if (edu.gpa) markdown += ` | GPA: ${edu.gpa}`;
      markdown += '\n\n';

      if (edu.achievements && edu.achievements.length > 0) {
        markdown += '**Relevant Coursework:** ';
        markdown += edu.achievements.join(', ');
        markdown += '\n\n';
      }
    });
  }

  return markdown.trim();
}

/**
 * Attempts to extract a role/title from the summary text
 */
function extractRole(summaryText: string): string | null {
  // Look for common role patterns
  const rolePatterns = [
    /(?:^|\b)(Full[- ]Stack Developer|Frontend Developer|Backend Developer|Software Engineer|Web Developer|DevOps Engineer|Data Scientist|Product Manager)/i,
    /(?:^|\b)(\w+(?:\s+\w+){0,3}\s+(?:Developer|Engineer|Architect|Designer|Manager|Analyst))/i,
  ];

  for (const pattern of rolePatterns) {
    const match = summaryText.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
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
