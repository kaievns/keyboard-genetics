import { text, docs, code, trigrams, bigrams } from "./data";
import chalk from "chalk";
import { run } from "./runner";
import Population from "./population";
import { QWERTY, Workman } from "./layout";

let data         = text;
let best_known   = Workman;
let best_score   = grade_layout(best_known).then(s => best_score = s);
let qwerty_score = grade_layout(QWERTY).then(s => qwerty_score = s);

start(Population.random(), 300)
  .catch(err => console.log(err.stack));

async function start(population, count) {
  for (let i=0; i < count; i++) {
    const result = await handle(population);
    var [layout, score] = result;
    print_current(layout, score);
    population = population.next({elite: true, mutate: 3})
  }

  print_finals(layout, score);
}

async function handle(population) {
  console.log(chalk.magenta(`Generation: ${population.number}\n`));

  for (let i=0; i<population.genomes.length; i++) {
    const layout = population.genomes[i].toLayout();
    const score = await grade_layout(layout);
    console.log(chalk.grey(`Finished: ${layout.name} ..... ${humanize(score.total)}`));
    population.scores[i] = score;
  }

  const best_gene = population.best();
  const best_layout = best_gene.toLayout();
  const score = population.scoreFor(best_gene);

  return [best_layout, score];
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
  return new Promise(resolve => {
    process.nextTick(() => {
      const text_stats     = run(layout, text);
      return resolve(text_stats);
      const trigrams_stats = run(layout, trigrams);

      return resolve(Object.assign({}, text_stats, {
        total: text_stats.total + trigrams_stats.total
      }));
    });
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
