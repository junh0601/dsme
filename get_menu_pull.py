import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_meal_data(driver, meal_tab_selector):
    driver.find_element(By.CSS_SELECTOR, meal_tab_selector).click()

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.menuWrap"))
    )

    meal_data = {}
    corners = driver.find_elements(By.CSS_SELECTOR, "div.menuWrap > div")

    for corner in corners:
        try:
            title = corner.find_element(By.TAG_NAME, "h3").text
            menu_name = corner.find_element(By.CSS_SELECTOR, "p.menuTitle").text
            meal_data[title] = menu_name
        except Exception:
            continue

    return meal_data

def scrape_today_menus():
    url = "https://puls2.pulmuone.com/src/php/menu/today.php"

    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.get(url)

    meal_tabs = {
        "조식": "#dvSch > div.clickSch:nth-of-type(1)",
        "중식": "#dvSch > div.clickSch:nth-of-type(2)",
        "석식": "#dvSch > div.clickSch:nth-of-type(3)",
    }

    result = {}

    for meal_name, selector in meal_tabs.items():
        try:
            result[meal_name] = get_meal_data(driver, selector)
        except Exception as e:
            print(f"{meal_name} 메뉴 수집 실패: {e}")
            result[meal_name] = {}

    driver.quit()
    return result

if __name__ == "__main__":
    menus = scrape_today_menus()

    with open("today_menu.json", "w", encoding="utf-8") as f:
        json.dump(menus, f, ensure_ascii=False, indent=2)

    print("today_menu.json 저장 완료")
