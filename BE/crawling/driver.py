from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from time import sleep
from bs4 import BeautifulSoup
from pprint import pprint

if __name__ == "__main__":
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
    swegkey="https://smartstore.naver.com/swagkey"
    
    swegkeyList=["스위치", "키보드", "키캡", "기판 & 파츠", "스테빌라이저"]
    geonList=["키보드", "PCB & 보강판", "VENOM", "스위치", "스테빌라이저", "키캡", "흡음재"]
    
    driver.get(swegkey)
    driver.implicitly_wait(5)
    act=ActionChains(driver)
    
    def today():
        try:
            today_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[contains(text(),'오늘하루 안보기')]")))
            sleep(0.5)
            today_button.click()
        except:
            print("팝업 없음")
    
    today()
    
    def cr(List):
        menu = wait.until(EC.element_to_be_clickable((By.ID,"pc-categoryMenuWidget")))
        for l in List:
            sub=menu.find_element(By.XPATH, f"//a[contains(text(),'{l}')]")
            act.move_to_element(sub).perform()
            sleep(0.3)
            submenu=wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "T20614P231")))
            pprint(submenu.text)
    
    cr(swegkeyList)
    # soup = BeautifulSoup(driver.page_source, 'html.parser')
    # pprint(soup)
    sleep(100)