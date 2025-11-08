import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Link } from "components/documentation";

const FEATURES = [
  {
    src: featureFreeSrc,
    title: "Free Forever",
    text: "Project 0 is built on the belief that everyone deserves free and easy access to professional resume design—no hidden costs, no premium tiers, no compromises.",
  },
  {
    src: featureUSSrc,
    title: "India-Optimized",
    text: "Project 0 follows best practices for the Indian job market and ensures compatibility with top ATS platforms used by Indian recruiters, including Naukri, LinkedIn Recruiter, and Workday.",
  },
  {
    src: featurePrivacySrc,
    title: "Privacy First",
    text: "Project 0 stores all data locally in your browser. No cloud uploads, no server storage, no data mining—just you and your resume.",
  },
  {
    src: featureOpenSourceSrc,
    title: "Open Source",
    text: "Project 0 is an open-source initiative built with modern web technologies and transparent development practices, giving you full confidence in what happens under the hood.",
  },
];

export const Features = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to build your resume
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive toolkit to help you create the perfect resume
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ src, title, text }) => (
              <div
                key={title}
                className="relative rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <Image
                      src={src}
                      className="h-8 w-8"
                      alt="Feature icon"
                    />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
