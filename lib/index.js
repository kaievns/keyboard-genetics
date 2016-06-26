"use strict";
const co                  = require("co");
const ui                  = require("./ui");
const { text, trigrams, code }  = require("./data");
const { measure }         = require("./runner");
const Population          = require("./population");
const { QWERTY, Workman } = require("./layout");

const data         = code;
const use_elites   = true;
const mutate_level = 3;
const seed_layouts = [QWERTY, Workman];
const max_no_chage = 50;

co(boot).catch(e => console.log(e.stack));

function *boot() {
  yield sleep(10); // waiting for the UI to pop up

  for (let i=0; i < seed_layouts.length; i++) {
    const score = yield grade_layout(seed_layouts[i]);
    yield sleep(10);
    ui.addResult(seed_layouts[i], score);
    yield sleep(10);
  }

  yield start(Population.random(), 1000);
}

function *start(population, count) {
  let last_layout, last_score, no_changes_in;

  for (let i=0; i < count; i++) {
    const [layout, score] = yield handle(population);

    if (!last_layout || last_layout.toString() !== layout.toString()) {
      no_changes_in = 0;
    } else {
      no_changes_in ++;
    }

    yield sleep(10);
    ui.addResult(layout, score, no_changes_in, max_no_chage);
    last_layout = layout; last_score  = score;
    yield sleep(10);

    if (no_changes_in == max_no_chage) {
      break;
    }

    population = population.next({elite: use_elites, mutate: mutate_level});
  }

  yield sleep(10);
  ui.destroy();

  console.log(`Total: ${last_score.total}, Dist: ${last_score.position}\n`);
  console.log(last_layout.toString(), "\n");
  console.log(last_layout.config);
}

function *handle(population) {
  ui.newPopulation(population, use_elites, mutate_level);

  for (let i=0; i<population.genomes.length; i++) {
    const layout = population.genomes[i].toLayout();
    const score = yield grade_layout(layout);
    yield sleep(10);
    ui.logGrade(layout, score);
    yield sleep(10);
    population.scores[i] = score;
  }

  const best_gene = population.best();
  const best_layout = best_gene.toLayout();
  const score = population.scoreFor(best_gene);

  return [best_layout, score];
}

function *grade_layout(layout) {
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
