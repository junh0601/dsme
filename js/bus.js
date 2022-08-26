import { csvParser } from "./domParser.js";

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
    const tr = `<tr>
          <td class="td-narrow">${list[2]}</td>
          <td class="td-narrow">${list[3]}</td>
          <td>${list[4]}</td>
      </tr>`;
    innerTable += tr;
  });
  innerTable += "</tbody></table><div>";
  article.innerHTML = innerTable;
  cards.prepend(article);
};

//버스 알림 노출
export const getBusFilter = async (week, leave, hour, destination) => {
  const data = await fetch("./src/neungpo.csv");
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
