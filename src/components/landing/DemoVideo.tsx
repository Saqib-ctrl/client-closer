import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            See it in action
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Watch how it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From job description to client-ready proposal in under 2 minutes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Video Container with glow effect */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50">
            {/* Gradient overlay for visual appeal */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 pointer-events-none z-10" />
            
            {/* Placeholder video - replace with actual demo video */}
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster=""
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                {/* Add your demo video source here */}
                <source src="" type="video/mp4" />
              </video>
              
              {/* Placeholder content when no video */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-center"
                >
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center backdrop-blur-sm border border-primary/20">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg shadow-primary/30">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </motion.div>
                  </div>
                  <p className="text-muted-foreground font-medium">Demo video coming soon</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">See the magic in action</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute -left-4 md:-left-8 top-1/4 w-24 h-24 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute -right-4 md:-right-8 bottom-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
          />
        </motion.div>

        {/* Feature highlights below video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {[
            { label: "2 min setup", icon: "⚡" },
            { label: "AI-powered", icon: "🤖" },
            { label: "Client-ready", icon: "✨" }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DemoVideo;
