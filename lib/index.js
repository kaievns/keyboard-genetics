"use strict";
const co                  = require("co");
const ui                  = require("./ui");
const { text, trigrams }  = require("./data");
const { measure }         = require("./runner");
const Population          = require("./population");
const { QWERTY, Workman } = require("./layout");

const data         = text;
const use_elites   = true;
const mutate_level = 3;
const seed_layouts = [QWERTY, Workman];

co(boot).catch(e => console.log(e.stack));

function *boot() {
  yield sleep(10); // waiting for the UI to pop up

  for (let i=0; i < seed_layouts.length; i++) {
    const score = yield grade_layout(seed_layouts[i]);
    yield sleep(10);
    ui.addResult(seed_layouts[i], score);
    yield sleep(10);
  }

  yield start(Population.random(), 300);
}

function *start(population, count) {
  let layout, score;

  for (let i=0; i < count; i++) {
    const result = yield handle(population);
    layout = result[0]; score = result[1];
    yield sleep(10);
    ui.addResult(layout, score);
    yield sleep(10);
    population = population.next({elite: use_elites, mutate: mutate_level});
  }

  yield sleep(10);
  ui.destroy();

  console.log(`Total: ${score.total}\n`);
  console.log(`${layout.config}`);
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
