import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[800px] flex flex-col items-center justify-center text-center -mt-18">
      {/* Hero Image */}
      <Image
        src="/images/hero.svg"
        alt="Hero Image"
        width={1440}
        height={800}
        className="w-full h-[800px] object-cover object-center"
        priority
      />
      {/* Smoother Gradient Overlay at Bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,0.8) 85%, #fff 100%)",
        }}
      />
    </section>
  );
};

export default Hero;
