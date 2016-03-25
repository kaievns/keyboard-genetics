"use strict";
/**
 * Creates basic stats results on a layout evaluation
 */

module.exports = function Stats(position, effort, distance, counts) {
  const fingers  = fingers_utilization(counts);
  const symmetry = fingers.symmetry / 10;
  const evenness = fingers.evenness / 10;

  // NOTE: use this to find the most efficient solutions
  //const total = position;

  // NOTE: use this to fine tune the layouts to be more symmetrical
  const total    = Math.round(position * (symmetry + evenness));

  return Object.assign({ position, effort, distance, total }, fingers);
};

function fingers_utilization(counts) {
  const ls = counts["l-pinky"];
  const lr = counts["l-ring"];
  const lm = counts["l-middle"];
  const lp = counts["l-point"];

  const rs = counts["r-pinky"];
  const rr = counts["r-ring"];
  const rm = counts["r-middle"];
  const rp = counts["r-point"];

  const total = ls + lr + lm + lp + rs + rr + rm + rp;

  let fingers = [
    ls / total, lr / total, lm / total, lp / total,
    rp / total, rm / total, rr / total, rs / total,
  ];

  let hands = [
    (ls + lr + lm + lp)/total, (rs + rr + rm + rp) / total
  ];

  const symmetry = calculate_symmetry(...fingers);
  const evenness = calculate_evenness(...fingers);

  fingers = fingers.map(percentify);
  hands   = hands.map(percentify);

  return { fingers, hands, symmetry, evenness };
}

function calculate_symmetry(ls, lr, lm, lp, rp, rm, rr, rs) {
  const p = diff_match(lp, rp);
  const m = diff_match(lm, rm);
  const r = diff_match(lr, rr);
  const s = diff_match(ls, rs);

  return percentify((p + m + r + s) / 4);
}

function calculate_evenness(ls, lr, lm, lp, rp, rm, rr, rs) {
  const v1 = diff_match(ls, 0.125);
  const v2 = diff_match(lr, 0.125);
  const v3 = diff_match(lm, 0.125);
  const v4 = diff_match(lp, 0.125);
  const v5 = diff_match(rs, 0.125);
  const v6 = diff_match(rr, 0.125);
  const v7 = diff_match(rm, 0.125);
  const v8 = diff_match(rp, 0.125);

  return percentify((v1+v2+v3+v4+v5+v6+v7+v8) / 8);
}

function diff_match(one, two) {
  return Math.min(one, two) / Math.max(one, two) || 1;
}

function percentify(value) {
  return Math.round(value * 100);
}
