import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { SectionTitle } from "@/components/ui/marketing-typography";
import { EXPERIENCE_ROLES, type ExperienceRoleKey } from "@/lib/experience-roles";
import { SEED_EVENTS } from "@/lib/demo/events";
import { personaById } from "@/lib/demo/directory";
import { routes } from "@/lib/routes";

const DOORS: { role: ExperienceRoleKey; name: string; line: string }[] = [
  { role: "explorer", name: "sofia", line: "six events this month, two nights ahead" },
  { role: "host", name: "maya", line: "runs a supper club that sells out in days" },
  { role: "venue", name: "priya", line: "keeps a plant-filled loft booked all week" },
  { role: "talent", name: "jerome", line: "vinyl selector with a full gig calendar" },
];

/** preview tiles pulled straight from the sandbox's seed world */
const PREVIEW_IDS = ["vinyl-and-supper", "rooftop-listening", "jazz-in-the-crypt"];

export function DemoDoorway() {
  const previews = PREVIEW_IDS.map((id) => SEED_EVENTS.find((e) => e.id === id)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );

  return (
    <section
      id="demo"
      className="border-t border-border px-[var(--container-x)] pb-16 pt-20 md:pb-28 md:pt-28"
      data-analytics-section="home_demo"
    >
      <div className="mx-auto grid w-full max-w-[86rem] gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <SectionTitle className="text-[clamp(2.35rem,5vw,4.4rem)] leading-[1.03]">
              don&apos;t take our word for it. walk around inside.
            </SectionTitle>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[36rem] text-base leading-relaxed tracking-[-0.02em] text-white/72 sm:text-xl">
              the sandbox is a working preview of nuclii — one london week seen through four
              lives. create an event as a host, accept the booking as the venue, take the gig
              as the talent, then rsvp to your own night as an explorer.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {DOORS.map((door) => {
                const role = EXPERIENCE_ROLES[door.role];
                const persona = personaById(door.name);
                return (
                  <li key={door.role}>
                    <Link
                      href={routes.demo}
                      className="group flex h-full items-center gap-3.5 rounded-xl border border-border bg-card px-4 py-3.5 transition-[border-color,background-color] duration-200 hover:border-white/35 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span
                        aria-hidden="true"
                        className="relative size-10 shrink-0 overflow-hidden rounded-full"
                        style={{ boxShadow: `0 0 0 1.5px ${role.signal}` }}
                      >
                        {persona?.avatarImage ? (
                          <Image
                            src={persona.avatarImage}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="block size-full" style={{ background: role.signal }} />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold lowercase text-white">
                          enter as {door.name} —{" "}
                          {"shortLabel" in role ? role.shortLabel : role.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-white/60">
                          {door.line}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-xs lowercase text-white/45">
              runs entirely in your browser · nothing to install · reset any time
            </p>
          </Reveal>
        </div>

        {/* a quiet look through the window — real seed data, no app bundle */}
        <Reveal delay={0.1}>
          <Link
            href={routes.demo}
            aria-label="open the nuclii sandbox"
            className="group block rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-[border-color,transform] duration-300 ease-out hover:border-white/30 motion-safe:hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6"
          >
            <p className="flex items-center justify-between text-xs font-semibold lowercase text-white/55">
              tonight near you
              <span className="rounded-md bg-white/8 px-2 py-0.5 text-[0.625rem] text-white/70">
                sandbox
              </span>
            </p>
            <div className="mt-4 space-y-2.5">
              {previews.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3.5 rounded-xl border border-border bg-background/50 p-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="relative size-12 shrink-0 overflow-hidden rounded-lg"
                    style={{
                      background: `linear-gradient(145deg, ${event.palette[0]} 0%, ${event.palette[1]} 140%)`,
                    }}
                  >
                    {event.image && (
                      <Image
                        src={event.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover [filter:saturate(0.74)_brightness(0.86)]"
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold lowercase text-white">
                      {event.title}
                    </span>
                    <span className="block truncate text-xs text-white/55">
                      {event.venueName} · {event.area} ·{" "}
                      {event.price === 0 ? "free" : `£${event.price}`}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-white/45">
                    {event.going} going
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="font-semibold lowercase text-white/70">
                open the sandbox
              </span>
              <span
                aria-hidden="true"
                className="text-white/70 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
              >
                →
              </span>
            </p>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
