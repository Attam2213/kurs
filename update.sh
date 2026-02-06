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
npm install

# 3. Build frontend
echo -e "${GREEN}Rebuilding frontend...${NC}"
npm run build

# 4. Restart server
echo -e "${GREEN}Restarting server...${NC}"
pm2 restart kursdomoi

echo -e "${GREEN}=== Update Complete! ===${NC}"
