// import ui from "./ui";
import { text, trigrams, bigrams } from "./data";
import User from "./user";
import Keyboard from "./keyboard";
import { QWERTY, QGMLWY, Workman, Colemak, Dworak } from "./layout";

const data = text;

// ui.render();

// run_slowly(QWERTY)

run_layout(QWERTY);
run_layout(Dworak);
run_layout(QGMLWY);
run_layout(Colemak);
run_layout(Workman);


function run_layout(layout) {
  console.log("Running layout:", layout.name);
  // console.log(layout.toString())

  const keyboard = new Keyboard(layout);
  const user = new User(keyboard);

  let i = 0;

  while (!user.isTired()) {
    user.type(data[i++]);
  }

  console.log("Got to", i, "symbol, distance traveled:", user.distanceTraveled);
  const palm_stats = user.palms.getStats()
  console.log("Fingers: ", palm_stats.fingers.join(" - "));
  console.log("Hands:                    ", palm_stats.hands.join(" | "));
  console.log("\n");
}

function run_slowly(layout) {
  console.log(layout.toString());

  const keyboard = new Keyboard(layout);
  const user = new User(keyboard);

  let i=0;

  setInterval(() => user.type(data[i++]), 50);
}
