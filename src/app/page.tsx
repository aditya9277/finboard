"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  HeroSection,
  FeaturesSection,
  CTASection,
  Footer,
  Preloader,
} from "@/components/landing";

export default function LandingPage() {
  const router = useRouter();
  const [showPreloader, setShowPreloader] = useState(false);

  const handleGetStarted = () => {
    setShowPreloader(true);
  };

  const handlePreloaderComplete = () => {
    router.push("/dashboard");
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      <div className="min-h-screen bg-white">
        <Navbar onGetStarted={handleGetStarted} />
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <CTASection onGetStarted={handleGetStarted} />
        <Footer />
      </div>
    </>
  );
}
