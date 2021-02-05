const fs = require("fs");

function generateRandomString(
  num,
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) {
  let text = "";
  for (let i = 0; i < num; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getIndices(str, char) {
  const startingCommas = [];
  const closingCommas = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      if (startingCommas.length === closingCommas.length) {
        startingCommas.push(i);
      } else {
        closingCommas.push(i + 1);
      }
    }
  }
  return { startingCommas, closingCommas };
}

class Csv {
  constructor(str) {
    this.rawData = str;
    if (fs.existsSync(str)) {
      this.rawData = fs.readFileSync(str, "utf-8");
    }
  }
  async toArray() {
    const { startingCommas, closingCommas } = getIndices(this.rawData, '"');
    const enclosedStrings = [];
    let data = this.rawData;

    for (let i = 0; i < startingCommas.length; i++) {
      let item = this.rawData.substring(startingCommas[i], closingCommas[i]);
      let key = "replaceme-" + generateRandomString(6);
      enclosedStrings.push({
        item,
        key,
      });

      data = data.replace(item, key);
    }
    let doneArray = data.split("\n").map((r) =>
      r.split(",").map((c) => {
        if (c.includes("replaceme-")) {
          return enclosedStrings.find((s) => s.key === c).item;
        } else {
          return c;
        }
      })
    );
    this.array = doneArray;
    return doneArray;
  }
  async toObject({ headerLine = 0, dataStart = 1 } = {}) {
    if (!this.array) {
      await this.toArray();
    }

    let object = [];
    for (let i = dataStart; i < this.array.length; i++) {
      let line = this.array[i];
      let lineObject = {};
      for (let x = 0; x < line.length; x++) {
        let cell = line[x];
        let header = this.array[headerLine][x];
        lineObject[header] = cell !== "" ? cell : undefined;
      }
      object.push(lineObject);
    }

    this.object = object;
  }
}

module.exports = Csv;
