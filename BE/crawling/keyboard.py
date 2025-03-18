import requests
from bs4 import BeautifulSoup
from pprint import pprint
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

swegkey="https://smartstore.naver.com/swagkey"
headers = {
    "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Whale/3.26.244.21 Safari/537.36"
}


url='https://smartstore.naver.com/swagkey/category/e2628f66a9de49b884cb010378469b30?st=RECENT&dt=IMAGE&page=1&size=80'
parsed_url = urlparse(url)
query_params = parse_qs(parsed_url.query)
pagenum=2
for i in range(1, pagenum+1):
    query_params['page']=[f'{i}']
    modified_query = urlencode(query_params, doseq=True)
    modified_url = urlunparse((parsed_url.scheme, parsed_url.netloc, parsed_url.path, parsed_url.params, modified_query, parsed_url.fragment))
    print(modified_url)
