import blessed from "blessed";
import contrib from "blessed-contrib";

const screen = blessed.screen();
const grid   = new contrib.grid({rows: 12, cols: 12, screen: screen});

const layouts = grid.set(0, 0, 9, 6, contrib.table, {
  label:       "Top layouts",
  keys:        true,
  interactive: true,
  columnWidth: [16, 10, 10]
});

const details = grid.set(0, 6, 8, 6, blessed.box, {
  label:   "Keyboard details",
  content: "Hello!"
});

const roll = grid.set(8, 6, 4, 6, blessed.log, {
  label: "Analyzing text"
});

const genesis = grid.set(9, 0, 3, 6, blessed.box, {
  label:   "Genetics info",
  content: "Generation: 123\nMutations: 234"
});

layouts.focus();

layouts.setData({
  headers: ['Name', 'Score', 'Stuff'],
  data:    [
    ["qwerty", 2, 3],
    ["asdfgd", 5, 6]
  ]
});

layouts.on("item", (row) => {
  console.log(row);
  details.setContent(String(row));
});

setInterval(() => {
  roll.log(`New entry: ${Math.random()}`);
}, 250);

screen.key(['escape', 'q', 'C-c'], () => {
  process.exit(0);
});

screen.render();
