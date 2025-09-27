#!/bin/bash
echo "Starting JSON Server on port 4000..."
echo "API endpoints will be available at:"
echo "  - http://localhost:4000/products"
echo "  - http://localhost:4000/images/* (static images)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Create public directory and symlink images
mkdir -p public
ln -sf ../api/images public/images 2>/dev/null || true

# Start JSON server with static file serving
json-server --watch api/db.json --port 4000 --static public
