'use client';

import { Resume } from '@/types';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface ContactInfoStepProps {
  data: Resume;
  onUpdate: (field: keyof Resume, value: any) => void;
}

export default function ContactInfoStep({ data, onUpdate }: ContactInfoStepProps) {
  const updateContact = (field: string, value: string) => {
    onUpdate('contact', { ...data.contact, [field]: value });
  };

  const isEmailValid = (email: string) => {
    return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Contact Information</h2>
        <p className="text-sm text-slate-400">
          Let's start with your basic contact details. Fields marked with * are required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={data.contact.name}
              onChange={(e) => updateContact('name', e.target.value)}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              placeholder="john.doe@email.com"
              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border ${
                isEmailValid(data.contact.email) ? 'border-slate-600' : 'border-red-500'
              } text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors`}
            />
          </div>
          {!isEmailValid(data.contact.email) && (
            <p className="text-xs text-red-400 mt-1">Please enter a valid email address</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              value={data.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Location */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={data.contact.location}
              onChange={(e) => updateContact('location', e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-sm text-slate-400">Optional Links</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="url"
              value={data.contact.linkedin || ''}
              onChange={(e) => updateContact('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            GitHub Profile
          </label>
          <div className="relative">
            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="url"
              value={data.contact.github || ''}
              onChange={(e) => updateContact('github', e.target.value)}
              placeholder="https://github.com/johndoe"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Website */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Personal Website / Portfolio
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="url"
              value={data.contact.website || ''}
              onChange={(e) => updateContact('website', e.target.value)}
              placeholder="https://johndoe.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">💡 Tip:</span> Make sure your email is professional and actively monitored.
          Adding your LinkedIn and GitHub profiles can significantly strengthen your application.
        </p>
      </div>
    </div>
  );
}
