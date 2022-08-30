import { busUpdate } from "./js/bus.js";
import { csvParser } from "./js/domParser.js";

const dropdown = document.querySelector("#dropdown");
const innerTable = document.querySelector("#table-content");
const busUpdateMsg = document.querySelector("#bus-update-msg");
const title = document.querySelector("#title");

const busFile = "./src/busTable.csv";

const date = new Date();

const hh = date.getHours();
const mm = date.getMinutes();
const dd = date.getDate();

const handleSelectChange = async () => {
  const week = dropdown.value;
  const data = await fetch(busFile);
  const text = await data.text();
  const csv = csvParser(text);
  let filter = [];
  csv.forEach((row) => {
    //평주,구분,시간,분,출발
    if (row[0] === week) {
      filter.push(row);
    }
  });
  let result;
  filter.forEach((list) => {
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
    result = result + tr;
  });
  result = result.replace("undefined", "");
  innerTable.innerHTML = result;
  title.innerText = `${week} 퇴근 능포행`;
  busUpdateMsg.innerText = `마지막 업데이트일 : ${busUpdate}`;
};

handleSelectChange();
dropdown.addEventListener("input", handleSelectChange);
