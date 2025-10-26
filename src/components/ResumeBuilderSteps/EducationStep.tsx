'use client';

import { Resume, Education } from '@/types';
import { GraduationCap, Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EducationStepProps {
  data: Resume;
  onUpdate: (field: keyof Resume, value: any) => void;
}

export default function EducationStep({ data, onUpdate }: EducationStepProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    data.education.length > 0 ? data.education[0].id : null
  );

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: []
    };
    onUpdate('education', [...data.education, newEdu]);
    setExpandedId(newEdu.id);
  };

  const removeEducation = (id: string) => {
    onUpdate('education', data.education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onUpdate(
      'education',
      data.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const updateAchievements = (id: string, value: string) => {
    // Split by commas and trim
    const achievementsArray = value.split(',').map(a => a.trim()).filter(a => a);
    updateEducation(id, 'achievements', achievementsArray);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Education</h2>
        <p className="text-sm text-slate-400">
          Add your educational background. Include at least one degree or certification.
        </p>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <GripVertical className="w-5 h-5 text-slate-400" />
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium text-slate-200">
                      {edu.degree || 'Untitled Degree'} {edu.field && `in ${edu.field}`}
                    </p>
                    <p className="text-sm text-slate-400">
                      {edu.institution || 'No institution set'} {edu.endDate && `• ${edu.endDate}`}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEducation(edu.id);
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded Content */}
              {expandedId === edu.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-slate-700"
                >
                  <div className="p-6 space-y-4">
                    {/* Institution */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Institution / University <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="Stanford University"
                        className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>

                    {/* Degree & Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Degree <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Field of Study <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          placeholder="Computer Science"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Location, Dates, GPA */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                          placeholder="Palo Alto, CA"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          placeholder="2016"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          End Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          placeholder="2020"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          GPA (optional)
                        </label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                          placeholder="3.8"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Relevant Coursework / Achievements */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Relevant Coursework or Achievements (comma-separated, optional)
                      </label>
                      <textarea
                        value={edu.achievements?.join(', ') || ''}
                        onChange={(e) => updateAchievements(edu.id, e.target.value)}
                        placeholder="Data Structures, Algorithms, Machine Learning, Artificial Intelligence, Dean's List, Summa Cum Laude"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Separate multiple items with commas
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Education Button */}
        <button
          type="button"
          onClick={addEducation}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-purple-600/10 hover:bg-purple-600/20 border-2 border-dashed border-purple-500/30 hover:border-purple-500/50 text-purple-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </button>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
        <p className="text-sm font-semibold text-blue-300 mb-2">💡 Tips:</p>
        <ul className="text-sm text-blue-200/80 space-y-1 ml-4 list-disc">
          <li>List your most recent or highest degree first</li>
          <li>Include GPA if it's 3.5 or higher</li>
          <li>Add relevant coursework for recent graduates or career changers</li>
          <li>Include honors, awards, or academic achievements</li>
          <li>For ongoing education, use "Expected [Month Year]" as end date</li>
        </ul>
      </div>
    </div>
  );
}
