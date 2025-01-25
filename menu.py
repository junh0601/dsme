from requests import get
from bs4 import BeautifulSoup
import json
import re 
import os
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_menu_soup():
    url = "http://m.welliv.co.kr/mobile/mealmenu_list.jsp"
    soup = None
    try:
        request = get(url, timeout=(1, 27), headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        })
    except:
        print("🚨Didn't request from URL")
        error = {"is_error": True, "error_msg": "🚨Didn't request from URL"}
        return error
    else:
        soup = BeautifulSoup(request.text, "html.parser")
        soup["is_error"] = False
        return soup

# get_menu_table(soup, 1조|2중|3식, n일뒤의 식단(0:오늘))
def get_menu_table(soup, col, row):
    if soup["is_error"]:
        return soup
    else:
        try:
            mainContent = soup.find("div", id="mainContent", class_="prnews")
            food_sch = mainContent.find("div", class_="food_sch")
            table = food_sch.find("table", recursive=False)
            rows = table.find_all("tr", recursive=False)
            if len(rows) <= (row + 1):
                print("더이상 표시할 수 없는 날짜입니다.")
                return 
            
            column = rows[row + 1].find_all("td", recursive=False)
            date = re.sub(r'(<td.*<center>|<br/>|</center></td>)', "", str(column[0]))

            dic = {"date": date, "menu": {}}
            menu_time = ["아침", "점심", "저녁", "야식"]
            dic["time"] = menu_time[col - 1]
            
            li = column[col].find_all("td")
            kind = ""
            for l in li:
                mod = re.sub(r'(<td.*\xa0|</td>)', "", str(l))
                if '</span>' in mod:
                    kind = re.sub('</span>', "", mod)
                    dic["menu"][kind] = []
                else:
                    dic["menu"][kind].append(mod)
            return dic
        except:
            print("soup 추출 에러.")
            return {"is_error": True, "error_msg": "soup 추출 에러"}

# 결과 출력
soup = get_menu_soup()
if soup["is_error"] != True:
    finalResult = []

    for i in range(7):  # 7일간의 데이터를 가져옴
        for j in [1, 2, 3]:  # 조식, 중식, 석식
            menu = get_menu_table(soup, j, i)
            if menu:
                finalResult.append(menu)

    # JSON 파일 저장
    with open(os.path.join(BASE_DIR, 'src/menu.json'), 'w+', encoding='utf-8') as json_file:
        json.dump(finalResult, json_file, ensure_ascii=False, indent='\t')
