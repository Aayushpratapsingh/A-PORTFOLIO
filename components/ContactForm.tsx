"use client";

import { FormEvent, useRef, useState } from "react";

const contactEmail = "aayushpratapsingh098@gmail.com";

type SubmissionState = "idle" | "opening" | "ready" | "invalid" | "error";

export default function ContactForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      setState("invalid");
      form.querySelector<HTMLElement>(":invalid")?.focus();
      form.reportValidity();
      return;
    }

    setState("opening");
    const values = new FormData(form);
    const subject = `Portfolio inquiry from ${String(values.get("name"))}`;
    const body = [
      `Name: ${String(values.get("name"))}`,
      `Email: ${String(values.get("email"))}`,
      "",
      String(values.get("message")),
    ].join("\n");
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Preserve the site's existing mailto endpoint; the visitor sends the draft in their own email app.
    window.setTimeout(() => {
      try {
        window.location.href = mailtoUrl;
        setState("ready");
      } catch {
        setState("error");
      }
    }, 120);
  }

  return (
    <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="contact-form__field">
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} />
      </div>
      <div className="contact-form__field">
        <label htmlFor="contact-email">Email address</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} />
      </div>
      <div className="contact-form__field">
        <label htmlFor="contact-message">What would you like to work on?</label>
        <textarea id="contact-message" name="message" rows={4} required minLength={10} maxLength={5000} />
      </div>
      <div className="contact-form__actions">
        <button className="contact-form__submit motion-control" type="submit" disabled={state === "opening"}>
          {state === "opening" ? "Opening email…" : "Prepare email"}
          <span aria-hidden="true">↗</span>
        </button>
        <p className={`contact-form__status contact-form__status--${state}`} aria-live="polite" role="status">
          {state === "opening" && "Preparing your message…"}
          {state === "ready" && <>Your email app should open with a draft. Send it there to complete delivery. If it doesn&apos;t open, <a href={`mailto:${contactEmail}`}>email me directly</a>.</>}
          {state === "invalid" && "Please complete the required fields with a valid email address."}
          {state === "error" && <>Your email app could not be opened. <a href={`mailto:${contactEmail}`}>Email me directly</a>.</>}
        </p>
      </div>
    </form>
  );
}
