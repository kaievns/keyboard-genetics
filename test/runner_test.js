const Runner = require('../src/runner');
const { QWERTY, Dvorak, Colemak, Workman } = require('../src/presets');
const text = global.TEXT_FIXTUE;

describe('Runner', () => {
  const runner = new Runner(text, {
    effortLimit: 2000,
    sameHandPenalty: 0.5,
    sameFingerPenalty: 5
  });

  it('counts stuff in QWERTY', () => {
    const result = runner.typeWith(QWERTY);
    delete(result.counts);
    expect(result).to.eql({
      distance: 3285,
      effort: 2004,
      overheads: {
        sameHand: 244,
        sameFinger: 290,
        shifting: 125
      },
      position: 407
    });
  });

  it('counts stuff in Dvorak', () => {
    const result = runner.typeWith(Dvorak);
    delete(result.counts);
    expect(result).to.eql({
      distance: 2883,
      effort: 2011,
      overheads: {
        sameHand: 125,
        sameFinger: 490,
        shifting: 134
      },
      position: 586
    });
  });

  it('counts stuff in Colemak', () => {
    const result = runner.typeWith(Colemak);
    delete(result.counts);
    expect(result).to.eql({
      distance: 3124,
      effort: 2000,
      overheads: {
        sameHand: 300,
        sameFinger: 10,
        shifting: 189
      },
      position: 744
    });
  });

  it('counts stuff in Workman', () => {
    const result = runner.typeWith(Workman);
    delete(result.counts);
    expect(result).to.eql({
      distance: 3697,
      effort: 2001,
      overheads: {
        sameHand: 228,
        sameFinger: 255,
        shifting: 204
      },
      position: 833
    });
  });
});
