import { EFFORTS, DISTANCES, FINGERS } from "./config";

export default class Keyboard {
  constructor(layout) {
    this.layout = layout;
  }

  press(symbol) {
    let keyname  = this.layout.translate(symbol);
    let effort   = EFFORTS[keyname];
    let distance = DISTANCES[keyname];
    let finger   = FINGERS[keyname];

    effort   === undefined && (effort = 0);
    distance === undefined && (distance = 0);

    // console.log(JSON.stringify(keyname), effort, distance, finger, keyname.shift);

    if (keyname.shift) {
      if (finger[0] === "r") {
        effort   += EFFORTS["l-shift"];
        distance += DISTANCES["l-shift"];
      } else if (finger[0] === "l") {
        effort   += EFFORTS["r-shift"];
        distance += DISTANCES["r-shift"];
      }
    }

    return { distance, effort };
  }
}
