module.exports = class Runner {
  constructor(text, options) {
    this.text = text.trim();
    this.options = options;
  }

  typeWith(layout) {
    const mapping = layout.toMetrics();
    const { effortLimit = 100 } = this.options;
    const text = this.text;
    const L_SHIFT = mapping['l-shift'];
    const R_SHIFT = mapping['r-shift'];

    let position = 0;
    let distance = 0;
    let effort = 0;
    let prevKey = mapping[' '];

    while (effort < effortLimit) {
      const i = position++ % text.length;
      const symbol = text[i];
      const key = mapping[symbol];

      if (key === undefined) { continue; }

      // console.log(symbol, key);

      distance += key.distance;
      effort += key.effort;
    }

    return { distance, effort };
  }
};
