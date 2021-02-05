const Csv = require("./index.js");

async function main() {
  let csv = new Csv("./2017 UKPGE electoral data 3.csv");
  //   let csv = new Csv("./simple.csv");

  //   console.log(csv.rawData);
  await csv.toArray();
  await csv.toObject({ headerLine: 2, dataStart: 3 });
  console.log(csv);
}
main().catch(console.log);
