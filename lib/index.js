import { text, docs, code, trigrams, bigrams } from "./data";
import chalk from "chalk";
import { run } from "./runner";
import Population from "./population";
import { QWERTY, Workman } from "./layout";

let data         = text;
let best_known   = Workman;
let best_score   = grade_layout(best_known);
let qwerty_score = grade_layout(QWERTY);
let population   = Population.random();
let populations  = 300;

for (let i=0; i < populations; i++) {
  console.log(chalk.magenta(`Generation: ${population.number}\n`));

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

  if (population.number < populations) {
    print_current(best_layout, score);
    population = population.next({elite: true, mutate: 3});
  } else {
    print_finals(best_layout, score);
    process.exit(0);
  }
}

function print_current(layout, score) {
  console.log(`\nBest layout ${chalk.red(layout.name)}, scored: ${chalk.yellow(humanize(score.total))}`);
  print_comparisons(score);
  console.log(chalk.blue(layout.toString()));
  print_fingers(score);
}

function print_finals(layout, score) {
  console.log(`\nBest layout ${chalk.red(layout.name)}, scored: ${chalk.yellow(humanize(score.total))}`);
  print_comparisons(score);
  console.log(chalk.blue(layout.config), "\n");
  print_fingers(score);
}

function print_comparisons(score) {
  console.log("Compare: ", chalk.grey(`${vs_known(score, best_known)}, ${vs_known(score, QWERTY)}\n`));
}

function print_fingers(score) {
  console.log(chalk.gray(`${score.fingers.join(" ")} - (${score.hands.join(" | ")})\n`));
}

function grade_layout(layout) {
  const text_stats     = run(layout, text);
  return text_stats;
  const trigrams_stats = run(layout, trigrams);

  return Object.assign({}, text_stats, {
    total: text_stats.total + trigrams_stats.total
  });
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
