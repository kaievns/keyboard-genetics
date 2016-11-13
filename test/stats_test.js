const Stats = require('../src/stats');

const qwertyResult = {
  position:  407,
  distance:  3285,
  effort:    2004,
  overheads: { sameHand: 244, sameFinger: 290, shifting: 125 },
  counts:    {
    'l-pinky':  [ 0, 0, 35, 0 ],
    'l-ring':   [ 0, 1, 23, 6 ],
    'l-middle': [ 0, 7, 9, 43 ],
    'l-point':  [ 0, 9, 15, 57 ],
    'r-pinky':  [ 0, 0, 9, 14 ],
    'r-ring':   [ 0, 3, 12, 16 ],
    'r-middle': [ 0, 7, 1, 28 ],
    'r-point':  [ 0, 26, 12, 10 ]
  }
};

const colemakResult = {
  position:  744,
  distance:  3124,
  effort:    2000,
  overheads: { sameHand: 300, sameFinger: 10, shifting: 189 },
  counts:    {
    'l-pinky':  [ 0, 0, 68, 0 ],
    'l-ring':   [ 0, 3, 46, 9 ],
    'l-middle': [ 0, 16, 41, 12 ],
    'l-point':  [ 0, 18, 70, 40 ],
    'r-pinky':  [ 0, 0, 47, 0 ],
    'r-ring':   [ 0, 8, 51, 9 ],
    'r-middle': [ 0, 12, 74, 7 ],
    'r-point':  [ 0, 15, 56, 24 ]
  }
};

const workmanResult = {
  position:  833,
  distance:  3697,
  effort:    2001,
  overheads: { sameHand: 228, sameFinger: 255, shifting: 204 },
  counts:    {
    'l-pinky':  [ 0, 0, 76, 0 ],
    'l-ring':   [ 0, 3, 48, 19 ],
    'l-middle': [ 0, 16, 28, 49 ],
    'l-point':  [ 0, 26, 82, 20 ],
    'r-pinky':  [ 0, 0, 71, 0 ],
    'r-ring':   [ 0, 8, 35, 26 ],
    'r-middle': [ 0, 14, 88, 8 ],
    'r-point':  [ 0, 30, 43, 12 ]
  }
};

describe('Stats', () => {
  const qwerty = new Stats(qwertyResult);
  const colemak = new Stats(colemakResult);
  const workman = new Stats(workmanResult);

  it('calculates the total overheads', () => {
    expect(qwerty.overheads).to.eql(659);
    expect(colemak.overheads).to.eql(499);
    expect(workman.overheads).to.eql(687);
  });

  it('calculates fingers usage', () => {
    expect(qwerty.fingersUsage).to.eql([ 10, 9, 17, 24, 14, 10, 9, 7 ]);
    expect(colemak.fingersUsage).to.eql([ 11, 9, 11, 20, 15, 15, 11, 8 ]);
    expect(workman.fingersUsage).to.eql([ 11, 10, 13, 18, 12, 16, 10, 10 ]);
  });

  it('calculates hands usage', () => {
    expect(qwerty.handsUsage).to.eql([ 60, 40 ]);
    expect(colemak.handsUsage).to.eql([ 52, 48 ]);
    expect(workman.handsUsage).to.eql([ 52, 48 ]);
  });

  it('calculates the rows usage', () => {
    expect(qwerty.rowsUsage).to.eql([ 0, 15, 34, 51 ]);
    expect(colemak.rowsUsage).to.eql([ 0, 12, 72, 16 ]);
    expect(workman.rowsUsage).to.eql([ 0, 14, 67, 19 ]);
  });

  it('calculates the overall usage symmetry', () => {
    expect(qwerty.symmetry).to.eql(55);
    expect(colemak.symmetry).to.eql(76);
    expect(workman.symmetry).to.eql(68);
  });

  it('calculates fingers load evenness', () => {
    expect(qwerty.evenness).to.eql(77);
    expect(colemak.evenness).to.eql(82);
    expect(workman.evenness).to.eql(87);
  });

  it('calculates the total score', () => {
    expect(qwerty.score).to.eql(515);
    expect(colemak.score).to.eql(979);
    expect(workman.score).to.eql(1091);
  });
});
