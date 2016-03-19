import Layout, { QWERTY } from "./layout";

const QWERTY_SEQUENCE = QWERTY.toSequence();
const LOCK_POSITIONS  = {}; `
  \`:\` 1:1 2:2 3:3 4:4 5:5 6:6 7:7 8:8 9:9 0:0 -:- =:=
                                  ;:p [:[ ]:] \\:\\
    s:s                                 ':' \\n:\\n
    z:z x:x c:c v:v                  ,:, .:. /:/
`.trim().split(/\s+/).map(i => {
  const [key, value] = i.split(":");
  const normalize = v => v === "\\n" ? "\n" : v;

  LOCK_POSITIONS[normalize(key)] = QWERTY_SEQUENCE.indexOf(normalize(value));
});

export default class Genome {
  static random() {
    const base = [];
    for (let key in LOCK_POSITIONS) {
      base[LOCK_POSITIONS[key]] = key;
    }
    for (var i=0,p=0; i < QWERTY_SEQUENCE.length; i++) {
      const symbol = QWERTY_SEQUENCE[i];
      if (base.indexOf(symbol) === -1) {
        for (let j=0; j < base.length; j++) {
          if (base[j] === undefined) {
            base[j] = symbol;
            break;
          }
        }
      }
    }
    return new Genome(base.join("")).mutate(20);
  }

  static fromLayout(layout) {
    return new this(layout.toSequence());
  }

  constructor(sequence) {
    this.sequence = sequence;
  }

  merge(another_genome) {
    const mom   = this.sequence;
    const dad   = another_genome.sequence;
    const slice = mom.length / 2 | 0;
    const blank = mom.split("").map((s, i)=> dad[i] === s ? s : "Ф").join("");

    let child1  = blank.substr(0, slice) + mom.substr(slice);
    let child2  = mom.substr(0, slice) + blank.substr(slice);

    for (let i=0; i < dad.length; i++) {
      const symbol = dad[i];

      if (child1.indexOf(symbol) === -1) {
        child1 = child1.replace("Ф", symbol);
      }

      if (child2.indexOf(symbol) === -1) {
        child2 = child2.replace("Ф", symbol);
      }
    }

    return [ new Genome(child1), new Genome(child2) ];
  }

  mutate(times) {
    const placeholder1 = "НИКОЛАЙ";
    const placeholder2 = "НЕБАЛУЙ";
    let   new_sequence = this.sequence;

    for (let i=0,end=times||1; i < end; i++) {
      let first  = this.randKey();
      let second = first;
      let tmp_sequence;

      while (second === first) {
        second = this.randKey();

        tmp_sequence = new_sequence
          .replace(first, placeholder1)
          .replace(second, placeholder2)
          .replace(placeholder1, second)
          .replace(placeholder2, first);
      }

      new_sequence = tmp_sequence;
    }

    return new Genome(new_sequence);
  }

  randKey() {
    let key;

    do {
      key = this.sequence[Math.random() * this.sequence.length | 0];
    } while (LOCK_POSITIONS.hasOwnProperty(key));

    return key;
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
    const name   = rows[2].replace(/\s+/g, "").substr(0, 10).toUpperCase();
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

// const g = Genome.fromLayout(QWERTY);
// console.log(JSON.stringify(g.sequence));
// console.log(JSON.stringify(g.mutate(1).sequence));
