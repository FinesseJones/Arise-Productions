# 🚀 Arise Production Studio - VPS Deployment Guide
**© 2026 THE AI CONTENT FOUNDRY, LLC • All Rights Reserved**

This guide shows you how to deploy **Arise Production Studio** to any Virtual Private Server (VPS) — including **Ubuntu, Debian, AWS EC2, DigitalOcean, Linode, Hetzner, or Contabo** — so you can access your virtual production suite from any browser, tablet, or phone worldwide.

---

## ⚡ Quick 1-Command Deployment on VPS

SSH into your VPS and run:

```bash
# 1. Clone or pull the repository
git clone https://github.com/FinesseJones/Arise-Productions.git
cd Arise-Productions

# 2. Run the automated deployment script
chmod +x deploy.sh
./deploy.sh
```

The script automatically detects **Docker Compose** or installs **Node.js 20 & PM2**, builds the frontend, binds port `4000`, and gives you the live URL:
👉 **`http://<YOUR_VPS_IP>:4000`**

---

## 🐳 Option A: Docker Deployment (Recommended)

If you use Docker:

```bash
# Build and start container in the background
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Stop container
docker-compose down
```

---

## 📦 Option B: PM2 Native Node.js Deployment

If running directly on Node.js without Docker:

```bash
# Install dependencies & build frontend
npm install --omit=dev
cd frontend && npm install && npm run build && cd ..

# Start cluster with PM2
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 🔒 Optional: Custom Domain & Free SSL (Let's Encrypt)

To access via a custom domain like `https://studio.yourdomain.com`:

1. **Install Nginx & Certbot:**
   ```bash
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```

2. **Copy Nginx Configuration:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/arise-studio
   sudo ln -s /etc/nginx/sites-available/arise-studio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Generate Free SSL Certificate:**
   ```bash
   sudo certbot --nginx -d studio.yourdomain.com
   ```

Your studio is now live over secure HTTPS and WSS at **`https://studio.yourdomain.com`**!
