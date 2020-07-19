/*const {
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
  console.log(visit);
  const dateString = visit.toISOString();
  console.log(`dateString: ${dateString}`);
  const splitPointArray = dateString.split(".");
  //console.log(`splitPointArray: ${splitPointArray}`);

  const splitPointArraySlice = splitPointArray.slice(0, 1);

  console.log(`splitPointArraySlice: ${splitPointArraySlice}`);
  console.log(`typeof: ${typeof splitPointArraySlice}`);
  console.log(`objectKey: ${Object.keys(splitPointArraySlice)}`);
  console.log(`object[0]: ${splitPointArraySlice[0]}`);

  const split = splitPointArraySlice[0].split("T");

  //console.log(split);

  const dateUtcToDB = split.join(" ");

  return { dateString, dateUtcToDB };
}

//console.log(formatDateToDB("2020-07-04T09:00:00.000Z")); // 2020 - 07 - 04 11: 00: 00
//console.log(("2020-07-04T09:00:00.000Z")); // 2020 - 07 - 04 11: 00: 00
//console.log(formatUtc("04/07/2020", "9")); // 2020 - 07 - 04 07: 00: 00

//console.log(formatUtc("04/07/2020", "9")function replace(value) {
  if (value === "Sí") {
    return true;
  } else {
    return false;
  }
}

console.log(replace("Sí"));.toISOString); //undefined
//console.log(new Date(formatUtc("04/07/2020", "9"))); // 2020 - 07 - 04T05: 00: 00.000Z
//console.log(new Date(formatUtc("04/07/2020", "9")).toISOString()); // 2020 - 07 - 04T05: 00: 00.000Z

//const dateUtc = formatUtc("04/07/2020", "9");
//const dateISO = new Date(dateUtc);
//console.log(dateISO);

//console.log(new Date());

//console.log(new Date(Date.UTC(96, 11, 1, 0, 0, 0)));

const visitData = formatUtc("04/07/2020", "9"); //esta función me da la fecha ut
const visitISO = new Date(visitData.dateString);

const startTime = "9";
const endTime = "21";
const startSeason = { day: 15, month: 6 };
const endSeason = { day: 30, month: 9 };
const currentYear = new Date().getFullYear();
console.log(currentYear);

console.log(
  new Date(
    currentYear,
    startSeason.month - 1,
    startSeason.day,
    startTime,
    0,
    0,
    0
  ).toISOString()
);

console.log(new Date(96, 11, 1, 0, 0, 0).toISOString())*/
//KKKKKK, lo estaba haciendo mal, la fecha que meto en postman ya es la que se recibe del cliente pasada a UTC

/*const { format, addMinutes } = require("date-fns");

function formatDateToDB(date) {
  let internal_date;

  if (typeof date === "string") {
    internal_date = new Date(date);
  } else {
    internal_date = date;
  }

  const adjusted_date = addMinutes(
    internal_date,
    internal_date.getTimezoneOffset()
  );

  return format(adjusted_date, "yyyy-MM-dd HH:mm:ss");
}

const fecha_recibida = new Date("2020-07-08T10:42:00.000Z");
const fecha_final = addMinutes(fecha_recibida, 30);

console.log(formatDateToDB(fecha_recibida));
console.log(formatDateToDB(fecha_final));

let numeros = [2, 7, 75, 8, 1, 9, 4, 7];

for (let i = 0; i <= numeros.length; i++) {
  if (Number(numeros[i]) > 6) {
    numeros.splice(i, 1);
  }
}
//Anterior:
 /* for (let index = 0; index < beaches; index++) {
        const playas = ["Barrañán", "Pedra do Sal", "Caión", "Baldaio", "Ares"];
        const municipios = [
          "Carballo",
          "Carballo",
          "A Laracha",
          "Arteixo",
          "Ares",
        ];
        const name = playas[index];
        const municipality = municipios[index];
        const type = ["urban", "not urban", "isolated"];
        const typeBeach = sample(type);
        const truefalse = sample([1, 0]); //no funciona ninguno de los 2 métodos con true/false, dice que tengo que meter INT
        /*const boole = (number) => { //pero si meto yo directamente en values true o false si me lo acepta¿?
          number = Math.random();
          if (number < 0.5) {
            return true;
          }
          {
            return false;
          }
        }; */

const faker = require("faker/locale/es");
for (let i = 1; i < 11; i++) {
  console.log(faker.date.recent(5));
}

//login admin: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTk1MTY2MjExLCJleHAiOjE1OTc3NTgyMTF9.vC2U225lhzoPgsxFTT6EVlTBS2CHM_MtPXx8weXpKNs
//login rcanosa1@gmail.com: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE1OTUxNzA3MTYsImV4cCI6MTU5Nzc2MjcxNn0.3Rxoj3Z3rHx7VpFbwjRI9QK8oyvPde--x2l2Y_EStq0

