import { text, docs, code, trigrams, bigrams } from "./data";
import chalk from "chalk";
import { run } from "./runner";
import Population from "./population";
import { QWERTY, Workman } from "./layout";

let data         = text;
let best_known   = Workman;
let best_score   = grade_layout(best_known);
let qwerty_score = grade_layout(QWERTY);
let generation   = 1;
let population   = Population.random();

for (let i=0,max=300; i < max; i++) {
  console.log(chalk.magenta(`Generation: ${generation++}\n`));

  population.grade(genome => {
    const layout = genome.toLayout();
    process.stdout.write(chalk.grey(`Testing layout: ${layout.name} ..... `));
    const score  = grade_layout(layout);
    console.log(chalk.grey(humanize(score.total)));
    return score;
  });

  const best_gene = population.best();
  const best_layout = best_gene.toLayout();
  const score = population.scoreFor(best_gene);

  console.log(`\nBest layout ${chalk.red(best_layout.name)}, scored: ${chalk.yellow(humanize(score.total))} (${vs_known(score, best_known)}, ${vs_known(score, QWERTY)})\n`);
  console.log(chalk.blue(i === max-1 ? best_layout.config : best_layout.toString()));
  console.log(chalk.gray(`${score.fingers.join(" ")} - (${score.hands.join(" | ")})\n`));

  population = population.next({elite: true, mutate: 1});
}

function grade_layout(layout) {
  return run(layout, data);
}

function humanize(score) {
  let res = (score / 100000).toFixed(1) + "M";
  while (res.length < 5) { res = " " + res; }
  return res;
}

function vs_known(score, layout) {
  const other   = layout === QWERTY ? qwerty_score : best_score;
  const percent = score.total / other.total * 100;
  const diff    = (percent - 100).toFixed(3);

  if (diff < 0) {
    const data = `${diff}%`;
    return `${chalk.red(data)} from ${layout.name}`;
  } else {
    const data = `+${diff}%`;
    return `${chalk.green(data)} over ${layout.name}`;
  }
}
