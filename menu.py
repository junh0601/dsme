from requests import get
from bs4 import BeautifulSoup
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
        print("๐จDidn't request from URL")
        error = {"is_error" : True, "error_msg" : "๐จDidn't request from URL"}
        return error
    else:
        soup = BeautifulSoup(request.text, "html.parser")
        soup["is_error"] = False
        return soup

# get_menu_table(soup, 1์กฐ|2์ค|3์, n์ผ๋ค์ ์๋จ(0:์ค๋))
def get_menu_table(soup, col, row):
    if soup["is_error"]:
        return soup
    else:
        #col์ด-rowํ ํ์ด๋ธ ์์ ์ฐพ๊ธฐ
        try:
            mainContent = soup.find("div", id="mainContent", class_="prnews")
            food_sch = mainContent.find("div", class_="food_sch")
            table = food_sch.find("table", recursive=False)
            rows = table.find_all("tr", recursive=False)
            if len(rows)<=(row+1):
                print("๋์ด์ ํ์ํ  ์ ์๋ ๋ ์ง์๋๋ค.")
                return 
            column = rows[row+1].find_all("td", recursive=False)
            date = re.sub('(<td.*<center>|<br/>|</center></td>)',"", str(column[0]))

            # ์ฌ์  ๋ฐ์ดํฐ ๊ตฌ์ฑํ๊ธฐ   dic= {"date": ? ,"์์ฌ์๊ฐ" : ? , "menu" : [๋ฉ๋ด ๋ฆฌ์คํธ], ...}
            dic={"date" : date, "menu" : {}}
            menu_time=["์์นจ", "์ ์ฌ", "์ ๋", "์ผ์"]
            dic["time"] = menu_time[col-1]
            
            # ๋ฉ๋ด์์ ๋ถ๋ฆฌํ๊ธฐ
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
            print("soup ์ถ์ถ ์๋ฌ.")
            soup = {"is_error" : True, "error_msg" : "soup ์ถ์ถ ์๋ฌ"}
            return soup
# ๊ฒฐ๊ณผ ์ถ๋ ฅ

soup= get_menu_soup()
print(soup.find("table"))
if soup["is_error"] != True  :
    finalResult = []
    for i in range(7):
        for j in [1,2,3]:
            finalResult.append(get_menu_table(soup,j,i))


    with open(os.path.join(BASE_DIR, 'src/menu.json'), 'w+',
            encoding='utf-8') as json_file:
        json.dump(finalResult, json_file, ensure_ascii=False, indent='\t')