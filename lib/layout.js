import { parseLayout } from "./config";

export default class Layout {
  constructor(config) {
    this.config  = config;
    this.mapping = parseLayout(config);
  }

  toString() {
    return this.config.trim().split("\n").map((line, i) => {
      return i % 2 === 0 ? line+"\n" : "";
    }).join("");
  }
}

export const QWERTY = new Layout(`
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * ( ) _ +
   q w e r t y u i o p [ ] \\
   Q W E R T Y U I O P { } |
   a s d f g h j k l ; ' \\n
   A S D F G H J K L : " \\n
   z x c v b n m , . /
   Z X C V B N M < > ?
`);
