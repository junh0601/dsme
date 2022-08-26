import { getInnerTag } from "./domParser.js";

// <mode>
// "default" : 전부 출력
// "lastcheck"  : 마지막 측정값 array
// "check" : 특정시간대 값 array 가져옴 , value에 "12:00" 형태의 값 필요
//

export const getWeatherData = async ({ mode, value }) => {
  const url = "https://vast-ravine-53067.herokuapp.com/http://www.kma.go.kr/cgi-bin/aws/nph-aws_txt_min?0&0&MINDB_01M&294&a";
  const data = await fetch(url, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  // regex 정의
  const rowRegex = /<tr.*?\/tr>/g;
  const colRegex = /<td.*?\/td>/g;

  // dom 파싱하기
  const html = await data.text();
  const text = html.replace("&nbsp;", " ");
  const rows = text.match(rowRegex); //tr 열 불러오기
  const rowResult = rows.slice(1, rows.length - 1); // 1열 제거
  let result = []; // 열 array 생성

  // 열마다 파싱하기
  const Break = new Error("Break");
  try {
    rowResult.forEach((row) => {
      const cols = row.match(colRegex);
      const colsResult = getInnerTag(cols, "td");
      colsResult[0] = getInnerTag(colsResult[0], "a");
      if (mode === "lastUpdate") {
        if (colsResult[2] !== ".") {
          result = colsResult;
          throw Break;
        }
      } else if (mode === "check") {
        if (colsResult[0] === value) {
          result = colsResult;
          throw Break;
        } else {
          result = null;
        }
      } else {
        result.push(colsResult);
      }
    });
  } catch (e) {}
  return result;
};
