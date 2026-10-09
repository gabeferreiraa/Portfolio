// Shared by the client form and the server function. Plain TS keeps the client bundle small.

export type ContactField = "firstName" | "lastName" | "email" | "message";
export type ContactInput = Record<ContactField, string> & { company?: string };
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(data: Record<ContactField, string>): ContactErrors {
  const errs: ContactErrors = {};
  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  if (!firstName) errs.firstName = "First name is required.";
  else if (firstName.length > 100) errs.firstName = "First name is too long.";
  if (!lastName) errs.lastName = "Last name is required.";
  else if (lastName.length > 100) errs.lastName = "Last name is too long.";
  if (!email) errs.email = "Email address is required.";
  else if (email.length > 254 || !EMAIL.test(email))
    errs.email = "Please enter a valid email address (e.g. name@example.com).";
  if (!message) errs.message = "Message cannot be empty.";
  else if (message.length < 10) errs.message = "Message must be at least 10 characters.";
  else if (message.length > 5000) errs.message = "Message must be under 5000 characters.";
  return errs;
}

// Server-side parse of untrusted input
export function parseContact(input: unknown): ContactInput {
  const o = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const data = {
    firstName: str(o.firstName).trim(),
    lastName: str(o.lastName).trim(),
    email: str(o.email).trim(),
    message: str(o.message).trim(),
    company: str(o.company),
  };
  const errs = validateContact(data);
  const first = Object.values(errs)[0];
  if (first) throw new Error(first);
  return data;
}
