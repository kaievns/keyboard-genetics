const { measure } = require("./runner");
const { text, trigrams, docs, code } = require("./data");
const Layout = require("./layout");
const { QWERTY, QGMLWY, Workman, Colemak, Dworak } = Layout;

const data = text;

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

const LAYOUTS = [
  QWERTY, QGMLWY, Workman, Colemak, Dworak, Halmak
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

  console.log(layout.name, 'reaced to:', stats.position, ', effort/symbol:', easineess, ', distance/symbol:', shortness, "\n");
  console.log(layout.toString());
  console.log(stats.fingers.join(" "), ', ', stats.hands.join(" | "));
  console.log("Symmetry:", stats.symmetry, "Evenness:", stats.evenness, "\n\n");
});
