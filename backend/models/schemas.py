from pydantic import BaseModel
from typing import List, Optional

class ContactInfo(BaseModel):
    name: str
    email: str
    phone: str
    location: Optional[str] = ""
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class Experience(BaseModel):
    id: str
    company: str
    position: str
    location: Optional[str] = ""
    startDate: str
    endDate: str
    description: List[str]
    highlights: Optional[List[str]] = None

class Education(BaseModel):
    id: str
    institution: str
    degree: str
    field: str
    location: Optional[str] = ""
    startDate: str
    endDate: str
    gpa: Optional[str] = None
    achievements: Optional[List[str]] = None

class Skill(BaseModel):
    category: str
    items: List[str]

class Resume(BaseModel):
    contact: ContactInfo
    summary: str
    experience: List[Experience]
    education: List[Education]
    skills: List[Skill]

class ResumeChange(BaseModel):
    section: str
    type: str  # 'added', 'modified', 'reordered'
    description: str

class OptimizedResume(Resume):
    changes: List[ResumeChange]
    matchScore: int
    matchedKeywords: List[str]

class CoverLetter(BaseModel):
    greeting: str
    opening: str
    body: List[str]
    closing: str
    signature: str

class OptimizeRequest(BaseModel):
    resume: Resume
    jobDescription: str
    jobTitle: Optional[str] = None
    company: Optional[str] = None

class OptimizeResponse(BaseModel):
    optimizedResume: OptimizedResume
    coverLetter: CoverLetter
    jobKeywords: List[str]
