import { Helmet } from "react-helmet-async";
import DocsLayout from "@/components/docs/DocsLayout";
import { Cloud, Boxes, GitBranch, Zap } from "lucide-react";

const DocsArchitecture = () => {
  return (
    <DocsLayout>
      <Helmet>
        <title>Architecture - NexusAI Documentation</title>
        <meta name="description" content="Understand the architecture and design principles behind NexusAI." />
      </Helmet>

      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          <span className="text-gradient">Architecture Overview</span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          NexusAI follows a modern microservices architecture with cloud-native patterns, designed for
          scalability, reliability, and ease of deployment.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">System Architecture</h2>
        
        <div className="bg-secondary/30 rounded-lg p-8 mb-8 border border-border/50">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Cloud className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Frontend Layer</h3>
                <p className="text-sm text-muted-foreground">
                  React 18 SPA with TypeScript, served through NGINX with gzip compression and caching.
                  Communicates with backend via RESTful APIs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Boxes className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Backend Layer</h3>
                <p className="text-sm text-muted-foreground">
                  Node.js + Express API with JWT authentication, rate limiting, and comprehensive error handling.
                  Horizontally scalable with 3 replicas in production.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Database Layer</h3>
                <p className="text-sm text-muted-foreground">
                  MongoDB 7.0 deployed as StatefulSet with persistent volumes. Supports replica sets for
                  high availability.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Infrastructure Layer</h3>
                <p className="text-sm text-muted-foreground">
                  Kubernetes orchestration on AWS EKS with NGINX Ingress, HPA, network policies, and
                  comprehensive monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Component Diagram</h2>
        
        <div className="bg-secondary/50 rounded-lg p-6 mb-8 border border-border/50">
          <pre className="text-sm text-muted-foreground overflow-x-auto">
{`┌─────────────────────────────────────────────────────┐
│             AWS EKS Cluster (K8s 1.31)              │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │        NGINX Ingress Controller             │   │
│  │         (Load Balancer)                     │   │
│  └────────────┬────────────────────────────────┘   │
│               │                                      │
│    ┌──────────┴──────────┐                         │
│    │                     │                          │
│ ┌──▼──────────┐    ┌────▼──────────┐              │
│ │  Frontend   │    │   Backend API  │              │
│ │ (React SPA) │    │  (Node.js)     │              │
│ │  1 replica  │    │  3 replicas    │              │
│ └─────────────┘    └────┬───────────┘              │
│                          │                           │
│                    ┌─────▼─────────┐                │
│                    │   MongoDB     │                │
│                    │  StatefulSet  │                │
│                    │   1 replica   │                │
│                    └───────────────┘                │
└─────────────────────────────────────────────────────┘`}
          </pre>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Key Design Principles</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">1. Microservices Architecture</h3>
            <p className="text-sm text-muted-foreground">
              Each component (frontend, backend, database) is independently deployable and scalable.
              Services communicate through well-defined APIs.
            </p>
          </div>

          <div className="bg-glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">2. Containerization</h3>
            <p className="text-sm text-muted-foreground">
              All services are containerized using Docker with multi-stage builds for optimized image sizes.
              Images are stored in Docker Hub registry.
            </p>
          </div>

          <div className="bg-glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">3. Orchestration</h3>
            <p className="text-sm text-muted-foreground">
              Kubernetes manages container lifecycle, scaling, and self-healing. Helm charts provide
              parameterized deployments across environments.
            </p>
          </div>

          <div className="bg-glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">4. CI/CD Automation</h3>
            <p className="text-sm text-muted-foreground">
              GitHub Actions pipeline automates testing, building, and deployment. Every commit is tested,
              and main branch deployments go to production.
            </p>
          </div>

          <div className="bg-glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">5. Security First</h3>
            <p className="text-sm text-muted-foreground">
              JWT authentication, encrypted secrets, network policies, HTTPS/TLS, rate limiting, and
              regular security updates.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Data Flow</h2>
        
        <div className="bg-secondary/50 rounded-lg p-6 mb-8 border border-border/50">
          <ol className="text-sm text-muted-foreground space-y-3">
            <li>
              <strong className="text-foreground">1. User Request:</strong> User accesses application through browser
            </li>
            <li>
              <strong className="text-foreground">2. Load Balancer:</strong> AWS ELB routes traffic to NGINX Ingress
            </li>
            <li>
              <strong className="text-foreground">3. Ingress Routing:</strong> NGINX routes to frontend or backend based on path
            </li>
            <li>
              <strong className="text-foreground">4. Frontend Service:</strong> Serves React SPA from NGINX container
            </li>
            <li>
              <strong className="text-foreground">5. API Calls:</strong> Frontend makes authenticated API calls to backend
            </li>
            <li>
              <strong className="text-foreground">6. Backend Processing:</strong> Express validates JWT, processes request
            </li>
            <li>
              <strong className="text-foreground">7. Database Query:</strong> Mongoose queries MongoDB StatefulSet
            </li>
            <li>
              <strong className="text-foreground">8. Response:</strong> Data flows back through the same path to user
            </li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Scalability Strategy</h2>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-foreground mb-3">Horizontal Pod Autoscaler (HPA)</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Automatically scales backend and frontend pods based on CPU/memory utilization:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• <strong>Backend:</strong> Scales from 3 to 10 replicas at 70% CPU</li>
            <li>• <strong>Frontend:</strong> Scales from 1 to 5 replicas at 70% CPU</li>
            <li>• <strong>Cluster:</strong> Node autoscaling from 2 to 4 nodes</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Next Steps</h2>
        <div className="grid gap-4 not-prose">
          <a href="/docs/tech-stack" className="block p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
            <h4 className="font-semibold text-foreground mb-1">Technology Stack</h4>
            <p className="text-sm text-muted-foreground">
              Detailed breakdown of all technologies used.
            </p>
          </a>

          <a href="/docs/kubernetes" className="block p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
            <h4 className="font-semibold text-foreground mb-1">Kubernetes Deployment</h4>
            <p className="text-sm text-muted-foreground">
              Learn about our K8s configuration and manifests.
            </p>
          </a>
        </div>
      </div>
    </DocsLayout>
  );
};

export default DocsArchitecture;
