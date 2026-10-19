import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The preview card shown when the site is shared (WhatsApp, iMessage,
// LinkedIn, X…): the lime logo and the brand line on black.

export const alt = "nuclii: more than memories. Launching in Birmingham.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo/nuclii-logo-full.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0A0A0B",
          color: "#FFFFFF",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
        <img alt="" height={96} src={logoSrc} width={287} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
            more than memories.
          </div>
          <div style={{ marginTop: 28, fontSize: 36, color: "rgba(255,255,255,0.6)" }}>
            Discover, host and pull real-life moments together.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 30 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#A3BF1C", marginRight: 16 }} />
          Launching in Birmingham
        </div>
      </div>
    ),
    size,
  );
}
