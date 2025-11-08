"use client";
import { useState, useEffect } from "react";
import { Heading, Paragraph } from "components/documentation";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area,
    AreaChart,
} from "recharts";

interface ATSHistoryEntry {
    id: string;
    timestamp: number;
    date: string;
    atsScore: number;
    technicalSkills?: number;
    softSkills?: number;
    experienceQuality?: number;
    education?: number;
    keywordOptimization?: number;
    resumeName?: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<ATSHistoryEntry[]>([]);
    const [viewMode, setViewMode] = useState<"line" | "area">("line");
    const [showAllMetrics, setShowAllMetrics] = useState(false);

    useEffect(() => {
        // Load history from localStorage
        const loadHistory = () => {
            try {
                const savedHistory = localStorage.getItem("ats-history");
                if (savedHistory) {
                    const parsed = JSON.parse(savedHistory);
                    setHistory(parsed.sort((a: ATSHistoryEntry, b: ATSHistoryEntry) => a.timestamp - b.timestamp));
                }
            } catch (error) {
                console.error("Failed to load history:", error);
            }
        };

        loadHistory();
    }, []);

    const clearHistory = () => {
        if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
            localStorage.removeItem("ats-history");
            setHistory([]);
        }
    };

    const deleteEntry = (id: string) => {
        const updatedHistory = history.filter((entry) => entry.id !== id);
        localStorage.setItem("ats-history", JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
    };

    const getLatestScore = () => {
        if (history.length === 0) return null;
        return history[history.length - 1];
    };

    const getAverageScore = () => {
        if (history.length === 0) return 0;
        const sum = history.reduce((acc, entry) => acc + entry.atsScore, 0);
        return Math.round(sum / history.length);
    };

    const getScoreTrend = () => {
        if (history.length < 2) return "neutral";
        const latest = history[history.length - 1].atsScore;
        const previous = history[history.length - 2].atsScore;
        if (latest > previous) return "up";
        if (latest < previous) return "down";
        return "neutral";
    };

    const latestScore = getLatestScore();
    const averageScore = getAverageScore();
    const trend = getScoreTrend();

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Heading className="!mt-0">ATS Score History</Heading>
                    <Paragraph smallMarginTop={true}>
                        Track your resume improvement journey over time. View your ATS score progression
                        and identify trends in your resume optimization efforts.
                    </Paragraph>
                </div>

                {/* Statistics Cards */}
                {history.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Latest Score */}
                        <div className="p-6 rounded-lg border border-border bg-card">
                            <div className="text-sm text-muted-foreground mb-2">Latest Score</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary">
                                    {latestScore?.atsScore}
                                </span>
                                <span className="text-xl text-muted-foreground">/100</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                {latestScore?.date}
                            </div>
                        </div>

                        {/* Average Score */}
                        <div className="p-6 rounded-lg border border-border bg-card">
                            <div className="text-sm text-muted-foreground mb-2">Average Score</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground">
                                    {averageScore}
                                </span>
                                <span className="text-xl text-muted-foreground">/100</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                Based on {history.length} analysis{history.length !== 1 ? "es" : ""}
                            </div>
                        </div>

                        {/* Trend */}
                        <div className="p-6 rounded-lg border border-border bg-card">
                            <div className="text-sm text-muted-foreground mb-2">Trend</div>
                            <div className="flex items-center gap-3">
                                {trend === "up" && (
                                    <>
                                        <svg
                                            className="w-12 h-12 text-green-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>
                                        <span className="text-2xl font-semibold text-green-500">
                                            Improving
                                        </span>
                                    </>
                                )}
                                {trend === "down" && (
                                    <>
                                        <svg
                                            className="w-12 h-12 text-red-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                            />
                                        </svg>
                                        <span className="text-2xl font-semibold text-red-500">
                                            Declining
                                        </span>
                                    </>
                                )}
                                {trend === "neutral" && (
                                    <>
                                        <svg
                                            className="w-12 h-12 text-yellow-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 12h14"
                                            />
                                        </svg>
                                        <span className="text-2xl font-semibold text-yellow-500">
                                            Stable
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Chart Controls */}
                {history.length > 0 && (
                    <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setViewMode("line")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "line"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card border border-border text-foreground hover:bg-accent"
                                    }`}
                            >
                                Line Chart
                            </button>
                            <button
                                onClick={() => setViewMode("area")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "area"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card border border-border text-foreground hover:bg-accent"
                                    }`}
                            >
                                Area Chart
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showAllMetrics}
                                    onChange={(e) => setShowAllMetrics(e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-foreground">Show All Metrics</span>
                            </label>
                            <button
                                onClick={clearHistory}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                            >
                                Clear History
                            </button>
                        </div>
                    </div>
                )}

                {/* Chart */}
                {history.length > 0 ? (
                    <div className="p-6 rounded-lg border border-border bg-card mb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Score Progress Over Time
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            {viewMode === "line" ? (
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="currentColor"
                                        tick={{ fill: "currentColor" }}
                                        className="text-muted-foreground"
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        stroke="currentColor"
                                        tick={{ fill: "currentColor" }}
                                        className="text-muted-foreground"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            color: "#ffffff",
                                        }}
                                        itemStyle={{ color: "#ffffff" }}
                                        labelStyle={{ color: "#ffffff" }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: "20px",
                                            color: "hsl(var(--foreground))",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="atsScore"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 5, fill: "#3b82f6" }}
                                        activeDot={{ r: 7 }}
                                        name="ATS Score"
                                    />
                                    {showAllMetrics && (
                                        <>
                                            <Line
                                                type="monotone"
                                                dataKey="technicalSkills"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                name="Technical Skills"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="softSkills"
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                name="Soft Skills"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="experienceQuality"
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                name="Experience"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="education"
                                                stroke="#ec4899"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                name="Education"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="keywordOptimization"
                                                stroke="#06b6d4"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                name="Keywords"
                                            />
                                        </>
                                    )}
                                </LineChart>
                            ) : (
                                <AreaChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="currentColor"
                                        tick={{ fill: "currentColor" }}
                                        className="text-muted-foreground"
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        stroke="currentColor"
                                        tick={{ fill: "currentColor" }}
                                        className="text-muted-foreground"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            color: "#ffffff",
                                        }}
                                        itemStyle={{ color: "#ffffff" }}
                                        labelStyle={{ color: "#ffffff" }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: "20px",
                                            color: "hsl(var(--foreground))",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="atsScore"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.6}
                                        strokeWidth={3}
                                        name="ATS Score"
                                    />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="p-12 rounded-lg border border-border bg-card text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            No History Yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Start analyzing your resume to build your ATS score history
                        </p>
                        <a
                            href="/resume-parser"
                            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Analyze Resume
                        </a>
                    </div>
                )}

                {/* History Table */}
                {history.length > 0 && (
                    <div className="rounded-lg border border-border bg-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">
                                Analysis History
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            ATS Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Technical
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Soft Skills
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Experience
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Education
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Keywords
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {[...history].reverse().map((entry) => (
                                        <tr key={entry.id} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {entry.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-lg font-semibold text-primary">
                                                    {entry.atsScore}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {entry.technicalSkills || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {entry.softSkills || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {entry.experienceQuality || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {entry.education || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {entry.keywordOptimization || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => deleteEntry(entry.id)}
                                                    className="text-destructive hover:text-destructive/80 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
