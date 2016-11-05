module.exports = class Runner {
  constructor(text, options) {
    this.text = text.trim();
    this.options = options;
  }

  typeWith(layout) {
    const mapping = layout.toMetrics();
    const { effortLimit = 100, sameFingerOverhead = 1, sameHandOverhead = 1 } = this.options;
    const text = this.text;
    const L_SHIFT = mapping['l-shift'];
    const R_SHIFT = mapping['r-shift'];

    let position = 0;
    let distance = 0;
    let effort = 0;
    let sameFingerOverheads = 0;
    let sameHandOverheads = 0;
    let prevKey = mapping[' '];

    while (effort < effortLimit) {
      const i = position++ % text.length;
      const symbol = text[i];
      const key = mapping[symbol];
      if (key === undefined) {
        prevKey = mapping[' '];
        continue;
      }

      // console.log(symbol, key.finger, key.hand, key.effort);

      distance += key.distance;
      effort += key.effort;

      if (key !== prevKey) { // skipping repeats and spaces
        if (key.finger === prevKey.finger) {
          const overhead = prevKey.effort * sameFingerOverhead
          effort += overhead;
          sameFingerOverheads += overhead;
        } else if (key.hand === prevKey.hand) {
          const overhead = prevKey.effort * sameHandOverhead;
          effort += overhead;
          sameHandOverheads += overhead;
        }
      }

      prevKey = key;
    }

    return {
      distance,
      effort: Math.round(effort),
      overheads: {
        sameHand: Math.round(sameHandOverheads),
        sameFinger: Math.round(sameFingerOverheads)
      }
    };
  }
};
