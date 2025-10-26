'use client';

import { Resume, Skill } from '@/types';
import { Code, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillsStepProps {
  data: Resume;
  onUpdate: (field: keyof Resume, value: any) => void;
}

export default function SkillsStep({ data, onUpdate }: SkillsStepProps) {
  const [newSkillInputs, setNewSkillInputs] = useState<{ [key: number]: string }>({});

  const addSkillCategory = () => {
    const newSkill: Skill = {
      category: '',
      items: []
    };
    onUpdate('skills', [...data.skills, newSkill]);
  };

  const removeSkillCategory = (index: number) => {
    onUpdate('skills', data.skills.filter((_, i) => i !== index));
  };

  const updateSkillCategory = (index: number, category: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], category };
    onUpdate('skills', newSkills);
  };

  const addSkillItem = (categoryIndex: number, skill: string) => {
    if (!skill.trim()) return;

    const newSkills = [...data.skills];
    newSkills[categoryIndex] = {
      ...newSkills[categoryIndex],
      items: [...newSkills[categoryIndex].items, skill.trim()]
    };
    onUpdate('skills', newSkills);

    // Clear input
    setNewSkillInputs(prev => ({ ...prev, [categoryIndex]: '' }));
  };

  const removeSkillItem = (categoryIndex: number, skillIndex: number) => {
    const newSkills = [...data.skills];
    newSkills[categoryIndex] = {
      ...newSkills[categoryIndex],
      items: newSkills[categoryIndex].items.filter((_, i) => i !== skillIndex)
    };
    onUpdate('skills', newSkills);
  };

  const handleKeyPress = (e: React.KeyboardEvent, categoryIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = newSkillInputs[categoryIndex] || '';
      if (value.trim()) {
        addSkillItem(categoryIndex, value);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Skills</h2>
        <p className="text-sm text-slate-400">
          Organize your skills into categories (e.g., Frontend, Backend, Tools & Technologies).
        </p>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.skills.map((skill, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl p-6"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-5 h-5 text-pink-400" />
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) => updateSkillCategory(categoryIndex, e.target.value)}
                  placeholder="Category Name (e.g., Frontend Development)"
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors font-medium"
                />
                <button
                  type="button"
                  onClick={() => removeSkillCategory(categoryIndex)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {skill.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-200 text-sm"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeSkillItem(categoryIndex, itemIndex)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Add Skill Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkillInputs[categoryIndex] || ''}
                  onChange={(e) => setNewSkillInputs(prev => ({ ...prev, [categoryIndex]: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, categoryIndex)}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = newSkillInputs[categoryIndex] || '';
                    if (value.trim()) {
                      addSkillItem(categoryIndex, value);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors text-sm"
                >
                  Add
                </button>
              </div>

              {skill.items.length === 0 && (
                <p className="text-xs text-orange-400 mt-2">
                  Add at least one skill to this category
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Category Button */}
        <button
          type="button"
          onClick={addSkillCategory}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-pink-600/10 hover:bg-pink-600/20 border-2 border-dashed border-pink-500/30 hover:border-pink-500/50 text-pink-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Skill Category
        </button>
      </div>

      {/* Examples */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-600">
        <p className="text-sm font-semibold text-slate-300 mb-3">
          💡 Example Skill Categories:
        </p>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
            <p className="text-xs text-violet-300 font-medium mb-2">Frontend Development</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'Vue.js', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux'].map((skill, i) => (
                <span key={i} className="px-2 py-1 rounded bg-violet-600/20 text-violet-200 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
            <p className="text-xs text-violet-300 font-medium mb-2">Backend Development</p>
            <div className="flex flex-wrap gap-2">
              {['Node.js', 'Express.js', 'Python', 'FastAPI', 'PostgreSQL', 'MongoDB', 'REST APIs'].map((skill, i) => (
                <span key={i} className="px-2 py-1 rounded bg-violet-600/20 text-violet-200 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
            <p className="text-xs text-violet-300 font-medium mb-2">DevOps & Tools</p>
            <div className="flex flex-wrap gap-2">
              {['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git', 'GitHub Actions'].map((skill, i) => (
                <span key={i} className="px-2 py-1 rounded bg-violet-600/20 text-violet-200 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
        <p className="text-sm font-semibold text-blue-300 mb-2">💡 Tips:</p>
        <ul className="text-sm text-blue-200/80 space-y-1 ml-4 list-disc">
          <li>Group related skills into logical categories</li>
          <li>Put your strongest skills first within each category</li>
          <li>Include both technical skills and tools/frameworks</li>
          <li>Be specific (e.g., "React 18" instead of just "JavaScript")</li>
          <li>Only include skills you're comfortable discussing in an interview</li>
        </ul>
      </div>
    </div>
  );
}
