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

        prompt = f"""You are an AGGRESSIVE resume transformation expert. Your goal is to transform this resume to make the candidate appear as the PERFECT match for the job, even if their background isn't a perfect fit originally.

🎯 TARGET JOB DESCRIPTION:
{job_description}

📄 CURRENT RESUME:
{resume_json}

🚀 TRANSFORMATION INSTRUCTIONS (BE VERY AGGRESSIVE):

1. **SUMMARY - COMPLETE REWRITE**:
   - Write a compelling summary that mirrors the job requirements EXACTLY
   - Use keywords from the job description heavily
   - Position the candidate as an expert in what the job needs
   - Make it sound like this job was made for them

2. **SKILLS - ADD WHAT'S MISSING**:
   - Extract ALL technical skills, tools, frameworks, and methodologies from the job description
   - ADD these skills to the resume even if they're not currently listed
   - Reorganize skills to put job-relevant ones FIRST
   - Create skill categories that match the job requirements
   - Include specific versions, certifications, or proficiency levels mentioned in the job
   - If the job mentions "AWS, Docker, Kubernetes" - ADD THEM to skills
   - If the job mentions "Agile, Scrum, CI/CD" - ADD THEM to skills
   - Be comprehensive - add everything the job asks for

3. **EXPERIENCE - AGGRESSIVE REWRITING**:
   - REWRITE each experience bullet to highlight aspects relevant to this job
   - ADD quantified achievements (percentages, numbers, metrics) that sound impressive
   - Use action verbs that match the job description (led, architected, optimized, implemented, etc.)
   - Emphasize technologies and methodologies mentioned in the job
   - If the job needs "Python", make sure Python is mentioned in multiple experience bullets
   - If the job needs "team leadership", add bullets about leading teams/projects
   - Transform generic bullets into specific, impressive achievements
   - Example transformation:
     - Before: "Worked on web applications"
     - After: "Architected and deployed scalable microservices handling 50K+ daily users, reducing response time by 40% using Docker and Kubernetes"

4. **EDUCATION - ENHANCE IF NEEDED**:
   - Highlight relevant coursework matching the job
   - Add relevant projects or thesis topics
   - Mention honors or achievements if applicable

5. **KEYWORD OPTIMIZATION FOR ATS**:
   - Ensure EVERY major keyword from the job description appears in the resume
   - Use exact phrases from the job description when possible
   - Include acronyms AND full terms (e.g., "CI/CD (Continuous Integration/Continuous Deployment)")

6. **MAKE THE MATCH SCORE HIGH**:
   - Your goal is to achieve a match score of 90-100%
   - This resume should look like it was written FOR this specific job

⚠️ IMPORTANT RULES:
- Keep the same employment timeline (dates, companies, positions)
- Keep the education institutions and degrees
- Don't fabricate entire new jobs or degrees
- BUT you CAN and SHOULD:
  ✓ ADD skills from the job description
  ✓ REWRITE experience bullets to emphasize relevant work
  ✓ ADD quantified achievements and metrics
  ✓ TRANSFORM how experiences are described
  ✓ Make the candidate sound like an expert in what the job needs

🚨 CRITICAL - YOU MUST RETURN THESE FIELDS:
- "matchScore": Calculate a realistic match percentage (0-100) based on how well the optimized resume matches the job
- "matchedKeywords": Extract ALL important keywords from the job description that now appear in the optimized resume (minimum 10 keywords)

Return ONLY valid JSON with ALL required fields:
{{
  "optimizedResume": {{
    "contact": {{...}},
    "summary": "COMPLETELY rewritten summary...",
    "experience": [
      {{
        "id": "exp1",
        "company": "Same company name",
        "position": "Same position",
        "location": "...",
        "startDate": "Same dates",
        "endDate": "Same dates",
        "description": [
          "COMPLETELY REWRITTEN bullet with job-relevant keywords and metrics",
          "Another TRANSFORMED bullet emphasizing what the job needs",
          "New bullet highlighting relevant technologies from job description"
        ]
      }}
    ],
    "education": [...],
    "skills": [
      {{
        "category": "Technical Skills (or category matching job)",
        "items": ["EXPANDED list including ALL skills from job description"]
      }}
    ]
  }},
  "changes": [
    {{"section": "Summary", "type": "modified", "description": "Completely rewritten to mirror job requirements"}},
    {{"section": "Skills", "type": "added", "description": "Added [list specific skills] to match job requirements"}},
    {{"section": "Experience", "type": "modified", "description": "Transformed all bullets to emphasize [relevant aspects]"}},
    ...
  ],
  "matchedKeywords": ["REQUIRED: Python", "JavaScript", "React", "AWS", "Docker", "Leadership", "etc - minimum 10 keywords"],
  "matchScore": 95
}}

🎯 GOAL: Transform this resume to make the candidate appear as the PERFECT, IDEAL candidate for this exact job. Be aggressive. Be bold. Make them stand out."""

        if progress_callback:
            await progress_callback(72, "Analyzing resume structure and job requirements...")

        # Call OpenAI API (this is the long operation)
        if progress_callback:
            await progress_callback(75, "🤖 AI is analyzing your experience and skills...")

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an AGGRESSIVE resume transformation expert who rewrites resumes to make candidates appear as perfect matches for jobs. You add relevant skills, rewrite experience bullets with impressive metrics, and optimize for ATS systems. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,  # Higher temperature for more creative/aggressive transformations
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

        # Extract keywords from job description (only used as backup if AI completely fails)
        keywords = result.get('matchedKeywords', [])

        # Build OptimizedResume with AI-computed values
        optimized_resume = OptimizedResume(
            **result['optimizedResume'],
            changes=[ResumeChange(**change) for change in result.get('changes', [])],
            matchScore=result['matchScore'],  # No fallback - AI MUST provide this
            matchedKeywords=result['matchedKeywords']  # No fallback - AI MUST provide this
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

        prompt = f"""You are an EXPERT cover letter writer specializing in creating COMPELLING, PERSUASIVE cover letters that make candidates irresistible to employers.

🎯 TARGET POSITION:
Job Title: {job_title}
Company: {company}

📋 JOB DESCRIPTION:
{job_description}

👤 CANDIDATE'S OPTIMIZED RESUME (already tailored for this job):
{resume_json}

✍️ COVER LETTER REQUIREMENTS:

Write a POWERFUL cover letter that makes the hiring manager excited to interview this candidate. Be CONFIDENT and COMPELLING.

**OPENING PARAGRAPH (Hook them immediately):**
- Start with something that grabs attention (impressive achievement, passion for their mission, or bold statement)
- Make them WANT to keep reading
- Show you know about the company and role
- Position yourself as the solution to their needs
- Example: "When I successfully architected a microservices platform that reduced deployment time by 75% and saved $2M annually, I realized my passion lies in solving exactly the kind of challenges your team faces at {company}."

**BODY PARAGRAPHS (2-3 paragraphs - Make them see you're perfect):**

Paragraph 1 - Technical Excellence:
- Highlight 2-3 specific achievements from the resume that directly match job requirements
- Use METRICS and NUMBERS from the resume (percentages, dollar amounts, scale)
- Show you have the exact skills they need
- Use confident language: "I have proven expertise in...", "I have successfully...", "My track record includes..."

Paragraph 2 - Perfect Fit:
- Explain WHY you're perfect for THIS specific role at THIS company
- Show you understand their challenges and have solved similar problems
- Reference specific technologies/methodologies they mentioned
- Demonstrate cultural fit and enthusiasm

Paragraph 3 (Optional) - Value Proposition:
- What unique value will you bring?
- How will you make an impact in the first 90 days?
- Show vision and initiative

**CLOSING PARAGRAPH (Strong call to action):**
- Express strong interest in discussing how you can contribute
- Mention you're excited about specific aspects of the role
- Confident but not arrogant
- Clear call to action: "I would welcome the opportunity to discuss..."

📏 LENGTH: 3-4 paragraphs total (not including greeting/signature)

🎨 TONE:
- Confident and compelling, NOT humble or tentative
- Professional but enthusiastic
- Show personality while staying professional
- Use active voice and strong action verbs

⚠️ IMPORTANT:
- Reference SPECIFIC achievements from the resume (with metrics!)
- Mirror keywords from the job description naturally
- Make it feel personal to this company and role, not generic
- Show passion and genuine interest
- Make the hiring manager think "We NEED to interview this person!"

Return ONLY valid JSON:
{{
  "greeting": "Dear Hiring Manager," (or specific name if in job description),
  "opening": "Attention-grabbing opening paragraph that hooks the reader...",
  "body": [
    "Body paragraph 1: Technical excellence with specific achievements and metrics from resume...",
    "Body paragraph 2: Perfect fit - why you're ideal for THIS role at THIS company...",
    "Body paragraph 3 (optional): Additional value proposition or unique angle..."
  ],
  "closing": "Strong closing with clear call to action and enthusiasm...",
  "signature": "Sincerely,\\n{resume.contact.name}"
}}

🎯 GOAL: Write a cover letter so compelling that the hiring manager immediately wants to interview this candidate. Make them feel like they'd be crazy NOT to hire this person!"""

        if progress_callback:
            await progress_callback(88, "🤖 AI is crafting your compelling cover letter...")

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a master cover letter writer who creates COMPELLING, PERSUASIVE letters that make candidates irresistible. You write with confidence, use specific metrics, and create excitement. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.85,  # Slightly higher for more creative, compelling writing
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
