# AI-Powered Resume Optimizer

A beautiful, full-stack web application that intelligently parses, reviews, and optimizes resumes using OpenAI GPT-4, with personalized cover letter generation. Features real-time WebSocket updates, a comprehensive resume builder, and an intuitive multi-step workflow.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Python](https://img.shields.io/badge/Python-3.9+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Resume Parsing**: GPT-4 intelligently extracts information from PDF/DOCX resumes in ANY format
- **Interactive Resume Builder**: Build resumes from scratch with a guided 5-step process (Contact → Summary → Experience → Education → Skills)
- **Resume Review & Editing**: Verify and edit parsed resume data before optimization
- **Job-Targeted Optimization**: AI enhances your resume based on specific job descriptions
- **Live WebSocket Updates**: Real-time progress streaming during optimization process
- **AI Cover Letter Generation**: Personalized cover letters tailored to each job posting
- **Keyword Matching**: Automatic keyword extraction and resume-job alignment scoring
- **Change Summary**: Detailed breakdown of AI-made optimizations
- **Multiple Export Formats**: Download optimized resumes as Markdown or plain text

### 🎨 User Experience
- **Multi-Step Workflow**: Intuitive flow from upload → review → job description → optimization → results
- **Typewriter Effects**: Smooth character-by-character content reveal for results
- **Progress Tracking**: Beautiful loading animations with real-time stage updates
- **Toast Notifications**: Instant feedback for all user actions
- **Glassmorphism UI**: Modern frosted-glass design with gradient animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Professional dark interface with violet/purple gradient accents
- **Auto-Save**: Resume builder automatically saves progress to localStorage

### 🏗️ Architecture
- **Frontend**: Next.js 16 App Router with Server and Client Components
- **Backend**: FastAPI with async Python and WebSocket support
- **AI Engine**: OpenAI GPT-4 for parsing, optimization, and generation
- **Real-Time**: WebSocket bidirectional communication for live updates
- **File Processing**: PDF (PyPDF2) and DOCX (python-docx) parsing
- **Type Safety**: Full TypeScript coverage with Pydantic validation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion 12.x
- **Icons**: Lucide React 0.548
- **Notifications**: React Hot Toast 2.6
- **WebSocket Client**: Native WebSocket API

### Backend
- **Framework**: FastAPI 0.109 (Python 3.9+)
- **AI Integration**: OpenAI API (GPT-4)
- **WebSocket Server**: FastAPI WebSockets + websockets 12.0
- **File Parsing**: PyPDF2 3.0, python-docx 1.1
- **Data Validation**: Pydantic 2.5
- **Markdown**: markdown 3.5
- **ASGI Server**: Uvicorn (with standard extras)
- **Environment**: python-dotenv 1.0

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.9 or higher
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd resume-optimizer-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Configure Backend

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=8000
HOST=0.0.0.0
ENV=development
```

**Get an OpenAI API Key:**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy and paste it in your `.env` file

### 3. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
python main.py
```
Backend runs on `http://localhost:8000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

### 4. Use the Application

1. Open `http://localhost:3000` in your browser
2. Choose one of two options:
   - **Upload existing resume** (PDF/DOCX) → AI parses it
   - **Build from scratch** → Use the 5-step builder
3. Review and edit the parsed/built resume
4. Enter the job description for the target position
5. Watch real-time AI optimization with progress updates
6. View optimized resume, cover letter, and keyword match score
7. Download results in your preferred format

## 📖 How It Works

### Complete User Journey

#### Path 1: Upload Existing Resume

1. **Landing Page**: Upload your resume (PDF or DOCX format)
2. **AI Parsing**: Backend uses GPT-4 to intelligently extract all information
3. **Review Screen**: Verify parsed data - name, contact, experience, education, skills
4. **Edit (Optional)**: Make corrections or additions to parsed data
5. **Job Description**: Enter the target job posting details
6. **AI Optimization**: Real-time WebSocket progress as AI:
   - Analyzes resume content and job requirements
   - Extracts keywords from job description
   - Optimizes resume bullet points and language
   - Generates a tailored cover letter
7. **Results Page**: View side-by-side comparison, changes summary, and download options

#### Path 2: Build from Scratch

1. **Landing Page**: Click "Build one from scratch"
2. **Step-by-Step Builder**:
   - **Step 1**: Contact Information (name, email, phone, location, links)
   - **Step 2**: Professional Summary (50+ characters required)
   - **Step 3**: Work Experience (add multiple positions)
   - **Step 4**: Education (add degrees and certifications)
   - **Step 5**: Skills (organize by categories)
3. **Auto-Save**: Progress saved to localStorage automatically
4. **Review Screen**: Final review of built resume
5. Continue to optimization flow (same as Path 1, steps 5-7)

### WebSocket Real-Time Communication

The app uses WebSocket for live progress updates:

```
Client → Server: { type: "optimize", resume: {...}, jobDescription: "..." }
Server → Client: { type: "progress", progress: 25, message: "Analyzing resume..." }
Server → Client: { type: "progress", progress: 50, message: "Extracting keywords..." }
Server → Client: { type: "progress", progress: 75, message: "Optimizing content..." }
Server → Client: { type: "progress", progress: 100, message: "Generating cover letter..." }
Server → Client: { type: "result", data: { optimizedResume, coverLetter, keywords } }
```

## 📁 Project Structure

```
resume-optimizer-app/
├── app/                              # Next.js 16 App Router
│   ├── globals.css                   # Global styles + Tailwind config
│   ├── layout.tsx                    # Root layout with Toast provider
│   └── page.tsx                      # Main orchestration & state management
│
├── src/
│   ├── components/                   # React components
│   │   ├── LandingPage.tsx          # Upload or build from scratch
│   │   ├── FileUpload.tsx           # Drag-and-drop file uploader
│   │   ├── ResumeBuilder.tsx        # Multi-step resume builder
│   │   ├── ResumeBuilderSteps/      # Builder step components
│   │   │   ├── ContactInfoStep.tsx
│   │   │   ├── SummaryStep.tsx
│   │   │   ├── ExperienceStep.tsx
│   │   │   ├── EducationStep.tsx
│   │   │   └── SkillsStep.tsx
│   │   ├── ResumeReview.tsx         # Review/edit parsed resume
│   │   ├── JobDescriptionScreen.tsx # Job description input
│   │   ├── ProcessingAnimation.tsx  # Loading with progress bar
│   │   ├── ResultsPage.tsx          # Optimized results display
│   │   ├── ResumeDisplay.tsx        # Resume with typewriter effect
│   │   ├── CoverLetterDisplay.tsx   # Cover letter display
│   │   ├── ChangesSummary.tsx       # AI changes breakdown
│   │   └── KeywordMatch.tsx         # Keyword matching visualization
│   │
│   ├── services/
│   │   └── websocketService.ts      # WebSocket client manager
│   │
│   ├── hooks/
│   │   └── useTypewriter.ts         # Typewriter animation hook
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   │
│   ├── utils/
│   │   ├── downloadUtils.ts         # Download & clipboard
│   │   ├── markdownParser.ts        # Markdown parsing
│   │   ├── markdownGenerator.ts     # Resume → Markdown conversion
│   │   └── resumeValidation.ts      # Resume validation logic
│   │
│   └── data/                         # Sample/fallback data
│       ├── sampleResume.ts
│       ├── sampleJobDescription.ts
│       ├── sampleOptimizedResume.ts
│       └── sampleCoverLetter.ts
│
├── backend/                          # Python FastAPI backend
│   ├── main.py                       # FastAPI app entry point
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Environment variables (create this)
│   ├── .env.example                  # Environment template
│   │
│   ├── api/
│   │   ├── routes.py                # REST API endpoints
│   │   └── websocket.py             # WebSocket handlers
│   │
│   ├── services/
│   │   ├── ai_service.py            # OpenAI GPT-4 integration
│   │   └── parser_service.py        # PDF/DOCX file parsing
│   │
│   ├── models/
│   │   └── schemas.py               # Pydantic models
│   │
│   └── utils/                        # Backend utilities
│
└── public/                           # Static assets
```

## 🎨 Key Components

### Frontend Components

- **LandingPage**: Entry point with upload and "build from scratch" options
- **ResumeBuilder**: 5-step guided builder with progress tracking and validation
- **ResumeReview**: Interactive review screen with inline editing
- **JobDescriptionScreen**: Job details input with smart parsing
- **ProcessingAnimation**: Animated progress with stage descriptions
- **ResultsPage**: Tabbed interface showing results and analysis
- **ResumeDisplay**: Markdown rendering with typewriter animation
- **ChangesSummary**: Detailed breakdown of AI optimizations

### Backend Services

- **ai_service.py**: OpenAI GPT-4 integration for parsing and optimization
- **parser_service.py**: File parsing (PDF/DOCX) with fallback regex parser
- **websocket.py**: Real-time WebSocket communication handler
- **routes.py**: REST API endpoints for parsing and health checks

## 🎛️ Configuration & Customization

### Environment Variables

**Frontend** (create `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```env
OPENAI_API_KEY=sk-your-key-here
PORT=8000
HOST=0.0.0.0
ENV=development
```

### Customizing the UI

**Colors** - Edit `app/globals.css`:
```css
/* Gradient colors */
--gradient-start: #8b5cf6;  /* Violet */
--gradient-end: #ec4899;     /* Pink */
```

**Typewriter Speed** - Edit `src/hooks/useTypewriter.ts`:
```typescript
const speed = 20; // milliseconds per character (lower = faster)
```

**Builder Validation** - Edit validation rules in `src/components/ResumeBuilder.tsx`:
```typescript
case 2: // Summary step
  return formData.summary && formData.summary.length >= 50;
```

## 🚢 Production Deployment

### Build the Frontend

```bash
# Create production build
npm run build

# Start production server
npm run start
```

The optimized build will be in `.next/` folder.

### Deploy Backend

**Option 1: Traditional Server**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Option 2: Docker**
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "main.py"]
```

Build and run:
```bash
cd backend
docker build -t resume-optimizer-backend .
docker run -p 8000:8000 --env-file .env resume-optimizer-backend
```

**Option 3: Cloud Platforms**
- **Vercel** (Frontend): `vercel deploy`
- **Render** (Backend): Connect GitHub repo, add env vars
- **Railway** (Backend): `railway up` from backend directory

## 🔌 API Reference

### REST Endpoints

**`POST /api/parse-resume`**
- Upload resume file (PDF/DOCX)
- Returns: Parsed `Resume` object with warnings
- Headers: `multipart/form-data`

**`POST /api/optimize`**
- Optimize resume (non-WebSocket fallback)
- Body: `{ resume: Resume, jobDescription: string }`
- Returns: `{ optimizedResume, coverLetter, jobKeywords }`

**`GET /api/health`**
- Health check endpoint
- Returns: `{ status: "healthy" }`

### WebSocket

**`WS /ws/optimize`**
- Real-time optimization with progress updates
- Send: `{ type: "optimize", resume: Resume, jobDescription: string }`
- Receive: Progress updates + final results

See `backend/README.md` for detailed API documentation.

## 🐛 Troubleshooting

### Backend Connection Issues

**Error**: "Failed to parse resume. Please ensure backend is running on port 8000"

**Solution**:
1. Check backend is running: `curl http://localhost:8000/api/health`
2. Verify `.env` file exists in `backend/` with valid `OPENAI_API_KEY`
3. Check Python dependencies: `cd backend && pip install -r requirements.txt`

### OpenAI API Issues

**Error**: "OpenAI API key not set" or "Rate limit exceeded"

**Solution**:
1. Verify API key in `backend/.env`: `OPENAI_API_KEY=sk-...`
2. Check API key validity at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. For rate limits, wait or upgrade your OpenAI plan

### File Parsing Issues

**Error**: "Failed to parse resume" or missing sections

**Solution**:
- PDF/DOCX format should have clear section headers
- Use the Resume Builder if parsing fails repeatedly
- Check `backend/services/parser_service.py` for supported formats

### WebSocket Connection Failed

**Solution**:
1. Ensure backend WebSocket endpoint is accessible
2. Check CORS settings in `backend/main.py`
3. Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`

## 💰 Cost Considerations

**OpenAI API Pricing** (as of 2025):
- GPT-4 Turbo: ~$0.01-0.03 per resume parse
- GPT-4 Optimization: ~$0.10-0.30 per resume optimization
- Cover Letter: ~$0.05-0.15 per generation

**Average cost per complete flow**: $0.20-0.50

**To reduce costs**:
- Use `gpt-3.5-turbo` instead (edit `backend/services/ai_service.py`)
- Implement caching for repeated optimizations
- Add rate limiting to prevent abuse

## 🗺️ Roadmap

### Currently Implemented ✅
- AI-powered resume parsing (PDF/DOCX)
- Resume builder from scratch
- Real-time WebSocket optimization
- Cover letter generation
- Keyword matching and scoring
- Change summary and analysis
- Markdown export

### Future Features 🚀
- [ ] PDF export with professional templates
- [ ] User authentication and resume history
- [ ] Multiple resume versions (A/B testing)
- [ ] LinkedIn profile import
- [ ] Custom resume templates
- [ ] Multi-language support
- [ ] Chrome extension for one-click optimization
- [ ] Batch processing for multiple jobs
- [ ] Interview question generator based on resume

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code formatting
- Add comments for complex logic
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - React framework
- **[FastAPI](https://fastapi.tiangolo.com/)** - Python web framework
- **[OpenAI](https://openai.com/)** - GPT-4 AI models
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Lucide](https://lucide.dev/)** - Beautiful icon library
- **[React Hot Toast](https://react-hot-toast.com/)** - Toast notifications

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

## 📊 Project Stats

- **Lines of Code**: ~5,000+
- **Components**: 15+ React components
- **API Endpoints**: 3 REST + 1 WebSocket
- **Dependencies**: 18 (frontend) + 10 (backend)

---

Built with ❤️ using Next.js 16, React 19, and OpenAI GPT-4
