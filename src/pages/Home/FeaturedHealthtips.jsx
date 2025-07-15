import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import title from 're-title';

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
    title("Health Tips | Healthcare Corner");
  }, []);

  return (
    <section className="bg-blue-50 py-10 px-4 rounded-lg mt-10 shadow-sm">
      {/* Animated Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-center mb-6 text-blue-800"
      >
        💡 Featured Health Tips
      </motion.h2>

      {/* Animated Tips List */}
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="max-w-3xl mx-auto space-y-4 text-gray-700 text-lg list-disc list-inside"
      >
        {tips.map((tip, index) => (
          <motion.li
            key={index}
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0 },
            }}
            className="leading-relaxed"
          >
            {tip}
          </motion.li>
        ))}
      </motion.ul>

      <div className="text-center mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn btn-outline btn-primary"
        >
          Read More Tips
        </motion.button>
      </div>
    </section>
  );
};

export default FeaturedHealthTips;
