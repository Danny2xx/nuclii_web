"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Handshake,
  Mail,
  Megaphone,
  Newspaper,
  Send,
  Store,
  Ticket,
  UsersRound,
} from "lucide-react";

import { Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactCategories = [
  {
    icon: Ticket,
    title: "Early Access",
    description: "Join the first wave or ask about beta access.",
  },
  {
    icon: Megaphone,
    title: "Host",
    description: "Create listings, manage access, or become an early host.",
  },
  {
    icon: UsersRound,
    title: "Society/Community",
    description: "Bring members together and reach the right people.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Service Provider",
    description: "Use Nuclii for appointments, pickups, workshops, or pop-ups.",
  },
  {
    icon: Building2,
    title: "Venue",
    description: "Connect your space with hosts and communities.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description: "Explore strategic support, collaborations, or operators.",
  },
  {
    icon: Store,
    title: "Investor",
    description: "Start a serious investor or strategic partner conversation.",
  },
  {
    icon: Newspaper,
    title: "Press",
    description: "Contact Nuclii about media, launch, or brand enquiries.",
  },
  {
    icon: UsersRound,
    title: "Team",
    description: "Ask about contributing or building with Nuclii.",
  },
  {
    icon: Mail,
    title: "Other",
    description: "Send a general enquiry to the Nuclii team.",
  },
] as const;

const enquiryTypes = contactCategories.map((category) => category.title);

type ContactFormState = {
  name: string;
  email: string;
  organisation: string;
  city: string;
  enquiryType: string;
  message: string;
  consent: boolean;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  organisation: "",
  city: "",
  enquiryType: "",
  message: "",
  consent: false,
};

const fieldClassName =
  "flex min-h-12 w-full rounded-xl border border-input bg-input/90 px-4 py-3 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

function ContactFlow() {
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField<Field extends keyof ContactFormState>(
    field: Field,
    value: ContactFormState[Field],
  ) {
    setFormState((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function selectCategory(category: string) {
    updateField("enquiryType", category);
    document.getElementById("contact-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.name.trim()) { setError("Please add your name."); return; }
    if (!formState.email.trim() || !EMAIL_REGEX.test(formState.email.trim())) {
      setError("Please add a valid email address.");
      return;
    }
    if (!formState.enquiryType) { setError("Please select an enquiry type."); return; }
    if (!formState.message.trim()) { setError("Please add a message."); return; }
    if (!formState.consent) { setError("Please confirm your consent before sending."); return; }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          organisation: formState.organisation,
          city: formState.city,
          enquiryType: formState.enquiryType,
          message: formState.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "Submission failed.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="nuclii-section" id="contact-categories">
        <div className="nuclii-container">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4">
              What is your enquiry about?
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {contactCategories.map(({ icon: Icon, title, description }) => (
              <Reveal key={title}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => selectCategory(title)}
                      type="button"
                      variant={
                        formState.enquiryType === title ? "default" : "outline"
                      }
                    >
                      Select
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="nuclii-section bg-secondary/35" id="contact-form">
        <div className="nuclii-container">
          <div className="mb-10 max-w-3xl">
            <p className="nuclii-eyebrow mb-5">Send a message</p>
            <h2 className="text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Send the Nuclii team a message.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Keep it short and useful. We read every message and respond to the
              right ones as we prepare for launch.
            </p>
          </div>

          {submitted ? (
            <Card className="overflow-hidden border-primary/35">
              <CardContent className="p-8 sm:p-10">
                <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <CheckCircle2 aria-hidden="true" className="size-7" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold sm:text-3xl">
                  Message sent.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  We'll be in touch if your message needs a response. For time-sensitive matters, you can always reach us through the contact categories above.
                </p>
                <Button
                  className="mt-8"
                  onClick={() => {
                    setSubmitted(false);
                    setFormState(initialFormState);
                  }}
                  type="button"
                  variant="outline"
                >
                  Send another message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="border-b border-border">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Send Message
                    </p>
                    <CardTitle className="mt-2 text-2xl">
                      What should Nuclii know?
                    </CardTitle>
                  </div>
                  {formState.enquiryType && (
                    <Badge>{formState.enquiryType}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-7">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField id="contact-name" label="Name" required>
                      <Input
                        autoComplete="name"
                        id="contact-name"
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        placeholder="Your name"
                        value={formState.name}
                      />
                    </FormField>
                    <FormField id="contact-email" label="Email" required>
                      <Input
                        autoComplete="email"
                        id="contact-email"
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        placeholder="you@example.com"
                        type="email"
                        value={formState.email}
                      />
                    </FormField>
                    <FormField
                      id="contact-organisation"
                      label="Organisation"
                      optional
                    >
                      <Input
                        id="contact-organisation"
                        onChange={(event) =>
                          updateField("organisation", event.target.value)
                        }
                        placeholder="Optional"
                        value={formState.organisation}
                      />
                    </FormField>
                    <FormField id="contact-city" label="City" optional>
                      <Input
                        autoComplete="address-level2"
                        id="contact-city"
                        onChange={(event) =>
                          updateField("city", event.target.value)
                        }
                        placeholder="Optional"
                        value={formState.city}
                      />
                    </FormField>
                  </div>

                  <FormField
                    id="contact-enquiry-type"
                    label="Enquiry type"
                    required
                  >
                    <select
                      className={fieldClassName}
                      id="contact-enquiry-type"
                      onChange={(event) =>
                        updateField("enquiryType", event.target.value)
                      }
                      value={formState.enquiryType}
                    >
                      <option value="">Select an enquiry type</option>
                      {enquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField id="contact-message" label="Message" required>
                    <textarea
                      className={cn(
                        fieldClassName,
                        "min-h-40 resize-y leading-7",
                      )}
                      id="contact-message"
                      onChange={(event) =>
                        updateField("message", event.target.value)
                      }
                      placeholder="Tell us what you want to ask, explore, host, build, partner on, or support."
                      value={formState.message}
                    />
                  </FormField>

                  <label className="flex cursor-pointer gap-3 rounded-2xl border border-border bg-secondary/70 p-4 text-sm leading-6 text-muted-foreground transition hover:border-primary/45">
                    <input
                      checked={formState.consent}
                      className="mt-1 size-4 accent-primary"
                      onChange={(event) =>
                        updateField("consent", event.target.checked)
                      }
                      type="checkbox"
                    />
                    <span>
                      I agree that Nuclii may use this information to respond to
                      my enquiry.
                    </span>
                  </label>

                  {error && (
                    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                      {error}
                    </p>
                  )}

                  <div className="flex justify-end border-t border-border pt-6">
                    <Button
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? "Sending…" : "Send Message"}
                      {!isSubmitting && <Send aria-hidden="true" />}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}

export { ContactFlow };
