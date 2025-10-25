'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Eye, FileText, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { OptimizedResume, CoverLetter, Resume } from '@/types';
import ResumeDisplay from './ResumeDisplay';
import CoverLetterDisplay from './CoverLetterDisplay';
import KeywordMatch from './KeywordMatch';
import ChangesSummary from './ChangesSummary';
import { downloadResume, downloadCoverLetter, downloadResumeAsMarkdown, downloadCoverLetterAsMarkdown, copyToClipboard } from '@/utils/downloadUtils';

interface ResultsPageProps {
  originalResume: Resume;
  optimizedResume: OptimizedResume;
  coverLetter: CoverLetter;
  jobKeywords: string[];
  onRestart: () => void;
}

export default function ResultsPage({
  originalResume,
  optimizedResume,
  coverLetter,
  jobKeywords,
  onRestart
}: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  const [showBefore, setShowBefore] = useState(false);

  const handleDownloadResume = () => {
    downloadResume(showBefore ? originalResume : optimizedResume,
      showBefore ? 'original-resume.txt' : 'optimized-resume.txt');
    toast.success('Resume downloaded as TXT!');
  };

  const handleDownloadResumeMarkdown = () => {
    downloadResumeAsMarkdown(showBefore ? originalResume : optimizedResume,
      showBefore ? 'original-resume.md' : 'optimized-resume.md');
    toast.success('Resume downloaded as Markdown!');
  };

  const handleCopyResume = async () => {
    const resume = showBefore ? originalResume : optimizedResume;
    const text = JSON.stringify(resume, null, 2); // Simplified for demo
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Resume copied to clipboard!');
    } else {
      toast.error('Failed to copy resume');
    }
  };

  const handleDownloadCoverLetter = () => {
    downloadCoverLetter(coverLetter);
    toast.success('Cover letter downloaded as TXT!');
  };

  const handleDownloadCoverLetterMarkdown = () => {
    downloadCoverLetterAsMarkdown(coverLetter);
    toast.success('Cover letter downloaded as Markdown!');
  };

  const handleCopyCoverLetter = async () => {
    const text = `${coverLetter.greeting}\n\n${coverLetter.opening}\n\n${coverLetter.body.join('\n\n')}\n\n${coverLetter.closing}\n\n${coverLetter.signature}`;
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Cover letter copied to clipboard!');
    } else {
      toast.error('Failed to copy cover letter');
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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Your Optimized Documents
            </h1>
            <p className="text-slate-400">
              AI-powered resume and cover letter ready for your next opportunity
            </p>
          </div>

          <motion.button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </motion.button>
        </motion.div>

        {/* Changes Summary */}
        <ChangesSummary
          changes={optimizedResume.changes}
          matchScore={optimizedResume.matchScore}
        />

        {/* Keyword Match */}
        <KeywordMatch
          matchedKeywords={optimizedResume.matchedKeywords}
          totalKeywords={jobKeywords}
          matchScore={optimizedResume.matchScore}
        />

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <motion.button
            onClick={() => setActiveTab('resume')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              transition-all duration-300
              ${activeTab === 'resume'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-slate-800/30 text-slate-400 border border-slate-600/30 hover:bg-slate-700/30'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-4 h-4" />
            Resume
          </motion.button>

          <motion.button
            onClick={() => setActiveTab('cover-letter')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              transition-all duration-300
              ${activeTab === 'cover-letter'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-slate-800/30 text-slate-400 border border-slate-600/30 hover:bg-slate-700/30'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail className="w-4 h-4" />
            Cover Letter
          </motion.button>

          {activeTab === 'resume' && (
            <motion.button
              onClick={() => setShowBefore(!showBefore)}
              className={`
                ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300
                ${showBefore
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'bg-slate-800/30 text-slate-400 border border-slate-600/30 hover:bg-slate-700/30'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              {showBefore ? 'View Optimized' : 'View Original'}
            </motion.button>
          )}
        </div>

        {/* Content Area */}
        <motion.div
          className="glass-strong rounded-3xl p-8"
          style={{ minHeight: '600px' }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'resume' ? (
              <motion.div
                key={showBefore ? 'original' : 'optimized'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ResumeDisplay
                  resume={showBefore ? originalResume : optimizedResume}
                  onDownload={handleDownloadResume}
                  onDownloadMarkdown={handleDownloadResumeMarkdown}
                  onCopy={handleCopyResume}
                  delay={0}
                />
              </motion.div>
            ) : (
              <motion.div
                key="cover-letter"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <CoverLetterDisplay
                  coverLetter={coverLetter}
                  onDownload={handleDownloadCoverLetter}
                  onDownloadMarkdown={handleDownloadCoverLetterMarkdown}
                  onCopy={handleCopyCoverLetter}
                  delay={0}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
