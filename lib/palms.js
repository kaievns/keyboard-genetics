import { FINGERS, REACH_KEYS, EFFORTS, DISTANCES } from "./config";

export default class Palms {
  constructor() {
    this.reset();

    this.prevFinger = null;
    this.prevShift  = null;
  }

  moveTo(keyname, shift) {
    const finger     = FINGERS[keyname];
    const shift_name = shift && this.shiftKeyname(finger);

    let effort   = 0;
    let distance = 0;

    if (shift_name) {
      if (this.prevShift !== shift_name) {
        effort   += EFFORTS[shift_name];
        distance += DISTANCES[shift_name];

        this.prevShift = shift_name;
      }
    } else {
      this.prevShift = false;
    }

    console.log(JSON.stringify(keyname), finger, shift, shift_name, distance, effort);

    this[finger]   += 0;
    this.prevFinger = finger;

    return { distance, effort };
  }

  shiftKeyname(finger) {
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
