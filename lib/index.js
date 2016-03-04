import { text, code, trigrams, bigrams } from "./data";
import chalk from "chalk";
import User from "./user";
import Keyboard from "./keyboard";
import Population from "./population";
import { Workman } from "./layout";

let data       = text;
let best_known = Workman;
let best_score = grade_layout(best_known);
let generation = 1;
let population = Population.random();

for (var i=0; i < 300; i++) {
  console.log(chalk.magenta(`Generation: ${generation++}\n`));

  population.grade(genome => {
    const layout = genome.toLayout();
    process.stdout.write(chalk.grey(`Testing layout: ${layout.name} ..... `));
    const score  = grade_layout(layout);
    console.log(chalk.grey(humanize(score)));
    return score;
  });

  const [ best_gene, score ] = population.best();
  const best_layout = best_gene.toLayout();

  console.log(`\nBest layout ${chalk.red(best_layout.name)}, scored: ${chalk.yellow(humanize(score))} (${vs_best_known(score)})\n`);
  console.log(chalk.blue(best_layout.toString()));

  population = population.next({elite: true, mutate: 1});
}

function grade_layout(layout) {
  const keyboard = new Keyboard(layout);
  const user     = new User(keyboard);

  let i = 0;

  while (!user.isTired()) {
    user.type(data[i++]);
  }

  return i;
}

function humanize(score) {
  let res = (score / 100000).toFixed(3) + "M";
  while (res.length < 6) { res = " " + res; }
  return res;
}

function vs_best_known(score) {
  const percent = score / best_score * 100;
  const diff    = (percent - 100).toFixed(3);

  if (diff < 0) {
    const data = `${diff}%`;
    return `${chalk.red(data)} from ${best_known.name}`;
  } else {
    const data = `+${diff}%`;
    return `${chalk.green(data)} over ${best_known.name}`;
  }
}


// Best layout GHUBWJFLPK, scored: 1.157M (+1.918% over Workman)
//
// ` 1 2 3 4 5 6 7 8 9 0 - =
//   g h u b w j f l p k [ ] \
//   n s e o y ; r t a i ' \n
//   z x c v q m d , . /

// Best layout GHLBWQFDUK, scored: 1.156M (+1.879% over Workman)
//
// ` 1 2 3 4 5 6 7 8 9 0 - =
//   g h l b w q f d u k [ ] \
//   i s n t m ; e a o r ' \n
//   z x c v j y p , . /

// Best layout YDIMWQPHUK, scored: 1.159M (+2.097% over Workman)
//
// ` 1 2 3 4 5 6 7 8 9 0 - =
//   y d i m w q p h u k [ ] \
//   l s e r g ; n a t o ' \n
//   z x c v j b f , . /
//
