const Layout = require('../src/layout');
const { DISTANCES, EFFORTS, FINGERS, ROWS } = require('../src/config');
const QWERTY = `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * ( ) _ +
   q w e r t y u i o p [ ] \\
   Q W E R T Y U I O P { } |
   a s d f g h j k l ; ' \\n
   A S D F G H J K L : " \\n
    z x c v b n m , . /
    Z X C V B N M < > ?
`;

describe('Layout', () => {
  const layout = new Layout('QWERTY', QWERTY);

  it('has a name', () => {
    expect(layout).to.have.property('name', 'QWERTY');
  });

  it('can export itself in a pretty string', () => {
    expect(layout.toString()).to.eql(
      '` 1 2 3 4 5 6 7 8 9 0 - =\n'+
      '  q w e r t y u i o p [ ] \\\n'+
      '  a s d f g h j k l ; \' \\n\n'+
      '   z x c v b n m , . /'
    );
  });

  it('can export itself into a sequence', () => {
    expect(layout.toSequence()).to.eql(
      '`1234567890-=qwertyuiop[]\\asdfghjkl;\'\nzxcvbnm,./'
    );
  });

  it('can expose the layouts metrics map', () => {
    const metrics = layout.toMetrics();
    expect(metrics['q']).to.eql({
      effort: EFFORTS['q'],
      distance: DISTANCES['q'],
      finger: FINGERS['q'],
      shift: false,
      hand: 'l',
      row: 3
    });
    expect(metrics['Q']).to.eql({
      effort: EFFORTS['q'],
      distance: DISTANCES['q'],
      finger: FINGERS['q'],
      shift: true,
      hand: 'l',
      row: 3
    });
    expect(metrics[';']).to.eql({
      effort: EFFORTS[';'],
      distance: DISTANCES[';'],
      finger: FINGERS[';'],
      hand: 'r',
      shift: false,
      row: 2
    });
    expect(metrics[':']).to.eql({
      effort: EFFORTS[';'],
      distance: DISTANCES[';'],
      finger: FINGERS[';'],
      hand: 'r',
      shift: true,
      row: 2
    });
    expect(metrics[' ']).to.eql({
      effort:   0,
      distance: 0,
      finger:   'thumb',
      shift:    false,
      hand:     false,
      row:      0
    });
    expect(metrics['l-shift']).to.eql({
      effort: EFFORTS['l-shift'],
      distance: DISTANCES['l-shift'],
      finger: FINGERS['l-shift'],
      shift: false,
      hand: 'l',
      row: 0
    });
    expect(metrics['r-shift']).to.eql({
      effort: EFFORTS['r-shift'],
      distance: DISTANCES['r-shift'],
      finger: FINGERS['r-shift'],
      shift: false,
      hand: 'r',
      row: 0
    });
    expect(metrics['~']).to.eql({
      effort: EFFORTS['~'],
      distance: DISTANCES['~'],
      finger: FINGERS['~'],
      hand: 'l',
      shift: true,
      row: 4
    });
    expect(metrics['0']).to.eql({
      effort: EFFORTS['0'],
      distance: DISTANCES['0'],
      finger: FINGERS['0'],
      hand: 'r',
      shift: false,
      row: 4
    });
    expect(metrics['\n']).to.eql({
      effort: EFFORTS['\n'],
      distance: DISTANCES['\n'],
      finger: FINGERS['\n'],
      hand: 'r',
      shift: false,
      row: 2
    });
  });
});
