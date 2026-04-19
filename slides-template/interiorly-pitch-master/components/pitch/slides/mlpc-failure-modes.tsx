"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";

const modes = [
  {
    title: "Systematic omission",
    desc: "Annotators missed over half of events in some clips, biasing classifiers toward precision over recall.",
  },
  {
    title: "Acoustic confusion",
    desc: "bell_ringing / phone_ringing and door_open_close / wardrobe_drawer_open_close repeatedly swapped due to similar mechanical resonances.",
  },
  {
    title: "Boundary disagreement",
    desc: "Merge vs. split near ~1 s pauses produced different region counts even when class labels matched.",
  },
  {
    title: "Transient bias",
    desc: "Brief events (keychain, light_switch) missed disproportionately compared to sustained sounds (vacuum, running water).",
  },
];

export function SlideMlpcFailureModes() {
  return (
    <SlideShell title="Disagreement patterns" className="col-span-3">
      <div className="col-span-3 mx-auto flex max-w-2xl flex-col gap-6">
        <p className="text-muted-foreground">
          Agreement on verified recordings ranged from{" "}
          <strong className="text-foreground">24 %</strong> to{" "}
          <strong className="text-foreground">93 %</strong>, worst on
          polyphonic multi-class clips.
        </p>

        <div className="space-y-3">
          {modes.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="border-l-2 border-border py-1 pl-4"
            >
              <p className="font-medium">{m.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
            </motion.div>
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + modes.length * 0.12 }}
            className="mt-4 rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
          >
            Agreement drops monotonically with complexity — below 40 % for
            polyphonic clips, near 90 % for single-source recordings.
          </motion.p>
        </div>
      </div>
    </SlideShell>
  );
}
