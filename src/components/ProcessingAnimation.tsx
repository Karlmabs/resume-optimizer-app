'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ProcessingAnimationProps {
  progress: number;
  stage: string; // This is the real-time message from the backend!
}

export default function ProcessingAnimation({ progress, stage }: ProcessingAnimationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-12 text-center"
        >
          {/* AI Brain Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 mb-8"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Brain className="w-12 h-12 text-violet-400" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-slate-200 mb-4">
            AI is Working Its Magic
          </h2>

          <p className="text-slate-400 mb-8">
            Watch the real-time progress as AI transforms your resume
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Animated shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <motion.p
                key={progress}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-violet-400"
              >
                {progress}%
              </motion.p>
              <motion.span
                className="text-xs text-slate-500 uppercase tracking-wider"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {progress < 100 ? 'Processing...' : 'Complete!'}
              </motion.span>
            </div>
          </div>

          {/* Real-time Status Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage} // Re-animate when message changes
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20"
            >
              <div className="flex items-center justify-center gap-3">
                {/* Animated thinking dots */}
                {progress < 100 && (
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-violet-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Actual message from backend */}
                <p className="text-lg font-medium text-slate-200">
                  {stage || 'Initializing...'}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Helpful tip */}
          {progress > 30 && progress < 100 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-sm text-slate-500"
            >
              💡 Tip: The AI is analyzing every detail to make you the perfect candidate for this role
            </motion.p>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
