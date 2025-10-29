# Quick Start Guide

## Get Started in 3 Steps

### Step 1: Scrape Wikipedia Data
```bash
cd /mnt/c/Users/e4roh/OneDrive/Desktop/IsolatedWork/world_history_inventions
uv run main.py
```

This fetches and processes all historic inventions from Wikipedia.

### Step 2: Convert to JSON
```bash
uv run csv_to_json.py
```

This converts the data to JSON format with geographical coordinates.

### Step 3: Launch Visualization
```bash
uv run server.py
```

Your browser will automatically open to the interactive timeline!

## How to Use the Visualization

1. **Scroll Down** - Travel forward through time (from 1.76 million years ago to ~6000 CE)
2. **Watch Red Dots Appear** - Each dot represents an invention at its location
3. **Hover Over Dots** - See invention name, date, location, and description
4. **Track Progress** - The timeline on the left shows your position in history
5. **Current Date** - Displayed prominently in the header

## What You're Seeing

- **Africa (early)**: Stone tools, fire, early human developments
- **Middle East**: Agriculture, writing, the wheel, bronze
- **Asia**: Pottery, paper, printing, gunpowder
- **Europe**: Scientific revolution, industrial age inventions
- **Americas**: Later period inventions and innovations

## Features

- ✅ 131 historic inventions from Wikipedia
- ✅ Spans 1.76 million years of history
- ✅ Interactive world map with smooth animations
- ✅ Real-time date display
- ✅ Detailed tooltips for each invention
- ✅ Responsive design

## Data Sources

- **Wikipedia**: Timeline of Historic Inventions
- **Format**: CSV, Excel, and JSON
- **Geocoding**: Automated location coordinates

## Project Files

- `inventions.csv` - Full data in spreadsheet format
- `inventions.xlsx` - Excel version
- `inventions.json` - Web-optimized with coordinates
- `index.html` - Interactive visualization

## Troubleshooting

**Server won't start?**
- Make sure port 8000 is available
- Try a different port by editing `server.py`

**No dots appearing?**
- Check browser console (F12) for errors
- Verify `inventions.json` exists
- Refresh the page

**Data looks wrong?**
- Re-run `uv run csv_to_json.py`
- Check `inventions.csv` for source data

## Next Steps

- Add more location coordinates in `csv_to_json.py`
- Customize map styling in `style.css`
- Add filters or search in `script.js`
- Integrate with a real geocoding API for better accuracy

Enjoy exploring the history of human innovation! 🚀
