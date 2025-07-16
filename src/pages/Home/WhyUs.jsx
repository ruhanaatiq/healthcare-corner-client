import React from 'react';
import { Link } from 'react-router-dom';

const WhyUs = () => {
  return (
    <>
      {/* Section 1 - Text Left, Image Right */}
      <section className="flex flex-col md:flex-row items-center gap-8 px-6 py-12 bg-white">
        {/* Text Column */}
        <div className="md:w-1/2 bg-[#e91616] text-white p-8 rounded-lg shadow-md">
          <h3 className="text-sm uppercase tracking-wide mb-2">Why Us</h3>
          <h2 className="text-3xl font-bold mb-4">Diagnosis You Can Trust</h2>
          <p className="text-base leading-relaxed mb-6">
            You can depend on the quality of our diagnosis and test results. Our
            laboratories are set up according to international standards and
            protocols. Our diagnostic lab is one of the few internationally
            accredited labs in Bangladesh.
          </p>
        </div>

        {/* Image Column */}
        <div className="md:w-1/2">
          <img
            src="https://i.ibb.co/yccKpDZp/doctor-1.jpg"
            alt="Lab diagnosis"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Section 2 - Image Right, Text Left */}
      <section className="flex flex-col md:flex-row-reverse items-center gap-8 px-6 py-12 bg-white">
        {/* Text Column */}
        <div className="md:w-1/2 bg-[#e91616] text-white p-8 rounded-lg shadow-md">
          <h3 className="text-sm uppercase tracking-wide mb-2">Why Us</h3>
          <h2 className="text-3xl font-bold mb-4">Reliable Lab Services</h2>
          <p className="text-base leading-relaxed mb-6">
            Our modern laboratory equipment and expert technicians ensure accuracy in every test. With quick turnaround times and stringent quality controls, you can count on us for reliable diagnostics.
          </p>
        </div>

        {/* Image Column */}
        <div className="md:w-1/2">
          <img
            src="https://i.ibb.co/7JY72LBG/team.jpg"
            alt="Reliable lab services"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>
      </section>
    </>
  );
};

export default WhyUs;
