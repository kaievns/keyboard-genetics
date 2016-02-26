import { parseLayout } from "./config";

export default class Layout {
  constructor(name, config) {
    this.name    = name;
    this.config  = config;
    this.mapping = parseLayout(config);
  }

  translate(symbol) {
    const keyname = this.mapping[symbol];
    return keyname === undefined ? symbol : keyname;
  }

  toString() {
    return this.config.trim().split("\n").map((line, i) => {
      return i % 2 === 0 ? line+"\n" : "";
    }).join("");
  }
}

export const QWERTY = new Layout("QWERTY", `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * ( ) _ +
   q w e r t y u i o p [ ] \\
   Q W E R T Y U I O P { } |
   a s d f g h j k l ; ' \\n
   A S D F G H J K L : " \\n
   z x c v b n m , . /
   Z X C V B N M < > ?
`);

export const QGMLWY = new Layout("QGMLWY", `
\` ! @ # $ % ^ & * ( ) _ =
 ~ 1 2 3 4 5 6 7 8 9 0 - +
   q g m l w y f u b ; { } |
   Q G M L W Y F U B : [ ] \\
   d s t n r i a e o h ' \\n
   D S T N R I A E O H " \\n
   z x c v j k p , . /
   Z X C V J K P < > ?
`);

export const Workman = new Layout("Workman-P", `
\` ! @ # $ % ^ & * ( ) - =
 ~ 1 2 3 4 5 6 7 8 9 0 _ +
   q d r w b j f u p ; [ ] \\
   Q D R W B J F U P : { } |
   a s h t g y n e o i ' \\n
   A S H T G Y N E O I " \\n
   z x m c v k l , . /
   Z X M C V K L < > ?
`);

export const Colemak = new Layout("Colemak", `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * ( ) _ +
   q w f p g j l u y ; [ ] \\
   Q W F P G J L U Y : { } |
   a r s t d h n e i o ' \\n
   A R S T D H N E I O " \\n
   z x c v b k m , . /
   Z X C V B K M < > ?
`);

export const Dworak = new Layout("Dworak", `
\` 1 2 3 4 5 6 7 8 9 0 [ ]
 ~ ! @ # $ % ^ & * ( ) { }
 ' , . p y f g c r l / = \\
 " < > P Y F G C R L ? + |
 a o e u i d h t n s - \\n
 A O E U I D H T N S _ \\n
 ; q j k x b m w v z
 : Q J K X B M W V Z
`);
