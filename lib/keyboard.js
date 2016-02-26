import { EFFORTS, DISTANCES } from "./config";

export default class Keyboard {
  constructor(layout) {
    this.layout = layout;
  }

  press(symbol) {
    const keyname  = this.layout.translate(symbol);
    const effort   = EFFORTS[keyname];
    const distance = DISTANCES[keyname];

    return {
      distance: distance === undefined ? 0 : distance,
      effort:   effort   === undefined ? 0 : effort
    };
  }
}
