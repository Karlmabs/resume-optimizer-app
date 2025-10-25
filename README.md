# AI-Powered Resume & Cover Letter Optimizer

A beautiful, modern full-stack web application that optimizes resumes and generates personalized cover letters using OpenAI GPT-4. Features real-time WebSocket updates for live progress tracking.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Python](https://img.shields.io/badge/Python-3.9+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991)

## ✨ Features

### 🎯 Core Functionality
- **Real AI Optimization**: OpenAI GPT-4 powered resume enhancement
- **Live WebSocket Updates**: Real-time progress streaming (25% → 50% → 75% → 100%)
- **Intelligent Parsing**: Support for PDF, DOCX, and Markdown files
- **Cover Letter Generation**: AI-generated personalized cover letters
- **Keyword Analysis**: Automatic keyword extraction and matching
- **Before/After Comparison**: Toggle between original and optimized versions
- **Multi-Format Export**: Download as TXT or Markdown

### 🚀 User Experience
- **Typewriter Effect**: Smooth character-by-character content reveal
- **Processing Animations**: Beautiful loading states with progress tracking
- **Toast Notifications**: Real-time feedback for all actions
- **Glassmorphism UI**: Modern frosted-glass design elements
- **Responsive Design**: Fully responsive across all devices
- **Dark Theme**: Professional dark mode with violet/purple accents

### 🏗️ Architecture
- **Frontend**: Next.js 16 with TypeScript & Tailwind CSS
- **Backend**: Python FastAPI with async/await
- **AI**: OpenAI GPT-4 Turbo
- **Real-Time**: WebSocket bidirectional communication
- **Data Format**: JSON-first with Markdown support

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion 12.x
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **AI**: OpenAI API (GPT-4)
- **WebSocket**: Native FastAPI WebSockets
- **File Parsing**: PyPDF2, python-docx
- **Data Validation**: Pydantic

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- Python 3.9 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### 1. Clone & Install

```bash
# Navigate to project directory
cd resume-optimizer-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Configure Backend

```bash
# Create backend .env file
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=8000
```

### 3. Run Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```
Backend runs on `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

### 4. Use the App

1. Open `http://localhost:3000` in your browser
2. Toggle "Use Real Backend" checkbox (bottom right)
3. Upload a resume or enter job description
4. Click "Generate Optimized Resume"
5. Watch the real-time AI magic happen! ✨

## 📖 Detailed Setup

### Frontend Setup

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-optimizer-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The application will be running and ready to use!

## Project Structure

```
resume-optimizer-app/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout with Toaster
│   └── page.tsx                 # Main app orchestration
├── src/
│   ├── components/              # React components
│   │   ├── LandingPage.tsx     # Landing page with upload
│   │   ├── FileUpload.tsx      # Drag-and-drop file upload
│   │   ├── JobDescriptionInput.tsx
│   │   ├── ProcessingAnimation.tsx
│   │   ├── ResultsPage.tsx     # Results display
│   │   ├── ResumeDisplay.tsx   # Resume with typewriter
│   │   ├── CoverLetterDisplay.tsx
│   │   └── KeywordMatch.tsx    # Keyword visualization
│   ├── data/                    # Dummy data
│   │   ├── sampleResume.ts
│   │   ├── sampleJobDescription.ts
│   │   ├── sampleOptimizedResume.ts
│   │   └── sampleCoverLetter.ts
│   ├── hooks/                   # Custom React hooks
│   │   └── useTypewriter.ts    # Typewriter effect hook
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   └── utils/                   # Utility functions
│       └── downloadUtils.ts    # Download & clipboard utils
└── public/                      # Static assets

```

## How It Works

### 1. Landing Page
- Users upload their resume (PDF/DOCX) via drag-and-drop
- Enter or paste the job description
- Click "Generate Optimized Resume"

### 2. Processing
- Beautiful loading animation with 4 stages:
  - Analyzing resume (25%)
  - Matching keywords (50%)
  - Optimizing content (75%)
  - Generating cover letter (100%)
- Total processing time: ~5 seconds

### 3. Results
- Split view with tabs for Resume and Cover Letter
- Typewriter effect displays content progressively
- Keyword match score shows optimization effectiveness
- Download or copy documents
- Toggle between original and optimized versions

## Customization

### Changing Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: #6366f1;      /* Indigo */
  --secondary: #8b5cf6;    /* Violet */
  --accent: #ec4899;       /* Pink */
}
```

### Adjusting Typewriter Speed

Edit `src/hooks/useTypewriter.ts`:

```typescript
const { displayedText } = useTypewriter({
  text: content,
  speed: 20, // Milliseconds per character (lower = faster)
});
```

### Modifying Dummy Data

Edit files in `src/data/` to customize:
- `sampleResume.ts` - Original resume
- `sampleOptimizedResume.ts` - Optimized version
- `sampleCoverLetter.ts` - Generated cover letter
- `sampleJobDescription.ts` - Job requirements

## Building for Production

```bash
npm run build
npm run start
```

The optimized production build will be created in the `.next` folder.

## Features Roadmap

- [ ] Real AI integration (OpenAI, Claude, etc.)
- [ ] User authentication
- [ ] Save/load resume history
- [ ] Multiple export formats (PDF, DOCX)
- [ ] Custom templates
- [ ] A/B testing different versions
- [ ] LinkedIn integration
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This is a frontend-only demonstration using dummy data. For production use, integrate with actual AI APIs for resume optimization and cover letter generation.
