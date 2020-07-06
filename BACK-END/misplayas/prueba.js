const {
  getHours,
  parseISO,
  setMinutes,
  setSeconds,
  format,
  formatISO,
} = require("date-fns");

function formatDateToDB(date) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
}

function formatUtc(visit_date, visit_hour) {
  const d = visit_date.split("/");
  const [day, month, year] = d;
  const h = visit_hour.split(":");
  const [hour] = h;

  const visit = new Date(year, month - 1, day, hour, 0);

  const dateString = visit.toISOString();
  //console.log(`dateString: ${dateString}`);
  const splitPointArray = dateString.split(".");
  //console.log(`splitPointArray: ${splitPointArray}`);

  const splitPointArraySlice = splitPointArray.slice(0, 1);

  /*console.log(`splitPointArraySlice: ${splitPointArraySlice}`);
  console.log(`typeof: ${typeof splitPointArraySlice}`);
  console.log(`objectKey: ${Object.keys(splitPointArraySlice)}`);
  console.log(`object[0]: ${splitPointArraySlice[0]}`);*/

  const split = splitPointArraySlice[0].split("T");

  //console.log(split);

  const dateUtcToDB = split.join(" ");
  return dateUtcToDB;
}

console.log(formatDateToDB("2020-07-04T09:00:00.000Z")); // 2020 - 07 - 04 11: 00: 00
console.log(formatUtc("04/07/2020", "9")); // 2020 - 07 - 04 07: 00: 00

console.log(formatUtc("04/07/2020", "9").toISOString); //undefined
console.log(new Date(formatUtc("04/07/2020", "9"))); // 2020 - 07 - 04T05: 00: 00.000Z
console.log(new Date(formatUtc("04/07/2020", "9")).toISOString()); // 2020 - 07 - 04T05: 00: 00.000Z

const dateUtc = formatUtc("04/07/2020", "9");
const dateISO = formatISO(new Date(dateUtc));
console.log(dateISO);
