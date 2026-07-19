import { cn } from "@/lib/utils";

// A deterministic, authentic-looking QR mark for the sandbox. It encodes
// nothing scannable — it's a stable visual seeded from the ticket id so each
// ticket reads as its own real code. Swaps out for a real encoder at launch.

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const N = 25; // module grid (quiet-zone excluded)

function inFinder(r: number, c: number) {
  const zones = [
    [0, 0],
    [0, N - 7],
    [N - 7, 0],
  ];
  return zones.some(([zr, zc]) => r >= zr && r < zr + 7 && c >= zc && c < zc + 7);
}

function finderModule(r: number, c: number) {
  // 7x7 finder: outer ring (border) + 3x3 solid center, hollow between
  const zones = [
    [0, 0],
    [0, N - 7],
    [N - 7, 0],
  ];
  for (const [zr, zc] of zones) {
    if (r >= zr && r < zr + 7 && c >= zc && c < zc + 7) {
      const lr = r - zr;
      const lc = c - zc;
      const ring = lr === 0 || lr === 6 || lc === 0 || lc === 6;
      const center = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
      return ring || center;
    }
  }
  return false;
}

export function QrCode({ value, className }: { value: string; className?: string }) {
  const rand = mulberry32(hash(value));
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (inFinder(r, c)) {
        if (finderModule(r, c)) cells.push({ r, c });
      } else if (rand() > 0.52) {
        cells.push({ r, c });
      }
    }
  }
  const q = 2; // quiet zone
  const size = N + q * 2;

  return (
    <div className={cn("rounded-2xl bg-white p-3", className)}>
      <svg
        aria-label="ticket qr code"
        role="img"
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full"
        shapeRendering="crispEdges"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map(({ r, c }) => (
          <rect key={`${r}-${c}`} x={c + q} y={r + q} width={1} height={1} fill="#0A0A0B" />
        ))}
      </svg>
    </div>
  );
}
