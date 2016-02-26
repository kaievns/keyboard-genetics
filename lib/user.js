const MAX_DISTANCE = 100000;
const MAX_EFFORT   = 100000;

export default class User {
  constructor(keyboard) {
    this.keyboard         = keyboard;
    this.distanceTraveled = 0;
    this.effortSpent      = 0;
  }

  type(symbol) {
    const { effort, distance } = this.keyboard.press(symbol);

    this.distanceTraveled += distance;
    this.effortSpent      += effort;
  }

  isTired() {
    return this.distanceTraveled > MAX_DISTANCE || this.effortSpent > MAX_EFFORT;
  }
}
