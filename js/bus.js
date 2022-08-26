import { csvParser } from "./domParser.js";

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
    <table><thead><tr><td>시</td><td>분</td><td>출발지</td></tr></thead><tbody>`;
  filteredData.forEach((list) => {
    let tr;
    if (hh >= parseInt(list[2]) && mm >= parseInt(list[3])) {
      tr = `<tr>
          <td class="td-narrow"><ins>${list[2]}</ins></td>
          <td class="td-narrow"><ins>${list[3]}</ins></td>
          <td><ins>${list[4]}</ins></td>
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
  innerTable += "</tbody></table><small><ins>녹색 글씨</ins> 노선은 출발지에서 출발했습니다.</small><div>";
  article.innerHTML = innerTable;
  cards.prepend(article);
};
