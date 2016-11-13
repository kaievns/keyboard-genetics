const Cluster = require('../src/cluster');
const { QWERTY, Dvorak, Colemak, Workman } = require('../src/presets');

const text = global.TEXT_FIXTUE;
const layouts = [ QWERTY, Dvorak, Colemak, Workman, QWERTY, Dvorak, Colemak, Workman ];

describe('Cluster', () => {
  const cluster = new Cluster(text, {
    effortLimit: 2000,
    sameHandPenalty: 0.5,
    sameFingerPenalty: 5
  });

  it('allows to run a bunch of layouts', function * () {
    const results = [];

    for (const promise of cluster.schedule(layouts)) {
      results.push(yield promise);
    }

    const data = results.map(result => `${result.layout.name} - ${result.result.position}`);
    expect(data.sort()).to.eql([
      "Colemak - 715",
      "Colemak - 715",
      "Dvorak - 569",
      "Dvorak - 569",
      "QWERTY - 400",
      "QWERTY - 400",
      "Workman - 753",
      "Workman - 753"
    ]);
  });
});
