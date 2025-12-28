# 🚀 CI/CD Pipeline Stages

## Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CI PIPELINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Stage 1: Lint & Static Analysis                                │
│  ├─ Checkout code                                               │
│  ├─ Setup Node.js 20                                            │
│  ├─ Install dependencies (Backend + Frontend)                   │
│  ├─ Run ESLint (Backend)                                        │
│  ├─ Run ESLint (Frontend)                                       │
│  ├─ TypeScript type check (Backend)                             │
│  └─ TypeScript type check (Frontend)                            │
│                                                                  │
│  ▼                                                               │
│                                                                  │
│  Stage 2: Unit Tests                                            │
│  ├─ Checkout code                                               │
│  ├─ Setup Node.js 20                                            │
│  ├─ Install dependencies                                        │
│  ├─ Run Backend tests                                           │
│  ├─ Run Frontend tests                                          │
│  └─ Generate coverage report                                    │
│                                                                  │
│  ▼                                                               │
│                                                                  │
│  Stage 3: Build & Push Docker Images                            │
│  ├─ Checkout code                                               │
│  ├─ Setup Docker Buildx                                         │
│  ├─ Login to Docker Hub                                         │
│  ├─ Generate image tags                                         │
│  │   ├─ main → "latest" + commit-sha                            │
│  │   ├─ develop → "dev-<sha>"                                   │
│  │   ├─ v* → version tag                                        │
│  │   └─ PR → commit-sha                                         │
│  ├─ Build & push Backend image                                  │
│  ├─ Build & push Frontend image                                 │
│  └─ Generate build summary                                      │
│                                                                  │
│  ▼                                                               │
│                                                                  │
│  Stage 4: Update Helm Values (main/tags only)                   │
│  ├─ Checkout code                                               │
│  ├─ Update values-prod.yaml with new tags                       │
│  └─ Commit changes [skip ci]                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

                              ▼
                              
┌─────────────────────────────────────────────────────────────────┐
│                         CD PIPELINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Stage 1: Deploy to Development (develop branch)                │
│  ├─ Checkout code                                               │
│  ├─ Configure AWS credentials                                   │
│  ├─ Update kubeconfig                                           │
│  ├─ Install Helm                                                │
│  ├─ Deploy with Helm (dev environment)                          │
│  ├─ Verify deployment                                           │
│  └─ Post-deployment health check                                │
│                                                                  │
│                        OR                                        │
│                                                                  │
│  Stage 2: Deploy to Production (main/tags)                      │
│  ├─ Checkout code                                               │
│  ├─ Configure AWS credentials                                   │
│  ├─ Update kubeconfig                                           │
│  ├─ Install Helm                                                │
│  ├─ Deploy with Helm (prod environment)                         │
│  ├─ Verify deployment                                           │
│  ├─ Run smoke tests                                             │
│  │   ├─ Test backend health endpoint                            │
│  │   └─ Test frontend accessibility                             │
│  └─ Generate deployment summary                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Trigger Matrix

| Trigger | CI Stages | CD Stage | Environment | Notes |
|---------|-----------|----------|-------------|-------|
| Push to `develop` | 1,2,3 | Deploy Dev | Development | Auto-deploy |
| Push to `main` | 1,2,3,4 | Deploy Prod | Production | Auto-deploy + Update Helm |
| Tag `v*` | 1,2,3,4 | Deploy Prod | Production | Version release |
| Pull Request | 1,2,3 | None | None | Build only, no push |

## Image Tagging Strategy

```yaml
Branch/Tag:        Image Tag:              Also Tagged:
─────────────────  ──────────────────────  ──────────────────
develop            dev-abc1234             abc1234
main               latest                  abc1234
v1.0.0             v1.0.0                  abc1234
PR                 abc1234                 (not pushed)
```

## Stage Details

### CI Stage 1: Lint & Static Analysis
**Duration:** ~2-3 minutes  
**Purpose:** Catch code quality issues early  
**Checks:**
- ESLint rules compliance
- TypeScript type safety
- Code formatting standards

### CI Stage 2: Unit Tests
**Duration:** ~1-2 minutes  
**Purpose:** Verify code functionality  
**Tests:**
- Backend unit tests (when configured)
- Frontend component tests (when configured)
- Code coverage reporting

### CI Stage 3: Build & Push
**Duration:** ~5-8 minutes  
**Purpose:** Create deployable artifacts  
**Actions:**
- Multi-stage Docker builds
- Layer caching for faster builds
- Push to Docker Hub
- Tag management

### CI Stage 4: Update Helm
**Duration:** ~30 seconds  
**Purpose:** Keep IaC in sync with images  
**Actions:**
- Update values-prod.yaml
- Commit back to repo
- Skip CI with [skip ci] flag

### CD Stage 1: Deploy Dev
**Duration:** ~3-5 minutes  
**Purpose:** Test in dev environment  
**Actions:**
- Deploy via Helm
- Wait for rollout
- Basic health checks

### CD Stage 2: Deploy Prod
**Duration:** ~5-8 minutes  
**Purpose:** Production deployment  
**Actions:**
- Deploy via Helm
- Wait for rollout
- Comprehensive smoke tests
- Generate deployment report

## Success Criteria

### CI Pipeline ✅
- All linting checks pass
- All tests pass
- Docker images build successfully
- Images pushed to registry
- Helm values updated (if applicable)

### CD Pipeline ✅
- Helm deployment succeeds
- All pods reach ready state
- Health checks pass
- Smoke tests pass (production)

## Failure Handling

### Lint/Test Failures
- Pipeline stops immediately
- No deployment occurs
- PR blocked from merging

### Build Failures
- Previous images remain available
- No deployment occurs
- Rollback not needed

### Deployment Failures
- Kubernetes health checks trigger automatic rollback
- Previous version remains running
- Manual intervention may be required

## Monitoring & Notifications

### GitHub Actions
- Real-time logs in Actions tab
- Job summaries with markdown
- Artifact storage for reports

### Deployment Verification
```bash
# Check deployed versions
kubectl get deployment nexusai-backend -n nexusai \
  -o jsonpath='{.spec.template.spec.containers[0].image}'

# View deployment history
helm history nexusai -n nexusai

# Check pod status
kubectl get pods -n nexusai
```

## Best Practices

1. **Always run full pipeline on main branch**
2. **Use semantic versioning for releases** (v1.0.0)
3. **Test in dev before promoting to prod**
4. **Monitor deployment logs** during rollout
5. **Keep Helm values in sync** with deployed images
6. **Use commit SHAs for traceability**
7. **Enable branch protection** on main
8. **Require status checks** before merge

## Quick Commands

### Manually trigger deployment
```bash
# Development
cd helm
./deploy.sh dev abc1234 abc1234

# Production
cd helm
./deploy.sh prod v1.0.0 v1.0.0
```

### Check pipeline status
```bash
# View GitHub Actions logs
gh run list --workflow=ci-cd.yaml

# View latest run
gh run view --web
```

### Rollback deployment
```bash
# Helm rollback
helm rollback nexusai -n nexusai

# Or deploy previous tag
cd helm
./deploy.sh prod v0.9.0 v0.9.0
```
