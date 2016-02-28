/**
 * Configurations and mappings
 *
 * __NOTE__ most of the values are normalized by a key size + key margins
 */

// just a mapping for easier conversions
export const COORDINATES = parseMapping(`
~ 1 2 3 4 5 6 7 8 9 0 - =
  q w e r t y u i o p [ ] \\
  a s d f g h j k l ; ' \\n
  z x c v b n m , . /
l-shift    space    r-shift
`);

// distances a finger must travel, those are measured from a standard keyboard
export const DISTANCES = buildMapping(`
28 22 22 22 22 21 28 22 22 22 22 21 25
   11 11 11 11 13 17 11 11 11 11 13 21 25
   00 00 00 00 10 10 00 00 00 00 10 20
   12 12 12 12 19 12 12 12 12 12
12               0               19
`);

// lateral (left/rigth) hand movement distances, adjusted to the finger lengths
// those are measured from a real keyboard and adjusted to RL observations
export const LATERALS = buildMapping(`
20 08 06 05 07 01 19 07 05 06 08 03 13
   02 01 01 02 08 13 02 01 01 02 08 18 23
   00 00 00 00 10 10 00 00 00 00 10 20
   06 06 06 06 16 06 06 06 06 06
06               0               16
`);

const right_shifted_letters = "[]\\-=".split("");
for (let key in LATERALS) {

  if (right_shifted_letters.indexOf(key) !== -1) { continue; }
  if (key === 'a') { break; }
  LATERALS[key] *= -1;
}

// dorsal hand movent distances, adjusted to the finger lengths and wrist bends
// those are basically eyeballed, based on my own hand movements. might depend on a hand size
export const DORSALS = buildMapping(`
14 13 08 06 10 12 13 11 06 08 16 15 12
   06 02 02 05 07 08 05 02 02 08 07 06 05
   00 00 00 00 00 00 00 00 00 00 00 00
   00 00 00 00 00 00 00 00 00 00
00               0                  00
`);

export const FINGERS = buildMapping(`
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

const FINGER_STRENGS = {
  a: 0.8, b: 0.9, c: 1.0, d: 0.9,
  h: 0.8, g: 0.9, f: 1.0, e: 0.9,
  t: 1.0
};

export const EFFORTS = {};
for (let key in FINGERS) {
  const total = DISTANCES[key] + Math.abs(LATERALS[key]) + DORSALS[key];
  EFFORTS[key] = Math.round((total ? total : 10) / FINGER_STRENGS[FINGERS[key]]);
}

for (let key in FINGERS) {
  FINGERS[key] = FINGER_NAMES[FINGERS[key]];
}

// the efforts map will look somewhat like this

// 78 54 40 33 43 38 67 44 33 40 58 49 63
//    24 16 14 20 31 42 20 14 16 26 35 56 66
//    13 11 10 11 22 22 11 10 11 13 25 50
//    23 20 18 20 39 20 20 18 20 23
// 23              10               44

// keys that yield a return to position overhead
export const REACH_KEYS = `
~ 1 2 3 4 5 6 7 8 9 0 - =
          t y         [ ] \\
          g h         ' \\n
          b n
l-shift               r-shift
`.trim().split(/\s+/).map(s => s === "\\n" ? "\n" : s);


// parses a map into key-id -> letter thing
export function parseMapping(string) {
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
export function buildMapping(string) {
  const weights = parseMapping(string);
  const mapping = {};

  for (let id in COORDINATES) {
    const weight = weights[id] || COORDINATES[i];
    mapping[COORDINATES[id]] = /^\d+$/.test(weight) ? parseInt(weight) : weight;
  }

  return mapping;
}

// parses the layout and creates symbol -> querty letter mapping
export function parseLayout(string) {
  const lines   = string.trim().split("\n").map(l => l.trim().split(/\s+/));
  const mapping = {};

  for (let i=0,n=1; i < lines.length / 2; i++) {
    let normal_line  = lines[i * 2];
    let shifted_line = lines[i * 2 + 1];

    for (let j=0; j < normal_line.length; j++) {
      mapping[normal_line[j]]  = new String(COORDINATES[n]);
      mapping[shifted_line[j]] = new String(COORDINATES[n++]);
      mapping[shifted_line[j]].shift = true;
    }
  }

  return mapping;
}
