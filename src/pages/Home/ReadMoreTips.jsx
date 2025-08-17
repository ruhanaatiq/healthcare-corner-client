import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const moreTips = [
  "🧘‍♀️ Practice mindfulness or meditation to reduce stress.",
  "🦷 Brush and floss your teeth twice daily.",
  "📵 Take breaks from screens to rest your eyes.",
  "🚶‍♂️ Incorporate walking into your daily routine.",
  "💉 Stay updated on vaccinations.",
  "🧴 Use sunscreen to protect your skin from UV rays.",
  "📝 Keep a health journal to track symptoms or habits.",
  "🍳 Eat breakfast to jumpstart metabolism.",
  "📖 Educate yourself regularly about health topics.",
  "🏥 Schedule routine check-ups with your doctor.",
];

const ReadMoreTips = () => {
  useEffect(() => {
  document.title = "Healthcare Corner | Health Tips";
  const favicon = document.getElementById("favicon");
  if (favicon) {
    favicon.href = "/logo.png"; 
  }
}, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <h2 className="text-3xl font-bold mb-6 text-red-800 text-center">📝 More Health Tips</h2>

      <ul className="list-disc list-inside space-y-4 text-lg text-gray-800">
        {moreTips.map((tip, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="leading-relaxed"
          >
            {tip}
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
};

export default ReadMoreTips;
