import { FINGERS, REACH_KEYS, EFFORTS, DISTANCES } from "./config";

export default class Palms {
  constructor() {
    this.reset();

    this.prevKeyname = "";
    this.prevFinger  = "";
    this.prevShift   = "";
  }

  moveTo(keyname, shift) {
    const finger          = FINGERS[keyname] || "";
    const return_overhead = this.returnOverhead(keyname, finger);
    const shift_overhead  = this.shiftOverhead(finger, shift);

    const effort   = return_overhead.effort   + shift_overhead.effort;
    const distance = return_overhead.distance + shift_overhead.distance;

    this.fingerCounts[finger] += 1;

    return { distance, effort };
  }

  returnOverhead(keyname, finger) {
    let effort   = 0;
    let distance = 0;

    const same_finger = finger === this.prevFinger;
    const same_hand   = finger[0] === this.prevFinger[0] || finger[0] === this.prevShift[0];
    const reached_out = same_hand && REACH_KEYS.indexOf(this.prevKeyname) !== -1;

    // adding a cost of the same finger movement or moving a hand from a reaching out position
    if (keyname !== this.prevKeyname && (same_finger || reached_out)) {
      // counting the retraction effort as a half of the original effort
      effort   += ~~(EFFORTS[this.prevKeyname] / 2);
      distance += ~~(DISTANCES[this.prevKeyname] / 2);
    }

    this.prevFinger  = finger;
    this.prevKeyname = keyname;

    return { distance, effort };
  }

  shiftOverhead(finger, shift) {
    let effort   = 0;
    let distance = 0;

    const shift_name = shift && this.shiftName(finger);

    if (shift_name) {
      if (this.prevShift !== shift_name) {
        effort   += EFFORTS[shift_name];
        distance += DISTANCES[shift_name];

        this.prevShift = shift_name;
        // this.fingerCounts[finger[0] === "r" ? "l-pinky" : "r-pinky"] += 1;
      }
    } else {
      this.prevShift = "";
    }

    return { distance, effort };
  }

  shiftName(finger) {
    return finger[0] === "r" ? "l-shift" : "r-shift";
  }

  reset() {
    this.fingerCounts = {};

    for (let keyname in FINGERS) {
      const finger = FINGERS[keyname];

      if (this.fingerCounts[finger] === undefined) {
        this.fingerCounts[finger] = 0;
      }
    }
  }

  getStats() {
    const ls = this.fingerCounts["l-pinky"];
    const lr = this.fingerCounts["l-ring"];
    const lm = this.fingerCounts["l-middle"];
    const lp = this.fingerCounts["l-point"];

    const rs = this.fingerCounts["r-pinky"];
    const rr = this.fingerCounts["r-ring"];
    const rm = this.fingerCounts["r-middle"];
    const rp = this.fingerCounts["r-point"];

    const total = ls + lr + lm + lp + rs + rr + rm + rp;

    const finger_percents = [
      ls / total, lr / total, lm / total, lp / total,
      rs / total, rr / total, rm / total, rp / total
    ];

    const hand_percents = [
      (ls + lr + lm + lp)/total, (rs + rr + rm + rp) / total
    ];

    return {
      fingers: finger_percents.map(e => Math.round(e * 100) + "%"),
      hands:   hand_percents.map(e => Math.round(e * 100) + "%")
    };
  }
}
