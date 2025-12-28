import { Helmet } from "react-helmet-async";
import DocsLayout from "@/components/docs/DocsLayout";
import { Rocket, Zap, Shield, Code } from "lucide-react";

const DocsIntroduction = () => {
  return (
    <DocsLayout>
      <Helmet>
        <title>Introduction - NexusAI Documentation</title>
        <meta name="description" content="Welcome to NexusAI documentation. Learn how to build and deploy modern applications with our comprehensive guides." />
      </Helmet>

      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
          <span className="text-gradient">Welcome to NexusAI</span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Build beautiful, scalable applications through natural conversation. NexusAI is a complete DevOps platform
          that combines modern development practices with cloud-native technologies.
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-8 not-prose">
          <div className="bg-glass rounded-lg p-6">
            <Rocket className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Quick to Deploy</h3>
            <p className="text-sm text-muted-foreground">
              Get your application running in minutes with our automated deployment scripts and CI/CD pipelines.
            </p>
          </div>

          <div className="bg-glass rounded-lg p-6">
            <Zap className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Built with performance in mind using React, Node.js, and modern cloud infrastructure.
            </p>
          </div>

          <div className="bg-glass rounded-lg p-6">
            <Shield className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Secure by Default</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade security with JWT authentication, encrypted secrets, and network policies.
            </p>
          </div>

          <div className="bg-glass rounded-lg p-6">
            <Code className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Developer Friendly</h3>
            <p className="text-sm text-muted-foreground">
              Well-documented codebase with TypeScript, comprehensive tests, and clear examples.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">What is NexusAI?</h2>
        <p className="text-muted-foreground mb-4">
          NexusAI is a production-ready DevOps platform that demonstrates modern software development practices.
          It includes:
        </p>

        <ul className="text-muted-foreground space-y-2 mb-6">
          <li>✅ Full-stack application with React frontend and Node.js backend</li>
          <li>✅ MongoDB database with Mongoose ODM</li>
          <li>✅ Docker containerization with multi-stage builds</li>
          <li>✅ Kubernetes orchestration with Helm charts</li>
          <li>✅ AWS EKS cluster deployment</li>
          <li>✅ GitHub Actions CI/CD pipeline</li>
          <li>✅ Horizontal Pod Autoscaling (HPA)</li>
          <li>✅ NGINX Ingress Controller with Load Balancer</li>
          <li>✅ Comprehensive monitoring and logging</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Technology Stack</h2>
        
        <div className="bg-secondary/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Frontend</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• React 18 with TypeScript</li>
            <li>• Vite 7.3 for blazing fast builds</li>
            <li>• TailwindCSS for styling</li>
            <li>• Shadcn/ui component library</li>
            <li>• React Router for navigation</li>
          </ul>
        </div>

        <div className="bg-secondary/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Backend</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• Node.js 20 with Express 4.18</li>
            <li>• TypeScript for type safety</li>
            <li>• MongoDB 7.0 with Mongoose</li>
            <li>• JWT authentication</li>
            <li>• Winston for logging</li>
            <li>• Joi for validation</li>
          </ul>
        </div>

        <div className="bg-secondary/50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">DevOps</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• Docker with multi-stage builds</li>
            <li>• Kubernetes 1.31</li>
            <li>• Helm 3.x for package management</li>
            <li>• AWS EKS for cloud hosting</li>
            <li>• GitHub Actions for CI/CD</li>
            <li>• NGINX Ingress Controller</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Getting Started</h2>
        <p className="text-muted-foreground mb-4">
          Ready to dive in? Here are some paths you can take:
        </p>

        <div className="grid gap-4 not-prose my-6">
          <a href="/docs/quick-start" className="block p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Quick Start Guide</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Get up and running with NexusAI in under 10 minutes.
            </p>
          </a>

          <a href="/docs/installation" className="block p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Code className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Installation</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Detailed installation instructions for all components.
            </p>
          </a>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-8">
          <h4 className="font-semibold text-foreground mb-2">💡 Need Help?</h4>
          <p className="text-sm text-muted-foreground">
            If you have questions or need assistance, check out our{" "}
            <a href="https://github.com/Mucrypt/devops-project" className="text-primary hover:underline">
              GitHub repository
            </a>{" "}
            or open an issue.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
};

export default DocsIntroduction;
