#!/bin/bash

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== Updating Nginx Configuration ===${NC}"

# Ask for domain (optional)
read -p "Enter Domain Name (leave empty to use IP address): " DOMAIN

if [ -z "$DOMAIN" ]; then
  DIR_NAME="kursdomoi"
else
  DIR_NAME="$DOMAIN"
fi

echo -e "${GREEN}Configuring Nginx for $DIR_NAME...${NC}"

if [ -z "$DOMAIN" ]; then
  # Configuration for IP address
  cat > /etc/nginx/sites-available/$DIR_NAME <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
else
  # Configuration for Domain
  cat > /etc/nginx/sites-available/$DIR_NAME <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
fi

# Link and Restart
ln -s /etc/nginx/sites-available/$DIR_NAME /etc/nginx/sites-enabled/ 2>/dev/null
rm /etc/nginx/sites-enabled/default 2>/dev/null

echo -e "${GREEN}Testing Nginx configuration...${NC}"
nginx -t

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Restarting Nginx...${NC}"
  systemctl restart nginx
  echo -e "${GREEN}Nginx updated successfully!${NC}"
else
  echo -e "${033[0;31m}Nginx configuration test failed!${NC}"
fi
