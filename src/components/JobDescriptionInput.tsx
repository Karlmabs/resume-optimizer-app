'use client';

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
        <Briefcase className="w-4 h-4" />
        Job Description
      </label>

      <motion.div
        className="relative"
        whileFocus={{ scale: 1.01 }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the job description here or type the key requirements..."
          className="
            w-full h-64 px-6 py-4 rounded-2xl
            bg-slate-800/30 border-2 border-slate-600
            text-slate-200 placeholder-slate-500
            focus:outline-none focus:border-violet-500/50
            focus:bg-slate-800/50
            transition-all duration-300
            resize-none
            font-sans text-sm leading-relaxed
          "
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(139, 92, 246, 0.5) rgba(255, 255, 255, 0.05)'
          }}
        />

        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 right-4 text-xs text-slate-500"
          >
            {value.length} characters
          </motion.div>
        )}
      </motion.div>

      <p className="text-xs text-slate-500 mt-2">
        Include key requirements, responsibilities, and desired qualifications
      </p>
    </div>
  );
}
