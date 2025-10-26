'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, FileText, Edit3, ChevronRight, X, Plus, Trash2 } from 'lucide-react';
import { Resume, Experience, Education, Skill } from '@/types';
import { validateResume, getStatusColor, getStatusIcon } from '@/utils/resumeValidation';

interface ResumeReviewProps {
  parsedResume: Resume;
  extractedText: string;
  parsingWarnings: string[];
  onContinue: (editedResume: Resume) => void;
  onCancel: () => void;
}

export default function ResumeReview({
  parsedResume,
  extractedText,
  parsingWarnings,
  onContinue,
  onCancel
}: ResumeReviewProps) {
  const [editedResume, setEditedResume] = useState<Resume>(parsedResume);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    summary: true,
    experience: true,
    education: true,
    skills: true
  });

  const validation = validateResume(editedResume);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Update contact info
  const updateContact = (field: keyof Resume['contact'], value: string) => {
    setEditedResume(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  // Update summary
  const updateSummary = (value: string) => {
    setEditedResume(prev => ({ ...prev, summary: value }));
  };

  // Update experience
  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setEditedResume(prev => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prev, experience: newExperience };
    });
  };

  const addExperience = () => {
    setEditedResume(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          description: [],
          highlights: []
        }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    setEditedResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Update education
  const updateEducation = (index: number, field: keyof Education, value: any) => {
    setEditedResume(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setEditedResume(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
          achievements: []
        }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setEditedResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Update skills
  const updateSkillCategory = (index: number, field: 'category' | 'items', value: string | string[]) => {
    setEditedResume(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      return { ...prev, skills: newSkills };
    });
  };

  const addSkillCategory = () => {
    setEditedResume(prev => ({
      ...prev,
      skills: [...prev.skills, { category: '', items: [] }]
    }));
  };

  const removeSkillCategory = (index: number) => {
    setEditedResume(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Verify Parsed Data
              </h1>
              <p className="text-slate-400">
                Step 2 of 4: Review and correct any information before targeting your job
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setShowExtractedText(!showExtractedText)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-300 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-4 h-4" />
                {showExtractedText ? 'Hide' : 'Show'} Raw Text
              </motion.button>

              <motion.button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>
            </div>
          </div>

          {/* Information Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-300 mb-1">
                  📋 Parsing Complete - Verification Required
                </h3>
                <p className="text-xs text-blue-200/80">
                  AI parsing may miss or misinterpret details from complex resume layouts. Please review all fields carefully and compare with the raw extracted text (click "Show Raw Text") to ensure nothing was lost or changed. You'll be able to target a specific job in the next step.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Completeness Score */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Data Completeness</h3>
                <p className="text-sm text-slate-400">Score based on filled fields</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${
                  validation.overallScore >= 80 ? 'text-green-400' :
                  validation.overallScore >= 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {validation.overallScore}%
                </div>
                <div className="text-xs text-slate-500">
                  {validation.overallScore >= 80 ? 'Excellent' :
                   validation.overallScore >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  validation.overallScore >= 80 ? 'bg-green-500' :
                  validation.overallScore >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${validation.overallScore}%` }}
              />
            </div>
          </motion.div>

          {/* Parsing Warnings */}
          {parsingWarnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-orange-300 mb-2">
                    Parsing Warnings
                  </h3>
                  <ul className="text-sm text-orange-200/80 space-y-1">
                    {parsingWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Edit Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Contact Information */}
            <SectionCard
              title="Contact Information"
              icon={<Edit3 className="w-5 h-5" />}
              isExpanded={expandedSections.contact}
              onToggle={() => toggleSection('contact')}
              validation={validation.contact}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  value={editedResume.contact?.name || ''}
                  onChange={(v) => updateContact('name', v)}
                  validation={validation.contact.name}
                />
                <InputField
                  label="Email"
                  value={editedResume.contact?.email || ''}
                  onChange={(v) => updateContact('email', v)}
                  validation={validation.contact.email}
                />
                <InputField
                  label="Phone"
                  value={editedResume.contact?.phone || ''}
                  onChange={(v) => updateContact('phone', v)}
                  validation={validation.contact.phone}
                />
                <InputField
                  label="Location"
                  value={editedResume.contact?.location || ''}
                  onChange={(v) => updateContact('location', v)}
                  validation={validation.contact.location}
                />
                <InputField
                  label="LinkedIn (optional)"
                  value={editedResume.contact?.linkedin || ''}
                  onChange={(v) => updateContact('linkedin', v)}
                />
                <InputField
                  label="Website (optional)"
                  value={editedResume.contact?.website || ''}
                  onChange={(v) => updateContact('website', v)}
                />
              </div>
            </SectionCard>

            {/* Summary */}
            <SectionCard
              title="Professional Summary"
              icon={<FileText className="w-5 h-5" />}
              isExpanded={expandedSections.summary}
              onToggle={() => toggleSection('summary')}
              validation={validation.summary}
            >
              <TextAreaField
                value={editedResume.summary || ''}
                onChange={updateSummary}
                validation={validation.summary}
                rows={4}
                placeholder="A brief professional summary..."
              />
            </SectionCard>

            {/* Experience */}
            <SectionCard
              title="Experience"
              icon={<Edit3 className="w-5 h-5" />}
              isExpanded={expandedSections.experience}
              onToggle={() => toggleSection('experience')}
              validation={validation.experience.length > 0 ? validation.experience[0] : { status: 'empty' }}
              actionButton={
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Experience
                </button>
              }
            >
              <div className="space-y-6">
                {editedResume.experience?.map((exp, index) => (
                  <div key={exp.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 relative">
                    <button
                      onClick={() => removeExperience(index)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Remove this experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <InputField
                        label="Company"
                        value={exp.company}
                        onChange={(v) => updateExperience(index, 'company', v)}
                        size="sm"
                      />
                      <InputField
                        label="Position"
                        value={exp.position}
                        onChange={(v) => updateExperience(index, 'position', v)}
                        size="sm"
                      />
                      <InputField
                        label="Location"
                        value={exp.location}
                        onChange={(v) => updateExperience(index, 'location', v)}
                        size="sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <InputField
                          label="Start Date"
                          value={exp.startDate}
                          onChange={(v) => updateExperience(index, 'startDate', v)}
                          size="sm"
                        />
                        <InputField
                          label="End Date"
                          value={exp.endDate}
                          onChange={(v) => updateExperience(index, 'endDate', v)}
                          size="sm"
                        />
                      </div>
                    </div>
                    <TextAreaField
                      label="Description (one bullet per line)"
                      value={exp.description?.join('\n') || ''}
                      onChange={(v) => updateExperience(index, 'description', v.split('\n').filter(l => l.trim()))}
                      rows={4}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Education */}
            <SectionCard
              title="Education"
              icon={<Edit3 className="w-5 h-5" />}
              isExpanded={expandedSections.education}
              onToggle={() => toggleSection('education')}
              validation={validation.education.length > 0 ? validation.education[0] : { status: 'empty' }}
              actionButton={
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Education
                </button>
              }
            >
              <div className="space-y-6">
                {editedResume.education?.map((edu, index) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 relative">
                    <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Remove this education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Institution"
                        value={edu.institution}
                        onChange={(v) => updateEducation(index, 'institution', v)}
                        size="sm"
                      />
                      <InputField
                        label="Degree"
                        value={edu.degree}
                        onChange={(v) => updateEducation(index, 'degree', v)}
                        size="sm"
                      />
                      <InputField
                        label="Field of Study"
                        value={edu.field}
                        onChange={(v) => updateEducation(index, 'field', v)}
                        size="sm"
                      />
                      <InputField
                        label="Location"
                        value={edu.location}
                        onChange={(v) => updateEducation(index, 'location', v)}
                        size="sm"
                      />
                      <InputField
                        label="Start Date"
                        value={edu.startDate}
                        onChange={(v) => updateEducation(index, 'startDate', v)}
                        size="sm"
                      />
                      <InputField
                        label="End Date"
                        value={edu.endDate}
                        onChange={(v) => updateEducation(index, 'endDate', v)}
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Skills */}
            <SectionCard
              title="Skills"
              icon={<Edit3 className="w-5 h-5" />}
              isExpanded={expandedSections.skills}
              onToggle={() => toggleSection('skills')}
              validation={validation.skills}
              actionButton={
                <button
                  onClick={addSkillCategory}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Category
                </button>
              }
            >
              <div className="space-y-4">
                {editedResume.skills?.map((skill, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 relative">
                    <button
                      onClick={() => removeSkillCategory(index)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Remove this category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <InputField
                      label="Category"
                      value={skill.category}
                      onChange={(v) => updateSkillCategory(index, 'category', v)}
                      size="sm"
                      className="mb-3"
                    />
                    <TextAreaField
                      label="Skills (comma-separated)"
                      value={skill.items?.join(', ') || ''}
                      onChange={(v) => updateSkillCategory(index, 'items', v.split(',').map(s => s.trim()).filter(s => s))}
                      rows={2}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Continue Button */}
              <motion.button
                onClick={() => onContinue(editedResume)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold transition-all shadow-lg shadow-violet-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={validation.overallScore < 50}
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              {validation.overallScore < 50 && (
                <p className="text-xs text-red-400 text-center">
                  Please fill in more required fields to continue
                </p>
              )}

              {/* Extracted Text Preview */}
              {showExtractedText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-strong rounded-2xl p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-200 mb-3">Raw Extracted Text</h3>
                  <div className="max-h-96 overflow-y-auto">
                    <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">
                      {extractedText || 'No text extracted'}
                    </pre>
                  </div>
                </motion.div>
              )}

              {/* Help Card */}
              <div className="glass-strong rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-slate-200 mb-2">Tips</h3>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Review all sections for accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">⚠</span>
                    <span>Fix any fields marked with warnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400">→</span>
                    <span>Add missing information from the raw text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">+</span>
                    <span>Use the raw text viewer to find missing details</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  validation?: any;
  actionButton?: React.ReactNode;
}

function SectionCard({ title, icon, isExpanded, onToggle, children, validation, actionButton }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl overflow-hidden"
    >
      <div className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1"
        >
          <div className="text-violet-400">{icon}</div>
          <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
          {validation && (
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(validation.status)}`}>
              {getStatusIcon(validation.status)} {validation.status}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3">
          {actionButton}
          <button onClick={onToggle} className="p-1">
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </motion.div>
          </button>
        </div>
      </div>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 pt-0"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

interface InputFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  validation?: any;
  size?: 'sm' | 'md';
  className?: string;
}

function InputField({ label, value, onChange, validation, size = 'md', className = '' }: InputFieldProps) {
  const sizeClasses = size === 'sm' ? 'text-sm py-2' : 'text-base py-3';

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs text-slate-400 mb-1 flex items-center gap-2">
          {label}
          {validation && validation.status !== 'complete' && (
            <span className={`text-xs ${getStatusColor(validation.status)}`}>
              {getStatusIcon(validation.status)}
            </span>
          )}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 ${sizeClasses} rounded-xl bg-slate-900/50 border ${
          validation ? `border-${validation.status === 'complete' ? 'slate-700' : validation.status === 'warning' ? 'yellow-500/30' : validation.status === 'empty' ? 'red-500/30' : 'slate-700'}` : 'border-slate-700'
        } text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors`}
      />
      {validation && validation.message && validation.status !== 'complete' && (
        <p className="text-xs text-red-400 mt-1">{validation.message}</p>
      )}
    </div>
  );
}

interface TextAreaFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  validation?: any;
  rows?: number;
  size?: 'sm' | 'md';
  placeholder?: string;
}

function TextAreaField({ label, value, onChange, validation, rows = 3, size = 'md', placeholder }: TextAreaFieldProps) {
  const sizeClasses = size === 'sm' ? 'text-sm py-2' : 'text-base py-3';

  return (
    <div>
      {label && (
        <label className="block text-xs text-slate-400 mb-1 flex items-center gap-2">
          {label}
          {validation && validation.status !== 'complete' && (
            <span className={`text-xs ${getStatusColor(validation.status)}`}>
              {getStatusIcon(validation.status)}
            </span>
          )}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 ${sizeClasses} rounded-xl bg-slate-900/50 border ${
          validation ? `border-${validation.status === 'complete' ? 'slate-700' : validation.status === 'warning' ? 'yellow-500/30' : validation.status === 'empty' ? 'red-500/30' : 'slate-700'}` : 'border-slate-700'
        } text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors resize-none`}
      />
      {validation && validation.message && validation.status !== 'complete' && (
        <p className="text-xs text-red-400 mt-1">{validation.message}</p>
      )}
    </div>
  );
}
