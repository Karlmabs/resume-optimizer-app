import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export const useTypewriter = ({
  text,
  speed = 20,
  delay = 0,
  onComplete
}: UseTypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    // Handle initial delay
    if (!hasStarted) {
      if (delay > 0) {
        const delayTimeout = setTimeout(() => {
          setHasStarted(true);
          setCurrentIndex(1);
        }, delay);
        return () => clearTimeout(delayTimeout);
      } else {
        // No delay - start immediately!
        setHasStarted(true);
        setCurrentIndex(1);
      }
      return;
    }

    // Type characters one by one
    if (hasStarted && currentIndex > 0 && currentIndex <= text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex));
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }

    // Mark as complete when done
    if (currentIndex > text.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, delay, isComplete, isPaused, onComplete, hasStarted]);

  const reset = useCallback(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
    setIsPaused(false);
    setHasStarted(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const skip = useCallback(() => {
    setDisplayedText(text);
    setCurrentIndex(text.length + 1);
    setIsComplete(true);
    onComplete?.();
  }, [text, onComplete]);

  return {
    displayedText,
    isComplete,
    isPaused,
    reset,
    pause,
    resume,
    skip
  };
};
