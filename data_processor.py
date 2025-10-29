import re
import pandas as pd
from typing import List, Dict

class DataProcessor:
    @staticmethod
    def normalize_date(date_str: str) -> str:
        date_str = date_str.strip()
        date_str = re.sub(r'\s+', ' ', date_str)
        return date_str
    
    @staticmethod
    def process_inventions(inventions: List[Dict[str, str]]) -> pd.DataFrame:
        if not inventions:
            return pd.DataFrame(columns=['name', 'date', 'date_range', 'location', 'image_link', 'description'])
        
        for invention in inventions:
            invention['date'] = DataProcessor.normalize_date(invention.get('date', ''))
            invention['date_range'] = DataProcessor.normalize_date(invention.get('date_range', ''))
            invention['name'] = invention.get('name', '').strip()
            invention['location'] = invention.get('location', '').strip()
            invention['image_link'] = invention.get('image_link', '').strip()
            invention['description'] = invention.get('description', '').strip()
        
        df = pd.DataFrame(inventions)
        
        df = df[['name', 'date', 'date_range', 'location', 'image_link', 'description']]
        
        df = df[df['name'] != 'Unknown']
        df = df[df['name'] != '']
        
        df = df.drop_duplicates(subset=['name', 'date'], keep='first')
        
        df = df.reset_index(drop=True)
        
        return df
    
    @staticmethod
    def save_to_csv(df: pd.DataFrame, filename: str = 'inventions.csv'):
        df.to_csv(filename, index=False, encoding='utf-8')
        print(f"Data saved to {filename}")
    
    @staticmethod
    def save_to_excel(df: pd.DataFrame, filename: str = 'inventions.xlsx'):
        df.to_excel(filename, index=False, engine='openpyxl')
        print(f"Data saved to {filename}")
