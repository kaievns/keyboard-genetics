/**
 * Configurations and mappings
 *
 * __NOTE__ most of the values are normalized by a key size + key margins
 */

// just a mapping for easier conversions
const COORDINATES = exports.COORDINATES = parseMapping(`
~ 1 2 3 4 5 6 7 8 9 0 - =
  q w e r t y u i o p [ ] \\
  a s d f g h j k l ; ' \\n
  z x c v b n m , . /
l-shift    space    r-shift
`);

// distances a finger must travel, those are measured from a standard keyboard
const DISTANCES = exports.DISTANCES = buildMapping(`
28 22 22 22 22 21 28 22 22 22 22 21 25
   11 11 11 11 13 17 11 11 11 11 13 21 25
   00 00 00 00 10 10 00 00 00 00 10 20
   12 12 12 12 19 12 12 12 12 12
12               0               19
`);

// lateral (left/rigth) hand movement distances, adjusted to the finger lengths
// those are measured from a real keyboard and adjusted to RL observations
const LATERALS = exports.LATERALS = buildMapping(`
12 04 02 01 02 04 12 06 03 03 02 01 09
   02 01 00 01 03 06 01 00 01 02 06 11 23
   00 00 00 00 08 08 00 00 00 00 07 15
   02 01 00 02 08 03 02 03 05 04
03               0               10
`);

// dorsal hand movent distances, adjusted to the finger lengths and wrist bends
// those are basically eyeballed, based on my own hand movements. might depend on a hand size
const DORSALS = exports.DORSALS = buildMapping(`
12 10 07 05 08 09 12 08 05 07 11 10 14
   06 02 01 05 07 08 05 01 02 06 07 08 12
   00 00 00 00 00 00 00 00 00 00 02 03
   03 04 06 04 05 05 03 06 04 03
02               0                  02
`);

const FINGERS = exports.FINGERS = buildMapping(`
a a b c d d e e f g h h h
  a b c d d e e f g h h h h
  a b c d d e e f g h h h
  a b c d d e e f g h
a         t           h
`);

const FINGER_NAMES = {
  a: 'l-pinky', b: 'l-ring', c: 'l-middle', d: 'l-point',
  h: 'r-pinky', g: 'r-ring', f: 'r-middle', e: 'r-point',
  t: 'thumb'
};

const FINGER_STRENGS = exports.FINGER_STRENGS = {
  a: 0.75, b: 0.9, c: 1.0, d: 0.95,
  h: 0.75, g: 0.9, f: 1.0, e: 0.95,
  t: 1.0
};

const EFFORTS = exports.EFFORTS = {};
for (let key in FINGERS) {
  const total = DISTANCES[key] + Math.pow(LATERALS[key] + DORSALS[key], 2) / 5;
  EFFORTS[key] = Math.round((total ? total : 10) / FINGER_STRENGS[FINGERS[key]]);
}

for (let key in FINGERS) {
  FINGERS[key] = FINGER_NAMES[FINGERS[key]];
}

// the efforts map will look somewhat like this
let efforts = `
~ 1 2 3 4 5 6 7 8 9 0 - =
  q w e r t y u i o p [ ] \\
  a s d f g h j k l ; ' \\n
  z x c v b n m , . /
l-shift    space    r-shift
`;
let output = '', match;
while (match = efforts.match(/^(\s+)([^\s]+)/)) {
  output += match[1] + EFFORTS[match[2]];
  efforts = efforts.replace(match[0], '');
}

// console.log(output);
// process.exit(0);

// 78 54 40 33 43 38 67 44 33 40 58 49 63
//    24 16 14 20 31 42 20 14 16 26 35 56 66
//    13 11 10 11 22 22 11 10 11 13 25 50
//    23 20 18 20 39 20 20 18 20 23
// 23              10               44

// keys that yield a return to position overhead
const REACH_KEYS = exports.REACH_KEYS = `
~ 1 2 3 4 5 6 7 8 9 0 - =
          t y         [ ] \\
          g h         ' \\n
          b n
l-shift               r-shift
`.trim().split(/\s+/).map(s => s === "\\n" ? "\n" : s);


// parses a map into key-id -> letter thing
exports.parseMapping = parseMapping;
function parseMapping(string) {
  const lines   = string.trim().split("\n").map(l => l.trim().split(/\s+/));
  const mapping = {};

  for (let i=0,n=1; i < lines.length; i++) {
    for (let j=0; j < lines[i].length; j++) {
      const symbol = lines[i][j];
      mapping[n++] = symbol === "\\n" ? "\n" : symbol === "space" ? " " : symbol;
    }
  }

  return mapping;
}

// creates a letter -> number mapping
exports.buildMapping = buildMapping;
function buildMapping(string) {
  const weights = parseMapping(string);
  const mapping = {};

  for (let id in COORDINATES) {
    const weight = weights[id] || COORDINATES[i];
    mapping[COORDINATES[id]] = /^\d+$/.test(weight) ? parseInt(weight) : weight;
  }

  return mapping;
}

// parses the layout and creates symbol -> querty letter mapping
exports.parseLayout = parseLayout;
function parseLayout(string) {
  const lines = string.trim().split("\n").map(l => l.trim().split(/\s+/));
  const keys  = Object.create(null);

  for (let i=0,n=1; i < lines.length / 2; i++) {
    const normal_line  = lines[i * 2];
    const shifted_line = lines[i * 2 + 1];

    for (let j=0; j < normal_line.length; j++) {
      const name = COORDINATES[n];
      const key = {
        name:     name,
        effort:   EFFORTS[name],
        distance: DISTANCES[name],
        reach:    REACH_KEYS.indexOf(name) !== -1,
        finger:   FINGERS[name],
        hand:     FINGERS[name][0]
      };

      keys[normal_line[j]]  = Object.assign(Object.create(null), key, {shift: false});
      keys[shifted_line[j]] = Object.assign(Object.create(null), key, {shift: true});

      n++;
    }
  }

  keys[' '] = Object.assign(Object.create(null), {
    name:     ' ',
    effort:   0,
    distance: 0,
    reach:    false,
    finger:   'thumb',
    shift:    false,
    hand:     false
  });

  keys["\t"] = Object.assign(Object.create(null), {
    name:     "\t",
    effort:   0,
    distance: 0,
    reach:    false,
    finger:   'thumb',
    shift:    false,
    hand:     false
  });

  return keys;
}
