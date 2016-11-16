const Runner = require('../src/runner');
const Layout = require('../src/layout');
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
      distance: 3138,
      effort: 2003,
      overheads: {
        sameFinger: 340,
        sameHand: 228,
        shifting: 30
      },
      position: 420
    });
  });

  it('counts stuff in Dvorak', () => {
    const result = runner.typeWith(Dvorak);
    delete(result.counts);
    expect(result).to.eql({
      distance: 2649,
      effort: 2001,
      overheads: {
        sameFinger: 490,
        sameHand: 96,
        shifting: 48
      },
      position: 595
    });
  });

  it('counts stuff in Colemak', () => {
    const result = runner.typeWith(Colemak);
    delete(result.counts);
    expect(result).to.eql({
      distance: 2861,
      effort: 2002,
      overheads: {
        sameFinger: 10,
        sameHand: 284,
        shifting: 49
      },
      position: 771
    });
  });

  it('counts stuff in Workman', () => {
    const result = runner.typeWith(Workman);
    delete(result.counts);
    expect(result).to.eql({
      distance: 3399,
      effort: 2004,
      overheads: {
        sameFinger: 260,
        sameHand: 199,
        shifting: 64
      },
      position: 859
    });
  });
});
