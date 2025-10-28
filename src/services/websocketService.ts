import { Resume, OptimizedResume, CoverLetter } from '@/types';

interface ProgressUpdate {
  type: 'progress';
  stage: string;
  progress: number;
  message: string;
}

interface ParseResultUpdate {
  type: 'result';
  data: {
    resume: Resume;
    extractedText: string;
    warnings: string[];
  };
}

interface OptimizeResultUpdate {
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

type WebSocketMessage = ProgressUpdate | ParseResultUpdate | OptimizeResultUpdate | ErrorUpdate;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(endpoint: 'parse' | 'optimize' = 'optimize', url?: string) {
    if (url) {
      this.url = url;
    } else {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      // Convert http/https to ws/wss
      const wsUrl = apiUrl.replace(/^https?:/, 'ws:').replace(/^http:/, 'ws:');
      this.url = `${wsUrl}/ws/${endpoint}`;
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected to', this.url);
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

  async sendParseRequest(file: File): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    // Convert file to base64
    const fileContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    this.ws.send(JSON.stringify({
      type: 'parse',
      fileContent,
      fileType: file.type,
      fileName: file.name
    }));
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

// Factory function to create WebSocket services
export const createWebSocketService = (endpoint: 'parse' | 'optimize'): WebSocketService => {
  return new WebSocketService(endpoint);
};

// Singleton instance for optimization (backwards compatibility)
let wsOptimizeServiceInstance: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!wsOptimizeServiceInstance) {
    wsOptimizeServiceInstance = new WebSocketService('optimize');
  }
  return wsOptimizeServiceInstance;
};
