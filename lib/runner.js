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
  const MAX_EFFORT = 16900000;

  // a hand to an opposite shift efforts/distances
  const SHIFT_EFFORTS = Object.assign(Object.create(null), {
    l: EFFORTS['r-shift'], r: EFFORTS['l-shift']
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

    const c_finger = key.finger;
    const c_hand   = key.hand;
    const p_hand   = prevKey.hand;
    const c_effort = key.effort;

    // base cost of the movement
    effort   += c_effort;
    distance += key.distance;

    // counting in a reached out finger return overhead
    // we're counting the efforts as 2/3rds because they're aimless
    if (prevKey !== key) {
      if (c_finger === prevKey.finger) {
        // same finger overhead
        effort   += ~~(prevKey.effort * 1);
      } else if (c_hand === p_hand && prevKey.reach) {
        // same hand retraction from a reach-out position
        effort   += ~~(prevKey.effort * 2/3);
      } else if (c_hand === p_hand) {
        // basic same hand usage penalty
        effort  += ~~(c_effort * 1/2);
      } else if (c_hand === prevShift) {
        // same hand retraction from pressing a shift button
        const shiftKey = c_hand === "r" ? "l" : "r"; // reversed in the config
        effort   += ~~(SHIFT_EFFORTS[shiftKey] * 4/3);
      }
    }

    // couting in the shift movements
    if (key.shift) {
      if (prevShift !== c_hand) {
        prevShift = c_hand;

        effort   += SHIFT_EFFORTS[prevShift];
      }
    } else {
      prevShift = null;
    }

    counts[c_finger] += 1;
    prevKey = key;
  }

  return stats(position, effort, distance, counts);
}
