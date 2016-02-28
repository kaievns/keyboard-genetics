import { FINGERS, REACH_KEYS, EFFORTS, DISTANCES } from "./config";

export default class Palms {
  constructor() {
    this.reset();

    this.prevFinger = null;
    this.prevShift  = null;
  }

  moveTo(keyname, shift) {
    const finger         = FINGERS[keyname];
    const shift_overhead = this.shiftOverhead(finger, shift);

    const effort   = shift_overhead.effort;
    const distance = shift_overhead.distance;

    console.log(JSON.stringify(keyname), shift, effort, distance)

    this[finger]   += 0;
    this.prevFinger = finger;

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
      }
    } else {
      this.prevShift = null;
    }

    return { distance, effort };
  }

  shiftName(finger) {
    return finger[0] === "r" ? "l-shift" : "r-shift";
  }

  reset() {
    for (let keyname in FINGERS) {
      const finger = FINGERS[keyname];

      if (this[finger] === undefined) {
        this[finger] = 0;
      }
    }
  }
}
