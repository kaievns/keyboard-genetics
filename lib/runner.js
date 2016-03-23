"use strict";
const { EFFORTS, DISTANCES } = require("./config");
const stats                  = require("./stats");

/**
 * Runs the layout against the text and returns final stats
 *
 * @param {Layout} layout
 * @param {string} text
 * @return {Object} stats
 */
exports.measure = function measure(layout, text) {
  const { keys }   = layout;
  const START_TIME = new Date();
  const MAX_EFFORT = 22200000;

  // a hand to an opposite shift efforts/distances
  const SHIFT_EFFORTS = Object.assign(Object.create(null), {
    l: EFFORTS['r-shift'], r: EFFORTS['l-shift']
  });
  const SHIFT_DISTANCES = Object.assign(Object.create(null), {
    l: DISTANCES['r-shift'], r: DISTANCES['l-shift']
  });

  let position  = 0;
  let distance  = 0;
  let effort    = 0;
  let prevKey   = keys[' '];
  let prevShift = null;
  let counts    = Object.assign(Object.create(null), {
    'l-pinky': 0, 'l-ring': 0, 'l-middle': 0, 'l-point': 0,
    'r-pinky': 0, 'r-ring': 0, 'r-middle': 0, 'r-point': 0,'thumb': 0
  });


  while (effort < MAX_EFFORT) {
    const i   = position++ % text.length;
    const key = keys[text[i]];
    if (key === undefined) { continue; } // skip weird characters

    // base cost of the movement
    effort   += key.effort;
    distance += key.distance;

    // counting in a reached out finger return overhead
    // we're counting the efforts as 2/3rds because they're aimless
    if (prevKey !== key) {
      if (key.finger === prevKey.finger) {
        // same finger overhead
        effort   += ~~(prevKey.effort * 2/3);
        distance += prevKey.distance;
      } else if (key.hand === prevKey.hand && prevKey.reach) {
        // same hand retraction from a reach-out position
        effort   += ~~(prevKey.effort * 2/3);
        distance += prevKey.distance;
      } else if (key.hand === prevShift) {
        // same hand retraction from pressing a shift button
        const shiftKey = key.hand === "r" ? "l" : "r"; // reversed in the config
        effort   += ~~(SHIFT_EFFORTS[shiftKey] * 2/3);
        distance += SHIFT_DISTANCES[shiftKey];
      }
    }

    // couting in the shift movements
    if (key.shift) {
      if (prevShift !== key.hand) {
        prevShift = key.hand;

        effort   += SHIFT_EFFORTS[prevShift];
        distance += SHIFT_DISTANCES[prevShift];
      }
    } else {
      prevShift = null;
    }

    counts[key.finger] += 1;
    prevKey = key;
  }

  return stats(position, effort, distance, counts);
}
