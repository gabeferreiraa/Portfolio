"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [fields, setFields] = useState<FormFields>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  /* Spotlight pointer tracking */
  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("light", saved === "light");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("light", next === "light");
      return next;
    });
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /* Validation */
  function validate(data: FormFields): FormErrors {
    const errs: FormErrors = {};
    if (!data.firstName.trim()) errs.firstName = "First name is required.";
    if (!data.lastName.trim()) errs.lastName = "Last name is required.";
    if (!data.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      errs.email = "Please enter a valid email address (e.g. name@example.com).";
    }
    if (!data.message.trim()) {
      errs.message = "Message cannot be empty.";
    } else if (data.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters.";
    }
    return errs;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name]) {
      setErrors(validate(updated));
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(fields));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const allTouched = { firstName: true, lastName: true, email: true, message: true };
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  }

  /* Helper: field wrapper classes */
  const inputBase =
    "w-full rounded-md border bg-primary-mid/20 px-4 py-3 text-foreground placeholder-neutral-mid text-sm leading-normal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary-mid focus:border-tertiary-mid";

  const inputValid = "border-neutral-dark hover:border-neutral-mid";
  const inputError = "border-red-500 bg-red-950/20";

  function fieldClass(name: keyof FormErrors) {
    return `${inputBase} ${errors[name] && touched[name] ? inputError : inputValid}`;
  }

  return (
    <>
      {/* Skip link */}
      <a href="#contact-form" className="skip-link">
        Skip to contact form
      </a>

      <div role="presentation" className="bg-background text-foreground transition-colors duration-300">
        <div role="presentation" className="group/spotlight relative">
          {/* Spotlight overlay */}
          <div
            ref={spotlightRef}
            className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute spotlight-bg"
            aria-hidden="true"
          />

          <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
            <div className="lg:flex lg:justify-between lg:gap-10">

              {/* LEFT COLUMN */}
              <header aria-label="Gabriel Ferreira – Contact" className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    <Link
                      href="/"
                      className="text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      aria-label="Gabriel Ferreira – Return to home page"
                    >
                      Gabriel Ferreira
                    </Link>
                  </h1>

                  <p
                    className="mt-3 text-base font-medium tracking-tight sm:text-lg"
                    role="doc-subtitle"
                  >
                    Frontend Engineer
                  </p>

                  <p className="mt-4 max-w-xs leading-normal text-foreground">
                    Have a question or want to work together? Fill out the form
                    and I&apos;ll get back to you as soon as possible.
                  </p>

                  {/* Mobile hamburger button */}
                  <button
                    type="button"
                    className="mt-6 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-foreground/10 transition-colors lg:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-controls="nav-menu"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      {menuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      )}
                    </svg>
                    Menu
                  </button>

                  {/* Page navigation */}
                  <nav
                    id="nav-menu"
                    className={`${menuOpen ? "block" : "hidden"} lg:block`}
                    aria-label="Page navigation"
                  >
                    <ul className="mt-4 w-max lg:mt-16" role="list" aria-label="Page sections">
                      <li aria-label="About">
                        <Link
                          className="group flex items-center py-3"
                          href="/"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span
                            className="nav-indicator mr-4 h-px w-8 bg-foreground/30 group-hover:w-16 group-hover:bg-foreground group-focus-visible:w-16 group-focus-visible:bg-foreground motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-colors duration-200">
                            About
                          </span>
                        </Link>
                      </li>
                      <li aria-label="Experience">
                        <Link
                          className="group flex items-center py-3"
                          href="/experience"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span
                            className="nav-indicator mr-4 h-px w-8 bg-foreground/30 group-hover:w-16 group-hover:bg-foreground group-focus-visible:w-16 group-focus-visible:bg-foreground motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-colors duration-200">
                            Experience
                          </span>
                        </Link>
                      </li>
                      <li aria-label="Contact">
                        <Link
                          className="group flex items-center py-3"
                          href="/contact"
                          aria-current="page"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span
                            className="nav-indicator mr-4 h-px w-16 bg-foreground motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground transition-colors duration-200">
                            Contact
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>

                {/* Social links + theme toggle */}
                <div role="presentation" className="ml-1 mt-8 flex items-center gap-5">
                  <nav aria-label="Social media links">
                    <ul className="flex items-center gap-5" role="list" aria-label="Social media profiles">
                      <li className="shrink-0 text-xs" aria-label="GitHub">
                        <a
                          className="block text-foreground hover:text-foreground focus-visible:text-foreground transition-colors"
                          href="https://github.com/gabeferreiraa"
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label="GitHub profile (opens in a new tab)"
                          title="GitHub"
                        >
                          <span className="sr-only">GitHub</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                          </svg>
                        </a>
                      </li>
                      <li className="shrink-0 text-xs" aria-label="LinkedIn">
                        <a
                          className="block text-foreground hover:text-foreground focus-visible:text-foreground transition-colors"
                          href="https://www.linkedin.com/in/gabriel-ferreira-544b95251/"
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label="LinkedIn profile (opens in a new tab)"
                          title="LinkedIn"
                        >
                          <span className="sr-only">LinkedIn</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </nav>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-md p-2 text-foreground hover:text-foreground hover:bg-foreground/10 focus-visible:text-foreground transition-colors"
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {theme === "dark" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </header>

              {/* RIGHT COLUMN */}
              <main
                id="contact-form"
                aria-label="Contact form"
                tabIndex={-1}
                className="pt-24 lg:w-1/2 lg:py-24"
              >
                <section
                  aria-labelledby="contact-heading"
                  className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                >
                  {/* Section header (sticky on mobile/tablet) */}
                  <header aria-label="Contact Me Section" className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:bg-transparent">
                    <h2
                      id="contact-heading"
                      className="text-sm font-bold uppercase tracking-widest text-foreground lg:text-2xl lg:font-bold lg:tracking-tight lg:normal-case"
                    >
                      Contact Me
                    </h2>
                  </header>

                  {/* Success state */}
                  {submitted ? (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="rounded-lg border border-tertiary-mid/30 bg-tertiary-mid/10 p-8 text-center animate-fade-in"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto mb-4 h-12 w-12 text-tertiary-mid"
                        aria-hidden="true"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <h3 className="mb-2 text-xl font-bold text-foreground">
                        Message Sent!
                      </h3>
                      <p className="text-foreground">
                        Thanks for reaching out,{" "}
                        <span className="font-medium text-tertiary-mid">
                          {fields.firstName}
                        </span>
                        . I&apos;ll get back to you at{" "}
                        <span className="font-medium text-foreground">
                          {fields.email}
                        </span>{" "}
                        as soon as possible.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFields({ firstName: "", lastName: "", email: "", message: "" });
                          setTouched({});
                          setErrors({});
                        }}
                        className="mt-6 rounded-full border border-tertiary-mid px-6 py-2 text-sm font-medium text-tertiary-mid transition-colors hover:bg-tertiary-mid hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary-mid focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    /* Contact form */
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      aria-label="Contact form"
                      className="space-y-6"
                    >
                      {/* Name row */}
                      <fieldset className="border-0 p-0 m-0">
                        <legend className="sr-only">Your name</legend>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {/* First Name */}
                          <div>
                            <label
                              htmlFor="firstName"
                              className="mb-2 block text-xs font-bold uppercase tracking-widest text-foreground"
                            >
                              First Name{" "}
                              <span className="text-red-400" aria-hidden="true">*</span>
                            </label>
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              autoComplete="given-name"
                              required
                              aria-required="true"
                              aria-invalid={!!(errors.firstName && touched.firstName)}
                              aria-describedby={
                                errors.firstName && touched.firstName
                                  ? "firstName-error"
                                  : undefined
                              }
                              value={fields.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Jane"
                              className={fieldClass("firstName")}
                            />
                            {errors.firstName && touched.firstName && (
                              <p
                                id="firstName-error"
                                role="alert"
                                className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {errors.firstName}
                              </p>
                            )}
                          </div>

                          {/* Last Name */}
                          <div>
                            <label
                              htmlFor="lastName"
                              className="mb-2 block text-xs font-bold uppercase tracking-widest text-foreground"
                            >
                              Last Name{" "}
                              <span className="text-red-400" aria-hidden="true">*</span>
                            </label>
                            <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              autoComplete="family-name"
                              required
                              aria-required="true"
                              aria-invalid={!!(errors.lastName && touched.lastName)}
                              aria-describedby={
                                errors.lastName && touched.lastName
                                  ? "lastName-error"
                                  : undefined
                              }
                              value={fields.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Doe"
                              className={fieldClass("lastName")}
                            />
                            {errors.lastName && touched.lastName && (
                              <p
                                id="lastName-error"
                                role="alert"
                                className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 000-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                      </fieldset>

                      {/* Email Address */}
                      <div className="mt-6">
                        <label
                          htmlFor="email"
                          className="mb-2 block text-xs font-bold uppercase tracking-widest text-foreground"
                          aria-label="Email Address Input"
                        >
                          Email Address{" "}
                          <span className="text-red-400" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          aria-required="true"
                          aria-invalid={!!(errors.email && touched.email)}
                          aria-describedby={
                            errors.email && touched.email ? "email-error" : "email-hint"
                          }
                          value={fields.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="jane@example.com"
                          className={fieldClass("email")}
                        />
                        <p id="email-hint" className="mt-1.5 text-xs text-foreground">
                          I&apos;ll only use your email to reply to you.
                        </p>
                        {errors.email && touched.email && (
                          <p
                            id="email-error"
                            role="alert"
                            className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 000-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="mb-2 block text-xs font-bold uppercase tracking-widest text-foreground"
                          aria-label="Message Input"
                        >
                          Message{" "}
                          <span className="text-red-400" aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          required
                          aria-required="true"
                          aria-invalid={!!(errors.message && touched.message)}
                          aria-describedby={
                            errors.message && touched.message
                              ? "message-error"
                              : "message-hint"
                          }
                          value={fields.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Tell me about your project, question, or just say hello..."
                          className={`${fieldClass("message")} resize-y`}
                        />
                        <p id="message-hint" className="mt-1.5 text-xs text-foreground">
                          Minimum 10 characters.
                        </p>
                        {errors.message && touched.message && (
                          <p
                            id="message-error"
                            role="alert"
                            className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 000-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Required fields note */}
                      <p className="text-xs text-foreground">
                        <span className="text-red-400" aria-hidden="true">*</span>{" "}
                        Required fields
                      </p>

                      {/* Submit */}
                      <div>
                        <button
                          type="submit"
                          className="group/btn submit-btn inline-flex items-center gap-2 rounded-full bg-tertiary-mid px-8 py-3 text-sm font-bold text-background transition-all duration-200 hover:bg-tertiary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary-mid focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
                        >
                          Send Message
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none"
                            aria-hidden="true"
                          >
                            <path d="M3.105 2.288a.75.75 0 00-.826.95l1.414 4.926A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.897 28.897 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.288z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  )}
                </section>

                {/* Footer */}
                <footer aria-label="Site credits and contact information" className="max-w-md pb-16 text-sm text-foreground sm:pb-0">
                  <p>
                    Built with{" "}
                    <a
                      href="https://nextjs.org/"
                      className="font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Next.js React framework (opens in a new tab)"
                    >
                      Next.js
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://tailwindcss.com/"
                      className="font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Tailwind CSS framework (opens in a new tab)"
                    >
                      Tailwind CSS
                    </a>
                    .
                  </p>
                  <address className="mt-6 not-italic">
                    <a
                      href="mailto:gferreira0404@gmail.com"
                      className="font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      aria-label="Send email to Gabriel Ferreira"
                    >
                      gferreira0404@gmail.com
                    </a>
                  </address>
                </footer>
              </main>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
