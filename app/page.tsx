import { NavbarLanding } from "@/components/navbar-landing";
import { Footer } from "@/components/footer";
import LandingPage from "./landing/page";
import BirthdayCard from "@/components/BirthdayCard";

export default function Home() {
  return (
    <>
      <NavbarLanding />
      <BirthdayCard />
      <LandingPage />
      <Footer />
    </>
  );
}