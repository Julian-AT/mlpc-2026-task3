import PitchCarousel from "@/components/pitch/pitch-carousel";
import { Grid } from "@/components/pitch/ui";
import { MLPC_SLIDE_KEYS } from "@/components/deck/outline";

export default function MlpcSlidesPage() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 h-screen bg-background text-white">
      <div className="">
        <Grid />
        <PitchCarousel slides={[...MLPC_SLIDE_KEYS]} />
      </div>
    </div>
  );
}
