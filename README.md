# AI-Powered Resume & Cover Letter Optimizer

A beautiful, modern web application that optimizes resumes and generates personalized cover letters based on job descriptions. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Core Functionality
- **Resume Upload**: Drag-and-drop file upload supporting PDF and DOCX formats
- **Job Description Analysis**: Paste job descriptions to match requirements
- **AI-Powered Optimization**: Simulated AI processing with realistic stages
- **Cover Letter Generation**: Automatically generated personalized cover letters
- **Keyword Matching**: Visual representation of matched keywords from job descriptions
- **Before/After Comparison**: Toggle between original and optimized resumes

### User Experience
- **Typewriter Effect**: Real-time text generation simulation (10-20 seconds)
- **Processing Animation**: Beautiful loading states with progress tracking
- **Toast Notifications**: User-friendly feedback for actions
- **Download Functionality**: Export resumes and cover letters as text files
- **Copy to Clipboard**: Quick copy functionality for all documents
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop

### Design & Aesthetics
- **Glassmorphism Effects**: Modern glass-like UI elements
- **Gradient Backgrounds**: Animated gradient backgrounds with blob effects
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Custom Scrollbars**: Styled scrollbars matching the theme
- **Dark Theme**: Professional dark color palette with violet/purple accents

## Tech Stack

- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion 12.x
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Fonts**: Geist Sans & Geist Mono

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

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
