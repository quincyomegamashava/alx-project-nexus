#!/bin/bash
echo "Starting JSON Server on port 4000..."
echo "API endpoints will be available at:"
echo "  - http://localhost:4000/products"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

json-server --watch api/db.json --port 4000