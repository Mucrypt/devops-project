import { MessageSquare, Wand2, Rocket, Shield, Layers, RefreshCw } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description: "Simply describe what you want to build in plain English. Our AI understands context and creates exactly what you need.",
  },
  {
    icon: Wand2,
    title: "Intelligent Code Generation",
    description: "Production-ready React and Next.js code generated instantly. Clean, maintainable, and following best practices.",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description: "Deploy your app to the cloud instantly. No configuration needed - we handle hosting, SSL, and scaling.",
  },
  {
    icon: Shield,
    title: "Built-in Security",
    description: "Enterprise-grade security out of the box. Authentication, API protection, and data encryption included.",
  },
  {
    icon: Layers,
    title: "Full-Stack Ready",
    description: "Database, authentication, file storage, and serverless functions. Everything you need for complete applications.",
  },
  {
    icon: RefreshCw,
    title: "Iterate Instantly",
    description: "Make changes through conversation. The AI remembers context and evolves your app as you refine your vision.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="text-gradient block">Build Faster</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From idea to production in minutes. Our AI handles the complexity so you can focus on what matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-glass border border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-500">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
