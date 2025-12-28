# 🌐 NexusAI Domain Setup Guide

## Overview
This guide will help you set up a custom domain for your NexusAI application using Hostinger.

---

## Step 1: Buy Domain on Hostinger

1. **Visit Hostinger**: https://www.hostinger.com/domain-name-search
2. **Search for domain**: Try names like:
   - `nexusai.tech`
   - `mynexusai.com`
   - `nexusai.app`
   - `nexus-ai.io`
3. **Purchase**: Usually $10-15/year for .com domains
4. **Complete checkout**

---

## Step 2: Configure DNS in Hostinger

After purchasing, go to **Hostinger Control Panel → Domains → DNS/Name Servers**

### Your AWS Load Balancer:
```
aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com
```

### Add These DNS Records:

| Type  | Name | Value (Points to) | TTL  |
|-------|------|-------------------|------|
| CNAME | @    | `aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com` | 3600 |
| CNAME | www  | `aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com` | 3600 |
| CNAME | api  | `aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com` | 3600 |

**Important Notes:**
- Use `@` for root domain (e.g., `nexusai.com`)
- Some DNS providers use `@` or blank/empty for root domain
- TTL 3600 = 1 hour (standard)

**Screenshots Guide:**
1. Click "Add Record"
2. Select "CNAME" from dropdown
3. Enter name (@ for root, www for www subdomain)
4. Paste AWS load balancer URL in "Points to" field
5. Click "Add Record"
6. Repeat for all 3 records

---

## Step 3: Wait for DNS Propagation

- **Time**: 5-60 minutes (usually 10-15 minutes)
- **Check propagation**: https://dnschecker.org

**Test DNS:**
```bash
# Replace with your domain
nslookup yourdomain.com
# or
dig yourdomain.com
```

---

## Step 4: Update Your Application

Once DNS is working, run the setup script:

```bash
# Replace with your actual domain
./setup-domain.sh yourdomain.com
```

**What the script does:**
1. ✅ Verifies DNS is configured
2. ✅ Updates Helm values with your domain
3. ✅ Deploys application with new domain
4. ✅ Configures ingress to accept your domain

---

## Step 5: Test Your Application

```bash
# Test frontend
curl http://yourdomain.com

# Test with www
curl http://www.yourdomain.com

# Test API
curl http://yourdomain.com/api/

# Open in browser
open http://yourdomain.com
```

---

## Step 6: Setup HTTPS (Optional but Recommended)

After domain is working, add SSL/TLS:

```bash
./setup-ssl.sh yourdomain.com
```

**What this does:**
1. ✅ Installs cert-manager (if not present)
2. ✅ Creates Let's Encrypt ClusterIssuer
3. ✅ Enables SSL redirect in ingress
4. ✅ Requests free SSL certificate
5. ✅ Configures HTTPS

**Wait 2-5 minutes** for certificate issuance.

**Check certificate status:**
```bash
kubectl get certificate -n nexusai
kubectl describe certificate nexusai-tls -n nexusai
```

**Test HTTPS:**
```bash
curl https://yourdomain.com
```

---

## Troubleshooting

### DNS not resolving
**Problem**: `nslookup yourdomain.com` fails

**Solutions:**
1. Wait longer (up to 1 hour)
2. Check DNS records are correct in Hostinger
3. Make sure you used CNAME, not A record
4. Flush local DNS cache: `sudo systemd-resolve --flush-caches`

### Certificate pending
**Problem**: Certificate stuck in "Pending" state

**Check logs:**
```bash
kubectl describe certificate nexusai-tls -n nexusai
kubectl logs -n cert-manager -l app=cert-manager
```

**Common issues:**
- DNS not fully propagated (wait longer)
- HTTP challenge failing (check ingress is accessible)
- Rate limit reached (wait 1 hour)

### 404 Not Found
**Problem**: Domain resolves but returns 404

**Solutions:**
1. Check ingress rules: `kubectl get ingress nexusai-ingress -n nexusai -o yaml`
2. Verify domain in values-prod.yaml matches your domain
3. Redeploy: `./setup-domain.sh yourdomain.com`

### Application showing AWS URL
**Problem**: Browser redirects to AWS load balancer URL

**Solution:**
- Clear browser cache
- Update ingress rules
- Check CORS settings

---

## Share with Friends!

Once everything is working:

1. **Frontend**: `https://yourdomain.com`
2. **API Docs**: `https://yourdomain.com/api`

**Share links:**
```
Hey! Check out my NexusAI app:
🌐 https://yourdomain.com

It's a full-stack application deployed on Kubernetes in AWS! 🚀
```

---

## Quick Reference Commands

```bash
# Check DNS
nslookup yourdomain.com

# Check pods
kubectl get pods -n nexusai

# Check ingress
kubectl get ingress -n nexusai

# View ingress details
kubectl describe ingress nexusai-ingress -n nexusai

# Update domain
./setup-domain.sh yourdomain.com

# Setup SSL
./setup-ssl.sh yourdomain.com

# Check certificate
kubectl get certificate -n nexusai

# View application logs
kubectl logs -n nexusai -l app=nexusai-backend -f
kubectl logs -n nexusai -l app=nexusai-frontend -f

# Restart deployment
kubectl rollout restart deployment/nexusai-backend -n nexusai
kubectl rollout restart deployment/nexusai-frontend -n nexusai
```

---

## Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Domain (.com) | $12-15 | Per year |
| SSL Certificate | FREE | Let's Encrypt |
| AWS EKS Cluster | ~$73/month | Monthly |
| AWS Load Balancer | ~$16/month | Monthly |
| **Total** | **~$100/month + $15/year** | |

**Note**: AWS costs can be reduced by:
- Using smaller instance types
- Stopping cluster when not in use
- Using AWS Free Tier (12 months)

---

## Next Steps

1. ✅ Buy domain on Hostinger
2. ✅ Configure DNS records
3. ✅ Wait for propagation (10-15 min)
4. ✅ Run `./setup-domain.sh yourdomain.com`
5. ✅ Test: `curl http://yourdomain.com`
6. ✅ Run `./setup-ssl.sh yourdomain.com`
7. ✅ Test: `curl https://yourdomain.com`
8. 🎉 Share with friends!

---

## Support

If you need help:
1. Check the troubleshooting section above
2. View logs: `kubectl logs -n nexusai -l app=nexusai-backend`
3. Check DNS: https://dnschecker.org
4. Verify ingress: `kubectl describe ingress nexusai-ingress -n nexusai`

**Remember**: DNS propagation can take up to 48 hours, but usually works in 10-15 minutes!

---

**Good luck! 🚀**
