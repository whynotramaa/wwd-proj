# Project 0

Project 0 is an AI-powered open-source resume builder and analyzer designed specifically for the Indian job market.

The goal of Project 0 is to democratize access to professional resume design and intelligent career tools, enabling every Indian job seeker to apply for opportunities with confidence.

---

## 🚀 Features Overview

Project 0 combines powerful AI capabilities with user-friendly design to deliver a comprehensive resume management platform.

### ⚒️ AI-Powered Resume Builder

Create modern, ATS-optimized resumes with intelligent assistance at every step.


**Core Capabilities:**

| **Feature** | **Description** |
|---|---|
| **Real-Time AI Suggestions** | As you type, Project 0's AI analyzes your content and suggests improvements for impact, clarity, and ATS optimization. Get instant feedback on bullet points, action verbs, and quantifiable achievements. |
| **India-Optimized Design** | Resume templates follow Indian hiring best practices and are optimized for top ATS platforms used in India including Naukri, LinkedIn Recruiter, Workday, and Greenhouse. Automatic formatting ensures consistency across fonts, margins, and bullet points. |
| **Smart Content Generation** | Struggling with phrasing? The AI assistant helps generate professional descriptions for your roles, tailored to your industry and experience level. |
| **Privacy-First Architecture** | All processing happens locally in your browser. No sign-up required, no data sent to servers. Your resume data never leaves your device. |
| **Multi-Format Import** | Import from existing resumes (PDF, DOCX) or LinkedIn profiles. The AI extracts and structures your information automatically. |
| **Version History** | Track changes across multiple resume versions. Compare iterations, restore previous versions, and maintain different resumes for different job applications. |

### 🔍 Intelligent Resume Analyzer

Test your resume's effectiveness with comprehensive AI-powered analysis.

**Analysis Features:**

| **Feature** | **Description** |
|---|---|
| **ATS Readability Score** | Get a detailed breakdown of how well ATS systems can parse your resume. Identifies formatting issues, parsing errors, and compatibility problems. |
| **Content Quality Analysis** | AI evaluates your resume content for impact, relevance, and professional language. Highlights weak verbs, vague descriptions, and missing quantifiable achievements. |
| **Keyword Optimization** | Identifies important industry keywords missing from your resume and suggests natural ways to incorporate them. |
| **Section-by-Section Feedback** | Receive targeted suggestions for every resume section—from profile summaries to work experience and skills. |
| **Scoring Dashboard** | Visual breakdown of your resume's strengths and weaknesses across multiple dimensions: ATS compatibility, content quality, keyword optimization, and formatting. |

### 🎯 Job Description Matcher

Tailor your resume for specific roles with AI-powered job description analysis.

**Matching Capabilities:**

| **Feature** | **Description** |
|---|---|
| **Smart Job Analysis** | Paste any job description and the AI extracts key requirements, required skills, and important keywords automatically. |
| **Gap Identification** | Instantly see which qualifications you have, which you're missing, and which are partially met. Get strategic advice on addressing gaps. |
| **Tailoring Suggestions** | AI recommends specific changes to your resume to better align with the job description—from rewording bullet points to emphasizing relevant experience. |
| **Match Score** | Get a percentage match score showing how well your resume aligns with the job description, with detailed breakdowns by category. |
| **Bulk Analysis** | Analyze multiple job descriptions at once to identify common patterns and requirements across similar roles. |
| **Company Intelligence** | When available, get insights about company culture, interview processes, and what specific companies look for in candidates. |

### 📊 Resume History & Version Control

Manage multiple resume versions and track your progress over time.

**History Features:**

| **Feature** | **Description** |
|---|---|
| **Automatic Versioning** | Every significant change creates a new version automatically. Never lose your work or previous iterations. |
| **Visual Timeline** | See your resume evolution on a visual timeline with timestamps and change summaries. |
| **Version Comparison** | Compare any two versions side-by-side to see exactly what changed. |
| **Tag & Organize** | Tag versions by company, role type, or iteration stage. Easily find the right resume for the right application. |
| **Export History** | Export your entire resume history as a backup or for portfolio purposes. |
| **Rollback** | Restore any previous version with one click if you want to revert changes. |

---

## 🧠 AI Technology

Project 0 leverages state-of-the-art AI models to provide intelligent resume assistance:

- **Natural Language Processing**: Understands context and intent in your resume content
- **Industry-Specific Training**: Models trained on successful resumes from various Indian industries
- **ATS Pattern Recognition**: Learned from analyzing thousands of ATS systems and job postings
- **Personalized Recommendations**: Adapts suggestions based on your experience level, industry, and career goals

### AI Features Breakdown

```
Resume Builder AI
├── Content Generation (GPT-4 based)
├── Grammar & Style Checking
├── Action Verb Suggestions
└── Achievement Quantification

Resume Analyzer AI
├── ATS Parsing Simulation
├── Keyword Extraction & Matching
├── Content Quality Scoring
└── Layout Optimization

Job Matcher AI
├── Job Description Parsing
├── Requirement Extraction
├── Skill Gap Analysis
└── Tailoring Recommendations
```

---

## 📚 Tech Stack

| **Category** | **Technology** | **Purpose** |
|---|---|---|
| **Language** | [TypeScript](https://github.com/microsoft/TypeScript) | Type-safe development with enhanced IDE support and fewer runtime errors |
| **UI Framework** | [React 18](https://github.com/facebook/react) | Component-based architecture for building interactive user interfaces |
| **State Management** | [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) | Centralized state management for complex resume data and AI interactions |
| **AI Integration** | [Gemini API](https://gemini.google.com) | Advanced AI for content generation, analysis, and recommendations |
| **CSS Framework** | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Utility-first CSS for rapid UI development with consistent design |
| **Web Framework** | [Next.js 14](https://github.com/vercel/next.js) | React framework with server-side rendering and optimized performance |
| **PDF Processing** | [PDF.js](https://github.com/mozilla/pdf.js) | Parsing and reading PDF content from existing resumes |
| **PDF Generation** | [React-PDF](https://github.com/diegomura/react-pdf) | Creating professional, downloadable PDF resumes |
| **Analytics** | [Recharts](https://github.com/recharts/recharts) | Data visualization for resume scoring and analytics dashboard |

---


---

## 💻 Local Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher (or yarn/pnpm)
- Git

### Method 1: npm

1. **Clone the repository**
   ```bash
   git clone https://github.com/project0/project0.git
   cd project0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Visit [http://localhost:3000](http://localhost:3000) to see Project 0 running locally



### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

```bash
# Build the project
npm run build

# Test the production build locally
npm start

# Deploy the .next folder to your hosting provider
```

---

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---
