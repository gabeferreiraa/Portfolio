import { profiles, site } from "../content";
import { profile } from "./config";

// Escapes text values per RFC 6350 §3.4
function esc(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

// vCard 3.0: the version iOS and Android Contacts both import cleanly
export function buildVCard() {
  const [first, ...rest] = site.name.split(" ");
  const last = rest.join(" ");
  const tel = site.phoneHref.replace(/^tel:/, "");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(last)};${esc(first)};;;`,
    `FN:${esc(site.name)}`,
    `TITLE:${esc(profile.positioning)}`,
    `EMAIL;TYPE=INTERNET,PREF:${site.email}`,
    `TEL;TYPE=CELL:${tel}`,
    `URL:${site.url}`,
    // itemN groups give each link a readable label in Apple Contacts
    ...profiles.flatMap((p, i) => [`item${i + 1}.URL:${p.href}`, `item${i + 1}.X-ABLabel:${esc(p.label)}`]),
    `NOTE:${esc(`${profile.school}, graduating ${profile.graduation}. Saved from ${site.url.replace(/^https?:\/\//, "")}/tap`)}`,
    "END:VCARD",
  ];
  return lines.join("\r\n") + "\r\n";
}
