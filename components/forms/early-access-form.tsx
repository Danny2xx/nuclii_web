"use client";

import React, { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  Handshake,
  LockKeyhole,
  MapPin,
  QrCode,
  Sparkles,
  UsersRound,
} from "lucide-react";

import {
  NucliiMascot,
  type NucliiMascotMood,
} from "@/components/brand/nuclii-mascot";
import { useConfetti } from "@/components/motion";
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


type EarlyAccessRole =
  | "attendee"
  | "host"
  | "society/community"
  | "talent/creative"
  | "team/contributor";

type RoleOption = {
  action: string;
  description: string;
  icon: LucideIcon;
  label: string;
  mood: NucliiMascotMood;
  previewRows: readonly string[];
  previewTitle: string;
  prompt: string;
  shortLabel: string;
  value: EarlyAccessRole;
};

type EarlyAccessFormState = {
  fullName: string;
  email: string;
  city: string;
  organisation: string;
  role: EarlyAccessRole;
  intendedUse: string;
  ageConfirmed: boolean;
  marketingConsent: boolean;
};

const roleOptions = [
  {
    value: "attendee",
    label: "Attendee",
    shortLabel: "Discover and join",
    description: "Find and join events, workshops, pickups, and experiences near you.",
    prompt: "Tell us what kinds of real-world experiences you want to discover and attend.",
    previewTitle: "Discovery feed",
    previewRows: ["Browse near you", "Book access", "QR check-in"],
    action: "Join as an Early Attendee",
    icon: MapPin,
    mood: "wave",
  },
  {
    value: "host",
    label: "Host",
    shortLabel: "Create and manage",
    description: "Create listings, manage demand, and bring real-world experiences to life.",
    prompt: "Tell us what you want to host and what would make hosting easier for you.",
    previewTitle: "Host dashboard",
    previewRows: ["Create listing", "Capacity controls", "Check-in tools"],
    action: "Become an Early Host",
    icon: CalendarPlus,
    mood: "gather",
  },
  {
    value: "society/community",
    label: "Society",
    shortLabel: "Organise your community",
    description: "Bring your society, club, or community onto Nuclii to host and coordinate.",
    prompt: "Tell us about your society or community and what you want to organise on Nuclii.",
    previewTitle: "Society dashboard",
    previewRows: ["Member events", "Private access", "Society listings"],
    action: "Join as an Early Society",
    icon: UsersRound,
    mood: "carry-pin",
  },
  {
    value: "talent/creative",
    label: "Talent",
    shortLabel: "Showcase and get booked",
    description: "Get discovered for showcases, services, bookings, and live collaborations.",
    prompt: "Tell us what you create or perform and where you want people to discover you.",
    previewTitle: "Talent showcase",
    previewRows: ["Creative profile", "Booking interest", "Venue requests"],
    action: "Become an Early Talent",
    icon: Sparkles,
    mood: "celebrate",
  },
  {
    value: "team/contributor",
    label: "Collaborator",
    shortLabel: "Help build Nuclii",
    description: "Contribute across product, design, engineering, growth, or community.",
    prompt: "Tell us how you want to help build Nuclii and what kind of work you care about.",
    previewTitle: "Contributor path",
    previewRows: ["Area of interest", "Useful links", "Follow-up"],
    action: "Become an Early Collaborator",
    icon: Handshake,
    mood: "point",
  },
] as const satisfies readonly RoleOption[];

const stepMeta = [
  {
    label: "Basics",
    title: "Start with the essentials.",
    description: "Just the basics to get you started.",
  },
  {
    label: "Path",
    title: "Tell us what you want to do.",
    description: "Tell us a bit more about what you're looking to do.",
  },
  {
    label: "Review",
    title: "Confirm the details.",
    description: "A quick check before you join the first wave.",
  },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState: EarlyAccessFormState = {
  fullName: "",
  email: "",
  city: "",
  organisation: "",
  role: "attendee",
  intendedUse: "",
  ageConfirmed: false,
  marketingConsent: false,
};

const fieldClassName =
  "flex min-h-12 w-full rounded-xl border border-input bg-input/90 px-4 py-3 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

function EarlyAccessForm({ initialRole = "" }: { initialRole?: string }) {
  const [step, setStep] = useState(initialRole ? 1 : 0);
  const [formState, setFormState] = useState<EarlyAccessFormState>({
    ...initialFormState,
    role: (initialRole as EarlyAccessRole) || initialFormState.role,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const activeRole = getRoleOption(formState.role);
  const ActiveRoleIcon = activeRole.icon;
  const progress = useMemo(() => ((step + 1) / stepMeta.length) * 100, [step]);
  const activeStep = stepMeta[step];

  useConfetti(submitted);

  function updateField<Field extends keyof EarlyAccessFormState>(
    field: Field,
    value: EarlyAccessFormState[Field],
  ) {
    setFormState((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function selectRole(role: EarlyAccessRole) {
    updateField("role", role);
  }

  function validateStep(nextStep = step) {
    if (nextStep === 0) {
      if (!formState.fullName.trim()) return "Please add your name.";
      if (!formState.email.trim() || !EMAIL_REGEX.test(formState.email.trim()))
        return "Please add a valid email address.";
      if (!formState.city.trim()) return "Please add your city.";
    }

    if (nextStep === 1) {
      if (!formState.role || !formState.intendedUse.trim()) {
        return "Please choose your role and tell us how you want to use Nuclii.";
      }
    }

    if (nextStep === 2) {
      if (!formState.ageConfirmed) return "Please confirm you are 16 or older.";
      if (!formState.marketingConsent) return "Please confirm you are happy to receive Nuclii updates.";
    }

    return "";
  }

  function goNext() {
    const message = validateStep();
    if (message) { setError(message); return; }
    setStep((current) => Math.min(current + 1, stepMeta.length - 1));
  }

  function goBack() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = validateStep(2);
    if (message) { setError(message); return; }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formState.fullName,
          email: formState.email,
          city: formState.city,
          organisation: formState.organisation,
          role: activeRole.label,
          intendedUse: formState.intendedUse,
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
      <div className="nuclii-visual-tile p-5 sm:p-6">
        <div className="relative z-10 overflow-hidden rounded-[1.6rem] border border-white/10 bg-background/84 p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <CheckCircle2 aria-hidden="true" className="size-7" />
              </div>
              <Badge className="mt-6">{activeRole.action}</Badge>
              <h2 className="mt-5 text-2xl font-semibold sm:text-4xl">
                You're on the list.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                We'll be in touch as Nuclii prepares for beta. Selected early
                users, hosts, and communities will hear from us first.
              </p>
            </div>
            <NucliiMascot
              label="Nuclii saved your spot"
              mood="celebrate"
              size="lg"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.86fr_1.1fr_0.9fr]">
      <RolePicker activeRole={activeRole} onSelect={selectRole} />

      <Card className="overflow-hidden xl:order-none">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">
                Step {step + 1} of {stepMeta.length} / {activeStep.label}
              </p>
              <CardTitle className="mt-2 text-2xl">
                {activeStep.title}
              </CardTitle>
              <CardDescription className="mt-2">
                {activeStep.description}
              </CardDescription>
            </div>
            <NucliiMascot
              label={`Nuclii for ${activeRole.label}`}
              mood={activeRole.mood}
              showLabel={false}
              size="sm"
            />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-7">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 0 && (
              <div className="grid gap-5 md:grid-cols-2">
                <FormField id="early-full-name" label="Full name" required>
                  <Input
                    autoComplete="name"
                    id="early-full-name"
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Your name"
                    value={formState.fullName}
                  />
                </FormField>
                <FormField id="early-email" label="Email" required>
                  <Input
                    autoComplete="email"
                    id="early-email"
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={formState.email}
                  />
                </FormField>
                <FormField id="early-city" label="City" required>
                  <Input
                    autoComplete="address-level2"
                    id="early-city"
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="London, Manchester, Birmingham..."
                    value={formState.city}
                  />
                </FormField>
                <FormField
                  id="early-organisation"
                  label="University or organisation"
                  optional
                >
                  <Input
                    id="early-organisation"
                    onChange={(event) =>
                      updateField("organisation", event.target.value)
                    }
                    placeholder="Optional"
                    value={formState.organisation}
                  />
                </FormField>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5">
                <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                      <ActiveRoleIcon aria-hidden="true" className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Selected path
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        {activeRole.action}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {activeRole.description}
                      </p>
                    </div>
                  </div>
                </div>

                <FormField
                  id="early-intended-use"
                  label="What do you want to do with Nuclii?"
                  required
                >
                  <textarea
                    className={cn(fieldClassName, "min-h-40 resize-y leading-7")}
                    id="early-intended-use"
                    onChange={(event) =>
                      updateField("intendedUse", event.target.value)
                    }
                    placeholder={activeRole.prompt}
                    value={formState.intendedUse}
                  />
                </FormField>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Age confirmation
                  </p>
                  <CheckboxField
                    checked={formState.ageConfirmed}
                    label="I confirm I am 16 or older."
                    onChange={(checked) => updateField("ageConfirmed", checked)}
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Updates
                  </p>
                  <CheckboxField
                    checked={formState.marketingConsent}
                    label="I agree to receive updates about Nuclii, beta access, and launch announcements. I understand I can unsubscribe at any time."
                    onChange={(checked) =>
                      updateField("marketingConsent", checked)
                    }
                  />
                </div>
                <div className="rounded-2xl border border-border bg-secondary p-5">
                  <p className="text-sm font-semibold">Review</p>
                  <dl className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <ReviewItem label="Name" value={formState.fullName} />
                    <ReviewItem label="Email" value={formState.email} />
                    <ReviewItem label="City" value={formState.city} />
                    <ReviewItem label="Path" value={activeRole.label} />
                  </dl>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <Button
                disabled={step === 0 || isSubmitting}
                onClick={goBack}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              {step < stepMeta.length - 1 ? (
                <Button onClick={goNext} type="button">
                  Continue
                  <ArrowRight aria-hidden="true" />
                </Button>
              ) : (
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Submitting…" : activeRole.action}
                  {!isSubmitting && <ArrowRight aria-hidden="true" />}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="hidden xl:block">
        <RolePhonePreview role={activeRole} step={step} />
      </div>
    </div>
  );
}

function RolePicker({
  activeRole,
  onSelect,
}: {
  activeRole: RoleOption;
  onSelect: (role: EarlyAccessRole) => void;
}) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
          Pick a role
        </p>
        <CardTitle className="mt-2 text-xl">Where do you fit?</CardTitle>
        <CardDescription>
          Choose the closest path. You can explain the details in your own words.
        </CardDescription>
      </CardHeader>

      {/* Mobile — horizontal scrollable pills */}
      <div className="flex gap-2 overflow-x-auto p-4 xl:hidden">
        {roleOptions.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole.value === role.value;
          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary/55 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30",
              )}
              key={role.value}
              onClick={() => onSelect(role.value)}
              type="button"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {role.label}
            </button>
          );
        })}
      </div>

      {/* Desktop — full stacked cards */}
      <CardContent className="hidden flex-col gap-3 p-4 xl:flex xl:p-5">
        {roleOptions.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole.value === role.value;

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "group flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary/55 bg-primary/10 shadow-[0_0_20px_rgba(91,140,255,0.1)]"
                  : "border-border bg-card hover:border-primary/30 hover:bg-primary/5",
              )}
              key={role.value}
              onClick={() => onSelect(role.value)}
              type="button"
            >
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-xl border transition",
                  isActive
                    ? "border-primary/50 bg-primary !text-[#ffffff]"
                    : "border-primary/20 bg-primary/8 text-primary",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-base font-bold text-foreground">
                  {role.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {role.description}
                </span>
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function RolePhonePreview({ role, step }: { role: RoleOption; step: number }) {
  const Icon = role.icon;

  return (
    <div className="nuclii-visual-tile h-full p-4 sm:p-5">
      <div className="relative z-10 grid min-h-[36rem] place-items-center overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(91,140,255,0.22),transparent_20rem),linear-gradient(145deg,rgba(18,19,22,0.92),rgba(10,10,11,0.98))] p-5">
        <div className="relative w-full max-w-[19.5rem] rounded-[2.35rem] border border-white/15 bg-black p-2.5 shadow-[0_34px_110px_rgba(0,0,0,0.58)]">
          <div className="absolute left-1/2 top-2 z-20 h-4 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background">
            <div className="border-b border-border bg-card px-5 pb-4 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-primary">
                    {role.label} view
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    {role.previewTitle}
                  </h3>
                </div>
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
              </div>
            </div>

            <div className="relative min-h-[24rem] overflow-hidden bg-secondary p-5">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(91,140,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(91,140,255,0.09)_1px,transparent_1px)] bg-[size:38px_38px] opacity-75" />
              <div className="relative z-10 space-y-3">
                <div className="rounded-3xl border border-border bg-card/92 p-4 shadow-card backdrop-blur">
                  <p className="text-xs font-semibold text-primary">
                    Step {step + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {stepMeta[step].description}
                  </p>
                </div>

                {role.previewRows.map((row, index) => (
                  <div
                    className="flex items-center justify-between rounded-2xl border border-border bg-card/88 p-3 shadow-card backdrop-blur"
                    key={row}
                  >
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{row}</p>
                    </div>
                    {index === 0 ? (
                      <MapPin aria-hidden="true" className="size-4 text-primary" />
                    ) : index === 1 ? (
                      <LockKeyhole
                        aria-hidden="true"
                        className="size-4 text-primary"
                      />
                    ) : (
                      <QrCode aria-hidden="true" className="size-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border bg-card px-5 py-4">
              <p className="text-sm font-semibold">{role.action}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Short form. Clear routing. No public attendee lists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckboxField({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-2xl border border-border bg-secondary/70 p-4 text-sm leading-6 text-muted-foreground transition hover:border-primary/45">
      <input
        checked={checked}
        className="mt-1 size-4 accent-primary"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-normal text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-foreground">{value || "-"}</dd>
    </div>
  );
}

function getRoleOption(role: EarlyAccessRole) {
  return roleOptions.find((option) => option.value === role) ?? roleOptions[0];
}

export { EarlyAccessForm };
