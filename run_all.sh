#!/bin/bash

echo "=========================================="
echo "  World History Inventions"
echo "  Complete Pipeline"
echo "=========================================="
echo ""

echo "[1/3] Scraping Wikipedia data..."
uv run main.py

if [ $? -ne 0 ]; then
    echo "Error: Scraping failed!"
    exit 1
fi

echo ""
echo "[2/3] Converting to JSON with geocoding..."
uv run csv_to_json.py

if [ $? -ne 0 ]; then
    echo "Error: JSON conversion failed!"
    exit 1
fi

echo ""
echo "[3/3] Starting web server..."
echo ""
echo "✓ Pipeline complete!"
echo "✓ Opening visualization..."
echo ""

uv run server.py
