/**
 * Configurations and mappings
 *
 * __NOTE__ most of the values are normalized by a key size + key margins
 */

// just a mapping for easier conversions
const COORDINATES = `
~ 1 2 3 4 5 6 7 8 9 0 - =
  q w e r t y u i o p [ ] \
  a s d f g h j k l ; ' \n
  z x c v b n m , . /
l-shift    space    r-shift
`;

const FINGERS_MAP = `
a a b c d d e e f g h h h
  a b c d d e e f g h h h h
  a b c d d e e f g h h h
  a b c d d e e f g h
a         t           h
`

const FINGER_NAMES = {
  a: 'l-pinky',
  b: 'l-ring',
  c: 'l-middle',
  d: 'l-point'
  e: 'r-point',
  f: 'r-middle',
  g: 'r-ring',
  h: 'r-pinky'
  t: 'thumb'
};

// distances a finger must travel, those are measured from a standard keyboard
const DISTANCES = `
28 22 22 22 22 21 28 22 22 22 22 21 25
   11 11 11 11 13 17 11 11 11 11 13 21 25
   00 00 00 00 10 10 00 00 00 00 10 20
   12 12 12 12 19 12 12 12 12 12
12               0               19
`;

// lateral (left/rigth) hand movement distances, adjusted to the finger lengths
// those are measured from a real keyboard and adjusted to RL observations
const LATERALS = `
20 08 06 05 07 01 19 07 05 06 08 03 13
   02 01 01 02 08 13 02 01 01 02 08 18 23
   00 00 00 00 10 10 00 00 00 00 10 20
   06 06 06 06 16 06 06 06 06 06
06               0               16
`;

// dorsal hand movent distances, adjusted to the finger lengths and wrist bends
// those are basically eyeballed, based on my own hand movements. might depend on a hand size
const DORSALS = `
14 13 08 06 10 12 13 11 06 08 16 15 12
   06 02 02 05 07 08 05 02 02 08 07 06 05
   00 00 00 00 00 00 00 00 00 00 00 00
   00 00 00 00 00 00 00 00 00 00
00               0                  00
`;

// // based on a guts feeling basically, i tried to count it the sceweness of a keyboard
// // should be recalculated based on distances, hand movements and finger strengths
// const EFFORTS = `
// 40 35 27 24 31 33 36 33 24 25 35 36 37
//    24 15 15 18 24 26 18 15 15 22 23 25 29
//    12 10 10 10 20 20 10 10 10 12 17 24
//    17 20 18 16 22 20 17 19 21 24
// `;
