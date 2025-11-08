"use client";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "components/ResumeDropzone";
import { Heading, Paragraph } from "components/documentation";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
    setResumeData,
    setJDText,
    setJDFile,
    setAnalysisResult,
    selectJDAnalyzer,
} from "lib/redux/jdAnalyzerSlice";
import {
    extractKeywords,
    extractSkills,
    calculateMatchScore,
    compareKeywords,
    generateSuggestions,
    calculateATSScore,
} from "lib/jd-analyzer-utils";

const RESUME_EXAMPLES = [
    {
        fileUrl: "resume-example/123CS0965_RamnathThakur.pdf",
        description: "Ramnath Thakur Resume",
    },
    {
        fileUrl: "resume-example/123CS0962_RIKIT_SAH_CV.pdf",
        description: "Rikit Sah Template",
    },
];

const defaultFileUrl = RESUME_EXAMPLES[0]["fileUrl"];

function JDAnalyzerContent() {
    const dispatch = useAppDispatch();
    const jdAnalyzerState = useAppSelector(selectJDAnalyzer);

    const [fileUrl, setFileUrl] = useState(defaultFileUrl);
    const [textItems, setTextItems] = useState<TextItems>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const lines = groupTextItemsIntoLines(textItems || []);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);

    // Load resume when file changes
    useEffect(() => {
        async function loadResume() {
            const textItems = await readPdf(fileUrl);
            setTextItems(textItems);

            // Extract text from resume
            const resumeText = textItems.map(item => item.text).join(" ");
            const fileName = fileUrl.split("/").pop() || "resume.pdf";
            dispatch(setResumeData({ fileName, text: resumeText }));
        }
        loadResume();
    }, [fileUrl, dispatch]);

    // Handle JD text input change
    const handleJDTextChange = (text: string) => {
        dispatch(setJDText(text));
    };

    // Handle JD PDF upload
    const handleJDFileUpload = async (file: File) => {
        try {
            const fileUrl = URL.createObjectURL(file);
            const jdTextItems = await readPdf(fileUrl);
            const jdText = jdTextItems.map(item => item.text).join(" ");

            dispatch(setJDFile({ fileName: file.name, text: jdText }));
            URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error("Error reading JD PDF:", error);
        }
    };

    // Perform analysis
    const analyzeResumeVsJD = () => {
        if (!jdAnalyzerState.resumeText || !jdAnalyzerState.jdText) {
            return;
        }

        setIsAnalyzing(true);

        // Extract keywords and skills
        const resumeKeywords = extractKeywords(jdAnalyzerState.resumeText);
        const jdKeywords = extractKeywords(jdAnalyzerState.jdText);

        const resumeSkills = extractSkills(jdAnalyzerState.resumeText);
        const jdSkills = extractSkills(jdAnalyzerState.jdText);

        // Compare keywords and skills
        const { matched: matchedKeywords, missing: missingKeywords } = compareKeywords(
            resumeKeywords,
            jdKeywords
        );

        const { matched: matchedSkills, missing: missingSkills } = compareKeywords(
            resumeSkills,
            jdSkills
        );

        // Calculate scores
        const matchScore = calculateMatchScore(resumeKeywords, jdKeywords);
        const atsCompatibilityScore = calculateATSScore(
            jdAnalyzerState.resumeText,
            matchScore
        );

        // Generate suggestions
        const suggestions = generateSuggestions(
            missingSkills,
            missingKeywords,
            matchScore
        );

        // Dispatch results
        dispatch(setAnalysisResult({
            matchScore,
            matchedKeywords: matchedKeywords.slice(0, 20), // Top 20
            missingKeywords: missingKeywords.slice(0, 20),
            matchedSkills,
            missingSkills,
            suggestions,
            atsCompatibilityScore,
        }));

        setIsAnalyzing(false);
    };

    return (
        <main className="h-full w-full overflow-hidden bg-background">
            <div className="grid md:grid-cols-6">
                {/* Left Side - Resume Preview */}
                <div className="flex justify-center px-2 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end bg-muted/30">
                    <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0">
                        <div className="aspect-h-[9.5] aspect-w-7 rounded-lg overflow-hidden border border-border">
                            <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full" />
                        </div>
                    </section>
                    <FlexboxSpacer maxWidth={45} className="hidden md:block" />
                </div>

                {/* Right Side - JD Input and Analysis */}
                <div className="flex px-6 text-foreground md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll border-l border-border">
                    <FlexboxSpacer maxWidth={45} className="hidden md:block" />
                    <section className="max-w-[600px] grow">
                        <Heading className="text-primary !mt-4">
                            JD Analyzer
                        </Heading>
                        <Paragraph smallMarginTop={true}>
                            Upload your resume and job description to get instant AI-powered analysis.
                            See how well your resume matches the JD, identify missing keywords, and get
                            actionable suggestions to improve your application.
                        </Paragraph>

                        {/* Resume Upload Section */}
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-foreground mb-2">
                                Step 1: Upload Your Resume
                            </h3>
                            <ResumeDropzone
                                onFileUrlChange={(fileUrl) =>
                                    setFileUrl(fileUrl || defaultFileUrl)
                                }
                                playgroundView={true}
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                                Current: {jdAnalyzerState.resumeFileName || "No resume uploaded"}
                            </p>
                        </div>

                        <Paragraph className="mt-4 text-sm">
                            Or try one of our example resumes:
                        </Paragraph>

                        <div className="mt-3 flex flex-col gap-2">
                            {RESUME_EXAMPLES.map((example, idx) => (
                                <button
                                    key={idx}
                                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${example.fileUrl === fileUrl
                                        ? "border-primary bg-accent"
                                        : "border-border hover:bg-accent"
                                        }`}
                                    onClick={() => setFileUrl(example.fileUrl)}
                                >
                                    <h4 className="font-semibold text-foreground text-sm">
                                        Example {idx + 1}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {example.description}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Job Description Input Section */}
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-foreground mb-2">
                                Step 2: Add Job Description
                            </h3>

                            {/* Text Input */}
                            <div className="mb-4">
                                <label className="text-xs text-muted-foreground block mb-1">
                                    Paste Job Description (Text)
                                </label>
                                <textarea
                                    className="w-full h-40 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Paste the job description here..."
                                    value={jdAnalyzerState.jdText}
                                    onChange={(e) => handleJDTextChange(e.target.value)}
                                />
                            </div>

                            {/* PDF Upload */}
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">
                                    Or Upload JD as PDF (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleJDFileUpload(file);
                                    }}
                                    className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                                />
                                {jdAnalyzerState.jdFileName && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Uploaded: {jdAnalyzerState.jdFileName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Analyze Button */}
                        <div className="mt-6">
                            <button
                                onClick={analyzeResumeVsJD}
                                disabled={!jdAnalyzerState.resumeText || !jdAnalyzerState.jdText || isAnalyzing}
                                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isAnalyzing ? "Analyzing..." : "Analyze Resume vs JD"}
                            </button>
                        </div>

                        {/* Analysis Results */}
                        {jdAnalyzerState.analysisResult && (
                            <div className="mt-8">
                                <Heading level={2} className="!mt-0">
                                    Analysis Results
                                </Heading>

                                {/* Score Cards */}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="p-4 rounded-lg border border-border bg-card">
                                        <div className="text-3xl font-bold text-primary">
                                            {jdAnalyzerState.analysisResult.matchScore}%
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            JD Match Score
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg border border-border bg-card">
                                        <div className="text-3xl font-bold text-primary">
                                            {jdAnalyzerState.analysisResult.atsCompatibilityScore}%
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            ATS Compatibility
                                        </div>
                                    </div>
                                </div>

                                {/* Matched Skills */}
                                {jdAnalyzerState.analysisResult.matchedSkills.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-foreground mb-2">
                                            ✅ Matched Skills ({jdAnalyzerState.analysisResult.matchedSkills.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {jdAnalyzerState.analysisResult.matchedSkills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Missing Skills */}
                                {jdAnalyzerState.analysisResult.missingSkills.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-foreground mb-2">
                                            ⚠️ Missing Skills ({jdAnalyzerState.analysisResult.missingSkills.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {jdAnalyzerState.analysisResult.missingSkills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 text-xs rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggestions */}
                                <div className="mt-6">
                                    <h4 className="font-semibold text-foreground mb-2">
                                        💡 Suggestions
                                    </h4>
                                    <ul className="space-y-2">
                                        {jdAnalyzerState.analysisResult.suggestions.map((suggestion, idx) => (
                                            <li
                                                key={idx}
                                                className="text-sm text-muted-foreground pl-4 border-l-2 border-primary py-1"
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Keyword Details (Collapsible) */}
                                <details className="mt-6 border border-border rounded-lg">
                                    <summary className="px-4 py-3 cursor-pointer font-semibold text-foreground hover:bg-accent">
                                        View Keyword Analysis
                                    </summary>
                                    <div className="px-4 pb-4">
                                        <div className="mt-3">
                                            <h5 className="text-sm font-semibold text-foreground mb-2">
                                                Matched Keywords (Top 20)
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {jdAnalyzerState.analysisResult.matchedKeywords.map((kw, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 text-xs rounded bg-accent text-foreground"
                                                    >
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h5 className="text-sm font-semibold text-foreground mb-2">
                                                Missing Keywords (Top 20)
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {jdAnalyzerState.analysisResult.missingKeywords.map((kw, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
                                                    >
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        )}

                        <div className="pt-24" />
                    </section>
                </div>
            </div>
        </main>
    );
}

export default function JDAnalyzer() {
    return (
        <Provider store={store}>
            <JDAnalyzerContent />
        </Provider>
    );
}
