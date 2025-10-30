import { ThemeSwitcher } from "./theme-switcher";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p className={`${poppins.className} font-semibold tracking-tight text-primary hover:opacity-80 transition`}>
        Lessonly
      </p>
      <ThemeSwitcher />
    </footer>
  )
}