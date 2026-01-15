import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Poppins } from "next/font/google";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-2">
      <p className={`${poppins.className} font-semibold tracking-tight text-primary hover:opacity-80 transition`}>
        Lessonly
      </p>
      <ThemeSwitcher />
      <div className="flex items-center gap-1">
        Built by ©<Link href={'https://jamesgabbitus.dev'}  target="_blank" rel="noopener noreferrer"><span className="font-extrabold text-blue-400">James Gabbitus</span></Link>
      </div>
    </footer>
  )
}