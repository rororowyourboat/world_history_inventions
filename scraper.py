import requests
from bs4 import BeautifulSoup
import re
from typing import List, Dict, Optional

class WikipediaInventionsScraper:
    def __init__(self, url: str):
        self.url = url
        self.soup = None
        
    def fetch_page(self) -> bool:
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(self.url, headers=headers, timeout=30)
            response.raise_for_status()
            self.soup = BeautifulSoup(response.content, 'lxml')
            return True
        except requests.RequestException as e:
            print(f"Error fetching page: {e}")
            return False
    
    def extract_inventions(self) -> List[Dict[str, str]]:
        if not self.soup:
            return []
        
        inventions = []
        content = self.soup.find('div', {'id': 'mw-content-text'})
        
        if not content:
            return []
        
        list_items = content.find_all('li')
        
        for li in list_items:
            invention = self._parse_invention_entry(li)
            if invention:
                inventions.append(invention)
        
        return inventions
    
    def _parse_invention_entry(self, li) -> Optional[Dict[str, str]]:
        text = li.get_text(strip=False)
        
        date_pattern = r'^(\d+\.?\d*\s*[Mm]ya|\d+\.?\d*\s*kya|\d+\s*BC|\d+\s*AD|\d+|c\.\s*\d+|\d+\s*–\s*\d+\s*(?:kya|Mya|BC|AD)?)'
        date_match = re.match(date_pattern, text.strip())
        
        if not date_match:
            return None
        
        date_str = date_match.group(1).strip()
        remaining_text = text[date_match.end():].strip()
        
        if remaining_text.startswith(':'):
            remaining_text = remaining_text[1:].strip()
        
        name = self._extract_name(li, remaining_text)
        description = self._clean_description(remaining_text)
        location = self._extract_location(remaining_text)
        image_link = self._extract_image(li)
        date_range = self._extract_date_range(date_str, remaining_text)
        
        return {
            'name': name,
            'date': date_str,
            'date_range': date_range,
            'location': location,
            'image_link': image_link,
            'description': description
        }
    
    def _extract_name(self, li, text: str) -> str:
        links = li.find_all('a')
        for link in links:
            if link.get('href', '').startswith('/wiki/') and not link.get('href', '').startswith('/wiki/File:'):
                name = link.get_text(strip=True)
                if name and len(name) > 1:
                    return name
        
        bold = li.find('b')
        if bold:
            bold_text = bold.get_text(strip=True)
            if ':' in bold_text:
                parts = bold_text.split(':', 1)
                if len(parts) > 1:
                    return parts[1].strip()
        
        words = text.split()
        if len(words) > 0:
            name_words = []
            for word in words[:10]:
                if word.lower() in ['in', 'by', 'from', 'at', '–', '-']:
                    break
                name_words.append(word)
            return ' '.join(name_words).strip('.,;:–')
        
        return 'Unknown'
    
    def _extract_location(self, text: str) -> str:
        location_pattern = r'\bin\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,|\[|\(|by|$)'
        matches = re.findall(location_pattern, text)
        
        locations = []
        for match in matches:
            location = match.strip()
            if len(location) > 2 and len(location) < 50:
                locations.append(location)
        
        return ', '.join(locations) if locations else ''
    
    def _extract_image(self, li) -> str:
        parent = li.find_parent()
        if parent:
            img = parent.find('img', class_='mw-file-element')
            if img and img.get('src'):
                src = img.get('src')
                if src.startswith('//'):
                    return 'https:' + src
                elif src.startswith('/'):
                    return 'https://en.wikipedia.org' + src
                return src
        
        img = li.find('img', class_='mw-file-element')
        if img and img.get('src'):
            src = img.get('src')
            if src.startswith('//'):
                return 'https:' + src
            elif src.startswith('/'):
                return 'https://en.wikipedia.org' + src
            return src
        
        return ''
    
    def _extract_date_range(self, date_str: str, text: str) -> str:
        if '–' in date_str or '-' in date_str:
            return date_str
        
        range_pattern = r'(\d+\.?\d*\s*(?:Mya|kya|BC|AD)?)\s*[–-]\s*(\d+\.?\d*\s*(?:Mya|kya|BC|AD)?)'
        match = re.search(range_pattern, text[:100])
        if match:
            return match.group(0)
        
        return date_str
    
    def _clean_description(self, text: str) -> str:
        text = re.sub(r'\[\d+\]', '', text)
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        
        if len(text) > 500:
            text = text[:500] + '...'
        
        return text
