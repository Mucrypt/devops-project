import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Startup Founder",
    avatar: "SC",
    content: "NexusAI completely changed how we build MVPs. What used to take weeks now takes hours. It's like having a senior developer who never sleeps.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Designer",
    avatar: "MR",
    content: "As a designer, I can now bring my prototypes to life without waiting for dev resources. The code quality is production-ready from day one.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Tech Lead at Scale",
    avatar: "EW",
    content: "We've integrated NexusAI into our workflow for rapid prototyping. The AI understands complex requirements and delivers clean, maintainable code.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by
            <span className="text-gradient"> Builders</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of developers and entrepreneurs shipping faster than ever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="p-8 rounded-2xl bg-glass border border-border/50 hover:border-primary/30 transition-all duration-500"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-8 leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
