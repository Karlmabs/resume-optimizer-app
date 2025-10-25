from fastapi import APIRouter, UploadFile, File, HTTPException
from services.parser_service import FileParserService
from services.ai_service import AIService
from models.schemas import OptimizeRequest, OptimizeResponse

router = APIRouter()

# Initialize services (these will be created once when the module loads)
parser_service = FileParserService()
ai_service = AIService()

@router.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """Parse uploaded resume file into JSON"""
    try:
        content = await file.read()
        content_type = file.content_type

        resume = parser_service.parse_file(content, content_type)

        return {"resume": resume.model_dump()}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse resume: {str(e)}")

@router.post("/api/optimize", response_model=OptimizeResponse)
async def optimize_resume(request: OptimizeRequest):
    """Optimize resume (non-WebSocket version for fallback)"""
    try:
        optimized_resume, keywords = await ai_service.optimize_resume(
            request.resume,
            request.jobDescription
        )

        cover_letter = await ai_service.generate_cover_letter(
            request.resume,
            request.jobDescription,
            request.jobTitle or "the position",
            request.company or "your company"
        )

        return OptimizeResponse(
            optimizedResume=optimized_resume,
            coverLetter=cover_letter,
            jobKeywords=keywords
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

@router.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "resume-optimizer-api"}
