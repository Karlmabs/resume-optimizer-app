'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, FileDown, Mail } from 'lucide-react';
import { CoverLetter } from '@/types';
import { useTypewriter } from '@/hooks/useTypewriter';

interface CoverLetterDisplayProps {
  coverLetter: CoverLetter;
  onDownload: () => void;
  onDownloadMarkdown: () => void;
  onCopy: () => void;
  delay?: number;
}

export default function CoverLetterDisplay({
  coverLetter,
  onDownload,
  onDownloadMarkdown,
  onCopy,
  delay = 0
}: CoverLetterDisplayProps) {
  // Build the full cover letter text as one string
  const fullCoverLetterText = useMemo(() => {
    let text = '';

    text += `${coverLetter.greeting}\n\n`;
    text += `${coverLetter.opening}\n\n`;

    coverLetter.body.forEach((paragraph) => {
      text += `${paragraph}\n\n`;
    });

    text += `${coverLetter.closing}\n\n`;
    text += `${coverLetter.signature}`;

    return text;
  }, [coverLetter]);

  const { displayedText, isComplete, skip } = useTypewriter({
    text: fullCoverLetterText,
    speed: 10,  // Fast typing speed
    delay: delay
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-400" />
          Cover Letter
        </h2>

        <div className="flex gap-2">
          {!isComplete && (
            <motion.button
              onClick={skip}
              className="px-3 py-2 rounded-lg glass hover:bg-purple-500/20 transition-colors text-sm text-purple-400 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Show all content instantly"
            >
              Skip Animation
            </motion.button>
          )}

          <motion.button
            onClick={onCopy}
            className="p-2 rounded-lg glass hover:bg-slate-700/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Copy to clipboard"
          >
            <Copy className="w-5 h-5 text-slate-400" />
          </motion.button>

          <motion.button
            onClick={onDownload}
            className="p-2 rounded-lg glass hover:bg-slate-700/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download as TXT"
          >
            <Download className="w-5 h-5 text-slate-400" />
          </motion.button>

          <motion.button
            onClick={onDownloadMarkdown}
            className="p-2 rounded-lg glass hover:bg-purple-500/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download as Markdown"
          >
            <FileDown className="w-5 h-5 text-purple-400" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-8"
        >
          <div className="text-slate-300 whitespace-pre-line leading-relaxed text-base">
            {displayedText}
            {!isComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block w-2 h-5 bg-purple-400 ml-0.5"
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
