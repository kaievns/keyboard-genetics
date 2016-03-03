import Layout, { QWERTY } from "./layout";

export default class Genome {
  static fromLayout(layout) {
    return new this(layout.toString().trim().replace(/\s+/g, ""));
  }

  constructor(sequence) {
    this.sequence = sequence;
  }

  toString() {
    return this.sequence;
  }

  toLayout() {
    const breaks = [13, 13, 12, 10], lines = [];
    const sequence = this.sequence.replace("\\n", "\n");

    for (let i=0,start=0; i < breaks.length; i++) {
      const end  = start + breaks[i];
      const line = sequence.substring(start, end).split("");
      lines.push(line.map(s => s === "\n" ? "\\n" : s));
      start = end;
    }

    const rows = [];
    for (let i=0; i < lines.length; i++) {
      const normal_line  = lines[i];
      const shifted_line = normal_line.map(s => STD_MAPPING[s]);
      rows.push(normal_line.join(" "));
      rows.push(shifted_line.join(" "));
    }

    const config = rows.map((row, i) => i > 0 ? `  ${row}` : row).join("\n");
    const name   = config.slice(0, 8).toUpperCase();
    return new Layout(name, config);
  }
}

const STD_MAPPING = {};

QWERTY.config.trim().split("\n").forEach((line, i, list) => {
  if (i % 2 === 0) {
    const shifted_line = list[i+1].trim().split(/\s+/);
    const normal_line  = list[i].trim().split(/\s+/);

    for (let i=0; i < normal_line.length; i++) {
      STD_MAPPING[normal_line[i]] = shifted_line[i];
    }
  }
});

const genome = Genome.fromLayout(QWERTY);

console.log(genome.toString());
console.log(genome.toLayout().toString());
