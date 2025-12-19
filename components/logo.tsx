import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function Logo() {
  return (
    <Link
      href="/"
      className={`${poppins.className} group flex items-center gap-3 text-2xl font-bold tracking-tight transition-all duration-300 hover:scale-[1.02]`}
    >
      {/* Logo Container with Glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-primary/15 to-transparent border border-primary/10 group-hover:border-primary/30 transition-all duration-300">
          <Image
            src="/logo.png"
            alt="Lessonly Logo"
            width={32}
            height={32}
            className="w-8 h-8 group-hover:brightness-110 transition-all duration-300"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Text with Animated Gradient */}
      <div className="relative">
        <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary group-hover:to-accent transition-all duration-500">
          Lessonly
        </span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 rounded-full" />
      </div>
    </Link>
  );
}