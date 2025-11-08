import { Page, View, Document } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { ResumePDFCustomTemplate } from "components/Resume/ResumePDF/ResumePDFCustom2";
import { ResumePDFText } from "components/Resume/ResumePDF/common";
import { ResumePDFIcon } from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;
  const { name, email, phone, url, location } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
    resumeTemplate,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

  // If custom template is selected, use the custom template
  if (resumeTemplate === "custom") {
    return <ResumePDFCustomTemplate resume={resume} settings={settings} isPDF={isPDF} />;
  }

  // Default template
  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["skills"]}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
      />
    ),
  };

  return (
    <>
      <Document title={`${name} Resume`} author={name} producer={"Project 0"}>
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            ...styles.flexCol,
            color: "#4a4a4a",
            fontFamily: "Inter",
            fontSize: fontSize + "pt",
            padding: `${spacing[12]} ${spacing[12]}`,
          }}
        >
          {/* Header Section - Name and Contact */}
          <View style={{ marginBottom: spacing[5] }}>
            {/* Name */}
            <ResumePDFText
              style={{
                fontSize: "28pt",
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: "-0.5pt",
                marginBottom: spacing[2]
              }}
            >
              {name}
            </ResumePDFText>

            {/* Email and Phone Row - Fixed alignment */}
            <View style={{
              ...styles.flexRow,
              gap: spacing[4],
              alignItems: "center",
              marginBottom: spacing[2]
            }}>
              {email && (
                <View style={{
                  ...styles.flexRow,
                  gap: spacing[1.5],
                  alignItems: "center"
                }}>
                  <ResumePDFIcon type="email" isPDF={isPDF} />
                  <ResumePDFText style={{
                    fontSize: "9pt",
                    color: "#6b6b6b",
                    paddingTop: "1pt"
                  }}>
                    {email}
                  </ResumePDFText>
                </View>
              )}
              {phone && (
                <View style={{
                  ...styles.flexRow,
                  gap: spacing[1.5],
                  alignItems: "center"
                }}>
                  <ResumePDFIcon type="phone" isPDF={isPDF} />
                  <ResumePDFText style={{
                    fontSize: "9pt",
                    color: "#6b6b6b",
                    paddingTop: "1pt"
                  }}>
                    {phone}
                  </ResumePDFText>
                </View>
              )}
            </View>

            {/* Objective - if exists */}
            {profile.summary && (
              <ResumePDFText style={{
                fontSize: "9pt",
                color: "#4a4a4a",
                lineHeight: 1.4
              }}>
                {profile.summary.split('\n').slice(1).join(' ')}
              </ResumePDFText>
            )}
          </View>

          {/* Horizontal Line */}
          <View style={{
            height: "1pt",
            backgroundColor: "#d0d0d0",
            marginBottom: spacing[5]
          }} />

          {/* Experience Section */}
          {formToShow.workExperiences && workExperiences.length > 0 && (
            <View style={{ marginBottom: spacing[5] }}>
              <ResumePDFText bold={true} style={{
                fontSize: "11pt",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: spacing[3]
              }}>
                Experience
              </ResumePDFText>
              {workExperiences.map((exp, idx) => (
                <View key={idx} style={{ marginBottom: idx < workExperiences.length - 1 ? spacing[3] : 0 }}>
                  <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                    {/* Date Column - Fixed width for alignment */}
                    <View style={{
                      width: "85pt",
                      minWidth: "85pt",
                      marginRight: spacing[3],
                      paddingTop: "1pt"
                    }}>
                      <ResumePDFText style={{
                        fontSize: "8.5pt",
                        color: "#6b6b6b",
                        lineHeight: 1.3
                      }}>
                        {exp.date}
                      </ResumePDFText>
                    </View>

                    {/* Job Details Column */}
                    <View style={{ flex: 1 }}>
                      <ResumePDFText style={{
                        fontSize: "10pt",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        lineHeight: 1.3
                      }}>
                        {exp.jobTitle}
                      </ResumePDFText>
                      <ResumePDFText style={{
                        fontSize: "9pt",
                        color: "#6b6b6b",
                        marginTop: spacing[0.5],
                        lineHeight: 1.3
                      }}>
                        {exp.company}
                      </ResumePDFText>
                      {exp.descriptions && exp.descriptions.length > 0 && (
                        <View style={{ marginTop: spacing[1.5] }}>
                          {exp.descriptions.map((desc, i) => (
                            <View key={i} style={{
                              ...styles.flexRow,
                              alignItems: "flex-start",
                              marginBottom: i < exp.descriptions.length - 1 ? spacing[1] : 0
                            }}>
                              <ResumePDFText style={{
                                fontSize: "9pt",
                                color: "#4a4a4a",
                                marginRight: spacing[2],
                                lineHeight: 1.5,
                                width: "8pt"
                              }}>
                                •
                              </ResumePDFText>
                              <ResumePDFText style={{
                                fontSize: "9pt",
                                color: "#4a4a4a",
                                lineHeight: 1.5,
                                flex: 1
                              }}>
                                {desc}
                              </ResumePDFText>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {formToShow.educations && educations.length > 0 && (
            <View style={{ marginBottom: spacing[5] }}>
              <ResumePDFText bold={true} style={{
                fontSize: "11pt",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: spacing[3]
              }}>
                Education
              </ResumePDFText>
              {educations.map((edu, idx) => (
                <View key={idx} style={{
                  marginBottom: idx < educations.length - 1 ? spacing[2.5] : 0
                }}>
                  <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                    <View style={{
                      width: "85pt",
                      minWidth: "85pt",
                      marginRight: spacing[3],
                      paddingTop: "1pt"
                    }}>
                      <ResumePDFText style={{
                        fontSize: "8.5pt",
                        color: "#6b6b6b",
                        lineHeight: 1.3
                      }}>
                        {edu.date}
                      </ResumePDFText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <ResumePDFText style={{
                        fontSize: "9pt",
                        color: "#6b6b6b",
                        lineHeight: 1.3
                      }}>
                        {edu.school}
                      </ResumePDFText>
                      <ResumePDFText style={{
                        fontSize: "10pt",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        marginTop: spacing[0.5],
                        lineHeight: 1.3
                      }}>
                        {edu.degree}
                      </ResumePDFText>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {formToShow.projects && projects.length > 0 && (
            <View style={{ marginBottom: spacing[5] }}>
              <ResumePDFText bold={true} style={{
                fontSize: "11pt",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: spacing[3]
              }}>
                Projects
              </ResumePDFText>
              {projects.map((proj, idx) => (
                <View key={idx} style={{
                  marginBottom: idx < projects.length - 1 ? spacing[3] : 0
                }}>
                  <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                    <View style={{
                      width: "85pt",
                      minWidth: "85pt",
                      marginRight: spacing[3],
                      paddingTop: "1pt"
                    }}>
                      <ResumePDFText style={{
                        fontSize: "8.5pt",
                        color: "#6b6b6b",
                        lineHeight: 1.3
                      }}>
                        {proj.date}
                      </ResumePDFText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <ResumePDFText style={{
                        fontSize: "10pt",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        lineHeight: 1.3
                      }}>
                        {proj.project}
                      </ResumePDFText>
                      {proj.descriptions && proj.descriptions.length > 0 && (
                        <View style={{ marginTop: spacing[1.5] }}>
                          {proj.descriptions.map((desc, i) => (
                            <View key={i} style={{
                              ...styles.flexRow,
                              alignItems: "flex-start",
                              marginBottom: i < proj.descriptions.length - 1 ? spacing[1] : 0
                            }}>
                              <ResumePDFText style={{
                                fontSize: "9pt",
                                color: "#4a4a4a",
                                marginRight: spacing[2],
                                lineHeight: 1.5,
                                width: "8pt"
                              }}>
                                •
                              </ResumePDFText>
                              <ResumePDFText style={{
                                fontSize: "9pt",
                                color: "#4a4a4a",
                                lineHeight: 1.5,
                                flex: 1
                              }}>
                                {desc}
                              </ResumePDFText>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {formToShow.skills && (skills.descriptions.length > 0 || skills.featuredSkills.some(s => s.skill)) && (
            <View style={{ marginBottom: spacing[5] }}>
              <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                <ResumePDFText bold={true} style={{
                  fontSize: "11pt",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  width: "85pt",
                  minWidth: "85pt",
                  marginRight: spacing[3],
                  paddingTop: "1pt"
                }}>
                  Skills
                </ResumePDFText>
                <View style={{ flex: 1 }}>
                  {skills.descriptions.map((skill, idx) => (
                    <View key={idx} style={{
                      ...styles.flexRow,
                      alignItems: "flex-start",
                      marginBottom: idx < skills.descriptions.length - 1 ? spacing[1] : 0
                    }}>
                      <ResumePDFText style={{
                        fontSize: "9pt",
                        color: "#4a4a4a",
                        marginRight: spacing[2],
                        lineHeight: 1.5,
                        width: "8pt"
                      }}>
                        •
                      </ResumePDFText>
                      <ResumePDFText style={{
                        fontSize: "9pt",
                        color: "#4a4a4a",
                        lineHeight: 1.5,
                        flex: 1
                      }}>
                        {skill}
                      </ResumePDFText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Custom Section */}
          {formToShow.custom && custom.descriptions.length > 0 && (
            <View style={{ marginBottom: spacing[5] }}>
              <ResumePDFText bold={true} style={{
                fontSize: "11pt",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: spacing[3]
              }}>
                Additional
              </ResumePDFText>
              <View style={{ flex: 1 }}>
                {custom.descriptions.map((item, idx) => (
                  <View key={idx} style={{
                    ...styles.flexRow,
                    alignItems: "flex-start",
                    marginBottom: idx < custom.descriptions.length - 1 ? spacing[1] : 0
                  }}>
                    <ResumePDFText style={{
                      fontSize: "9pt",
                      color: "#4a4a4a",
                      marginRight: spacing[2],
                      lineHeight: 1.5,
                      width: "8pt"
                    }}>
                      •
                    </ResumePDFText>
                    <ResumePDFText style={{
                      fontSize: "9pt",
                      color: "#4a4a4a",
                      lineHeight: 1.5,
                      flex: 1
                    }}>
                      {item}
                    </ResumePDFText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
