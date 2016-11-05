const config = require('../src/config');

describe('config stuff', () => {
  it('must have the DISTANCES data', () => {
    expect(config.DISTANCES).to.be.an('object');
  });
});
