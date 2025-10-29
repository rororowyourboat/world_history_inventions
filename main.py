from scraper import WikipediaInventionsScraper
from data_processor import DataProcessor

def main():
    url = 'https://en.wikipedia.org/wiki/Timeline_of_historic_inventions'
    
    print(f"Fetching data from {url}...")
    scraper = WikipediaInventionsScraper(url)
    
    if not scraper.fetch_page():
        print("Failed to fetch the page. Exiting.")
        return
    
    print("Extracting inventions...")
    inventions = scraper.extract_inventions()
    print(f"Found {len(inventions)} invention entries")
    
    print("Processing data...")
    df = DataProcessor.process_inventions(inventions)
    print(f"Processed {len(df)} valid inventions")
    
    print("\nFirst 5 inventions:")
    print(df.head())
    
    print(f"\nDataFrame shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    DataProcessor.save_to_csv(df, 'inventions.csv')
    DataProcessor.save_to_excel(df, 'inventions.xlsx')
    
    print("\nData collection complete!")
    print(f"Total inventions: {len(df)}")
    print(f"Inventions with locations: {df['location'].notna().sum()}")
    print(f"Inventions with images: {df['image_link'].notna().sum()}")

if __name__ == "__main__":
    main()
