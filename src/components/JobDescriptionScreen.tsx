'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, ArrowLeft, User, Sparkles } from 'lucide-react';
import { Resume } from '@/types';

interface JobDescriptionScreenProps {
  verifiedResume: Resume;
  onContinue: (jobDescription: string) => void;
  onBack: () => void;
}

export default function JobDescriptionScreen({
  verifiedResume,
  onContinue,
  onBack
}: JobDescriptionScreenProps) {
  const [jobDescription, setJobDescription] = useState('');

  const canContinue = jobDescription.trim().length >= 50;

  const handleContinue = () => {
    if (canContinue) {
      onContinue(jobDescription);
    }
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
                Target Your Job
              </h1>
              <p className="text-slate-400">
                Step 3 of 4: Enter the job description to optimize your resume
              </p>
            </div>

            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Review
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong rounded-2xl p-6 sticky top-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-slate-200">Your Resume</h3>
              </div>

              <div className="space-y-4">
                {/* Contact Info */}
                <div>
                  <p className="text-sm text-slate-400 mb-1">Name</p>
                  <p className="text-slate-200 font-medium">{verifiedResume.contact.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Email</p>
                  <p className="text-slate-300 text-sm">{verifiedResume.contact.email}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Phone</p>
                  <p className="text-slate-300 text-sm">{verifiedResume.contact.phone}</p>
                </div>

                {verifiedResume.contact.location && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Location</p>
                    <p className="text-slate-300 text-sm">{verifiedResume.contact.location}</p>
                  </div>
                )}

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-sm text-slate-400 mb-2">Experience</p>
                  <p className="text-2xl font-bold text-violet-400">
                    {verifiedResume.experience.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    {verifiedResume.experience.length === 1 ? 'position' : 'positions'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">Education</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {verifiedResume.education.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    {verifiedResume.education.length === 1 ? 'degree' : 'degrees'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">Skills</p>
                  <p className="text-2xl font-bold text-pink-400">
                    {verifiedResume.skills.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    {verifiedResume.skills.length === 1 ? 'category' : 'categories'}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-xs text-green-300 flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Resume verified and ready
                </p>
              </div>
            </motion.div>
          </div>

          {/* Job Description Input */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong rounded-2xl p-8"
            >
              <div className="mb-6">
                <label className="block text-lg font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                  Job Description
                </label>
                <p className="text-sm text-slate-400">
                  Paste the complete job description including requirements, responsibilities, and qualifications
                </p>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here...

Example:
We are seeking a Senior Full-Stack Developer with 5+ years of experience in React, Node.js, and TypeScript. The ideal candidate will have strong experience with microservices architecture, cloud platforms (AWS/Azure), and CI/CD pipelines..."
                className="
                  w-full h-96 px-6 py-4 rounded-2xl
                  bg-slate-800/30 border-2 border-slate-600
                  text-slate-200 placeholder-slate-500
                  focus:outline-none focus:border-violet-500/50
                  focus:bg-slate-800/50
                  transition-all duration-300
                  resize-none
                  font-sans text-sm leading-relaxed
                "
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(139, 92, 246, 0.5) rgba(255, 255, 255, 0.05)'
                }}
              />

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm">
                  {jobDescription.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`
                        ${jobDescription.length >= 50 ? 'text-green-400' : 'text-yellow-400'}
                      `}
                    >
                      {jobDescription.length} characters
                      {jobDescription.length < 50 && ` (${50 - jobDescription.length} more needed)`}
                    </motion.span>
                  )}
                  {jobDescription.length === 0 && (
                    <span className="text-slate-500">
                      Minimum 50 characters required
                    </span>
                  )}
                </div>

                <motion.button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className={`
                    flex items-center gap-2 px-8 py-3 rounded-xl font-semibold
                    transition-all duration-300
                    ${canContinue
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }
                  `}
                  whileHover={canContinue ? { scale: 1.02 } : {}}
                  whileTap={canContinue ? { scale: 0.98 } : {}}
                >
                  <Sparkles className="w-4 h-4" />
                  Optimize Resume
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <p className="text-xs text-blue-300 mb-2 font-semibold">💡 Tips for best results:</p>
                <ul className="text-xs text-blue-200/80 space-y-1 ml-4 list-disc">
                  <li>Include the complete job description with all requirements</li>
                  <li>Include technical skills, qualifications, and responsibilities</li>
                  <li>The more detailed the description, the better the optimization</li>
                  <li>Our AI will match keywords and tailor your resume accordingly</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
