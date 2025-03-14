import requests
from bs4 import BeautifulSoup
from pprint import pprint
swegkey="https://smartstore.naver.com/swagkey"
headers = {
    "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Whale/3.26.244.21 Safari/537.36"
}


request = requests.get(swegkey, headers=headers)
soup = BeautifulSoup(request.content, "html.parser")
pprint(soup)
