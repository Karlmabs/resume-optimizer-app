'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import LandingPage from '@/components/LandingPage';
import ResumeReview from '@/components/ResumeReview';
import JobDescriptionScreen from '@/components/JobDescriptionScreen';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import ResultsPage from '@/components/ResultsPage';
import { OptimizedResume, CoverLetter, Resume } from '@/types';
import { getWebSocketService } from '@/services/websocketService';

type AppState = 'landing' | 'review' | 'job-description' | 'processing' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  // Results state
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [jobKeywords, setJobKeywords] = useState<string[]>([]);
  const [originalResume, setOriginalResume] = useState<Resume | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [parsingWarnings, setParsingWarnings] = useState<string[]>([]);

  const parseResumeFile = async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/parse-resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to parse resume';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Store extracted text and warnings for debugging
    setExtractedText(data.extractedText || '');
    setParsingWarnings(data.warnings || []);

    // Show warnings to user if any
    if (data.warnings && data.warnings.length > 0) {
      data.warnings.forEach((warning: string) => {
        toast.error(warning, { duration: 5000 });
      });
    }

    return data.resume;
  };

  // Store job description for later use
  const [jobDescription, setJobDescription] = useState('');

  const handleGenerate = async (selectedFile: File | null) => {
    if (!selectedFile) {
      toast.error('Please upload a resume');
      return;
    }

    setIsParsing(true);

    try {
      // Parse the uploaded resume
      const parsedResume = await parseResumeFile(selectedFile);
      setOriginalResume(parsedResume);

      // Small delay to ensure user sees the success state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Go to review state
      setAppState('review');
    } catch (error) {
      console.error('Failed to parse resume:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to parse resume. Please ensure the backend server is running on port 8000.');
      setAppState('landing');
    } finally {
      setIsParsing(false);
    }
  };

  const handleReviewComplete = (editedResume: Resume) => {
    // Save edited resume and move to job description screen
    setOriginalResume(editedResume);
    setAppState('job-description');
  };

  const handleJobDescriptionSubmit = async (jobDesc: string) => {
    // Store job description and start optimization
    setJobDescription(jobDesc);

    if (!originalResume) {
      toast.error('No resume data found');
      setAppState('landing');
      return;
    }

    setProgress(0);
    setStage('');
    setAppState('processing');

    try {
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
          setAppState('job-description');
          wsService.disconnect();
        }
      });

      // Send optimization request to backend
      wsService.sendOptimizeRequest(
        originalResume,
        jobDesc
      );
    } catch (error) {
      console.error('Failed to optimize resume:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to optimize resume. Please ensure the backend server is running on port 8000.');
      setAppState('job-description');
    }
  };

  const handleBackToReview = () => {
    setAppState('review');
  };

  const handleCancelReview = () => {
    setAppState('landing');
    setOriginalResume(null);
    setExtractedText('');
    setParsingWarnings([]);
  };

  const handleRestart = () => {
    setProgress(0);
    setStage('');
    setOptimizedResume(null);
    setCoverLetter(null);
    setJobKeywords([]);
    setOriginalResume(null);
    setExtractedText('');
    setParsingWarnings([]);
    setAppState('landing');
  };

  return (
    <main>
      {appState === 'landing' && (
        <LandingPage onGenerate={handleGenerate} isParsing={isParsing} />
      )}

      {appState === 'review' && originalResume && (
        <ResumeReview
          parsedResume={originalResume}
          extractedText={extractedText}
          parsingWarnings={parsingWarnings}
          onContinue={handleReviewComplete}
          onCancel={handleCancelReview}
        />
      )}

      {appState === 'job-description' && originalResume && (
        <JobDescriptionScreen
          verifiedResume={originalResume}
          onContinue={handleJobDescriptionSubmit}
          onBack={handleBackToReview}
        />
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
          extractedText={extractedText}
          parsingWarnings={parsingWarnings}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
