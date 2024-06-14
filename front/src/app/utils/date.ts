import dayjs from "dayjs";

export const formattedTime = (time: Date) => {
  return dayjs(time).format("HH[h]mm");
};

export const formattedDate = (day: Date) => {
  return dayjs(day).locale("fr").format("dddd D MMMM");
};
