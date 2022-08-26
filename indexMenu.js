import { findMenuOfDate, fetchAllMenu, printMenu } from "./js/menu.js";

const cards = document.querySelector("#cards");
const dropdown = document.querySelector("#dropdown");
const title = document.querySelector("#title");

const date = new Date();

const day = date.getDate();
const hour = date.getHours();
const min = date.getMinutes();
const month = date.getMonth() + 1;
const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

fetchAllMenu().then((x) => {
  title.innerText = `${month}/${day}(${week}) 식단표`;
  const set = new Set([]);
  x.forEach((li) => {
    set.add(li.date);
  });
  const array = [...set];
  array.forEach((i) => {
    const option = document.createElement("option");
    option.innerText = i;
    option.value = i;
    dropdown.appendChild(option);
  });
  const timelist = ["아침", "점심", "저녁"];
  timelist.forEach((time) => {
    findMenuOfDate(month, day, time).then((data) => {
      const article = document.createElement("article");
      article.className = "menu-card";
      article.innerHTML = printMenu(month, day, week, time, data);
      cards.append(article);
    });
  });
});

const handleSelectChange = (e) => {
  cards.innerHTML = "";
  const mm = parseInt(dropdown.value.replace(/\/.*/g, ""));
  const dd = parseInt(dropdown.value.replace(/(.*\/|\(.\))/g, ""));
  const ww = dropdown.value.match(/.(?=\))/)[0];
  title.innerText = `${mm}/${dd}(${ww})  식단표`;
  ["아침", "점심", "저녁"].forEach((time) => {
    findMenuOfDate(mm, dd, time).then((data) => {
      const article = document.createElement("article");
      article.className = "menu-card";
      article.innerHTML = printMenu(mm, dd, ww, time, data);

      cards.append(article);
    });
  });
};

dropdown.addEventListener("input", handleSelectChange);
