import { Page, View, Document, Text, Link } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";

/**
 * Custom Resume Template - Based on Ramnath Thakur's layout
 * Features: Centered header, clean sections with underlines, bullet points
 */
export const ResumePDFCustomTemplate = ({
    resume,
    settings,
    isPDF = false,
}: {
    resume: Resume;
    settings: Settings;
    isPDF?: boolean;
}) => {
    const { profile, workExperiences, educations, projects, skills, custom } = resume;
    const { fontFamily, fontSize, documentSize } = settings;
    const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

    // Section heading style
    const sectionHeadingStyle = {
        fontSize: "11pt",
        fontWeight: "bold" as const,
        color: themeColor,
        marginTop: spacing["3"],
        marginBottom: spacing["1"],
        borderBottom: `1pt solid ${themeColor}`,
        paddingBottom: spacing["0.5"],
    };

    const linkStyle = {
        color: "#2563eb",
        textDecoration: "none" as const,
    };

    return (
        <>
            <Document title={`${profile.name} Resume`} author={profile.name} producer={"OpenResume"}>
                <Page
                    size={documentSize === "A4" ? "A4" : "LETTER"}
                    style={{
                        ...styles.flexCol,
                        color: DEFAULT_FONT_COLOR,
                        fontFamily,
                        fontSize: fontSize + "pt",
                        padding: `${spacing[10]} ${spacing[16]}`,
                    }}
                >
                    {/* Header Section - Centered */}
                    <View style={{ alignItems: "center", marginBottom: spacing["2"] }}>
                        <Text style={{ fontSize: "18pt", fontWeight: "bold" as const, color: themeColor }}>
                            {profile.name}
                        </Text>
                        <Text style={{ fontSize: "9pt", marginTop: spacing["1"] }}>
                            DOB: 22 Feb 2006 {profile.location && `• ${profile.location}`}
                        </Text>
                        <View style={{ ...styles.flexRow, gap: spacing["2"], marginTop: spacing["0.5"], fontSize: "9pt" }}>
                            {profile.phone && (
                                <Text>
                                    📞 {profile.phone}
                                </Text>
                            )}
                            {profile.email && (
                                <Link src={`mailto:${profile.email}`} style={linkStyle}>
                                    ✉ {profile.email}
                                </Link>
                            )}
                            {profile.url && (
                                <Link src={profile.url.startsWith("http") ? profile.url : `https://${profile.url}`} style={linkStyle}>
                                    🔗 {profile.url.replace(/^https?:\/\//, "")}
                                </Link>
                            )}
                        </View>
                    </View>

                    {/* Education Section */}
                    {educations.length > 0 && (
                        <View>
                            <Text style={sectionHeadingStyle}>Education</Text>
                            {educations.map((edu, index) => (
                                <View key={index} style={{ marginTop: spacing["2"] }}>
                                    <View style={{ ...styles.flexRowBetween }}>
                                        <Text style={{ fontWeight: "bold" as const, fontSize: "10pt" }}>
                                            {edu.school}
                                        </Text>
                                        <Text style={{ fontSize: "9pt", fontStyle: "italic" }}>
                                            {edu.date}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: "9pt", marginTop: spacing["0.5"], fontStyle: "italic" }}>
                                        {edu.degree} {edu.gpa && `(CGPA - ${edu.gpa})`}
                                    </Text>
                                    {edu.descriptions.length > 0 && (
                                        <View style={{ marginTop: spacing["1"], marginLeft: spacing["4"] }}>
                                            {edu.descriptions.map((desc, i) => (
                                                <Text key={i} style={{ fontSize: "9pt", marginTop: spacing["0.5"] }}>
                                                    • {desc}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Relevant Coursework - Using Custom Section */}
                    {custom.descriptions.length > 0 && (
                        <View>
                            <Text style={sectionHeadingStyle}>Relevant Coursework</Text>
                            <View style={{ marginTop: spacing["1"], marginLeft: spacing["4"] }}>
                                {custom.descriptions.map((desc, i) => (
                                    <Text key={i} style={{ fontSize: "9pt", marginTop: spacing["0.5"] }}>
                                        • {desc}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Projects Section */}
                    {projects.length > 0 && (
                        <View>
                            <Text style={sectionHeadingStyle}>Projects</Text>
                            {projects.map((proj, index) => (
                                <View key={index} style={{ marginTop: spacing["2"] }}>
                                    <View style={{ ...styles.flexRowBetween }}>
                                        <Text style={{ fontWeight: "bold" as const, fontSize: "10pt" }}>
                                            {proj.project}
                                        </Text>
                                        <Text style={{ fontSize: "9pt", fontStyle: "italic" }}>
                                            {proj.date}
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: spacing["1"], marginLeft: spacing["4"] }}>
                                        {proj.descriptions.map((desc, i) => (
                                            <Text key={i} style={{ fontSize: "9pt", marginTop: spacing["0.5"] }}>
                                                • {desc}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Technical Skills Section */}
                    {skills.descriptions.length > 0 && (
                        <View>
                            <Text style={sectionHeadingStyle}>Technical Skills</Text>
                            <View style={{ marginTop: spacing["1"], marginLeft: spacing["4"] }}>
                                {skills.descriptions.map((desc, i) => (
                                    <Text key={i} style={{ fontSize: "9pt", marginTop: spacing["0.5"] }}>
                                        • {desc}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Work Experience / Extracurricular Activities */}
                    {workExperiences.length > 0 && (
                        <View>
                            <Text style={sectionHeadingStyle}>Extracurricular Activities</Text>
                            {workExperiences.map((exp, index) => (
                                <View key={index} style={{ marginTop: spacing["2"] }}>
                                    <View style={{ ...styles.flexRowBetween }}>
                                        <Text style={{ fontWeight: "bold" as const, fontSize: "10pt", fontStyle: "italic" as const }}>
                                            {exp.jobTitle}
                                        </Text>
                                        <Text style={{ fontSize: "9pt", fontStyle: "italic" }}>
                                            {exp.date}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: "9pt", marginTop: spacing["0.5"] }}>
                                        {exp.company}
                                    </Text>
                                    <View style={{ marginTop: spacing["1"], marginLeft: spacing["4"] }}>
                                        {exp.descriptions.map((desc, i) => (
                                            <Text key={i} style={{ fontSize: "9pt", marginTop: spacing["0.5"] }}>
                                                • {desc}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </Page>
            </Document>
            <SuppressResumePDFErrorMessage />
        </>
    );
};
