import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="flex-1 w-full flex flex-col gap-20 items-center mt-10">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">{children}</div>
        <Footer />
      </div>
    </main>
  );
}
