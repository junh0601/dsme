import { getWeatherData } from "./weather.js";

const searchForm = document.querySelector("#search-form");
const lastupdate = document.getElementById("lastupdate");
const cards = document.getElementById("cards");
const div = document.createElement("div");
const small = document.createElement("small");

// 온도 측정
getWeatherData({ mode: "lastUpdate" }).then((data) => {
  div.innerHTML = `현재 온도는 <mark>${data[8]}℃</mark>입니다.`;
  small.innerHTML = `${data[0]}시에 마지막 업데이트. 옥포조선소 기준 <a href="http://www.kma.go.kr/cgi-bin/aws/nph-aws_txt_min?0&0&MINDB_01M&294&a">(더보기)</a>`;
  lastupdate.appendChild(div);
  lastupdate.appendChild(small);
  lastupdate.ariaBusy = "false";
});

// 정각 알림
const date = new Date();
console.log(date.getHours());
if (date.getHours() === 12) {
  getWeatherData({ mode: "check", value: "00:00" }).then((data) => {
    console.log(data);
    if (data !== null) {
      const article = document.createElement("article");
      article.style = "order:-1;";
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
      cards.appendChild(article);
    }
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
