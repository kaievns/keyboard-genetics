import { FINGERS, REACH_KEYS, EFFORTS, DISTANCES } from "./config";

export default class Palms {
  constructor() {
    this.reset();
  }

  moveTo(keyname, shift) {
    const finger = FINGERS[keyname];

    this[finger] += 0;

    let effort   = 0;
    let distance = 0;

    if (shift && finger[0] === "r") {
      effort   += EFFORTS["l-shift"];
      distance += DISTANCES["l-shift"];
    }

    if (shift && finger[0] === "l") {
      effort   += EFFORTS["r-shift"];
      distance += DISTANCES["r-shift"];
    }


    console.log(JSON.stringify(keyname), finger, shift, distance, effort);

    return { distance, effort };
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
