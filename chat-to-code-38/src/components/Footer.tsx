import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/50 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NexusAI</span>
            </div>
            <p className="text-muted-foreground max-w-xs mb-6">
              Build beautiful apps and websites through natural conversation. The future of development is here.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                <Twitter className="w-5 h-5 text-muted-foreground" />
              </a>
              <a href="https://github.com/Mucrypt/devops-project" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                <Github className="w-5 h-5 text-muted-foreground" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                <Linkedin className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="https://github.com/Mucrypt/devops-project/releases" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Changelog</a></li>
              <li><a href="https://github.com/Mucrypt/devops-project" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link to="/docs/quick-start" className="text-muted-foreground hover:text-foreground transition-colors">Quick Start</Link></li>
              <li><a href="https://github.com/Mucrypt/devops-project" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a></li>
              <li><a href="https://github.com/Mucrypt/devops-project/issues" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="https://github.com/Mucrypt" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="https://github.com/Mucrypt/devops-project" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 NexusAI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for builders everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
