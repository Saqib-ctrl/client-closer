import { Palette, Code, Megaphone, Video } from "lucide-react";

const audiences = [
  {
    icon: Palette,
    title: "Designers",
    description: "UI/UX, brand, graphic, and product designers"
  },
  {
    icon: Code,
    title: "Developers",
    description: "Web, mobile, and software developers"
  },
  {
    icon: Megaphone,
    title: "Marketers",
    description: "Content, SEO, social media, and growth specialists"
  },
  {
    icon: Video,
    title: "Video Editors",
    description: "Motion graphics, video production, and editors"
  }
];

const Audience = () => {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Built for every freelancer.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whatever your skill, your proposals should work as hard as you do.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 card-elevated group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                <audience.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{audience.title}</h3>
              <p className="text-muted-foreground">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
