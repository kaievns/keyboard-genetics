import { text, code, trigrams, bigrams } from "./data";
import chalk from "chalk";
import User from "./user";
import Keyboard from "./keyboard";
import Population from "./population";

let data       = text;
let generation = 1;
let population = Population.random();

for (var i=0; i < 200; i++) {
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

  console.log(`\nBest layout ${chalk.red(best_layout.name)}, scored: ${chalk.yellow(humanize(score))}\n`);
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
  let res = (score / 100000).toFixed(2) + "M";
  while (res.length < 6) { res = " " + res; }
  return res;
}
