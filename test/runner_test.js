const Runner = require('../src/runner-new');
const { QWERTY, Workman } = require('../src/presets');
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
  const options = { effortLimit: 1000, sameHandOverhead: 0.5, sameFingerOverhead: 5 };
  const runner = new Runner(text, options);

  it('counts stuff in QWERTY', () => {
    const result = runner.typeWith(QWERTY);
    expect(result).to.eql({
      distance: 1729,
      effort: 1001,
      overheads: {
        sameHand: 124,
        sameFinger: 120
      }
    });
  });

  it('counts stuff in Workman', () => {
    const result = runner.typeWith(Workman);
    expect(result).to.eql({
      distance: 2036,
      effort: 1005,
      overheads: {
        sameHand: 93,
        sameFinger: 135
      }
    });
  });
});
