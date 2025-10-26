export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  highlights?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Resume {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export interface OptimizedResume extends Resume {
  changes: ResumeChange[];
  matchScore: number;
  matchedKeywords: string[];
}

export interface ResumeChange {
  section: string;
  type: 'added' | 'modified' | 'reordered';
  description: string;
}

export interface CoverLetter {
  greeting: string;
  opening: string;
  body: string[];
  closing: string;
  signature: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  stage: 'idle' | 'uploading' | 'analyzing' | 'optimizing' | 'generating' | 'complete';
  progress: number;
}

export type FieldStatus = 'empty' | 'partial' | 'complete' | 'warning';

export interface FieldValidation {
  status: FieldStatus;
  message?: string;
}

export interface ResumeValidation {
  contact: {
    name: FieldValidation;
    email: FieldValidation;
    phone: FieldValidation;
    location: FieldValidation;
  };
  summary: FieldValidation;
  experience: FieldValidation[];
  education: FieldValidation[];
  skills: FieldValidation;
  overallScore: number; // 0-100
}
