import { Link } from "components/documentation";

const QAS = [
  {
    question:
      "Q1. What is a resume builder? Why is it better than a Word template?",
    answer: (
      <>
        <p>
          There are two common ways to create a resume: using a template (like a Word or Google Docs file) and customizing it manually, or using a resume builder that automates formatting for you.
        </p>
        <p>
          Resume templates require significant manual work—copying text, adjusting spacing, maintaining consistency—which is time-consuming and prone to errors. It's easy to end up with mismatched fonts, inconsistent bullet points, or spacing issues.
        </p>
        <p>
          A resume builder like Project 0 eliminates these hassles by handling formatting automatically. Want to change fonts? One click. Need to adjust margins? Instant preview. In short, resume builders save time and reduce errors.
        </p>
      </>
    ),
  },
  {
    question:
      "Q2. What makes Project 0 different from other resume builders?",
    answer: (
      <>
        <p>
          While there are other quality resume builders available (like <Link href="https://rxresu.me/">Reactive Resume</Link> and{" "}
          <Link href="https://flowcv.com/">FlowCV</Link>), Project 0 stands out in two crucial ways:
        </p>
        <p>
          <span className="font-semibold">1. Built for India</span>
          <br />
          Project 0 is specifically designed for the Indian job market. Unlike global tools that offer extensive customization (often leading to resume mistakes), Project 0 intentionally limits options to align with Indian hiring best practices:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>No profile picture option (to prevent bias)</li>
          <li>Focus on core sections: Profile, Experience, Education, Skills</li>
          <li>Single-column layout optimized for Indian ATS systems</li>
          <li>Templates that match expectations of Indian recruiters</li>
        </ul>
        <p>
          <span className="font-semibold">2. Privacy Without Compromise</span>
          <br />
          Most resume builders require email sign-up and store your data on their servers. Project 0 takes a different approach: zero sign-ups, zero cloud storage. Everything stays in your browser, giving you complete control and privacy.
        </p>
      </>
    ),
  },
  {
    question: "Q3. Who created Project 0 and why?",
    answer: (
      <>
        <p>
          Project 0 was created to help Indian job seekers build professional resumes that follow industry best practices. Many first-time job seekers make common mistakes that hurt their chances—poor formatting, irrelevant sections, non-ATS-friendly designs.
        </p>
        <p>
          This tool was built to integrate proven resume strategies into an intuitive interface. Our mission is to help every Indian job seeker—from college students to experienced professionals—create modern, professional resumes and apply for opportunities with confidence.
        </p>
      </>
    ),
  },
  {
    question: "Q4. How can I support Project 0?",
    answer: (
      <>
        <p>
          The best way to support Project 0 is to share your experience and feedback with us. Whether you love it or think something could be better, we want to hear from you at{" "}
          <Link href="mailto:rama.240000@gmail.com">our support email</Link>
        </p>
        <p>
          You can also help by spreading the word:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Share Project 0 with friends and classmates</li>
          <li>Post about it on LinkedIn or Twitter</li>
          <li>Recommend it to your college's placement cell</li>
          <li>Leave a review or star us on GitHub</li>
        </ul>
        <p>
          Our goal is to reach every job seeker in India who struggles with resume creation, and your word-of-mouth support makes that possible.
        </p>
      </>
    ),
  },
];

export const QuestionsAndAnswers = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">

            </p>
          </div>
          <div className="mt-12 divide-y divide-border">
            {QAS.map(({ question, answer }) => (
              <div key={question} className="py-6">
                <h3 className="text-lg font-semibold leading-7 text-foreground">{question}</h3>
                <div className="mt-3 grid gap-2 leading-7 text-muted-foreground">
                  {answer}
                </div>
              </div>
            ))}
            <div className="mt-4 text-gray-500 text-center">
              <br />
              <h4>
                Created with ❤️ by Rama, Aaditya, Riit, Kurmi and Vivek
              </h4>
            </div>
          </div>
        </div>
      </div>

    </section>

  );
};
