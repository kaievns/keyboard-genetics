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
      "Colemak - 771",
      "Colemak - 771",
      "Dvorak - 595",
      "Dvorak - 595",
      "QWERTY - 420",
      "QWERTY - 420",
      "Workman - 859",
      "Workman - 859"
    ]);
  });
});
