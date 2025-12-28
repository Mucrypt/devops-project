import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home,
  BookOpen,
  Rocket,
  Code,
  Settings,
  Users,
  Zap,
  Database,
  Cloud,
  GitBranch,
  Shield,
  ChevronDown,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DocSection {
  title: string;
  items: {
    title: string;
    href: string;
    icon?: any;
  }[];
}

const docsSections: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: Home },
      { title: "Quick Start", href: "/docs/quick-start", icon: Rocket },
      { title: "Installation", href: "/docs/installation", icon: Code },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Architecture", href: "/docs/architecture", icon: GitBranch },
      { title: "Features", href: "/docs/features", icon: Zap },
      { title: "Technology Stack", href: "/docs/tech-stack", icon: Database },
    ],
  },
  {
    title: "Development",
    items: [
      { title: "Backend Setup", href: "/docs/backend-setup", icon: Settings },
      { title: "Frontend Setup", href: "/docs/frontend-setup", icon: Code },
      { title: "Docker Setup", href: "/docs/docker-setup", icon: Cloud },
    ],
  },
  {
    title: "Deployment",
    items: [
      { title: "Kubernetes Deployment", href: "/docs/kubernetes", icon: Cloud },
      { title: "AWS EKS Setup", href: "/docs/aws-eks", icon: Cloud },
      { title: "CI/CD Pipeline", href: "/docs/cicd", icon: GitBranch },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "API Reference", href: "/docs/api-reference", icon: BookOpen },
      { title: "Security", href: "/docs/security", icon: Shield },
      { title: "Contributing", href: "/docs/contributing", icon: Users },
    ],
  },
];

interface DocsLayoutProps {
  children: React.ReactNode;
}

const DocsLayout = ({ children }: DocsLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["Getting Started"]);
  const location = useLocation();

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">NexusAI Docs</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-6">
          {docsSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-2 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                <span>{section.title}</span>
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {expandedSections.includes(section.title) && (
                <ul className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-2 py-2 text-sm rounded-lg transition-colors",
                            isActive(item.href)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          )}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom CTA */}
      <div className="p-4 border-t border-border/50">
        <div className="bg-gradient-primary rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-2">Need Help?</h4>
          <p className="text-xs text-white/80 mb-3">
            Join our community for support and updates
          </p>
          <Button size="sm" variant="secondary" className="w-full" asChild>
            <a href="https://github.com/Mucrypt/devops-project" target="_blank" rel="noopener noreferrer">
              GitHub Repository
            </a>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">NexusAI</span>
              </Link>
              <span className="text-muted-foreground mx-2">/</span>
              <span className="text-muted-foreground">Documentation</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button size="sm" className="hidden md:flex shadow-button" asChild>
              <a href="https://github.com/Mucrypt/devops-project" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)] gap-6 px-4 py-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)]">
          <div className="h-full rounded-lg border border-border/50 bg-card/50 backdrop-blur">
            <SidebarContent />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed top-16 left-0 bottom-0 z-50 w-72 border-r border-border/50 bg-background lg:hidden">
              <SidebarContent />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur p-6 md:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;
