#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Updating Kurs-Domoy ===${NC}"

# Check if running as root might be useful, but usually git pull needs the right user permissions.
# Assuming run as root since install was run as root.

# 1. Pull latest changes
echo -e "${GREEN}Pulling latest changes from Git...${NC}"
git pull

# 2. Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install --legacy-peer-deps || { echo -e "${RED}npm install failed!${NC}"; exit 1; }

# Rebuild sqlite3
npm rebuild sqlite3

# 3. Build frontend
echo -e "${GREEN}Building frontend...${NC}"
npm run build || { echo -e "${RED}Build failed!${NC}"; exit 1; }

# 4. Restart server
echo -e "${GREEN}Restarting server...${NC}"
pm2 delete kursdomoi 2>/dev/null || true
pm2 start server.cjs --name kursdomoi
pm2 save

echo -e "${GREEN}=== Update Complete! ===${NC}"
