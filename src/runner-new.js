module.exports = class Runner {
  constructor(text, options) {
    this.text = text.trim();
    this.options = options;
  }

  typeWith(layout) {
    const {
      effortLimit = 100,
      sameFingerPenalty = 1,
      sameHandPenalty = 1
    } = this.options;
    const mapping = layout.toMetrics();
    const text = this.text;
    const L_SHIFT = mapping['l-shift'];
    const R_SHIFT = mapping['r-shift'];
    const counts  = Object.assign(Object.create(null), {
      'l-pinky': [0,0,0,0], 'l-ring': [0,0,0,0], 'l-middle': [0,0,0,0], 'l-point': [0,0,0,0],
      'r-pinky': [0,0,0,0], 'r-ring': [0,0,0,0], 'r-middle': [0,0,0,0], 'r-point': [0,0,0,0]
    });

    let position = 0;
    let distance = 0;
    let effort = 0;
    let sameFingerOverheads = 0;
    let sameHandOverheads = 0;
    let shiftingOverheads = 0;
    let prevKey = mapping[' '];
    let prevShift = false;

    while (effort < effortLimit) {
      const i = position++ % text.length;
      const symbol = text[i];
      const key = mapping[symbol];
      if (key === undefined) {
        prevKey = mapping[' '];
        continue;
      }

      // console.log(JSON.stringify(symbol), key.finger, key.hand, key.effort, 'prev shift', prevShift && prevShift.hand);

      // basic calculation
      distance += key.distance;
      effort += key.effort;

      // various hand movement overheads
      if (key.hand !== false && key !== prevKey) { // skipping repeats and spaces
        if (key.finger === prevKey.finger) { // same finger usage penalty
          const overhead = prevKey.effort * sameFingerPenalty;
          // console.log('      same finger overhead', overhead);
          effort += overhead;
          sameFingerOverheads += overhead;
        } else if (key.hand === prevKey.hand) { // same hand usage penalty
          const overhead = prevKey.effort * sameHandPenalty;
          // console.log('      same hand overhead', overhead);
          effort += overhead;
          sameHandOverheads += overhead;
        } else if (prevShift !== null && prevShift.hand === key.hand) { // retraction from a shift position penalty
          const overhead = prevShift.effort * sameHandPenalty;
          // console.log('     retraction from shift overhead');
          effort += overhead;
          sameHandOverheads += overhead;
        }
      }

      // pressing the shift button overhead
      if (key.shift) {
        prevShift = key.hand === 'r' ? L_SHIFT : R_SHIFT;
        // console.log('     pressing shift overhead', prevShift.effort);
        effort += prevShift.effort;
        shiftingOverheads += prevShift.effort;
        distance += prevShift.distance;
      } else {
        prevShift = null;
      }

      // handling the counting
      if (key.hand !== false) {
        counts[key.finger][key.row] += 1;
      }

      prevKey = key;
    }

    return {
      position,
      distance,
      effort: Math.round(effort),
      overheads: {
        sameHand: Math.round(sameHandOverheads),
        sameFinger: Math.round(sameFingerOverheads),
        shifting: Math.round(shiftingOverheads)
      },
      counts
    };
  }
};
