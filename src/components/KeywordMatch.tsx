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
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">
              Keyword Match Analysis
            </h3>
            <p className="text-sm text-slate-400">
              {matchedKeywords.length} of {totalKeywords.length} keywords matched
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 text-3xl font-bold text-green-400">
            <TrendingUp className="w-6 h-6" />
            {matchScore}%
          </div>
          <p className="text-xs text-slate-500">Match Score</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${matchScore}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2">
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
    </motion.div>
  );
}
