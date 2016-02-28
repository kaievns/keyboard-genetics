import Palms from "./palms";

const MAX_DISTANCE = 100000000;
const MAX_EFFORT   = 100000000;

export default class User {
  constructor(keyboard) {
    this.keyboard         = keyboard;
    this.palms            = new Palms();
    this.distanceTraveled = 0;
    this.effortSpent      = 0;
  }

  type(symbol) {
    const { distance, effort, keyname, shift } = this.keyboard.press(symbol);
    const compound = this.palms.moveTo(keyname, shift);

    this.distanceTraveled += distance + compound.effort;
    this.effortSpent      += effort   + compound.distance;
  }

  isTired() {
    return this.distanceTraveled > MAX_DISTANCE || this.effortSpent > MAX_EFFORT;
  }
}
