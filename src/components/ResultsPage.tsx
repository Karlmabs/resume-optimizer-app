'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Eye, FileText, Mail, FileCode, AlertTriangle, TrendingUp, BookOpen, Clock, AlertCircle } from 'lucide-react';
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
  extractedText: string;
  parsingWarnings: string[];
  onRestart: () => void;
}

export default function ResultsPage({
  originalResume,
  optimizedResume,
  coverLetter,
  jobKeywords,
  extractedText,
  parsingWarnings,
  onRestart
}: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  const [showBefore, setShowBefore] = useState(false);
  const [showExtractedText, setShowExtractedText] = useState(false);

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

        {/* Ethical Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-xl bg-blue-500/10 border border-blue-500/30"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">
                📋 Please Review Carefully - Your Responsibility
              </h3>
              <p className="text-sm text-blue-200/80 mb-2">
                This resume has been optimized to present your actual experience professionally. However, you must verify that:
              </p>
              <ul className="text-sm text-blue-200/80 space-y-1 ml-4 list-disc">
                <li>All skills listed are ones you can demonstrate in interviews</li>
                <li>All achievements and metrics accurately reflect your work</li>
                <li>Nothing has been added that you cannot support with examples</li>
              </ul>
              <p className="text-xs text-blue-300/70 mt-3 font-medium">
                ⚠️ Only apply with information you can honestly discuss and defend. Review the "Changes Summary" below to see what was modified.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Changes Summary */}
        <ChangesSummary
          changes={optimizedResume.changes}
          matchScore={optimizedResume.matchScore}
          potentialScore={optimizedResume.potentialScore}
        />

        {/* Keyword Match */}
        <KeywordMatch
          matchedKeywords={optimizedResume.matchedKeywords}
          totalKeywords={jobKeywords}
          matchScore={optimizedResume.matchScore}
        />

        {/* Skill Gaps Section */}
        {optimizedResume.skillGaps && optimizedResume.skillGaps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-200">
                    Skills to Develop
                  </h2>
                  <p className="text-sm text-slate-400">
                    Strengthen your application by learning these skills
                    {optimizedResume.potentialScore && (
                      <span className="text-green-400 font-medium ml-2">
                        (Could reach {optimizedResume.potentialScore}% match)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimizedResume.skillGaps.map((gap, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      gap.importance === 'critical'
                        ? 'bg-red-500/5 border-red-500/30'
                        : gap.importance === 'important'
                        ? 'bg-orange-500/5 border-orange-500/30'
                        : 'bg-yellow-500/5 border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${
                        gap.importance === 'critical' ? 'text-red-300' :
                        gap.importance === 'important' ? 'text-orange-300' :
                        'text-yellow-300'
                      }`}>
                        {gap.skill}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        gap.importance === 'critical'
                          ? 'bg-red-500/20 text-red-300'
                          : gap.importance === 'important'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {gap.importance}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">{gap.learningPath}</p>
                    </div>

                    {gap.estimatedTime && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{gap.estimatedTime}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400">
                  💡 <strong className="text-slate-300">Tip:</strong> Focus on critical skills first. You can still apply now and mention you're actively learning these skills in your cover letter.
                </p>
              </div>
            </div>
          </motion.div>
        )}

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
            <>
              <motion.button
                onClick={() => setShowExtractedText(!showExtractedText)}
                className={`
                  ml-auto flex items-center gap-2 px-4 py-3 rounded-xl font-medium
                  transition-all duration-300
                  ${showExtractedText
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800/30 text-slate-400 border border-slate-600/30 hover:bg-slate-700/30'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="View raw text extracted from your file"
              >
                <FileCode className="w-4 h-4" />
                Extracted Text
              </motion.button>

              <motion.button
                onClick={() => setShowBefore(!showBefore)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium
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
                {showBefore ? 'View Optimized' : 'View Base Resume'}
              </motion.button>
            </>
          )}
        </div>

        {/* Parsing Warnings Banner */}
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
                  Parsing Warnings Detected
                </h3>
                <ul className="text-sm text-orange-200/80 space-y-1">
                  {parsingWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
                <p className="text-xs text-orange-300/60 mt-2">
                  Consider using the Edit mode to correct any missing information.
                </p>
              </div>
            </div>
          </motion.div>
        )}

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

        {/* Extracted Text Modal */}
        <AnimatePresence>
          {showExtractedText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowExtractedText(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-strong rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-200">Extracted Text</h2>
                  <button
                    onClick={() => setShowExtractedText(false)}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  This is the raw text extracted from your resume file before AI parsing.
                </p>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {extractedText || 'No text extracted'}
                  </pre>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
