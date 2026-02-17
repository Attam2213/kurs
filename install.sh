#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Kurs-Domoy Auto Installer ===${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (sudo ./install.sh)${NC}"
  exit 1
fi

# Ask for configuration
read -p "Enter Domain Name (leave empty to use IP address): " DOMAIN
read -p "Enter Admin Username: " ADMIN_USER
read -s -p "Enter Admin Password: " ADMIN_PASS
echo ""

# Set default directory name if domain is empty
if [ -z "$DOMAIN" ]; then
  DIR_NAME="kursdomoi"
else
  DIR_NAME="$DOMAIN"
fi

# Prepare punycode version of domain for Nginx/Certbot (supports кириллица)
PUNYCODE_DOMAIN=""
if [ -n "$DOMAIN" ]; then
  if command -v idn2 >/dev/null 2>&1; then
    PUNYCODE_DOMAIN=$(LANG=C.UTF-8 LC_ALL=C.UTF-8 idn2 "$DOMAIN")
  else
    PUNYCODE_DOMAIN="$DOMAIN"
  fi
fi

# Update system
echo -e "${GREEN}Updating system packages...${NC}"
apt update && apt upgrade -y

# Install Node.js 20
echo -e "${GREEN}Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs build-essential

# Install Nginx, Certbot and IDN2 (for кириллица домены)
echo -e "${GREEN}Installing Nginx, Certbot and IDN2...${NC}"
apt install -y nginx certbot python3-certbot-nginx idn2

# Setup App Directory
APP_DIR="/var/www/$DIR_NAME"
mkdir -p $APP_DIR

# Clone/Copy files (Assuming we are running from the repo or just cloned it)
# If this script is inside the repo, we copy current files
echo -e "${GREEN}Setting up application files...${NC}"
cp -r . $APP_DIR
cd $APP_DIR

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install --legacy-peer-deps || { echo -e "${RED}npm install failed!${NC}"; exit 1; }

# Rebuild sqlite3 for the current architecture
echo -e "${GREEN}Rebuilding sqlite3...${NC}"
npm rebuild sqlite3

# Build frontend
echo -e "${GREEN}Building frontend...${NC}"
npm run build || { echo -e "${RED}Build failed!${NC}"; exit 1; }

# Setup Admin Credentials
echo -e "${GREEN}Configuring admin credentials...${NC}"
node setup-admin.cjs "$ADMIN_USER" "$ADMIN_PASS"

# Install PM2
echo -e "${GREEN}Installing PM2...${NC}"
npm install -g pm2

# Start App with PM2
pm2 delete kursdomoi 2>/dev/null || true
pm2 start server.cjs --name kursdomoi
pm2 save
pm2 startup

# Configure Nginx
echo -e "${GREEN}Configuring Nginx...${NC}"

if [ -z "$DOMAIN" ]; then
  # Configuration for IP address (No SSL)
  cat > /etc/nginx/sites-available/$DIR_NAME <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
else
  # Configuration for Domain (With SSL placeholder, поддержка кириллицы через Punycode)
  cat > /etc/nginx/sites-available/$DIR_NAME <<EOF
server {
    listen 80;
    server_name $PUNYCODE_DOMAIN www.$PUNYCODE_DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
fi

ln -s /etc/nginx/sites-available/$DIR_NAME /etc/nginx/sites-enabled/ 2>/dev/null
rm /etc/nginx/sites-enabled/default 2>/dev/null
nginx -t && systemctl restart nginx

# Setup SSL only if Domain is provided
if [ -n "$DOMAIN" ]; then
  echo -e "${GREEN}Setting up SSL with Certbot...${NC}"
  certbot --nginx -d $PUNYCODE_DOMAIN -d www.$PUNYCODE_DOMAIN --non-interactive --agree-tos -m admin@$PUNYCODE_DOMAIN --redirect
  
  echo -e "${GREEN}=== Installation Complete! ===${NC}"
  echo -e "Website: https://$DOMAIN"
  echo -e "Admin Panel: https://$DOMAIN/admin"
else
  # Get Public IP
  PUBLIC_IP=$(curl -s ifconfig.me)
  echo -e "${GREEN}=== Installation Complete! ===${NC}"
  echo -e "Website: http://$PUBLIC_IP"
  echo -e "Admin Panel: http://$PUBLIC_IP/admin"
  echo -e "${RED}Note: SSL is not enabled because no domain was provided.${NC}"
fi
