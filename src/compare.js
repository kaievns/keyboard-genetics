const { measure } = require("./runner");
const { text, trigrams, docs, code } = require("./data");
const Layout = require("./layout");
const { QWERTY, QGMLWY, Workman, Colemak, Dworak } = Layout;

const data = text;
// const symbols = ['<','\\[','\\{','`','~','\!','@','\$','%','\\^','&','\\*','\\(','-','_','\\+','\\=','\\|', '\\\\','\\/'];
// const entries = symbols.map(symbol => (
//   [symbol, data.match(new RegExp(symbol, "g")).length]
// ));
// entries.sort((a, b) => a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0);
// console.log(entries.map(e => `${e[0]} - ${e[1]}`).join('\n'));
// process.exit(0);


const Halmak = new Layout("Halmak", `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * ( ) _ +
  f l r w k q p u d ; [ ] \\
  F L R W K Q P U D : { } |
  h s n t m y a e o i ' \\n
  H S N T M Y A E O I " \\n
  z x c v j g b , . /
  Z X C V J G B < > ?
`);

const Halmak2 = new Layout("Halmak2", `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * < > _ +
   v l r p z ; g u d q [ ] \\
   V L R P Z : G U D Q { } |
   h s n t , . a e o i ' \\n
   H S N T ( ) A E O I " \\n
   m f c w ? k y x b j
   M F C W / K Y X B J
`);

const Halmak2P = new Layout("Halmak2-P", `
% ! < { [ & @ | ] } > _ =
~ 1 2 3 4 5 6 7 8 9 0 - +
   v l r p z ; g u d q \` * \\
   V L R P Z : G U D Q # $ ^
   h s n t , . a e o i ' \\n
   H S N T ( ) A E O I " \\n
   m f c w ? k y x b j
   M F C W / K Y X B J
`);

const LAYOUTS = [
  QWERTY, QGMLWY, Workman, Colemak, Dworak, Halmak, Halmak2, Halmak2P
];

console.log("Running measurements...");
const results = LAYOUTS.map(layout => {
  process.stdout.write(`  * ${layout.name} ... `);
  const stats = measure(layout, data);
  console.log("DONE");
  return { layout, stats };
});

console.log("\nRunning comparisons...\n");
const sorted = results.sort((a, b) => a.stats.position < b.stats.position ? -1 : 1);

sorted.forEach(result => {
  const { layout, stats } = result;
  const easineess = (stats.effort/stats.position).toFixed(2);
  const shortness = (stats.distance/stats.position).toFixed(3);

  console.log(layout.name, 'reached to:', stats.position, ', effort/symbol:', easineess, ', distance/symbol:', shortness, "\n");
  console.log(layout.toString());
  console.log(stats.fingers.join(" "), ', ', stats.hands.join(" | "));
  console.log("Symmetry:", stats.symmetry, "Evenness:", stats.evenness, "\n\n");
});
