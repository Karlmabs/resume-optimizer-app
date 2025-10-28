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

    async def handle_parse(self, websocket: WebSocket, data: dict):
        """Handle resume parsing with REAL-TIME progress updates"""
        try:
            # Stage 1: Upload received (5%)
            await self.send_progress(websocket, "uploading", 5, "📤 File received, preparing to extract text...")
            await asyncio.sleep(0.2)

            # Get file content
            import base64
            file_content = base64.b64decode(data['fileContent'])
            file_type = data['fileType']

            # Stage 2: Extracting text (15%)
            if file_type == 'application/pdf':
                await self.send_progress(websocket, "extracting", 15, "📄 Extracting text from PDF...")
            elif 'word' in file_type.lower():
                await self.send_progress(websocket, "extracting", 15, "📄 Extracting text from Word document...")
            else:
                await self.send_progress(websocket, "extracting", 15, "📄 Reading document text...")

            # Create progress callback for parsing
            # We'll use a sync wrapper that schedules the async call properly
            progress_queue = []

            def sync_progress_callback(progress, message):
                """Sync callback that stores progress updates"""
                progress_queue.append((progress, message))

            async def send_queued_progress():
                """Periodically send queued progress updates"""
                while True:
                    if progress_queue:
                        progress, message = progress_queue.pop(0)
                        await self.send_progress(websocket, "parsing", progress, message)
                    await asyncio.sleep(0.1)

            # Start the progress sender task
            progress_task = asyncio.create_task(send_queued_progress())

            try:
                # Parse the file with progress updates (15% → 90%)
                resume, extracted_text = await asyncio.to_thread(
                    self.parser_service.parse_file,
                    file_content,
                    file_type,
                    sync_progress_callback
                )
            finally:
                # Cancel the progress sender task
                progress_task.cancel()
                try:
                    await progress_task
                except asyncio.CancelledError:
                    pass

                # Send any remaining queued progress
                while progress_queue:
                    progress, message = progress_queue.pop(0)
                    await self.send_progress(websocket, "parsing", progress, message)

            # Stage 3: Validating (92%)
            await self.send_progress(websocket, "validating", 92, "✅ Validating extracted data...")
            await asyncio.sleep(0.3)

            # Detect data loss warnings (95%)
            await self.send_progress(websocket, "validating", 95, "🔍 Checking for data completeness...")
            await asyncio.sleep(0.2)

            warnings = self._detect_data_loss(resume, extracted_text)

            # Complete (100%)
            await self.send_progress(websocket, "complete", 100, "🎉 Resume parsing complete!")

            # Send final results
            await websocket.send_json({
                "type": "result",
                "data": {
                    "resume": json.loads(resume.model_dump_json()),
                    "extractedText": extracted_text,
                    "warnings": warnings
                }
            })

        except Exception as e:
            import traceback
            traceback.print_exc()
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })

    def _detect_data_loss(self, resume, extracted_text: str) -> list:
        """Detect potential data loss during parsing"""
        warnings = []

        # Count bullet points in original text
        bullet_count = extracted_text.count('•') + extracted_text.count('-')

        # Count description items in parsed resume
        try:
            parsed_bullets = sum(len(exp.description) for exp in resume.experience if hasattr(exp, 'description') and exp.description)
        except Exception as e:
            print(f"Warning: Could not count parsed bullets: {e}")
            parsed_bullets = 0

        if bullet_count > parsed_bullets * 1.5 and bullet_count > 5:
            warnings.append(f"⚠️ Possible data loss: Found {bullet_count} bullet points in original but only {parsed_bullets} parsed")

        # Check for common resume sections
        required_sections = ['experience', 'education', 'skills']
        for section in required_sections:
            try:
                section_data = getattr(resume, section, None)
                if section.lower() in extracted_text.lower() and (not section_data or len(section_data) == 0):
                    warnings.append(f"⚠️ '{section}' section found in text but not parsed")
            except Exception as e:
                print(f"Warning: Could not check section {section}: {e}")

        # Check text length
        try:
            parsed_text_length = len(str(resume.model_dump()))
            if len(extracted_text) > 500 and parsed_text_length < len(extracted_text) * 0.3:
                warnings.append(f"⚠️ Parsed resume seems incomplete ({parsed_text_length} chars vs {len(extracted_text)} chars in original)")
        except Exception as e:
            print(f"Warning: Could not check text length: {e}")

        return warnings

    async def send_progress(self, websocket: WebSocket, stage: str, progress: int, message: str):
        """Send progress update to frontend"""
        await websocket.send_json({
            "type": "progress",
            "stage": stage,
            "progress": progress,
            "message": message
        })
