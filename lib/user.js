const MAX_DISTANCE = 10000;
const MAX_EFFORT   = 10000;

export default class User {
  constructor() {
    this.distanceTraveled = 0;
    this.effortSpent      = 0;
  }

  moved(distance) {
    this.distanceTraveled += distance;
  }

  spent(effort) {
    this.effortSpent += effort;
  }

  isTired() {
    return this.distanceTraveled > MAX_DISTANCE || this.effortSpent > MAX_EFFORT;
  }
}
