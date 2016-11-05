const Layout = require('../src/layout');
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
});
