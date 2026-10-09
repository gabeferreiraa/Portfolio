import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type SubmitEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { validateContact as validate, type ContactErrors as Errors, type ContactField } from "../contact-schema";
import { sendContactMessage } from "../server/contact";
import { site } from "../content";

type Fields = Record<ContactField, string>;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: Fields = { firstName: "", lastName: "", email: "", message: "" };
const ORDER: ContactField[] = ["firstName", "lastName", "email", "message"];

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
      <div>
        <h3 ref={successRef} tabIndex={-1} className="font-medium">
          Message sent
        </h3>
        <p className="mt-1 text-muted">
          Thanks, {sentTo.name}. I&apos;ll reply to {sentTo.email} as soon as I can.
        </p>
        <button type="button" onClick={reset} className="mt-4 cursor-pointer py-1 underline decoration-[var(--underline)] underline-offset-[0.2em] hover:decoration-current">
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-labelledby="contact-form-heading" className="space-y-5">
      <h3 id="contact-form-heading" className="sr-only">
        Contact form
      </h3>

      <p className="text-sm text-muted">All fields are required.</p>

      <fieldset className="border-0 p-0">
        <legend className="sr-only">Your name</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
        label="Email"
        type="email"
        autoComplete="email"
        hint="Only used to reply to you."
        value={fields.email}
        error={showError("email") ? errors.email : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        name="message"
        label="Message"
        multiline
        hint="At least 10 characters."
        value={fields.message}
        error={showError("message") ? errors.message : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Honeypot: inert removes it from the accessibility tree and tab order */}
      <div inert className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div role="status" aria-live="polite" className="text-sm">
        {status === "error" && (
          <p className="text-error">
            {serverError} <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        )}
        {submitting && <span className="sr-only">Sending your message…</span>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="min-h-11 cursor-pointer rounded-md bg-fg px-5 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send message"}
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
    "w-full rounded-md border bg-transparent px-3 py-2.5 text-base text-fg transition-colors",
    error ? "border-error" : "border-field hover:border-fg",
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
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={5} className={`${className} resize-y`} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} className={className} />
      )}
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-error">
          <span aria-hidden="true">! </span>
          {error}
        </p>
      )}
    </div>
  );
}
