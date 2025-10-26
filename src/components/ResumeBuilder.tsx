'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { Resume } from '@/types';
import ContactInfoStep from './ResumeBuilderSteps/ContactInfoStep';
import SummaryStep from './ResumeBuilderSteps/SummaryStep';
import ExperienceStep from './ResumeBuilderSteps/ExperienceStep';
import EducationStep from './ResumeBuilderSteps/EducationStep';
import SkillsStep from './ResumeBuilderSteps/SkillsStep';

interface ResumeBuilderProps {
  initialData?: Resume | null;
  onComplete: (resume: Resume) => void;
  onCancel: () => void;
}

export default function ResumeBuilder({
  initialData,
  onComplete,
  onCancel
}: ResumeBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Resume>(() => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resumeBuilderDraft');
      if (saved && !initialData) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved draft:', e);
        }
      }
    }

    // Use initialData if provided (from upload), otherwise defaults
    return initialData || {
      contact: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: []
    };
  });

  const [isFromUpload, setIsFromUpload] = useState(!!initialData);

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !isFromUpload) {
      localStorage.setItem('resumeBuilderDraft', JSON.stringify(formData));
    }
  }, [formData, isFromUpload]);

  const totalSteps = 5;
  const steps = [
    { number: 1, title: 'Contact Info', component: ContactInfoStep },
    { number: 2, title: 'Summary', component: SummaryStep },
    { number: 3, title: 'Experience', component: ExperienceStep },
    { number: 4, title: 'Education', component: EducationStep },
    { number: 5, title: 'Skills', component: SkillsStep }
  ];

  const updateFormData = (field: keyof Resume, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: // Contact Info
        return !!(formData.contact.name && formData.contact.email && formData.contact.phone);
      case 2: // Summary
        return formData.summary && formData.summary.length >= 50;
      case 3: // Experience
        return formData.experience.length > 0;
      case 4: // Education
        return formData.education.length > 0;
      case 5: // Skills
        return formData.skills.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (canProceed()) {
      // Clear localStorage draft
      if (typeof window !== 'undefined') {
        localStorage.removeItem('resumeBuilderDraft');
      }
      onComplete(formData);
    }
  };

  const handleSkipToReview = () => {
    onComplete(formData);
  };

  const handleCancel = () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel? Your progress will be saved for later.'
    );
    if (confirmed) {
      onCancel();
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

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
                {isFromUpload ? 'Review Parsed Resume' : 'Build Your Resume'}
              </h1>
              <p className="text-slate-400">
                Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
              </p>
            </div>

            <motion.button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-4 h-4" />
              Cancel
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1">
                <div className="relative">
                  <div className={`
                    h-2 rounded-full transition-all duration-300
                    ${currentStep > step.number ? 'bg-green-500' :
                      currentStep === step.number ? 'bg-violet-500' : 'bg-slate-700'}
                  `} />
                  <div className="absolute -top-6 left-0 right-0 text-center">
                    <span className={`text-xs font-medium ${
                      currentStep >= step.number ? 'text-violet-300' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          className="glass-strong rounded-3xl p-8 mb-6"
          style={{ minHeight: '500px' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                data={formData}
                onUpdate={updateFormData}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              transition-all duration-300
              ${currentStep === 1
                ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-600'
              }
            `}
            whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
            whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </motion.button>

          {isFromUpload && (
            <motion.button
              onClick={handleSkipToReview}
              className="px-6 py-3 rounded-xl font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Skip to Review
            </motion.button>
          )}

          {currentStep < totalSteps ? (
            <motion.button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300
                ${canProceed()
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }
              `}
              whileHover={canProceed() ? { scale: 1.02 } : {}}
              whileTap={canProceed() ? { scale: 0.98 } : {}}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleComplete}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300
                ${canProceed()
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }
              `}
              whileHover={canProceed() ? { scale: 1.02 } : {}}
              whileTap={canProceed() ? { scale: 0.98 } : {}}
            >
              <Check className="w-4 h-4" />
              Complete & Review
            </motion.button>
          )}
        </div>

        {!canProceed() && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-orange-400 mt-4"
          >
            {currentStep === 1 && 'Please fill in name, email, and phone to continue'}
            {currentStep === 2 && 'Please write a summary (minimum 50 characters)'}
            {currentStep === 3 && 'Please add at least one work experience'}
            {currentStep === 4 && 'Please add at least one education entry'}
            {currentStep === 5 && 'Please add at least one skill category'}
          </motion.p>
        )}
      </div>
    </div>
  );
}
