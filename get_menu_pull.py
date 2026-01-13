from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_meal_data(driver, meal_tab_selector):
    """지정한 식사 탭을 클릭하고, 모든 코너와 메뉴를 추출하는 함수"""
    # 식사 탭 클릭
    driver.find_element(By.CSS_SELECTOR, meal_tab_selector).click()
    # 메뉴 영역이 로드될 때까지 대기
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.menuWrap"))
    )
    meal_data = {}
    # 각 코너 섹션 찾기
    corners = driver.find_elements(By.CSS_SELECTOR, "div.menuWrap > div")
    for corner in corners:
        try:
            title = corner.find_element(By.TAG_NAME, "h3").text  # 예: "A Corner (한식)"
            menu_name = corner.find_element(By.CSS_SELECTOR, "p.menuTitle").text
            meal_data[title] = menu_name
        except Exception:
            # 필드가 없는 경우(예: 공백라인) 건너뜀
            continue
    return meal_data

def scrape_today_menus():
    url = "https://puls2.pulmuone.com/src/php/menu/today.php"
    # WebDriver 설정
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # 창을 띄우지 않고 실행
    driver = webdriver.Chrome(options=options)
    driver.get(url)

    # 조식, 중식, 석식 탭 셀렉터 (실제 DOM 구조에 맞게 수정 필요)
    meal_tabs = {
        "조식": "#dvSch > div.clickSch:nth-of-type(1)",
        "중식": "#dvSch > div.clickSch:nth-of-type(2)",
        "석식": "#dvSch > div.clickSch:nth-of-type(3)",
    }

    result = {}
    for meal_name, selector in meal_tabs.items():
        try:
            data = get_meal_data(driver, selector)
            result[meal_name] = data
        except Exception as e:
            print(f"{meal_name} 메뉴 수집 실패: {e}")
            result[meal_name] = {}

    driver.quit()
    return result

if __name__ == "__main__":
    menus = scrape_today_menus()
    for meal, corners in menus.items():
        print(f"## {meal}")
        for corner_name, menu_item in corners.items():
            print(f"- {corner_name}: {menu_item}")
        print()
