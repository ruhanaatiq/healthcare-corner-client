import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const tips = [
  "💧 Stay hydrated by drinking 8 glasses of water daily.",
  "😴 Get 7–8 hours of sleep to boost immunity.",
  "🏃‍♀️ Exercise at least 30 minutes a day.",
  "🧼 Wash your hands regularly to prevent infection.",
  "🍎 Eat a balanced diet rich in fruits and vegetables.",
  "💊 Always consult a doctor before taking new medication.",
];

const FeaturedHealthTips = () => {
  useEffect(() => {
    document.title = "Health Tips | Healthcare Corner";
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className=" py-10 px-4 rounded-lg mt-10 shadow-md"
    >
      {/* Heading Animation */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-center mb-6 text-red-800"
      >
        💡 Featured Health Tips
      </motion.h2>

      {/* Tips List Animation */}
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="max-w-3xl mx-auto space-y-4 text-gray-700 text-lg list-disc list-inside"
      >
        {tips.map((tip, index) => (
          <motion.li
            key={index}
            variants={{
              hidden: { opacity: 0, x: -25 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="leading-relaxed"
          >
            {tip}
          </motion.li>
        ))}
      </motion.ul>

      {/* Button Animation */}
      <div className="text-center mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="btn btn-outline btn-primary"
        >
          Read More Tips
        </motion.button>
      </div>
    </motion.section>
  );
};

export default FeaturedHealthTips;
