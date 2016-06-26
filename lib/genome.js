"use strict";
const Layout      = require("./layout");
const { FINGERS } = require("./config");
const { QWERTYER }  = Layout;
const QWERTY = QWERTYER

const QWERTY_SEQUENCE = QWERTY.toSequence();
const LOCK_POSITIONS  = {}; `
  \`:\` 1:1 2:2 3:3 4:4 5:5 6:6 7:7 8:8 9:9 0:0 -:- =:=
  q:q l:w r:e    z:t ;:y  g:u u:i d:o     [:[ ]:] \\:\\
  s:a h:s n:d t:f ,:g .:h a:j e:k o:l i:; ':' \\n:\\n
                     ?:b 
`.trim().split(/\s+/).map(i => {
  const [key, value] = i.split(":");
  const normalize = v => v === "\\n" ? "\n" : v;

  LOCK_POSITIONS[normalize(key)] = QWERTY_SEQUENCE.indexOf(normalize(value));
});

// symbols that must be under the same hand
const SAME_HANDS = [
  ["t", "h"]
];

const GENOFOND = [];

class Genome {
  static resetGenofond() {
    GENOFOND.splice(0, GENOFOND.length);
  }

  static random() {
    const base = [];

    // placing the locked symbols in positions
    for (let key in LOCK_POSITIONS) {
      base[LOCK_POSITIONS[key]] = key;
    }

    // adding the same-hand letters
    for (let i=0; i < SAME_HANDS.length; i++) {
      for (let j=0; j < SAME_HANDS[i].length; j++) {
        for (let k=0; k < base.length; k++) {
          const symbol = SAME_HANDS[i][j];
          if (base[k] === undefined && LOCK_POSITIONS[symbol] === undefined) {
            base[k] = symbol;
            break;
          }
        }
      }
    }

    // filling in the rest of symobls
    for (var i=0; i < QWERTY_SEQUENCE.length; i++) {
      const symbol = QWERTY_SEQUENCE[i];
      if (base.indexOf(symbol) === -1) {
        for (let j=0; j < base.length; j++) {
          if (base[j] === undefined) {
            base[j] = symbol;
            break;
          } else if (j === base.length-1) {
            base.push(symbol);
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
    const max_tries    = 200;
    let   tries_so_far = 0;
    let   new_sequence = this.sequence;

    do {
      new_sequence = this.sequence;

      for (let i=0,end=times||1; i < end; i++) {
        let first  = this.randKey();
        let second = first;
        let tmp_sequence;

        while (second === first) {
          second = this.randKey();
        }

        tmp_sequence = new_sequence
          .replace(first, placeholder1)
          .replace(second, placeholder2)
          .replace(placeholder1, second)
          .replace(placeholder2, first);

        new_sequence = tmp_sequence;
      }

      if (++tries_so_far > max_tries) {
        // considering that we have used up all the combinations
        // in this branch, falling back to the existing sequence
        new_sequence = this.sequence;
        break;
      }
    } while (this.conditionsUnmet(new_sequence));

    GENOFOND.push(new_sequence);

    return new Genome(new_sequence);
  }

  randKey() {
    let key;

    do {
      key = this.sequence[Math.random() * this.sequence.length | 0];
    } while (LOCK_POSITIONS.hasOwnProperty(key));

    return key;
  }

  conditionsUnmet(sequence) {
    if (GENOFOND.indexOf(sequence) !== -1) {
      return true; // already tried
    }

    const hand_name = s => FINGERS[QWERTY_SEQUENCE[sequence.indexOf(s)]][0];

    for (let i=0; i < SAME_HANDS.length; i++) {
      let current_hand = hand_name(SAME_HANDS[i][0]);

      for (let j=1; j < SAME_HANDS[i].length; j++) {
        if (current_hand !== hand_name(SAME_HANDS[i][j])) {
          return true; // a sequence is in different hands
        }
      }
    }
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

module.exports = Genome;
