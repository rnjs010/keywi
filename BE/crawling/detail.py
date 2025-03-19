from driver import init_driver
from dbctl import DBs
from time import sleep
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from pprint import pprint

if __name__ == '__main__':
    while True:
        try:
            KeyWi=DBs()
            if KeyWi:break
        except:
            print("다시 시도해주세요.")
    products = KeyWi.select_product()
    
    for products_id, *value in products:
        driver, wait = init_driver()
        category_id, product_name, price, product_url, product_image, options = value
        driver.get(product_url)
        act=ActionChains(driver)
        
        # 상품상세 로딩 시키기 위함
        body=driver.find_element(By.TAG_NAME, 'body')
        body.send_keys(Keys.END)
        
        driver.implicitly_wait(5)
        sleep(2)
        
        try:
            body.send_keys(Keys.END)
            sleep(2)
            moredetail=wait.until(EC.element_to_be_clickable((By.CLASS_NAME, '_1gG8JHE9Zc')))
            if moredetail.text=='상세정보 펼쳐보기':
                act.move_to_element(moredetail).click().perform()
        except Exception as e:
            print(e)
            print("상세 없음")
        
        productdetails = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, '_9F9CWn02VE')))
        
        components = productdetails.find_elements(By.CLASS_NAME, 'se-component')
        
        description_list=[]
        for component in components:
            compclass=component.get_attribute("class")
            
            if "se-text" in compclass:
                descriptions=component.find_elements(By.TAG_NAME, "p")
                for de in descriptions:
                    description_list.append([products_id, de.text, len(description_list)+1, 'text'])
            
            elif "se-image" in compclass:
                imgURL=component.find_element(By.TAG_NAME, "img").get_attribute("src")
                description_list.append([products_id, imgURL, len(description_list)+1, 'image'])
                
                img_descriptions=component.find_elements(By.TAG_NAME, "p")
                if img_descriptions:
                    for imde in img_descriptions:
                        description_list.append([products_id, imde.text, len(description_list)+1, 'text'])
            
            elif "se-horizontalLine" in compclass:
                if "se-l-line1" in compclass:
                    description_list.append([products_id, 'long', len(description_list)+1, 'hr'])
                elif "se-l-default"  in compclass:
                    description_list.append([products_id, 'short', len(description_list)+1, 'hr'])
                    
            # detail_description, description_order, content_type
    
    
        for description in description_list:
            KeyWi.insert_product_description(*description)
        print(product_name)
        pprint(description_list)
        print()
        driver.quit()