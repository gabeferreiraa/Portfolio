import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type SubmitEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { contactSchema, type ContactField } from "../contact-schema";
import { sendContactMessage } from "../server/contact";
import { site } from "../content";

type Fields = Record<ContactField, string>;
type Errors = Partial<Record<ContactField, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: Fields = { firstName: "", lastName: "", email: "", message: "" };
const ORDER: ContactField[] = ["firstName", "lastName", "email", "message"];

function validate(data: Fields): Errors {
  const result = contactSchema.safeParse(data);
  if (result.success) return {};
  const errs: Errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as ContactField;
    errs[key] ??= issue.message;
  }
  return errs;
}

export function ContactForm() {
  const send = useServerFn(sendContactMessage);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [sentTo, setSentTo] = useState({ name: "", email: "" });

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as ContactField;
    const updated = { ...fields, [name]: e.target.value };
    setFields(updated);
    if (touched[name]) setErrors(validate(updated));
  }

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as ContactField;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(fields));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(fields);
    setTouched({ firstName: true, lastName: true, email: true, message: true });
    setErrors(errs);

    const firstInvalid = ORDER.find((k) => errs[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const company = new FormData(e.currentTarget).get("company")?.toString() ?? "";
    setStatus("submitting");
    setServerError("");
    try {
      const res = await send({ data: { ...fields, company } });
      if (res.ok) {
        setSentTo({ name: fields.firstName.trim(), email: fields.email.trim() });
        setStatus("success");
      } else {
        setServerError(res.error);
        setStatus("error");
      }
    } catch {
      setServerError("Something went wrong sending your message. Please try again or email me directly.");
      setStatus("error");
    }
  }

  function reset() {
    setFields(EMPTY);
    setTouched({});
    setErrors({});
    setServerError("");
    setStatus("idle");
  }

  const showError = (k: ContactField) => Boolean(errors[k] && touched[k]);

  if (status === "success") {
    return (
      <div className="rounded-lg border border-tertiary-mid/30 bg-tertiary-mid/10 p-8 text-center">
        <svg
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
        <h3 ref={successRef} tabIndex={-1} className="mb-2 text-xl font-bold text-neutral-white">
          Message sent!
        </h3>
        <p className="mx-auto text-neutral-light">
          Thanks for reaching out, <span className="font-medium text-tertiary-mid">{sentTo.name}</span>.
          I&apos;ll get back to you at <span className="font-medium text-neutral-white">{sentTo.email}</span>{" "}
          as soon as possible.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full border border-tertiary-mid px-6 py-2 text-sm font-medium text-tertiary-mid transition-colors hover:bg-tertiary-mid hover:text-primary-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-labelledby="contact-form-heading" className="space-y-6">
      <h3 id="contact-form-heading" className="sr-only">
        Contact form
      </h3>

      <p className="text-xs text-neutral-mid">
        Fields marked <span className="text-error" aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">Your name</legend>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field
            name="firstName"
            label="First name"
            autoComplete="given-name"
            value={fields.firstName}
            error={showError("firstName") ? errors.firstName : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Field
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            value={fields.lastName}
            error={showError("lastName") ? errors.lastName : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </fieldset>

      <Field
        name="email"
        label="Email address"
        type="email"
        autoComplete="email"
        hint="I'll only use your email to reply to you."
        value={fields.email}
        error={showError("email") ? errors.email : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        name="message"
        label="Message"
        multiline
        hint="Minimum 10 characters."
        value={fields.message}
        error={showError("message") ? errors.message : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div role="status" aria-live="polite" className="text-sm">
        {status === "error" && (
          <p className="text-error">
            {serverError}{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-neutral-white underline">
              {site.email}
            </a>
          </p>
        )}
        {submitting && <span className="sr-only">Sending your message…</span>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group/btn inline-flex items-center gap-2 rounded-full bg-tertiary-mid px-8 py-3 text-sm font-bold text-primary-dark transition-all duration-200 hover:bg-tertiary-light active:scale-95 disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Sending…" : "Send message"}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
          aria-hidden="true"
        >
          <path d="M3.105 2.288a.75.75 0 00-.826.95l1.414 4.926A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.897 28.897 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.288z" />
        </svg>
      </button>
    </form>
  );
}

type FieldProps = {
  name: ContactField;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function Field({ name, label, value, error, hint, type = "text", autoComplete, multiline, onChange, onBlur }: FieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const className = [
    "w-full rounded-md border bg-primary-mid/20 px-4 py-3 text-sm leading-normal text-neutral-white placeholder-neutral-mid transition-colors duration-200 focus:border-tertiary-mid",
    error ? "border-error" : "border-neutral-dark hover:border-neutral-mid",
  ].join(" ");

  const shared = {
    id: name,
    name,
    value,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onChange,
    onBlur,
  };

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs font-bold uppercase tracking-widest text-neutral-light">
        {label} <span className="text-error" aria-hidden="true">*</span>
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} className={`${className} resize-y`} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} className={className} />
      )}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-neutral-mid">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 flex items-center gap-1.5 text-xs text-error">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
