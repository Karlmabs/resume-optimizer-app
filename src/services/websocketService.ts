import { Resume, OptimizedResume, CoverLetter } from '@/types';

interface ProgressUpdate {
  type: 'progress';
  stage: string;
  progress: number;
  message: string;
}

interface ResultUpdate {
  type: 'result';
  data: {
    optimizedResume: OptimizedResume;
    coverLetter: CoverLetter;
    jobKeywords: string[];
  };
}

interface ErrorUpdate {
  type: 'error';
  message: string;
}

type WebSocketMessage = ProgressUpdate | ResultUpdate | ErrorUpdate;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string = 'ws://localhost:8000/ws/optimize') {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  sendOptimizeRequest(resume: Resume, jobDescription: string, jobTitle?: string, company?: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.send(JSON.stringify({
      type: 'optimize',
      resume,
      jobDescription,
      jobTitle: jobTitle || 'the position',
      company: company || 'your company'
    }));
  }

  onMessage(callback: (message: WebSocketMessage) => void) {
    if (!this.ws) return;

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        callback(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let wsServiceInstance: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!wsServiceInstance) {
    wsServiceInstance = new WebSocketService();
  }
  return wsServiceInstance;
};
