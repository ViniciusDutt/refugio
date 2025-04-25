import { motion } from "motion/react";
import { useEffect, useState } from "react";

export const Orb = ({ delay }: { delay: number }) => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setCoords({ x: randomX(), y: randomY() });
  }, []);

  if (!coords) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: coords.x, y: coords.y }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], x: 0, y: 0 }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
      className="absolute w-3 h-3 bg-white top-2 rounded-full shadow-[0_0_6px_2px_#ffd700] z-10"
    />
  );
};

function randomX() {
  return Math.floor(Math.random() * 160 - 80);
}
function randomY() {
  return Math.floor(Math.random() * 160 - 80);
}
