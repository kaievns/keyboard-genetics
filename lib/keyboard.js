export default class Keyboard {
  constructor(layout) {
    this.layout = layout;
  }

  type(char) {
    return {
      distance: 1,
      effort:   2
    };
  }
}
