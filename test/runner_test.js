const Runner = require('../src/runner-new');
const { QWERTY, Dvorak, Colemak, Workman } = require('../src/presets');
const text = `
A long time ago in a galaxy far, far away

It is a period of civil war. Rebel spaceships, striking from a
hidden base, have won their first victory against the evil Galactic Empire.
During the battle, Rebel spies managed to steal secret plans to the
Empire's ultimate weapon, the Death Star, an armored space station
with enough power to destroy an entire planet.
Pursued by the Empire's sinister agents, Princess Leia races home
aboard her starship, custodian of the stolen plans that can save her
people and restore freedom to the galaxy...
`;

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
