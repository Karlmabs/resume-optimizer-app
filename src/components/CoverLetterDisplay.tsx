'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Clock, FileDown } from 'lucide-react';
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
  const [sections, setSections] = useState<Array<{ content: string; delay: number }>>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    const newSections = [
      { content: coverLetter.greeting, delay: delay },
      { content: coverLetter.opening, delay: delay + 1000 },
      ...coverLetter.body.map((paragraph, idx) => ({
        content: paragraph,
        delay: delay + 2000 + (idx * 3000)
      })),
      { content: coverLetter.closing, delay: delay + 2000 + (coverLetter.body.length * 3000) },
      { content: coverLetter.signature, delay: delay + 3000 + (coverLetter.body.length * 3000) }
    ];

    setSections(newSections);
  }, [coverLetter, delay]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-5 h-5 text-purple-400" />
          </motion.div>
          Cover Letter
        </h2>

        <div className="flex gap-2">
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
        <div className="glass rounded-xl p-8 space-y-6">
          {sections.map((section, index) => (
            <CoverLetterParagraph
              key={index}
              content={section.content}
              delay={section.delay}
              onComplete={() => {
                if (index < sections.length - 1) {
                  setCurrentSectionIndex(index + 1);
                }
              }}
              isActive={index <= currentSectionIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CoverLetterParagraphProps {
  content: string;
  delay: number;
  onComplete: () => void;
  isActive: boolean;
}

function CoverLetterParagraph({ content, delay, onComplete, isActive }: CoverLetterParagraphProps) {
  const { displayedText, isComplete } = useTypewriter({
    text: isActive ? content : '',
    speed: 15,
    delay: delay,
    onComplete
  });

  if (!isActive && !isComplete) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-slate-300 leading-relaxed"
    >
      <p className="whitespace-pre-line">
        {displayedText}
        {!isComplete && isActive && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-0.5 h-5 bg-purple-400 ml-1"
          />
        )}
      </p>
    </motion.div>
  );
}
