import { Helmet } from "react-helmet-async";
import DocsLayout from "@/components/docs/DocsLayout";
import { Terminal, CheckCircle2, ExternalLink } from "lucide-react";

const DocsQuickStart = () => {
  return (
    <DocsLayout>
      <Helmet>
        <title>Quick Start - NexusAI Documentation</title>
        <meta name="description" content="Get started with NexusAI in minutes. Follow our quick start guide to set up your development environment." />
      </Helmet>

      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          <span className="text-gradient">Quick Start</span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Get NexusAI up and running in less than 10 minutes. This guide will walk you through the essential steps
          to set up your development environment.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Prerequisites</h2>
        <p className="text-muted-foreground mb-4">
          Before you begin, make sure you have the following installed:
        </p>

        <ul className="text-muted-foreground space-y-2 mb-6">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span><strong>Node.js 18+</strong> - JavaScript runtime</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span><strong>MongoDB 7.0+</strong> - Database</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span><strong>Docker & Docker Compose</strong> - Containerization</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span><strong>Git</strong> - Version control</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Step 1: Clone the Repository</h2>
        <p className="text-muted-foreground mb-4">
          First, clone the NexusAI repository to your local machine:
        </p>

        <div className="bg-secondary/50 rounded-lg p-4 mb-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">Terminal</span>
          </div>
          <pre className="text-sm text-foreground overflow-x-auto">
            <code>{`git clone https://github.com/Mucrypt/devops-project.git
cd devops-project`}</code>
          </pre>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Step 2: Backend Setup</h2>
        <p className="text-muted-foreground mb-4">
          Set up the Node.js backend with our automated script:
        </p>

        <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">Terminal</span>
          </div>
          <pre className="text-sm text-foreground overflow-x-auto">
            <code>{`cd backend
../scripts/backend-setup.sh`}</code>
          </pre>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          This script will install dependencies, set up environment variables, and prepare the database.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Step 3: Frontend Setup</h2>
        <p className="text-muted-foreground mb-4">
          Install frontend dependencies:
        </p>

        <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">Terminal</span>
          </div>
          <pre className="text-sm text-foreground overflow-x-auto">
            <code>{`cd chat-to-code-38
npm install`}</code>
          </pre>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Step 4: Run with Docker (Recommended)</h2>
        <p className="text-muted-foreground mb-4">
          The easiest way to run the entire stack is with Docker Compose:
        </p>

        <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">Terminal</span>
          </div>
          <pre className="text-sm text-foreground overflow-x-auto">
            <code>{`# From project root
./scripts/docker-setup.sh`}</code>
          </pre>
        </div>

        <p className="text-muted-foreground mb-6">
          This will start all services: MongoDB, Backend API, Frontend, and Nginx.
        </p>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-foreground mb-3">🎉 Your application is now running!</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Frontend: </span>
              <a href="http://localhost:5173" className="text-primary hover:underline flex items-center gap-1">
                http://localhost:5173 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Backend API: </span>
              <a href="http://localhost:3000" className="text-primary hover:underline flex items-center gap-1">
                http://localhost:3000 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">MongoDB: </span>
              <code className="text-primary">mongodb://localhost:27017</code>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Alternative: Run Services Individually</h2>
        <p className="text-muted-foreground mb-4">
          If you prefer to run services separately without Docker:
        </p>

        <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Start MongoDB</h3>
        <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/50">
          <pre className="text-sm text-foreground overflow-x-auto">
            <code>{`mongod --dbpath /path/to/data/db`}</code>
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Start Backend</h3>
        <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border/50">
          <pre className="text-sm text-foreground overflow-x-auto">
            <code>{`cd backend
npm run dev`}</code>
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Start Frontend</h3>
        <div className="bg-secondary/50 rounded-lg p-4 mb-6 border border-border/50">
          <pre className="text-sm text-foreground overflow-x-auto">
            <code>{`cd chat-to-code-38
npm run dev`}</code>
          </pre>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Next Steps</h2>
        <div className="grid gap-4 not-prose my-6">
          <a href="/docs/backend-setup" className="block p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
            <h4 className="font-semibold text-foreground mb-1">Backend Development</h4>
            <p className="text-sm text-muted-foreground">
              Learn about the backend architecture and API endpoints.
            </p>
          </a>

          <a href="/docs/frontend-setup" className="block p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
            <h4 className="font-semibold text-foreground mb-1">Frontend Development</h4>
            <p className="text-sm text-muted-foreground">
              Explore the React frontend and component structure.
            </p>
          </a>

          <a href="/docs/docker-setup" className="block p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
            <h4 className="font-semibold text-foreground mb-1">Docker Setup</h4>
            <p className="text-sm text-muted-foreground">
              Deep dive into containerization and Docker configuration.
            </p>
          </a>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6 mt-8">
          <h4 className="font-semibold text-foreground mb-2">⚠️ Troubleshooting</h4>
          <p className="text-sm text-muted-foreground mb-2">
            If you encounter any issues:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Make sure all prerequisites are installed</li>
            <li>• Check that ports 3000, 5173, and 27017 are not in use</li>
            <li>• Verify MongoDB is running</li>
            <li>• Check the logs for error messages</li>
          </ul>
        </div>
      </div>
    </DocsLayout>
  );
};

export default DocsQuickStart;
