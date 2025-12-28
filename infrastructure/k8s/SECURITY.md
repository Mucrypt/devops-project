# 🔐 Security Guide for NexusAI Kubernetes Deployment

## ⚠️ CRITICAL: Secrets Management

### What Files Should NEVER Be Committed

The following files contain sensitive credentials and **MUST NEVER** be committed to Git:

```
k8s/mongodb-secret.yaml       ❌ NEVER COMMIT
k8s/backend-secret.yaml        ❌ NEVER COMMIT
backend/.env                   ❌ NEVER COMMIT
```

These files are already in `.gitignore` to prevent accidental commits.

### Safe to Commit (Templates)

These template files are safe to commit:

```
k8s/mongodb-secret.yaml.example    ✅ Safe to commit
k8s/backend-secret.yaml.example    ✅ Safe to commit
backend/.env.example               ✅ Safe to commit
```

## 🛠️ How to Generate Secrets

### Option 1: Automated Script (Recommended)

Run the secrets generator script:

```bash
cd /home/mukulah/devops-project
./infrastructure/k8s/generate-secrets.sh
```

This script will:
- Generate strong random secrets for JWT
- Prompt for MongoDB credentials
- Prompt for email, Stripe, OpenAI credentials (optional)
- Create properly formatted secret files
- **NOT commit them to Git** (they're in .gitignore)

### Option 2: Manual Creation

1. **Copy templates:**
```bash
cp k8s/mongodb-secret.yaml.example k8s/mongodb-secret.yaml
cp k8s/backend-secret.yaml.example k8s/backend-secret.yaml
```

2. **Generate base64 encoded values:**

For MongoDB:
```bash
# Username
echo -n 'your-username' | base64

# Password
echo -n 'your-secure-password' | base64
```

For JWT secrets (generate random):
```bash
# Generate random secret and encode
openssl rand -base64 32 | tr -d '\n' | base64
```

For API keys:
```bash
# Email
echo -n 'your-email@gmail.com' | base64
echo -n 'your-app-password' | base64

# Stripe
echo -n 'sk_live_your_stripe_key' | base64

# OpenAI
echo -n 'sk-your-openai-key' | base64
```

3. **Edit the files:**
```bash
nano k8s/mongodb-secret.yaml
nano k8s/backend-secret.yaml
```

Replace all `REPLACE_WITH_BASE64_*` placeholders with your actual base64-encoded values.

## 📋 Verification Checklist

Before deploying, verify:

- [ ] Secret files exist but are NOT tracked by Git
- [ ] All placeholder values replaced with real secrets
- [ ] `.gitignore` includes secret files
- [ ] Template files (*.example) are committed
- [ ] MongoDB connection string updated in `backend-configmap.yaml`

Check Git status:
```bash
git status

# You should NOT see:
# k8s/mongodb-secret.yaml
# k8s/backend-secret.yaml
# backend/.env
```

## 🔍 If You Accidentally Committed Secrets

### Immediate Actions:

1. **Remove from Git history:**
```bash
# Remove file from Git
git rm --cached k8s/mongodb-secret.yaml
git rm --cached k8s/backend-secret.yaml

# Commit the removal
git commit -m "Remove accidentally committed secrets"

# Push to remote
git push origin main
```

2. **Rotate ALL compromised credentials immediately:**
   - Generate new MongoDB passwords
   - Generate new JWT secrets
   - Regenerate API keys (Stripe, OpenAI, etc.)
   - Update email passwords

3. **Clean Git history (if already pushed):**
```bash
# Use BFG Repo Cleaner or git filter-branch
# WARNING: This rewrites history!

# Install BFG
# brew install bfg  # macOS
# Or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove sensitive files from history
bfg --delete-files mongodb-secret.yaml
bfg --delete-files backend-secret.yaml

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: Notifies all collaborators)
git push origin --force --all
```

4. **Notify your team** about credential rotation

## 🏢 Production Best Practices

### 1. Use Kubernetes Secrets Properly

Never use plain YAML files in production. Instead:

**Option A: Create from kubectl**
```bash
kubectl create secret generic backend-secret \
  --from-literal=JWT_SECRET='your-secret' \
  --from-literal=EMAIL_USER='your-email' \
  -n nexusai
```

**Option B: Use Sealed Secrets**
```bash
# Install Sealed Secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Encrypt secrets
kubeseal --format=yaml < mongodb-secret.yaml > mongodb-sealed-secret.yaml

# Now safe to commit mongodb-sealed-secret.yaml
```

**Option C: Use External Secrets Operator**
Integrate with:
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- HashiCorp Vault

### 2. Use Secret Management Tools

**HashiCorp Vault:**
```bash
# Store secret in Vault
vault kv put secret/nexusai/jwt JWT_SECRET='your-secret'

# Use Vault Injector in Kubernetes
# Secrets automatically injected into pods
```

**AWS Secrets Manager:**
```bash
# Store secret
aws secretsmanager create-secret \
  --name nexusai/jwt-secret \
  --secret-string "your-jwt-secret"

# Use External Secrets Operator to sync to K8s
```

### 3. Enable Encryption at Rest

**For managed Kubernetes:**

**GKE:**
```bash
gcloud container clusters create nexusai \
  --database-encryption-key projects/PROJECT_ID/locations/LOCATION/keyRings/RING_NAME/cryptoKeys/KEY_NAME
```

**EKS:**
```bash
# Create KMS key
aws kms create-key --description "EKS Secret Encryption"

# Enable encryption on cluster
aws eks associate-encryption-config \
  --cluster-name nexusai \
  --encryption-config resources=secrets,provider.keyArn=arn:aws:kms:...
```

**AKS:**
```bash
az aks update \
  --name nexusai \
  --resource-group myResourceGroup \
  --enable-encryption-at-host
```

### 4. Regular Security Audits

```bash
# Check for secrets in Git history
git log --all --full-history --source --all -- k8s/*secret*

# Scan for exposed secrets
trufflehog git file://. --only-verified

# Check Kubernetes secrets encryption
kubectl get secrets -n nexusai -o yaml
```

## 🔐 Secret Rotation Schedule

| Secret Type | Rotation Frequency | Priority |
|-------------|-------------------|----------|
| JWT Secrets | 90 days | High |
| Database Passwords | 90 days | Critical |
| API Keys (Stripe, OpenAI) | When compromised | High |
| Email Passwords | 90 days | Medium |

## 📚 Additional Resources

- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
- [External Secrets Operator](https://external-secrets.io/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Git Secrets Scanner](https://github.com/trufflesecurity/trufflehog)

## 🆘 Security Incident Response

If secrets are compromised:

1. **Immediately revoke/rotate** all affected credentials
2. **Audit access logs** for unauthorized usage
3. **Notify stakeholders** about the incident
4. **Update systems** with new credentials
5. **Review and improve** security practices
6. **Document the incident** for future reference

---

**Remember:** Security is not a one-time setup, it's an ongoing process!
