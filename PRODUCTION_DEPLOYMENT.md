# Production Deployment Guide

## Critical MongoDB Atlas Configuration

### The SSL/TLS Error You're Seeing

The error `MongoServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error` means **MongoDB Atlas is blocking Vercel's IP addresses**.

### Fix: Whitelist Vercel IPs in MongoDB Atlas

1. **Go to MongoDB Atlas Dashboard**:
   - Log in at https://cloud.mongodb.com
   - Select your cluster

2. **Network Access**:
   - Click **"Network Access"** in the left sidebar
   - Click **"Add IP Address"**

3. **Allow All IPs (Recommended for Vercel)**:
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` to your whitelist
   - Click **"Confirm"**

   ⚠️ **Security Note**: This allows connections from any IP. For better security:
   - Use MongoDB Atlas **VPC Peering** with Vercel (if available)
   - Or manually add Vercel's IP ranges (they change frequently)

4. **Wait 1-2 minutes** for the change to propagate

5. **Redeploy your Vercel app** - the MongoDB connection should now work

---

## Required Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

### 1. Authentication
```env
JWT_SECRET=your-long-random-secret-min-32-chars
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD_HASH=$2a$10$...your-bcrypt-hash-here...
```

**To generate password hash**:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(h => console.log(h))"
```

### 2. MongoDB
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=MyPortfolio
```

**Important**: 
- Make sure your MongoDB URI includes the database name or ends with `/`
- The database name in `MONGODB_DB` must match your Atlas database name

### 3. Vercel Blob (for image uploads)
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

**To get this token**:
1. Vercel Dashboard → **Storage** → **Blob**
2. Create a Blob store (if you haven't)
3. Copy the **Read-Write Token** from the store settings

---

## Verify Your Setup

After setting env vars and whitelisting IPs:

1. **Redeploy** your Vercel app
2. **Check Vercel Logs**:
   - Go to **Deployments** → Click latest deployment → **Logs**
   - Look for MongoDB connection errors
3. **Test Admin Panel**:
   - Visit `https://your-domain.com/admin/login`
   - Login should work
   - Dashboard should load projects from MongoDB (not 500 errors)
4. **Test Public Pages**:
   - Visit `https://your-domain.com/projects`
   - Should show projects from MongoDB
   - If MongoDB fails, it falls back to static data (graceful degradation)

---

## Common Issues & Solutions

### Issue: "MongoServerSelectionError" / SSL errors
**Solution**: Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access (see above)

### Issue: "BLOB_READ_WRITE_TOKEN is not set"
**Solution**: Create Vercel Blob store and add the token to env vars

### Issue: "JWT_SECRET environment variable must be set"
**Solution**: Add `JWT_SECRET` to Vercel env vars (any long random string)

### Issue: Admin login works but APIs return 500
**Solution**: Check MongoDB connection - likely IP whitelist issue

### Issue: Projects/Skills/Company show empty on public site
**Solution**: 
- Check MongoDB connection (IP whitelist)
- Check `MONGODB_DB` matches your Atlas database name
- The app will fallback to static data if MongoDB fails (so content still shows)

---

## Production Checklist

- [ ] MongoDB Atlas IP whitelist configured (`0.0.0.0/0` or Vercel IPs)
- [ ] All environment variables set in Vercel:
  - [ ] `JWT_SECRET`
  - [ ] `ADMIN_USERNAME`
  - [ ] `ADMIN_PASSWORD_HASH` (bcrypt hash, not plain text)
  - [ ] `MONGODB_URI`
  - [ ] `MONGODB_DB`
  - [ ] `BLOB_READ_WRITE_TOKEN`
- [ ] Vercel Blob store created
- [ ] Test admin login works
- [ ] Test admin dashboard loads data from MongoDB
- [ ] Test public pages load data from MongoDB
- [ ] Test image upload works (uses Vercel Blob)
- [ ] Verify no 500 errors in Vercel logs

---

## Security Notes

1. **Never commit `.env.local`** - it's already in `.gitignore`
2. **Use strong `JWT_SECRET`** - at least 32 random characters
3. **Use bcrypt hash for admin password** - never store plain text
4. **MongoDB Atlas**: Consider using **Database Users** with limited permissions instead of admin user
5. **IP Whitelist**: `0.0.0.0/0` is convenient but less secure. For production, consider VPC peering or specific IP ranges if available
