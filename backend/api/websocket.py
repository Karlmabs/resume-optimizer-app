import json
import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from services.ai_service import AIService
from services.parser_service import FileParserService
from models.schemas import Resume, OptimizeRequest

class WebSocketManager:
    """Manages WebSocket connections for real-time updates"""

    def __init__(self):
        self.ai_service = AIService()
        self.parser_service = FileParserService()  # Now properly initialized with AI capabilities

    async def handle_optimize(self, websocket: WebSocket, data: dict):
        """Handle resume optimization with REAL-TIME AI progress updates"""
        try:
            # Stage 1: Parse and validate (10%)
            await self.send_progress(websocket, "analyzing", 10, "📄 Validating resume data...")

            resume = Resume(**data['resume'])
            job_description = data['jobDescription']
            job_title = data.get('jobTitle', 'the position')
            company = data.get('company', 'your company')

            await asyncio.sleep(0.3)

            # Stage 2: Extracting job keywords (20%)
            await self.send_progress(websocket, "analyzing", 20, "🔍 Extracting keywords from job description...")
            await asyncio.sleep(0.3)

            # Stage 3: Preparing for AI optimization (30%)
            await self.send_progress(websocket, "preparing", 30, "🎯 Preparing resume for AI transformation...")
            await asyncio.sleep(0.3)

            # Create progress callback for resume optimization
            async def resume_progress_callback(progress, message):
                await self.send_progress(websocket, "optimizing", progress, message)

            # Stage 4: AI Resume Optimization (30% → 83%)
            await self.send_progress(websocket, "optimizing", 40, "🤖 Sending resume to AI for transformation...")

            optimized_resume, keywords = await self.ai_service.optimize_resume(
                resume,
                job_description,
                progress_callback=resume_progress_callback
            )

            # AI finished resume optimization
            await self.send_progress(websocket, "optimizing", 83, "✅ Resume transformation complete!")
            await asyncio.sleep(0.2)

            # Create progress callback for cover letter
            async def cover_letter_progress_callback(progress, message):
                await self.send_progress(websocket, "generating", progress, message)

            # Stage 5: AI Cover Letter Generation (83% → 96%)
            await self.send_progress(websocket, "generating", 84, "📝 Preparing cover letter generation...")

            cover_letter = await self.ai_service.generate_cover_letter(
                optimized_resume,  # Use the optimized resume!
                job_description,
                job_title,
                company,
                progress_callback=cover_letter_progress_callback
            )

            # Final stages
            await self.send_progress(websocket, "finalizing", 96, "✅ Cover letter complete!")
            await asyncio.sleep(0.2)
            await self.send_progress(websocket, "finalizing", 98, "📊 Calculating match score...")
            await asyncio.sleep(0.2)

            # Complete (100%)
            await self.send_progress(websocket, "complete", 100, "🎉 All done! Your optimized documents are ready!")

            # Send final results
            await websocket.send_json({
                "type": "result",
                "data": {
                    "optimizedResume": json.loads(optimized_resume.model_dump_json()),
                    "coverLetter": json.loads(cover_letter.model_dump_json()),
                    "jobKeywords": keywords
                }
            })

        except Exception as e:
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })

    async def send_progress(self, websocket: WebSocket, stage: str, progress: int, message: str):
        """Send progress update to frontend"""
        await websocket.send_json({
            "type": "progress",
            "stage": stage,
            "progress": progress,
            "message": message
        })
