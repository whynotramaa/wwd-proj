import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import type { Resume } from 'lib/redux/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const { resume } = await request.json();

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume data is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        // Format resume data for analysis
        const resumeText = formatResumeForAnalysis(resume);

        const prompt = `You are an expert ATS (Application Tracking System) analyzer and career coach. Analyze the following resume and provide:

1. ATS Score (0-100): Rate how well this resume would perform in ATS systems
2. Key Strengths: List 3-5 positive aspects
3. Areas for Improvement: List 3-5 specific suggestions
4. Keyword Optimization: Suggest important keywords that might be missing
5. Formatting Issues: Note any formatting problems that could affect ATS parsing
6. Skill Breakdown: Analyze and rate the following categories (0-100):
   - Technical Skills: Programming languages, tools, frameworks, technical expertise
   - Soft Skills: Communication, leadership, teamwork, problem-solving
   - Experience Quality: Depth and relevance of work experience
   - Education & Certifications: Educational background and professional certifications
   - Keywords Optimization: Use of industry-specific keywords

Resume Data:
${resumeText}

Provide your analysis in the following JSON format:
{
  "atsScore": number (0-100),
  "strengths": string[],
  "improvements": string[],
  "keywords": string[],
  "formattingIssues": string[],
  "skillBreakdown": {
    "technicalSkills": number (0-100),
    "softSkills": number (0-100),
    "experienceQuality": number (0-100),
    "education": number (0-100),
    "keywordOptimization": number (0-100)
  }
}`;

        const { text } = await generateText({
            model: google('gemini-2.0-flash-exp'),
            prompt: prompt,
            temperature: 0.7,
        });

        // Clean the response text before parsing
        let cleanedText = text;

        // Remove markdown code blocks if present
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        // Parse the JSON response
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response');
        }

        // Clean up control characters and invalid JSON
        let jsonString = jsonMatch[0]
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
            .replace(/\\/g, '\\\\') // Escape backslashes
            .replace(/\\\\"/g, '\\"'); // Fix double-escaped quotes

        const analysis = JSON.parse(jsonString);

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error('Error analyzing resume:', error);
        return NextResponse.json(
            { error: 'Failed to analyze resume' },
            { status: 500 }
        );
    }
}

function formatResumeForAnalysis(resume: Resume): string {
    const sections = [];

    // Profile
    if (resume.profile.name) {
        sections.push(`Name: ${resume.profile.name}`);
    }
    if (resume.profile.email) {
        sections.push(`Email: ${resume.profile.email}`);
    }
    if (resume.profile.phone) {
        sections.push(`Phone: ${resume.profile.phone}`);
    }
    if (resume.profile.location) {
        sections.push(`Location: ${resume.profile.location}`);
    }
    if (resume.profile.url) {
        sections.push(`URL: ${resume.profile.url}`);
    }
    if (resume.profile.summary) {
        sections.push(`Summary: ${resume.profile.summary}`);
    }

    // Work Experience
    if (resume.workExperiences.length > 0) {
        sections.push('\nWork Experience:');
        resume.workExperiences.forEach((exp) => {
            sections.push(`- ${exp.jobTitle} at ${exp.company} (${exp.date})`);
            exp.descriptions.forEach((desc) => sections.push(`  • ${desc}`));
        });
    }

    // Education
    if (resume.educations.length > 0) {
        sections.push('\nEducation:');
        resume.educations.forEach((edu) => {
            sections.push(`- ${edu.degree} from ${edu.school} (${edu.date})`);
            if (edu.gpa) sections.push(`  GPA: ${edu.gpa}`);
            if (edu.descriptions.length > 0) {
                edu.descriptions.forEach((desc) => sections.push(`  • ${desc}`));
            }
        });
    }

    // Projects
    if (resume.projects.length > 0) {
        sections.push('\nProjects:');
        resume.projects.forEach((proj) => {
            sections.push(`- ${proj.project} (${proj.date})`);
            proj.descriptions.forEach((desc) => sections.push(`  • ${desc}`));
        });
    }

    // Skills
    if (resume.skills.featuredSkills.length > 0) {
        sections.push('\nFeatured Skills:');
        resume.skills.featuredSkills.forEach((skill) => {
            sections.push(`- ${skill.skill}: ${skill.rating}/5`);
        });
    }

    if (resume.skills.descriptions.length > 0) {
        sections.push('\nAdditional Skills:');
        resume.skills.descriptions.forEach((desc) => sections.push(`- ${desc}`));
    }

    // Custom Sections
    if (resume.custom.descriptions.length > 0) {
        sections.push('\nCustom Section:');
        resume.custom.descriptions.forEach((desc) => sections.push(`- ${desc}`));
    }

    return sections.join('\n');
}
