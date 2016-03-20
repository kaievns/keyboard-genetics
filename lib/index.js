import * as ui from "./ui";
import { text, trigrams } from "./data";
import { measure } from "./runner";
import Population from "./population";
import { QWERTY, Workman } from "./layout";

let data         = text;
let use_elites   = true;
let mutate_level = 3;
let seed_layouts = [QWERTY, Workman];

boot().catch(err => console.log(err.stack));

async function boot() {
  await sleep(1000); // waiting for the UI to pop up

  for (let i=0; i < seed_layouts.length; i++) {
    let score = await grade_layout(seed_layouts[i]);
    ui.addResult(seed_layouts[i], score);
  }

  await start(Population.random(), 300);
}

async function start(population, count) {
  for (let i=0; i < count; i++) {
    const result = await handle(population);
    var [layout, score] = result;
    await sleep(10);
    ui.addResult(layout, score);
    await sleep(10);
    population = population.next({elite: use_elites, mutate: mutate_level});
  }

  console.log(`Total: ${score.total}\n`);
  console.log(`${layout.config}`);
}

async function handle(population) {
  ui.newPopulation(population, use_elites, mutate_level);

  for (let i=0; i<population.genomes.length; i++) {
    const layout = population.genomes[i].toLayout();
    const score = await grade_layout(layout);
    await sleep(10);
    ui.logGrade(layout, score);
    await sleep(10);
    population.scores[i] = score;
  }

  const best_gene = population.best();
  const best_layout = best_gene.toLayout();
  const score = population.scoreFor(best_gene);

  return [best_layout, score];
}

function grade_layout(layout) {
  return new Promise(resolve => {
    process.nextTick(() => {
      const text_stats = measure(layout, data);
      return resolve(text_stats);
      const trigrams_stats = measure(layout, trigrams);

      return resolve(Object.assign({}, text_stats, {
        total: text_stats.total + trigrams_stats.total
      }));
    });
  });
}

function sleep(timeout) {
  return new Promise(r => setTimeout(r, timeout));
}
