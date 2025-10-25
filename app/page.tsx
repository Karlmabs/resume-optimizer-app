'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import LandingPage from '@/components/LandingPage';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import ResultsPage from '@/components/ResultsPage';
import { OptimizedResume, CoverLetter, Resume } from '@/types';
import { getWebSocketService } from '@/services/websocketService';

type AppState = 'landing' | 'processing' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');

  // Results state
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [jobKeywords, setJobKeywords] = useState<string[]>([]);
  const [originalResume, setOriginalResume] = useState<Resume | null>(null);

  const parseResumeFile = async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to parse resume');
    }

    const data = await response.json();
    return data.resume;
  };

  const handleGenerate = async (selectedFile: File | null, jobDescription: string) => {
    if (!selectedFile) {
      toast.error('Please upload a resume');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      toast.error('Please enter a job description (at least 50 characters)');
      return;
    }

    setProgress(0);
    setStage('');
    setAppState('processing');

    try {
      // Parse the uploaded resume
      const parsedResume = await parseResumeFile(selectedFile);
      setOriginalResume(parsedResume);

      const wsService = getWebSocketService();

      // Connect to backend WebSocket
      await wsService.connect();

      // Handle incoming messages
      wsService.onMessage((message) => {
        if (message.type === 'progress') {
          setProgress(message.progress);
          setStage(message.message);
        } else if (message.type === 'result') {
          setOptimizedResume(message.data.optimizedResume);
          setCoverLetter(message.data.coverLetter);
          setJobKeywords(message.data.jobKeywords);
          setAppState('results');
          wsService.disconnect();
        } else if (message.type === 'error') {
          toast.error(`Error: ${message.message}`);
          console.error('Backend error:', message.message);
          setAppState('landing');
          wsService.disconnect();
        }
      });

      // Send optimization request to backend with actual data
      wsService.sendOptimizeRequest(
        parsedResume,
        jobDescription
      );
    } catch (error) {
      console.error('Failed to process resume:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process resume. Please ensure the backend server is running on port 8000.');
      setAppState('landing');
    }
  };

  const handleRestart = () => {
    setProgress(0);
    setStage('');
    setOptimizedResume(null);
    setCoverLetter(null);
    setJobKeywords([]);
    setOriginalResume(null);
    setAppState('landing');
  };

  return (
    <main>
      {appState === 'landing' && (
        <LandingPage onGenerate={handleGenerate} />
      )}

      {appState === 'processing' && (
        <ProcessingAnimation progress={progress} stage={stage} />
      )}

      {appState === 'results' && optimizedResume && coverLetter && originalResume && (
        <ResultsPage
          originalResume={originalResume}
          optimizedResume={optimizedResume}
          coverLetter={coverLetter}
          jobKeywords={jobKeywords}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
