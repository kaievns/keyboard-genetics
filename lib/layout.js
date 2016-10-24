const { parseLayout } = require("./config");

module.exports = class Layout {
  constructor(name, config) {
    this.name   = name;
    this.config = config;
    this.keys   = parseLayout(config);
  }

  toString() {
    return this.config.trim().split("\n").map((line, i) => {
      const prefix = {2: "  ", 4: "  ", 6: "   "}[i] || "";
      return i % 2 === 0 ? prefix+line.trim()+"\n" : "";
    }).join("");
  }

  // clean sequence in order of appearance
  toSequence() {
    return this.toString().trim().replace(/\s+/g, "").replace("\\n", "\n");
  }
};
