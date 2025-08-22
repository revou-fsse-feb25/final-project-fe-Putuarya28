import React from "react";
import Image from "next/image";

const instructions = [
  "Stand straight and relax your body.",
  "Use a soft measuring tape for accuracy.",
  "Measure your bust at the fullest part.",
  "Measure your waist at the narrowest part.",
  "Measure your hips at the widest part.",
  "For sleeve, measure from shoulder to wrist.",
  "For shoulder width, measure from one shoulder edge to the other.",
  "For length, measure from the top of the shoulder down as needed.",
];

const MeasurementGuidePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Replace src with your actual image path and set width/height accordingly */}
      
      <h1 className="text-2xl font-bold m-4 text-center">Measurement Guide</h1>
      <div className="w-full  mb-8">
        <Image
          src="/images/measurements.png"
          alt="Measurement Guide"
          width={1200}
          height={500}
          className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow border-2 border-gray-200"
          priority
        />
      </div>
      
      <ol className="list-decimal list-inside space-y-2 text-lg text-gray-700 mb-12">
        {instructions.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default MeasurementGuidePage;
