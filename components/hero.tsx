import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <h1 className={`${poppins.className} text-6xl font-semibold tracking-tight text-primary transition`}>Lessonly</h1>
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The fastest way to <span className="font-bold">plan</span> and <span className="font-bold">manage</span> your lessons.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
