const menuFile = "./src/menu.json";

export const fetchAllMenu = async () => {
  const data = await fetch(menuFile);
  const json = await data.json();
  return json;
};

//메뉴찾기
export const findMenuOfDate = async (month, date, time) => {
  const data = await fetch(menuFile);
  const json = await data.json();
  let result;
  json.forEach((list) => {
    const mm = parseInt(list.date.replace(/\/.*/g, ""));
    const dd = parseInt(list.date.replace(/(.*\/|\(.\))/g, ""));
    if (month === mm && date === dd && time === list.time) {
      result = list.menu;
    }
  });
  return result;
};

//메뉴 텍스트로 출력 (식사단위)
export const printMenu = (m, d, w, time, data) => {
  let text = `<header><i class="fa-solid fa-utensils"></i> ${m}/${d}(${w}) ${time} 식단</a></header>
  <figure class="grid"><table><tr>`;
  let entireMenu = "";
  for (const key in data) {
    let m = "";
    data[key].forEach((x) => {
      m += `<li>${x}</li>`;
    });
    const oneMenu = `
    <td>
          <h6>😋 ${key}</h6>
          <ul>
            ${m}
          </ul>
        </td>`;
    entireMenu += oneMenu;
  }

  return (text = text + entireMenu + "</tr></table></figure><div><i class='fa-solid fa-angles-left'></i><i class='fa-solid fa-angles-right'></i></div>");
};
