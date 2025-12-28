# 🌐 DNS Configuration for nexusai.lt

## Your Domain: **nexusai.lt**
**Status**: Registration in progress (wait for "Active" status)

---

## DNS Records to Add in Hostinger

Once your domain is **Active**, go to:
**Hostinger → Domains → nexusai.lt → DNS/Name Servers**

### Add These 3 CNAME Records:

| Type  | Name | Points to | TTL  |
|-------|------|-----------|------|
| **CNAME** | **@** (or leave blank) | `aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com` | 3600 |
| **CNAME** | **www** | `aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com` | 3600 |
| **CNAME** | **api** | `aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com` | 3600 |

### Step-by-Step:
1. Click **"Add Record"** button
2. Select **"CNAME"** from Type dropdown
3. For Name, enter:
   - First record: **@** (root domain)
   - Second record: **www**
   - Third record: **api**
4. In "Points to" field, paste:
   ```
   aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com
   ```
5. Set TTL to **3600** (1 hour)
6. Click **"Add Record"**
7. Repeat for all 3 records

---

## Quick Setup Commands (Run after DNS is configured)

```bash
# 1. Setup domain (wait 10-15 min after adding DNS records)
./setup-domain.sh nexusai.lt

# 2. Test your site
curl http://nexusai.lt

# 3. Setup HTTPS (recommended!)
./setup-ssl.sh nexusai.lt

# 4. Test HTTPS
curl https://nexusai.lt
```

---

## Timeline

1. **Now**: Domain registration in progress (1-4 hours)
2. **When Active**: Configure DNS records above (5 minutes)
3. **DNS Propagation**: Wait 10-30 minutes
4. **Deploy**: Run `./setup-domain.sh nexusai.lt`
5. **SSL**: Run `./setup-ssl.sh nexusai.lt`
6. **Done**: Share with friends! 🎉

---

## Your URLs After Setup

- **Frontend**: https://nexusai.lt
- **Frontend (www)**: https://www.nexusai.lt
- **Backend API**: https://nexusai.lt/api

---

## Check Domain Status

```bash
# Check if domain is active and DNS configured
nslookup nexusai.lt

# Check DNS propagation worldwide
# Visit: https://dnschecker.org and enter "nexusai.lt"
```

---

**Next Step**: Wait for domain to become "Active", then add the DNS records above! 🚀
