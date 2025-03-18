from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

def init_driver():
    options=Options()
    options.add_argument("log-level=3")
    options.add_argument("lang=ko_KR")
    options.add_argument("--window-size=1920,1080")
    # options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument("user-Agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Whale/4.30.291.11 Safari/537.36")
    options.add_argument("--start-maximized")  # 창 최대화
    # options.add_argument("--headless") # 숨김
    options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
    options.add_experimental_option("useAutomationExtension", False)
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    wait = WebDriverWait(driver, 5)
    
    return driver, wait