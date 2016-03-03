import { text, code, trigrams, bigrams } from "./data";
import User from "./user";
import Keyboard from "./keyboard";
import Population from "./population";

let data       = text;
let generation = 1;
let population = Population.random();

for (var i=0; i < 10; i++) {
  console.log(`Generation: ${generation++}\n`);

  population.grade(genome => {
    const layout = genome.toLayout();
    process.stdout.write(`Testing layout: ${layout.name} ..... `);
    const score  = grade_layout(layout);
    console.log(humanize(score));
    return score;
  });

  const [ best_gene, score ] = population.best();
  const best_layout = best_gene.toLayout();

  console.log(`\nBest layout ${best_layout.name}, scored: ${humanize(score)}`);
  console.log(best_layout.toString());

  population = population.next();
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
