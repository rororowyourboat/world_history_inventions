# World History Inventions Scraper

A data science project that scrapes historical invention data from Wikipedia's Timeline of Historic Inventions page and creates a structured pandas DataFrame.

## Features

### Data Scraping
- Scrapes invention data from Wikipedia
- Extracts: name, date, date range, location, image links, and descriptions
- Exports data to both CSV and Excel formats
- Handles various date formats (Mya, kya, BC, AD)
- Cleans and normalizes data automatically

### Interactive Visualization
- 2D world map with scroll-based time travel
- Red dots appear showing invention locations through history
- Interactive tooltips with invention details
- Timeline sidebar showing historical progress
- Spans from prehistoric times to modern era
- Smooth animations and transitions

## Installation

Use `uv` to manage dependencies:

```bash
# Create virtual environment and install dependencies
uv venv
uv pip install -r requirements.txt
```

## Usage

### 1. Scrape Wikipedia Data

Run the scraper:

```bash
uv run main.py
```

This will:
1. Fetch data from Wikipedia
2. Extract and process invention entries
3. Create a pandas DataFrame
4. Export to `inventions.csv` and `inventions.xlsx`

### 2. Convert to JSON for Visualization

```bash
uv run csv_to_json.py
```

This converts the CSV data to `inventions.json` with geocoded locations.

### 3. View Interactive Timeline

Start the local web server:

```bash
uv run server.py
```

Then open your browser to `http://localhost:8000/index.html`

**How to use the visualization:**
- Scroll down to travel forward through time
- Red dots appear on the world map showing where inventions happened
- Hover over dots to see invention details
- The timeline sidebar shows your progress through history
- The header displays the current time period

## Output Structure

The resulting DataFrame contains the following columns:
- **name**: Name of the invention
- **date**: Primary date/time period
- **date_range**: Date range if applicable
- **location**: Geographic location(s)
- **image_link**: Link to Wikipedia image
- **description**: Text description

## Project Structure

```
.
├── main.py              # Main script to run the scraper
├── scraper.py           # Wikipedia scraping logic
├── data_processor.py    # Data processing and DataFrame creation
├── csv_to_json.py       # Convert CSV to JSON with geocoding
├── server.py            # Local web server for visualization
├── index.html           # Interactive timeline webpage
├── style.css            # Visualization styles
├── script.js            # Interactive map logic
├── requirements.txt     # Python dependencies
├── inventions.csv       # Output CSV file
├── inventions.xlsx      # Output Excel file
└── inventions.json      # JSON data for web visualization
```

## Example Output

The scraper successfully extracted 514 historical inventions spanning from prehistoric times to the modern era, including:
- Stone tools (3.3 Mya)
- Control of fire (2.3 Mya)
- Agriculture (10,000-9,000 BC)
- Writing systems
- Modern inventions

## Dependencies

- requests: HTTP library for fetching web pages
- beautifulsoup4: HTML parsing
- pandas: Data manipulation and analysis
- lxml: Fast XML/HTML parser
- openpyxl: Excel file support
