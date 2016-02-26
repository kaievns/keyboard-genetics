// import ui from "./ui";
import data from "./data";
import User from "./user";
import { QWERTY } from "./layout";
import Keyboard from "./keyboard";

// ui.render();

console.log("Running layout:\n");
console.log(QWERTY.toString())

const keyboard = new Keyboard(QWERTY);
const user = new User(keyboard);

let i = 0;

setInterval(() => {
  user.type(data[i++]);
  if (user.isTired()) {
    console.log("Got to ", i);
    process.exit(0);
  }
}, 0);
