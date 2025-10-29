import pandas as pd
import json
import re

# Geocoding dictionary for common locations
LOCATION_COORDS = {
    'kenya': {'lat': -1.2921, 'lng': 36.8219},
    'ethiopia': {'lat': 9.1450, 'lng': 40.4897},
    'south africa': {'lat': -30.5595, 'lng': 22.9375},
    'china': {'lat': 35.0, 'lng': 105.0},
    'egypt': {'lat': 26.8206, 'lng': 30.8025},
    'mesopotamia': {'lat': 33.0, 'lng': 44.0},
    'sumer': {'lat': 31.0, 'lng': 46.0},
    'fertile crescent': {'lat': 36.0, 'lng': 38.0},
    'near east': {'lat': 36.0, 'lng': 38.0},
    'anatolia': {'lat': 38.0, 'lng': 35.0},
    'phoenicia': {'lat': 33.8547, 'lng': 35.8623},
    'germany': {'lat': 51.1657, 'lng': 10.4515},
    'england': {'lat': 52.3555, 'lng': -1.1743},
    'france': {'lat': 46.2276, 'lng': 2.2137},
    'italy': {'lat': 41.8719, 'lng': 12.5674},
    'spain': {'lat': 40.4637, 'lng': -3.7492},
    'greece': {'lat': 39.0742, 'lng': 21.8243},
    'india': {'lat': 20.5937, 'lng': 78.9629},
    'persia': {'lat': 32.4279, 'lng': 53.6880},
    'iran': {'lat': 32.4279, 'lng': 53.6880},
    'iraq': {'lat': 33.2232, 'lng': 43.6793},
    'turkey': {'lat': 38.9637, 'lng': 35.2433},
    'japan': {'lat': 36.2048, 'lng': 138.2529},
    'indonesia': {'lat': -0.7893, 'lng': 113.9213},
    'israel': {'lat': 31.0461, 'lng': 34.8516},
    'jordan': {'lat': 30.5852, 'lng': 36.2384},
    'syria': {'lat': 34.8021, 'lng': 38.9968},
    'arabia': {'lat': 23.8859, 'lng': 45.0792},
    'arabia saudi': {'lat': 23.8859, 'lng': 45.0792},
    'moravia': {'lat': 49.5938, 'lng': 17.2509},
    'czech republic': {'lat': 49.8175, 'lng': 15.4730},
    'georgia': {'lat': 42.3154, 'lng': 43.3569},
    'zambia': {'lat': -13.1339, 'lng': 27.8493},
    'congo': {'lat': -4.0383, 'lng': 21.7587},
    'algeria': {'lat': 28.0339, 'lng': 1.6596},
    'morocco': {'lat': 31.7917, 'lng': -7.0926},
    'eswatini': {'lat': -26.5225, 'lng': 31.4659},
    'cyprus': {'lat': 35.1264, 'lng': 33.4299},
    'peru': {'lat': -9.1900, 'lng': -75.0152},
    'bolivia': {'lat': -16.2902, 'lng': -63.5887},
    'mexico': {'lat': 23.6345, 'lng': -102.5528},
    'united states': {'lat': 37.0902, 'lng': -95.7129},
    'california': {'lat': 36.7783, 'lng': -119.4179},
    'new york': {'lat': 40.7128, 'lng': -74.0060},
    'philadelphia': {'lat': 39.9526, 'lng': -75.1652},
    'boston': {'lat': 42.3601, 'lng': -71.0589},
    'london': {'lat': 51.5074, 'lng': -0.1278},
    'paris': {'lat': 48.8566, 'lng': 2.3522},
    'switzerland': {'lat': 46.8182, 'lng': 8.2275},
    'siberia': {'lat': 60.0, 'lng': 105.0},
    'southwest asia': {'lat': 30.0, 'lng': 45.0},
    'okinawa': {'lat': 26.3344, 'lng': 127.8056},
    'armenia': {'lat': 40.0691, 'lng': 45.0382},
    'jericho': {'lat': 31.8558, 'lng': 35.4467},
}

def parse_date_to_year(date_str):
    """Convert various date formats to a single year number"""
    date_str = date_str.lower().strip()
    
    # Handle Mya (million years ago)
    mya_match = re.search(r'(\d+\.?\d*)\s*mya', date_str)
    if mya_match:
        return -int(float(mya_match.group(1)) * 1000000)
    
    # Handle kya (thousand years ago)
    kya_match = re.search(r'(\d+\.?\d*)\s*kya', date_str)
    if kya_match:
        return -int(float(kya_match.group(1)) * 1000)
    
    # Handle BC
    bc_match = re.search(r'(\d+)\s*bc', date_str)
    if bc_match:
        return -int(bc_match.group(1))
    
    # Handle AD or plain numbers
    ad_match = re.search(r'(\d+)', date_str)
    if ad_match:
        year = int(ad_match.group(1))
        if 'ad' in date_str or year > 1000:
            return year
        # Assume BC for small numbers without context
        return -year if year < 500 else year
    
    # Default to very old
    return -1000000

def get_location_coords(location_str):
    """Get coordinates for a location string"""
    if not location_str or pd.isna(location_str):
        return None
    
    location_lower = location_str.lower().strip()
    
    # Try direct match first
    if location_lower in LOCATION_COORDS:
        return LOCATION_COORDS[location_lower]
    
    # Try partial match
    for key, coords in LOCATION_COORDS.items():
        if key in location_lower:
            return coords
    
    # Default to center of Africa (origin of humanity)
    return {'lat': 0.0, 'lng': 20.0}

def convert_csv_to_json():
    """Convert inventions CSV to JSON format for web visualization"""
    df = pd.read_csv('inventions.csv')
    
    inventions = []
    
    for _, row in df.iterrows():
        year = parse_date_to_year(str(row['date']))
        coords = get_location_coords(row['location'])
        
        if coords:
            invention = {
                'name': str(row['name']),
                'date': year,
                'lat': coords['lat'],
                'lng': coords['lng'],
                'location': str(row['location']) if pd.notna(row['location']) else 'Unknown',
                'description': str(row['description'])[:200] if pd.notna(row['description']) else ''
            }
            inventions.append(invention)
    
    # Sort by date
    inventions.sort(key=lambda x: x['date'])
    
    # Save to JSON
    with open('inventions.json', 'w', encoding='utf-8') as f:
        json.dump(inventions, f, indent=2, ensure_ascii=False)
    
    print(f"Converted {len(inventions)} inventions to JSON")
    print(f"Date range: {inventions[0]['date']} to {inventions[-1]['date']}")
    print("\nFirst 5 inventions:")
    for inv in inventions[:5]:
        print(f"  {inv['name']}: {inv['date']} at ({inv['lat']}, {inv['lng']})")

if __name__ == '__main__':
    convert_csv_to_json()
