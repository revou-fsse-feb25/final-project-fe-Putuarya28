import React from "react";
import Image from "next/image";

const steps = [
  {
    title: "Get Ideas",
    description:
      "Browse inspirations and ideas tailored to your needs. Find the perfect style and concept for your kebaya.",
    imgAlt: "Get Ideas",
    imgSrc: "/images/get-ideas.jpg",
  },
  {
    title: "Video Call Consultation",
    description:
      "Schedule a video call with our experts tailor to discuss your needs and get professional advice.",
    imgAlt: "Video Call Consultation",
    imgSrc: "/images/video-call.jpg",
  },
  {
    title: "Delivery",
    description:
      "Receive your kebaya delivered to your doorstep, ready to wear.",
    imgAlt: "Delivery",
    imgSrc: "/images/delivery.png",
  },
];

export default function StepGuide() {
  return (
    <section className="w-full py-16 bg-white">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">How It Works</h2>
        <p className="text-lg text-gray-600 mb-2">
          Simple steps to get your custom kebaya
        </p>
        <div className="mx-auto w-24 h-1 bg-gray-200 rounded" />
      </div>
      {/* Steps */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {steps.map((step, idx) => (
          <div
            className="bg-white rounded-xl shadow-md border border-gray-500 w-250 min-h-[500px] flex flex-col items-center p-6 pb-0 transition hover:shadow-lg overflow-hidden"
            key={idx}
          >
            {/* Step image */}
            <div className="bg-gray-100 flex items-center justify-center mb-6 border border-gray-200 overflow-hidden">
              <Image
                src={step.imgSrc}
                alt={step.imgAlt}
                width={1200}
                height={1200}
              />
            </div>
            {/* Title and Description in gray container */}
            <div className="flex-grow" />
            <div className="w-300 h-30 bg-gray-100 rounded-lg p-4 text-center mt-auto">
              <h3 className="font-semibold text-xl mb-2 text-gray-800">
                {step.title}
              </h3>
              <p
                className="text-gray-600 whitespace-normal break-words mx-auto"
                style={{ maxWidth: "850px", textAlign: "center" }}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* CTA Button */}
      <div className="flex justify-center">
        <a href="/booking">
          <button className="bg-gray-800 text-white rounded-lg px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition">
            Book appointment now
          </button>
        </a>
      </div>
    </section>
  );
}
