import { Navbar } from "@/components/navbar";

export default function ComingSoon() {
  return (
    <div className="overflow-hidden min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-2xl font-bold">Coming Soon</h1>
      </div>
    </div>
  );
}

