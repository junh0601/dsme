import { getWeatherData } from "./js/weather.js";
import { findMenuOfDate, printMenu } from "./js/menu.js";
import { getBusFilter, paintBusData } from "./js/bus.js";

const searchForm = document.querySelector("#search-form");
const lastupdate = document.getElementById("lastupdate");
const div = document.createElement("div");
const small = document.createElement("small");
const menuCard = document.getElementById("menu-card");

const date = new Date();

const day = date.getDate();
const hour = date.getHours();
const min = date.getMinutes();
const month = date.getMonth() + 1;

// 메뉴 출력
if (hour >= 19) {
  menuCard.innerHTML = ``;
} else if (hour >= 13) {
  findMenuOfDate(month, day, "저녁").then((data) => {
    menuCard.innerHTML = printMenu(month, day, "저녁", data);
  });
} else if (hour >= 8) {
  findMenuOfDate(month, day, "점심").then((data) => {
    menuCard.innerHTML = printMenu(month, day, "점심", data);
  });
} else if (hour >= 0) {
  findMenuOfDate(month, day, "아침").then((data) => {
    menuCard.innerHTML = printMenu(month, day, "아침", data);
  });
}

// 온도 측정
getWeatherData({ mode: "lastUpdate" }).then((data) => {
  div.innerHTML = `현재 기온은 <mark>${data[8]}℃</mark>입니다.`;
  small.innerHTML = `${data[0]}시에 마지막 업데이트. 옥포조선소 기준 <a class="contrast" href="http://www.kma.go.kr/cgi-bin/aws/nph-aws_txt_min?0&0&MINDB_01M&294&a">(더보기)</a>`;
  lastupdate.appendChild(div);
  lastupdate.appendChild(small);
  lastupdate.ariaBusy = "false";
});

//파라미터 읽기
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const params = url.searchParams;
let dest = "능포"; //현재 기본값
if (params.get("bus") !== null) {
  dest = params.get("bus");
}

let week;
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
} else if (hour >= 12) {
  getBusFilter(week, "퇴근", "17", dest).then((result) => {
    paintBusData(result, week, "퇴근", "17", dest);
  });
}

// 정오 연장 알림 (4~10월 사이에만 작동)
if (hour === 12 && month >= 4 && month <= 10) {
  const article = document.createElement("article");
  const cards = document.getElementById("cards");
  article.style = "order:-2;";
  article.innerHTML = ` 점심 시간 연장 여부 조회중`;
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
        <header>🚨 점심 시간 <mark>${msg}</mark></header>
        <center><hgroup><h2> ${data[8]}C°</h2><h6>12:00시 기준</h6> <hgroup></center>
        <footer>
          <small>
            <div><i class="fa-solid fa-info"></i> 연장 기준은 28도 이상은 30분 연장, 31.5도 이상은 1시간 연장 (12시 정각 온도)</div>
            <div>
              <i class="fa-solid fa-info"></i> <a href="http://www.kma.go.kr/cgi-bin/aws/nph-aws_txt_min?0&0&MINDB_01M&294&a" class="contrast" target="_blank">공공데이터</a>를 기반으로 한 결과이며, 정확한 결과는
              회사 공지를 확인해주세요.
            </div>
          </small>
        </footer>`;
    } else {
      article.innerHTML = "점심 연장 여부가 아직 조회되지 않습니다.";
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
