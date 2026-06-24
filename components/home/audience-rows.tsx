"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { useIsClient } from "@/components/motion/use-is-client";

type Row = {
  number: string;
  title: string;
  description: string;
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const ROW_CLASS =
  "nuclii-numbered-item group/role transition duration-200 ease-out hover:border-white/45";

function RowBody({ row }: { row: Row }) {
  return (
    <>
      <p className="nuclii-numbered-item__heading">
        <span className="nuclii-numbered-item__number transition-transform duration-200 group-hover/role:-translate-y-0.5">
          {row.number}
        </span>
        {row.title}
      </p>
      <p className="nuclii-numbered-item__description">{row.description}</p>
    </>
  );
}

function AudienceRows({ rows }: { rows: readonly Row[] }) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();

  if (!isClient || reduce) {
    return (
      <div>
        {rows.map((row) => (
          <div className={ROW_CLASS} key={row.number}>
            <RowBody row={row} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      variants={container}
      viewport={{ once: true, amount: 0.25 }}
      whileInView="show"
    >
      {rows.map((row) => (
        <motion.div className={ROW_CLASS} key={row.number} variants={item}>
          <RowBody row={row} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export { AudienceRows };
