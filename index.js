
import { findMenuOfDate, printMenu } from "./js/menu.js";
import { getBusFilter, paintBusData } from "./js/bus.js";

const searchForm = document.querySelector("#search-form");
const weatherContainer = document.getElementById("weather-container");
const menuCard = document.getElementById("menu-card");
const entireBusBtn = document.querySelector("#entire-bus-btn");

const date = new Date();

const day = date.getDate();
const hour = date.getHours();
const min = date.getMinutes();
const month = date.getMonth() + 1;
const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

const appendMenuFooter = () => {
  const menuCardFooter = document.createElement("footer");
  menuCardFooter.innerHTML = `<small><a href="./menu.html">식단 전체보기</a></small><br><small><a href="http://m.welliv.co.kr/mobile/mealmenu_list.jsp">웰리브 사이트 바로가기</a></small>`;
  menuCard.appendChild(menuCardFooter);
};

// 메뉴 출력
if (hour >= 13) {
  findMenuOfDate(month, day, "저녁").then((data) => {
    menuCard.innerHTML = printMenu(month, day, week, "저녁", data);
    appendMenuFooter();
  });
} else if (hour >= 8) {
  findMenuOfDate(month, day, "점심").then((data) => {
    menuCard.innerHTML = printMenu(month, day, week, "점심", data);
    appendMenuFooter();
  });
} else if (hour >= 0) {
  findMenuOfDate(month, day, "아침").then((data) => {
    menuCard.innerHTML = printMenu(month, day, week, "아침", data);
    appendMenuFooter();
  });
}

//파라미터 읽기
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const params = url.searchParams;
let dest = "능포"; //현재 기본값
if (params.get("bus") !== null) {
  dest = params.get("bus");
}

let weekday;
if (date.getDay() === 0) {
  weekday = "일요일";
} else if (date.getDay() === 6) {
  weekday = "토요일";
} else {
  weekday = "평일";
}

//버스 알리미
if ((hour >= 19 && min >= 45) || hour >= 20) {
  getBusFilter(weekday, "퇴근", "20", dest).then((x) => {
    getBusFilter(weekday, "퇴근", "21", dest).then((y) => {
      getBusFilter(weekday, "퇴근", "22", dest).then((z) => {
        const result = [];
        result.push(...x, ...y, ...z);
        paintBusData(result, weekday, "퇴근", "21, 22, 23", dest);
      });
    });
  });
} else if ((hour >= 18 && min >= 45) || hour >= 19) {
  getBusFilter(weekday, "퇴근", "19", dest).then((result) => {
    paintBusData(result, weekday, "퇴근", "19", dest);
  });
} else if ((hour >= 17 && min >= 45) || hour >= 18) {
  getBusFilter(weekday, "퇴근", "18", dest).then((result) => {
    paintBusData(result, weekday, "퇴근", "18", dest);
  });
} else {
  getBusFilter(weekday, "퇴근", "17", dest).then((result) => {
    paintBusData(result, weekday, "퇴근", "17", dest);
  });
}

