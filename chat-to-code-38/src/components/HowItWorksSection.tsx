import { MessageCircle, Cpu, Eye, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Describe Your Vision",
    description: "Tell the AI what you want to build. Be as detailed or as brief as you like - it understands natural language.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Generates Code",
    description: "Watch as your application takes shape in real-time. Full React components, styling, and logic - all generated instantly.",
  },
  {
    icon: Eye,
    step: "03",
    title: "Preview & Refine",
    description: "See your app live as you build. Make changes through conversation and iterate until it's perfect.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Deploy & Scale",
    description: "One click to deploy worldwide. Your app is live with automatic SSL, CDN, and infinite scaling.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From Idea to App in
            <span className="text-gradient"> Minutes</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our streamlined workflow makes building professional applications effortless.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative group">
                {/* Step number */}
                <div className="text-8xl font-bold text-primary/10 absolute -top-6 left-0 select-none">
                  {step.step}
                </div>

                <div className="relative pt-12">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-glass border border-border/50 flex items-center justify-center mb-6 group-hover:border-primary/50 transition-all duration-500 group-hover:shadow-glow">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8">
                    <div className="w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
