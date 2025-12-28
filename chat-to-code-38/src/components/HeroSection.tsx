import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Code2, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-primary/30 mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Powered by Advanced AI</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Build Apps with
            <span className="text-gradient block mt-2">Just a Conversation</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Transform your ideas into fully functional Next.js applications. 
            Simply chat with our AI and watch your vision come to life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl">
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Floating cards */}
          <div className="relative h-[300px] md:h-[400px] animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {/* Main chat window */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-2xl bg-glass rounded-2xl border border-border/50 shadow-glow overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-4 text-sm text-muted-foreground">NexusAI Chat</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">You</span>
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm">Create a modern e-commerce dashboard with analytics</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 border border-primary/20">
                    <p className="text-sm text-muted-foreground">Building your dashboard with sales charts, inventory tracking, and order management...</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 text-xs rounded-md bg-primary/20 text-primary">React</span>
                      <span className="px-2 py-1 text-xs rounded-md bg-accent/20 text-accent">TypeScript</span>
                      <span className="px-2 py-1 text-xs rounded-md bg-green-500/20 text-green-400">Tailwind</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -left-4 md:left-8 top-20 animate-float">
              <div className="bg-glass rounded-xl p-4 border border-border/50">
                <Code2 className="w-6 h-6 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Auto-generated<br/>Clean Code</p>
              </div>
            </div>

            <div className="absolute -right-4 md:right-8 top-32 animate-float" style={{ animationDelay: '1s' }}>
              <div className="bg-glass rounded-xl p-4 border border-border/50">
                <Zap className="w-6 h-6 text-accent mb-2" />
                <p className="text-xs text-muted-foreground">Instant<br/>Deployment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
