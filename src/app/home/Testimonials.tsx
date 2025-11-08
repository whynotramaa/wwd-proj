"use client";
import heartSrc from "public/assets/heart.svg";
import testimonialSpiegelSrc from "public/assets/testimonial-spiegel.jpg";
import testimonialSantiSrc from "public/assets/testimonial-santi.jpg";
import testimonialVivianSrc from "public/assets/testimonial-vivian.jpg";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";

const TESTIMONIALS = [
  {
    src: testimonialSpiegelSrc,
    quote:
      "Many students make avoidable mistakes on their resumes—inconsistent formatting, mismatched fonts. Project 0's auto-format feature ensures everything looks polished and professional.",
    name: "Ms. Kapoor",
    title: "Career Counselor",
  },
  {
    src: testimonialSantiSrc,
    quote:
      "I used Project 0 for my campus placements and received interview calls from companies like TCS, Infosys, and Flipkart. The clean design made all the difference.",
    name: "Rahul",
    title: "Engineering Graduate",
  },
  {
    src: testimonialVivianSrc,
    quote:
      "Building a professional resume on Project 0 is incredibly smooth! It saved me hours of struggling with Word templates and formatting nightmares.",
    name: "Priya",
    title: "MBA Student",
  },
];

const LG_TESTIMONIALS_CLASSNAMES = [
  "z-10",
  "translate-x-44 translate-y-24 opacity-40",
  "translate-x-32 -translate-y-28 opacity-40",
];
const SM_TESTIMONIALS_CLASSNAMES = ["z-10", "opacity-0", "opacity-0"];
const ROTATION_INTERVAL_MS = 8 * 1000; // 8s

export const Testimonials = ({ children }: { children?: React.ReactNode }) => {
  const [testimonialsClassNames, setTestimonialsClassNames] = useState(
    LG_TESTIMONIALS_CLASSNAMES
  );
  const isHoveredOnTestimonial = useRef(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isHoveredOnTestimonial.current) {
        setTestimonialsClassNames((preClassNames) => {
          return [preClassNames[1], preClassNames[2], preClassNames[0]];
        });
      }
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const { isLg } = useTailwindBreakpoints();
  useEffect(() => {
    setTestimonialsClassNames(
      isLg ? LG_TESTIMONIALS_CLASSNAMES : SM_TESTIMONIALS_CLASSNAMES
    );
  }, [isLg]);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by job seekers across India
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">

          </p>
        </div>
      </div>
      <div className="mx-auto mt-10 h-[235px] max-w-lg px-8 lg:h-[400px] lg:pt-28">
        <div className="relative lg:ml-[-50px]">
          {TESTIMONIALS.map(({ src, quote, name, title }, idx) => {
            const className = testimonialsClassNames[idx];
            return (
              <div
                key={idx}
                className={`absolute max-w-lg rounded-[1.7rem] bg-primary/20 shadow-lg transition-all duration-1000 ease-linear ${className}`}
                onMouseEnter={() => {
                  if (className === "z-10") {
                    isHoveredOnTestimonial.current = true;
                  }
                }}
                onMouseLeave={() => {
                  if (className === "z-10") {
                    isHoveredOnTestimonial.current = false;
                  }
                }}
              >
                <figure className="m-1 flex gap-5 rounded-3xl border border-border bg-card p-5 text-card-foreground lg:p-7">
                  <Image
                    className="hidden h-24 w-24 select-none rounded-full lg:block"
                    src={src}
                    alt="profile"
                  />
                  <div>
                    <blockquote>
                      <p className="text-foreground before:content-['\201C'] after:content-['\201D']">
                        {quote}
                      </p>
                    </blockquote>
                    <figcaption className="mt-3">
                      <div className="hidden gap-2 lg:flex">
                        <div className="font-semibold text-foreground">{name}</div>
                        <div
                          className="select-none text-muted-foreground"
                          aria-hidden="true"
                        >
                          •
                        </div>
                        <div className="text-muted-foreground">{title}</div>
                      </div>
                      <div className="flex gap-4 lg:hidden">
                        <Image
                          className=" block h-12 w-12 select-none rounded-full"
                          src={src}
                          alt="profile"
                        />
                        <div>
                          <div className="font-semibold text-foreground">{name}</div>
                          <div className="text-muted-foreground">{title}</div>
                        </div>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </section>
  );
};
