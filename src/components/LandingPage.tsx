'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import FileUpload from './FileUpload';
import JobDescriptionInput from './JobDescriptionInput';

interface LandingPageProps {
  onGenerate: (file: File | null, jobDescription: string) => void;
}

export default function LandingPage({ onGenerate }: LandingPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');

  const canGenerate = selectedFile !== null && jobDescription.length > 50;

  const handleGenerateClick = () => {
    onGenerate(selectedFile, jobDescription);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">AI-Powered Optimization</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Optimize Your Resume
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4">
            Transform your resume into a job-winning masterpiece with AI-powered optimization
            and personalized cover letters.
          </p>

          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Our intelligent system analyzes job descriptions and tailors your resume to highlight
            the most relevant skills and experiences.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <FileUpload
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />

              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerateClick}
              disabled={!canGenerate}
              className={`
                w-full py-4 px-8 rounded-2xl font-semibold text-lg
                flex items-center justify-center gap-3
                transition-all duration-300
                ${canGenerate
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }
              `}
              whileHover={canGenerate ? { scale: 1.02 } : {}}
              whileTap={canGenerate ? { scale: 0.98 } : {}}
            >
              <Sparkles className="w-5 h-5" />
              Generate Optimized Resume
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {!canGenerate && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-slate-500 mt-4"
              >
                {!selectedFile ? 'Please upload a resume' : 'Please enter a job description (at least 50 characters)'}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-5xl mx-auto mt-16 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Keyword Optimization',
              description: 'Match your resume to job requirements with AI-powered keyword analysis'
            },
            {
              title: 'Personalized Cover Letters',
              description: 'Generate compelling cover letters tailored to each position'
            },
            {
              title: 'Instant Results',
              description: 'Get your optimized documents in seconds with real-time generation'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
