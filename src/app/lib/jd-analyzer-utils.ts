/**
 * JD Analyzer Utilities
 * Functions to analyze job descriptions and compare with resumes
 */

export interface KeywordAnalysis {
    allKeywords: string[];
    skills: string[];
    technologies: string[];
    qualifications: string[];
}

// Common tech skills and keywords
const COMMON_SKILLS = [
    "javascript", "typescript", "python", "java", "react", "angular", "vue",
    "node", "nodejs", "express", "django", "flask", "spring", "sql", "nosql",
    "mongodb", "postgresql", "mysql", "aws", "azure", "gcp", "docker", "kubernetes",
    "git", "ci/cd", "agile", "scrum", "rest", "api", "graphql", "html", "css",
    "tailwind", "bootstrap", "sass", "webpack", "vite", "redux", "nextjs", "next.js",
    "machine learning", "ml", "ai", "data science", "analytics", "tableau", "power bi",
    "excel", "leadership", "management", "communication", "problem solving",
    "teamwork", "collaboration", "project management", "product management"
];

// Extract keywords from text
export const extractKeywords = (text: string): string[] => {
    if (!text) return [];

    // Convert to lowercase and remove special characters
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, " ");

    // Split into words and filter out common words
    const words = cleanText.split(/\s+/);
    const stopWords = new Set([
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
        "be", "have", "has", "had", "do", "does", "did", "will", "would", "should",
        "could", "may", "might", "must", "can", "this", "that", "these", "those",
        "i", "you", "he", "she", "it", "we", "they", "what", "which", "who",
        "when", "where", "why", "how", "all", "each", "every", "both", "few",
        "more", "most", "other", "some", "such", "no", "nor", "not", "only",
        "own", "same", "so", "than", "too", "very", "s", "t", "can", "just"
    ]);

    // Extract meaningful words (length > 2 and not stop words)
    const keywords = words.filter(
        word => word.length > 2 && !stopWords.has(word)
    );

    // Remove duplicates and return
    return Array.from(new Set(keywords));
};

// Extract skills specifically
export const extractSkills = (text: string): string[] => {
    const keywords = extractKeywords(text);
    const normalizedText = text.toLowerCase();

    // Find matching skills
    const foundSkills = COMMON_SKILLS.filter(skill => {
        const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return skillPattern.test(normalizedText);
    });

    return Array.from(new Set(foundSkills));
};

// Calculate keyword match percentage
export const calculateMatchScore = (
    resumeKeywords: string[],
    jdKeywords: string[]
): number => {
    if (jdKeywords.length === 0) return 0;

    const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()));
    const matchedCount = jdKeywords.filter(keyword =>
        resumeSet.has(keyword.toLowerCase())
    ).length;

    return Math.round((matchedCount / jdKeywords.length) * 100);
};

// Find matched and missing keywords
export const compareKeywords = (
    resumeKeywords: string[],
    jdKeywords: string[]
): { matched: string[]; missing: string[] } => {
    const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()));

    const matched: string[] = [];
    const missing: string[] = [];

    jdKeywords.forEach(keyword => {
        if (resumeSet.has(keyword.toLowerCase())) {
            matched.push(keyword);
        } else {
            missing.push(keyword);
        }
    });

    return { matched, missing };
};

// Generate suggestions based on analysis
export const generateSuggestions = (
    missingSkills: string[],
    missingKeywords: string[],
    matchScore: number
): string[] => {
    const suggestions: string[] = [];

    if (matchScore < 50) {
        suggestions.push("Your resume has a low match with this job description. Consider tailoring your resume to better align with the role requirements.");
    } else if (matchScore < 70) {
        suggestions.push("Your resume partially matches the job description. Adding more relevant keywords could improve your chances.");
    } else if (matchScore < 90) {
        suggestions.push("Your resume is a good match! Minor improvements could make it even stronger.");
    } else {
        suggestions.push("Excellent match! Your resume aligns well with this job description.");
    }

    if (missingSkills.length > 0) {
        const topMissing = missingSkills.slice(0, 5).join(", ");
        suggestions.push(`Consider adding these skills if you have them: ${topMissing}`);
    }

    if (missingKeywords.length > 10) {
        suggestions.push("Many keywords from the job description are missing. Review the JD carefully and incorporate relevant terms naturally into your resume.");
    }

    suggestions.push("Ensure your resume uses similar terminology and language as the job description.");
    suggestions.push("Quantify your achievements with numbers and metrics where possible.");

    return suggestions;
};

// Calculate ATS compatibility score based on various factors
export const calculateATSScore = (
    resumeText: string,
    matchScore: number
): number => {
    let score = matchScore * 0.5; // 50% weight to keyword match

    // Check for common ATS-friendly elements
    const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText);
    const hasPhone = /[\d\s\-()]+/.test(resumeText);
    const hasBulletPoints = /[•\-\*]/.test(resumeText);
    const hasDateFormat = /\d{4}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/.test(resumeText);

    if (hasEmail) score += 10;
    if (hasPhone) score += 10;
    if (hasBulletPoints) score += 15;
    if (hasDateFormat) score += 15;

    return Math.min(Math.round(score), 100);
};
