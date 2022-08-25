import { getWeatherData } from "./weather.js";
import { csvParser } from "./domParser.js";

const searchForm = document.querySelector("#search-form");
const lastupdate = document.getElementById("lastupdate");
const div = document.createElement("div");
const small = document.createElement("small");

const date = new Date();

// 온도 측정
getWeatherData({ mode: "lastUpdate" }).then((data) => {
  div.innerHTML = `현재 온도는 <mark>${data[8]}℃</mark>입니다.`;
  small.innerHTML = `${data[0]}시에 마지막 업데이트. 옥포조선소 기준 <a href="http://www.kma.go.kr/cgi-bin/aws/nph-aws_txt_min?0&0&MINDB_01M&294&a">(더보기)</a>`;
  lastupdate.appendChild(div);
  lastupdate.appendChild(small);
  lastupdate.ariaBusy = "false";
});

//버스 알림 노출
const getBusFilter = async (week, leave, hour, destination) => {
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

const paintBusData = (filteredData, week, leave, hour, destination) => {
  const article = document.createElement("article");
  article.id = "bus-card";
  article.style = "order:-1";

  //필터된 버스 출력
  let innerTable = `<header>
  <i class="fa-solid fa-bus"></i>
  ${week} ${leave} ${hour}시대 ${destination}행 버스 알림</header><div>
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

//버스 알림 조건 타이머
const dest = "능포"; //현재 기본값
let week;
const hour = date.getHours();
const min = date.getMinutes();
const month = date.getMonth() + 1;

if (date.getDay() >= 6) {
  // week = "주말";
  week = "평일";
} else {
  week = "평일";
}

if ((hour >= 19 && min >= 30) || hour >= 20) {
  getBusFilter(week, "퇴근", "20", dest).then((x) => {
    getBusFilter(week, "퇴근", "21", dest).then((y) => {
      getBusFilter(week, "퇴근", "22", dest).then((z) => {
        const result = [];
        result.push(...x, ...y, ...z);
        paintBusData(result, week, "퇴근", "21, 22, 23", dest);
      });
    });
  });
} else if ((hour >= 18 && min >= 30) || hour >= 19) {
  getBusFilter(week, "퇴근", "19", dest).then((result) => {
    paintBusData(result, week, "퇴근", "19", dest);
  });
} else if ((hour >= 17 && min >= 30) || hour >= 18) {
  getBusFilter(week, "퇴근", "18", dest).then((result) => {
    paintBusData(result, week, "퇴근", "18", dest);
  });
} else if ((hour >= 16 && min >= 30) || hour >= 17) {
  getBusFilter(week, "퇴근", "17", dest).then((result) => {
    paintBusData(result, week, "퇴근", "17", dest);
  });
}

// 정오 연장 알림 (4~10월 사이에만 작동)
if (hour === 12 && month >= 4 && month <= 10) {
  const article = document.createElement("article");
  const cards = document.getElementById("cards");
  article.style = "order:-1;";
  article.ariaBusy = "true";
  cards.appendChild(article);
  getWeatherData({ mode: "check", value: "12:00" }).then((data) => {
    if (data !== null) {
      let msg = "";
      if (parseFloat(data[0]) >= 31.5) {
        msg = "1시간 연장입니다.";
      } else if (parseFloat(data[0]) > 28) {
        msg = "30분 연장입니다.";
      } else {
        msg = "연장이 아닙니다.";
      }
      article.innerHTML = `
        <div>🚨 12시 정각 온도는 ${data[8]}C°이며 <mark>${msg}</mark></div>
        <footer>
          <small>
            <div><i class="fa-solid fa-info"></i> 연장 기준은 28도 이상은 30분 연장, 31.5도 이상은 1시간 연장</div>
            <div>
              <i class="fa-solid fa-info"></i> <a href="http://www.kma.go.kr/cgi-bin/aws/nph-aws_txt_min?0&0&MINDB_01M&294&a" target="_blank">공공데이터</a>를 기반으로 한 결과이며, 정확한 결과는
              회사 공지를 확인해주세요.
            </div>
          </small>
        </footer>`;
    }
    article.ariaBusy = "false";
  });
}

const handleSearch = (event) => {
  event.preventDefault();
  const searchbar = searchForm.querySelector("input:first-child");
  console.log(searchbar.value);
  window.open(`https://www.google.com/search?q=${searchbar.value}`);
  searchbar.value = "";
};

searchForm.addEventListener("submit", handleSearch);
