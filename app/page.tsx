'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import ResultsPage from '@/components/ResultsPage';
import { sampleResume } from '@/data/sampleResume';
import { sampleJobDescription } from '@/data/sampleJobDescription';
import { sampleOptimizedResume } from '@/data/sampleOptimizedResume';
import { sampleCoverLetter } from '@/data/sampleCoverLetter';

type AppState = 'landing' | 'processing' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');

  useEffect(() => {
    if (appState === 'processing') {
      // Simulate processing stages
      const stages = [
        { progress: 25, stage: 'Analyzing resume...', duration: 1000 },
        { progress: 50, stage: 'Matching keywords...', duration: 1500 },
        { progress: 75, stage: 'Optimizing content...', duration: 1500 },
        { progress: 100, stage: 'Generating cover letter...', duration: 1000 }
      ];

      let currentStageIndex = 0;

      const processStage = () => {
        if (currentStageIndex < stages.length) {
          const currentStage = stages[currentStageIndex];
          setProgress(currentStage.progress);
          setStage(currentStage.stage);

          setTimeout(() => {
            currentStageIndex++;
            if (currentStageIndex < stages.length) {
              processStage();
            } else {
              // Processing complete, show results
              setTimeout(() => {
                setAppState('results');
              }, 500);
            }
          }, currentStage.duration);
        }
      };

      processStage();
    }
  }, [appState]);

  const handleGenerate = () => {
    setProgress(0);
    setStage('');
    setAppState('processing');
  };

  const handleRestart = () => {
    setProgress(0);
    setStage('');
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

      {appState === 'results' && (
        <ResultsPage
          originalResume={sampleResume}
          optimizedResume={sampleOptimizedResume}
          coverLetter={sampleCoverLetter}
          jobKeywords={sampleJobDescription.keywords}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
