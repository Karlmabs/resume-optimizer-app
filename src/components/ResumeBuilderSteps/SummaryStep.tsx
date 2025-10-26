'use client';

import { Resume } from '@/types';
import { FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface SummaryStepProps {
  data: Resume;
  onUpdate: (field: keyof Resume, value: any) => void;
}

export default function SummaryStep({ data, onUpdate }: SummaryStepProps) {
  const [showAIHelper, setShowAIHelper] = useState(false);
  const characterCount = data.summary.length;
  const minCharacters = 50;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Professional Summary</h2>
        <p className="text-sm text-slate-400">
          Write a compelling summary that highlights your experience, skills, and achievements.
          Aim for 2-4 sentences.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Your Professional Summary <span className="text-red-400">*</span>
        </label>
        <textarea
          value={data.summary}
          onChange={(e) => onUpdate('summary', e.target.value)}
          placeholder="Example: Performance-driven Full-Stack Developer with 5+ years of experience building scalable web applications serving 50,000+ users. Expert in React, Node.js, and cloud architecture. Proven track record of delivering 40% performance improvements and leading cross-functional teams of 8+ engineers."
          rows={8}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <div className={`text-sm ${
            characterCount >= minCharacters ? 'text-green-400' : 'text-orange-400'
          }`}>
            {characterCount} / {minCharacters} characters minimum
          </div>

          {/* AI Helper Button - will be implemented later */}
          <button
            type="button"
            onClick={() => setShowAIHelper(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors text-sm"
            disabled
            title="AI assistance coming soon!"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI (Coming Soon)
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
        <p className="text-sm font-semibold text-blue-300 mb-2">💡 Writing Tips:</p>
        <ul className="text-sm text-blue-200/80 space-y-1 ml-4 list-disc">
          <li>Start with your job title and years of experience</li>
          <li>Highlight your top 2-3 technical skills or specializations</li>
          <li>Include quantifiable achievements (percentages, numbers, scale)</li>
          <li>Mention industries or domains you've worked in</li>
          <li>Keep it concise - 2 to 4 sentences is ideal</li>
        </ul>
      </div>

      {/* Examples */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-600">
        <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Example Summaries:
        </p>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
            <p className="text-xs text-violet-300 font-medium mb-1">Full-Stack Developer</p>
            <p className="text-sm text-slate-300">
              "Performance-driven Full-Stack Developer with 4+ years of experience building scalable
              web applications serving 25,000+ users with 99.9% uptime. Expert in modern JavaScript/TypeScript
              ecosystems (React, Node.js, SvelteKit), microservices architecture, and real-time data processing."
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
            <p className="text-xs text-violet-300 font-medium mb-1">Data Scientist</p>
            <p className="text-sm text-slate-300">
              "Results-oriented Data Scientist with 6+ years of experience transforming complex datasets
              into actionable business insights. Specialized in machine learning, predictive modeling, and
              Python/R analytics. Delivered solutions that increased revenue by 30% and reduced operational
              costs by $2M annually."
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
            <p className="text-xs text-violet-300 font-medium mb-1">Product Manager</p>
            <p className="text-sm text-slate-300">
              "Strategic Product Manager with 8+ years driving product vision and execution for SaaS platforms.
              Led cross-functional teams of 15+ to launch 20+ features serving 100K+ users. Expert in agile
              methodologies, user research, and data-driven decision making with track record of 95% feature
              adoption rates."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
