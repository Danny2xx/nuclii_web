"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const roleOptions = [
  "Frontend engineer",
  "Backend engineer",
  "Product designer",
  "Motion designer",
  "Growth and marketing",
  "Campus ambassador",
  "Community operations",
  "Partnerships",
  "Other",
] as const;

type BuildWithUsFormState = {
  name: string;
  email: string;
  role: string;
  city: string;
  link: string;
  message: string;
};

const initialFormState: BuildWithUsFormState = {
  name: "",
  email: "",
  role: "",
  city: "",
  link: "",
  message: "",
};

const fieldClassName =
  "flex min-h-12 w-full rounded-xl border border-input bg-input/90 px-4 py-3 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

function BuildWithUsForm() {
  const [formState, setFormState] =
    useState<BuildWithUsFormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField<Field extends keyof BuildWithUsFormState>(
    field: Field,
    value: BuildWithUsFormState[Field],
  ) {
    setFormState((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.name.trim()) { setError("Please add your name."); return; }
    if (!formState.email.trim() || !EMAIL_REGEX.test(formState.email.trim())) {
      setError("Please add a valid email address.");
      return;
    }
    if (!formState.role) { setError("Please select a role or area."); return; }
    if (!formState.city.trim()) { setError("Please add your city."); return; }
    if (!formState.message.trim()) { setError("Please add a short message."); return; }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/build-with-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          role: formState.role,
          city: formState.city,
          link: formState.link,
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

  if (submitted) {
    return (
      <Card className="overflow-hidden border-primary/35">
        <CardContent className="p-8 sm:p-10">
          <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 aria-hidden="true" className="size-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">
            Application received.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            We'll review your application and be in touch if there's a good fit.
            Thanks for your interest in helping build Nuclii.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <p className="text-sm font-semibold text-primary">Application form</p>
        <CardTitle className="text-2xl">Apply now</CardTitle>
      </CardHeader>
      <CardContent className="p-6 sm:p-7">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField id="build-name" label="Name" required>
              <Input
                autoComplete="name"
                id="build-name"
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your name"
                value={formState.name}
              />
            </FormField>
            <FormField id="build-email" label="Email" required>
              <Input
                autoComplete="email"
                id="build-email"
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@example.com"
                type="email"
                value={formState.email}
              />
            </FormField>
            <FormField
              id="build-role"
              label="Role or area of interest"
              required
            >
              <select
                className={fieldClassName}
                id="build-role"
                onChange={(event) => updateField("role", event.target.value)}
                value={formState.role}
              >
                <option value="">Select an area</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="build-city" label="City" required>
              <Input
                autoComplete="address-level2"
                id="build-city"
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="London, Manchester, Birmingham..."
                value={formState.city}
              />
            </FormField>
          </div>

          <FormField
            id="build-link"
            label="Portfolio, LinkedIn, or GitHub link"
            optional
          >
            <Input
              id="build-link"
              onChange={(event) => updateField("link", event.target.value)}
              placeholder="https://..."
              type="url"
              value={formState.link}
            />
          </FormField>

          <FormField id="build-message" label="Short message" required>
            <textarea
              className={cn(fieldClassName, "min-h-36 resize-y leading-7")}
              id="build-message"
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Tell us what you care about, what you can help with, and why Nuclii feels interesting to you."
              value={formState.message}
            />
          </FormField>

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
              {isSubmitting ? "Submitting…" : "Apply now"}
              {!isSubmitting && <ArrowRight aria-hidden="true" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export { BuildWithUsForm };
