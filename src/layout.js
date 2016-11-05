const { DISTANCES, EFFORTS, FINGERS, ROWS } = require("./config");

module.exports = class Layout {
  constructor(name, config) {
    this.name   = name;
    this.config = config;
  }

  toString() {
    return this.config.trim().split("\n").map((line, i) => {
      const prefix = {2: "  ", 4: "  ", 6: "   "}[i] || "";
      return i % 2 === 0 ? prefix+line.trim()+"\n" : "";
    }).join("").trim();
  }

  // clean sequence in order of appearance
  toSequence() {
    return this.toString().trim().replace(/\s+/g, "").replace("\\n", "\n");
  }

  toMetrics() {
    return parse(this.config);
  }
};

// parses the layout and creates symbol -> querty letter mapping
function parse(string) {
  const keynames = Object.keys(DISTANCES);
  const lines = string.trim().split("\n").map(l => l.trim().split(/\s+/));
  const keys  = flat();

  for (let i=0; i < lines.length / 2; i++) {
    const normal_line  = lines[i * 2];
    const shifted_line = lines[i * 2 + 1];

    for (let j=0; j < normal_line.length; j++) {
      const name = keynames.shift();
      const key = {
        effort:   EFFORTS[name],
        distance: DISTANCES[name],
        finger:   FINGERS[name],
        hand:     FINGERS[name][0],
        row:      ROWS[name]
      };

      keys[normal_line[j]]  = flat(key, {shift: false});
      keys[shifted_line[j]] = flat(key, {shift: true});
    }
  }

  keys[' '] = flat({
    effort:   0,
    distance: 0,
    finger:   'thumb',
    shift:    false,
    hand:     false,
    row:      0
  });

  keys["\t"] = flat({
    effort:   0,
    distance: 0,
    finger:   'thumb',
    shift:    false,
    hand:     false,
    row:      0
  });

  keys['l-shift'] = flat({
    effort: EFFORTS['l-shift'],
    distance: DISTANCES['l-shift'],
    finger: FINGERS['l-shift'],
    shift: false,
    hand: false,
    row: 0
  });

  keys['r-shift'] = flat({
    effort: EFFORTS['r-shift'],
    distance: DISTANCES['r-shift'],
    finger: FINGERS['r-shift'],
    shift: false,
    hand: false,
    row: 0
  });

  return keys;
}

// creates a flat (no prototype inheritance object)
function flat(...data) {
  return Object.assign(Object.create(null), ...data);
}
