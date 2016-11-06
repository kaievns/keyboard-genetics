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
    const results = yield cluster.runCollection(layouts);
    const data = results.map(result => `${result.layout.name} - ${result.result.position}`);
    expect(data.sort()).to.eql([
      "Colemak - 744",
      "Colemak - 744",
      "Dvorak - 586",
      "Dvorak - 586",
      "QWERTY - 407",
      "QWERTY - 407",
      "Workman - 833",
      "Workman - 833"
    ]);
  });
});
