'use client';

import { Resume, Experience } from '@/types';
import { Briefcase, Plus, Trash2, Sparkles, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperienceStepProps {
  data: Resume;
  onUpdate: (field: keyof Resume, value: any) => void;
}

export default function ExperienceStep({ data, onUpdate }: ExperienceStepProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    data.experience.length > 0 ? data.experience[0].id : null
  );

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: []
    };
    onUpdate('experience', [...data.experience, newExp]);
    setExpandedId(newExp.id);
  };

  const removeExperience = (id: string) => {
    onUpdate('experience', data.experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onUpdate(
      'experience',
      data.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addBulletPoint = (id: string) => {
    const exp = data.experience.find(e => e.id === id);
    if (exp) {
      updateExperience(id, 'description', [...exp.description, '']);
    }
  };

  const updateBulletPoint = (expId: string, bulletIndex: number, value: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (exp) {
      const newDescription = [...exp.description];
      newDescription[bulletIndex] = value;
      updateExperience(expId, 'description', newDescription);
    }
  };

  const removeBulletPoint = (expId: string, bulletIndex: number) => {
    const exp = data.experience.find(e => e.id === expId);
    if (exp) {
      updateExperience(expId, 'description', exp.description.filter((_, i) => i !== bulletIndex));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Work Experience</h2>
        <p className="text-sm text-slate-400">
          Add your work history. Include at least one position. Click on an entry to expand and edit it.
        </p>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <GripVertical className="w-5 h-5 text-slate-400" />
                  <Briefcase className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="font-medium text-slate-200">
                      {exp.position || 'Untitled Position'} {exp.company && `at ${exp.company}`}
                    </p>
                    <p className="text-sm text-slate-400">
                      {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : 'No dates set'}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExperience(exp.id);
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded Content */}
              {expandedId === exp.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-slate-700"
                >
                  <div className="p-6 space-y-4">
                    {/* Position & Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Position / Job Title <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Software Engineer"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Company <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Tech Corp"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Location & Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="San Francisco, CA"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Start Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="January 2020"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          End Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Responsibilities/Achievements */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Responsibilities & Achievements <span className="text-red-400">*</span>
                        </label>
                        <button
                          type="button"
                          disabled
                          title="AI assistance coming soon!"
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs opacity-50 cursor-not-allowed"
                        >
                          <Sparkles className="w-3 h-3" />
                          Generate with AI
                        </button>
                      </div>

                      <div className="space-y-2">
                        {exp.description.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex items-start gap-2">
                            <span className="text-slate-400 mt-2">•</span>
                            <textarea
                              value={bullet}
                              onChange={(e) => updateBulletPoint(exp.id, bulletIndex, e.target.value)}
                              placeholder="Led development of microservices architecture, improving system scalability by 300% and reducing deployment time from 2 hours to 15 minutes"
                              rows={2}
                              className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeBulletPoint(exp.id, bulletIndex)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addBulletPoint(exp.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-colors text-sm w-full"
                        >
                          <Plus className="w-4 h-4" />
                          Add Bullet Point
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Experience Button */}
        <button
          type="button"
          onClick={addExperience}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-violet-600/10 hover:bg-violet-600/20 border-2 border-dashed border-violet-500/30 hover:border-violet-500/50 text-violet-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Work Experience
        </button>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
        <p className="text-sm font-semibold text-blue-300 mb-2">💡 Writing Tips:</p>
        <ul className="text-sm text-blue-200/80 space-y-1 ml-4 list-disc">
          <li>Start each bullet with strong action verbs (Led, Developed, Architected, Optimized)</li>
          <li>Include quantifiable achievements with numbers, percentages, or metrics</li>
          <li>Focus on impact and results, not just duties</li>
          <li>Tailor bullets to highlight relevant skills for your target role</li>
          <li>Aim for 3-5 bullet points per position</li>
        </ul>
      </div>
    </div>
  );
}
