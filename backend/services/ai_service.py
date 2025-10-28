import os
import json
import re
from openai import OpenAI
from typing import Tuple, List
from models.schemas import Resume, OptimizedResume, CoverLetter, ResumeChange

class AIService:
    """Service for AI-powered resume optimization using OpenAI"""

    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-4-turbo-preview"  # or "gpt-3.5-turbo" for faster/cheaper

    async def optimize_resume(self, resume: Resume, job_description: str, progress_callback=None) -> Tuple[OptimizedResume, List[str]]:
        """Aggressively optimize and transform resume to match job description perfectly

        Args:
            resume: The original resume to optimize
            job_description: The target job description
            progress_callback: Optional async function to call with (progress%, message) for real-time updates
        """

        resume_json = resume.model_dump_json(indent=2)

        # Send initial progress
        if progress_callback:
            await progress_callback(70, "Preparing AI optimization prompt...")

        prompt = f"""You are an ETHICAL resume optimization expert. Your goal is to help the candidate present their ACTUAL experience and skills in the most professional and compelling way, while maintaining complete honesty.

🎯 TARGET JOB DESCRIPTION:
{job_description}

📄 CURRENT RESUME:
{resume_json}

📋 ETHICAL OPTIMIZATION INSTRUCTIONS:

1. **SUMMARY - PROFESSIONAL REWRITE**:
   - Rewrite the summary to emphasize aspects of their experience relevant to this role
   - Use professional language and keywords from the job description
   - Focus on ACTUAL strengths and achievements
   - Be compelling but truthful

2. **SKILLS - ARTICULATE WHAT THEY HAVE**:
   - Review their experience descriptions to identify IMPLIED technical skills they've actually used
   - Example: If they mention "deployed services with Docker", then Docker is a legitimate skill
   - Reorganize skills to prioritize those relevant to the job
   - Use industry-standard terminology for technologies they've worked with
   - Create skill categories that make sense for their background
   - **CRITICAL**: Only include skills that can be reasonably inferred from their actual work experience
   - **NEVER**: Add skills not evidenced in their resume

3. **EXPERIENCE - PROFESSIONAL ENHANCEMENT**:
   - Rewrite bullets to emphasize job-relevant aspects of their ACTUAL work
   - Use strong action verbs (led, implemented, optimized, developed, etc.)
   - If they mention results, help quantify them REALISTICALLY based on context clues
   - Highlight technologies and methodologies relevant to the target job
   - Make connections between their past work and job requirements
   - Example transformation:
     - Before: "Worked on web applications"
     - After (if evidenced): "Developed and maintained web applications using [technologies actually mentioned]"
     - NOT: "Architected microservices handling 50K users" (unless there's evidence of this scale/role)

4. **EDUCATION - RELEVANT EMPHASIS**:
   - Highlight coursework, projects, or achievements relevant to the job
   - Keep all information factual and verifiable

5. **SKILL GAP ANALYSIS**:
   - Identify critical skills required by the job that are NOT present in the resume
   - Categorize gaps by importance: critical, important, nice-to-have
   - Suggest learning paths for each gap (courses, certifications, resources)
   - Estimate realistic time to acquire each skill

6. **HONEST MATCH SCORING**:
   - Calculate a REALISTIC match percentage based on actual skill overlap
   - Do NOT inflate the score
   - Scores of 60-75% are perfectly acceptable and honest
   - Calculate a "potential score" showing what they could achieve after addressing gaps

⚠️ ETHICAL REQUIREMENTS:
- Maintain complete factual accuracy
- Only include skills they've demonstrably used
- Don't fabricate achievements or metrics
- Don't add technologies they haven't worked with
- Keep employment timeline, companies, positions exactly as provided
- Keep education exactly as provided
- Be honest about match score even if it's lower

🎯 CONFIDENCE LEVELS FOR CHANGES:
Mark each change with appropriate confidence:
- "verified": Based directly on resume content (rephrasing, reorganizing)
- "inferred": Reasonably implied from their work (e.g., if they deployed Docker containers, Docker is a skill)
- "suggested": NOT used for optimization - only for skillGaps section

🚨 REQUIRED RESPONSE FIELDS:
Return ONLY valid JSON with ALL required fields:
{{
  "optimizedResume": {{
    "contact": {{...same as original...}},
    "summary": "Professionally rewritten summary emphasizing relevant actual experience...",
    "experience": [
      {{
        "id": "exp1",
        "company": "Same company name",
        "position": "Same position",
        "location": "Same location",
        "startDate": "Same dates",
        "endDate": "Same dates",
        "description": [
          "Professionally rewritten bullet based on their actual work",
          "Another enhanced bullet highlighting relevant actual achievements",
          "Focus on what they REALLY did, using better terminology"
        ]
      }}
    ],
    "education": [...same as original...],
    "skills": [
      {{
        "category": "Technical Skills",
        "items": ["Only skills they've actually used, reorganized for relevance"]
      }}
    ]
  }},
  "changes": [
    {{"section": "Summary", "type": "modified", "description": "Rewritten to emphasize [specific relevant aspects]", "confidence": "verified"}},
    {{"section": "Skills", "type": "modified", "description": "Added [skill] based on work with [specific project/technology mentioned]", "confidence": "inferred"}},
    {{"section": "Experience", "type": "modified", "description": "Enhanced bullets to highlight [specific relevant work]", "confidence": "verified"}},
    ...
  ],
  "matchedKeywords": ["All keywords from job that genuinely appear in their experience"],
  "matchScore": 72,  // HONEST score - don't inflate!
  "potentialScore": 88,  // What they could achieve after learning skill gaps
  "skillGaps": [
    {{
      "skill": "Kubernetes",
      "importance": "critical",
      "learningPath": "Complete 'Kubernetes for Developers' course on Udemy or Linux Foundation CKA certification. Practice with minikube locally.",
      "estimatedTime": "4-6 weeks with dedicated practice"
    }},
    {{
      "skill": "GraphQL",
      "importance": "important",
      "learningPath": "Complete GraphQL documentation and build a sample project. 'How to GraphQL' tutorial is excellent.",
      "estimatedTime": "2-3 weeks"
    }},
    ...
  ]
}}

🎯 GOAL: Help the candidate present their best authentic self. Optimize presentation while maintaining complete honesty. Provide a realistic path to becoming a stronger candidate."""

        if progress_callback:
            await progress_callback(72, "Analyzing resume structure and job requirements...")

        # Call OpenAI API (this is the long operation)
        if progress_callback:
            await progress_callback(75, "🤖 AI is analyzing your experience and skills...")

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an ETHICAL resume optimization expert who helps candidates present their actual experience professionally. You NEVER fabricate skills or achievements. You focus on articulating what they've genuinely done using professional language. You provide honest match scores and helpful skill gap analysis. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Lower temperature for more conservative, factual optimization
            response_format={"type": "json_object"}
        )

        if progress_callback:
            await progress_callback(82, "AI has finished! Parsing optimized resume...")

        result = json.loads(response.choices[0].message.content)

        # Validate that AI provided required fields
        if 'matchScore' not in result:
            raise ValueError("AI response missing matchScore - this is required for accurate matching")

        if 'matchedKeywords' not in result or not result.get('matchedKeywords'):
            raise ValueError("AI response missing matchedKeywords - this is required for keyword analysis")

        # Extract keywords from job description
        keywords = result.get('matchedKeywords', [])

        # Ensure skillGaps defaults to empty list if not provided
        skill_gaps = result.get('skillGaps', [])
        potential_score = result.get('potentialScore', None)

        # Build OptimizedResume with AI-computed values
        from models.schemas import SkillGap

        optimized_resume = OptimizedResume(
            **result['optimizedResume'],
            changes=[ResumeChange(**change) for change in result.get('changes', [])],
            matchScore=result['matchScore'],
            matchedKeywords=result['matchedKeywords'],
            skillGaps=[SkillGap(**gap) for gap in skill_gaps] if skill_gaps else [],
            potentialScore=potential_score
        )

        return optimized_resume, keywords

    async def generate_cover_letter(
        self,
        resume: Resume,  # This will be the OPTIMIZED resume now
        job_description: str,
        job_title: str = "the position",
        company: str = "your company",
        progress_callback=None
    ) -> CoverLetter:
        """Generate a compelling, persuasive cover letter based on the OPTIMIZED resume

        Args:
            resume: The optimized resume
            job_description: The target job description
            job_title: The job title
            company: The company name
            progress_callback: Optional async function for progress updates
        """

        resume_json = resume.model_dump_json(indent=2)

        if progress_callback:
            await progress_callback(85, "Preparing cover letter prompt...")

        prompt = f"""You are a professional cover letter writer who helps candidates create honest, compelling cover letters based on their actual experience and qualifications.

🎯 TARGET POSITION:
Job Title: {job_title}
Company: {company}

📋 JOB DESCRIPTION:
{job_description}

👤 CANDIDATE'S OPTIMIZED RESUME:
{resume_json}

✍️ COVER LETTER REQUIREMENTS:

Write a professional, genuine cover letter that authentically represents the candidate's experience and interest in the role.

**OPENING PARAGRAPH (Professional Introduction):**
- Express genuine interest in the role and company
- Briefly introduce your relevant background
- Make a clear connection between your experience and the role
- Be authentic and professional, not overly bold

**BODY PARAGRAPHS (2-3 paragraphs - Show Relevant Experience):**

Paragraph 1 - Relevant Experience & Skills:
- Highlight 2-3 specific, REAL achievements from the resume that match job requirements
- Reference actual technologies and methodologies from their experience
- Use professional language: "In my experience as...", "I have developed skills in...", "At [Company], I..."
- Only mention metrics that appear in the resume

Paragraph 2 - Job Alignment:
- Explain why you're interested in THIS specific role at THIS company
- Connect your actual experience to the job requirements
- Show you understand what they're looking for
- Be genuine about your interest and fit

Paragraph 3 (Optional) - Growth & Contribution:
- Express willingness to learn and grow in areas where you may have gaps
- Mention how you can contribute based on your actual strengths
- Show enthusiasm for the opportunity

**CLOSING PARAGRAPH (Professional Close):**
- Express interest in discussing the opportunity further
- Mention availability for an interview
- Thank them for their consideration
- Professional and courteous tone

📏 LENGTH: 3-4 paragraphs total (not including greeting/signature)

🎨 TONE:
- Professional and genuine
- Confident but humble
- Enthusiastic without being over-the-top
- Honest about fit and interest
- Use clear, straightforward language

⚠️ CRITICAL REQUIREMENTS:
- Only reference achievements that are actually in the resume
- Don't exaggerate or embellish their experience
- Be honest about skills and experience level
- Make connections based on real work they've done
- Don't claim expertise they don't have
- Keep it genuine and professional

Return ONLY valid JSON:
{{
  "greeting": "Dear Hiring Manager," (or specific name if in job description),
  "opening": "Professional opening expressing genuine interest and relevant background...",
  "body": [
    "Body paragraph 1: Specific real achievements from resume relevant to the role...",
    "Body paragraph 2: Genuine explanation of why this role interests them and how their experience aligns...",
    "Body paragraph 3 (optional): Contribution they can make and willingness to grow..."
  ],
  "closing": "Professional closing expressing interest in further discussion...",
  "signature": "Sincerely,\\n{resume.contact.name}"
}}

🎯 GOAL: Write an honest, professional cover letter that accurately represents the candidate's qualifications and genuine interest in the role."""

        if progress_callback:
            await progress_callback(88, "🤖 AI is crafting your compelling cover letter...")

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a professional cover letter writer who creates honest, well-written cover letters based on candidates' actual experience. You NEVER exaggerate or fabricate achievements. You write genuinely and professionally. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,  # Moderate temperature for professional, grounded writing
            response_format={"type": "json_object"}
        )

        if progress_callback:
            await progress_callback(95, "Cover letter generated! Finalizing...")

        result = json.loads(response.choices[0].message.content)

        return CoverLetter(**result)

    def _extract_keywords(self, job_description: str) -> List[str]:
        """Extract key technical and professional keywords from job description"""
        # Common technical and professional terms
        keywords = []

        # Extract capitalized words and acronyms (likely technologies/skills)
        pattern = r'\b[A-Z][A-Za-z0-9+#.]{1,15}\b'
        matches = re.findall(pattern, job_description)
        keywords.extend(matches)

        # Common job-related keywords
        common_keywords = [
            'experience', 'development', 'engineering', 'management',
            'leadership', 'agile', 'scrum', 'CI/CD', 'testing',
            'architecture', 'design', 'implementation', 'optimization'
        ]

        for keyword in common_keywords:
            if keyword.lower() in job_description.lower():
                keywords.append(keyword.capitalize())

        # Remove duplicates and return unique keywords
        return list(dict.fromkeys(keywords))[:20]
