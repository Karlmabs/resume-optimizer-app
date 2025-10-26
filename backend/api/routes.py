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

        resume, extracted_text = parser_service.parse_file(content, content_type)

        return {
            "resume": resume.model_dump(),
            "extractedText": extracted_text,
            "warnings": _detect_data_loss(resume, extracted_text)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse resume: {str(e)}")

def _detect_data_loss(resume, extracted_text: str) -> list[str]:
    """Detect potential data loss during parsing"""
    warnings = []

    # Count bullet points in original text
    bullet_count = extracted_text.count('•') + extracted_text.count('-')

    # Count description items in parsed resume (use attribute access for Pydantic models)
    try:
        parsed_bullets = sum(len(exp.description) for exp in resume.experience if hasattr(exp, 'description') and exp.description)
    except Exception as e:
        print(f"Warning: Could not count parsed bullets: {e}")
        parsed_bullets = 0

    if bullet_count > parsed_bullets * 1.5 and bullet_count > 5:
        warnings.append(f"⚠️ Possible data loss: Found {bullet_count} bullet points in original but only {parsed_bullets} parsed")

    # Check for common resume sections (use attribute access)
    required_sections = ['experience', 'education', 'skills']
    for section in required_sections:
        try:
            section_data = getattr(resume, section, None)
            if section.lower() in extracted_text.lower() and (not section_data or len(section_data) == 0):
                warnings.append(f"⚠️ '{section}' section found in text but not parsed")
        except Exception as e:
            print(f"Warning: Could not check section {section}: {e}")

    # Check text length - if parsed resume is very short compared to original
    try:
        parsed_text_length = len(str(resume.model_dump()))
        if len(extracted_text) > 500 and parsed_text_length < len(extracted_text) * 0.3:
            warnings.append(f"⚠️ Parsed resume seems incomplete ({parsed_text_length} chars vs {len(extracted_text)} chars in original)")
    except Exception as e:
        print(f"Warning: Could not check text length: {e}")

    return warnings

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
