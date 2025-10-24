'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, FileText, Zap } from 'lucide-react';

interface ProcessingAnimationProps {
  progress: number;
  stage: string;
}

export default function ProcessingAnimation({ progress, stage }: ProcessingAnimationProps) {
  const stages = [
    { name: 'Analyzing resume...', icon: FileText },
    { name: 'Matching keywords...', icon: Sparkles },
    { name: 'Optimizing content...', icon: Brain },
    { name: 'Generating cover letter...', icon: Zap }
  ];

  const currentStageIndex = Math.min(
    Math.floor(progress / 25),
    stages.length - 1
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6">
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

          {/* Stage Title */}
          <h2 className="text-3xl font-bold text-slate-200 mb-4">
            AI is Working Its Magic
          </h2>

          <p className="text-slate-400 mb-8">
            Optimizing your resume and generating a personalized cover letter
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            <motion.p
              key={progress}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-slate-500 mt-2"
            >
              {progress}% Complete
            </motion.p>
          </div>

          {/* Stages */}
          <div className="space-y-4">
            {stages.map((stageItem, index) => {
              const Icon = stageItem.icon;
              const isComplete = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl
                    transition-all duration-300
                    ${isCurrent ? 'bg-violet-500/10 border border-violet-500/30' : 'bg-slate-800/30'}
                    ${isComplete ? 'opacity-50' : ''}
                  `}
                >
                  <motion.div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${isCurrent ? 'bg-violet-500/20' : 'bg-slate-700/50'}
                    `}
                    animate={isCurrent ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-violet-400' : 'text-slate-500'}`} />
                  </motion.div>

                  <span className={`text-sm font-medium ${isCurrent ? 'text-slate-200' : 'text-slate-500'}`}>
                    {stageItem.name}
                  </span>

                  {isCurrent && (
                    <motion.div
                      className="ml-auto flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-violet-400 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  )}

                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
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
