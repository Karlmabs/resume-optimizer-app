import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api.routes import router
from api.websocket import WebSocketManager
import json

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Resume Optimizer API",
    description="AI-powered resume optimization and cover letter generation",
    version="1.0.0"
)

# CORS middleware - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include REST API routes
app.include_router(router)

# WebSocket manager
ws_manager = WebSocketManager()

@app.websocket("/ws/optimize")
async def websocket_optimize(websocket: WebSocket):
    """WebSocket endpoint for real-time resume optimization"""
    await websocket.accept()

    try:
        while True:
            # Receive data from frontend
            data = await websocket.receive_json()

            if data.get('type') == 'optimize':
                # Handle optimization with real-time progress
                await ws_manager.handle_optimize(websocket, data)

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })
        except:
            pass

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Resume Optimizer API",
        "version": "1.0.0",
        "endpoints": {
            "websocket": "/ws/optimize",
            "parse": "/api/parse-resume",
            "optimize": "/api/optimize",
            "health": "/api/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
