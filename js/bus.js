import { csvParser } from "./domParser.js";

export const busUpdate = "2022-08-28";
const busFile = "./src/busTable.csv";
const date = new Date();

const hh = date.getHours();
const mm = date.getMinutes();
const dd = date.getDate();

//버스 필터
export const getBusFilter = async (week, leave, hour, destination) => {
  const data = await fetch(busFile);
  const text = await data.text();
  const csv = csvParser(text);
  const filter = [];
  csv.forEach((row) => {
    //평주,구분,시간,분,출발
    if (row[0] === week && row[1] === leave && String(row[2]) === hour && row[5] === destination) {
      filter.push(row);
    }
  });
  return filter;
};

//버스 출력
export const paintBusData = (filteredData, week, leave, hour, destination) => {
  const article = document.createElement("article");
  article.id = "bus-card";
  article.style = "order:1";

  //필터된 버스 출력
  let innerTable = `<header>
    <i class="fa-solid fa-bus"></i>
    ${week} ${leave} ${hour}시대 <mark>${destination}</mark>행 버스 알림</header><div>
    <center>
    <table><thead><tr><td>시</td><td>분</td><td>출발지</td></tr></thead><tbody>`;
  filteredData.forEach((list) => {
    let tr;
    if ((hh >= parseInt(list[2]) && mm >= parseInt(list[3])) || hh > parseInt(list[2])) {
      tr = `<tr>
          <td class="td-narrow"><b><ins>${list[2]}</ins></b></td>
          <td class="td-narrow"><b><ins>${list[3]}</ins></b></td>
          <td><b><ins>${list[4]}</ins></b></td>
        </tr>`;
    } else {
      tr = `<tr>
        <td class="td-narrow">${list[2]}</td>
        <td class="td-narrow">${list[3]}</td>
        <td>${list[4]}</td>
      </tr>`;
    }

    innerTable += tr;
  });
  innerTable += `</tbody></table></center></div>`;
  const footer = `<footer><small>
                  <ul>
                  <li><ins>녹색 글씨</ins> 노선은 출발지에서 출발했습니다.</li>
                  <li>평일 중 토요일 노선이 적용되는 경우가 있으니 사내공지를 확인바랍니다.</li>
                  <li>노선 업데이트일 : ${busUpdate}</li>
                  </ul>
                  <div id="entire-bus-btn"><a href="./bus.html">버스 전체보기</a></div>
                  </small></footer>`;
  innerTable += footer;
  article.innerHTML = innerTable;
  cards.prepend(article);
};
