'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';

interface KeywordMatchProps {
  matchedKeywords: string[];
  totalKeywords: string[];
  matchScore: number;
}

export default function KeywordMatch({
  matchedKeywords,
  totalKeywords,
  matchScore
}: KeywordMatchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            matchScore >= 75 ? 'bg-green-500/20' :
            matchScore >= 60 ? 'bg-yellow-500/20' :
            'bg-orange-500/20'
          }`}>
            <Target className={`w-5 h-5 ${
              matchScore >= 75 ? 'text-green-400' :
              matchScore >= 60 ? 'text-yellow-400' :
              'text-orange-400'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">
              Qualification Match Analysis
            </h3>
            <p className="text-sm text-slate-400">
              {matchedKeywords.length} of {totalKeywords.length} key qualifications present
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className={`flex items-center gap-2 text-3xl font-bold ${
            matchScore >= 75 ? 'text-green-400' :
            matchScore >= 60 ? 'text-yellow-400' :
            'text-orange-400'
          }`}>
            <TrendingUp className="w-6 h-6" />
            {matchScore}%
          </div>
          <p className="text-xs text-slate-500">
            {matchScore >= 75 ? 'Strong match!' :
             matchScore >= 60 ? 'Good foundation' :
             'Room to grow'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              matchScore >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              matchScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-orange-500 to-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${matchScore}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-4">
        {totalKeywords.map((keyword, index) => {
          const isMatched = matchedKeywords.includes(keyword);

          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium
                transition-all duration-300
                ${isMatched
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-slate-700/30 text-slate-500 border border-slate-600/30'
                }
              `}
            >
              {keyword}
              {isMatched && (
                <span className="ml-1.5 text-green-400">✓</span>
              )}
            </motion.span>
          );
        })}
      </div>

      {/* Helpful note */}
      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
        <p className="text-xs text-slate-400">
          💡 <strong className="text-slate-300">Note:</strong> This score reflects qualifications genuinely present in your resume.
          {matchScore < 75 && ' Check the "Skills to Develop" section above for ways to strengthen your application.'}
        </p>
      </div>
    </motion.div>
  );
}
