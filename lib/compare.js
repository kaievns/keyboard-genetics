const { measure } = require("./runner");
const { text, trigrams, docs, code } = require("./data");
const Layout = require("./layout");
const { QWERTY, QGMLWY, Workman, WorkmanP, Colemak, Dworak } = Layout;

const data = text;

const Mark1 = new Layout("Mark1", `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * ( ) _ +
  m l r w k q b u d ; [ ] \\
  M L R W K Q B U D : { } |
  h s n t f y a e o i ' \\n
  H S N T F Y A E O I " \\n
  z x c v j g p , . /
  Z X C V J G P < > ?
`);

const Mark1_P = new Layout("Mark1-P", `
\` ! @ # $ % ^ & * ( ) - =
 ~ 1 2 3 4 5 6 7 8 9 0 _ +
  m l r w k q b u d ; { } |
  M L R W K Q B U D : [ ] \\
  h s n t f y a e o i ' \\n
  H S N T F Y A E O I " \\n
  z x c v j g p , . /
  Z X C V J G P < > ?
`);


const Mark2 = new Layout("Mark2", `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * ( ) _ +
  m l r f b q w u d ; [ ] \\
  M L R F B Q W U D : { } |
  h s n t g y a e o i ' \\n
  H S N T G Y A E O I " \\n
  z x c v j k p , . /
  Z X C V J K P < > ?
`);

const Mark3 = new Layout("Mark3", `
\` 1 2 3 4 5 6 7 8 9 0 - =
 ~ ! @ # $ % ^ & * ( ) _ +
  m l r f k q b u d ; [ ] \\
  M L R F K Q B U D : { } |
  h s n t g y a e o i ' \\n
  H S N T G Y A E O I " \\n
  z x c v j p w , . /
  Z X C V J P W < > ?
`);

const LAYOUTS = [
  QWERTY, QGMLWY, Workman, WorkmanP, Colemak, Dworak,
  Mark1, Mark2, Mark3, Mark1_P
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
