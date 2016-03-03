import Layout, { QWERTY } from "./layout";

const DONT_MUTATE_LIST = "`1234567890-=[]\\'\nszxcv,./".split("");

export default class Genome {
  static fromLayout(layout) {
    return new this(
      layout.toString().trim()
        .replace(/\s+/g, "")
        .replace("\\n", "\n")
      );
  }

  constructor(sequence) {
    this.sequence = sequence;
  }

  merge(another_genome) {
    const mom   = this.sequence;
    const dad   = another_genome.sequence;
    const split = mom.length / 2 | 0;

    return [
      new Genome(mom.substr(0, split) + dad.substr(split)),
      new Genome(dad.substr(0, split) + mom.substr(split))
    ];
  }

  mutate(times) {
    const placeholder1 = "НИКОЛАЙ";
    const placeholder2 = "НЕБАЛУЙ";
    let   new_sequence = this.sequence;

    for (let i=0,end=times||1; i < end; i++) {
      let first  = this.randKey();
      let second = first;

      while (second === first) {
        second = this.randKey();
      }

      new_sequence = new_sequence
        .replace(first, placeholder1)
        .replace(second, placeholder2)
        .replace(placeholder1, second)
        .replace(placeholder2, first);
    }

    return new Genome(new_sequence);
  }

  randKey() {
    let i = 0;

    while (DONT_MUTATE_LIST.indexOf(this.sequence[i]) !== -1) {
      i = Math.random() * this.sequence.length | 0;
    }

    return this.sequence[i];
  }

  toString() {
    return this.sequence;
  }

  toLayout() {
    const breaks = [13, 13, 12, 10], lines = [];

    for (let i=0,start=0; i < breaks.length; i++) {
      const end  = start + breaks[i];
      const line = this.sequence.substring(start, end).split("");
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
