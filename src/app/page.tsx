import { SlotMachine } from "@/components/game/slot-machine";
import Snowfall from "@/components/game/snow-fall"; // Import the new component

export default function Home() {
  return (
    // Add 'relative' and 'overflow-hidden' for positioning the snow
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* This is the snowfall component. It will be in the background. */}
      <Snowfall />

      {/* Add 'relative' and 'z-10' to make sure the slot machine is on top of the snow */}
      <div className="relative z-10">
        <SlotMachine />
      </div>

    </main>
  );
}