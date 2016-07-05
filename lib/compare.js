const { measure } = require("./runner");
const { text, trigrams, docs, code } = require("./data");
const Layout = require("./layout");
const { QWERTY, QGMLWY, Workman, Colemak, Dworak } = Layout;

const data = code;

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
   q l r w z ; g u d j [ ] \\
   Q L R W Z : G U D J { } |
   s h n t , . a e o i ' \\n
   S H N T ( ) A E O I " \\n
   f m c v ? k p y b x
   F M C V / K P Y B X
`);

const Halmak3 = new Layout("Halmak3", `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ | @ # $ % ^ & * < > _ +
   v l r p z ; g u d q [ ] \\
   V L R P Z : G U D Q { } //
   s h n t , . a e o i ' \\n
   S H N T ( ) A E O I " \\n
   f m c w ? k y x j b
   F M C W ! K Y X J B
`);

const Halmak4 = new Layout("Halmak4", `
\` 1 2 3 4 5 6 7 8 9 0 - =
   ~ | @ # $ % ^ & * < > _ +
   v l r p z ; g u d q [ ] \\
   V L R P Z : G U D Q { } //
   s h n t , . a e o i ' \\n
   S H N T ( ) A E O I " \\n
   f m c w ? k y x j b
   F M C W ! K Y X J B
`);


const LAYOUTS = [
  QWERTY, QGMLWY, Workman, Colemak, Dworak, Halmak, Halmak2, Halmak3, Halmak4
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
