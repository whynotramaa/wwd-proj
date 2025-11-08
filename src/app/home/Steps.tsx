const STEPS = [
  { title: "Import or Start Fresh", text: "Upload your existing resume to extract information automatically, or begin building from scratch with our guided interface." },
  { title: "Customize and Edit", text: "Preview your design in real-time and make instant adjustments. See exactly what recruiters will see as you build." },
  { title: "Download and Apply", text: "Export your ATS-optimized resume as a PDF and start applying to your dream roles with confidence." },
];

export const Steps = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Create your professional resume in three simple steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">

          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map(({ title, text }, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                    <span className="text-2xl font-bold text-primary">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    {text}
                  </p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-border md:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
