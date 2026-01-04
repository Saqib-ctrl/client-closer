import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const MouseFollowOrbs = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for orb positions
  const orb1X = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const orb1Y = useSpring(mouseY, { stiffness: 50, damping: 30 });
  
  const orb2X = useSpring(mouseX, { stiffness: 30, damping: 40 });
  const orb2Y = useSpring(mouseY, { stiffness: 30, damping: 40 });
  
  const orb3X = useSpring(mouseX, { stiffness: 20, damping: 50 });
  const orb3Y = useSpring(mouseY, { stiffness: 20, damping: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset orbs from cursor position for visual effect
      mouseX.set(e.clientX - 100);
      mouseY.set(e.clientY - 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary orb - follows closest */}
      <motion.div
        style={{ x: orb1X, y: orb1Y }}
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl"
      />
      
      {/* Secondary orb - medium lag */}
      <motion.div
        style={{ x: orb2X, y: orb2Y }}
        className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-primary/15 to-transparent blur-2xl"
      />
      
      {/* Tertiary orb - slowest follow */}
      <motion.div
        style={{ x: orb3X, y: orb3Y }}
        className="absolute w-72 h-72 rounded-full bg-gradient-to-bl from-primary/10 to-transparent blur-3xl"
      />
    </div>
  );
};

export default MouseFollowOrbs;