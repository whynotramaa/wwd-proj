"use client";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ImportResume() {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const onFileUrlChange = (fileUrl: string) => {
    setHasAddedResume(Boolean(fileUrl));
  };

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
  }, []);

  return (
    <main className="min-h-[calc(100vh-var(--top-nav-bar-height))] bg-background py-16">
      <div className="mx-auto mt-14 max-w-3xl rounded-lg border border-border bg-card px-10 py-10 text-center shadow-lg">
        {!hasUsedAppBefore ? (
          <>
            <h1 className="text-lg font-semibold text-foreground">
              Import data from an existing resume
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
              className="mt-5"
            />
            {!hasAddedResume && (
              <>
                <OrDivider />
                <SectionWithHeadingAndCreateButton
                  heading="Don't have a resume yet?"
                  buttonText="Create from scratch"
                />
              </>
            )}
          </>
        ) : (
          <>
            {!hasAddedResume && (
              <>
                <SectionWithHeadingAndCreateButton
                  heading="You have data saved in browser from prior session"
                  buttonText="Continue where I left off"
                />
                <OrDivider />
              </>
            )}
            <h1 className="font-semibold text-foreground">
              Override data with a new resume
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
              className="mt-5"
            />
          </>
        )}
      </div>
    </main>
  );
}

const OrDivider = () => (
  <div className="mx-[-2.5rem] flex items-center pb-6 pt-8" aria-hidden="true">
    <div className="flex-grow border-t border-border" />
    <span className="mx-2 mt-[-2px] flex-shrink text-lg text-muted-foreground">or</span>
    <div className="flex-grow border-t border-border" />
  </div>
);

const SectionWithHeadingAndCreateButton = ({
  heading,
  buttonText,
}: {
  heading: string;
  buttonText: string;
}) => {
  return (
    <>
      <p className="font-semibold text-foreground">{heading}</p>
      <div className="mt-5">
        <Link
          href="/resume-builder"
          className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors inline-block"
        >
          {buttonText}
        </Link>
      </div>
    </>
  );
};
