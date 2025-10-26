import PyPDF2
import docx
import re
import os
import json
from openai import OpenAI
from models.schemas import Resume

class FileParserService:
    """Service to parse different file formats into Resume JSON"""

    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            self.client = OpenAI(api_key=api_key)
            self.use_ai_parsing = True
        else:
            self.client = None
            self.use_ai_parsing = False
            print("⚠️ Warning: OPENAI_API_KEY not set. Using fallback regex parsing (less reliable)")

    def parse_file(self, file_content: bytes, file_type: str) -> tuple[Resume, str]:
        """Parse file content based on file type

        Returns:
            tuple: (parsed_resume, extracted_text)
        """
        if file_type == 'application/pdf':
            text = self._parse_pdf(file_content)
        elif file_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
            text = self._parse_docx(file_content)
        elif file_type == 'text/markdown' or file_type.endswith('.md'):
            text = file_content.decode('utf-8')
        else:
            text = file_content.decode('utf-8')

        # Log extracted text for debugging
        print(f"\n{'='*80}")
        print(f"📄 EXTRACTED TEXT ({len(text)} characters):")
        print(f"{'='*80}")
        print(text[:1000])  # Print first 1000 chars
        if len(text) > 1000:
            print(f"\n... ({len(text) - 1000} more characters)")
        print(f"{'='*80}\n")

        # Use AI-powered parsing if available, otherwise fallback to regex
        if self.use_ai_parsing:
            resume = self._parse_with_ai(text)
        else:
            resume = self._parse_text_to_resume(text)

        return resume, text

    def _parse_pdf(self, content: bytes) -> str:
        """Extract text from PDF"""
        import io
        pdf_file = io.BytesIO(content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text

    def _parse_docx(self, content: bytes) -> str:
        """Extract text from DOCX"""
        import io
        docx_file = io.BytesIO(content)
        doc = docx.Document(docx_file)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text

    def _parse_with_ai(self, text: str) -> Resume:
        """Use AI (GPT-4) to intelligently parse resume text into structured JSON"""

        prompt = f"""You are an EXPERT resume parser with ZERO TOLERANCE for data loss. Your job is to extract EVERY SINGLE DETAIL from this resume with PERFECT accuracy.

📄 RESUME TEXT TO PARSE:
{text}

🚨 CRITICAL PARSING RULES - FOLLOW EXACTLY:

1. **PRESERVE EVERYTHING** - Extract 100% of the content, word-for-word
2. **NO SUMMARIZING** - Copy text exactly as written, don't paraphrase
3. **NO SKIPPING** - Every bullet point, achievement, skill must be captured
4. **NO ASSUMPTIONS** - Only extract what's actually written
5. **MAINTAIN ORDER** - Keep experiences and education in the order they appear

📋 REQUIRED JSON STRUCTURE:

{{
  "contact": {{
    "name": "EXACT full name from resume",
    "email": "EXACT email address",
    "phone": "EXACT phone number with original formatting",
    "location": "EXACT location string",
    "linkedin": "LinkedIn URL if present, else empty",
    "website": "Personal website if present, else empty"
  }},
  "summary": "COMPLETE professional summary - copy WORD FOR WORD, preserving ALL sentences and details",
  "experience": [
    {{
      "id": "exp1",
      "company": "EXACT company name",
      "position": "EXACT job title",
      "location": "EXACT location",
      "startDate": "EXACT start date in original format",
      "endDate": "EXACT end date or 'Present'",
      "description": [
        "COMPLETE first bullet - word for word, including ALL metrics and details",
        "COMPLETE second bullet - preserve ALL information exactly",
        "EVERY SINGLE BULLET POINT - no matter how many there are"
      ]
    }},
    {{
      "id": "exp2",
      "NOTE": "Include EVERY job, internship, or position mentioned"
    }}
  ],
  "education": [
    {{
      "id": "edu1",
      "institution": "EXACT school/university name",
      "degree": "EXACT degree name (e.g., Bachelor of Science, Master of Arts)",
      "field": "EXACT major/field of study",
      "location": "EXACT location if mentioned",
      "startDate": "EXACT start date",
      "endDate": "EXACT graduation date",
      "gpa": "EXACT GPA if mentioned (e.g., '3.8/4.0')",
      "achievements": ["ALL honors", "awards", "dean's list", "scholarships - copy exactly as separate items"]
    }},
    {{
      "id": "edu2",
      "NOTE": "Include EVERY degree, certification, or educational entry"
    }}
  ],
  "skills": [
    {{
      "category": "EXACT category name from resume (e.g., 'Programming Languages', 'Tools & Technologies')",
      "items": ["EVERY", "SINGLE", "SKILL", "LISTED", "in", "this", "category"]
    }},
    {{
      "category": "ANOTHER category if present",
      "items": ["ALL skills in this category too"]
    }}
  ]
}}

⚠️ VALIDATION CHECKLIST (ensure ALL are true before submitting):
□ Every bullet point from experience section is captured
□ Every skill mentioned is in the skills array
□ Every degree/certification is in education
□ All dates are preserved in original format
□ All metrics and numbers are included (e.g., "increased by 50%")
□ Complete professional summary with no sentences missing
□ Contact info is complete and accurate
□ NO information was summarized or condensed
□ NO bullet points were combined or shortened

🎯 QUALITY STANDARD:
The parsed resume should contain AT LEAST 80% of the character count of the original text. If you find yourself with a much shorter result, you're missing content - GO BACK and extract everything.

Return ONLY the valid JSON object, no additional text."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",  # Can also use "gpt-3.5-turbo" for cost savings
                messages=[
                    {"role": "system", "content": "You are an EXPERT resume parser with ZERO tolerance for data loss. You extract EVERY detail word-for-word with PERFECT accuracy. You NEVER summarize, skip content, or lose information. Always return complete, thorough JSON matching the exact schema."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.05,  # Very low temperature for maximum accuracy and consistency
                response_format={"type": "json_object"}
            )

            result = json.loads(response.choices[0].message.content)
            print(f"✅ Successfully parsed AI response")

            # Validate and ensure required fields exist
            if not result.get('contact'):
                result['contact'] = {'name': '', 'email': '', 'phone': '', 'location': ''}
            if not result.get('experience'):
                result['experience'] = []
            if not result.get('education'):
                result['education'] = []
            if not result.get('skills'):
                result['skills'] = []

            # Normalize education achievements to be a list
            print(f"🔍 Normalizing {len(result.get('education', []))} education entries...")
            for i, edu in enumerate(result.get('education', [])):
                if 'achievements' in edu:
                    print(f"   Education {i}: achievements type = {type(edu['achievements'])}")
                    if isinstance(edu['achievements'], str):
                        print(f"   Converting achievements from string to list...")
                        # Convert string to list by splitting on common delimiters
                        achievements_str = edu['achievements']
                        # Split on common delimiters: comma, semicolon, or newline
                        achievements = [a.strip() for a in achievements_str.replace(';', ',').split(',') if a.strip()]
                        edu['achievements'] = achievements if achievements else None
                        print(f"   ✅ Converted to list with {len(achievements)} items")

            # Also normalize experience achievements
            print(f"🔍 Normalizing {len(result.get('experience', []))} experience entries...")
            for i, exp in enumerate(result.get('experience', [])):
                if 'achievements' in exp and isinstance(exp['achievements'], str):
                    achievements_str = exp['achievements']
                    achievements = [a.strip() for a in achievements_str.replace(';', ',').split(',') if a.strip()]
                    exp['achievements'] = achievements if achievements else None
                    print(f"   Experience {i}: ✅ Converted achievements to list")

            print(f"✅ About to create Resume object...")
            return Resume(**result)

        except Exception as e:
            print(f"⚠️ AI parsing failed: {type(e).__name__}: {e}")
            print(f"   Falling back to regex parsing.")
            return self._parse_text_to_resume(text)

    def _parse_text_to_resume(self, text: str) -> Resume:
        """Parse text content into Resume structure"""
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        resume_data = {
            'contact': {
                'name': '',
                'email': '',
                'phone': '',
                'location': ''
            },
            'summary': '',
            'experience': [],
            'education': [],
            'skills': []
        }

        # Extract contact information
        resume_data['contact'] = self._extract_contact_info(text, lines)

        # Extract summary/objective
        resume_data['summary'] = self._extract_summary(lines)

        # Extract experience
        resume_data['experience'] = self._extract_experience(lines)

        # Extract education
        resume_data['education'] = self._extract_education(lines)

        # Extract skills
        resume_data['skills'] = self._extract_skills(lines)

        # Ensure we have at least one entry for each section
        if not resume_data['experience']:
            resume_data['experience'].append({
                'id': 'exp1',
                'company': 'Not specified',
                'position': 'Not specified',
                'location': 'Not specified',
                'startDate': 'Not specified',
                'endDate': 'Not specified',
                'description': ['No experience information found in resume']
            })

        if not resume_data['education']:
            resume_data['education'].append({
                'id': 'edu1',
                'institution': 'Not specified',
                'degree': 'Not specified',
                'field': 'Not specified',
                'location': 'Not specified',
                'startDate': 'Not specified',
                'endDate': 'Not specified'
            })

        if not resume_data['skills']:
            resume_data['skills'].append({
                'category': 'Skills',
                'items': ['No skills information found in resume']
            })

        return Resume(**resume_data)

    def _extract_contact_info(self, text: str, lines: list) -> dict:
        """Extract contact information from resume"""
        contact = {
            'name': '',
            'email': '',
            'phone': '',
            'location': ''
        }

        # Extract name (first non-empty line or line starting with #)
        for line in lines[:5]:
            if line.startswith('#'):
                contact['name'] = line.lstrip('#').strip()
                break
            elif len(line) > 3 and '@' not in line and '|' not in line and not any(c.isdigit() for c in line[:3]):
                contact['name'] = line
                break

        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            contact['email'] = email_match.group()

        # Extract phone (multiple formats)
        phone_patterns = [
            r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # (555) 123-4567 or 555-123-4567
            r'\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}',  # +1-555-123-4567
            r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}'  # 555-123-4567
        ]
        for pattern in phone_patterns:
            phone_match = re.search(pattern, text)
            if phone_match:
                contact['phone'] = phone_match.group()
                break

        # Extract location (looks for city, state patterns)
        location_keywords = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI',
                           'San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Boston',
                           'Seattle', 'Austin', 'Denver', 'Portland', 'USA', 'US']
        for line in lines[:15]:
            if any(keyword in line for keyword in location_keywords):
                # Clean up the location
                location = line.split('|')[0].strip() if '|' in line else line
                if location and len(location) < 50:  # Reasonable length for location
                    contact['location'] = location
                    break

        return contact

    def _extract_summary(self, lines: list) -> str:
        """Extract professional summary/objective"""
        summary_keywords = ['summary', 'about', 'profile', 'objective', 'professional summary']
        summary_start = -1

        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in summary_keywords):
                summary_start = i + 1
                break

        if summary_start > 0:
            summary_lines = []
            for i in range(summary_start, min(summary_start + 15, len(lines))):
                line = lines[i]
                # Stop at next section
                if any(keyword in line.lower() for keyword in ['experience', 'education', 'skills', 'projects', 'certifications']):
                    break
                if line and not line.startswith('#') and not line.startswith('-') and not line.startswith('•'):
                    summary_lines.append(line)
            return ' '.join(summary_lines)

        return ''

    def _extract_experience(self, lines: list) -> list:
        """Extract work experience"""
        experience = []
        exp_start = -1

        # Find experience section
        for i, line in enumerate(lines):
            if 'experience' in line.lower() or 'work history' in line.lower():
                exp_start = i + 1
                break

        if exp_start < 0:
            return experience

        # Find where experience section ends
        exp_end = len(lines)
        for i in range(exp_start, len(lines)):
            if any(keyword in lines[i].lower() for keyword in ['education', 'skills', 'projects', 'certifications', 'languages']):
                exp_end = i
                break

        # Parse experience entries
        current_exp = None
        for i in range(exp_start, exp_end):
            line = lines[i]

            # Check if this is a job title/company line (usually contains company name and position)
            if line and not line.startswith('-') and not line.startswith('•') and len(line) > 5:
                # Save previous experience if exists
                if current_exp and current_exp['description']:
                    experience.append(current_exp)

                # Start new experience entry
                current_exp = {
                    'id': f'exp{len(experience) + 1}',
                    'company': '',
                    'position': '',
                    'location': '',
                    'startDate': '',
                    'endDate': '',
                    'description': []
                }

                # Try to parse company and position
                if '|' in line:
                    parts = line.split('|')
                    current_exp['company'] = parts[0].strip()
                    current_exp['position'] = parts[1].strip() if len(parts) > 1 else ''
                    current_exp['location'] = parts[2].strip() if len(parts) > 2 else ''
                else:
                    # Try to extract position and company from line
                    current_exp['position'] = line
                    current_exp['company'] = 'Not specified'

            # Check if this is a date line
            elif line and any(month in line for month in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']):
                if current_exp:
                    # Parse dates
                    date_parts = line.split('-') if '-' in line else line.split('to')
                    if len(date_parts) >= 2:
                        current_exp['startDate'] = date_parts[0].strip()
                        current_exp['endDate'] = date_parts[1].strip()
                    else:
                        current_exp['startDate'] = line

            # Check if this is a description line (starts with - or •)
            elif line and (line.startswith('-') or line.startswith('•')):
                if current_exp:
                    current_exp['description'].append(line.lstrip('-•').strip())

        # Add last experience entry
        if current_exp and current_exp['description']:
            experience.append(current_exp)

        return experience

    def _extract_education(self, lines: list) -> list:
        """Extract education information"""
        education = []
        edu_start = -1

        # Find education section
        for i, line in enumerate(lines):
            if 'education' in line.lower():
                edu_start = i + 1
                break

        if edu_start < 0:
            return education

        # Find where education section ends
        edu_end = len(lines)
        for i in range(edu_start, len(lines)):
            if any(keyword in lines[i].lower() for keyword in ['skills', 'projects', 'certifications', 'languages', 'experience']):
                edu_end = i
                break

        # Parse education entries
        current_edu = None
        for i in range(edu_start, edu_end):
            line = lines[i]

            # Check if this is a degree/institution line
            if line and not line.startswith('-') and not line.startswith('•') and len(line) > 5:
                # Save previous education if exists
                if current_edu:
                    education.append(current_edu)

                # Start new education entry
                current_edu = {
                    'id': f'edu{len(education) + 1}',
                    'institution': '',
                    'degree': '',
                    'field': '',
                    'location': '',
                    'startDate': '',
                    'endDate': ''
                }

                # Try to parse institution and degree
                if '|' in line:
                    parts = line.split('|')
                    current_edu['institution'] = parts[0].strip()
                    current_edu['degree'] = parts[1].strip() if len(parts) > 1 else ''
                    current_edu['field'] = parts[2].strip() if len(parts) > 2 else ''
                else:
                    current_edu['institution'] = line
                    current_edu['degree'] = 'Not specified'

            # Check if this is a date line
            elif line and any(month in line for month in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']) or re.search(r'\d{4}', line):
                if current_edu:
                    date_parts = line.split('-') if '-' in line else line.split('to')
                    if len(date_parts) >= 2:
                        current_edu['startDate'] = date_parts[0].strip()
                        current_edu['endDate'] = date_parts[1].strip()
                    else:
                        current_edu['startDate'] = line

        # Add last education entry
        if current_edu:
            education.append(current_edu)

        return education

    def _extract_skills(self, lines: list) -> list:
        """Extract skills information"""
        skills = []
        skills_start = -1

        # Find skills section
        for i, line in enumerate(lines):
            if 'skills' in line.lower() or 'technical skills' in line.lower():
                skills_start = i + 1
                break

        if skills_start < 0:
            return skills

        # Find where skills section ends
        skills_end = len(lines)
        for i in range(skills_start, len(lines)):
            if any(keyword in lines[i].lower() for keyword in ['experience', 'education', 'projects', 'certifications', 'languages']):
                skills_end = i
                break

        # Parse skills
        current_category = 'Skills'
        current_items = []

        for i in range(skills_start, skills_end):
            line = lines[i]

            # Check if this is a category line (usually ends with : or is a header)
            if line.endswith(':') or (line and not line.startswith('-') and not line.startswith('•') and len(line) > 3 and len(line) < 50):
                # Save previous category if exists
                if current_items:
                    skills.append({
                        'category': current_category,
                        'items': current_items
                    })
                    current_items = []

                current_category = line.rstrip(':').strip()

            # Check if this is a skill item (starts with - or •)
            elif line and (line.startswith('-') or line.startswith('•')):
                skill_item = line.lstrip('-•').strip()
                if skill_item:
                    current_items.append(skill_item)

            # Also handle comma-separated skills
            elif line and ',' in line and not line.startswith('#'):
                skill_items = [s.strip() for s in line.split(',') if s.strip()]
                current_items.extend(skill_items)

        # Add last category
        if current_items:
            skills.append({
                'category': current_category,
                'items': current_items
            })

        return skills
