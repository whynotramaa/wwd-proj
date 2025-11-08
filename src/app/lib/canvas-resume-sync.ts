import type { CanvasComponent } from "./redux/canvasSlice";
import type { Resume } from "./redux/types";
import { initialResumeState } from "./redux/resumeSlice";

/**
 * Converts canvas components to resume form data
 * This preserves the content when switching from canvas mode to form mode
 */
export const canvasToResumeData = (components: CanvasComponent[]): Partial<Resume> => {
    const resume: Partial<Resume> = {
        profile: { ...initialResumeState.profile },
        workExperiences: [],
        educations: [],
        projects: [],
        skills: { ...initialResumeState.skills },
        custom: { descriptions: [] },
    };

    // Group components by type
    const headings = components.filter(c => c.type === "heading");
    const contacts = components.filter(c => c.type === "contact");
    const sections = components.filter(c => c.type === "section");
    const texts = components.filter(c => c.type === "text");
    const bulletLists = components.filter(c => c.type === "bulletList");
    const hyperlinks = components.filter(c => c.type === "hyperlink");

    // Extract profile information
    if (headings.length > 0 && resume.profile) {
        resume.profile.name = headings[0].content || "";
    }

    if (contacts.length > 0 && resume.profile) {
        const contactText = contacts[0].content || "";
        const parts = contactText.split("|").map(p => p.trim());

        // Try to parse email, phone, etc.
        parts.forEach(part => {
            if (part.includes("@")) {
                resume.profile!.email = part;
            } else if (part.match(/[\d\+\-\(\)\s]+/) && part.length > 5) {
                resume.profile!.phone = part;
            } else if (part.startsWith("http")) {
                resume.profile!.url = part;
            } else if (!resume.profile!.location) {
                resume.profile!.location = part;
            }
        });
    }

    // Combine all text content into custom section
    const allTextContent: string[] = [];

    // Add section headers as custom descriptions
    sections.forEach(section => {
        if (section.content) {
            allTextContent.push(`[${section.content}]`);
        }
    });

    // Add text blocks
    texts.forEach(text => {
        if (text.content) {
            allTextContent.push(text.content);
        }
    });

    // Add bullet lists
    bulletLists.forEach(bullets => {
        if (bullets.content) {
            const lines = bullets.content.split("\n").filter(l => l.trim());
            allTextContent.push(...lines);
        }
    });

    // Add hyperlinks
    hyperlinks.forEach(link => {
        if (link.content) {
            const url = link.style?.href || "";
            allTextContent.push(`${link.content}${url ? ` (${url})` : ""}`);
        }
    });

    if (resume.custom) {
        resume.custom.descriptions = allTextContent;
    }

    return resume;
};

/**
 * Converts resume form data to canvas components
 * This preserves the content when switching from form mode to canvas mode
 * Matches the PDF template styling as closely as possible
 */
export const resumeToCanvasComponents = (resume: Resume): CanvasComponent[] => {
    const components: CanvasComponent[] = [];

    // PDF-matching constants (1pt = 1.333px approximately)
    const PT_TO_PX = 1.333;
    const leftMargin = 40;  // Match PDF margins
    const componentWidth = 515; // A4 width minus margins
    let yOffset = 40; // Start with proper top margin

    // Font sizes matching PDF template (converted from pt to px)
    const FONT_SIZES = {
        name: Math.round(20 * PT_TO_PX),        // 20pt -> ~27px
        heading: Math.round(13 * PT_TO_PX),     // 13pt -> ~17px  (section headers)
        body: Math.round(11 * PT_TO_PX),        // 11pt -> ~15px (default body text)
        contact: Math.round(10 * PT_TO_PX),     // 10pt -> ~13px
    };

    // Spacing matching PDF (in pixels)
    const SPACING = {
        afterName: 8,
        afterContact: 12,
        afterDivider: 18,
        afterSection: 12,
        betweenItems: 15,
        bulletIndent: 15,
    };

    const DEFAULT_COLOR = "#171717"; // text-neutral-800 from PDF
    const DEFAULT_FONT = "Roboto, sans-serif"; // Match PDF default

    // Helper to add a component
    const addComp = (comp: Omit<CanvasComponent, "id" | "zIndex">) => {
        components.push({
            ...comp,
            id: `component-${Date.now()}-${Math.random()}-${components.length}`,
            zIndex: components.length,
        });
    };

    // 1. NAME (Profile.name) - Bold, 20pt
    if (resume.profile.name) {
        addComp({
            type: "heading",
            x: leftMargin,
            y: yOffset,
            width: componentWidth,
            height: Math.round(FONT_SIZES.name * 1.5), // Line height
            content: resume.profile.name,
            style: {
                fontSize: FONT_SIZES.name,
                fontWeight: "bold",
                color: DEFAULT_COLOR,
                fontFamily: DEFAULT_FONT,
                letterSpacing: "0px",
            },
        });
        yOffset += Math.round(FONT_SIZES.name * 1.5) + SPACING.afterName;
    }

    // 2. SUMMARY (Profile.summary) - Right after name if exists
    if (resume.profile.summary && resume.profile.summary.trim()) {
        const lines = Math.ceil(resume.profile.summary.length / 80);
        const summaryHeight = Math.max(lines * FONT_SIZES.body * 1.3, FONT_SIZES.body * 2);

        addComp({
            type: "text",
            x: leftMargin,
            y: yOffset,
            width: componentWidth,
            height: summaryHeight,
            content: resume.profile.summary,
            style: {
                fontSize: FONT_SIZES.body,
                fontWeight: "normal",
                color: DEFAULT_COLOR,
                fontFamily: DEFAULT_FONT,
                letterSpacing: "0px",
            },
        });
        yOffset += summaryHeight + SPACING.afterContact;
    }

    // 3. CONTACT INFO (Profile.email, phone, location, url) - Icons layout
    const contactParts = [
        resume.profile.email,
        resume.profile.phone,
        resume.profile.location,
        resume.profile.url,
    ].filter(Boolean);

    if (contactParts.length > 0) {
        addComp({
            type: "contact",
            x: leftMargin,
            y: yOffset,
            width: componentWidth,
            height: Math.round(FONT_SIZES.contact * 1.5),
            content: contactParts.join(" | "),
            style: {
                fontSize: FONT_SIZES.contact,
                fontWeight: "normal",
                color: DEFAULT_COLOR,
                fontFamily: DEFAULT_FONT,
                letterSpacing: "0px",
            },
        });
        yOffset += Math.round(FONT_SIZES.contact * 1.5) + SPACING.afterContact;
    }

    // 4. WORK EXPERIENCES (even if incomplete)
    if (resume.workExperiences && resume.workExperiences.length > 0) {
        // Check if at least one experience has any content
        const hasAnyWorkContent = resume.workExperiences.some(
            w => w.company || w.jobTitle || w.date || (w.descriptions && w.descriptions.length > 0)
        );

        if (hasAnyWorkContent) {
            addComp({
                type: "section",
                x: leftMargin,
                y: yOffset,
                width: componentWidth,
                height: Math.round(FONT_SIZES.heading * 1.5),
                content: "WORK EXPERIENCE",
                style: {
                    fontSize: FONT_SIZES.heading,
                    fontWeight: "bold",
                    color: DEFAULT_COLOR,
                    fontFamily: DEFAULT_FONT,
                    letterSpacing: "0px",
                },
            });
            yOffset += Math.round(FONT_SIZES.heading * 1.5) + SPACING.afterSection;

            resume.workExperiences.forEach(exp => {
                // Include even incomplete entries
                if (exp.company || exp.jobTitle || exp.date) {
                    const titleParts = [];
                    if (exp.jobTitle) titleParts.push(exp.jobTitle);
                    if (exp.company) titleParts.push(exp.company);
                    const expTitle = titleParts.join(" at ") || "Position";
                    const expText = `${expTitle}${exp.date ? ` (${exp.date})` : ""}`;

                    addComp({
                        type: "text",
                        x: leftMargin,
                        y: yOffset,
                        width: componentWidth,
                        height: Math.round(FONT_SIZES.body * 1.5),
                        content: expText,
                        style: {
                            fontSize: FONT_SIZES.body,
                            fontWeight: "bold",
                            color: DEFAULT_COLOR,
                            fontFamily: DEFAULT_FONT,
                            letterSpacing: "0px",
                        },
                    });
                    yOffset += Math.round(FONT_SIZES.body * 1.5) + 5;

                    if (exp.descriptions && exp.descriptions.length > 0) {
                        const bullets = exp.descriptions
                            .filter(d => d.trim())
                            .map(d => `• ${d}`)
                            .join("\n");
                        if (bullets) {
                            const bulletHeight = Math.max(40, exp.descriptions.length * FONT_SIZES.body * 1.4);
                            addComp({
                                type: "bulletList",
                                x: leftMargin,
                                y: yOffset,
                                width: componentWidth,
                                height: bulletHeight,
                                content: bullets,
                                style: {
                                    fontSize: FONT_SIZES.body,
                                    fontWeight: "normal",
                                    color: DEFAULT_COLOR,
                                    fontFamily: DEFAULT_FONT,
                                    letterSpacing: "0px",
                                },
                            });
                            yOffset += bulletHeight + SPACING.betweenItems;
                        }
                    } else {
                        yOffset += SPACING.betweenItems;
                    }
                }
            });
        }
    }

    // 5. EDUCATION (even if incomplete)
    if (resume.educations && resume.educations.length > 0) {
        const hasAnyEducation = resume.educations.some(
            e => e.school || e.degree || e.date || e.gpa || (e.descriptions && e.descriptions.length > 0)
        );

        if (hasAnyEducation) {
            addComp({
                type: "section",
                x: leftMargin,
                y: yOffset,
                width: componentWidth,
                height: 40,
                content: "Education",
                style: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#000000",
                },
            });
            yOffset += 45;

            resume.educations.forEach(edu => {
                if (edu.school || edu.degree) {
                    const eduParts = [];
                    if (edu.degree) eduParts.push(edu.degree);
                    if (edu.school) eduParts.push(edu.school);
                    const eduTitle = eduParts.join(" - ") || "Education";
                    const eduText = `${eduTitle}${edu.date ? ` (${edu.date})` : ""}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`;

                    addComp({
                        type: "text",
                        x: leftMargin,
                        y: yOffset,
                        width: componentWidth,
                        height: 30,
                        content: eduText,
                        style: {
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "#000000",
                        },
                    });
                    yOffset += 35;

                    if (edu.descriptions && edu.descriptions.length > 0) {
                        const bullets = edu.descriptions
                            .filter(d => d.trim())
                            .map(d => `• ${d}`)
                            .join("\n");
                        if (bullets) {
                            addComp({
                                type: "bulletList",
                                x: leftMargin,
                                y: yOffset,
                                width: componentWidth,
                                height: Math.max(40, edu.descriptions.length * 20),
                                content: bullets,
                                style: {
                                    fontSize: 12,
                                    color: "#000000",
                                },
                            });
                            yOffset += Math.max(40, edu.descriptions.length * 20) + 10;
                        }
                    }
                }
            });
        }
    }

    // 6. PROJECTS (even if incomplete)
    if (resume.projects && resume.projects.length > 0) {
        const hasAnyProject = resume.projects.some(
            p => p.project || p.date || (p.descriptions && p.descriptions.length > 0)
        );

        if (hasAnyProject) {
            addComp({
                type: "section",
                x: leftMargin,
                y: yOffset,
                width: componentWidth,
                height: 40,
                content: "Projects",
                style: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#000000",
                },
            });
            yOffset += 45;

            resume.projects.forEach(proj => {
                if (proj.project || proj.date) {
                    const projText = `${proj.project || "Project"}${proj.date ? ` (${proj.date})` : ""}`;

                    addComp({
                        type: "text",
                        x: leftMargin,
                        y: yOffset,
                        width: componentWidth,
                        height: 30,
                        content: projText,
                        style: {
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "#000000",
                        },
                    });
                    yOffset += 35;

                    if (proj.descriptions && proj.descriptions.length > 0) {
                        const bullets = proj.descriptions
                            .filter(d => d.trim())
                            .map(d => `• ${d}`)
                            .join("\n");
                        if (bullets) {
                            addComp({
                                type: "bulletList",
                                x: leftMargin,
                                y: yOffset,
                                width: componentWidth,
                                height: Math.max(40, proj.descriptions.length * 20),
                                content: bullets,
                                style: {
                                    fontSize: 12,
                                    color: "#000000",
                                },
                            });
                            yOffset += Math.max(40, proj.descriptions.length * 20) + 10;
                        }
                    }
                }
            });
        }
    }

    // 7. SKILLS
    if (resume.skills) {
        const hasSkillDescriptions = resume.skills.descriptions && resume.skills.descriptions.length > 0 &&
            resume.skills.descriptions.some(d => d.trim());
        const hasFeaturedSkills = resume.skills.featuredSkills &&
            resume.skills.featuredSkills.some(fs => fs.skill && fs.skill.trim());

        if (hasSkillDescriptions || hasFeaturedSkills) {
            addComp({
                type: "section",
                x: leftMargin,
                y: yOffset,
                width: componentWidth,
                height: 40,
                content: "Skills",
                style: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#000000",
                },
            });
            yOffset += 45;

            // Featured skills
            if (hasFeaturedSkills) {
                const featuredSkillsList = resume.skills.featuredSkills
                    .filter(fs => fs.skill && fs.skill.trim())
                    .map(fs => `${fs.skill} (${fs.rating}/5)`)
                    .join(" • ");

                if (featuredSkillsList) {
                    addComp({
                        type: "text",
                        x: leftMargin,
                        y: yOffset,
                        width: componentWidth,
                        height: 30,
                        content: featuredSkillsList,
                        style: {
                            fontSize: 12,
                            color: "#000000",
                        },
                    });
                    yOffset += 35;
                }
            }

            // Skill descriptions
            if (hasSkillDescriptions) {
                const skillBullets = resume.skills.descriptions
                    .filter(d => d.trim())
                    .map(d => `• ${d}`)
                    .join("\n");
                if (skillBullets) {
                    addComp({
                        type: "bulletList",
                        x: leftMargin,
                        y: yOffset,
                        width: componentWidth,
                        height: Math.max(40, resume.skills.descriptions.length * 20),
                        content: skillBullets,
                        style: {
                            fontSize: 12,
                            color: "#000000",
                        },
                    });
                    yOffset += Math.max(40, resume.skills.descriptions.length * 20) + 10;
                }
            }
        }
    }

    // 8. CUSTOM SECTION
    if (resume.custom && resume.custom.descriptions && resume.custom.descriptions.length > 0) {
        const customContent = resume.custom.descriptions
            .filter(d => d.trim())
            .join("\n");
        if (customContent) {
            addComp({
                type: "section",
                x: leftMargin,
                y: yOffset,
                width: componentWidth,
                height: 40,
                content: "Additional Information",
                style: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#000000",
                },
            });
            yOffset += 45;

            addComp({
                type: "text",
                x: leftMargin,
                y: yOffset,
                width: componentWidth,
                height: Math.max(60, resume.custom.descriptions.length * 20),
                content: customContent,
                style: {
                    fontSize: 14,
                    color: "#000000",
                },
            });
        }
    }

    return components;
};
