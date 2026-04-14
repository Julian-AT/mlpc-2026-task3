import { Suspense } from "react";
import PitchCarousel from "@/components/pitch/pitch-carousel";

export default function Home() {
  return (
    <div className="fixed inset-0 h-screen bg-background">
      <Suspense>
        <PitchCarousel
          slides={[
            "SlideTitle",
            "SlideVerification",
            "SlideDisagreements",
            "SlideCaseStudy",
            "SlideIoUExplained",
            "SlideAgreement",
            "SlideOwnVsOther",
            "SlideMajorityVote",
            "SlideThreshold",
            "SlideClassDistribution",
            "SlideCooccurrence",
            "SlideMetadata",
            "SlideTsne",
            "SlideConclusions",
            "SlideTraining",
          ]}
        />
      </Suspense>
    </div>
  );
}
