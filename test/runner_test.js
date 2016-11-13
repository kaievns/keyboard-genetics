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
      distance: 3214,
      effort: 2003,
      overheads: {
        sameHand: 246,
        sameFinger: 290,
        shifting: 120
      },
      position: 400
    });
  });

  it('counts stuff in Dvorak', () => {
    const result = runner.typeWith(Dvorak);
    delete(result.counts);
    expect(result).to.eql({
      distance: 2722,
      effort: 2019,
      overheads: {
        sameHand: 135,
        sameFinger: 490,
        shifting: 123
      },
      position: 569
    });
  });

  it('counts stuff in Colemak', () => {
    const result = runner.typeWith(Colemak);
    delete(result.counts);
    expect(result).to.eql({
      distance: 2933,
      effort: 2003,
      overheads: {
        sameHand: 305,
        sameFinger: 10,
        shifting: 162
      },
      position: 715
    });
  });

  it('counts stuff in Workman', () => {
    const result = runner.typeWith(Workman);
    delete(result.counts);
    expect(result).to.eql({
      distance: 3389,
      effort: 2000,
      overheads: {
        sameHand: 231,
        sameFinger: 250,
        shifting: 177
      },
      position: 753
    });
  });
});
