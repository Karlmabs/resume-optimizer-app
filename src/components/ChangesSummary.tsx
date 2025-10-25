'use client';

import { motion } from 'framer-motion';
import { Sparkles, Plus, Edit, ArrowRight } from 'lucide-react';
import { ResumeChange } from '@/types';

interface ChangesSummaryProps {
  changes: ResumeChange[];
  matchScore: number;
}

export default function ChangesSummary({ changes, matchScore }: ChangesSummaryProps) {
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
              <p className="text-sm text-slate-400 mb-1">Match Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {matchScore}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Optimization Level</p>
              <p className="text-lg font-semibold text-violet-400">
                {matchScore >= 90 ? 'Excellent' : matchScore >= 75 ? 'Very Good' : 'Good'}
              </p>
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-200">
                      {change.section}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getChangeColor(change.type)}`}>
                      {change.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {change.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-violet-400">✨ AI-Powered Optimization:</span>{' '}
            Your resume has been intelligently transformed to match the job requirements perfectly,
            including skills enhancement, experience rewriting, and ATS keyword optimization.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
