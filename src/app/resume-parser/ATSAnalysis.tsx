"use client";
import { useState } from "react";
import type { Resume } from "lib/redux/types";
import { Button } from "components/Button";
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface SkillBreakdown {
    technicalSkills: number;
    softSkills: number;
    experienceQuality: number;
    education: number;
    keywordOptimization: number;
}

interface ATSAnalysisResult {
    atsScore: number;
    strengths: string[];
    improvements: string[];
    keywords: string[];
    formattingIssues: string[];
    skillBreakdown?: SkillBreakdown;
}

interface ATSAnalysisProps {
    resume: Resume;
}

export const ATSAnalysis = ({ resume }: ATSAnalysisProps) => {
    const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeResume = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/analyze-resume", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ resume }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze resume");
            }

            const data = await response.json();
            setAnalysis(data.analysis);

            // Save to history
            saveToHistory(data.analysis, resume);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const saveToHistory = (analysisResult: ATSAnalysisResult, resumeData: Resume) => {
        try {
            const historyEntry = {
                id: `analysis-${Date.now()}-${Math.random()}`,
                timestamp: Date.now(),
                date: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                atsScore: analysisResult.atsScore,
                technicalSkills: analysisResult.skillBreakdown?.technicalSkills,
                softSkills: analysisResult.skillBreakdown?.softSkills,
                experienceQuality: analysisResult.skillBreakdown?.experienceQuality,
                education: analysisResult.skillBreakdown?.education,
                keywordOptimization: analysisResult.skillBreakdown?.keywordOptimization,
                resumeName: resumeData.profile.name || "Unknown",
            };

            const existingHistory = localStorage.getItem("ats-history");
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            history.push(historyEntry);

            // Keep only last 50 entries
            if (history.length > 50) {
                history.shift();
            }

            localStorage.setItem("ats-history", JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save to history:", error);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Needs Improvement";
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return "stroke-green-600 dark:stroke-green-400";
        if (score >= 60) return "stroke-yellow-600 dark:stroke-yellow-400";
        return "stroke-red-600 dark:stroke-red-400";
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    AI-Powered ATS Analysis
                </h3>
                <Button
                    onClick={analyzeResume}
                    disabled={loading}
                    className="bg-primary p-3 rounded text-primary-foreground hover:bg-primary/90"
                >
                    {loading ? "Analyzing..." : "Analyze Resume"}
                </Button>
            </div>

            {error && (
                <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {analysis && (
                <div className="space-y-4">
                    {/* ATS Score */}
                    <div className="p-6 bg-accent rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                    ATS Score
                                </h4>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                                        {analysis.atsScore}
                                    </span>
                                    <span className="text-xl text-muted-foreground">/100</span>
                                </div>
                                <p className={`text-sm font-medium mt-1 ${getScoreColor(analysis.atsScore)}`}>
                                    {getScoreLabel(analysis.atsScore)}
                                </p>
                            </div>
                            <div className="w-24 h-24">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path
                                        className="circle-bg"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                        opacity="0.1"
                                    />
                                    <path
                                        className={`circle ${getScoreBgColor(analysis.atsScore)}`}
                                        fill="none"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={`${analysis.atsScore}, 100`}
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Skill Breakdown Charts */}
                    {analysis.skillBreakdown && (
                        <div className="p-6 bg-accent rounded-lg border border-border">
                            <h4 className="text-lg font-semibold text-foreground mb-4">
                                Skill Breakdown Analysis
                            </h4>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Radar Chart */}
                                <div>
                                    <h5 className="text-sm font-medium text-muted-foreground mb-2 text-center">
                                        Skills Radar Chart
                                    </h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RadarChart
                                            data={[
                                                {
                                                    category: "Technical Skills",
                                                    value: analysis.skillBreakdown.technicalSkills,
                                                    fullMark: 100,
                                                },
                                                {
                                                    category: "Soft Skills",
                                                    value: analysis.skillBreakdown.softSkills,
                                                    fullMark: 100,
                                                },
                                                {
                                                    category: "Experience",
                                                    value: analysis.skillBreakdown.experienceQuality,
                                                    fullMark: 100,
                                                },
                                                {
                                                    category: "Education",
                                                    value: analysis.skillBreakdown.education,
                                                    fullMark: 100,
                                                },
                                                {
                                                    category: "Keywords",
                                                    value: analysis.skillBreakdown.keywordOptimization,
                                                    fullMark: 100,
                                                },
                                            ]}
                                        >
                                            <PolarGrid stroke="currentColor" className="opacity-20" />
                                            <PolarAngleAxis
                                                dataKey="category"
                                                tick={{ fill: "currentColor", fontSize: 12 }}
                                                className="text-foreground"
                                            />
                                            <PolarRadiusAxis
                                                angle={90}
                                                domain={[0, 100]}
                                                tick={{ fill: "currentColor", fontSize: 10 }}
                                                className="text-muted-foreground"
                                            />
                                            <Radar
                                                name="Your Score"
                                                dataKey="value"
                                                stroke="#3b82f6"
                                                fill="#3b82f6"
                                                fillOpacity={0.6}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--background))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                    color: "hsl(var(--foreground))",
                                                }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart */}
                                <div>
                                    <h5 className="text-sm font-medium text-muted-foreground mb-2 text-center">
                                        Skills Distribution
                                    </h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    {
                                                        name: "Technical Skills",
                                                        value: analysis.skillBreakdown.technicalSkills,
                                                    },
                                                    {
                                                        name: "Soft Skills",
                                                        value: analysis.skillBreakdown.softSkills,
                                                    },
                                                    {
                                                        name: "Experience",
                                                        value: analysis.skillBreakdown.experienceQuality,
                                                    },
                                                    {
                                                        name: "Education",
                                                        value: analysis.skillBreakdown.education,
                                                    },
                                                    {
                                                        name: "Keywords",
                                                        value: analysis.skillBreakdown.keywordOptimization,
                                                    },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }: any) =>
                                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {[
                                                    "#3b82f6", // blue
                                                    "#10b981", // green
                                                    "#f59e0b", // amber
                                                    "#8b5cf6", // purple
                                                    "#ec4899", // pink
                                                ].map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--background))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                    color: "#ffffff",
                                                }}
                                                itemStyle={{
                                                    color: "#ffffff",
                                                }}
                                                labelStyle={{
                                                    color: "#ffffff",
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{
                                                    fontSize: "12px",
                                                    color: "hsl(var(--foreground))",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Detailed Breakdown */}
                            <div className="mt-6 grid gap-3">
                                {[
                                    {
                                        label: "Technical Skills",
                                        value: analysis.skillBreakdown.technicalSkills,
                                        color: "bg-blue-500",
                                    },
                                    {
                                        label: "Soft Skills",
                                        value: analysis.skillBreakdown.softSkills,
                                        color: "bg-green-500",
                                    },
                                    {
                                        label: "Experience Quality",
                                        value: analysis.skillBreakdown.experienceQuality,
                                        color: "bg-amber-500",
                                    },
                                    {
                                        label: "Education & Certifications",
                                        value: analysis.skillBreakdown.education,
                                        color: "bg-purple-500",
                                    },
                                    {
                                        label: "Keyword Optimization",
                                        value: analysis.skillBreakdown.keywordOptimization,
                                        color: "bg-pink-500",
                                    },
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-foreground">
                                                {item.label}
                                            </span>
                                            <span className="text-sm font-semibold text-foreground">
                                                {item.value}/100
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Gap Analysis */}
                            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Gaps to Fill
                                </h5>
                                <ul className="space-y-1">
                                    {Object.entries(analysis.skillBreakdown)
                                        .filter(([_, value]) => value < 70)
                                        .map(([key, value], idx) => {
                                            const labels: Record<string, string> = {
                                                technicalSkills: "Technical Skills",
                                                softSkills: "Soft Skills",
                                                experienceQuality: "Experience Quality",
                                                education: "Education & Certifications",
                                                keywordOptimization: "Keyword Optimization",
                                            };
                                            return (
                                                <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                                                    <span className="mt-1">•</span>
                                                    <span>
                                                        <strong>{labels[key]}</strong> needs improvement ({value}/100)
                                                        {value < 50 && " - Critical gap"}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    {Object.values(analysis.skillBreakdown).every((v) => v >= 70) && (
                                        <li className="text-sm text-yellow-700 dark:text-yellow-400">
                                            No major gaps detected! Your resume is well-balanced.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Key Strengths
                            </h4>
                            <ul className="space-y-1">
                                {analysis.strengths.map((strength, idx) => (
                                    <li key={idx} className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                                        <span className="mt-1">•</span>
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Improvements */}
                    {analysis.improvements.length > 0 && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Areas for Improvement
                            </h4>
                            <ul className="space-y-1">
                                {analysis.improvements.map((improvement, idx) => (
                                    <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                                        <span className="mt-1">•</span>
                                        <span>{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Keywords */}
                    {analysis.keywords.length > 0 && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Suggested Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.keywords.map((keyword, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Formatting Issues */}
                    {analysis.formattingIssues.length > 0 && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Formatting Issues
                            </h4>
                            <ul className="space-y-1">
                                {analysis.formattingIssues.map((issue, idx) => (
                                    <li key={idx} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                                        <span className="mt-1">•</span>
                                        <span>{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
