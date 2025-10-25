'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, FileDown, Zap } from 'lucide-react';
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
  // Build the full resume text as one string
  const fullResumeText = useMemo(() => {
    let text = '';

    // Contact
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `${resume.contact.name}\n`;
    text += `${resume.contact.email} | ${resume.contact.phone}\n`;
    text += `${resume.contact.location}\n`;
    if (resume.contact.linkedin) text += `${resume.contact.linkedin}\n`;
    if (resume.contact.website) text += `${resume.contact.website}\n`;
    text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Summary
    if (resume.summary) {
      text += `PROFESSIONAL SUMMARY\n\n`;
      text += `${resume.summary}\n\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // Experience
    if (resume.experience && resume.experience.length > 0) {
      text += `PROFESSIONAL EXPERIENCE\n\n`;
      resume.experience.forEach((exp, idx) => {
        text += `${exp.position}\n`;
        text += `${exp.company} | ${exp.location}\n`;
        text += `${exp.startDate} - ${exp.endDate}\n\n`;
        exp.description.forEach(desc => {
          text += `• ${desc}\n`;
        });
        if (idx < resume.experience.length - 1) {
          text += `\n`;
        }
      });
      text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      text += `EDUCATION\n\n`;
      resume.education.forEach((edu, idx) => {
        text += `${edu.degree} in ${edu.field}\n`;
        text += `${edu.institution}, ${edu.location}\n`;
        text += `${edu.startDate} - ${edu.endDate}`;
        if (edu.gpa) text += ` | GPA: ${edu.gpa}`;
        if (edu.achievements) text += `\n${edu.achievements}`;
        if (idx < resume.education.length - 1) {
          text += `\n\n`;
        }
      });
      text += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      text += `SKILLS\n\n`;
      resume.skills.forEach((skill, idx) => {
        text += `${skill.category}:\n`;
        text += `${skill.items.join(', ')}`;
        if (idx < resume.skills.length - 1) {
          text += `\n\n`;
        }
      });
      text += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    }

    return text;
  }, [resume]);

  const { displayedText, isComplete, skip } = useTypewriter({
    text: fullResumeText,
    speed: 10,  // Fast typing speed
    delay: delay
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" />
          Optimized Resume
        </h2>

        <div className="flex gap-2">
          {!isComplete && (
            <motion.button
              onClick={skip}
              className="px-3 py-2 rounded-lg glass hover:bg-violet-500/20 transition-colors text-sm text-violet-400 font-medium"
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
            className="p-2 rounded-lg glass hover:bg-violet-500/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download as Markdown"
          >
            <FileDown className="w-5 h-5 text-violet-400" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-8 font-mono text-sm"
        >
          <div className="text-slate-300 whitespace-pre-line leading-relaxed">
            {displayedText}
            {!isComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block w-2 h-5 bg-violet-400 ml-0.5"
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
