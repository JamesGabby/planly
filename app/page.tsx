import { NavbarLanding } from "@/components/navbar-landing";
import { Footer } from "@/components/footer";
import LandingPage from "./landing/page";

export default function Home() {
  return (
    <>
      <NavbarLanding />
      <LandingPage />
      <Footer />
    </>
  );
}