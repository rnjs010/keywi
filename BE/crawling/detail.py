from driver import init_driver
from dbctl import DBs
from time import sleep
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC

if __name__ == '__main__':
    driver, wait = init_driver()
    KeyWi=DBs()
    products = KeyWi.select_product()
    
    for products_id, *value in products:
        category_id, product_name, price, product_url, product_image, options = value
        driver.get(product_url)
        driver.implicitly_wait(5)
        sleep(1)
        
        body=driver.find_element(By.TAG_NAME, 'body')
        body.send_keys(Keys.END)
        sleep(1)
        try:
            moredetail=wait.until(EC.visibility_of_element_located((By.CLASS_NAME, '_1gG8JHE9Zc')))
            if moredetail.text=='상세정보 펼쳐보기':
                moredetail.click()
        except:
            print("상세 없음")
        body.send_keys(Keys.END)
        sleep(2)
        
        productdetails = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, '_9F9CWn02VE')))
        
        components = productdetails.find_elements(By.CLASS_NAME, 'se-component')
        description_order = 1
        
        for component in components:
            if "se-text" in component.get_attribute("class"):
                pass
            
            elif "se-image" in component.get_attribute("class"):
                pass