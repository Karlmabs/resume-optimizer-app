'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import LandingPage from '@/components/LandingPage';
import ResumeBuilder from '@/components/ResumeBuilder';
import ResumeReview from '@/components/ResumeReview';
import JobDescriptionScreen from '@/components/JobDescriptionScreen';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import ResultsPage from '@/components/ResultsPage';
import { OptimizedResume, CoverLetter, Resume } from '@/types';
import { getWebSocketService, createWebSocketService } from '@/services/websocketService';

type AppState = 'landing' | 'builder' | 'review' | 'job-description' | 'processing' | 'results' | 'parsing';

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

  const parseResumeFileWithWebSocket = async (file: File): Promise<void> => {
    const wsService = createWebSocketService('parse');

    try {
      // Connect to WebSocket
      await wsService.connect();

      // Handle incoming messages
      wsService.onMessage((message) => {
        if (message.type === 'progress') {
          setProgress(message.progress);
          setStage(message.message);
        } else if (message.type === 'result') {
          // Parse result
          const data = message.data as { resume: Resume; extractedText: string; warnings: string[] };

          setOriginalResume(data.resume);
          setExtractedText(data.extractedText || '');
          setParsingWarnings(data.warnings || []);

          // Show warnings to user if any
          if (data.warnings && data.warnings.length > 0) {
            data.warnings.forEach((warning: string) => {
              toast.error(warning, { duration: 5000 });
            });
          }

          // Small delay to show completion
          setTimeout(() => {
            setAppState('review');
            setIsParsing(false);
            wsService.disconnect();
          }, 500);
        } else if (message.type === 'error') {
          toast.error(`Error: ${message.message}`);
          console.error('Backend error:', message.message);
          setAppState('landing');
          setIsParsing(false);
          wsService.disconnect();
        }
      });

      // Send parse request
      await wsService.sendParseRequest(file);
    } catch (error) {
      console.error('Failed to parse resume:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to parse resume. Please ensure the backend server is running on port 8000.');
      setAppState('landing');
      setIsParsing(false);
      wsService.disconnect();
    }
  };

  // Store job description for later use
  const [jobDescription, setJobDescription] = useState('');

  const handleGenerate = async (selectedFile: File | null) => {
    if (!selectedFile) {
      toast.error('Please upload a resume');
      return;
    }

    setIsParsing(true);
    setProgress(0);
    setStage('');

    // Switch to parsing state to show progress animation
    setAppState('parsing');

    try {
      // Parse the uploaded resume with WebSocket for live updates
      await parseResumeFileWithWebSocket(selectedFile);
    } catch (error) {
      console.error('Failed to parse resume:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to parse resume. Please ensure the backend server is running on port 8000.');
      setAppState('landing');
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

  const handleBuildFromScratch = () => {
    setAppState('builder');
  };

  const handleBuilderComplete = (resume: Resume) => {
    // Save the resume built from scratch
    setOriginalResume(resume);
    // Go to review state
    setAppState('review');
  };

  const handleBuilderCancel = () => {
    setAppState('landing');
  };

  return (
    <main>
      {appState === 'landing' && (
        <LandingPage
          onGenerate={handleGenerate}
          isParsing={isParsing}
          onBuildFromScratch={handleBuildFromScratch}
        />
      )}

      {appState === 'parsing' && (
        <ProcessingAnimation progress={progress} stage={stage} />
      )}

      {appState === 'builder' && (
        <ResumeBuilder
          initialData={originalResume}
          onComplete={handleBuilderComplete}
          onCancel={handleBuilderCancel}
        />
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
