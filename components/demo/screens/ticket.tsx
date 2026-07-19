"use client";

import { priceLabel, whenLabel } from "@/lib/demo/world";
import { useDemoRouter } from "../demo-router";
import { useWorld } from "../world-store";
import { EventCover, StatusChip } from "../primitives";
import { QrCode } from "../qr";
import { BackIcon, MapPinIcon } from "../icons";

export function TicketScreen({ id }: { id: string }) {
  const { eventById, identity, myRsvps } = useWorld();
  const { back, go } = useDemoRouter();

  const event = eventById(id);
  const holder =
    identity?.kind === "persona" ? identity.persona.name : (identity?.guest.name ?? "you");
  const going = myRsvps.includes(id);

  if (!event) {
    return (
      <p className="text-sm text-muted-foreground">
        this ticket is no longer available.{" "}
        <button type="button" onClick={back} className="font-semibold text-foreground underline-offset-4 hover:underline">
          go back
        </button>
      </p>
    );
  }

  const ref = `NUC-${id.slice(0, 4).toUpperCase()}-${(event.going + 7).toString().padStart(4, "0")}`;

  return (
    <div className="mx-auto max-w-md">
      <button
        type="button"
        onClick={back}
        className="mb-5 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <BackIcon className="size-4" />
        back
      </button>

      {/* the ticket — one surface, torn into stub + code */}
      <div className="overflow-hidden rounded-3xl bg-card">
        <div className="relative">
          <EventCover event={event} sizes="480px" className="aspect-[16/9]" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <StatusChip tone="positive" className="mb-2">
              {going ? "you're going" : "reserved"}
            </StatusChip>
            <p className="font-display text-2xl font-extrabold lowercase leading-tight tracking-[-0.03em] text-white text-balance">
              {event.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-5 py-5 text-sm">
          <Field label="when" value={whenLabel(event)} />
          <Field label="entry" value={priceLabel(event.price)} />
          <Field label="where" value={`${event.venueName}, ${event.area}`} icon />
          <Field label="in the name of" value={holder} />
        </div>

        {/* perforation */}
        <div className="relative flex items-center">
          <span className="absolute -left-3 size-6 rounded-full bg-background" />
          <span className="absolute -right-3 size-6 rounded-full bg-background" />
          <span className="mx-5 flex-1 border-t border-dashed border-white/15" />
        </div>

        <div className="flex flex-col items-center px-5 py-6">
          <QrCode value={`${id}:${holder}:${ref}`} className="size-44" />
          <p className="mt-3 text-xs font-semibold tracking-[0.08em] text-foreground/80">{ref}</p>
          <p className="mt-1 text-xs text-muted-foreground">show this at the door to check in</p>
        </div>
      </div>

      <p className="mt-4 px-1 text-center text-xs leading-5 text-muted-foreground">
        sandbox ticket — the code is for show. at launch this scans you in at the door.
      </p>

      <button
        type="button"
        onClick={() => go({ name: "event", id })}
        className="mt-4 h-11 w-full rounded-full border border-white/16 bg-white/[0.03] text-sm font-semibold text-foreground transition-colors duration-150 hover:border-white/32 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        view event details
      </button>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div>
      <p className="text-[0.6875rem] font-semibold lowercase text-muted-foreground">{label}</p>
      <p className="mt-0.5 flex items-center gap-1 font-semibold text-foreground">
        {icon && <MapPinIcon className="size-3.5 shrink-0 text-muted-foreground" />}
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}
