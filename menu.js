export const findMenuOfDate = async (month, date, time) => {
  const data = await fetch("./src/menu.json");
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

export const printMenu = (m, d, time, data) => {
  let text = `<header><i class="fa-solid fa-utensils"></i> ${m}/${d} ${time} 식단</header><figure class="grid"><table><tr>`;
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

  return (text = text + entireMenu + "</tr></table></figure>");
};
