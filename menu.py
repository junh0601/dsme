from requests import get
from bs4 import BeautifulSoup
from pprint import pprint
import json
import re 
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_menu_soup():
    url = "http://m.welliv.co.kr/mobile/mealmenu_list.jsp"
    soup=None;
    try:
        request = get(url, timeout=(1, 27))
    except:
        print("🚨Didn't request from URL")
        error = {"is_error" : True, "error_msg" : "🚨Didn't request from URL"}
        return error
    else:
        soup = BeautifulSoup(request.text, "html.parser")
        soup["is_error"] = False
        return soup


# get_menu_table(soup, 1조|2중|3식, n일뒤의 식단(0:오늘))
def get_menu_table(soup, col, row):
    if soup["is_error"]:
        return soup
    elif not col in [1,2,3,4]:
        print("잘못된 시간대입니다.")
        soup = {"is_error" : True, "error_msg" : "잘못된 시간대입니다."}
        return soup
    else:
        #col열-row행 테이블 요소 찾기
        try:
            print(soup)
            mainContent = soup.find("div", id="mainContent", class_="prnews")
            food_sch = mainContent.find("div", class_="food_sch")
            table = food_sch.find("table", recursive=False)
            rows = table.find_all("tr", recursive=False)
            if len(rows)<=(row+1):
                print("더이상 표시할 수 없는 날짜입니다.")
                return 
            column = rows[row+1].find_all("td", recursive=False)
            date = re.sub('(<td.*<center>|<br/>|</center></td>)',"", str(column[0]))

            # 사전 데이터 구성하기   dic= {"date": ? ,"식사시간" : ? , "menu" : [메뉴 리스트], ...}
            dic={"date" : date, "menu" : {}}
            menu_time=["아침", "점심", "저녁", "야식"]
            dic["time"] = menu_time[col-1]
            
            # 메뉴에서 분리하기
            li = column[col].find_all("td")
            kind=""
            for l in li:
                mod = re.sub('(<td.*\xa0|</td>)',"", str(l))
                if('</span>' in mod):
                    kind = re.sub('</span>',"",mod)
                    dic["menu"][kind]=[]
                else:
                    dic["menu"][kind].append(mod)
            return dic
        except:
            print("soup 추출 에러.")
            soup = {"is_error" : True, "error_msg" : "soup 추출 에러"}
            return soup

rslt = get_menu_table(get_menu_soup(),1,0)

with open(os.path.join(BASE_DIR, 'menu.json'), 'w+',
          encoding='utf-8') as json_file:
    json.dump(rslt, json_file, ensure_ascii=False, indent='\t')