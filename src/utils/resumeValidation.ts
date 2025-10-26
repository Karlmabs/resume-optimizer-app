import { Resume, FieldValidation, FieldStatus, ResumeValidation } from '@/types';

/**
 * Validates a text field and returns its status
 */
export function validateTextField(text: string | undefined, minLength: number = 3): FieldValidation {
  if (!text || text.trim().length === 0) {
    return { status: 'empty', message: 'This field is empty' };
  }

  if (text.trim().length < minLength) {
    return { status: 'partial', message: `Too short (minimum ${minLength} characters)` };
  }

  return { status: 'complete' };
}

/**
 * Validates an email address
 */
export function validateEmail(email: string | undefined): FieldValidation {
  if (!email || email.trim().length === 0) {
    return { status: 'empty', message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: 'warning', message: 'Email format may be invalid' };
  }

  return { status: 'complete' };
}

/**
 * Validates a phone number
 */
export function validatePhone(phone: string | undefined): FieldValidation {
  if (!phone || phone.trim().length === 0) {
    return { status: 'empty', message: 'Phone is required' };
  }

  // Basic phone validation - at least 10 digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return { status: 'warning', message: 'Phone number seems too short' };
  }

  return { status: 'complete' };
}

/**
 * Validates an array field (like description bullets)
 */
export function validateArrayField(array: any[] | undefined, minItems: number = 1): FieldValidation {
  if (!array || array.length === 0) {
    return { status: 'empty', message: 'No items found' };
  }

  if (array.length < minItems) {
    return { status: 'partial', message: `Only ${array.length} item(s) found` };
  }

  return { status: 'complete' };
}

/**
 * Validates an experience entry
 */
export function validateExperience(exp: any): FieldValidation {
  const issues: string[] = [];

  if (!exp.company || exp.company.trim().length === 0) issues.push('Company name missing');
  if (!exp.position || exp.position.trim().length === 0) issues.push('Position missing');
  if (!exp.description || exp.description.length === 0) issues.push('No description bullets');
  if (!exp.startDate || exp.startDate.trim().length === 0) issues.push('Start date missing');
  if (!exp.endDate || exp.endDate.trim().length === 0) issues.push('End date missing');

  if (issues.length === 0) {
    return { status: 'complete' };
  } else if (issues.length >= 3) {
    return { status: 'empty', message: issues.join(', ') };
  } else {
    return { status: 'warning', message: issues.join(', ') };
  }
}

/**
 * Validates an education entry
 */
export function validateEducation(edu: any): FieldValidation {
  const issues: string[] = [];

  if (!edu.institution || edu.institution.trim().length === 0) issues.push('Institution missing');
  if (!edu.degree || edu.degree.trim().length === 0) issues.push('Degree missing');
  if (!edu.field || edu.field.trim().length === 0) issues.push('Field of study missing');

  if (issues.length === 0) {
    return { status: 'complete' };
  } else if (issues.length >= 2) {
    return { status: 'empty', message: issues.join(', ') };
  } else {
    return { status: 'warning', message: issues.join(', ') };
  }
}

/**
 * Validates the entire resume and returns a comprehensive validation report
 */
export function validateResume(resume: Resume): ResumeValidation {
  const validation: ResumeValidation = {
    contact: {
      name: validateTextField(resume.contact?.name, 2),
      email: validateEmail(resume.contact?.email),
      phone: validatePhone(resume.contact?.phone),
      location: validateTextField(resume.contact?.location, 2),
    },
    summary: validateTextField(resume.summary, 50),
    experience: resume.experience?.map(exp => validateExperience(exp)) || [],
    education: resume.education?.map(edu => validateEducation(edu)) || [],
    skills: validateArrayField(resume.skills, 1),
    overallScore: 0,
  };

  // Calculate overall score (0-100)
  let totalPoints = 0;
  let maxPoints = 0;

  // Contact fields (4 fields x 10 points each = 40 points)
  const contactFields = Object.values(validation.contact);
  contactFields.forEach(field => {
    maxPoints += 10;
    if (field.status === 'complete') totalPoints += 10;
    else if (field.status === 'warning') totalPoints += 7;
    else if (field.status === 'partial') totalPoints += 5;
  });

  // Summary (20 points)
  maxPoints += 20;
  if (validation.summary.status === 'complete') totalPoints += 20;
  else if (validation.summary.status === 'warning') totalPoints += 14;
  else if (validation.summary.status === 'partial') totalPoints += 10;

  // Experience (20 points)
  maxPoints += 20;
  if (validation.experience.length > 0) {
    const completeExp = validation.experience.filter(e => e.status === 'complete').length;
    totalPoints += Math.min(20, (completeExp / validation.experience.length) * 20);
  }

  // Education (10 points)
  maxPoints += 10;
  if (validation.education.length > 0) {
    const completeEdu = validation.education.filter(e => e.status === 'complete').length;
    totalPoints += Math.min(10, (completeEdu / validation.education.length) * 10);
  }

  // Skills (10 points)
  maxPoints += 10;
  if (validation.skills.status === 'complete') totalPoints += 10;
  else if (validation.skills.status === 'warning') totalPoints += 7;
  else if (validation.skills.status === 'partial') totalPoints += 5;

  validation.overallScore = Math.round((totalPoints / maxPoints) * 100);

  return validation;
}

/**
 * Returns a color class based on field status
 */
export function getStatusColor(status: FieldStatus): string {
  switch (status) {
    case 'complete':
      return 'text-green-400 border-green-500/30 bg-green-500/10';
    case 'warning':
      return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    case 'partial':
      return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    case 'empty':
      return 'text-red-400 border-red-500/30 bg-red-500/10';
    default:
      return 'text-slate-400 border-slate-600/30 bg-slate-500/10';
  }
}

/**
 * Returns an icon for the field status
 */
export function getStatusIcon(status: FieldStatus): string {
  switch (status) {
    case 'complete':
      return '✓';
    case 'warning':
      return '⚠';
    case 'partial':
      return '◐';
    case 'empty':
      return '✗';
    default:
      return '○';
  }
}
