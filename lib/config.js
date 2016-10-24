/**
 * Configurations and mappings
 *
 * __NOTE__ all of the values are normalized by a 1/10th of a key size
 */

// just a mapping for easier conversions
const COORDINATES = parseMapping(`
 ~ 1 2 3 4 5 6 7 8 9 0 - =
   q w e r t y u i o p [ ] \\
   a s d f g h j k l ; ' \\n
    z x c v b n m , . /
 l-shift    space    r-shift
`);

// distances a finger must travel, those are measured from a standard keyboard
exports.DISTANCES = buildMapping(`
  28 22 22 22 22 21 28 22 22 22 22 21 25
     11 11 11 11 13 17 11 11 11 11 13 21 25
     00 00 00 00 10 10 00 00 00 00 10 20
       12 12 12 12 19 12 12 12 12 12
  12               0               19
`);

// the hand movement efforts, based on real-life measurements, see MadRabbit/keyboard-analytics
exports.EFFORTS = buildMapping(`
  17 14 08 08 13 16 23 19 09 08 07 15 17
     06 02 01 06 11 14 09 01 01 07 09 13 18
     00 00 00 00 07 07 00 00 00 00 05 11
       07 08 10 06 10 04 02 05 05 03
  05               00                 11
`);

// mapping of the row numbers, so we could count those too
exports.ROWS = buildMapping(`
  4 4 4 4 4 4 4 4 4 4 4 4 4
    3 3 3 3 3 3 3 3 3 3 3 3 3
    2 2 2 2 2 2 2 2 2 2 2 2
     1 1 1 1 1 1 1 1 1 1
  0           0           0
`);

exports.FINGERS = buildMapping(`
  a a b c d d e e f g h h h
    a b c d d e e f g h h h h
    a b c d d e e f g h h h
     a b c d d e e f g h
  a          t           h
`);

const FINGER_NAMES = {
  a: 'l-pinky', b: 'l-ring', c: 'l-middle', d: 'l-point',
  h: 'r-pinky', g: 'r-ring', f: 'r-middle', e: 'r-point',
  t: 'thumb'
};

for (const key in exports.FINGERS) {
  exports.FINGERS[key] = FINGER_NAMES[exports.FINGERS[key]];
}

// parses a map into key-index -> letter thing
function parseMapping(string) {
  return string.trim().split("\n").reduce((mapping, line) => {
    const reps = { "\\n" : "\n", "space": " " };
    line.trim().split(/\s+/).forEach(symbol =>
      mapping.push(reps[symbol] || symbol)
    );
    return mapping;
  }, []);
};

// creates a letter -> value mapping
function buildMapping(string) {
  return parseMapping(string).reduce((mapping, value, i) =>
    Object.assign(mapping, { [COORDINATES[i]] :
      /^\d+$/.test(value) ? parseInt(value) : value
    })
  , {});
};

// parses the layout and creates symbol -> querty letter mapping
exports.parseLayout = string => {
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
    finger:   'thumb',
    shift:    false,
    hand:     false
  });

  keys["\t"] = Object.assign(Object.create(null), {
    name:     "\t",
    effort:   0,
    distance: 0,
    finger:   'thumb',
    shift:    false,
    hand:     false
  });

  return keys;
}
