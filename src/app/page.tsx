import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";
import { Testimonials } from "home/Testimonials";
import { QuestionsAndAnswers } from "home/QuestionsAndAnswers";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Features />
      <Steps />
      <Testimonials />
      <QuestionsAndAnswers />
    </main>
  );
}
