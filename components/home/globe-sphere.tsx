"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  Bus,
  Coffee,
  IceCreamCone,
  Landmark,
  Pizza,
  RadioTower,
  Ship,
  ShoppingBag,
  TrainFront,
  TramFront,
  Trees,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";

// A city map wrapped round a sphere, seen from the side and turning about its
// vertical axis. Map features live in longitude/latitude (degrees) and are
// projected orthographically onto a canvas every frame, so they curve and
// compress toward the horizon like a real globe.

// one full turn every four minutes
const DEGREES_PER_MS = 360 / 240_000;
// view tilt: we look at the globe from slightly above its equator
const VIEW_LAT = 14;
// globe radius as a share of half the box (the rest is a soft halo)
const GLOBE_SCALE = 0.936;

type LonLat = readonly [number, number];

const COLORS = {
  land: "#F2F3F5",
  blocks: ["#E4E7EB", "#DDE1E6", "#E9EBEE"],
  parks: ["#CFEBC1", "#BFE4AF"],
  water: "#BCD8F4",
  road: "#FFFFFF",
};

// Small seeded RNG so the generated city is identical on every render.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function blob(rand: () => number, lon: number, lat: number, radius: number): LonLat[] {
  return Array.from({ length: 10 }, (_, index) => {
    const angle = (index / 10) * Math.PI * 2;
    const r = radius * (0.7 + rand() * 0.5);
    // stretch longitude so blobs stay round away from the equator
    return [lon + (Math.cos(angle) * r) / Math.cos((lat * Math.PI) / 180), lat + Math.sin(angle) * r] as const;
  });
}

// Centre line of a winding band, sampled every 2° of longitude.
function band(latAt: (lon: number) => number, halfWidth: number): LonLat[][] {
  const quads: LonLat[][] = [];
  for (let lon = 0; lon < 360; lon += 2) {
    const a = latAt(lon);
    const b = latAt(lon + 2);
    quads.push([
      [lon, a - halfWidth],
      [lon + 2.05, b - halfWidth],
      [lon + 2.05, b + halfWidth],
      [lon, a + halfWidth],
    ]);
  }
  return quads;
}

function buildCity() {
  const rand = mulberry32(20260929);
  const blocks: LonLat[][][] = [[], [], []];

  // street grid: blocks with gaps between them read as streets
  for (let lat = 10; lat < 84; lat += 2.4) {
    for (let lon = 0; lon < 360; lon += 3) {
      if (rand() < 0.14) continue; // open lots
      const inset = 0.32;
      blocks[Math.floor(rand() * 3)].push([
        [lon + inset, lat + inset],
        [lon + 3 - inset, lat + inset],
        [lon + 3 - inset, lat + 2.4 - inset],
        [lon + inset, lat + 2.4 - inset],
      ]);
    }
  }

  const parks: LonLat[][][] = [[], []];
  for (let i = 0; i < 46; i += 1) {
    const lat = 14 + rand() * 62;
    parks[i % 2].push(blob(rand, rand() * 360, lat, 1.6 + rand() * 3.2));
  }

  const lakes = Array.from({ length: 9 }, () => blob(rand, rand() * 360, 18 + rand() * 55, 1.2 + rand() * 1.8));
  const rivers = [
    ...band((lon) => 36 + 8 * Math.sin((lon * Math.PI) / 45) + 3 * Math.sin((lon * Math.PI) / 17), 1.1),
    ...band((lon) => 60 + 5 * Math.sin((lon * Math.PI) / 30 + 1.3), 0.75),
  ];

  // main roads: meridians converging on the pole, plus a few winding avenues
  const roads: LonLat[][] = [];
  for (let lon = 0; lon < 360; lon += 15) {
    const wobble = rand() * 6;
    roads.push(Array.from({ length: 40 }, (_, i) => [lon + Math.sin(i / 5) * wobble * 0.3, 8 + i * 2] as const));
  }
  for (const [base, amp, freq] of [
    [24, 3, 40],
    [48, 4, 28],
    [72, 2, 22],
  ]) {
    roads.push(Array.from({ length: 181 }, (_, i) => [i * 2, base + amp * Math.sin(((i * 2) * Math.PI) / freq)] as const));
  }

  return { blocks, parks, lakes, rivers, roads };
}

const city = buildCity();

// Transport and food tags pinned to places on the map.
const mapTags: readonly { lon: number; lat: number; icon: LucideIcon; kind: "transport" | "food" }[] = [
  { lon: 10, lat: 42, icon: TrainFront, kind: "transport" },
  { lon: 55, lat: 30, icon: Coffee, kind: "food" },
  { lon: 95, lat: 52, icon: Bus, kind: "transport" },
  { lon: 130, lat: 36, icon: Pizza, kind: "food" },
  { lon: 170, lat: 58, icon: TramFront, kind: "transport" },
  { lon: 205, lat: 32, icon: UtensilsCrossed, kind: "food" },
  { lon: 240, lat: 47, icon: Ship, kind: "transport" },
  { lon: 280, lat: 28, icon: IceCreamCone, kind: "food" },
  { lon: 315, lat: 55, icon: Bus, kind: "transport" },
  { lon: 340, lat: 34, icon: Coffee, kind: "food" },
  { lon: 75, lat: 66, icon: UtensilsCrossed, kind: "food" },
  { lon: 260, lat: 64, icon: TrainFront, kind: "transport" },
];

// Landmark circles: a light sense of place, spread so only two or three are in
// view at once. Each shows an illustration until `image` is set (e.g. a photo
// in /public/images/landmarks), with no change to size or layout.
const landmarks: readonly {
  lon: number;
  lat: number;
  label: string;
  icon: LucideIcon;
  sky: string;
  image?: string;
}[] = [
  { lon: 30, lat: 40, label: "The Bullring", icon: ShoppingBag, sky: "#DDEBFA" },
  { lon: 105, lat: 44, label: "Library of Birmingham", icon: Landmark, sky: "#F4E6D2" },
  { lon: 185, lat: 42, label: "Cannon Hill Park", icon: Trees, sky: "#DCEFD2" },
  { lon: 255, lat: 38, label: "Gas Street Basin", icon: Waves, sky: "#D6ECF2" },
  { lon: 325, lat: 42, label: "BT Tower", icon: RadioTower, sky: "#E6E2F4" },
];

const tagClassName = {
  transport: "border-[#8EC3E6] bg-white text-[#2F7FB8]",
  food: "border-[#F4B48E] bg-[#FFE6D5] text-[#D9642C]",
};

const toRad = Math.PI / 180;
const sinView = Math.sin(VIEW_LAT * toRad);
const cosView = Math.cos(VIEW_LAT * toRad);

// Orthographic projection: returns screen offset from the globe centre and how
// squarely the point faces the viewer (cosc ≤ 0 means it's round the back).
function project(lon: number, lat: number, spin: number, radius: number) {
  const phi = lat * toRad;
  const dLambda = (lon - spin) * toRad;
  const cosPhi = Math.cos(phi);
  const cosD = Math.cos(dLambda);
  return {
    x: radius * cosPhi * Math.sin(dLambda),
    y: -radius * (cosView * Math.sin(phi) - sinView * cosPhi * cosD),
    cosc: sinView * Math.sin(phi) + cosView * cosPhi * cosD,
  };
}

function GlobeSphere({ playing }: { playing: boolean }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const landmarkRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const spinRef = useRef(0);
  const playingRef = useRef(playing);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!box || !canvas || !context) return;

    let size = 0;
    let ratio = 1;

    const draw = () => {
      if (!size) return;
      const ctx = context;
      const half = size / 2;
      const radius = half * GLOBE_SCALE;
      const spin = spinRef.current;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, size, canvas.height / ratio);

      // halo
      const halo = ctx.createRadialGradient(half, half, radius * 0.96, half, half, half);
      halo.addColorStop(0, "rgba(255,255,255,0.95)");
      halo.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(half, half, half, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(half, half, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = COLORS.land;
      ctx.fillRect(0, 0, size, size);

      // fills shapes whose corners all face the viewer, batched per colour
      const fillShapes = (shapes: LonLat[][], color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (const shape of shapes) {
          const points = shape.map(([lon, lat]) => project(lon, lat, spin, radius));
          if (points.some((p) => p.cosc <= 0.01)) continue;
          ctx.moveTo(half + points[0].x, half + points[0].y);
          for (let i = 1; i < points.length; i += 1) ctx.lineTo(half + points[i].x, half + points[i].y);
          ctx.closePath();
        }
        ctx.fill();
      };

      city.blocks.forEach((shapes, index) => fillShapes(shapes, COLORS.blocks[index]));
      city.parks.forEach((shapes, index) => fillShapes(shapes, COLORS.parks[index]));
      fillShapes(city.rivers, COLORS.water);
      fillShapes(city.lakes, COLORS.water);

      // roads thin out as they curve away over the horizon
      ctx.strokeStyle = COLORS.road;
      ctx.lineCap = "round";
      for (const road of city.roads) {
        let previous = project(road[0][0], road[0][1], spin, radius);
        for (let i = 1; i < road.length; i += 1) {
          const next = project(road[i][0], road[i][1], spin, radius);
          if (previous.cosc > 0.02 && next.cosc > 0.02) {
            ctx.lineWidth = radius * 0.009 * (0.35 + 0.65 * Math.min(previous.cosc, next.cosc));
            ctx.beginPath();
            ctx.moveTo(half + previous.x, half + previous.y);
            ctx.lineTo(half + next.x, half + next.y);
            ctx.stroke();
          }
          previous = next;
        }
      }

      // atmosphere: the map fades to white haze toward the horizon
      const haze = ctx.createRadialGradient(half, half, radius * 0.62, half, half, radius);
      haze.addColorStop(0, "rgba(255,255,255,0)");
      haze.addColorStop(0.75, "rgba(255,255,255,0.35)");
      haze.addColorStop(1, "rgba(255,255,255,0.9)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();

      // tags ride the surface: shrink and fade as they curve out of view
      mapTags.forEach((tag, index) => {
        const el = tagRefs.current[index];
        if (!el) return;
        const p = project(tag.lon, tag.lat, spin, radius);
        const visible = Math.max(0, Math.min(1, (p.cosc - 0.08) / 0.3));
        el.style.opacity = String(visible);
        el.style.transform = `translate(${half + p.x}px, ${half + p.y}px) translate(-50%, -50%) scale(${0.55 + 0.45 * Math.max(p.cosc, 0)})`;
      });

      landmarks.forEach((landmark, index) => {
        const el = landmarkRefs.current[index];
        if (!el) return;
        const p = project(landmark.lon, landmark.lat, spin, radius);
        // kept a touch quieter than the tags so they read as background
        const visible = Math.max(0, Math.min(1, (p.cosc - 0.12) / 0.3)) * 0.92;
        el.style.opacity = String(visible);
        el.style.transform = `translate(${half + p.x}px, ${half + p.y}px) translate(-50%, -50%) scale(${0.5 + 0.5 * Math.max(p.cosc, 0)})`;
      });
    };
    drawRef.current = draw;

    const resize = () => {
      size = box.clientWidth;
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      // only the top of the globe is ever on screen, so skip drawing the rest
      canvas.width = Math.round(size * ratio);
      canvas.height = Math.round(size * 0.62 * ratio);
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(box);
    resize();

    // animate only while the section is on screen
    let onScreen = false;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      if (last && playingRef.current) {
        spinRef.current = (spinRef.current + (now - last) * DEGREES_PER_MS) % 360;
        draw();
      }
      last = now;
      frame = onScreen ? requestAnimationFrame(tick) : 0;
    };
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    });
    visibility.observe(box);

    return () => {
      observer.disconnect();
      visibility.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0" ref={boxRef}>
      <canvas className="absolute left-0 top-0 h-[62%] w-full" ref={canvasRef} />
      {landmarks.map((landmark, index) => {
        const Icon = landmark.icon;
        return (
          <span
            className="absolute left-0 top-0 size-[4.6%] opacity-0"
            key={landmark.label}
            ref={(el) => {
              landmarkRefs.current[index] = el;
            }}
          >
            <span
              className="relative flex size-full items-center justify-center overflow-hidden rounded-full border-[3px] border-white text-[#3E4A5C] shadow-[0_6px_16px_-6px_rgba(20,30,50,0.35)]"
              style={{ background: `linear-gradient(180deg, ${landmark.sky}, #FFFFFF)` }}
            >
              {landmark.image ? (
                <Image alt="" className="object-cover" fill sizes="5rem" src={landmark.image} />
              ) : (
                <Icon className="size-[48%]" strokeWidth={1.6} />
              )}
            </span>
            <span className="absolute left-1/2 top-[108%] -translate-x-1/2 whitespace-nowrap font-display text-[max(0.5rem,0.95cqw)] font-semibold uppercase tracking-[0.08em] text-[#4A5363] [text-shadow:0_0_6px_#fff,0_0_2px_#fff]">
              {landmark.label}
            </span>
          </span>
        );
      })}
      {mapTags.map((tag, index) => {
        const Icon = tag.icon;
        return (
          <span
            className={`absolute left-0 top-0 flex size-[3.4%] items-center justify-center rounded-full border-2 opacity-0 shadow-sm ${tagClassName[tag.kind]}`}
            key={`${tag.lon}-${tag.lat}`}
            ref={(el) => {
              tagRefs.current[index] = el;
            }}
          >
            <Icon className="size-[55%]" strokeWidth={2} />
          </span>
        );
      })}
    </div>
  );
}

export { GlobeSphere };
