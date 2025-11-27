import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full flex flex-col">
        <div className="flex-1 flex flex-col w-full p-5">{children}</div>
      </div>
      <Footer />
    </main>
  );
}