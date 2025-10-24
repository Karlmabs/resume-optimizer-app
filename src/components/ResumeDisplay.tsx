'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Clock, FileDown } from 'lucide-react';
import { Resume } from '@/types';
import { useTypewriter } from '@/hooks/useTypewriter';

interface ResumeDisplayProps {
  resume: Resume;
  onDownload: () => void;
  onDownloadMarkdown: () => void;
  onCopy: () => void;
  delay?: number;
}

export default function ResumeDisplay({ resume, onDownload, onDownloadMarkdown, onCopy, delay = 0 }: ResumeDisplayProps) {
  const [sections, setSections] = useState<Array<{ title: string; content: string; delay: number }>>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    // Build sections array
    const newSections = [
      {
        title: 'Contact',
        content: `${resume.contact.name}\n${resume.contact.email} | ${resume.contact.phone} | ${resume.contact.location}`,
        delay: delay
      },
      {
        title: 'Professional Summary',
        content: resume.summary,
        delay: delay + 1000
      },
      ...resume.experience.map((exp, idx) => ({
        title: `${exp.position} - ${exp.company}`,
        content: `${exp.location} | ${exp.startDate} - ${exp.endDate}\n${exp.description.map(d => `• ${d}`).join('\n')}`,
        delay: delay + 2000 + (idx * 2000)
      })),
      {
        title: 'Education',
        content: resume.education.map(edu =>
          `${edu.degree} in ${edu.field}\n${edu.institution}, ${edu.location}\n${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`
        ).join('\n\n'),
        delay: delay + 2000 + (resume.experience.length * 2000)
      },
      {
        title: 'Skills',
        content: resume.skills.map(skill => `${skill.category}: ${skill.items.join(', ')}`).join('\n'),
        delay: delay + 3000 + (resume.experience.length * 2000)
      }
    ];

    setSections(newSections);
  }, [resume, delay]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-5 h-5 text-violet-400" />
          </motion.div>
          Optimized Resume
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
            className="p-2 rounded-lg glass hover:bg-violet-500/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download as Markdown"
          >
            <FileDown className="w-5 h-5 text-violet-400" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {sections.map((section, index) => (
          <ResumeSection
            key={index}
            title={section.title}
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
  );
}

interface ResumeSectionProps {
  title: string;
  content: string;
  delay: number;
  onComplete: () => void;
  isActive: boolean;
}

function ResumeSection({ title, content, delay, onComplete, isActive }: ResumeSectionProps) {
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-violet-400 mb-3">
        {title}
      </h3>

      <div className="text-slate-300 whitespace-pre-line leading-relaxed">
        {displayedText}
        {!isComplete && isActive && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-0.5 h-5 bg-violet-400 ml-1"
          />
        )}
      </div>
    </motion.div>
  );
}
