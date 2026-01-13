import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup


URL = "https://puls2.pulmuone.com/src/php/menu/today.php"


def setup_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver


def wait_for_page(driver):
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )
    time.sleep(5)


def extract_text(driver):
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    text = soup.get_text("\n")
    lines = [line.strip() for line in text.splitlines()]
    lines = [line for line in lines if line]
    return lines


def save_result(lines):
    with open("menu.txt", "w", encoding="utf-8") as f:
        for line in lines:
            f.write(line + "\n")


def main():
    driver = setup_driver()
    try:
        driver.get(URL)
        wait_for_page(driver)
        lines = extract_text(driver)
        save_result(lines)
        print("수집 완료: menu.txt 생성됨")
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
