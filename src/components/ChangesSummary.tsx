'use client';

import { motion } from 'framer-motion';
import { Sparkles, Plus, Edit, ArrowRight, Shield, AlertTriangle, HelpCircle } from 'lucide-react';
import { ResumeChange } from '@/types';

interface ChangesSummaryProps {
  changes: ResumeChange[];
  matchScore: number;
  potentialScore?: number;
}

export default function ChangesSummary({ changes, matchScore, potentialScore }: ChangesSummaryProps) {
  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4" />;
      case 'modified':
        return <Edit className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'modified':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
    }
  };

  const getConfidenceIcon = (confidence?: string) => {
    switch (confidence) {
      case 'verified':
        return <Shield className="w-3 h-3 text-green-400" />;
      case 'inferred':
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'suggested':
        return <HelpCircle className="w-3 h-3 text-orange-400" />;
      default:
        return <Shield className="w-3 h-3 text-green-400" />;
    }
  };

  const getConfidenceLabel = (confidence?: string) => {
    switch (confidence) {
      case 'verified':
        return 'Verified from resume';
      case 'inferred':
        return 'Inferred from work';
      case 'suggested':
        return 'Suggested - please verify';
      default:
        return 'Verified';
    }
  };

  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case 'verified':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'inferred':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      case 'suggested':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-300';
      default:
        return 'bg-green-500/10 border-green-500/30 text-green-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-violet-400" />
          <h2 className="text-2xl font-bold text-slate-200">
            Resume Transformation Summary
          </h2>
        </div>

        {/* Match Score */}
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Current Match Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {matchScore}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Based on your actual qualifications
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Match Level</p>
              <p className="text-lg font-semibold text-violet-400">
                {matchScore >= 90 ? 'Excellent Match' :
                 matchScore >= 75 ? 'Strong Match' :
                 matchScore >= 60 ? 'Good Match' :
                 'Consider Skill Development'}
              </p>
              {potentialScore && potentialScore > matchScore && (
                <p className="text-xs text-green-400 mt-1">
                  Could reach {potentialScore}% with training
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Changes List */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-300 mb-4">
            {changes.length} transformations applied:
          </p>

          {changes.map((change, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${getChangeColor(change.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${getChangeColor(change.type)} p-2 rounded-lg`}>
                  {getChangeIcon(change.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-200">
                      {change.section}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getChangeColor(change.type)}`}>
                      {change.type}
                    </span>
                    {change.confidence && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${getConfidenceColor(change.confidence)}`} title={getConfidenceLabel(change.confidence)}>
                        {getConfidenceIcon(change.confidence)}
                        {change.confidence}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">
                    {change.description}
                  </p>
                  {change.confidence === 'inferred' && (
                    <p className="text-xs text-yellow-400/70 mt-1">
                      ℹ️ This was inferred from your actual work - please verify accuracy
                    </p>
                  )}
                  {change.confidence === 'suggested' && (
                    <p className="text-xs text-orange-400/70 mt-1">
                      ⚠️ Suggested addition - only include if you actually have this experience
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-violet-400">✨ Professional Optimization:</span>{' '}
            Your resume has been professionally reworded to emphasize relevant experience and skills from your actual background.
            All changes are based on content present in your original resume. Please review carefully and ensure everything is accurate.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
