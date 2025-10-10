import CTA from "@/components/landing/CTA";
import Hero from "@/components/landing/Hero";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WhatToAsk from "@/components/landing/WhatToAsk";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingSection from "@/components/landing/PricingSection";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <WhatToAsk />
      <PricingSection />
      <CTA />
      <Footer />
    </div>
  );
}
