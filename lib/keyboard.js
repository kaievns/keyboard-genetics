import { EFFORTS, DISTANCES } from "./config";

export default class Keyboard {
  constructor(layout) {
    this.layout = layout;
  }

  press(symbol) {
    const keyname  = this.layout.translate(symbol);
    const shift    = keyname.shift;

    let   effort   = EFFORTS[keyname];
    let   distance = DISTANCES[keyname];

    effort   === undefined && (effort = 0);
    distance === undefined && (distance = 0);

    return { distance, effort, keyname, shift };
  }
}
