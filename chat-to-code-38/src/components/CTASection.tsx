import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-primary/30 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Start building today</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Build
            <span className="text-gradient block">Something Amazing?</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of builders creating the future with AI. Your next great idea is just a conversation away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl">
              Schedule Demo
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required · Free tier forever · Deploy in seconds
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
