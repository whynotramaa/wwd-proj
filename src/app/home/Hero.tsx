import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:py-24">
          <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:col-span-6 lg:flex lg:items-center lg:px-0 lg:text-left">
            <div className="lg:py-24">
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl">
                <span className="block">Build your professional</span>
                <span className="block text-primary">resume in minutes</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Free, open-source, and powerful resume builder designed for the Indian job market. Create ATS-friendly resumes with ease.
              </p>
              <div className="mt-8 sm:mt-10">
                <div className="sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md">
                    <Link
                      href="/resume-import"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 md:px-10 md:py-4 md:text-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md sm:ml-3 sm:mt-0">
                    <Link
                      href="/ats-verifier"
                      className="flex w-full items-center justify-center rounded-md border border-border bg-background px-8 py-3 text-base font-medium text-foreground hover:bg-accent md:px-10 md:py-4 md:text-lg"
                    >
                      Test JD Match
                    </Link>
                  </div>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">
                  No sign up required. Your data stays private in your browser.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:col-span-6 lg:mt-0">
            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
              <div className="relative">
                <Image
                  src="/resume.png"
                  alt="Resume Example"
                  width={800}
                  height={1000}
                  className="rounded-lg shadow-2xl"
                  priority
                />

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
