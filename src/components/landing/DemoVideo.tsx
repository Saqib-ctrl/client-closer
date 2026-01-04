import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";
import demoVideo from "@/assets/demo-video.mp4";

const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="demo" className="section-padding bg-gradient-to-b from-background to-muted/30">
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
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50 group">
            {/* Video */}
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={demoVideo} type="video/mp4" />
              </video>
              
              {/* Play/Pause overlay */}
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/5 backdrop-blur-[2px] cursor-pointer"
                  onClick={togglePlay}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </motion.div>
                </motion.div>
              )}

              {/* Video controls */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-primary-foreground" />
                    )}
                  </button>
                </div>
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
